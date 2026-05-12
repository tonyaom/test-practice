import Map "mo:core/Map";
import ResultLib "../lib/results";
import ResultTypes "../types/results";
import TestTypes "../types/tests";
import SectionTypes "../types/sections";
import Debug "mo:core/Debug";
import Time "mo:core/Time";

// ════════════════════════════════════════════════════════════════════════════
// Unit tests for ResultLib and results domain logic
// ════════════════════════════════════════════════════════════════════════════

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

// ── Helpers ────────────────────────────────────────────────────────────────────────────

func emptyQuestions() : Map.Map<Nat, TestTypes.Question> {
  Map.empty<Nat, TestTypes.Question>()
};

func emptySections() : Map.Map<Nat, SectionTypes.Section> {
  Map.empty<Nat, SectionTypes.Section>()
};

func emptyTestResults() : Map.Map<Text, ResultTypes.TestResult> {
  Map.empty<Text, ResultTypes.TestResult>()
};

func emptyTestProgress() : Map.Map<Text, ResultTypes.TestProgress> {
  Map.empty<Text, ResultTypes.TestProgress>()
};

/// Build a minimal MCQ-single question for use in tests.
func makeMCQQuestion(
  id : Nat,
  testId : Nat,
  options : [Text],
  correctAnswerIndex : Nat,
  sectionId : ?Nat,
) : TestTypes.Question {
  {
    id;
    testId;
    text = "Question " # debug_show(id);
    questionType = #mcSingle;
    options;
    correctAnswers = [correctAnswerIndex];
    correctOrder = [];
    correctText = "";
    imageBlob = null;
    audioUrl = null;
    sectionId;
    explanation = null;
    orderIndex = 0;
    questionUpdatedAt = Time.now();
  }
};

/// Build a minimal text-input question.
func makeTextQuestion(
  id : Nat,
  testId : Nat,
  correctText : Text,
  sectionId : ?Nat,
) : TestTypes.Question {
  {
    id;
    testId;
    text = "Text Q " # debug_show(id);
    questionType = #textInput;
    options = [];
    correctAnswers = [];
    correctOrder = [];
    correctText;
    imageBlob = null;
    audioUrl = null;
    sectionId;
    explanation = null;
    orderIndex = 0;
    questionUpdatedAt = Time.now();
  }
};

/// Build a drag-order question.
func makeDragQuestion(
  id : Nat,
  testId : Nat,
  correctOrder : [Nat],
  sectionId : ?Nat,
) : TestTypes.Question {
  {
    id;
    testId;
    text = "Drag Q " # debug_show(id);
    questionType = #dragOrder;
    options = ["A", "B", "C"];
    correctAnswers = [];
    correctOrder;
    correctText = "";
    imageBlob = null;
    audioUrl = null;
    sectionId;
    explanation = null;
    orderIndex = 0;
    questionUpdatedAt = Time.now();
  }
};

/// Convenience: MCQ single submission
func mcqSub(questionId : Nat, selectedIndex : Nat) : ResultTypes.AnswerSubmission {
  { questionId; selectedOptions = [selectedIndex]; textAnswer = ""; orderedItems = [] }
};

/// Convenience: text submission
func textSub(questionId : Nat, answer : Text) : ResultTypes.AnswerSubmission {
  { questionId; selectedOptions = []; textAnswer = answer; orderedItems = [] }
};

/// Convenience: drag submission
func dragSub(questionId : Nat, order : [Nat]) : ResultTypes.AnswerSubmission {
  { questionId; selectedOptions = []; textAnswer = ""; orderedItems = order }
};

// ── evaluateAnswer: #mcSingle ──────────────────────────────────────────────────────────────
Debug.print("evaluateAnswer #mcSingle:");

do {
  let q = makeMCQQuestion(1, 1, ["A", "B", "C"], 0, null);
  ok("mcSingle: correct option 0 returns true",
    ResultLib.evaluateAnswer(q, mcqSub(1, 0)));
  ok("mcSingle: wrong option 1 returns false",
    not ResultLib.evaluateAnswer(q, mcqSub(1, 1)));
  ok("mcSingle: wrong option 2 returns false",
    not ResultLib.evaluateAnswer(q, mcqSub(1, 2)));
};

