import Storage "mo:caffeineai-object-storage/Storage";

/// Test and Question domain types, including QuestionType variants and
/// all create/update input shapes.
/// Single source of truth for the tests domain schema.
module {
  public type QuestionType = {
    #mcSingle;
    #mcMulti;
    #textInput;
    #dragOrder;
  };

  public type Question = {
    id : Nat;
    testId : Nat;
    sectionId : ?Nat; // null = uncategorized / no section
    text : Text;
    questionType : QuestionType;
    options : [Text];
    correctAnswers : [Nat];
    correctOrder : [Nat];
    correctText : Text;
    imageBlob : ?Storage.ExternalBlob;
    explanation : ?Text; // optional rich-text explanation shown after answering (HTML string)
    orderIndex : Nat;
    questionUpdatedAt : Int; // bumps parent test's updatedAt on any question change
    audioUrl : ?Text;             // source URL supplied by admin — played directly in the browser
  };

  public type Test = {
    id : Nat;
    name : Text;
    description : Text;
    createdAt : Int;
    updatedAt : Int; // updated whenever test metadata or any child question/section changes
  };

  /// Lightweight version stamp — frontend compares checksum to decide if a full refresh is needed.
  public type DataManifest = {
    globalUpdatedAt : Text;  // most recent updatedAt across all tests/questions/sections, as nanosecond Text
    testCount : Nat;
    questionCount : Nat;
    sectionCount : Nat;
    checksum : Text;         // "<testCount>_<questionCount>_<sectionCount>_<globalUpdatedAt>"
  };

  /// A Test record with its questions and sections nested inline.
  public type TestFullData = {
    id : Nat;
    name : Text;
    description : Text;
    createdAt : Int;
    updatedAt : Int;
    questions : [Question];
    sections : [SectionData];
  };

  /// Minimal section data embedded in TestFullData (mirrors types/sections.mo Section).
  public type SectionData = {
    id : Nat;
    testId : Nat;
    name : Text;
    description : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  /// Full bulk response: manifest + all tests with nested children.
  public type AllTestData = {
    manifest : DataManifest;
    tests : [TestFullData];
  };

  public type CreateTestInput = {
    name : Text;
    description : Text;
  };

  public type UpdateTestInput = {
    name : Text;
    description : Text;
  };

  public type CreateQuestionInput = {
    text : Text;
    questionType : QuestionType;
    options : [Text];
    correctAnswers : [Nat];
    correctOrder : [Nat];
    correctText : Text;
    imageBlob : ?Storage.ExternalBlob;
    sectionId : ?Nat; // optional section assignment
    explanation : ?Text; // optional rich-text explanation (HTML string)
    audioUrl : ?Text; // optional audio source URL
  };

  public type UpdateQuestionInput = {
    text : Text;
    questionType : QuestionType;
    options : [Text];
    correctAnswers : [Nat];
    correctOrder : [Nat];
    correctText : Text;
    imageBlob : ?Storage.ExternalBlob;
    sectionId : ?Nat; // optional section assignment
    explanation : ?Text; // optional rich-text explanation (HTML string)
    audioUrl : ?Text; // optional audio source URL
  };
};
