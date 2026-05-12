import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Types "../types/auth";
import Runtime "mo:core/Runtime";
import TOTPLib "totp";

/// Auth domain logic: password hashing, user registration, login, RBAC guards,
/// profile management, and TOTP-based 2FA lifecycle.
/// No API concerns — all functions receive explicit state parameters.
module {
  /// Single source of truth for the seeded admin username and password.
  /// Referenced by seedAdmin, requireNotSeededAdmin, and tests.
  /// Defined once here to prevent credential typos across the codebase.
  public let SEEDED_ADMIN_USERNAME : Text = "abcd";
  public let SEEDED_ADMIN_PASSWORD : Text = "abcd";
  // Simple deterministic hash using Char.toNat32 (built-in).
  // Not cryptographically secure but sufficient for this app.
  public func hashPassword(password : Text) : Text {
    var h : Nat32 = 5381;
    for (c in password.toIter()) {
      let code = Char.toNat32(c);
      h := ((h << 5) +% h) +% code;
    };
    Nat.fromNat32(h).toText();
  };

  public func verifyPassword(password : Text, hash : Text) : Bool {
    hashPassword(password) == hash;
  };

  public func usernameExists(users : Map.Map<Text, Types.UserRecord>, username : Text) : Bool {
    users.containsKey(username);
  };

  public func registerUser(
    users : Map.Map<Text, Types.UserRecord>,
    username : Text,
    password : Text,
  ) : { #ok; #err : Text } {
    if (usernameExists(users, username)) {
      return #err("Username already taken");
    };
    if (username.size() == 0) {
      return #err("Username cannot be empty");
    };
    if (password.size() == 0) {
      return #err("Password cannot be empty");
    };
    let record : Types.UserRecord = {
      username;
      passwordHash = hashPassword(password);
      role = #user;
      displayName = null;
      totpSecret = "";
      totpEnabled = false;
      isActive = true;
    };
    users.add(username, record);
    #ok;
  };

  public func loginUser(
    users : Map.Map<Text, Types.UserRecord>,
    username : Text,
    password : Text,
  ) : Types.LoginResult {
    switch (users.get(username)) {
      case null { #err("Invalid username or password") };
      case (?record) {
        if (not record.isActive) {
          return #accountDeactivated;
        };
        if (verifyPassword(password, record.passwordHash)) {
          if (record.totpEnabled) {
            #requiresTOTP
          } else {
            #ok({ username = record.username; role = record.role; displayName = record.displayName })
          }
        } else {
          #err("Invalid username or password")
        }
      };
    };
  };

  public func updatePassword(
    users : Map.Map<Text, Types.UserRecord>,
    username : Text,
    currentPassword : Text,
    newPassword : Text,
  ) : { #ok; #err : Text } {
    switch (users.get(username)) {
      case null { #err("User not found") };
      case (?record) {
        if (not verifyPassword(currentPassword, record.passwordHash)) {
          return #err("Current password is incorrect");
        };
        if (newPassword.size() == 0) {
          return #err("New password cannot be empty");
        };
        let updated : Types.UserRecord = { record with passwordHash = hashPassword(newPassword) };
        users.add(username, updated);
        #ok;
      };
    };
  };

  public func updateProfile(
    users : Map.Map<Text, Types.UserRecord>,
    username : Text,
    displayName : Text,
  ) : { #ok; #err : Text } {
    switch (users.get(username)) {
      case null { #err("User not found") };
      case (?record) {
        let updated : Types.UserRecord = { record with displayName = ?(displayName) };
        users.add(username, updated);
        #ok;
      };
    };
  };

  /// Guard: traps if the given username is not an admin.
  public func requireAdmin(users : Map.Map<Text, Types.UserRecord>, username : Text) {
    switch (users.get(username)) {
      case (?record) {
        if (record.role != #admin) {
          Runtime.trap("Unauthorized: admin only");
        };
      };
      case null { Runtime.trap("Unauthorized: unknown user") };
    };
  };

  /// Guard: traps if the given username is the seeded system administrator.
  /// Use before any destructive admin operation (deactivate, delete).
  /// Guard: traps if the given username is the seeded system administrator.
  /// Use before any destructive admin operation (deactivate, delete).
  public func requireNotSeededAdmin(username : Text) {
    if (username == SEEDED_ADMIN_USERNAME) {
      Runtime.trap("Cannot modify the system administrator account");
    };
  };

  /// Permanently delete a user record.
  /// Callers must have already verified:
  ///   - caller is admin (requireAdmin)
  ///   - target is not the seeded admin (requireNotSeededAdmin)
  ///   - target is not the caller themselves
  public func deleteUser(
    users : Map.Map<Text, Types.UserRecord>,
    username : Text,
  ) : { #ok; #err : Text } {
    switch (users.get(username)) {
      case null { #err("User not found") };
      case (?_) {
        users.remove(username);
        #ok;
      };
    };
  };

  /// Returns the role for the given username, or null if not found.
  public func getUserRole(users : Map.Map<Text, Types.UserRecord>, username : Text) : ?Types.UserRole {
    switch (users.get(username)) {
      case null { null };
      case (?record) { ?record.role };
    };
  };

  /// Returns true if the user has 2FA enabled, false if not or not found.
  public func getTwoFAStatus(users : Map.Map<Text, Types.UserRecord>, username : Text) : Bool {
    switch (users.get(username)) {
      case null { false };
      case (?record) { record.totpEnabled };
    };
  };

  /// Seed the admin account if it doesn't exist. Ensure it has role=#admin and isActive=true.
  /// Downgrades all other users who were previously assigned role=#admin to #user.
  /// Uses a two-pass strategy (collect first, update after) to avoid mutating the Map
  /// while iterating — the root cause of the v47 login corruption bug.
  public func seedAdmin(
    users : Map.Map<Text, Types.UserRecord>,
    adminUsername : Text,
    adminPassword : Text,
  ) {
    // Pass 1 — ensure admin account exists, has role=#admin, and isActive=true.
    switch (users.get(adminUsername)) {
      case null {
        let adminRecord : Types.UserRecord = {
          username = adminUsername;
          passwordHash = hashPassword(adminPassword);
          role = #admin;
          displayName = null;
          totpSecret = "";
          totpEnabled = false;
          isActive = true;
        };
        users.add(adminUsername, adminRecord);
      };
      case (?existing) {
        // Repair role or isActive if either is wrong; never touch passwordHash.
        if (existing.role != #admin or not existing.isActive) {
          users.add(adminUsername, { existing with role = #admin; isActive = true });
        };
      };
    };
    // Pass 2 — collect keys of rogue admins FIRST (snapshot), then downgrade.
    // Never mutate `users` while iterating it — doing so corrupts the B-tree.
    let allKeys : [Text] = users.keys().toArray();
    for (key in allKeys.values()) {
      if (key != adminUsername) {
        switch (users.get(key)) {
          case (?record) {
            if (record.role == #admin) {
              users.add(key, { record with role = #user });
            };
          };
          case null {};
        };
      };
    };
  };

  // ── 2FA helpers ────────────────────────────────────────────────────────────

  /// Stores a pending TOTP secret for the user (not yet enabled).
  /// Returns (secret, otpauthUri).
  public func setup2FA(
    users : Map.Map<Text, Types.UserRecord>,
    username : Text,
    counter : Nat,
    issuer : Text,
  ) : { #ok : (Text, Text); #err : Text } {
    switch (users.get(username)) {
      case null { #err("User not found") };
      case (?record) {
        let secret = TOTPLib.generateSecret(username, counter);
        let uri = TOTPLib.makeOtpAuthUri(secret, username, issuer);
        let updated : Types.UserRecord = { record with totpSecret = secret; totpEnabled = false };
        users.add(username, updated);
        #ok(secret, uri)
      };
    };
  };

  /// Validates the 6-digit code against the stored pending secret.
  /// If valid, activates 2FA.
  public func enable2FA(
    users : Map.Map<Text, Types.UserRecord>,
    username : Text,
    code : Text,
    timeNs : Int,
  ) : { #ok; #err : Text } {
    switch (users.get(username)) {
      case null { #err("User not found") };
      case (?record) {
        if (record.totpSecret == "") {
          return #err("No pending 2FA setup. Call setup2FA first");
        };
        if (not TOTPLib.verifyCode(record.totpSecret, code, timeNs)) {
          return #err("Invalid TOTP code");
        };
        let updated : Types.UserRecord = { record with totpEnabled = true };
        users.add(username, updated);
        #ok
      };
    };
  };

  /// Verifies password and TOTP code, then disables 2FA and clears the secret.
  public func disable2FA(
    users : Map.Map<Text, Types.UserRecord>,
    username : Text,
    password : Text,
    code : Text,
    timeNs : Int,
  ) : { #ok; #err : Text } {
    switch (users.get(username)) {
      case null { #err("User not found") };
      case (?record) {
        if (not verifyPassword(password, record.passwordHash)) {
          return #err("Invalid password");
        };
        if (not record.totpEnabled) {
          return #err("2FA is not enabled");
        };
        if (not TOTPLib.verifyCode(record.totpSecret, code, timeNs)) {
          return #err("Invalid TOTP code");
        };
        let updated : Types.UserRecord = { record with totpSecret = ""; totpEnabled = false };
        users.add(username, updated);
        #ok
      };
    };
  };

  /// Completes login for a 2FA-enabled user by verifying the TOTP code.
  /// Returns the UserSession on success.
  public func verifyTOTPLogin(
    users : Map.Map<Text, Types.UserRecord>,
    username : Text,
    code : Text,
    timeNs : Int,
  ) : { #ok : Types.UserSession; #err : Text } {
    switch (users.get(username)) {
      case null { #err("User not found") };
      case (?record) {
        if (not record.totpEnabled) {
          return #err("2FA is not enabled for this user");
        };
        if (not TOTPLib.verifyCode(record.totpSecret, code, timeNs)) {
          return #err("Invalid TOTP code");
        };
        #ok({ username = record.username; role = record.role; displayName = record.displayName })
      };
    };
  };
};