do {
  // No selections returns false
  let q = makeMCQQuestion(1, 1, ["A", "B"], 0, null);
  let sub : ResultTypes.AnswerSubmission = { questionId = 1; selectedOptions = []; textAnswer = ""; orderedItems = [] };
  ok("mcSingle: empty selectedOptions returns false",
    not ResultLib.evaluateAnswer(q, sub));
};

do {
  // Multiple selections returns false (mcSingle expects exactly 1)
  let q = makeMCQQuestion(1, 1, ["A", "B"], 0, null);
  let sub : ResultTypes.AnswerSubmission = { questionId = 1; selectedOptions = [0, 1]; textAnswer = ""; orderedItems = [] };
  ok("mcSingle: multiple selectedOptions returns false",
    not ResultLib.evaluateAnswer(q, sub));
};

// ── evaluateAnswer: #mcMulti ──────────────────────────────────────────────────────────────
Debug.print("evaluateAnswer #mcMulti:");

do {
  let q : TestTypes.Question = {
    id = 1; testId = 1;
    text = "Multi Q";
    questionType = #mcMulti;
    options = ["A", "B", "C", "D"];
    correctAnswers = [0, 2];
    correctOrder = []; correctText = "";
    imageBlob = null; audioUrl = null;
    sectionId = null; explanation = null; orderIndex = 0;
    questionUpdatedAt = Time.now();
  };
  let correctSub : ResultTypes.AnswerSubmission = { questionId = 1; selectedOptions = [0, 2]; textAnswer = ""; orderedItems = [] };
  let partialSub : ResultTypes.AnswerSubmission = { questionId = 1; selectedOptions = [0]; textAnswer = ""; orderedItems = [] };
  let extraSub : ResultTypes.AnswerSubmission = { questionId = 1; selectedOptions = [0, 1, 2]; textAnswer = ""; orderedItems = [] };
  ok("mcMulti: exactly correct options returns true",
    ResultLib.evaluateAnswer(q, correctSub));
  ok("mcMulti: partial selection returns false",
    not ResultLib.evaluateAnswer(q, partialSub));
  ok("mcMulti: extra option returns false",
    not ResultLib.evaluateAnswer(q, extraSub));
};

// ── evaluateAnswer: #textInput ───────────────────────────────────────────────────────────
Debug.print("evaluateAnswer #textInput:");

do {
  let q = makeTextQuestion(2, 1, "Paris", null);
  ok("textInput: exact match returns true",
    ResultLib.evaluateAnswer(q, textSub(2, "Paris")));
  ok("textInput: case-insensitive match returns true",
    ResultLib.evaluateAnswer(q, textSub(2, "paris")));
  ok("textInput: UPPERCASE match returns true",
    ResultLib.evaluateAnswer(q, textSub(2, "PARIS")));
  ok("textInput: wrong answer returns false",
    not ResultLib.evaluateAnswer(q, textSub(2, "London")));
  ok("textInput: empty answer returns false",
    not ResultLib.evaluateAnswer(q, textSub(2, "")));
};

// ── evaluateAnswer: #dragOrder ───────────────────────────────────────────────────────────
Debug.print("evaluateAnswer #dragOrder:");

do {
  let q = makeDragQuestion(3, 1, [0, 1, 2], null);
  ok("dragOrder: exact order returns true",
    ResultLib.evaluateAnswer(q, dragSub(3, [0, 1, 2])));
  ok("dragOrder: reversed order returns false",
    not ResultLib.evaluateAnswer(q, dragSub(3, [2, 1, 0])));
  ok("dragOrder: partial order returns false",
    not ResultLib.evaluateAnswer(q, dragSub(3, [0, 1])));
  ok("dragOrder: empty order returns false",
    not ResultLib.evaluateAnswer(q, dragSub(3, [])));
};

// ── resultKey / progressKey ───────────────────────────────────────────────────────────────
Debug.print("resultKey / progressKey:");

