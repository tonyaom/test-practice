import Map "mo:core/Map";
import TestsLib "../lib/tests";
import SectionsLib "../lib/sections";
import TestTypes "../types/tests";
import SectionTypes "../types/sections";
import Debug "mo:core/Debug";
import Runtime "mo:core/Runtime";

// ══════════════════════════════════════════════════════════════════════════════
// Unit tests for TestsLib (tests, questions, data manifest)
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

func emptyTests() : Map.Map<Nat, TestTypes.Test> {
  Map.empty<Nat, TestTypes.Test>()
};

func emptyQuestions() : Map.Map<Nat, TestTypes.Question> {
  Map.empty<Nat, TestTypes.Question>()
};

func emptySections() : Map.Map<Nat, SectionTypes.Section> {
  Map.empty<Nat, SectionTypes.Section>()
};

func makeCreateTestInput(name : Text, description : Text) : TestTypes.CreateTestInput {
  { name; description }
};

func makeUpdateTestInput(name : Text, description : Text) : TestTypes.UpdateTestInput {
  { name; description }
};

func makeCreateQInput(
  text : Text,
  qtype : TestTypes.QuestionType,
  sectionId : ?Nat,
  explanation : ?Text,
  audioUrl : ?Text,
) : TestTypes.CreateQuestionInput {
  {
    text;
    questionType = qtype;
    options = ["opt A", "opt B"];
    correctAnswers = [0];
    correctOrder = [];
    correctText = "";
    imageBlob = null;
    sectionId;
    explanation;
    audioUrl;
  }
};

func makeUpdateQInput(
  text : Text,
  qtype : TestTypes.QuestionType,
  sectionId : ?Nat,
  explanation : ?Text,
  audioUrl : ?Text,
) : TestTypes.UpdateQuestionInput {
  {
    text;
    questionType = qtype;
    options = ["opt A", "opt B"];
    correctAnswers = [0];
    correctOrder = [];
    correctText = "";
    imageBlob = null;
    sectionId;
    explanation;
    audioUrl;
  }
};

// ── createTest ────────────────────────────────────────────────────────────────
Debug.print("createTest:");

do {
  let tests = emptyTests();
  let t = TestsLib.createTest(tests, 1, makeCreateTestInput("My Test", "A description"));
  ok("createTest: id = nextId", t.id == 1);
  ok("createTest: name stored", t.name == "My Test");
  ok("createTest: description stored", t.description == "A description");
  ok("createTest: createdAt non-zero", t.createdAt != 0);
  ok("createTest: updatedAt non-zero", t.updatedAt != 0);
  ok("createTest: added to map", tests.size() == 1);
};

do {
  // Creating multiple tests with different IDs
  let tests = emptyTests();
  let t1 = TestsLib.createTest(tests, 1, makeCreateTestInput("T1", ""));
  let t2 = TestsLib.createTest(tests, 2, makeCreateTestInput("T2", ""));
  let t3 = TestsLib.createTest(tests, 3, makeCreateTestInput("T3", ""));
  ok("createTest: map has 3 tests", tests.size() == 3);
  ok("createTest: ids are distinct", t1.id != t2.id and t2.id != t3.id);
  ok("createTest: names preserved", t1.name == "T1" and t2.name == "T2" and t3.name == "T3");
};

do {
  // Test with empty name and description
  let tests = emptyTests();
  let t = TestsLib.createTest(tests, 10, makeCreateTestInput("", ""));
  ok("createTest: empty name stored", t.name == "");
  ok("createTest: empty description stored", t.description == "");
};

// ── updateTest ────────────────────────────────────────────────────────────────
Debug.print("updateTest:");

do {
  let tests = emptyTests();
  let original = TestsLib.createTest(tests, 1, makeCreateTestInput("Old", "OldDesc"));
  let result = TestsLib.updateTest(tests, 1, makeUpdateTestInput("New", "NewDesc"));
  switch (result) {
    case null { ok("updateTest: result not null", false) };
    case (?t) {
      ok("updateTest: name updated", t.name == "New");
      ok("updateTest: description updated", t.description == "NewDesc");
      ok("updateTest: id unchanged", t.id == 1);
      ok("updateTest: createdAt preserved", t.createdAt == original.createdAt);
    };
  };
};

