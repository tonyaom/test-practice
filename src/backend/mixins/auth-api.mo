import Map "mo:core/Map";
import Time "mo:core/Time";
import AuthTypes "../types/auth";
import AuthLib "../lib/auth";

// ══════════════════════════════════════════════════════════════════════════════
// Auth API mixin — public surface for authentication and user profile management.
// PUBLIC operations (no auth): register, login
// AUTHENTICATED USER operations: getUserRole, updatePassword, updateProfile,
//                                getTwoFAStatus, setup2FA, enable2FA,
//                                disable2FA, verifyTOTPLogin
// Delegates all business logic to AuthLib. No inline domain logic.
// ══════════════════════════════════════════════════════════════════════════════

mixin (users : Map.Map<Text, AuthTypes.UserRecord>, nextTotpCounter : { var value : Nat }) {
  /// Register a new user account (role: user)
  public shared func register(username : Text, password : Text) : async { #ok; #err : Text } {
    AuthLib.registerUser(users, username, password);
  };

  /// Login with username and password (admin or user)
  public shared func login(username : Text, password : Text) : async AuthTypes.LoginResult {
    AuthLib.loginUser(users, username, password);
  };

  /// Get the role for a username (returns null if user does not exist)
  public query func getUserRole(username : Text) : async ?AuthTypes.UserRole {
    AuthLib.getUserRole(users, username);
  };

  /// Update password — verifies current password before applying change
  public shared func updatePassword(username : Text, currentPassword : Text, newPassword : Text) : async { #ok; #err : Text } {
    AuthLib.updatePassword(users, username, currentPassword, newPassword);
  };

  /// Update display name for a user profile
  public shared func updateProfile(username : Text, displayName : Text) : async { #ok; #err : Text } {
    AuthLib.updateProfile(users, username, displayName);
  };

  /// Returns true if the user has 2FA enabled, false otherwise.
  public query func getTwoFAStatus(username : Text) : async Bool {
    AuthLib.getTwoFAStatus(users, username);
  };

  // ── 2FA ────────────────────────────────────────────────────────────────────────

  /// Generate and store a pending TOTP secret for the user.
  /// Returns (secret: base32 Text, otpauthUri: Text) for display/QR.
  public shared func setup2FA(username : Text) : async { #ok : (Text, Text); #err : Text } {
    let counter = nextTotpCounter.value;
    nextTotpCounter.value += 1;
    AuthLib.setup2FA(users, username, counter, "TestPractice");
  };

  /// Confirm the pending TOTP secret by validating a live code.
  /// Sets totpEnabled = true when code is correct.
  public shared func enable2FA(username : Text, code : Text) : async { #ok; #err : Text } {
    AuthLib.enable2FA(users, username, code, Time.now());
  };

  /// Disable 2FA after verifying password + live TOTP code.
  public shared func disable2FA(username : Text, password : Text, code : Text) : async { #ok; #err : Text } {
    AuthLib.disable2FA(users, username, password, code, Time.now());
  };

  /// Complete a 2FA-gated login by verifying the TOTP code.
  /// Returns a full UserSession on success.
  public shared func verifyTOTPLogin(username : Text, code : Text) : async { #ok : AuthTypes.UserSession; #err : Text } {
    AuthLib.verifyTOTPLogin(users, username, code, Time.now());
  };
};
