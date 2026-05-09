/// Result domain types: AnswerSubmission, QuestionResult, SectionResult,
/// TestResult, TestProgress, and SessionInfo.
/// Single source of truth for the results and progress domain schema.
module {
  public type AnswerSubmission = {
    questionId : Nat;
    selectedOptions : [Nat];
    textAnswer : Text;
    orderedItems : [Nat];
  };

  public type QuestionResult = {
    questionId : Nat;
    isCorrect : Bool;
  };

  /// Per-section score breakdown included in TestResult.
  public type SectionResult = {
    sectionId : Nat;
    sectionName : Text;
    score : Nat;
    totalQuestions : Nat;
  };

  public type TestResult = {
    testId : Nat;
    username : Text;
    sessionId : Text;
    score : Nat;
    totalQuestions : Nat;
    questionResults : [QuestionResult];
    sectionResults : [SectionResult]; // empty for whole-test / legacy results
    completedAt : Int;
    timeSpentSeconds : Nat;           // seconds elapsed during this session (0 if unknown)
  };

  /// In-progress answers saved so the user can switch tabs and resume.
  public type TestProgress = {
    testId : Nat;
    username : Text;
    sessionId : Text;
    answers : [AnswerSubmission];
    selectedSectionIds : [Nat]; // empty = entire test
    savedAt : Int;
  };

  /// Lightweight descriptor returned by listActiveTestSessions
  public type SessionInfo = {
    testId : Nat;
    sessionId : Text;
    completed : Bool;
  };

  /// One question's full review data: what the user answered, what was correct, and an explanation.
  public type ReviewQuestion = {
    question : { id : Nat; text : Text; questionType : { #mcSingle; #mcMulti; #textInput; #dragOrder }; options : [Text]; explanation : ?Text };
    userAnswer : Text;    // human-readable serialisation of the user's answer
    correctAnswer : Text; // human-readable serialisation of the correct answer
    isCorrect : Bool;
  };

  /// Full review data returned after a completed test session.
  public type ReviewData = {
    questions : [ReviewQuestion];
    sectionScores : [SectionResult];
    totalScore : Float; // percentage 0.0–1.0
  };
};
