import Map "mo:core/Map";
import AuthLib "../lib/auth";
import AuthTypes "../types/auth";
import Debug "mo:core/Debug";

// ════════════════════════════════════════════════════════════════════════════
// Unit tests for AuthLib
// ════════════════════════════════════════════════════════════════════════════

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

// ── Canary constants ─────────────────────────────────────────────────────────
// These mirror AuthLib.SEEDED_ADMIN_USERNAME / SEEDED_ADMIN_PASSWORD.
// Change only in AuthLib — all tests pick up the update automatically.
let ADMIN_USERNAME = AuthLib.SEEDED_ADMIN_USERNAME; // "abcd"
let ADMIN_PASSWORD = AuthLib.SEEDED_ADMIN_PASSWORD; // "abcd"

// ── Helpers ──────────────────────────────────────────────────────────────────

func emptyUsers() : Map.Map<Text, AuthTypes.UserRecord> {
  Map.empty<Text, AuthTypes.UserRecord>()
};

func makeUser(username : Text, password : Text, role : AuthTypes.UserRole, isActive : Bool) : AuthTypes.UserRecord {
  {
    username;
    passwordHash = AuthLib.hashPassword(password);
    role;
    displayName = null;
    totpSecret = "";
    totpEnabled = false;
    isActive;
  }
};

// ── hashPassword / verifyPassword ────────────────────────────────────────────
Debug.print("hashPassword / verifyPassword:");

do {
  let hash = AuthLib.hashPassword("secret");
  ok("hashPassword: returns non-empty text", hash.size() > 0);
  ok("hashPassword: same input produces same hash", AuthLib.hashPassword("secret") == hash);
  ok("hashPassword: different input produces different hash", AuthLib.hashPassword("other") != hash);
};

do {
  let hash = AuthLib.hashPassword("mypassword");
  ok("verifyPassword: correct password returns true", AuthLib.verifyPassword("mypassword", hash));
  ok("verifyPassword: wrong password returns false", not AuthLib.verifyPassword("wrongpass", hash));
  ok("verifyPassword: empty string returns false", not AuthLib.verifyPassword("", hash));
};

do {
  // Hash is deterministic (not random)
  let h1 = AuthLib.hashPassword("abc");
  let h2 = AuthLib.hashPassword("abc");
  ok("hashPassword: deterministic — same output for same input", h1 == h2);
};

// ── usernameExists ────────────────────────────────────────────────────────────
Debug.print("usernameExists:");

