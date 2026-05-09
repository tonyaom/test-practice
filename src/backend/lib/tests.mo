import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/tests";

/// Tests domain logic: CRUD for Test and Question entities.
/// Stateless functions that receive explicit Map state parameters.
/// No API or HTTP concerns.
module {
  public func createTest(
    tests : Map.Map<Nat, Types.Test>,
    nextId : Nat,
    input : Types.CreateTestInput,
  ) : Types.Test {
    let test : Types.Test = {
      id = nextId;
      name = input.name;
      description = input.description;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    tests.add(nextId, test);
    test;
  };

  public func updateTest(
    tests : Map.Map<Nat, Types.Test>,
    testId : Nat,
    input : Types.UpdateTestInput,
  ) : ?Types.Test {
    switch (tests.get(testId)) {
      case null { null };
      case (?existing) {
        let updated : Types.Test = { existing with name = input.name; description = input.description };
        tests.add(testId, updated);
        ?updated;
      };
    };
  };

  public func deleteTest(
    tests : Map.Map<Nat, Types.Test>,
    questions : Map.Map<Nat, Types.Question>,
    testId : Nat,
  ) : Bool {
    switch (tests.get(testId)) {
      case null { false };
      case (?_) {
        tests.remove(testId);
        // Collect question ids belonging to this test then remove them
        let toDelete = questions.entries().filter(
          func((_, q) : (Nat, Types.Question)) : Bool { q.testId == testId }
        ).map(
          func((id, _) : (Nat, Types.Question)) : Nat { id }
        ).toArray();
        for (qid in toDelete.values()) {
          questions.remove(qid);
        };
        true;
      };
    };
  };

  public func getTest(tests : Map.Map<Nat, Types.Test>, testId : Nat) : ?Types.Test {
    tests.get(testId);
  };

  public func listTests(tests : Map.Map<Nat, Types.Test>) : [Types.Test] {
    tests.values().toArray();
  };

  public func addQuestion(
    questions : Map.Map<Nat, Types.Question>,
    nextId : Nat,
    testId : Nat,
    questionCount : Nat,
    input : Types.CreateQuestionInput,
  ) : Types.Question {
    let question : Types.Question = {
      id = nextId;
      testId;
      sectionId = input.sectionId;
      text = input.text;
      questionType = input.questionType;
      options = input.options;
      correctAnswers = input.correctAnswers;
      correctOrder = input.correctOrder;
      correctText = input.correctText;
      imageBlob = input.imageBlob;
      explanation = input.explanation;
      orderIndex = questionCount;
      questionUpdatedAt = Time.now();
      audioUrl = input.audioUrl;
      audioBlob = null;
      audioDownloadStatus = null;
    };
    questions.add(nextId, question);
    question;
  };

  public func updateQuestion(
    questions : Map.Map<Nat, Types.Question>,
    questionId : Nat,
    input : Types.UpdateQuestionInput,
  ) : ?Types.Question {
    switch (questions.get(questionId)) {
      case null { null };
      case (?existing) {
        let updated : Types.Question = {
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
        };
        questions.add(questionId, updated);
        ?updated;
      };
    };
  };

  public func deleteQuestion(
    questions : Map.Map<Nat, Types.Question>,
    questionId : Nat,
  ) : Bool {
    switch (questions.get(questionId)) {
      case null { false };
      case (?_) {
        questions.remove(questionId);
        true;
      };
    };
  };

  public func listQuestionsForTest(
    questions : Map.Map<Nat, Types.Question>,
    testId : Nat,
  ) : [Types.Question] {
    let filtered = questions.values().filter(
      func(q : Types.Question) : Bool { q.testId == testId }
    ).toArray();
    filtered.sort(func(a : Types.Question, b : Types.Question) : { #less; #equal; #greater } {
      if (a.orderIndex < b.orderIndex) { #less }
      else if (a.orderIndex > b.orderIndex) { #greater }
      else { #equal };
    });
  };

  public func getQuestion(
    questions : Map.Map<Nat, Types.Question>,
    questionId : Nat,
  ) : ?Types.Question {
    questions.get(questionId);
  };

  public func countQuestionsForTest(
    questions : Map.Map<Nat, Types.Question>,
    testId : Nat,
  ) : Nat {
    questions.values().filter(
      func(q : Types.Question) : Bool { q.testId == testId }
    ).size();
  };
};
