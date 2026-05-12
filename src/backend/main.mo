import Map "mo:core/Map";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import ResultTypes "types/results";
import AuthApi "mixins/auth-api";
import TestsApi "mixins/tests-api";
import ResultsApi "mixins/results-api";
import Migration "Migration";
import SectionsApi "mixins/sections-api";
import AuthLib "lib/auth";
import AuthTypes "types/auth";
import TestTypes "types/tests";
import SectionTypes "types/sections";
import MasteryApi "mixins/mastery-api";

import MasteryTypes "types/mastery";

// ══════════════════════════════════════════════════════════════════════════════
// Composition root — wires stable state, seeds admin, and includes all mixins.
// No business logic here; all domain logic lives in lib/ and mixins/.
// ══════════════════════════════════════════════════════════════════════════════









actor {
  // ── Object storage infrastructure ───────────────────────────────────────
  include MixinObjectStorage();

  // ── State ────────────────────────────────────────────────────────────────
  let users = Map.empty<Text, AuthTypes.UserRecord>();
  let tests = Map.empty<Nat, TestTypes.Test>();
  let questions = Map.empty<Nat, TestTypes.Question>();
  let testResults = Map.empty<Text, ResultTypes.TestResult>();
  let testProgress = Map.empty<Text, ResultTypes.TestProgress>();

  let sections = Map.empty<Nat, SectionTypes.Section>();
  let mastery = Map.empty<Text, MasteryTypes.QuestionMastery>();
  let nextTestId = { var value : Nat = 1 };
  let nextQuestionId = { var value : Nat = 1 };
  let nextSectionId = { var value : Nat = 1 };
  let nextTotpCounter = { var value : Nat = 1 };

  // ── Seed admin account & downgrade legacy admins ──────────────────────────
  // Username and password are both 'abcd' — defined as constants in AuthLib.
  do { AuthLib.seedAdmin(users, AuthLib.SEEDED_ADMIN_USERNAME, AuthLib.SEEDED_ADMIN_PASSWORD) };

  // ── Mixins ───────────────────────────────────────────────────────────────
  include AuthApi(users, nextTotpCounter);
  include TestsApi(users, tests, questions, sections, nextTestId, nextQuestionId);
  include ResultsApi(questions, sections, testResults, testProgress, mastery);
  include SectionsApi(users, tests, questions, sections, nextSectionId);
  include MasteryApi(users, tests, questions, mastery, testResults, sections);
};
