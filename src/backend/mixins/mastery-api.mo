import Map "mo:core/Map";
import AuthTypes "../types/auth";
import TestTypes "../types/tests";
import MasteryTypes "../types/mastery";
import Common "../types/common";
import Time "mo:core/Time";
import AuthLib "../lib/auth";
import MasteryLib "../lib/mastery";
import Runtime "mo:core/Runtime";
import ResultTypes "../types/results";
import SectionTypes "../types/sections";

/// Public mastery API exposed to both users and admins.
/// User endpoints: get own mastery, reset own mastery for a test.
/// Admin endpoints: list all users, activate/deactivate a user,
///   view any user's mastery progress, reset any user's mastery.
mixin (
  users : Map.Map<Text, AuthTypes.UserRecord>,
  tests : Map.Map<Nat, TestTypes.Test>,
  questions : Map.Map<Nat, TestTypes.Question>,
  mastery : Map.Map<Text, MasteryTypes.QuestionMastery>,
  testResults : Map.Map<Text, ResultTypes.TestResult>,
  sections : Map.Map<Nat, SectionTypes.Section>,
) {
  /// ── User endpoints ──────────────────────────────────────────────────────

  /// Return mastery records for the caller and a given test.
  public query func getMasteryForTest(username : Text, testId : Common.TestId) : async [MasteryTypes.QuestionMastery] {
    MasteryLib.listForUserTest(mastery, username, testId);
  };

  /// Reset caller's mastery streaks to 0 for a test.
  /// Reset caller's mastery streaks to 0 for a test (or a specific section within it).
  public shared func resetMyMastery(username : Text, input : MasteryTypes.ResetMasteryInput) : async () {
    switch (users.get(username)) {
      case null { Runtime.trap("User not found") };
      case (?u) {
        if (not u.isActive) { Runtime.trap("Account is deactivated") };
      };
    };
    let testQuestions = questions.values().filter(
      func(q : TestTypes.Question) : Bool {
        if (q.testId != input.testId) { return false };
        switch (input.sectionId) {
          case null { true };
          case (?sid) { q.sectionId == ?sid };
        };
      }
    ).map(func(q) { q.id }).toArray();
    MasteryLib.resetMasterQuestion(mastery, username, input.testId, testQuestions, Time.now());
  };

  /// ── Admin endpoints ─────────────────────────────────────────────────────

  /// List all registered users (admin only).
  public query func adminListUsers(username : Text) : async [MasteryTypes.AdminUserInfo] {
    AuthLib.requireAdmin(users, username);
    users.values().map<AuthTypes.UserRecord, MasteryTypes.AdminUserInfo>(func(u) {
      {
        username = u.username;
        displayName = switch (u.displayName) { case (?d) d; case null "" };
        role = u.role;
        isActive = u.isActive;
      }
    }).toArray();
  };

  /// Activate a user account (admin only).
  public shared func adminActivateUser(callerUsername : Text, username : Common.UserId) : async Bool {
    AuthLib.requireAdmin(users, callerUsername);
    switch (users.get(username)) {
      case null { false };
      case (?u) {
        users.add(username, { u with isActive = true });
        true;
      };
    };
  };

  /// Deactivate a user account (admin only).
  public shared func adminDeactivateUser(callerUsername : Text, username : Common.UserId) : async Bool {
    AuthLib.requireAdmin(users, callerUsername);
    AuthLib.requireNotSeededAdmin(username);
    switch (users.get(username)) {
      case null { false };
      case (?u) {
        if (u.role == #admin) { Runtime.trap("Cannot deactivate admin account") };
        users.add(username, { u with isActive = false });
        true;
      };
    };
  };

  /// Permanently delete a user and all their mastery/progress data (admin only).
  public shared func adminDeleteUser(callerUsername : Text, targetUsername : Common.UserId) : async { #ok; #err : Text } {
    AuthLib.requireAdmin(users, callerUsername);
    AuthLib.requireNotSeededAdmin(targetUsername);
    if (callerUsername == targetUsername) {
      Runtime.trap("Cannot delete your own account");
    };
    let result = AuthLib.deleteUser(users, targetUsername);
    switch (result) {
      case (#err e) { return #err(e) };
      case (#ok) {};
    };
    // Remove all mastery records for the deleted user
    let keysToRemove = mastery.keys().filter(
      func(k : Text) : Bool { k.startsWith(#text (targetUsername # ":")) }
    ).toArray();
    for (key in keysToRemove.values()) {
      mastery.remove(key);
    };
    // Remove all test results for the deleted user
    let resultKeysToRemove = testResults.keys().filter(
      func(k : Text) : Bool { k.startsWith(#text (targetUsername # ":")) }
    ).toArray();
    for (key in resultKeysToRemove.values()) {
      testResults.remove(key);
    };
    #ok;
  };

  /// View a specific user's mastery progress for a test (admin only).
  public query func adminGetUserProgress(callerUsername : Text, username : Common.UserId, testId : Common.TestId) : async ?MasteryTypes.UserProgressInfo {
    AuthLib.requireAdmin(users, callerUsername);
    switch (users.get(username)) {
      case null { null };
      case (?_) {
        let total = questions.values().filter(
          func(q : TestTypes.Question) : Bool { q.testId == testId }
        ).size();
        ?MasteryLib.progressInfo(mastery, username, testId, total);
      };
    };
  };

  /// Return detailed progress (mastery + time) for a specific user across all tests (admin only).
  public query func adminGetUserDetailedProgress(callerUsername : Text, username : Common.UserId) : async MasteryTypes.UserDetailedProgress {
    AuthLib.requireAdmin(users, callerUsername);
    MasteryLib.detailedProgress(mastery, testResults, tests, questions, sections, username);
  };

  /// Return the caller's own detailed progress (mastery + time) across all tests.
  public query func getUserProgress(username : Common.UserId) : async MasteryTypes.UserDetailedProgress {
    switch (users.get(username)) {
      case null { Runtime.trap("User not found") };
      case (?u) {
        if (not u.isActive) { Runtime.trap("Account is deactivated") };
        MasteryLib.detailedProgress(mastery, testResults, tests, questions, sections, username);
      };
    };
  };

  /// Aggregate platform-wide statistics for the admin dashboard (admin only).
  public query func getAdminDashboardStats(callerUsername : Text) : async MasteryTypes.AdminDashboardStats {
    AuthLib.requireAdmin(users, callerUsername);
    MasteryLib.adminDashboardStats(tests, questions, users, testResults, mastery);
  };

  /// Reset a specific user's mastery streaks to 0 for a test (admin only).
  /// Reset a specific user's mastery streaks to 0 for a test (or a section within it) (admin only).
  public shared func adminResetUserMastery(callerUsername : Text, username : Common.UserId, input : MasteryTypes.ResetMasteryInput) : async Bool {
    AuthLib.requireAdmin(users, callerUsername);
    switch (users.get(username)) {
      case null { false };
      case (?_) {
        let testQuestions = questions.values().filter(
          func(q : TestTypes.Question) : Bool {
            if (q.testId != input.testId) { return false };
            switch (input.sectionId) {
              case null { true };
              case (?sid) { q.sectionId == ?sid };
            };
          }
        ).map(func(q) { q.id }).toArray();
        MasteryLib.resetMasterQuestion(mastery, username, input.testId, testQuestions, Time.now());
        true;
      };
    };
  };
};
