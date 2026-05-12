import Map "mo:core/Map";
import TestTypes "../types/tests";
import AuthTypes "../types/auth";
import TestLib "../lib/tests";
import AuthLib "../lib/auth";
import Time "mo:core/Time";
import SectionTypes "../types/sections";

// ══════════════════════════════════════════════════════════════════════════════
// Tests API mixin — public surface for test and question management.
// ADMIN-ONLY operations: createTest, updateTest, deleteTest,
//                        addQuestion, updateQuestion, deleteQuestion
// USER-FACING  operations: getTest, listTests, getQuestion, listQuestionsForTest
//                          (all public query — no auth required)
// Delegates all business logic to TestLib. requireAdmin guard from AuthLib.
// ══════════════════════════════════════════════════════════════════════════════

mixin (
  users : Map.Map<Text, AuthTypes.UserRecord>,
  tests : Map.Map<Nat, TestTypes.Test>,
  questions : Map.Map<Nat, TestTypes.Question>,
  sections : Map.Map<Nat, SectionTypes.Section>,
  nextTestId : { var value : Nat },
  nextQuestionId : { var value : Nat },
) {
  // ── Test CRUD (admin only) ─────────────────────────────────────────────────────────────────────

  public shared func createTest(username : Text, input : TestTypes.CreateTestInput) : async TestTypes.Test {
    AuthLib.requireAdmin(users, username);
    let id = nextTestId.value;
    nextTestId.value := nextTestId.value + 1;
    TestLib.createTest(tests, id, input);
  };

  public shared func updateTest(username : Text, testId : Nat, input : TestTypes.UpdateTestInput) : async ?TestTypes.Test {
    AuthLib.requireAdmin(users, username);
    switch (tests.get(testId)) {
      case null { null };
      case (?existing) {
        let updated : TestTypes.Test = { existing with name = input.name; description = input.description; updatedAt = Time.now() };
        tests.add(testId, updated);
        ?updated;
      };
    };
  };

  public shared func deleteTest(username : Text, testId : Nat) : async Bool {
    AuthLib.requireAdmin(users, username);
    TestLib.deleteTest(tests, questions, testId);
  };

  public query func getTest(testId : Nat) : async ?TestTypes.Test {
    TestLib.getTest(tests, testId);
  };

  public query func listTests() : async [TestTypes.Test] {
    TestLib.listTests(tests);
  };

  // ── Question CRUD (admin only) ───────────────────────────────────────────────────────────────

  public shared func addQuestion(
    username : Text,
    testId : Nat,
    input : TestTypes.CreateQuestionInput,
  ) : async TestTypes.Question {
    AuthLib.requireAdmin(users, username);
    let id = nextQuestionId.value;
    nextQuestionId.value := nextQuestionId.value + 1;
    let count = TestLib.countQuestionsForTest(questions, testId);
    let q = TestLib.addQuestion(questions, id, testId, count, input);
    // Bump parent test updatedAt
    switch (tests.get(testId)) {
      case (?t) { tests.add(testId, { t with updatedAt = Time.now() }) };
      case null {};
    };
    q;
  };

  public shared func updateQuestion(
    username : Text,
    questionId : Nat,
    input : TestTypes.UpdateQuestionInput,
  ) : async ?TestTypes.Question {
    AuthLib.requireAdmin(users, username);
    // Get testId before updating
    let testIdOpt : ?Nat = switch (questions.get(questionId)) {
      case (?q) { ?q.testId };
      case null { null };
    };
    let result = switch (questions.get(questionId)) {
      case null { null };
      case (?existing) {
        let updated : TestTypes.Question = {
          existing with
          text = input.text;
          questionType = input.questionType;
          options = input.options;
          correctAnswers = input.correctAnswers;
          correctOrder = input.correctOrder;
          correctText = input.correctText;
          imageBlob = input.imageBlob;
          sectionId = input.sectionId;
          explanation = input.explanation;
          audioUrl = input.audioUrl;
          questionUpdatedAt = Time.now();
        };
        questions.add(questionId, updated);
        ?updated;
      };
    };
    // Bump parent test updatedAt
    switch (testIdOpt) {
      case (?tid) {
        switch (tests.get(tid)) {
          case (?t) { tests.add(tid, { t with updatedAt = Time.now() }) };
          case null {};
        };
      };
      case null {};
    };
    result;
  };

  public shared func deleteQuestion(username : Text, questionId : Nat) : async Bool {
    AuthLib.requireAdmin(users, username);
    // Get testId before deleting
    let testIdOpt : ?Nat = switch (questions.get(questionId)) {
      case (?q) { ?q.testId };
      case null { null };
    };
    let deleted = TestLib.deleteQuestion(questions, questionId);
    if (deleted) {
      switch (testIdOpt) {
        case (?tid) {
          switch (tests.get(tid)) {
            case (?t) { tests.add(tid, { t with updatedAt = Time.now() }) };
            case null {};
          };
        };
        case null {};
      };
    };
    deleted;
  };

  // ── Bulk / manifest endpoints (public query, no auth) ─────────────────────────────────────

  /// Returns a lightweight version stamp. Frontend calls this first to check if local
  /// cache is stale — only one GET needed to determine if a full refresh is required.
  public query func getDataManifest() : async TestTypes.DataManifest {
    TestLib.buildDataManifest(tests, questions, sections);
  };

  /// Returns all tests with nested questions and sections plus the manifest.
  /// Frontend calls this only when the manifest checksum indicates a change.
  public query func getAllTestData() : async TestTypes.AllTestData {
    TestLib.buildAllTestData(tests, questions, sections);
  };

  public query func listQuestionsForTest(testId : Nat) : async [TestTypes.Question] {
    TestLib.listQuestionsForTest(questions, testId);
  };

  public query func getQuestion(questionId : Nat) : async ?TestTypes.Question {
    TestLib.getQuestion(questions, questionId);
  };
};
