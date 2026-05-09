import Map "mo:core/Map";
import MasteryLib "../lib/mastery";
import MasteryTypes "../types/mastery";
import TestTypes "../types/tests";
import ResultTypes "../types/results";
import SectionTypes "../types/sections";
import Common "../types/common";
import Debug "mo:core/Debug";

// ══════════════════════════════════════════════════════════════════════════════
// Unit tests for MasteryLib
// ══════════════════════════════════════════════════════════════════════════════

let passed = { var value : Nat = 0 };
let failed = { var value : Nat = 0 };

func ok(testName : Text, cond : Bool) {
  if (cond) {
    Debug.print("  PASS  " # testName);
    passed.value += 1;
  } else {
    Debug.print("  FAIL  " # testName);
    failed.value += 1;
  };
};

// ── Helpers ──────────────────────────────────────────────────────────────────

func emptyMastery() : MasteryLib.MasteryMap { Map.empty<Text, MasteryTypes.QuestionMastery>() };

func emptyResults() : Map.Map<Text, ResultTypes.TestResult> { Map.empty<Text, ResultTypes.TestResult>() };

func emptyTests() : Map.Map<Nat, TestTypes.Test> { Map.empty<Nat, TestTypes.Test>() };

func emptyQuestions() : Map.Map<Nat, TestTypes.Question> { Map.empty<Nat, TestTypes.Question>() };

func emptySections() : Map.Map<Nat, SectionTypes.Section> { Map.empty<Nat, SectionTypes.Section>() };

func makeQuestion(id : Nat, testId : Nat, sectionId : ?Nat) : TestTypes.Question {
  {
    id;
    testId;
    sectionId;
    text = "Q" # debug_show(id);
    questionType = #mcSingle;
    options = ["a", "b"];
    correctAnswers = [0];
    correctOrder = [];
    correctText = "";
    imageBlob = null;
    explanation = null;
    orderIndex = 0;
    questionUpdatedAt = 0;
    audioUrl = null;
    audioBlob = null;
    audioDownloadStatus = null;
  };
};

func makeResult(username : Text, testId : Nat, sessionId : Text, sectionIds : [Nat], timeSpent : Nat) : ResultTypes.TestResult {
  {
    testId;
    username;
    sessionId;
    score = 1;
    totalQuestions = 2;
    questionResults = [];
    sectionResults = sectionIds.map<Nat, ResultTypes.SectionResult>(
      func(sid) : ResultTypes.SectionResult {
        { sectionId = sid; sectionName = "S" # debug_show(sid); score = 1; totalQuestions = 1 };
      }
    );
    completedAt = 1000;
    timeSpentSeconds = timeSpent;
  };
};

// ── recordCorrect ─────────────────────────────────────────────────────────────
Debug.print("recordCorrect:");

do {
  let m = emptyMastery();
  MasteryLib.recordCorrect(m, "alice", 1, 1, 100);
  let q = MasteryLib.getOrDefault(m, "alice", 1, 1);
  ok("first correct increments streak to 1", q.correctStreak == 1);
  ok("not mastered after 1", not q.isMastered);
};

do {
  let m = emptyMastery();
  for (_ in [1, 2, 3, 4].values()) {
    MasteryLib.recordCorrect(m, "alice", 1, 1, 100);
  };
  let q = MasteryLib.getOrDefault(m, "alice", 1, 1);
  ok("not mastered after 4", not q.isMastered);
  ok("streak is 4 after 4 correct", q.correctStreak == 4);
};

do {
  let m = emptyMastery();
  for (_ in [1, 2, 3, 4, 5].values()) {
    MasteryLib.recordCorrect(m, "alice", 1, 1, 100);
  };
  let q = MasteryLib.getOrDefault(m, "alice", 1, 1);
  ok("mastered after 5 consecutive correct", q.isMastered);
  ok("streak is 5 after mastery", q.correctStreak == 5);
};

do {
  // recordCorrect on already-mastered question should be a no-op
  let m = emptyMastery();
  for (_ in [1, 2, 3, 4, 5].values()) {
    MasteryLib.recordCorrect(m, "alice", 1, 1, 100);
  };
  MasteryLib.recordCorrect(m, "alice", 1, 1, 200);
  let q = MasteryLib.getOrDefault(m, "alice", 1, 1);
  ok("extra correct after mastery is no-op (still mastered)", q.isMastered);
  ok("streak unchanged after extra correct post-mastery", q.correctStreak == 5);
};

// ── recordWrong ───────────────────────────────────────────────────────────────
Debug.print("recordWrong:");

do {
  let m = emptyMastery();
  MasteryLib.recordCorrect(m, "alice", 1, 1, 100);
  MasteryLib.recordCorrect(m, "alice", 1, 1, 100);
  MasteryLib.recordWrong(m, "alice", 1, 1, 200);
  let q = MasteryLib.getOrDefault(m, "alice", 1, 1);
  ok("wrong after 2 correct resets streak to 0", q.correctStreak == 0);
  ok("isMastered is false after wrong answer", not q.isMastered);
};

do {
  // Critical: wrong answer on mastered question must reset mastery
  let m = emptyMastery();
  for (_ in [1, 2, 3, 4, 5].values()) {
    MasteryLib.recordCorrect(m, "alice", 1, 1, 100);
  };
  let before = MasteryLib.getOrDefault(m, "alice", 1, 1);
  ok("setup: question is mastered before wrong", before.isMastered);
  MasteryLib.recordWrong(m, "alice", 1, 1, 200);
  let q = MasteryLib.getOrDefault(m, "alice", 1, 1);
  ok("wrong on mastered question resets streak to 0", q.correctStreak == 0);
  ok("wrong on mastered question sets isMastered=false", not q.isMastered);
};

do {
  // After reset, need 5 more correct to re-achieve mastery
  let m = emptyMastery();
  for (_ in [1, 2, 3, 4, 5].values()) {
    MasteryLib.recordCorrect(m, "alice", 1, 1, 100);
  };
  MasteryLib.recordWrong(m, "alice", 1, 1, 200);
  for (_ in [1, 2, 3, 4].values()) {
    MasteryLib.recordCorrect(m, "alice", 1, 1, 300);
  };
  let q4 = MasteryLib.getOrDefault(m, "alice", 1, 1);
  ok("not re-mastered after only 4 correct post-wrong", not q4.isMastered);
  MasteryLib.recordCorrect(m, "alice", 1, 1, 400);
  let q5 = MasteryLib.getOrDefault(m, "alice", 1, 1);
  ok("re-mastered after 5 correct post-wrong", q5.isMastered);
};

// ── resetMasterQuestion ───────────────────────────────────────────────────────
Debug.print("resetMasterQuestion:");

do {
  let m = emptyMastery();
  for (_ in [1, 2, 3, 4, 5].values()) {
    MasteryLib.recordCorrect(m, "alice", 1, 1, 100);
    MasteryLib.recordCorrect(m, "alice", 1, 2, 100);
  };
  MasteryLib.resetMasterQuestion(m, "alice", 1, [1, 2], 200);
  let q1 = MasteryLib.getOrDefault(m, "alice", 1, 1);
  let q2 = MasteryLib.getOrDefault(m, "alice", 1, 2);
  ok("reset: question 1 streak = 0", q1.correctStreak == 0);
  ok("reset: question 1 isMastered = false", not q1.isMastered);
  ok("reset: question 2 streak = 0", q2.correctStreak == 0);
  ok("reset: question 2 isMastered = false", not q2.isMastered);
};

// ── progressInfo ──────────────────────────────────────────────────────────────
Debug.print("progressInfo:");

do {
  let m = emptyMastery();
  // Master q1, in-progress q2, untouched q3
  for (_ in [1, 2, 3, 4, 5].values()) { MasteryLib.recordCorrect(m, "alice", 1, 1, 100) };
  MasteryLib.recordCorrect(m, "alice", 1, 2, 100);
  let info = MasteryLib.progressInfo(m, "alice", 1, 3);
  ok("progressInfo: masteredCount = 1", info.masteredCount == 1);
  ok("progressInfo: inProgressCount = 1", info.inProgressCount == 1);
  ok("progressInfo: totalQuestions = 3", info.totalQuestions == 3);
};

// ── detailedProgress: mastery per test and section ────────────────────────────
Debug.print("detailedProgress mastery:");

do {
  let m = emptyMastery();
  let results = emptyResults();
  let tests = emptyTests();
  let qs = emptyQuestions();
  let secs = emptySections();

  // Add a test and its questions
  tests.add(1, { id = 1; name = "Test1"; description = ""; createdAt = 0; updatedAt = 0 });
  secs.add(10, { id = 10; testId = 1; name = "SecA"; description = ""; createdAt = 0; updatedAt = 0 });
  qs.add(1, makeQuestion(1, 1, ?10));
  qs.add(2, makeQuestion(2, 1, ?10));

  // Master both questions
  for (_ in [1, 2, 3, 4, 5].values()) {
    MasteryLib.recordCorrect(m, "alice", 1, 1, 100);
    MasteryLib.recordCorrect(m, "alice", 1, 2, 100);
  };

  let dp = MasteryLib.detailedProgress(m, results, tests, qs, secs, "alice");
  ok("detailedProgress: 1 test", dp.tests.size() == 1);
  let ti = dp.tests[0];
  ok("test isTestMastered = true when all questions mastered", ti.isTestMastered);
  ok("test masteredCount = 2", ti.masteredCount == 2);
  ok("test totalQuestions = 2", ti.totalQuestions == 2);
  ok("test sections size = 1", ti.sections.size() == 1);
  let si = ti.sections[0];
  ok("section isSectionMastered = true when all questions mastered", si.isSectionMastered);
  ok("section masteredCount = 2", si.masteredCount == 2);
  ok("section totalInSection = 2", si.totalInSection == 2);
};

do {
  let m = emptyMastery();
  let results = emptyResults();
  let tests = emptyTests();
  let qs = emptyQuestions();
  let secs = emptySections();

  tests.add(1, { id = 1; name = "Test1"; description = ""; createdAt = 0; updatedAt = 0 });
  secs.add(10, { id = 10; testId = 1; name = "SecA"; description = ""; createdAt = 0; updatedAt = 0 });
  qs.add(1, makeQuestion(1, 1, ?10));
  qs.add(2, makeQuestion(2, 1, ?10));

  // Only master q1, not q2
  for (_ in [1, 2, 3, 4, 5].values()) { MasteryLib.recordCorrect(m, "alice", 1, 1, 100) };
  MasteryLib.recordCorrect(m, "alice", 1, 2, 100); // only 1 correct

  let dp = MasteryLib.detailedProgress(m, results, tests, qs, secs, "alice");
  let ti = dp.tests[0];
  ok("test NOT mastered when only some questions mastered", not ti.isTestMastered);
  let si = ti.sections[0];
  ok("section NOT mastered when only some questions mastered", not si.isSectionMastered);
};

// ── detailedProgress: time tracking ──────────────────────────────────────────
Debug.print("detailedProgress time tracking:");

do {
  let m = emptyMastery();
  let results = Map.empty<Text, ResultTypes.TestResult>();
  let tests = emptyTests();
  let qs = emptyQuestions();
  let secs = emptySections();

  tests.add(1, { id = 1; name = "Test1"; description = ""; createdAt = 0; updatedAt = 0 });
  secs.add(10, { id = 10; testId = 1; name = "SecA"; description = ""; createdAt = 0; updatedAt = 0 });
  qs.add(1, makeQuestion(1, 1, ?10));

  // Two completed sessions with time
  results.add("alice:1:s1", makeResult("alice", 1, "s1", [10], 120));
  results.add("alice:1:s2", makeResult("alice", 1, "s2", [10], 80));
  // Trigger mastery tracking so alice's test appears
  MasteryLib.recordCorrect(m, "alice", 1, 1, 100);

  let dp = MasteryLib.detailedProgress(m, results, tests, qs, secs, "alice");
  ok("lifetimeTimeSpentSeconds = 200 (120+80)", dp.lifetimeTimeSpentSeconds == 200);
  let ti = dp.tests[0];
  ok("test timeSpentSeconds = 200 (120+80)", ti.timeSpentSeconds == 200);
  // Section gets proportional time: both results have 2 total questions, 1 section question
  // share per result = timeSpent * sectionQs / totalQs = 120*1/2 + 80*1/2 = 60+40 = 100
  ok("section timeSpentSeconds = 100 (proportional)", ti.sections.size() == 1 and ti.sections[0].timeSpentSeconds == 100);
};

do {
  // Users not seen in mastery or results return no tests
  let m = emptyMastery();
  let results = emptyResults();
  let tests = emptyTests();
  let qs = emptyQuestions();
  let secs = emptySections();
  let dp = MasteryLib.detailedProgress(m, results, tests, qs, secs, "nobody");
  ok("unknown user: 0 tests", dp.tests.size() == 0);
  ok("unknown user: lifetime = 0", dp.lifetimeTimeSpentSeconds == 0);
};

// ── Summary ───────────────────────────────────────────────────────────────────
Debug.print("");
Debug.print("Results: " # debug_show(passed.value) # " passed, " # debug_show(failed.value) # " failed");
assert failed.value == 0;
