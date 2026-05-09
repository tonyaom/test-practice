import Common "common";

/// Mastery domain types: QuestionMastery, AdminUserInfo, UserProgressInfo, ResetMasteryInput.
/// Single source of truth for the mastery, user-admin, and progress-admin domain schema.
module {
  /// Per-user, per-question mastery state.
  public type QuestionMastery = {
    userId : Common.UserId;
    testId : Common.TestId;
    questionId : Common.QuestionId;
    correctStreak : Nat;  // number of consecutive correct answers; resets to 0 on wrong answer
    isMastered : Bool;    // true when correctStreak reaches 5
    updatedAt : Common.Timestamp;
  };

  /// Returned to admin when listing all users.
  public type AdminUserInfo = {
    username : Common.UserId;
    displayName : Text;
    role : { #admin; #user };
    isActive : Bool;
  };

  /// Legacy per-test progress summary (kept for backward compatibility).
  public type UserProgressInfo = {
    username : Common.UserId;
    testId : Common.TestId;
    totalQuestions : Nat;
    masteredCount : Nat;
    inProgressCount : Nat; // answered correctly at least once but not yet mastered
  };

  /// Per-section mastery breakdown within a test.
  public type SectionMasteryInfo = {
    sectionId : Common.SectionId;
    sectionName : Text;
    isSectionMastered : Bool;    // true when all questions in the section are mastered
    masteredCount : Nat;
    totalInSection : Nat;
    timeSpentSeconds : Nat;      // total seconds spent in this section across all sessions
  };

  /// Per-test mastery and time breakdown.
  public type TestMasteryInfo = {
    testId : Common.TestId;
    testName : Text;
    isTestMastered : Bool;       // true when all questions in the test are mastered
    masteredCount : Nat;
    totalQuestions : Nat;
    inProgressCount : Nat;
    timeSpentSeconds : Nat;      // total seconds spent on this test across all sessions
    sections : [SectionMasteryInfo];
  };

  /// Detailed progress for a user: per-test breakdown with section mastery and time tracking.
  public type UserDetailedProgress = {
    username : Common.UserId;
    lifetimeTimeSpentSeconds : Nat;   // total seconds across all tests
    tests : [TestMasteryInfo];
  };

  /// Input for resetting a user's mastery counts to 0 for a test (or a section within it).
  public type ResetMasteryInput = {
    testId : Common.TestId;
    sectionId : ?Common.SectionId; // null = reset entire test; Some(id) = reset only that section
  };

  /// Lightweight test descriptor ordered by session count for the dashboard.
  public type TopTestInfo = {
    testId : Common.TestId;
    testName : Text;
    sessionCount : Nat;
  };

  /// Aggregate statistics returned to the admin dashboard.
  public type AdminDashboardStats = {
    totalTests : Nat;
    totalQuestions : Nat;
    totalUsers : Nat;
    totalActiveUsers : Nat;
    totalDeactivatedUsers : Nat;
    totalMasteredQuestions : Nat;
    totalMasteryRecords : Nat;
    topTests : [TopTestInfo]; // top tests ordered by session count (descending)
  };
};