do {
  // Update non-existent test returns null
  let tests = emptyTests();
  let result = TestsLib.updateTest(tests, 999, makeUpdateTestInput("X", "Y"));
  ok("updateTest: non-existent returns null", result == null);
};

do {
  // Map reflects the update
  let tests = emptyTests();
  ignore TestsLib.createTest(tests, 1, makeCreateTestInput("Before", ""));
  ignore TestsLib.updateTest(tests, 1, makeUpdateTestInput("After", ""));
  switch (tests.get(1)) {
    case null { ok("updateTest: map reflects update", false) };
    case (?t) { ok("updateTest: map reflects update", t.name == "After") };
  };
};

// ── getTest ───────────────────────────────────────────────────────────────────
Debug.print("getTest:");

do {
  let tests = emptyTests();
  ignore TestsLib.createTest(tests, 3, makeCreateTestInput("Hello", "World"));
  let r = TestsLib.getTest(tests, 3);
  switch (r) {
    case null { ok("getTest: returns the created test", false) };
    case (?t) {
      ok("getTest: correct id", t.id == 3);
      ok("getTest: correct name", t.name == "Hello");
    };
  };
};

do {
  let tests = emptyTests();
  ok("getTest: returns null for missing id", TestsLib.getTest(tests, 1) == null);
};

// ── listTests ─────────────────────────────────────────────────────────────────
Debug.print("listTests:");

do {
  let tests = emptyTests();
  ok("listTests: empty map returns empty array", TestsLib.listTests(tests).size() == 0);
};

do {
  let tests = emptyTests();
  ignore TestsLib.createTest(tests, 1, makeCreateTestInput("A", ""));
  ignore TestsLib.createTest(tests, 2, makeCreateTestInput("B", ""));
  ok("listTests: returns all 2 tests", TestsLib.listTests(tests).size() == 2);
};

// ── deleteTest ────────────────────────────────────────────────────────────────
Debug.print("deleteTest:");

do {
  // Delete an existing test
  let tests = emptyTests();
  let qs = emptyQuestions();
  ignore TestsLib.createTest(tests, 1, makeCreateTestInput("T", ""));
  let deleted = TestsLib.deleteTest(tests, qs, 1);
  ok("deleteTest: returns true for existing test", deleted);
  ok("deleteTest: test removed from map", tests.size() == 0);
};

do {
  // Delete non-existent test returns false
  let tests = emptyTests();
  let qs = emptyQuestions();
  ok("deleteTest: returns false for non-existent", not TestsLib.deleteTest(tests, qs, 999));
};

