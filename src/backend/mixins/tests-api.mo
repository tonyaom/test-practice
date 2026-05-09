import Map "mo:core/Map";
import TestTypes "../types/tests";
import AuthTypes "../types/auth";
import TestLib "../lib/tests";
import AuthLib "../lib/auth";
import Time "mo:core/Time";
import Error "mo:core/Error";

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
          // Preserve audio blob data and download status — never drop stored audio on text-only edits
          audioBlob = existing.audioBlob;
          audioDownloadStatus = existing.audioDownloadStatus;
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

  /// Fetch audio from audioUrl via HTTP outcall and store it in the question's audioBlob field.
  /// Returns #ok on success, #err(Text) with an error message on failure.
  /// Admin only.
  public shared func downloadAudio(username : Text, questionId : Nat, audioUrl : Text) : async { #ok; #err : Text } {
    AuthLib.requireAdmin(users, username);
    // Look up the question
    let question = switch (questions.get(questionId)) {
      case null { return #err("Question not found") };
      case (?q) { q };
    };
    // Mark as downloading
    questions.add(questionId, { question with audioUrl = ?audioUrl; audioDownloadStatus = ?"downloading" });
    // IC management canister HTTP outcall
    let ic : actor {
      http_request : {
        url : Text;
        max_response_bytes : ?Nat64;
        headers : [{ name : Text; value : Text }];
        body : ?Blob;
        method : { #get; #head; #post };
        transform : ?{
          function : shared ({ response : { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob }; context : Blob }) -> async { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob };
          context : Blob;
        };
      } -> async { status : Nat; headers : [{ name : Text; value : Text }]; body : Blob };
    } = actor "aaaaa-aa";

    // Limit response to exactly 2 MiB (2*1024*1024) — IC counts headers+body together;
    // using 2_097_152 leaves headroom versus the 2_000_000 hard ceiling.
    let maxBytes : Nat64 = 2_097_152;
    try {
      let response = await ic.http_request({
        url = audioUrl;
        max_response_bytes = ?maxBytes;
        headers = [];
        body = null;
        method = #get;
        transform = null;
      });
      if (response.status >= 200 and response.status < 300) {
        let updatedQ = switch (questions.get(questionId)) {
          case null { return #err("Question not found after download: id=" # debug_show(questionId)) };
          case (?q) { q };
        };
        questions.add(questionId, { updatedQ with audioBlob = ?response.body; audioDownloadStatus = ?"ready" });
        // Bump parent test updatedAt
        switch (tests.get(updatedQ.testId)) {
          case (?t) { tests.add(updatedQ.testId, { t with updatedAt = Time.now() }) };
          case null {};
        };
        #ok
      } else {
        let errMsg = "HTTP " # debug_show(response.status);
        let failQ = switch (questions.get(questionId)) {
          case null { return #err(errMsg) };
          case (?q) { q };
        };
        questions.add(questionId, { failQ with audioDownloadStatus = ?("error: " # errMsg) });
        #err(errMsg)
      };
    } catch (e) {
      let errMsg = "Download failed: " # e.message();
      let failQ = switch (questions.get(questionId)) {
        case (?q) { q };
        case null { return #err(errMsg) };
      };
      questions.add(questionId, { failQ with audioDownloadStatus = ?("error: " # errMsg) });
      #err(errMsg)
    };
  };

  /// Return the stored audio blob for a question (available to all users).
  public query func getAudioBlob(questionId : Nat) : async ?Blob {
    switch (questions.get(questionId)) {
      case null { null };
      case (?q) { q.audioBlob };
    };
  };

  public query func listQuestionsForTest(testId : Nat) : async [TestTypes.Question] {
    TestLib.listQuestionsForTest(questions, testId);
  };

  public query func getQuestion(questionId : Nat) : async ?TestTypes.Question {
    TestLib.getQuestion(questions, questionId);
  };
};
