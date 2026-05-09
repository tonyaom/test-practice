import Map "mo:core/Map";
import Types "../types/sections";
import TestTypes "../types/tests";
import Time "mo:core/Time";

/// Sections domain logic: CRUD for Section entities with cascading question
/// deletion on section removal.
/// Stateless functions that receive explicit Map state parameters.
module {
  public func createSection(
    sections : Map.Map<Nat, Types.Section>,
    nextId : Nat,
    testId : Nat,
    input : Types.CreateSectionInput,
  ) : Types.Section {
    let section : Types.Section = {
      id = nextId;
      testId;
      name = input.name;
      description = input.description;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    sections.add(nextId, section);
    section;
  };

  public func updateSection(
    sections : Map.Map<Nat, Types.Section>,
    sectionId : Nat,
    input : Types.UpdateSectionInput,
  ) : ?Types.Section {
    switch (sections.get(sectionId)) {
      case null { null };
      case (?existing) {
        let updated : Types.Section = { existing with name = input.name; description = input.description; updatedAt = Time.now() };
        sections.add(sectionId, updated);
        ?updated;
      };
    };
  };

  /// Deletes the section and all questions belonging to it.
  public func deleteSection(
    sections : Map.Map<Nat, Types.Section>,
    questions : Map.Map<Nat, TestTypes.Question>,
    sectionId : Nat,
  ) : Bool {
    switch (sections.get(sectionId)) {
      case null { false };
      case (?_) {
        sections.remove(sectionId);
        let toDelete = questions.entries().filter(
          func((_, q) : (Nat, TestTypes.Question)) : Bool {
            switch (q.sectionId) { case (?sid) { sid == sectionId }; case null { false } };
          }
        ).map(
          func((id, _) : (Nat, TestTypes.Question)) : Nat { id }
        ).toArray();
        for (qid in toDelete.values()) {
          questions.remove(qid);
        };
        true;
      };
    };
  };

  public func getSection(
    sections : Map.Map<Nat, Types.Section>,
    sectionId : Nat,
  ) : ?Types.Section {
    sections.get(sectionId);
  };

  public func listSectionsForTest(
    sections : Map.Map<Nat, Types.Section>,
    testId : Nat,
  ) : [Types.Section] {
    let filtered = sections.values().filter(
      func(s : Types.Section) : Bool { s.testId == testId }
    ).toArray();
    filtered.sort(func(a : Types.Section, b : Types.Section) : { #less; #equal; #greater } {
      if (a.createdAt < b.createdAt) { #less }
      else if (a.createdAt > b.createdAt) { #greater }
      else { #equal };
    });
  };
};