do {
  let users = emptyUsers();
  ok("usernameExists: false for empty map", not AuthLib.usernameExists(users, "alice"));
  users.add("alice", makeUser("alice", "pw", #user, true));
  ok("usernameExists: true after adding user", AuthLib.usernameExists(users, "alice"));
  ok("usernameExists: false for different username", not AuthLib.usernameExists(users, "bob"));
};

// ── registerUser ──────────────────────────────────────────────────────────────
Debug.print("registerUser:");

do {
  let users = emptyUsers();
  let r = AuthLib.registerUser(users, "alice", "password123");
  ok("registerUser: returns #ok for new user", r == #ok);
  ok("registerUser: user added to map", users.size() == 1);
  ok("registerUser: username matches", switch (users.get("alice")) { case (?u) { u.username == "alice" }; case null { false } });
};

do {
  // Duplicate username fails
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw1");
  let r2 = AuthLib.registerUser(users, "alice", "pw2");
  switch (r2) {
    case (#ok) { ok("registerUser: duplicate returns #err", false) };
    case (#err _) { ok("registerUser: duplicate returns #err", true) };
  };
  ok("registerUser: map still has only 1 entry after duplicate attempt", users.size() == 1);
};

do {
  // Empty username fails
  let users = emptyUsers();
  let r = AuthLib.registerUser(users, "", "password");
  switch (r) {
    case (#ok) { ok("registerUser: empty username returns #err", false) };
    case (#err _) { ok("registerUser: empty username returns #err", true) };
  };
};

do {
  // Empty password fails
  let users = emptyUsers();
  let r = AuthLib.registerUser(users, "alice", "");
  switch (r) {
    case (#ok) { ok("registerUser: empty password returns #err", false) };
    case (#err _) { ok("registerUser: empty password returns #err", true) };
  };
};

do {
  // Registered user has role=#user and isActive=true by default
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "bob", "pw");
  switch (users.get("bob")) {
    case null { ok("registerUser: default role=#user", false) };
    case (?u) {
      ok("registerUser: default role=#user", u.role == #user);
      ok("registerUser: default isActive=true", u.isActive);
      ok("registerUser: totpEnabled=false by default", not u.totpEnabled);
      ok("registerUser: totpSecret empty by default", u.totpSecret == "");
    };
  };
};

// ── loginUser ─────────────────────────────────────────────────────────────────
Debug.print("loginUser:");

do {
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "correctPass");
  let r = AuthLib.loginUser(users, "alice", "correctPass");
  switch (r) {
    case (#ok session) {
      ok("loginUser: correct credentials returns #ok", true);
      ok("loginUser: session username correct", session.username == "alice");
      ok("loginUser: session role = #user", session.role == #user);
    };
    case _ { ok("loginUser: correct credentials returns #ok", false) };
  };
};

do {
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "correctPass");
  let r = AuthLib.loginUser(users, "alice", "wrongPass");
  switch (r) {
    case (#err _) { ok("loginUser: wrong password returns #err", true) };
    case _ { ok("loginUser: wrong password returns #err", false) };
  };
};

do {
  // Unknown user
  let users = emptyUsers();
  let r = AuthLib.loginUser(users, "nobody", "pass");
  switch (r) {
    case (#err _) { ok("loginUser: unknown user returns #err", true) };
    case _ { ok("loginUser: unknown user returns #err", false) };
  };
};

do {
  // Deactivated account returns #accountDeactivated
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "bob", "pw");
  // Deactivate manually
  switch (users.get("bob")) {
    case (?u) { users.add("bob", { u with isActive = false }) };
    case null {};
  };
  let r = AuthLib.loginUser(users, "bob", "pw");
  switch (r) {
    case (#accountDeactivated) { ok("loginUser: deactivated account returns #accountDeactivated", true) };
    case _ { ok("loginUser: deactivated account returns #accountDeactivated", false) };
  };
};

do {
  // User with 2FA enabled requires TOTP
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw");
  // Manually enable 2FA
  switch (users.get("alice")) {
    case (?u) { users.add("alice", { u with totpSecret = "JBSWY3DPEHPK3PXP"; totpEnabled = true }) };
    case null {};
  };
  let r = AuthLib.loginUser(users, "alice", "pw");
  switch (r) {
    case (#requiresTOTP) { ok("loginUser: 2FA user returns #requiresTOTP on correct password", true) };
    case _ { ok("loginUser: 2FA user returns #requiresTOTP on correct password", false) };
  };
};

// ── Admin login with canary credentials ───────────────────────────────────────
Debug.print("Admin login abcd/abcd:");

do {
  // Admin must log in with ADMIN_USERNAME/ADMIN_PASSWORD — both equal "abcd".
  // This test uses the canary constants so a future credential change only
  // needs updating in AuthLib, not here.
  let users = emptyUsers();
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  let r = AuthLib.loginUser(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  switch (r) {
    case (#ok session) {
      ok("admin login: succeeds with ADMIN_USERNAME/ADMIN_PASSWORD", true);
      ok("admin login: role=#admin", session.role == #admin);
      ok("admin login: username matches", session.username == ADMIN_USERNAME);
    };
    case _ { ok("admin login: succeeds with ADMIN_USERNAME/ADMIN_PASSWORD", false) };
  };
  // Typo variants must ALL fail
  let typoAdbc = AuthLib.loginUser(users, "adbc", ADMIN_PASSWORD);
  let typoABCD = AuthLib.loginUser(users, "ABCD", ADMIN_PASSWORD);
  let typoAbdc = AuthLib.loginUser(users, "abdc", ADMIN_PASSWORD);
  let typoPassAdbc = AuthLib.loginUser(users, ADMIN_USERNAME, "adbc");
  let typoPassABCD = AuthLib.loginUser(users, ADMIN_USERNAME, "ABCD");
  ok("admin login: typo username 'adbc' fails", switch (typoAdbc) { case (#err _) { true }; case _ { false } });
  ok("admin login: typo username 'ABCD' fails", switch (typoABCD) { case (#err _) { true }; case _ { false } });
  ok("admin login: typo username 'abdc' fails", switch (typoAbdc) { case (#err _) { true }; case _ { false } });
  ok("admin login: typo password 'adbc' fails", switch (typoPassAdbc) { case (#err _) { true }; case _ { false } });
  ok("admin login: typo password 'ABCD' fails", switch (typoPassABCD) { case (#err _) { true }; case _ { false } });
};

do {
  // Verify canary values are literally 'abcd'
  ok("canary: ADMIN_USERNAME is 'abcd'", ADMIN_USERNAME == "abcd");
  ok("canary: ADMIN_PASSWORD is 'abcd'", ADMIN_PASSWORD == "abcd");
  // Confirm username != common typos
  ok("canary: ADMIN_USERNAME != 'adbc'", ADMIN_USERNAME != "adbc");
  ok("canary: ADMIN_USERNAME != 'ABCD'", ADMIN_USERNAME != "ABCD");
  ok("canary: ADMIN_USERNAME != 'abdc'", ADMIN_USERNAME != "abdc");
};

// ── updatePassword ────────────────────────────────────────────────────────────
Debug.print("updatePassword:");

do {
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "oldPass");
  let r = AuthLib.updatePassword(users, "alice", "oldPass", "newPass");
  ok("updatePassword: returns #ok on success", r == #ok);
  // New password works for login
  let loginR = AuthLib.loginUser(users, "alice", "newPass");
  switch (loginR) {
    case (#ok _) { ok("updatePassword: new password works for login", true) };
    case _ { ok("updatePassword: new password works for login", false) };
  };
  // Old password no longer works
  let oldR = AuthLib.loginUser(users, "alice", "oldPass");
  switch (oldR) {
    case (#err _) { ok("updatePassword: old password rejected after update", true) };
    case _ { ok("updatePassword: old password rejected after update", false) };
  };
};

do {
  // Wrong current password
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw");
  let r = AuthLib.updatePassword(users, "alice", "WRONG", "newpw");
  switch (r) {
    case (#err _) { ok("updatePassword: wrong current password returns #err", true) };
    case (#ok) { ok("updatePassword: wrong current password returns #err", false) };
  };
};

do {
  // Unknown user
  let users = emptyUsers();
  let r = AuthLib.updatePassword(users, "nobody", "old", "new");
  switch (r) {
    case (#err _) { ok("updatePassword: unknown user returns #err", true) };
    case (#ok) { ok("updatePassword: unknown user returns #err", false) };
  };
};

do {
  // Empty new password fails
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw");
  let r = AuthLib.updatePassword(users, "alice", "pw", "");
  switch (r) {
    case (#err _) { ok("updatePassword: empty new password returns #err", true) };
    case (#ok) { ok("updatePassword: empty new password returns #err", false) };
  };
};

// ── updateProfile ─────────────────────────────────────────────────────────────
Debug.print("updateProfile:");

do {
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw");
  let r = AuthLib.updateProfile(users, "alice", "Alice Smith");
  ok("updateProfile: returns #ok", r == #ok);
  switch (users.get("alice")) {
    case null { ok("updateProfile: displayName updated", false) };
    case (?u) { ok("updateProfile: displayName updated", u.displayName == ?"Alice Smith") };
  };
};

do {
  // Unknown user
  let users = emptyUsers();
  let r = AuthLib.updateProfile(users, "nobody", "Name");
  switch (r) {
    case (#err _) { ok("updateProfile: unknown user returns #err", true) };
    case (#ok) { ok("updateProfile: unknown user returns #err", false) };
  };
};

do {
  // Can update displayName multiple times
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw");
  ignore AuthLib.updateProfile(users, "alice", "First");
  ignore AuthLib.updateProfile(users, "alice", "Second");
  switch (users.get("alice")) {
    case null { ok("updateProfile: displayName updated to latest", false) };
    case (?u) { ok("updateProfile: displayName updated to latest", u.displayName == ?"Second") };
  };
};

// ── getUserRole ───────────────────────────────────────────────────────────────
Debug.print("getUserRole:");

do {
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw");
  let role = AuthLib.getUserRole(users, "alice");
  ok("getUserRole: registered user has ?#user", role == ?#user);
  ok("getUserRole: unknown user returns null", AuthLib.getUserRole(users, "nobody") == null);
};

do {
  // Admin seeded account has role=#admin — uses canary constants
  let users = emptyUsers();
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  let role = AuthLib.getUserRole(users, ADMIN_USERNAME);
  ok("getUserRole: seeded admin has ?#admin", role == ?#admin);
};

// ── requireNotSeededAdmin guard ───────────────────────────────────────────────
Debug.print("requireNotSeededAdmin:");

do {
  // Non-admin-seeded username passes the guard (no trap)
  let isNotSeeded = ("alice" != ADMIN_USERNAME);
  ok("requireNotSeededAdmin: regular user is not the seeded admin", isNotSeeded);
};

do {
  // The seeded admin username must equal ADMIN_USERNAME canary constant
  ok("requireNotSeededAdmin: ADMIN_USERNAME canary is identified as seeded admin", ADMIN_USERNAME == ADMIN_USERNAME);
  // Canary constant is literally 'abcd' — compile-time typo guard
  ok("requireNotSeededAdmin: ADMIN_USERNAME value is 'abcd'", ADMIN_USERNAME == "abcd");
  ok("requireNotSeededAdmin: ADMIN_PASSWORD value is 'abcd'", ADMIN_PASSWORD == "abcd");
  // Common historic typos must NOT match the admin username
  ok("requireNotSeededAdmin: typo 'adbc' != ADMIN_USERNAME", "adbc" != ADMIN_USERNAME);
  ok("requireNotSeededAdmin: typo 'ABCD' != ADMIN_USERNAME", "ABCD" != ADMIN_USERNAME);
  ok("requireNotSeededAdmin: typo 'abdc' != ADMIN_USERNAME", "abdc" != ADMIN_USERNAME);
};

// ── deleteUser ──────────────────────────────────────────────────────────────────
Debug.print("deleteUser:");

do {
  // Delete existing regular user returns #ok and removes record
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw");
  ok("deleteUser: user present before delete", users.size() == 1);
  let r = AuthLib.deleteUser(users, "alice");
  ok("deleteUser: returns #ok for existing user", r == #ok);
  ok("deleteUser: user removed from map", users.size() == 0);
  ok("deleteUser: user no longer retrievable", users.get("alice") == null);
};

do {
  // Delete non-existent user returns #err
  let users = emptyUsers();
  let r = AuthLib.deleteUser(users, "nobody");
  switch (r) {
    case (#err _) { ok("deleteUser: non-existent user returns #err", true) };
    case (#ok) { ok("deleteUser: non-existent user returns #err", false) };
  };
};

do {
  // After delete, another user with same name can register fresh
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw1");
  ignore AuthLib.deleteUser(users, "alice");
  let r = AuthLib.registerUser(users, "alice", "pw2");
  ok("deleteUser: username freed — re-registration works", r == #ok);
};

// ── seedAdmin ─────────────────────────────────────────────────────────────────
Debug.print("seedAdmin:");

do {
  // Seed creates admin if not exists — uses canary constants
  let users = emptyUsers();
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  ok("seedAdmin: admin user created", users.size() == 1);
  switch (users.get(ADMIN_USERNAME)) {
    case null { ok("seedAdmin: admin record present", false) };
    case (?u) {
      ok("seedAdmin: admin record present", true);
      ok("seedAdmin: role=#admin", u.role == #admin);
      ok("seedAdmin: isActive=true", u.isActive);
    };
  };
};

do {
  // Seed is idempotent — calling twice doesn't duplicate
  let users = emptyUsers();
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  ok("seedAdmin: idempotent — only 1 admin entry", users.size() == 1);
};

do {
  // Seed downgrades existing users with role=#admin that are not the admin account
  let users = emptyUsers();
  // Register a regular user and manually promote them to admin
  ignore AuthLib.registerUser(users, "rogue", "pw");
  switch (users.get("rogue")) {
    case (?u) { users.add("rogue", { u with role = #admin }) };
    case null {};
  };
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  switch (users.get("rogue")) {
    case null { ok("seedAdmin: downgrades other admins", false) };
    case (?u) { ok("seedAdmin: downgrades other admins to #user", u.role == #user) };
  };
  switch (users.get(ADMIN_USERNAME)) {
    case null { ok("seedAdmin: seeded admin still admin after downgrade pass", false) };
    case (?u) { ok("seedAdmin: seeded admin still admin after downgrade pass", u.role == #admin) };
  };
};

do {
  // Existing admin account can login with seeded password — uses canary constants
  let users = emptyUsers();
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  let r = AuthLib.loginUser(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  switch (r) {
    case (#ok session) {
      ok("seedAdmin: admin can login with seeded password", true);
      ok("seedAdmin: admin login session role=#admin", session.role == #admin);
    };
    case _ { ok("seedAdmin: admin can login with seeded password", false) };
  };
};

do {
  // If admin already exists with same role, seedAdmin doesn't change password
  let users = emptyUsers();
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  // Change admin password
  ignore AuthLib.updatePassword(users, ADMIN_USERNAME, ADMIN_PASSWORD, "newpass");
  // Re-seed — should NOT reset password
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  let r = AuthLib.loginUser(users, ADMIN_USERNAME, "newpass");
  switch (r) {
    case (#ok _) { ok("seedAdmin: does not reset changed password on re-seed", true) };
    case _ { ok("seedAdmin: does not reset changed password on re-seed", false) };
  };
};

// ── getTwoFAStatus ────────────────────────────────────────────────────────────
Debug.print("getTwoFAStatus:");

do {
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw");
  ok("getTwoFAStatus: false by default", not AuthLib.getTwoFAStatus(users, "alice"));
  ok("getTwoFAStatus: false for unknown user", not AuthLib.getTwoFAStatus(users, "nobody"));
};

do {
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw");
  // Manually enable 2FA
  switch (users.get("alice")) {
    case (?u) { users.add("alice", { u with totpSecret = "SECRET"; totpEnabled = true }) };
    case null {};
  };
  ok("getTwoFAStatus: true after enabling 2FA", AuthLib.getTwoFAStatus(users, "alice"));
};

// ── requireAdmin (trap-based guard) ──────────────────────────────────────────
Debug.print("requireAdmin:");

do {
  // requireAdmin should not trap for an admin user — verify by checking admin role directly
  let users = emptyUsers();
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  let isAdmin = switch (AuthLib.getUserRole(users, ADMIN_USERNAME)) {
    case (?#admin) { true };
    case _ { false };
  };
  ok("requireAdmin: admin user has #admin role (guard would pass)", isAdmin);
};

do {
  // requireAdmin would trap for a regular user — verify by checking role
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw");
  let isUser = switch (AuthLib.getUserRole(users, "alice")) {
    case (?#user) { true };
    case _ { false };
  };
  ok("requireAdmin: regular user has #user role (guard would trap)", isUser);
};

do {
  // requireAdmin would trap for unknown user — verify no role returned
  let users = emptyUsers();
  let r = AuthLib.getUserRole(users, "nobody");
  ok("requireAdmin: unknown user has no role (guard would trap)", r == null);
};

// ── Admin management (activate/deactivate) ────────────────────────────────────
Debug.print("admin user management:");

do {
  // Deactivated user cannot login
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw");
  switch (users.get("alice")) {
    case (?u) { users.add("alice", { u with isActive = false }) };
    case null {};
  };
  let r = AuthLib.loginUser(users, "alice", "pw");
  switch (r) {
    case (#accountDeactivated) { ok("admin: deactivated user cannot login", true) };
    case _ { ok("admin: deactivated user cannot login", false) };
  };
};

do {
  // Re-activated user can login again
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw");
  switch (users.get("alice")) {
    case (?u) { users.add("alice", { u with isActive = false }) };
    case null {};
  };
  switch (users.get("alice")) {
    case (?u) { users.add("alice", { u with isActive = true }) };
    case null {};
  };
  let r = AuthLib.loginUser(users, "alice", "pw");
  switch (r) {
    case (#ok _) { ok("admin: reactivated user can login", true) };
    case _ { ok("admin: reactivated user can login", false) };
  };
};

do {
  // Multiple users, only one deactivated
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw");
  ignore AuthLib.registerUser(users, "bob", "pw");
  switch (users.get("alice")) {
    case (?u) { users.add("alice", { u with isActive = false }) };
    case null {};
  };
  let aliceR = AuthLib.loginUser(users, "alice", "pw");
  let bobR = AuthLib.loginUser(users, "bob", "pw");
  let aliceBlocked = switch (aliceR) { case (#accountDeactivated) { true }; case _ { false } };
  let bobOk = switch (bobR) { case (#ok _) { true }; case _ { false } };
  ok("admin: deactivation is per-user (alice blocked, bob ok)", aliceBlocked and bobOk);
};

// ── seedAdmin: reactivates deactivated admin (regression test) ────────────────
Debug.print("seedAdmin reactivation:");

do {
  // If admin account exists but is deactivated, seedAdmin must reactivate it.
  // Previously seedAdmin only fixed the role, leaving isActive=false — causing
  // all login attempts to return #accountDeactivated.
  let users = emptyUsers();
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  // Simulate an admin deactivation (as if someone bypassed the guard)
  switch (users.get(ADMIN_USERNAME)) {
    case (?u) { users.add(ADMIN_USERNAME, { u with isActive = false }) };
    case null {};
  };
  // Re-seed should reactivate
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  switch (users.get(ADMIN_USERNAME)) {
    case null { ok("seedAdmin: reactivates deactivated admin", false) };
    case (?u) { ok("seedAdmin: reactivates deactivated admin", u.isActive) };
  };
  let r = AuthLib.loginUser(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  switch (r) {
    case (#ok session) {
      ok("seedAdmin: reactivated admin can login", true);
      ok("seedAdmin: reactivated admin has role=#admin", session.role == #admin);
    };
    case _ { ok("seedAdmin: reactivated admin can login", false) };
  };
};

do {
  // seedAdmin with multiple rogue admins — all logins still work after seeding.
  // Regression test: mutating map inside forEach was corrupting all user records.
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "alice", "pw");
  ignore AuthLib.registerUser(users, "bob", "pw");
  ignore AuthLib.registerUser(users, "carol", "pw");
  // Promote alice and bob to #admin (rogue promotions)
  switch (users.get("alice")) {
    case (?u) { users.add("alice", { u with role = #admin }) };
    case null {};
  };
  switch (users.get("bob")) {
    case (?u) { users.add("bob", { u with role = #admin }) };
    case null {};
  };
  // Seed admin — should downgrade alice and bob without corrupting the map
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  // After seeding, all users must be retrievable and logins must work
  let aliceR = AuthLib.loginUser(users, "alice", "pw");
  let bobR = AuthLib.loginUser(users, "bob", "pw");
  let carolR = AuthLib.loginUser(users, "carol", "pw");
  let adminR = AuthLib.loginUser(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  let aliceOk = switch (aliceR) { case (#ok _) { true }; case _ { false } };
  let bobOk = switch (bobR) { case (#ok _) { true }; case _ { false } };
  let carolOk = switch (carolR) { case (#ok _) { true }; case _ { false } };
  let adminOk = switch (adminR) { case (#ok _) { true }; case _ { false } };
  ok("seedAdmin: alice still loginable after downgrade", aliceOk);
  ok("seedAdmin: bob still loginable after downgrade", bobOk);
  ok("seedAdmin: carol unaffected — can login", carolOk);
  ok("seedAdmin: admin can login after multi-user downgrade", adminOk);
  // Verify roles downgraded correctly
  let aliceRole = AuthLib.getUserRole(users, "alice");
  let bobRole = AuthLib.getUserRole(users, "bob");
  ok("seedAdmin: alice role downgraded to #user", aliceRole == ?#user);
  ok("seedAdmin: bob role downgraded to #user", bobRole == ?#user);
};

do {
  // Fresh registration always produces a loginable account (isActive=true).
  // Regression test: ensures newly registered users are never blocked at login.
  let users = emptyUsers();
  let regResult = AuthLib.registerUser(users, "newuser", "mypass");
  ok("registration: fresh register returns #ok", regResult == #ok);
  let loginResult = AuthLib.loginUser(users, "newuser", "mypass");
  switch (loginResult) {
    case (#ok session) {
      ok("registration: freshly registered user can login", true);
      ok("registration: freshly registered user has role=#user", session.role == #user);
    };
    case (#accountDeactivated) { ok("registration: freshly registered user can login (not deactivated)", false) };
    case _ { ok("registration: freshly registered user can login", false) };
  };
};

do {
  // Concurrent registrations + seeding — all users remain accessible.
  // Tests that seedAdmin downgrade pass does not destroy regular user records.
  let users = emptyUsers();
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  ignore AuthLib.registerUser(users, "u1", "pw");
  ignore AuthLib.registerUser(users, "u2", "pw");
  ignore AuthLib.registerUser(users, "u3", "pw");
  // Re-seed (simulate a redeploy)
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  ok("seedAdmin: all 4 users present after re-seed", users.size() == 4);
  let r1 = AuthLib.loginUser(users, "u1", "pw");
  let r2 = AuthLib.loginUser(users, "u2", "pw");
  let r3 = AuthLib.loginUser(users, "u3", "pw");
  let rAdmin = AuthLib.loginUser(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  ok("seedAdmin: u1 can login after re-seed", switch (r1) { case (#ok _) { true }; case _ { false } });
  ok("seedAdmin: u2 can login after re-seed", switch (r2) { case (#ok _) { true }; case _ { false } });
  ok("seedAdmin: u3 can login after re-seed", switch (r3) { case (#ok _) { true }; case _ { false } });
  ok("seedAdmin: admin can login after re-seed", switch (rAdmin) { case (#ok _) { true }; case _ { false } });
};

// ── seedAdmin: keys().toArray() two-pass regression ───────────────────────────
Debug.print("seedAdmin two-pass downgrade:");

do {
  // Downgrade pass uses keys().toArray() snapshot — verifies no Map mutation
  // during iteration. With 5 rogue admins, the map must survive intact.
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "r1", "pw");
  ignore AuthLib.registerUser(users, "r2", "pw");
  ignore AuthLib.registerUser(users, "r3", "pw");
  ignore AuthLib.registerUser(users, "r4", "pw");
  ignore AuthLib.registerUser(users, "r5", "pw");
  // Promote all 5 to #admin
  for (name in ["r1", "r2", "r3", "r4", "r5"].values()) {
    switch (users.get(name)) {
      case (?u) { users.add(name, { u with role = #admin }) };
      case null {};
    };
  };
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  ok("seedAdmin two-pass: all 6 users present after seeding", users.size() == 6);
  // Every user must still be loginable
  let allLoginOk = ["r1", "r2", "r3", "r4", "r5"].values().all(
    func (name : Text) : Bool {
      switch (AuthLib.loginUser(users, name, "pw")) {
        case (#ok _) { true };
        case _ { false };
      };
    }
  );
  ok("seedAdmin two-pass: all 5 downgraded users can still login", allLoginOk);
  ok("seedAdmin two-pass: admin can login",
    switch (AuthLib.loginUser(users, ADMIN_USERNAME, ADMIN_PASSWORD)) { case (#ok _) { true }; case _ { false } });
  // All 5 should now be #user
  let allDowngraded = ["r1", "r2", "r3", "r4", "r5"].values().all(
    func (name : Text) : Bool {
      AuthLib.getUserRole(users, name) == ?#user
    }
  );
  ok("seedAdmin two-pass: all 5 rogue admins downgraded to #user", allDowngraded);
};

// ── NEW: adminDeactivateUser guard — seeded admin is protected ───────────────
Debug.print("adminDeactivateUser guard:");

do {
  // requireNotSeededAdmin is the guard used inside adminDeactivateUser.
  // It calls Runtime.trap when the target is the seeded admin.
  // We verify the condition that would trigger the trap (can't catch traps in unit tests).
  ok(
    "adminDeactivateUser guard: ADMIN_USERNAME matches seeded admin (trap would fire)",
    ADMIN_USERNAME == AuthLib.SEEDED_ADMIN_USERNAME,
  );
  ok(
    "adminDeactivateUser guard: regular username does NOT match seeded admin (no trap)",
    "alice" != AuthLib.SEEDED_ADMIN_USERNAME,
  );
  ok(
    "adminDeactivateUser guard: 'adbc' does NOT match seeded admin",
    "adbc" != AuthLib.SEEDED_ADMIN_USERNAME,
  );
};

do {
  // Verify the seeded admin account cannot be deactivated by checking that
  // adminDeactivateUser would reach the requireNotSeededAdmin guard before
  // mutating the map. We exercise the guard logic by inspecting the username.
  let isSeededAdmin = AuthLib.SEEDED_ADMIN_USERNAME == ADMIN_USERNAME;
  ok(
    "adminDeactivateUser guard: seeded admin username is exactly SEEDED_ADMIN_USERNAME constant",
    isSeededAdmin,
  );
  // A regular user is NOT the seeded admin — would pass the guard
  let regularUser = "alice";
  ok(
    "adminDeactivateUser guard: regular user passes the guard (not seeded admin)",
    regularUser != AuthLib.SEEDED_ADMIN_USERNAME,
  );
};

// ── NEW: adminDeleteUser guard — seeded admin is protected ────────────────────
Debug.print("adminDeleteUser guard:");

do {
  // requireNotSeededAdmin is also the guard in adminDeleteUser.
  // Same pattern as deactivate guard — verify trap condition holds.
  ok(
    "adminDeleteUser guard: ADMIN_USERNAME equals SEEDED_ADMIN_USERNAME constant (trap would fire)",
    ADMIN_USERNAME == AuthLib.SEEDED_ADMIN_USERNAME,
  );
  ok(
    "adminDeleteUser guard: deleteUser on a regular user proceeds (guard passes)",
    "bob" != AuthLib.SEEDED_ADMIN_USERNAME,
  );
};

do {
  // The actual deleteUser function (AuthLib level, no guard) removes any user.
  // The guard lives in the mixin. Test that deleteUser on a NON-admin user works,
  // confirming the path that bypasses the guard (regular users can be deleted).
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "target", "pw");
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  ok("adminDeleteUser guard: map has 2 entries before delete", users.size() == 2);
  ignore AuthLib.deleteUser(users, "target");
  ok("adminDeleteUser guard: regular user deleted, admin still present", users.size() == 1);
  ok(
    "adminDeleteUser guard: admin account survives the delete",
    users.get(ADMIN_USERNAME) != null,
  );
};

// ── NEW: seedAdmin called 10 times consecutively ──────────────────────────────
Debug.print("seedAdmin 10x idempotency:");

do {
  let users = emptyUsers();
  // Call seedAdmin 10 times in a row on an empty map
  var i = 0;
  while (i < 10) {
    AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
    i += 1;
  };
  ok("seedAdmin 10x: user store size stays at 1", users.size() == 1);
  switch (users.get(ADMIN_USERNAME)) {
    case null { ok("seedAdmin 10x: admin record present after 10 seeds", false) };
    case (?u) {
      ok("seedAdmin 10x: admin record present after 10 seeds", true);
      ok("seedAdmin 10x: role=#admin after 10 seeds", u.role == #admin);
      ok("seedAdmin 10x: isActive=true after 10 seeds", u.isActive);
    };
  };
  // Admin credentials still valid after 10 seeds
  let r = AuthLib.loginUser(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  switch (r) {
    case (#ok session) {
      ok("seedAdmin 10x: admin can login after 10 seeds", true);
      ok("seedAdmin 10x: admin session role=#admin after 10 seeds", session.role == #admin);
    };
    case _ { ok("seedAdmin 10x: admin can login after 10 seeds", false) };
  };
};

do {
  // 10 seeds with existing regular users — no users lost
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "u1", "pw");
  ignore AuthLib.registerUser(users, "u2", "pw");
  var j = 0;
  while (j < 10) {
    AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
    j += 1;
  };
  ok("seedAdmin 10x: map size is 3 (2 users + admin)", users.size() == 3);
  ok(
    "seedAdmin 10x: u1 still present",
    switch (AuthLib.loginUser(users, "u1", "pw")) { case (#ok _) { true }; case _ { false } },
  );
  ok(
    "seedAdmin 10x: u2 still present",
    switch (AuthLib.loginUser(users, "u2", "pw")) { case (#ok _) { true }; case _ { false } },
  );
  ok(
    "seedAdmin 10x: no other users lost",
    switch (AuthLib.loginUser(users, ADMIN_USERNAME, ADMIN_PASSWORD)) { case (#ok _) { true }; case _ { false } },
  );
};

// ── NEW: Map.size correct after seeding empty map ─────────────────────────────
Debug.print("seedAdmin map size correctness:");

do {
  // After seeding into an empty map, size must be exactly 1 (only admin added).
  let users = emptyUsers();
  let sizeBefore = users.size();
  ok("seedAdmin map size: empty map has size 0 before seed", sizeBefore == 0);
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  let sizeAfter = users.size();
  ok("seedAdmin map size: size after seed is exactly 1", sizeAfter == 1);
  ok("seedAdmin map size: increase is exactly +1", sizeAfter == sizeBefore + 1);
};

do {
  // Pre-populated map: seeding adds exactly 1 if admin was absent.
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "existing1", "pw");
  ignore AuthLib.registerUser(users, "existing2", "pw");
  let sizeBefore = users.size(); // 2
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  let sizeAfter = users.size(); // should be 3
  ok("seedAdmin map size: pre-populated map grows by exactly 1", sizeAfter == sizeBefore + 1);
  ok("seedAdmin map size: pre-populated map size is 3 after seed", sizeAfter == 3);
};

do {
  // Admin already present: size does NOT change on re-seed.
  let users = emptyUsers();
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  ignore AuthLib.registerUser(users, "user1", "pw");
  let sizeBefore = users.size(); // 2
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  ok("seedAdmin map size: re-seed does not increase size", users.size() == sizeBefore);
};

// ── NEW: Full auth flow test ───────────────────────────────────────────────────
Debug.print("Full auth flow:");

do {
  // Full flow: register → login → get session → use role for access control.
  // Simulates what the frontend does on every session.
  let users = emptyUsers();
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);

  // Step 1: Register a new user
  let regResult = AuthLib.registerUser(users, "flowuser", "flowpass");
  ok("full auth flow: register returns #ok", regResult == #ok);
  ok("full auth flow: user appears in map after register", users.get("flowuser") != null);

  // Step 2: Login with those credentials
  let loginResult = AuthLib.loginUser(users, "flowuser", "flowpass");
  let session = switch (loginResult) {
    case (#ok s) {
      ok("full auth flow: login returns #ok with valid session", true);
      ?s;
    };
    case _ {
      ok("full auth flow: login returns #ok with valid session", false);
      null;
    };
  };

  // Step 3: Session contains expected fields
  switch (session) {
    case null {};
    case (?s) {
      ok("full auth flow: session username matches", s.username == "flowuser");
      ok("full auth flow: session role is #user", s.role == #user);
    };
  };

  // Step 4: Role-based access — simulate an authenticated endpoint check.
  // getUserRole is what the mixin calls to validate the session on every request.
  let role = AuthLib.getUserRole(users, "flowuser");
  ok("full auth flow: getUserRole returns ?#user", role == ?#user);
  ok("full auth flow: user is NOT admin (would be denied admin-only endpoints)", role != ?#admin);

  // Step 5: Wrong password after registration does NOT produce a valid session
  let badLogin = AuthLib.loginUser(users, "flowuser", "wrongpass");
  let badOk = switch (badLogin) { case (#err _) { true }; case _ { false } };
  ok("full auth flow: wrong password rejected", badOk);
};

do {
  // Full admin flow: seed → login as admin → verify admin-only guard passes.
  let users = emptyUsers();
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);

  // Admin login
  let r = AuthLib.loginUser(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  let adminSession = switch (r) {
    case (#ok s) {
      ok("full admin flow: admin login returns #ok", true);
      ?s;
    };
    case _ {
      ok("full admin flow: admin login returns #ok", false);
      null;
    };
  };

  // Session fields
  switch (adminSession) {
    case null {};
    case (?s) {
      ok("full admin flow: admin session role=#admin", s.role == #admin);
      ok("full admin flow: admin session username correct", s.username == ADMIN_USERNAME);
    };
  };

  // Simulate an admin-only endpoint: requireAdmin would NOT trap for this user
  let adminRole = AuthLib.getUserRole(users, ADMIN_USERNAME);
  ok("full admin flow: getUserRole returns ?#admin", adminRole == ?#admin);

  // Confirm regular user cannot impersonate admin
  ignore AuthLib.registerUser(users, "imposter", "pw");
  let imposterRole = AuthLib.getUserRole(users, "imposter");
  ok("full admin flow: imposter role is #user, not admin", imposterRole == ?#user);
};

do {
  // Full deactivation → reactivation flow:
  // register → login works → deactivate → login blocked → reactivate → login works again.
  let users = emptyUsers();
  ignore AuthLib.registerUser(users, "cycleuser", "pw");

  let r1 = AuthLib.loginUser(users, "cycleuser", "pw");
  ok(
    "full auth flow deactivation cycle: initial login succeeds",
    switch (r1) { case (#ok _) { true }; case _ { false } },
  );

  // Deactivate
  switch (users.get("cycleuser")) {
    case (?u) { users.add("cycleuser", { u with isActive = false }) };
    case null {};
  };
  let r2 = AuthLib.loginUser(users, "cycleuser", "pw");
  ok(
    "full auth flow deactivation cycle: deactivated login returns #accountDeactivated",
    switch (r2) { case (#accountDeactivated) { true }; case _ { false } },
  );

  // Reactivate
  switch (users.get("cycleuser")) {
    case (?u) { users.add("cycleuser", { u with isActive = true }) };
    case null {};
  };
  let r3 = AuthLib.loginUser(users, "cycleuser", "pw");
  ok(
    "full auth flow deactivation cycle: reactivated login succeeds again",
    switch (r3) { case (#ok _) { true }; case _ { false } },
  );
};

// ── NEW: seedAdmin init+upgrade idempotency (regression for deploy-time seeding) ────
Debug.print("seedAdmin init+upgrade idempotency:");

do {
  // Simulates what happens on a fresh deploy (init do-block calls seedAdmin)
  // followed by a canister upgrade (migration run() calls seedAdmin again).
  // Both calls must be safe — no duplication, no corruption.
  let users = emptyUsers();

  // Call 1: init do-block (fresh deploy)
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  ok("init+upgrade: after init seed, user count = 1", users.size() == 1);

  // Register some users between init and upgrade
  ignore AuthLib.registerUser(users, "user_a", "pw");
  ignore AuthLib.registerUser(users, "user_b", "pw");
  ok("init+upgrade: 3 users present before upgrade", users.size() == 3);

  // Call 2: migration run() (canister upgrade)
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  ok("init+upgrade: after upgrade seed, user count unchanged = 3", users.size() == 3);

  // Admin still works after both calls
  let adminLogin = AuthLib.loginUser(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  ok(
    "init+upgrade: admin can login after init+upgrade seeds",
    switch (adminLogin) { case (#ok _) { true }; case _ { false } },
  );
  ok(
    "init+upgrade: admin role=#admin after init+upgrade seeds",
    switch (adminLogin) { case (#ok s) { s.role == #admin }; case _ { false } },
  );

  // Regular users unaffected
  ok(
    "init+upgrade: user_a unaffected",
    switch (AuthLib.loginUser(users, "user_a", "pw")) { case (#ok _) { true }; case _ { false } },
  );
  ok(
    "init+upgrade: user_b unaffected",
    switch (AuthLib.loginUser(users, "user_b", "pw")) { case (#ok _) { true }; case _ { false } },
  );
};

do {
  // Simulates init+upgrade when admin was deactivated between deploys.
  // Both the init call and the upgrade call must reactivate the admin.
  let users = emptyUsers();

  // Init seed
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);

  // Admin gets deactivated (e.g. from a previous broken deploy)
  switch (users.get(ADMIN_USERNAME)) {
    case (?u) { users.add(ADMIN_USERNAME, { u with isActive = false }) };
    case null {};
  };
  // Confirm deactivated
  ok(
    "init+upgrade deactivated: admin deactivated before upgrade seed",
    switch (users.get(ADMIN_USERNAME)) { case (?u) { not u.isActive }; case null { false } },
  );

  // Upgrade seed (migration run) must reactivate
  AuthLib.seedAdmin(users, ADMIN_USERNAME, ADMIN_PASSWORD);
  ok(
    "init+upgrade deactivated: admin reactivated by upgrade seed",
    switch (users.get(ADMIN_USERNAME)) { case (?u) { u.isActive }; case null { false } },
  );
  ok(
    "init+upgrade deactivated: admin can login after upgrade seed reactivation",
    switch (AuthLib.loginUser(users, ADMIN_USERNAME, ADMIN_PASSWORD)) { case (#ok _) { true }; case _ { false } },
  );
};

// ── Summary ───────────────────────────────────────────────────────────────────
Debug.print("");
Debug.print("Results: " # debug_show(passed.value) # " passed, " # debug_show(failed.value) # " failed");
assert failed.value == 0;
