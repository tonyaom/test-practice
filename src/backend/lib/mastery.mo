import Map "mo:core/Map";
import Common "../types/common";
import MasteryTypes "../types/mastery";
import Nat "mo:core/Nat";
import TestTypes "../types/tests";
import ResultTypes "../types/results";
import AuthTypes "../types/auth";
import SectionTypes "../types/sections";

/// Domain logic for question mastery tracking:
/// record correct/wrong answers, mark mastered after 5 consecutive correct,
/// reset streaks on wrong answer, and bulk-reset mastery for a test or section.
module {
  public type MasteryMap = Map.Map<Text, MasteryTypes.QuestionMastery>;

  /// Composite key: "<userId>:<testId>:<questionId>"
  public func masteryKey(userId : Common.UserId, testId : Common.TestId, questionId : Common.QuestionId) : Text {
    userId # ":" # testId.toText() # ":" # questionId.toText();
  };

  /// Get existing mastery record or a fresh default.
  public func getOrDefault(
    mastery : MasteryMap,
    userId : Common.UserId,
    testId : Common.TestId,
    questionId : Common.QuestionId,
  ) : MasteryTypes.QuestionMastery {
    let key = masteryKey(userId, testId, questionId);
    switch (mastery.get(key)) {
      case (?m) { m };
      case null {
        {
          userId;
          testId;
          questionId;
          correctStreak = 0;
          isMastered = false;
          updatedAt = 0;
        }
      };
    };
  };

  /// Record a correct answer: increment streak; set isMastered when streak hits 5.
  public func recordCorrect(
    mastery : MasteryMap,
    userId : Common.UserId,
    testId : Common.TestId,
    questionId : Common.QuestionId,
    now : Common.Timestamp,
  ) : () {
    let key = masteryKey(userId, testId, questionId);
    let existing = getOrDefault(mastery, userId, testId, questionId);
    // Once mastered, skip further updates
    if (existing.isMastered) { return };
    let newStreak = existing.correctStreak + 1;
    let isMastered = newStreak >= 5;
    mastery.add(key, { existing with correctStreak = newStreak; isMastered; updatedAt = now });
  };

  /// Record a wrong answer: always reset streak to 0 and isMastered to false,
  /// even for previously mastered questions — they must earn 5 correct in a row again.
  public func recordWrong(
    mastery : MasteryMap,
    userId : Common.UserId,
    testId : Common.TestId,
    questionId : Common.QuestionId,
    now : Common.Timestamp,
  ) : () {
    let key = masteryKey(userId, testId, questionId);
    let existing = getOrDefault(mastery, userId, testId, questionId);
    mastery.add(key, { existing with correctStreak = 0; isMastered = false; updatedAt = now });
  };

  /// Reset all mastery streaks to 0 and isMastered = false for the given questionIds.
  public func resetMasterQuestion(
    mastery : MasteryMap,
    userId : Common.UserId,
    testId : Common.TestId,
    questionIds : [Common.QuestionId],
    now : Common.Timestamp,
  ) : () {
    for (questionId in questionIds.values()) {
      let key = masteryKey(userId, testId, questionId);
      let existing = getOrDefault(mastery, userId, testId, questionId);
      mastery.add(key, { existing with correctStreak = 0; isMastered = false; updatedAt = now });
    };
  };

  /// Return all QuestionMastery records for a given (userId, testId).
  public func listForUserTest(
    mastery : MasteryMap,
    userId : Common.UserId,
    testId : Common.TestId,
  ) : [MasteryTypes.QuestionMastery] {
    mastery.values().filter(
      func(m : MasteryTypes.QuestionMastery) : Bool {
        m.userId == userId and m.testId == testId
      }
    ).toArray();
  };

  /// Build a UserProgressInfo aggregate for backward compatibility.
  public func progressInfo(
    mastery : MasteryMap,
    userId : Common.UserId,
    testId : Common.TestId,
    totalQuestions : Nat,
  ) : MasteryTypes.UserProgressInfo {
    let records = listForUserTest(mastery, userId, testId);
    var masteredCount : Nat = 0;
    var inProgressCount : Nat = 0;
    for (m in records.values()) {
      if (m.isMastered) {
        masteredCount += 1;
      } else if (m.correctStreak > 0) {
        inProgressCount += 1;
      };
    };
    { username = userId; testId; totalQuestions; masteredCount; inProgressCount };
  };

  /// Sum time spent by a user on a specific test across all completed sessions.
  func timeForUserTest(
    testResults : Map.Map<Text, ResultTypes.TestResult>,
    userId : Common.UserId,
    testId : Common.TestId,
  ) : Nat {
    testResults.foldLeft(
      0,
      func(acc : Nat, _key : Text, r : ResultTypes.TestResult) : Nat {
        if (r.username == userId and r.testId == testId and r.completedAt != 0) {
          acc + r.timeSpentSeconds
        } else { acc };
      },
    );
  };

  /// Sum time spent by a user in a specific section, proportional to question count.
  func timeForUserSection(
    testResults : Map.Map<Text, ResultTypes.TestResult>,
    userId : Common.UserId,
    testId : Common.TestId,
    sectionId : Common.SectionId,
  ) : Nat {
    testResults.foldLeft(
      0,
      func(acc : Nat, _key : Text, r : ResultTypes.TestResult) : Nat {
        if (r.username == userId and r.testId == testId and r.completedAt != 0) {
          let sectionMatch = r.sectionResults.find(
            func(sr : ResultTypes.SectionResult) : Bool { sr.sectionId == sectionId }
          );
          switch (sectionMatch) {
            case null { acc };
            case (?sr) {
              let total = r.totalQuestions;
              if (total == 0) { acc }
              else {
                let share = (r.timeSpentSeconds * sr.totalQuestions) / total;
                acc + share;
              };
            };
          };
        } else { acc };
      },
    );
  };

  /// Build a detailed UserDetailedProgress with per-test and per-section mastery and time.
  public func detailedProgress(
    mastery : MasteryMap,
    testResults : Map.Map<Text, ResultTypes.TestResult>,
    tests : Map.Map<Nat, TestTypes.Test>,
    questions : Map.Map<Nat, TestTypes.Question>,
    sections : Map.Map<Nat, SectionTypes.Section>,
    userId : Common.UserId,
  ) : MasteryTypes.UserDetailedProgress {
    // Collect distinct testIds this user has interacted with
    let seenTests = Map.empty<Nat, Bool>();
    mastery.values().forEach(func(m : MasteryTypes.QuestionMastery) {
      if (m.userId == userId) { seenTests.add(m.testId, true) };
    });
    testResults.values().forEach(func(r : ResultTypes.TestResult) {
      if (r.username == userId and r.completedAt != 0) { seenTests.add(r.testId, true) };
    });

    var lifetimeSeconds : Nat = 0;

    let testInfoList = seenTests.keys().map(
      func(testId : Nat) : MasteryTypes.TestMasteryInfo {
        let testName = switch (tests.get(testId)) {
          case (?t) { t.name };
          case null { "Unknown" };
        };
        // All questions in this test
        let testQs = questions.values().filter(
          func(q : TestTypes.Question) : Bool { q.testId == testId }
        ).toArray();
        let totalQuestions = testQs.size();
        // Mastery records for this user+test
        let masteryRecords = listForUserTest(mastery, userId, testId);
        var masteredCount : Nat = 0;
        var inProgressCount : Nat = 0;
        for (m in masteryRecords.values()) {
          if (m.isMastered) { masteredCount += 1 }
          else if (m.correctStreak > 0) { inProgressCount += 1 };
        };
        let isTestMastered = totalQuestions > 0 and masteredCount >= totalQuestions;
        let testSeconds = timeForUserTest(testResults, userId, testId);
        lifetimeSeconds += testSeconds;

        // Collect distinct sectionIds for this test (from questions and past results)
        let seenSections = Map.empty<Nat, Bool>();
        for (q in testQs.values()) {
          switch (q.sectionId) {
            case (?sid) { seenSections.add(sid, true) };
            case null {};
          };
        };
        testResults.values().forEach(func(r : ResultTypes.TestResult) {
          if (r.username == userId and r.testId == testId) {
            for (sr in r.sectionResults.values()) {
              seenSections.add(sr.sectionId, true);
            };
          };
        });

        let sectionInfos = seenSections.keys().map(
          func(sid : Nat) : MasteryTypes.SectionMasteryInfo {
            let sectionName = switch (sections.get(sid)) {
              case (?s) { s.name };
              case null { "Unknown" };
            };
            let sectionQIds = testQs.filter(
              func(q : TestTypes.Question) : Bool { q.sectionId == ?sid }
            );
            let totalInSection = sectionQIds.size();
            var secMastered : Nat = 0;
            for (q in sectionQIds.values()) {
              let key = masteryKey(userId, testId, q.id);
              switch (mastery.get(key)) {
                case (?m) { if (m.isMastered) { secMastered += 1 } };
                case null {};
              };
            };
            let isSectionMastered = totalInSection > 0 and secMastered >= totalInSection;
            let sectionSeconds = timeForUserSection(testResults, userId, testId, sid);
            {
              sectionId = sid;
              sectionName;
              isSectionMastered;
              masteredCount = secMastered;
              totalInSection;
              timeSpentSeconds = sectionSeconds;
            };
          }
        ).toArray();

        {
          testId;
          testName;
          isTestMastered;
          masteredCount;
          totalQuestions;
          inProgressCount;
          timeSpentSeconds = testSeconds;
          sections = sectionInfos;
        };
      }
    ).toArray();

    { username = userId; lifetimeTimeSpentSeconds = lifetimeSeconds; tests = testInfoList };
  };

  /// Compute aggregate platform-wide statistics for the admin dashboard.
  public func adminDashboardStats(
    tests : Map.Map<Nat, TestTypes.Test>,
    questions : Map.Map<Nat, TestTypes.Question>,
    users : Map.Map<Text, AuthTypes.UserRecord>,
    testResults : Map.Map<Text, ResultTypes.TestResult>,
    mastery : MasteryMap,
  ) : MasteryTypes.AdminDashboardStats {
    let totalTests = tests.size();
    let totalQuestions = questions.size();
    var totalActiveUsers : Nat = 0;
    var totalDeactivatedUsers : Nat = 0;
    users.values().forEach(func(u : AuthTypes.UserRecord) {
      if (u.isActive) { totalActiveUsers += 1 } else { totalDeactivatedUsers += 1 };
    });
    let totalUsers = totalActiveUsers + totalDeactivatedUsers;
    var totalMasteredQuestions : Nat = 0;
    var totalMasteryRecords : Nat = 0;
    mastery.values().forEach(func(m : MasteryTypes.QuestionMastery) {
      totalMasteryRecords += 1;
      if (m.isMastered) { totalMasteredQuestions += 1 };
    });
    // Count completed sessions per test
    let sessionCounts = Map.empty<Nat, Nat>();
    testResults.values().forEach(func(r : ResultTypes.TestResult) {
      if (r.completedAt != 0) {
        let prev = switch (sessionCounts.get(r.testId)) {
          case (?n) { n };
          case null { 0 };
        };
        sessionCounts.add(r.testId, prev + 1);
      };
    });
    // Top-3 tests by session count, descending
    let sorted = sessionCounts.entries().toArray().sort(
      func(a : (Nat, Nat), b : (Nat, Nat)) : { #less; #equal; #greater } {
        Nat.compare(b.1, a.1);
      }
    );
    let top3 = sorted.values().take(3).toArray();
    let topTests : [MasteryTypes.TopTestInfo] = top3.map<(Nat, Nat), MasteryTypes.TopTestInfo>(
      func(e : (Nat, Nat)) : MasteryTypes.TopTestInfo {
        let tName = switch (tests.get(e.0)) {
          case (?t) { t.name };
          case null { "Unknown" };
        };
        { testId = e.0; testName = tName; sessionCount = e.1 };
      }
    );
    {
      totalTests;
      totalQuestions;
      totalUsers;
      totalActiveUsers;
      totalDeactivatedUsers;
      totalMasteredQuestions;
      totalMasteryRecords;
      topTests;
    };
  };
};
