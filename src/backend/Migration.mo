import Map "mo:core/Map";
import Storage "mo:caffeineai-object-storage/Storage";
import AuthTypes "types/auth";
import TestTypes "types/tests";
import SectionTypes "types/sections";
import ResultTypes "types/results";
import MasteryTypes "types/mastery";

module Migration {
  // ── Old types defined inline (matching .old/src/backend/) ────────────────

  /// OldQuestion matches the previously deployed Question type (already has audio fields).
  type OldQuestion = {
    id : Nat;
    testId : Nat;
    sectionId : ?Nat;
    text : Text;
    questionType : { #mcSingle; #mcMulti; #textInput; #dragOrder };
    options : [Text];
    correctAnswers : [Nat];
    correctOrder : [Nat];
    correctText : Text;
    imageBlob : ?Storage.ExternalBlob;
    explanation : ?Text;
    orderIndex : Nat;
    questionUpdatedAt : Int;
    audioUrl : ?Text;
    audioBlob : ?Blob;
    audioDownloadStatus : ?Text;
  };

  /// OldTestResult matches the previously deployed TestResult type (no timeSpentSeconds).
  type OldSectionResult = {
    sectionId : Nat;
    sectionName : Text;
    score : Nat;
    totalQuestions : Nat;
  };

  type OldQuestionResult = {
    questionId : Nat;
    isCorrect : Bool;
  };

  type OldTestResult = {
    testId : Nat;
    username : Text;
    sessionId : Text;
    score : Nat;
    totalQuestions : Nat;
    questionResults : [OldQuestionResult];
    sectionResults : [OldSectionResult];
    completedAt : Int;
  };

  // ── Actor state shapes ────────────────────────────────────────────────────

  /// The shape of the previously deployed actor state.
  type OldActor = {
    users : Map.Map<Text, AuthTypes.UserRecord>;
    tests : Map.Map<Nat, TestTypes.Test>;
    questions : Map.Map<Nat, OldQuestion>;
    testResults : Map.Map<Text, OldTestResult>;
    testProgress : Map.Map<Text, ResultTypes.TestProgress>;
    sections : Map.Map<Nat, SectionTypes.Section>;
    mastery : Map.Map<Text, MasteryTypes.QuestionMastery>;
    nextTestId : { var value : Nat };
    nextQuestionId : { var value : Nat };
    nextSectionId : { var value : Nat };
    nextTotpCounter : { var value : Nat };
  };

  /// The new actor state shape — TestResult now includes timeSpentSeconds.
  type NewActor = {
    users : Map.Map<Text, AuthTypes.UserRecord>;
    tests : Map.Map<Nat, TestTypes.Test>;
    questions : Map.Map<Nat, TestTypes.Question>;
    testResults : Map.Map<Text, ResultTypes.TestResult>;
    testProgress : Map.Map<Text, ResultTypes.TestProgress>;
    sections : Map.Map<Nat, SectionTypes.Section>;
    mastery : Map.Map<Text, MasteryTypes.QuestionMastery>;
    nextTestId : { var value : Nat };
    nextQuestionId : { var value : Nat };
    nextSectionId : { var value : Nat };
    nextTotpCounter : { var value : Nat };
  };

  // ── Migration ─────────────────────────────────────────────────────────────

  /// Migrates:
  /// - questions: identity (fields unchanged, types compatible)
  /// - testResults: adds timeSpentSeconds = 0 to each record
  public func run(old : OldActor) : NewActor {
    let questions = old.questions.map<Nat, OldQuestion, TestTypes.Question>(
      func(_id, q) { q }
    );
    let testResults = old.testResults.map<Text, OldTestResult, ResultTypes.TestResult>(
      func(_key, r) { { r with timeSpentSeconds = 0 } }
    );
    {
      users = old.users;
      tests = old.tests;
      questions;
      testResults;
      testProgress = old.testProgress;
      sections = old.sections;
      mastery = old.mastery;
      nextTestId = old.nextTestId;
      nextQuestionId = old.nextQuestionId;
      nextSectionId = old.nextSectionId;
      nextTotpCounter = old.nextTotpCounter;
    };
  };
};

