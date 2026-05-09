import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import TestTypes "../types/tests";
import ResultTypes "../types/results";
import SectionTypes "../types/sections";

/// Results domain logic: answer evaluation, test grading, session key
/// construction, progress tracking, and concurrent session enforcement.
/// Stateless functions that receive explicit Map state parameters.
module {
  public func evaluateAnswer(
    question : TestTypes.Question,
    submission : ResultTypes.AnswerSubmission,
  ) : Bool {
    switch (question.questionType) {
      case (#mcSingle) {
        // Single correct answer: selected options must be exactly [correctAnswer]
        if (submission.selectedOptions.size() != 1) { return false };
        if (question.correctAnswers.size() == 0) { return false };
        submission.selectedOptions[0] == question.correctAnswers[0];
      };
      case (#mcMulti) {
        // All correct answers selected, no extras
        let selected = submission.selectedOptions;
        let correct = question.correctAnswers;
        if (selected.size() != correct.size()) { return false };
        let allCorrectSelected = correct.all(func(c : Nat) : Bool {
          selected.any(func(s : Nat) : Bool { s == c })
        });
        let noExtras = selected.all(func(s : Nat) : Bool {
          correct.any(func(c : Nat) : Bool { s == c })
        });
        allCorrectSelected and noExtras;
      };
      case (#textInput) {
        // Case-insensitive comparison
        submission.textAnswer.toLower() == question.correctText.toLower();
      };
      case (#dragOrder) {
        // Ordered items must match correctOrder exactly
        let submitted = submission.orderedItems;
        let correct = question.correctOrder;
        if (submitted.size() != correct.size()) { return false };
        var i : Nat = 0;
        var allMatch = true;
        while (i < submitted.size()) {
          if (submitted[i] != correct[i]) { allMatch := false };
          i := i + 1;
        };
        allMatch;
      };
    };
  };

  public func gradeTest(
    questions : Map.Map<Nat, TestTypes.Question>,
    sections : Map.Map<Nat, SectionTypes.Section>,
    testId : Nat,
    username : Text,
    submissions : [ResultTypes.AnswerSubmission],
  ) : ResultTypes.TestResult {
    gradeTestWithSession(questions, sections, testId, username, "", [], submissions, 0);
  };

  public func gradeTestWithSession(
    questions : Map.Map<Nat, TestTypes.Question>,
    sections : Map.Map<Nat, SectionTypes.Section>,
    testId : Nat,
    username : Text,
    sessionId : Text,
    selectedSectionIds : [Nat],
    submissions : [ResultTypes.AnswerSubmission],
    timeSpentSeconds : Nat,
  ) : ResultTypes.TestResult {
    let questionResults = submissions.map(
      func(sub : ResultTypes.AnswerSubmission) : ResultTypes.QuestionResult {
        let isCorrect = switch (questions.get(sub.questionId)) {
          case null { false };
          case (?q) { evaluateAnswer(q, sub) };
        };
        { questionId = sub.questionId; isCorrect };
      },
    );
    let score = questionResults.foldLeft(
      0,
      func(acc : Nat, qr : ResultTypes.QuestionResult) : Nat {
        if (qr.isCorrect) { acc + 1 } else { acc };
      },
    );
    // Compute per-section results
    let sectionResults : [ResultTypes.SectionResult] = if (selectedSectionIds.size() == 0) {
      [];
    } else {
      selectedSectionIds.map<Nat, ResultTypes.SectionResult>(
        func(sid : Nat) : ResultTypes.SectionResult {
          let sectionName = switch (sections.get(sid)) {
            case (?s) { s.name };
            case null { "Unknown" };
          };
          // Questions that belong to this section (from submitted questions)
          let sectionQIds = submissions.filter(
            func(sub : ResultTypes.AnswerSubmission) : Bool {
              switch (questions.get(sub.questionId)) {
                case (?q) {
                  switch (q.sectionId) {
                    case (?qsid) { qsid == sid };
                    case null { false };
                  };
                };
                case null { false };
              };
            }
          );
          let sectionTotal = sectionQIds.size();
          let sectionScore = questionResults.foldLeft(
            0,
            func(acc : Nat, qr : ResultTypes.QuestionResult) : Nat {
              let belongsToSection = switch (questions.get(qr.questionId)) {
                case (?q) {
                  switch (q.sectionId) {
                    case (?qsid) { qsid == sid };
                    case null { false };
                  };
                };
                case null { false };
              };
              if (belongsToSection and qr.isCorrect) { acc + 1 } else { acc };
            },
          );
          {
            sectionId = sid;
            sectionName;
            score = sectionScore;
            totalQuestions = sectionTotal;
          };
        }
      );
    };
    {
      testId;
      username;
      sessionId;
      score;
      totalQuestions = submissions.size();
      questionResults;
      sectionResults;
      completedAt = Time.now();
      timeSpentSeconds;
    };
  };

  /// Return up to `limit` TestResults for `username`, sorted by completedAt descending.
  public func listForUser(
    testResults : Map.Map<Text, ResultTypes.TestResult>,
    username : Text,
    limit : Nat,
  ) : [ResultTypes.TestResult] {
    var results : [ResultTypes.TestResult] = [];
    testResults.forEach(func(_key : Text, result : ResultTypes.TestResult) {
      if (result.username == username and result.completedAt != 0) {
        results := results.concat([result]);
      };
    });
    // Sort descending by completedAt
    let sorted = results.sort(
      func(a : ResultTypes.TestResult, b : ResultTypes.TestResult) : { #less; #equal; #greater } {
        if (b.completedAt > a.completedAt) { #less }
        else if (b.completedAt < a.completedAt) { #greater }
        else { #equal };
      }
    );
    if (sorted.size() <= limit) { sorted }
    else { sorted.sliceToArray(0, limit) };
  };

/// Build the storage key for a completed test result.
  public func resultKey(username : Text, testId : Nat, sessionId : Text) : Text {
    username # ":" # debug_show(testId) # ":" # sessionId;
  };

  /// Build the storage key for an in-progress test session.
  public func progressKey(username : Text, testId : Nat, sessionId : Text) : Text {
    username # ":progress:" # debug_show(testId) # ":" # sessionId;
  };

  /// Count active (uncompleted) sessions for a user across all tests.
  public func countUncompletedSessions(
    testResults : Map.Map<Text, ResultTypes.TestResult>,
    username : Text,
  ) : Nat {
    testResults.foldLeft(
      0,
      func(acc : Nat, _key : Text, result : ResultTypes.TestResult) : Nat {
        if (result.username == username and result.completedAt == 0) {
          acc + 1;
        } else { acc };
      },
    );
  };

  /// Save in-progress answers for a session unless it has already been submitted.
  public func saveProgress(
    testResults : Map.Map<Text, ResultTypes.TestResult>,
    testProgress : Map.Map<Text, ResultTypes.TestProgress>,
    username : Text,
    testId : Nat,
    sessionId : Text,
    answers : [ResultTypes.AnswerSubmission],
    selectedSectionIds : [Nat],
  ) {
    let resKey = resultKey(username, testId, sessionId);
    switch (testResults.get(resKey)) {
      case (?_) {}; // already completed — ignore
      case null {
        let key = progressKey(username, testId, sessionId);
        let progress : ResultTypes.TestProgress = {
          testId;
          username;
          sessionId;
          answers;
          selectedSectionIds;
          savedAt = Time.now();
        };
        testProgress.add(key, progress);
      };
    };
  };

  /// Build the full ReviewData for a completed test session.
  /// Returns null if no result is found for username+testId+sessionId.
  public func buildReview(
    questions : Map.Map<Nat, TestTypes.Question>,
    _sections : Map.Map<Nat, SectionTypes.Section>,
    testResults : Map.Map<Text, ResultTypes.TestResult>,
    username : Text,
    testId : Nat,
    sessionId : Text,
  ) : ?ResultTypes.ReviewData {
    let key = resultKey(username, testId, sessionId);
    switch (testResults.get(key)) {
      case null { null };
      case (?result) {
        // Build one ReviewQuestion per submitted answer
        let reviewQuestions : [ResultTypes.ReviewQuestion] = result.questionResults.map<ResultTypes.QuestionResult, ResultTypes.ReviewQuestion>(
          func(qr : ResultTypes.QuestionResult) : ResultTypes.ReviewQuestion {
            switch (questions.get(qr.questionId)) {
              case null {
                {
                  question = { id = qr.questionId; text = ""; questionType = #mcSingle; options = []; explanation = null };
                  userAnswer = "";
                  correctAnswer = "";
                  isCorrect = qr.isCorrect;
                };
              };
              case (?q) {
                let correctAnswer = switch (q.questionType) {
                  case (#mcSingle or #mcMulti) {
                    q.correctAnswers.map(func(i : Nat) : Text {
                      if (i < q.options.size()) { q.options[i] } else { debug_show(i) };
                    }).foldLeft("", func(acc : Text, t : Text) : Text {
                      if (acc == "") { t } else { acc # ", " # t };
                    });
                  };
                  case (#textInput) { q.correctText };
                  case (#dragOrder) {
                    q.correctOrder.map(func(i : Nat) : Text {
                      if (i < q.options.size()) { q.options[i] } else { debug_show(i) };
                    }).foldLeft("", func(acc : Text, t : Text) : Text {
                      if (acc == "") { t } else { acc # " → " # t };
                    });
                  };
                };
                // Find the user's submission for this question from the result's questionResults
                // (we only have isCorrect at this point; for a richer answer we'd need
                //  to re-look up progress — emit a placeholder for now)
                let userAnswer = "(see submitted answer)";
                {
                  question = { id = q.id; text = q.text; questionType = q.questionType; options = q.options; explanation = q.explanation };
                  userAnswer;
                  correctAnswer;
                  isCorrect = qr.isCorrect;
                };
              };
            };
          }
        );
        let totalAnswered = result.questionResults.size();
        let totalScore : Float = if (totalAnswered == 0) {
          0.0;
        } else {
          result.score.toFloat() / totalAnswered.toFloat();
        };
        ?{
          questions = reviewQuestions;
          sectionScores = result.sectionResults;
          totalScore;
        };
      };
    };
  };
};
