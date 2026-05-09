import Map "mo:core/Map";
import TestTypes "../types/tests";
import ResultTypes "../types/results";
import ResultLib "../lib/results";
import SectionTypes "../types/sections";
import Time "mo:core/Time";
import MasteryTypes "../types/mastery";
import MasteryLib "../lib/mastery";
import Debug "mo:core/Debug";

// ══════════════════════════════════════════════════════════════════════════════
// Results API mixin — public surface for test submission and progress tracking.
// USER-FACING operations: submitTestAnswers, getTestResultBySession, getTestResult,
//                         listActiveTestSessions, saveTestProgress, getTestProgress
// No admin-only operations in this mixin.
// Delegates all business logic to ResultLib. No inline domain logic.
// ══════════════════════════════════════════════════════════════════════════════

mixin (
  questions : Map.Map<Nat, TestTypes.Question>,
  sections : Map.Map<Nat, SectionTypes.Section>,
  testResults : Map.Map<Text, ResultTypes.TestResult>,
  testProgress : Map.Map<Text, ResultTypes.TestProgress>,
  mastery : Map.Map<Text, MasteryTypes.QuestionMastery>,
) {
  let maxConcurrentSessions : Nat = 5;

  // ── Helpers — delegated to ResultLib ───────────────────────────────────────

  func resultKey(username : Text, testId : Nat, sessionId : Text) : Text {
    ResultLib.resultKey(username, testId, sessionId);
  };

  func progressKey(username : Text, testId : Nat, sessionId : Text) : Text {
    ResultLib.progressKey(username, testId, sessionId);
  };

  // ── Public API ─────────────────────────────────────────────────────────

  /// Return the user's last 50 completed TestResults sorted by completedAt descending.
  public query func listMyTestResults(username : Text) : async [ResultTypes.TestResult] {
    ResultLib.listForUser(testResults, username, 50);
  };

  /// Submit all answers for a test session and receive the graded result.
  /// sessionId must be unique per concurrent attempt (e.g. a UUID from the client).
  public shared func submitTestAnswers(
    username : Text,
    testId : Nat,
    sessionId : Text,
    submissions : [ResultTypes.AnswerSubmission],
    timeSpentSeconds : Nat,
  ) : async ResultTypes.TestResult {
    let key = resultKey(username, testId, sessionId);
    // If this session already exists and is completed, reject re-submission
    switch (testResults.get(key)) {
      case (?existing) {
        if (existing.completedAt != 0) {
          return existing; // idempotent: already graded
        };
      };
      case null {
        // New session — enforce the concurrent session cap
        let uncompleted = ResultLib.countUncompletedSessions(testResults, username);
        if (uncompleted >= maxConcurrentSessions) {
          return {
            testId;
            username;
            sessionId;
            score = 0;
            totalQuestions = 0;
            questionResults = [];
            sectionResults = [];
            completedAt = 0; // 0 signals error/rejection to client
            timeSpentSeconds = 0;
          };
        };
      };
    };
    // Retrieve selectedSectionIds from progress if available
    let selectedSectionIds : [Nat] = switch (testProgress.get(progressKey(username, testId, sessionId))) {
      case (?p) { p.selectedSectionIds };
      case null { [] };
    };
    let result = ResultLib.gradeTestWithSession(questions, sections, testId, username, sessionId, selectedSectionIds, submissions, timeSpentSeconds);
    testResults.add(key, result);
    // Update mastery for each graded question
    let now = Time.now();
    for (qr in result.questionResults.values()) {
      if (qr.isCorrect) {
        MasteryLib.recordCorrect(mastery, username, testId, qr.questionId, now);
      } else {
        MasteryLib.recordWrong(mastery, username, testId, qr.questionId, now);
      };
    };
    // Clean up in-progress save for this session
    testProgress.remove(progressKey(username, testId, sessionId));
    result;
  };

  /// Retrieve a specific session's result.
  public query func getTestResultBySession(
    username : Text,
    testId : Nat,
    sessionId : Text,
  ) : async ?ResultTypes.TestResult {
    testResults.get(resultKey(username, testId, sessionId));
  };

  /// Backward-compatible: returns the most recently stored result for this user+test (any session).
  public query func getTestResult(username : Text, testId : Nat) : async ?ResultTypes.TestResult {
    // Prefix all keys for this user+test and pick the one with the largest completedAt
    let prefix = username # ":" # debug_show(testId) # ":";
    var best : ?ResultTypes.TestResult = null;
    testResults.forEach(func(key : Text, result : ResultTypes.TestResult) {
      if (key.startsWith(#text prefix)) {
        switch (best) {
          case null { best := ?result };
          case (?b) {
            if (result.completedAt > b.completedAt) { best := ?result };
          };
        };
      };
    });
    best;
  };

  /// List all sessions (in-progress and completed) for this user.
  public query func listActiveTestSessions(username : Text) : async [ResultTypes.SessionInfo] {
    let infos = testResults.foldLeft(
      [] : [ResultTypes.SessionInfo],
      func(acc : [ResultTypes.SessionInfo], _key : Text, result : ResultTypes.TestResult) : [ResultTypes.SessionInfo] {
        if (result.username == username) {
          let info : ResultTypes.SessionInfo = {
            testId = result.testId;
            sessionId = result.sessionId;
            completed = result.completedAt != 0;
          };
          acc.concat([info]);
        } else { acc };
      },
    );
    infos;
  };

  /// Save in-progress answers so the user can resume after a page refresh.
  public shared func saveTestProgress(
    username : Text,
    testId : Nat,
    sessionId : Text,
    answers : [ResultTypes.AnswerSubmission],
  ) : async () {
    ResultLib.saveProgress(testResults, testProgress, username, testId, sessionId, answers, []);
  };

  /// Retrieve saved in-progress answers for a session.
  public query func getTestProgress(
    username : Text,
    testId : Nat,
    sessionId : Text,
  ) : async ?ResultTypes.TestProgress {
    testProgress.get(progressKey(username, testId, sessionId));
  };

  /// Return the full review data for a completed test session:
  /// every question, the user's answer, the correct answer, whether it was
  /// right, an optional explanation, per-section scores, and the total score.
  public query func getTestReview(
    username : Text,
    testId : Nat,
    sessionId : Text,
  ) : async ?ResultTypes.ReviewData {
    ResultLib.buildReview(questions, sections, testResults, username, testId, sessionId);
  };
};
