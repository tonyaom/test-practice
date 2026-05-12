import Map "mo:core/Map";
import AuthTypes "types/auth";
import TestTypes "types/tests";
import SectionTypes "types/sections";
import ResultTypes "types/results";
import MasteryTypes "types/mastery";
import AuthLib "lib/auth";

module Migration {
  // ── Old types defined inline (matching .old/src/backend/) ────────────────────

  // ── Actor state shapes ───────────────────────────────────────────────

  /// OldActor matches the currently deployed actor state (post audioBlob removal).
  type OldActor = {
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

  type NewActor = OldActor;

  // ── Migration ───────────────────────────────────────────────────────────────

  /// Passes all state through unchanged and re-seeds the admin account.
  /// Running seedAdmin here guarantees it executes on EVERY canister upgrade,
  /// not just fresh deploys — fixing stale canister state in production.
  public func run(old : OldActor) : NewActor {
    // Re-seed admin on every upgrade: ensures abcd/abcd always exists and is active.
    AuthLib.seedAdmin(old.users, AuthLib.SEEDED_ADMIN_USERNAME, AuthLib.SEEDED_ADMIN_PASSWORD);
    old;
  };
};
