import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/tests";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import SectionTypes "../types/sections";

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

  /// Compute a DataManifest from all current data.
  /// Finds the maximum updatedAt across all tests, questions, and sections.
  public func buildDataManifest(
    tests : Map.Map<Nat, Types.Test>,
    questions : Map.Map<Nat, Types.Question>,
    sections : Map.Map<Nat, SectionTypes.Section>,
  ) : Types.DataManifest {
    var maxTs : Int = 0;
    for (t in tests.values()) {
      if (t.updatedAt > maxTs) { maxTs := t.updatedAt };
    };
    for (q in questions.values()) {
      if (q.questionUpdatedAt > maxTs) { maxTs := q.questionUpdatedAt };
    };
    for (s in sections.values()) {
      if (s.updatedAt > maxTs) { maxTs := s.updatedAt };
    };
    let testCount = tests.size();
    let questionCount = questions.size();
    let sectionCount = sections.size();
    let globalUpdatedAt = maxTs.toText();
    let checksum = testCount.toText() # "_" # questionCount.toText() # "_" # sectionCount.toText() # "_" # globalUpdatedAt;
    { globalUpdatedAt; testCount; questionCount; sectionCount; checksum };
  };

  /// Build the full bulk response: all tests with nested questions and sections.
  public func buildAllTestData(
    tests : Map.Map<Nat, Types.Test>,
    questions : Map.Map<Nat, Types.Question>,
    sections : Map.Map<Nat, SectionTypes.Section>,
  ) : Types.AllTestData {
    let manifest = buildDataManifest(tests, questions, sections);
    let allTests = tests.values().map(
      func(t : Types.Test) : Types.TestFullData {
        let qs = listQuestionsForTest(questions, t.id);
        let rawSections = sections.values().filter(
          func(s : SectionTypes.Section) : Bool { s.testId == t.id }
        ).map(
          func(s : SectionTypes.Section) : Types.SectionData {
            { id = s.id; testId = s.testId; name = s.name; description = s.description; createdAt = s.createdAt; updatedAt = s.updatedAt }
          }
        ).toArray();
        { id = t.id; name = t.name; description = t.description; createdAt = t.createdAt; updatedAt = t.updatedAt; questions = qs; sections = rawSections };
      }
    ).toArray();
    { manifest; tests = allTests };
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
