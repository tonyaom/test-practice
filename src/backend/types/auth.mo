/// Auth domain types: UserRecord, UserRole, LoginResult, UserSession.
/// Single source of truth for all authentication and authorisation types.
module {
  public type UserRecord = {
    username : Text;
    passwordHash : Text;
    role : UserRole;
    displayName : ?Text;
    totpSecret : Text;   // base32-encoded TOTP secret; empty string = not set
    totpEnabled : Bool;  // true = 2FA is active
    isActive : Bool;     // false = account deactivated by admin
  };

  public type UserRole = {
    #admin;
    #user;
  };

  public type LoginResult = {
    #ok : UserSession;
    #err : Text;
    #requiresTOTP; // password correct but 2FA required — call verifyTOTPLogin
    #accountDeactivated; // account has been deactivated by an admin
  };

  public type UserSession = {
    username : Text;
    role : UserRole;
    displayName : ?Text;
  };
};