do {
  let k1 = ResultLib.resultKey("alice", 1, "sess1");
  let k2 = ResultLib.resultKey("alice", 1, "sess2");
  let k3 = ResultLib.resultKey("alice", 2, "sess1");
  let k4 = ResultLib.resultKey("bob", 1, "sess1");
  ok("resultKey: same inputs produce same key",
    ResultLib.resultKey("alice", 1, "sess1") == k1);
  ok("resultKey: different sessionId produces different key", k1 != k2);
  ok("resultKey: different testId produces different key", k1 != k3);
  ok("resultKey: different username produces different key", k1 != k4);
};

do {
  let pk = ResultLib.progressKey("alice", 1, "sess1");
  let rk = ResultLib.resultKey("alice", 1, "sess1");
  ok("progressKey: different from resultKey for same inputs", pk != rk);
  ok("progressKey: same inputs produce same key",
    ResultLib.progressKey("alice", 1, "sess1") == pk);
};

// ── gradeTestWithSession: basic scoring ────────────────────────────────────────────
Debug.print("gradeTestWithSession:");

do {
  // All correct — score = total
  let qs = emptyQuestions();
  let secs = emptySections();
  qs.add(1, makeMCQQuestion(1, 10, ["A", "B"], 0, null));
  qs.add(2, makeMCQQuestion(2, 10, ["A", "B"], 1, null));
  let subs = [mcqSub(1, 0), mcqSub(2, 1)];
  let result = ResultLib.gradeTestWithSession(qs, secs, 10, "alice", "sess1", [], subs, 60);
  ok("gradeTestWithSession: score = 2 when all correct", result.score == 2);
  ok("gradeTestWithSession: totalQuestions = 2", result.totalQuestions == 2);
  ok("gradeTestWithSession: username stored", result.username == "alice");
  ok("gradeTestWithSession: testId stored", result.testId == 10);
  ok("gradeTestWithSession: sessionId stored", result.sessionId == "sess1");
  ok("gradeTestWithSession: timeSpentSeconds stored", result.timeSpentSeconds == 60);
  ok("gradeTestWithSession: completedAt non-zero", result.completedAt != 0);
  ok("gradeTestWithSession: questionResults has 2 entries", result.questionResults.size() == 2);
};

do {
  // All wrong — score = 0
  let qs = emptyQuestions();
  let secs = emptySections();
  qs.add(1, makeMCQQuestion(1, 10, ["A", "B"], 0, null));
  qs.add(2, makeMCQQuestion(2, 10, ["A", "B"], 1, null));
  let subs = [mcqSub(1, 1), mcqSub(2, 0)]; // both wrong
  let result = ResultLib.gradeTestWithSession(qs, secs, 10, "alice", "sess2", [], subs, 30);
  ok("gradeTestWithSession: score = 0 when all wrong", result.score == 0);
  ok("gradeTestWithSession: totalQuestions = 2", result.totalQuestions == 2);
  ok("gradeTestWithSession: questionResults[0].isCorrect = false",
    not result.questionResults[0].isCorrect);
  ok("gradeTestWithSession: questionResults[1].isCorrect = false",
    not result.questionResults[1].isCorrect);
};

do {
  // Mixed results — score = 1
  let qs = emptyQuestions();
  let secs = emptySections();
  qs.add(1, makeMCQQuestion(1, 10, ["A", "B"], 0, null));
  qs.add(2, makeMCQQuestion(2, 10, ["A", "B"], 1, null));
  qs.add(3, makeTextQuestion(3, 10, "Paris", null));
  let subs = [mcqSub(1, 0), mcqSub(2, 0), textSub(3, "london")]; // 1 correct, 2 wrong
  let result = ResultLib.gradeTestWithSession(qs, secs, 10, "alice", "sess3", [], subs, 45);
  ok("gradeTestWithSession: score = 1 for mixed", result.score == 1);
  ok("gradeTestWithSession: totalQuestions = 3", result.totalQuestions == 3);
};

do {
  // Empty submissions — score = 0, totalQuestions = 0
  let qs = emptyQuestions();
  let secs = emptySections();
  let result = ResultLib.gradeTestWithSession(qs, secs, 10, "alice", "s", [], [], 0);
  ok("gradeTestWithSession: empty submissions score = 0", result.score == 0);
  ok("gradeTestWithSession: empty submissions totalQuestions = 0", result.totalQuestions == 0);
  ok("gradeTestWithSession: empty questionResults array", result.questionResults.size() == 0);
};

