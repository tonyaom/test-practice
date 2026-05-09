import Map "mo:core/Map";
import AuthTypes "../types/auth";

/// Migration: adds displayName : ?Text to UserRecord (was missing in v1)
module {
  /// Old UserRecord shape before displayName was added
  public type UserRecordV0 = {
    username : Text;
    passwordHash : Text;
    role : AuthTypes.UserRole;
  };

  /// Migrate a single old record to the new shape
  public func migrateRecord(old : UserRecordV0) : AuthTypes.UserRecord = {
    username = old.username;
    passwordHash = old.passwordHash;
    role = old.role;
    displayName = null;
  };

  /// Migrate the full users map from old shape to new shape
  public func migrateUsers(
    oldUsers : Map.Map<Text, UserRecordV0>,
  ) : Map.Map<Text, AuthTypes.UserRecord> {
    let newUsers = Map.empty<Text, AuthTypes.UserRecord>();
    for ((k, v) in oldUsers.entries()) {
      newUsers.add(k, migrateRecord(v));
    };
    newUsers;
  };
};
