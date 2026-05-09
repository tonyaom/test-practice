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
    audioUrl : ?Text;             // source URL supplied by admin
    audioBlob : ?Blob;            // raw audio bytes fetched from audioUrl and stored in canister
    audioDownloadStatus : ?Text;  // null | "downloading" | "ready" | "error"
  };

  public type Test = {
    id : Nat;
    name : Text;
    description : Text;
    createdAt : Int;
    updatedAt : Int; // updated whenever test metadata or any child question/section changes
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