do {
  // Unknown question ID — evaluated as incorrect (graceful degradation)
  let qs = emptyQuestions();
  let secs = emptySections();
  let subs = [mcqSub(999, 0)]; // question 999 does not exist
  let result = ResultLib.gradeTestWithSession(qs, secs, 10, "alice", "s", [], subs, 5);
  ok("gradeTestWithSession: unknown question ID counted as wrong",
    result.score == 0 and result.totalQuestions == 1);
  ok("gradeTestWithSession: questionResult for unknown ID has isCorrect=false",
    not result.questionResults[0].isCorrect);
};

// ── gradeTestWithSession: per-section scoring ─────────────────────────────────────────
Debug.print("gradeTestWithSession section scoring:");

do {
  let qs = emptyQuestions();
  let secs = emptySections();
  // Section 1: questions 1 and 2
  // Section 2: question 3
  qs.add(1, makeMCQQuestion(1, 10, ["A", "B"], 0, ?1));
  qs.add(2, makeMCQQuestion(2, 10, ["A", "B"], 1, ?1));
  qs.add(3, makeMCQQuestion(3, 10, ["A", "B"], 0, ?2));
  secs.add(1, { id = 1; testId = 10; name = "Section A"; description = ""; createdAt = 0; updatedAt = Time.now() });
  secs.add(2, { id = 2; testId = 10; name = "Section B"; description = ""; createdAt = 0; updatedAt = Time.now() });

  // Answer: q1 correct, q2 wrong, q3 correct
  let subs = [mcqSub(1, 0), mcqSub(2, 0), mcqSub(3, 0)];
  let result = ResultLib.gradeTestWithSession(qs, secs, 10, "alice", "s", [1, 2], subs, 90);
  ok("section scoring: overall score = 2", result.score == 2);
  ok("section scoring: sectionResults has 2 entries", result.sectionResults.size() == 2);

  // Section 1: 1 correct out of 2
  let secA = result.sectionResults[0];
  ok("section scoring: section 1 id correct", secA.sectionId == 1);
  ok("section scoring: section 1 name correct", secA.sectionName == "Section A");
  ok("section scoring: section 1 score = 1", secA.score == 1);
  ok("section scoring: section 1 totalQuestions = 2", secA.totalQuestions == 2);

  // Section 2: 1 correct out of 1
  let secB = result.sectionResults[1];
  ok("section scoring: section 2 id correct", secB.sectionId == 2);
  ok("section scoring: section 2 score = 1", secB.score == 1);
  ok("section scoring: section 2 totalQuestions = 1", secB.totalQuestions == 1);
};

do {
  // No selectedSectionIds — sectionResults is empty
  let qs = emptyQuestions();
  let secs = emptySections();
  qs.add(1, makeMCQQuestion(1, 10, ["A", "B"], 0, ?1));
  let result = ResultLib.gradeTestWithSession(qs, secs, 10, "alice", "s", [], [mcqSub(1, 0)], 5);
  ok("section scoring: empty selectedSectionIds yields empty sectionResults",
    result.sectionResults.size() == 0);
};

// ── listForUser ────────────────────────────────────────────────────────────────────────────
Debug.print("listForUser:");

do {
  // Empty map returns empty array
  let tr = emptyTestResults();
  let results = ResultLib.listForUser(tr, "alice", 50);
  ok("listForUser: empty map returns empty array", results.size() == 0);
};

do {
  // Only returns results for the specified user
  let tr = emptyTestResults();
  let qs = emptyQuestions();
  let secs = emptySections();
  qs.add(1, makeMCQQuestion(1, 1, ["A", "B"], 0, null));

  let aliceResult = ResultLib.gradeTestWithSession(qs, secs, 1, "alice", "sa", [], [mcqSub(1, 0)], 10);
  let bobResult = ResultLib.gradeTestWithSession(qs, secs, 1, "bob", "sb", [], [mcqSub(1, 0)], 10);
  tr.add(ResultLib.resultKey("alice", 1, "sa"), aliceResult);
  tr.add(ResultLib.resultKey("bob", 1, "sb"), bobResult);

  let aliceList = ResultLib.listForUser(tr, "alice", 50);
  let bobList = ResultLib.listForUser(tr, "bob", 50);
  ok("listForUser: returns only alice's results", aliceList.size() == 1);
  ok("listForUser: returns only bob's results", bobList.size() == 1);
  ok("listForUser: alice result username correct", aliceList[0].username == "alice");
  ok("listForUser: bob result username correct", bobList[0].username == "bob");
};

