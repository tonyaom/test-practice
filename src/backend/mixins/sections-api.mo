import Map "mo:core/Map";
import AuthTypes "../types/auth";
import TestTypes "../types/tests";
import SectionTypes "../types/sections";
import SectionLib "../lib/sections";
import AuthLib "../lib/auth";
import Time "mo:core/Time";

// ══════════════════════════════════════════════════════════════════════════════
// Sections API mixin — public surface for section management.
// ADMIN-ONLY operations: createSection, updateSection, deleteSection
// USER-FACING  operations: getSection, listSectionsForTest (public query)
// Delegates all business logic to SectionLib. requireAdmin guard from AuthLib.
// ══════════════════════════════════════════════════════════════════════════════

mixin (
  users : Map.Map<Text, AuthTypes.UserRecord>,
  tests : Map.Map<Nat, TestTypes.Test>,
  questions : Map.Map<Nat, TestTypes.Question>,
  sections : Map.Map<Nat, SectionTypes.Section>,
  nextSectionId : { var value : Nat },
) {

  // ── Section CRUD (admin only) ─────────────────────────────────────────────

  public shared func createSection(
    username : Text,
    testId : Nat,
    input : SectionTypes.CreateSectionInput,
  ) : async SectionTypes.Section {
    AuthLib.requireAdmin(users, username);
    let id = nextSectionId.value;
    nextSectionId.value := nextSectionId.value + 1;
    let section = SectionLib.createSection(sections, id, testId, input);
    // Bump parent test updatedAt
    switch (tests.get(testId)) {
      case (?t) { tests.add(testId, { t with updatedAt = Time.now() }) };
      case null {};
    };
    section;
  };

  public shared func updateSection(
    username : Text,
    sectionId : Nat,
    input : SectionTypes.UpdateSectionInput,
  ) : async ?SectionTypes.Section {
    AuthLib.requireAdmin(users, username);
    let testIdOpt : ?Nat = switch (sections.get(sectionId)) {
      case (?s) { ?s.testId };
      case null { null };
    };
    let result = SectionLib.updateSection(sections, sectionId, input);
    switch (testIdOpt) {
      case (?tid) {
        switch (tests.get(tid)) {
          case (?t) { tests.add(tid, { t with updatedAt = Time.now() }) };
          case null {};
        };
      };
      case null {};
    };
    result;
  };

  /// Deletes the section and all its questions.
  public shared func deleteSection(username : Text, sectionId : Nat) : async Bool {
    AuthLib.requireAdmin(users, username);
    let testIdOpt : ?Nat = switch (sections.get(sectionId)) {
      case (?s) { ?s.testId };
      case null { null };
    };
    let deleted = SectionLib.deleteSection(sections, questions, sectionId);
    if (deleted) {
      switch (testIdOpt) {
        case (?tid) {
          switch (tests.get(tid)) {
            case (?t) { tests.add(tid, { t with updatedAt = Time.now() }) };
            case null {};
          };
        };
        case null {};
      };
    };
    deleted;
  };

  public query func getSection(sectionId : Nat) : async ?SectionTypes.Section {
    SectionLib.getSection(sections, sectionId);
  };

  public query func listSectionsForTest(testId : Nat) : async [SectionTypes.Section] {
    SectionLib.listSectionsForTest(sections, testId);
  };
};
