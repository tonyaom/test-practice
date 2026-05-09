
/// Section and CreateSectionInput / UpdateSectionInput types.
/// Single source of truth for the sections domain schema.
module {
  public type Section = {
    id : Nat;
    testId : Nat;
    name : Text;
    description : Text;
    createdAt : Int;
    updatedAt : Int; // updated whenever section metadata changes
  };

  public type CreateSectionInput = {
    name : Text;
    description : Text;
  };

  public type UpdateSectionInput = {
    name : Text;
    description : Text;
  };
};