do {
  // limit parameter is respected
  let tr = emptyTestResults();
  let qs = emptyQuestions();
  let secs = emptySections();
  qs.add(1, makeMCQQuestion(1, 1, ["A", "B"], 0, null));

  var i : Nat = 1;
  while (i <= 5) {
    let r = ResultLib.gradeTestWithSession(qs, secs, 1, "alice", "s" # debug_show(i), [], [mcqSub(1, 0)], i);
    tr.add(ResultLib.resultKey("alice", 1, "s" # debug_show(i)), r);
    i += 1;
  };
  let limited = ResultLib.listForUser(tr, "alice", 3);
  ok("listForUser: respects limit of 3 when 5 results exist", limited.size() == 3);
  let all = ResultLib.listForUser(tr, "alice", 50);
  ok("listForUser: limit 50 returns all 5 results", all.size() == 5);
};

do {
  // Excludes results with completedAt = 0 (uncompleted/in-progress)
  let tr = emptyTestResults();
  let incompleteResult : ResultTypes.TestResult = {
    testId = 1; username = "alice"; sessionId = "si";
    score = 0; totalQuestions = 0; questionResults = []; sectionResults = [];
    completedAt = 0; // marks as not yet submitted
    timeSpentSeconds = 0;
  };
  tr.add(ResultLib.resultKey("alice", 1, "si"), incompleteResult);
  let list = ResultLib.listForUser(tr, "alice", 50);
  ok("listForUser: excludes results with completedAt = 0", list.size() == 0);
};

// ── countUncompletedSessions ────────────────────────────────────────────────────────
Debug.print("countUncompletedSessions:");

do {
  let tr = emptyTestResults();
  ok("countUncompletedSessions: 0 for empty map",
    ResultLib.countUncompletedSessions(tr, "alice") == 0);
};

do {
  let tr = emptyTestResults();
  // completedAt=0 → uncompleted
  let incomplete : ResultTypes.TestResult = {
    testId = 1; username = "alice"; sessionId = "s1";
    score = 0; totalQuestions = 1; questionResults = []; sectionResults = [];
    completedAt = 0; timeSpentSeconds = 0;
  };
  // completedAt != 0 → completed
  let complete : ResultTypes.TestResult = {
    testId = 2; username = "alice"; sessionId = "s2";
    score = 1; totalQuestions = 1; questionResults = []; sectionResults = [];
    completedAt = 1000000; timeSpentSeconds = 30;
  };
  tr.add("alice:1:s1", incomplete);
  tr.add("alice:2:s2", complete);

  ok("countUncompletedSessions: counts only incomplete",
    ResultLib.countUncompletedSessions(tr, "alice") == 1);
  ok("countUncompletedSessions: different user returns 0",
    ResultLib.countUncompletedSessions(tr, "bob") == 0);
};

// ── saveProgress ────────────────────────────────────────────────────────────────────────
Debug.print("saveProgress:");

do {
  let tr = emptyTestResults();
  let tp = emptyTestProgress();
  let answers = [mcqSub(1, 0), mcqSub(2, 1)];
  ResultLib.saveProgress(tr, tp, "alice", 1, "sess", answers, [1, 2]);
  let key = ResultLib.progressKey("alice", 1, "sess");
  ok("saveProgress: progress saved to map", tp.get(key) != null);
  switch (tp.get(key)) {
    case null { ok("saveProgress: progress data stored correctly", false) };
    case (?p) {
      ok("saveProgress: username stored", p.username == "alice");
      ok("saveProgress: testId stored", p.testId == 1);
      ok("saveProgress: sessionId stored", p.sessionId == "sess");
      ok("saveProgress: answers stored", p.answers.size() == 2);
      ok("saveProgress: selectedSectionIds stored", p.selectedSectionIds.size() == 2);
      ok("saveProgress: savedAt non-zero", p.savedAt != 0);
    };
  };
};

do {
  // saveProgress is idempotent — calling it twice updates the entry
  let tr = emptyTestResults();
  let tp = emptyTestProgress();
  ResultLib.saveProgress(tr, tp, "alice", 1, "sess", [mcqSub(1, 0)], []);
  ResultLib.saveProgress(tr, tp, "alice", 1, "sess", [mcqSub(1, 0), mcqSub(2, 1)], []);
  let key = ResultLib.progressKey("alice", 1, "sess");
  switch (tp.get(key)) {
    case null { ok("saveProgress: second call updates entry", false) };
    case (?p) {
      ok("saveProgress: second call updates answers to 2", p.answers.size() == 2);
    };
  };
};

do {
  // saveProgress is a no-op when the session is already completed
  let tr = emptyTestResults();
  let tp = emptyTestProgress();
  // Mark session as completed
  let completed : ResultTypes.TestResult = {
    testId = 1; username = "alice"; sessionId = "sess";
    score = 1; totalQuestions = 1; questionResults = []; sectionResults = [];
    completedAt = 9999; timeSpentSeconds = 30;
  };
  tr.add(ResultLib.resultKey("alice", 1, "sess"), completed);
  // Try to save progress — should be ignored
  ResultLib.saveProgress(tr, tp, "alice", 1, "sess", [mcqSub(1, 0)], []);
  let progressKey = ResultLib.progressKey("alice", 1, "sess");
  ok("saveProgress: no-op when session already completed", tp.get(progressKey) == null);
};

// ── gradeTest (convenience wrapper) ───────────────────────────────────────────────
Debug.print("gradeTest (wrapper):");

do {
  let qs = emptyQuestions();
  let secs = emptySections();
  qs.add(1, makeMCQQuestion(1, 5, ["A", "B"], 0, null));
  let result = ResultLib.gradeTest(qs, secs, 5, "bob", [mcqSub(1, 0)]);
  ok("gradeTest: returns graded result with correct score", result.score == 1);
  ok("gradeTest: session fields are default", result.sessionId == "");
  ok("gradeTest: sectionResults is empty", result.sectionResults.size() == 0);
  ok("gradeTest: timeSpentSeconds is 0", result.timeSpentSeconds == 0);
};

// ── buildReview ────────────────────────────────────────────────────────────────────────────
Debug.print("buildReview:");

do {
  // Returns null when no result stored
  let qs = emptyQuestions();
  let secs = emptySections();
  let tr = emptyTestResults();
  let review = ResultLib.buildReview(qs, secs, tr, "alice", 1, "sess");
  ok("buildReview: null for missing session", review == null);
};

do {
  // Returns review data for a completed session
  let qs = emptyQuestions();
  let secs = emptySections();
  let tr = emptyTestResults();
  qs.add(1, makeMCQQuestion(1, 1, ["A", "B"], 0, null));
  let result = ResultLib.gradeTestWithSession(qs, secs, 1, "alice", "sess", [], [mcqSub(1, 0)], 20);
  tr.add(ResultLib.resultKey("alice", 1, "sess"), result);
  let review = ResultLib.buildReview(qs, secs, tr, "alice", 1, "sess");
  switch (review) {
    case null { ok("buildReview: returns review for completed session", false) };
    case (?r) {
      ok("buildReview: returns review for completed session", true);
      ok("buildReview: 1 question in review", r.questions.size() == 1);
      ok("buildReview: totalScore is 1.0 for perfect score",
        r.totalScore > 0.99 and r.totalScore <= 1.0);
      ok("buildReview: sectionScores empty (no sections selected)",
        r.sectionScores.size() == 0);
    };
  };
};

do {
  // Correct answer text is populated in review question
  let qs = emptyQuestions();
  let secs = emptySections();
  let tr = emptyTestResults();
  qs.add(1, makeMCQQuestion(1, 1, ["Alpha", "Beta", "Gamma"], 1, null));
  let result = ResultLib.gradeTestWithSession(qs, secs, 1, "alice", "r", [], [mcqSub(1, 0)], 5);
  tr.add(ResultLib.resultKey("alice", 1, "r"), result);
  let review = ResultLib.buildReview(qs, secs, tr, "alice", 1, "r");
  switch (review) {
    case null { ok("buildReview: correctAnswer populated in review", false) };
    case (?r) {
      ok("buildReview: correctAnswer is the option text at correctAnswers[0]",
        r.questions[0].correctAnswer == "Beta");
      ok("buildReview: question with wrong answer has isCorrect=false",
        not r.questions[0].isCorrect);
    };
  };
};

do {
  // totalScore is 0 for empty result
  let qs = emptyQuestions();
  let secs = emptySections();
  let tr = emptyTestResults();
  let emptyResult : ResultTypes.TestResult = {
    testId = 1; username = "alice"; sessionId = "e";
    score = 0; totalQuestions = 0; questionResults = []; sectionResults = [];
    completedAt = 1; timeSpentSeconds = 0;
  };
  tr.add(ResultLib.resultKey("alice", 1, "e"), emptyResult);
  let review = ResultLib.buildReview(qs, secs, tr, "alice", 1, "e");
  switch (review) {
    case null { ok("buildReview: handles empty result", false) };
    case (?r) {
      ok("buildReview: totalScore is 0 for empty result", r.totalScore == 0.0);
      ok("buildReview: questions array is empty", r.questions.size() == 0);
    };
  };
};

// ── submitTestAnswers regression: idempotency ─────────────────────────────────────
Debug.print("submitTestAnswers idempotency (lib-level):");

do {
  // Simulates the core grading logic called by submitTestAnswers.
  // A second call with the same key should return the already-stored result
  // (checked in mixin, not in lib). At lib level, grading is pure.
  let qs = emptyQuestions();
  let secs = emptySections();
  qs.add(1, makeMCQQuestion(1, 1, ["A", "B"], 0, null));

  let r1 = ResultLib.gradeTestWithSession(qs, secs, 1, "alice", "idm", [], [mcqSub(1, 0)], 10);
  let r2 = ResultLib.gradeTestWithSession(qs, secs, 1, "alice", "idm", [], [mcqSub(1, 0)], 10);
  ok("submitTestAnswers idempotency: same inputs produce same score",
    r1.score == r2.score and r1.totalQuestions == r2.totalQuestions);
  ok("submitTestAnswers idempotency: same testId and username",
    r1.testId == r2.testId and r1.username == r2.username);
};

// ── submitTestAnswers: audio URL preserved in graded questions ──────────────────────
Debug.print("audioUrl preserved in question data:");

do {
  // Questions with audioUrl must be graded correctly — the url field
  // doesn't affect grading but the question must be found in the map.
  let qs = emptyQuestions();
  let secs = emptySections();
  let qWithAudio : TestTypes.Question = {
    id = 1; testId = 1;
    text = "Listen and answer";
    questionType = #mcSingle;
    options = ["A", "B"];
    correctAnswers = [0];
    correctOrder = []; correctText = "";
    imageBlob = null;
    audioUrl = ?"https://example.com/audio.mp3"; // audio URL present
    sectionId = null; explanation = null; orderIndex = 0;
    questionUpdatedAt = Time.now();
  };
  qs.add(1, qWithAudio);
  let result = ResultLib.gradeTestWithSession(qs, secs, 1, "alice", "aud", [], [mcqSub(1, 0)], 30);
  ok("audioUrl: question with audioUrl graded correctly (correct answer)",
    result.score == 1 and result.totalQuestions == 1);
  ok("audioUrl: questionResult isCorrect=true for correct submission",
    result.questionResults[0].isCorrect);

  // Confirm audioUrl is preserved on the question in the map (cache round-trip)
  switch (qs.get(1)) {
    case null { ok("audioUrl: question still in map after grading", false) };
    case (?q) {
      ok("audioUrl: question audioUrl preserved in map",
        q.audioUrl == ?"https://example.com/audio.mp3");
    };
  };
};

// ── Summary ─────────────────────────────────────────────────────────────────────────────
Debug.print("");
Debug.print("Results: " # debug_show(passed.value) # " passed, " # debug_show(failed.value) # " failed");
assert failed.value == 0;