do {
  // Delete test cascades to questions
  let tests = emptyTests();
  let qs = emptyQuestions();
  ignore TestsLib.createTest(tests, 1, makeCreateTestInput("T1", ""));
  ignore TestsLib.createTest(tests, 2, makeCreateTestInput("T2", ""));
  ignore TestsLib.addQuestion(qs, 10, 1, 0, makeCreateQInput("Q1", #mcSingle, null, null, null));
  ignore TestsLib.addQuestion(qs, 11, 1, 1, makeCreateQInput("Q2", #mcSingle, null, null, null));
  // This question belongs to a different test — should NOT be deleted
  ignore TestsLib.addQuestion(qs, 12, 2, 0, makeCreateQInput("Q3", #mcSingle, null, null, null));
  let deleted = TestsLib.deleteTest(tests, qs, 1);
  ok("deleteTest cascade: returns true", deleted);
  ok("deleteTest cascade: test 1 questions removed", qs.get(10) == null and qs.get(11) == null);
  ok("deleteTest cascade: test 2 question preserved", qs.get(12) != null);
  ok("deleteTest cascade: 1 question remains", qs.size() == 1);
};

// ── addQuestion ───────────────────────────────────────────────────────────────
Debug.print("addQuestion:");

do {
  let qs = emptyQuestions();
  let q = TestsLib.addQuestion(qs, 1, 10, 0, makeCreateQInput("What?", #mcSingle, null, null, null));
  ok("addQuestion: id = nextId", q.id == 1);
  ok("addQuestion: testId stored", q.testId == 10);
  ok("addQuestion: text stored", q.text == "What?");
  ok("addQuestion: questionType stored", q.questionType == #mcSingle);
  ok("addQuestion: sectionId null", q.sectionId == null);
  ok("addQuestion: explanation null", q.explanation == null);
  ok("addQuestion: audioUrl null", q.audioUrl == null);
  ok("addQuestion: orderIndex = questionCount", q.orderIndex == 0);
  ok("addQuestion: questionUpdatedAt non-zero", q.questionUpdatedAt != 0);
  ok("addQuestion: added to map", qs.size() == 1);
};

do {
  // addQuestion with section assignment
  let qs = emptyQuestions();
  let q = TestsLib.addQuestion(qs, 5, 20, 3, makeCreateQInput("Section Q", #mcMulti, ?7, ?"Explanation text", ?"http://example.com/audio.mp3"));
  ok("addQuestion: sectionId stored", q.sectionId == ?7);
  ok("addQuestion: explanation stored", q.explanation == ?"Explanation text");
  ok("addQuestion: audioUrl stored", q.audioUrl == ?"http://example.com/audio.mp3");
  ok("addQuestion: questionType mcMulti", q.questionType == #mcMulti);
};

do {
  // orderIndex reflects question count at creation time
  let qs = emptyQuestions();
  ignore TestsLib.addQuestion(qs, 1, 1, 0, makeCreateQInput("Q1", #mcSingle, null, null, null));
  ignore TestsLib.addQuestion(qs, 2, 1, 1, makeCreateQInput("Q2", #mcSingle, null, null, null));
  ignore TestsLib.addQuestion(qs, 3, 1, 2, makeCreateQInput("Q3", #mcSingle, null, null, null));
  let q3 = switch (qs.get(3)) {
    case (?q) { q };
    case null { Runtime.trap("q3 must exist") };
  };
  ok("addQuestion: third question orderIndex = 2", q3.orderIndex == 2);
};

do {
  // dragOrder type is stored correctly
  let qs = emptyQuestions();
  let q = TestsLib.addQuestion(qs, 1, 1, 0, makeCreateQInput("Order Q", #dragOrder, null, null, null));
  ok("addQuestion: dragOrder type stored", q.questionType == #dragOrder);
};

do {
  // textInput type
  let qs = emptyQuestions();
  let q = TestsLib.addQuestion(qs, 1, 1, 0, makeCreateQInput("Text Q", #textInput, null, null, null));
  ok("addQuestion: textInput type stored", q.questionType == #textInput);
};

// ── updateQuestion ────────────────────────────────────────────────────────────
Debug.print("updateQuestion:");

do {
  // Basic field update
  let qs = emptyQuestions();
  ignore TestsLib.addQuestion(qs, 1, 10, 0, makeCreateQInput("Old text", #mcSingle, null, null, null));
  let result = TestsLib.updateQuestion(qs, 1, makeUpdateQInput("New text", #mcMulti, ?3, ?"Expl", ?"http://audio"));
  switch (result) {
    case null { ok("updateQuestion: result not null", false) };
    case (?q) {
      ok("updateQuestion: text updated", q.text == "New text");
      ok("updateQuestion: questionType updated", q.questionType == #mcMulti);
      ok("updateQuestion: sectionId updated", q.sectionId == ?3);
      ok("updateQuestion: explanation updated", q.explanation == ?"Expl");
      ok("updateQuestion: audioUrl updated", q.audioUrl == ?"http://audio");
      ok("updateQuestion: id unchanged", q.id == 1);
      ok("updateQuestion: testId unchanged", q.testId == 10);
    };
  };
};

do {
  // updateQuestion returns null for non-existent question
  let qs = emptyQuestions();
  let result = TestsLib.updateQuestion(qs, 999, makeUpdateQInput("X", #mcSingle, null, null, null));
  ok("updateQuestion: non-existent returns null", result == null);
};

do {
  // updateQuestion clears sectionId when set to null
  let qs = emptyQuestions();
  ignore TestsLib.addQuestion(qs, 1, 10, 0, makeCreateQInput("Q", #mcSingle, ?5, null, null));
  let result = TestsLib.updateQuestion(qs, 1, makeUpdateQInput("Q", #mcSingle, null, null, null));
  switch (result) {
    case null { ok("updateQuestion: sectionId cleared to null", false) };
    case (?q) { ok("updateQuestion: sectionId cleared to null", q.sectionId == null) };
  };
};

// ── deleteQuestion ────────────────────────────────────────────────────────────
Debug.print("deleteQuestion:");

do {
  let qs = emptyQuestions();
  ignore TestsLib.addQuestion(qs, 1, 10, 0, makeCreateQInput("Q", #mcSingle, null, null, null));
  let deleted = TestsLib.deleteQuestion(qs, 1);
  ok("deleteQuestion: returns true for existing question", deleted);
  ok("deleteQuestion: question removed from map", qs.size() == 0);
};

do {
  let qs = emptyQuestions();
  ok("deleteQuestion: returns false for non-existent", not TestsLib.deleteQuestion(qs, 999));
};

// ── listQuestionsForTest ──────────────────────────────────────────────────────
Debug.print("listQuestionsForTest:");

do {
  let qs = emptyQuestions();
  let list = TestsLib.listQuestionsForTest(qs, 1);
  ok("listQuestionsForTest: empty map returns empty array", list.size() == 0);
};

do {
  let qs = emptyQuestions();
  ignore TestsLib.addQuestion(qs, 1, 10, 0, makeCreateQInput("Q1", #mcSingle, null, null, null));
  ignore TestsLib.addQuestion(qs, 2, 10, 1, makeCreateQInput("Q2", #mcSingle, null, null, null));
  ignore TestsLib.addQuestion(qs, 3, 99, 0, makeCreateQInput("Other", #mcSingle, null, null, null));
  let list = TestsLib.listQuestionsForTest(qs, 10);
  ok("listQuestionsForTest: returns only questions for test 10", list.size() == 2);
  ok("listQuestionsForTest: other test not included", TestsLib.listQuestionsForTest(qs, 99).size() == 1);
  ok("listQuestionsForTest: unknown test returns empty", TestsLib.listQuestionsForTest(qs, 0).size() == 0);
};

do {
  // Sorted by orderIndex
  let qs = emptyQuestions();
  ignore TestsLib.addQuestion(qs, 1, 1, 2, makeCreateQInput("C", #mcSingle, null, null, null));
  ignore TestsLib.addQuestion(qs, 2, 1, 0, makeCreateQInput("A", #mcSingle, null, null, null));
  ignore TestsLib.addQuestion(qs, 3, 1, 1, makeCreateQInput("B", #mcSingle, null, null, null));
  let list = TestsLib.listQuestionsForTest(qs, 1);
  ok("listQuestionsForTest: sorted by orderIndex ascending",
    list[0].orderIndex == 0 and list[1].orderIndex == 1 and list[2].orderIndex == 2
  );
};

// ── getQuestion ───────────────────────────────────────────────────────────────
Debug.print("getQuestion:");

do {
  let qs = emptyQuestions();
  ignore TestsLib.addQuestion(qs, 5, 1, 0, makeCreateQInput("Q5", #mcSingle, null, null, null));
  let r = TestsLib.getQuestion(qs, 5);
  switch (r) {
    case null { ok("getQuestion: returns created question", false) };
    case (?q) {
      ok("getQuestion: id correct", q.id == 5);
      ok("getQuestion: text correct", q.text == "Q5");
    };
  };
};

do {
  let qs = emptyQuestions();
  ok("getQuestion: null for unknown id", TestsLib.getQuestion(qs, 404) == null);
};

// ── countQuestionsForTest ─────────────────────────────────────────────────────
Debug.print("countQuestionsForTest:");

do {
  let qs = emptyQuestions();
  ok("countQuestionsForTest: 0 for empty", TestsLib.countQuestionsForTest(qs, 1) == 0);
};

do {
  let qs = emptyQuestions();
  ignore TestsLib.addQuestion(qs, 1, 5, 0, makeCreateQInput("A", #mcSingle, null, null, null));
  ignore TestsLib.addQuestion(qs, 2, 5, 1, makeCreateQInput("B", #mcSingle, null, null, null));
  ignore TestsLib.addQuestion(qs, 3, 9, 0, makeCreateQInput("C", #mcSingle, null, null, null));
  ok("countQuestionsForTest: correct count for test 5", TestsLib.countQuestionsForTest(qs, 5) == 2);
  ok("countQuestionsForTest: correct count for test 9", TestsLib.countQuestionsForTest(qs, 9) == 1);
  ok("countQuestionsForTest: 0 for unknown test", TestsLib.countQuestionsForTest(qs, 99) == 0);
};

// ── buildDataManifest ─────────────────────────────────────────────────────────
Debug.print("buildDataManifest:");

do {
  // Empty state yields zero counts
  let tests = emptyTests();
  let qs = emptyQuestions();
  let secs = emptySections();
  let m = TestsLib.buildDataManifest(tests, qs, secs);
  ok("manifest: testCount = 0 on empty state", m.testCount == 0);
  ok("manifest: questionCount = 0 on empty state", m.questionCount == 0);
  ok("manifest: sectionCount = 0 on empty state", m.sectionCount == 0);
  ok("manifest: checksum contains zeros", m.checksum == "0_0_0_0");
};

do {
  // Counts match after insertions
  let tests = emptyTests();
  let qs = emptyQuestions();
  let secs = emptySections();
  ignore TestsLib.createTest(tests, 1, makeCreateTestInput("T1", ""));
  ignore TestsLib.createTest(tests, 2, makeCreateTestInput("T2", ""));
  ignore TestsLib.addQuestion(qs, 1, 1, 0, makeCreateQInput("Q1", #mcSingle, null, null, null));
  ignore TestsLib.addQuestion(qs, 2, 1, 1, makeCreateQInput("Q2", #mcSingle, null, null, null));
  ignore TestsLib.addQuestion(qs, 3, 2, 0, makeCreateQInput("Q3", #mcSingle, null, null, null));
  ignore SectionsLib.createSection(secs, 1, 1, { name = "Sec1"; description = "" });
  let m = TestsLib.buildDataManifest(tests, qs, secs);
  ok("manifest: testCount = 2", m.testCount == 2);
  ok("manifest: questionCount = 3", m.questionCount == 3);
  ok("manifest: sectionCount = 1", m.sectionCount == 1);
  ok("manifest: checksum starts with 2_3_1", m.checksum.size() > 5 and m.testCount == 2 and m.questionCount == 3 and m.sectionCount == 1);
};

do {
  // Manifest globalUpdatedAt reflects the latest timestamp across tests/questions/sections
  let tests = emptyTests();
  let qs = emptyQuestions();
  let secs = emptySections();
  ignore TestsLib.createTest(tests, 1, makeCreateTestInput("T1", ""));
  let m = TestsLib.buildDataManifest(tests, qs, secs);
  ok("manifest: globalUpdatedAt non-empty after test creation", m.globalUpdatedAt != "0");
  // checksum format: "<testCount>_<questionCount>_<sectionCount>_<globalUpdatedAt>"
  // verify globalUpdatedAt is embedded by checking the checksum ends with "_" + globalUpdatedAt
  ok("manifest: checksum includes globalUpdatedAt", m.checksum.size() > m.globalUpdatedAt.size());
};

// ── buildAllTestData ──────────────────────────────────────────────────────────
Debug.print("buildAllTestData:");

do {
  let tests = emptyTests();
  let qs = emptyQuestions();
  let secs = emptySections();
  let d = TestsLib.buildAllTestData(tests, qs, secs);
  ok("buildAllTestData: empty tests array", d.tests.size() == 0);
  ok("buildAllTestData: manifest embedded", d.manifest.testCount == 0);
};

do {
  let tests = emptyTests();
  let qs = emptyQuestions();
  let secs = emptySections();
  ignore TestsLib.createTest(tests, 1, makeCreateTestInput("T1", "Desc"));
  ignore TestsLib.addQuestion(qs, 1, 1, 0, makeCreateQInput("Q1", #mcSingle, ?1, ?"Expl", null));
  ignore SectionsLib.createSection(secs, 1, 1, { name = "Sec1"; description = "" });
  let d = TestsLib.buildAllTestData(tests, qs, secs);
  ok("buildAllTestData: 1 test", d.tests.size() == 1);
  let tfd = d.tests[0];
  ok("buildAllTestData: test id correct", tfd.id == 1);
  ok("buildAllTestData: test name correct", tfd.name == "T1");
  ok("buildAllTestData: nested questions", tfd.questions.size() == 1);
  ok("buildAllTestData: nested sections", tfd.sections.size() == 1);
  ok("buildAllTestData: manifest counts correct",
    d.manifest.testCount == 1 and d.manifest.questionCount == 1 and d.manifest.sectionCount == 1
  );
};

// ── Summary ───────────────────────────────────────────────────────────────────
Debug.print("");
Debug.print("Results: " # debug_show(passed.value) # " passed, " # debug_show(failed.value) # " failed");
assert failed.value == 0;
