import Map "mo:core/Map";
import SectionsLib "../lib/sections";
import TestsLib "../lib/tests";
import SectionTypes "../types/sections";
import TestTypes "../types/tests";
import Debug "mo:core/Debug";

// ══════════════════════════════════════════════════════════════════════════════
// Unit tests for SectionsLib
// ══════════════════════════════════════════════════════════════════════════════

let passed = { var value : Nat = 0 };
let failed = { var value : Nat = 0 };

func ok(testName : Text, cond : Bool) {
  if (cond) {
    Debug.print("  PASS  " # testName);
    passed.value += 1;
  } else {
    Debug.print("  FAIL  " # testName);
    failed.value += 1;
  };
};

// ── Helpers ──────────────────────────────────────────────────────────────────

func emptySections() : Map.Map<Nat, SectionTypes.Section> {
  Map.empty<Nat, SectionTypes.Section>()
};

func emptyQuestions() : Map.Map<Nat, TestTypes.Question> {
  Map.empty<Nat, TestTypes.Question>()
};

func makeCreateInput(name : Text, description : Text) : SectionTypes.CreateSectionInput {
  { name; description }
};

func makeUpdateInput(name : Text, description : Text) : SectionTypes.UpdateSectionInput {
  { name; description }
};

func makeQuestion(id : Nat, testId : Nat, sectionId : ?Nat) : TestTypes.Question {
  {
    id;
    testId;
    sectionId;
    text = "Q" # debug_show(id);
    questionType = #mcSingle;
    options = ["a", "b"];
    correctAnswers = [0];
    correctOrder = [];
    correctText = "";
    imageBlob = null;
    explanation = null;
    orderIndex = 0;
    questionUpdatedAt = 0;
    audioUrl = null;
    audioBlob = null;
    audioDownloadStatus = null;
  }
};

// ── createSection ─────────────────────────────────────────────────────────────
Debug.print("createSection:");

do {
  let secs = emptySections();
  let s = SectionsLib.createSection(secs, 1, 42, makeCreateInput("Section A", "Desc A"));
  ok("createSection: id matches nextId", s.id == 1);
  ok("createSection: testId stored", s.testId == 42);
  ok("createSection: name stored", s.name == "Section A");
  ok("createSection: description stored", s.description == "Desc A");
  ok("createSection: createdAt non-zero", s.createdAt != 0);
  ok("createSection: updatedAt non-zero", s.updatedAt != 0);
  ok("createSection: section added to map", secs.size() == 1);
};

do {
  // Creating a section with empty name and description
  let secs = emptySections();
  let s = SectionsLib.createSection(secs, 5, 10, makeCreateInput("", ""));
  ok("createSection: empty name stored as empty", s.name == "");
  ok("createSection: empty description stored as empty", s.description == "");
};

do {
  // Creating multiple sections for the same test
  let secs = emptySections();
  let s1 = SectionsLib.createSection(secs, 1, 99, makeCreateInput("Section 1", ""));
  let s2 = SectionsLib.createSection(secs, 2, 99, makeCreateInput("Section 2", ""));
  let s3 = SectionsLib.createSection(secs, 3, 99, makeCreateInput("Section 3", ""));
  ok("createSection: multiple sections map size = 3", secs.size() == 3);
  ok("createSection: s1.id = 1", s1.id == 1);
  ok("createSection: s2.id = 2", s2.id == 2);
  ok("createSection: s3.id = 3", s3.id == 3);
  ok("createSection: all belong to testId 99", s1.testId == 99 and s2.testId == 99 and s3.testId == 99);
};

// ── updateSection ─────────────────────────────────────────────────────────────
Debug.print("updateSection:");

do {
  let secs = emptySections();
  ignore SectionsLib.createSection(secs, 1, 10, makeCreateInput("Old Name", "Old Desc"));
  let result = SectionsLib.updateSection(secs, 1, makeUpdateInput("New Name", "New Desc"));
  switch (result) {
    case null { ok("updateSection: returned ?Section not null", false) };
    case (?s) {
      ok("updateSection: name updated", s.name == "New Name");
      ok("updateSection: description updated", s.description == "New Desc");
      ok("updateSection: id unchanged", s.id == 1);
      ok("updateSection: testId unchanged", s.testId == 10);
      ok("updateSection: updatedAt is non-zero", s.updatedAt != 0);
    };
  };
  // Verify map reflects update
  switch (secs.get(1)) {
    case null { ok("updateSection: map reflects new name", false) };
    case (?s) { ok("updateSection: map reflects new name", s.name == "New Name") };
  };
};

do {
  // Updating a non-existent section returns null
  let secs = emptySections();
  let result = SectionsLib.updateSection(secs, 999, makeUpdateInput("X", "Y"));
  ok("updateSection: non-existent returns null", result == null);
};

do {
  // Update preserves createdAt
  let secs = emptySections();
  let original = SectionsLib.createSection(secs, 1, 10, makeCreateInput("Orig", ""));
  let result = SectionsLib.updateSection(secs, 1, makeUpdateInput("Changed", ""));
  switch (result) {
    case null { ok("updateSection: preserves createdAt", false) };
    case (?s) {
      ok("updateSection: preserves createdAt", s.createdAt == original.createdAt);
    };
  };
};

// ── getSection ────────────────────────────────────────────────────────────────
Debug.print("getSection:");

do {
  let secs = emptySections();
  let created = SectionsLib.createSection(secs, 7, 3, makeCreateInput("Sec", "D"));
  let fetched = SectionsLib.getSection(secs, 7);
  switch (fetched) {
    case null { ok("getSection: returns created section", false) };
    case (?s) {
      ok("getSection: id matches", s.id == created.id);
      ok("getSection: name matches", s.name == created.name);
    };
  };
};

do {
  let secs = emptySections();
  let result = SectionsLib.getSection(secs, 404);
  ok("getSection: returns null for unknown id", result == null);
};

// ── deleteSection ─────────────────────────────────────────────────────────────
Debug.print("deleteSection:");

do {
  // Delete existing section
  let secs = emptySections();
  let qs = emptyQuestions();
  ignore SectionsLib.createSection(secs, 1, 10, makeCreateInput("Sec", ""));
  let deleted = SectionsLib.deleteSection(secs, qs, 1);
  ok("deleteSection: returns true for existing section", deleted);
  ok("deleteSection: section removed from map", secs.size() == 0);
};

do {
  // Delete non-existent section returns false
  let secs = emptySections();
  let qs = emptyQuestions();
  let result = SectionsLib.deleteSection(secs, qs, 999);
  ok("deleteSection: returns false for non-existent", not result);
};

do {
  // Deleting a section cascades to its questions
  let secs = emptySections();
  let qs = emptyQuestions();
  ignore SectionsLib.createSection(secs, 1, 10, makeCreateInput("Sec", ""));
  // Add questions assigned to section 1
  qs.add(10, makeQuestion(10, 1, ?1));
  qs.add(11, makeQuestion(11, 1, ?1));
  // Add a question belonging to a different section — should NOT be deleted
  qs.add(12, makeQuestion(12, 1, ?2));
  // Add a question with no section — should NOT be deleted
  qs.add(13, makeQuestion(13, 1, null));
  let deleted = SectionsLib.deleteSection(secs, qs, 1);
  ok("deleteSection cascade: returns true", deleted);
  ok("deleteSection cascade: section 1 questions removed", qs.get(10) == null and qs.get(11) == null);
  ok("deleteSection cascade: other section question preserved", qs.get(12) != null);
  ok("deleteSection cascade: no-section question preserved", qs.get(13) != null);
  ok("deleteSection cascade: 2 questions remain", qs.size() == 2);
};

do {
  // Deleting a section with no questions
  let secs = emptySections();
  let qs = emptyQuestions();
  ignore SectionsLib.createSection(secs, 5, 20, makeCreateInput("Empty", ""));
  let deleted = SectionsLib.deleteSection(secs, qs, 5);
  ok("deleteSection: section with no questions deletes cleanly", deleted);
  ok("deleteSection: question map unchanged", qs.size() == 0);
};

// ── listSectionsForTest ───────────────────────────────────────────────────────
Debug.print("listSectionsForTest:");

do {
  // Returns only sections for the requested test
  let secs = emptySections();
  ignore SectionsLib.createSection(secs, 1, 10, makeCreateInput("A", ""));
  ignore SectionsLib.createSection(secs, 2, 10, makeCreateInput("B", ""));
  ignore SectionsLib.createSection(secs, 3, 99, makeCreateInput("Other", ""));
  let list = SectionsLib.listSectionsForTest(secs, 10);
  ok("listSectionsForTest: returns 2 sections for test 10", list.size() == 2);
  ok("listSectionsForTest: no sections for other test", SectionsLib.listSectionsForTest(secs, 99).size() == 1);
  ok("listSectionsForTest: no sections for unknown test", SectionsLib.listSectionsForTest(secs, 404).size() == 0);
};

do {
  // Empty sections map returns empty list
  let secs = emptySections();
  let list = SectionsLib.listSectionsForTest(secs, 1);
  ok("listSectionsForTest: empty map returns empty list", list.size() == 0);
};

do {
  // All sections belong to different tests
  let secs = emptySections();
  ignore SectionsLib.createSection(secs, 1, 1, makeCreateInput("T1S1", ""));
  ignore SectionsLib.createSection(secs, 2, 2, makeCreateInput("T2S1", ""));
  ignore SectionsLib.createSection(secs, 3, 3, makeCreateInput("T3S1", ""));
  ok("listSectionsForTest: each test gets exactly its own sections",
    SectionsLib.listSectionsForTest(secs, 1).size() == 1 and
    SectionsLib.listSectionsForTest(secs, 2).size() == 1 and
    SectionsLib.listSectionsForTest(secs, 3).size() == 1
  );
};

// ── Multiple sections round-trip ──────────────────────────────────────────────
Debug.print("sections round-trip:");

do {
  // Create, update, then list
  let secs = emptySections();
  ignore SectionsLib.createSection(secs, 1, 5, makeCreateInput("First", "Desc1"));
  ignore SectionsLib.createSection(secs, 2, 5, makeCreateInput("Second", "Desc2"));
  ignore SectionsLib.updateSection(secs, 2, makeUpdateInput("Second Renamed", "NewDesc"));
  let list = SectionsLib.listSectionsForTest(secs, 5);
  ok("round-trip: 2 sections listed after create+update", list.size() == 2);
  let names = list.map(func(s : SectionTypes.Section) : Text { s.name });
  ok("round-trip: renamed section has new name", names.find(func(n) { n == "Second Renamed" }) != null);
};

do {
  // Create then delete, list should be empty
  let secs = emptySections();
  let qs = emptyQuestions();
  ignore SectionsLib.createSection(secs, 1, 5, makeCreateInput("Only", ""));
  ignore SectionsLib.deleteSection(secs, qs, 1);
  let list = SectionsLib.listSectionsForTest(secs, 5);
  ok("round-trip: list empty after delete", list.size() == 0);
};

// ── Summary ───────────────────────────────────────────────────────────────────
Debug.print("");
Debug.print("Results: " # debug_show(passed.value) # " passed, " # debug_show(failed.value) # " failed");
assert failed.value == 0;
