/**
 * Login and registration flow tests.
 *
 * Covers:
 * 1. Admin login with abcd/abcd credentials succeeds
 * 2. Regular user login with correct credentials succeeds
 * 3. Login fails for wrong password (all variants)
 * 4. Login fails for unknown username
 * 5. Deactivated account returns accountDeactivated
 * 6. 2FA user returns requiresTOTP
 * 7. All 4 LoginResult variants are handled by the result-mapping logic
 * 8. Registration succeeds and the newly registered user can immediately log in
 * 9. Registration fails for duplicate username
 * 10. backend null-guard: backend === null means login shows a toast, not throws
 * 11. Admin credentials are both "abcd" (not "adbc" or any other typo)
 */
import { describe, expect, it } from "vitest";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../constants/auth.constants";
import type { LoginResult } from "./mocks/backendStub";
import { UserRole } from "./mocks/backendStub";
import { mockBackend } from "./mocks/mockBackendImpl";

// ── 1. Admin login (abcd/abcd) ────────────────────────────────────────────────

describe("Admin login — abcd/abcd", () => {
  it("username is 'abcd' (not 'adbc')", async () => {
    const result = await mockBackend.login("abcd", "abcd");
    expect(result.__kind__).toBe("ok");
  });

  it("password is 'abcd'", async () => {
    const result = await mockBackend.login("abcd", "abcd");
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      expect(result.ok.username).toBe("abcd");
    }
  });

  it("admin login returns role admin", async () => {
    const result = await mockBackend.login("abcd", "abcd");
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      expect(result.ok.role).toBe("admin");
    }
  });

  it("wrong password for admin returns err", async () => {
    const result = await mockBackend.login("abcd", "wrongpassword");
    expect(result.__kind__).toBe("err");
  });

  it("old admin username adbc with correct password fails", async () => {
    // Guard against the recurring typo: username was sometimes 'adbc'
    const result = await mockBackend.login("adbc", "abcd");
    expect(result.__kind__).toBe("err");
  });

  it("admin with empty password fails", async () => {
    const result = await mockBackend.login("abcd", "");
    expect(result.__kind__).toBe("err");
  });
});

// ── 2. Regular user login ──────────────────────────────────────────────────────

describe("Regular user login", () => {
  it("sarah logs in with correct credentials", async () => {
    const result = await mockBackend.login("sarah", "password");
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      expect(result.ok.username).toBe("sarah");
      expect(result.ok.role).toBe("user");
    }
  });

  it("sarah with wrong password returns err", async () => {
    const result = await mockBackend.login("sarah", "wrongpassword");
    expect(result.__kind__).toBe("err");
  });
});

// ── 3. Login failure cases ─────────────────────────────────────────────────────

describe("Login failure cases", () => {
  it("unknown user returns err", async () => {
    const result = await mockBackend.login(
      "nonexistent_user_xyz",
      "anypassword",
    );
    expect(result.__kind__).toBe("err");
    if (result.__kind__ === "err") {
      expect(result.err).toBeTruthy();
    }
  });

  it("empty username returns err", async () => {
    const result = await mockBackend.login("", "abcd");
    expect(result.__kind__).toBe("err");
  });

  it("empty username and password returns err", async () => {
    const result = await mockBackend.login("", "");
    expect(result.__kind__).toBe("err");
  });

  it("wrong username casing returns err", async () => {
    const result = await mockBackend.login("ABCD", "abcd");
    expect(result.__kind__).toBe("err");
  });
});

// ── 4. Deactivated account ─────────────────────────────────────────────────────

describe("Deactivated account login", () => {
  it("deactivated special-case returns accountDeactivated", async () => {
    const result = await mockBackend.login("deactivated", "deactivated");
    expect(result.__kind__).toBe("accountDeactivated");
  });
});

// ── 5. 2FA required ────────────────────────────────────────────────────────────

describe("2FA login flow", () => {
  it("admin2fa returns requiresTOTP variant", async () => {
    const result = await mockBackend.login("admin2fa", "password");
    expect(result.__kind__).toBe("requiresTOTP");
  });
});

// ── 6. All 4 LoginResult variants handled by UI mapping ──────────────────────

describe("LoginResult variant handling (mirrors LoginPage.handleSubmit)", () => {
  /**
   * Mirrors the exact logic in LoginPage.handleSubmit:
   *   if (result.__kind__ === "err") setError(result.err);
   *   else if (result.__kind__ === "accountDeactivated") setError(...);
   *   else if (result.__kind__ === "requiresTOTP") -> go to TOTP step;
   *   else -> successful login;
   */
  function handleLoginResult(result: LoginResult): {
    redirect?: string;
    error?: string;
    totpRequired?: boolean;
  } {
    if (result.__kind__ === "err") {
      return { error: result.err };
    }
    if (result.__kind__ === "accountDeactivated") {
      return {
        error:
          "Your account has been deactivated. Please contact an administrator.",
      };
    }
    if (result.__kind__ === "requiresTOTP") {
      return { totpRequired: true };
    }
    // ok
    const role = result.ok.role;
    return { redirect: role === UserRole.admin ? "/admin" : "/tests" };
  }

  it("ok/admin redirects to /admin", () => {
    const r = handleLoginResult({
      __kind__: "ok",
      ok: { username: "abcd", role: UserRole.admin },
    });
    expect(r.redirect).toBe("/admin");
    expect(r.error).toBeUndefined();
  });

  it("ok/user redirects to /tests", () => {
    const r = handleLoginResult({
      __kind__: "ok",
      ok: { username: "sarah", role: UserRole.user },
    });
    expect(r.redirect).toBe("/tests");
    expect(r.error).toBeUndefined();
  });

  it("err sets error message", () => {
    const r = handleLoginResult({
      __kind__: "err",
      err: "Invalid username or password",
    });
    expect(r.error).toBe("Invalid username or password");
    expect(r.redirect).toBeUndefined();
  });

  it("accountDeactivated sets deactivated error", () => {
    const r = handleLoginResult({
      __kind__: "accountDeactivated",
      accountDeactivated: null,
    });
    expect(r.error).toContain("deactivated");
    expect(r.redirect).toBeUndefined();
  });

  it("requiresTOTP sets totpRequired flag", () => {
    const r = handleLoginResult({
      __kind__: "requiresTOTP",
      requiresTOTP: null,
    });
    expect(r.totpRequired).toBe(true);
    expect(r.redirect).toBeUndefined();
    expect(r.error).toBeUndefined();
  });
});

// ── 7. Registration + immediate login ────────────────────────────────────────

describe("Registration → immediate login flow", () => {
  it("newly registered user can log in with their credentials", async () => {
    const username = "testuser_reglogin";
    const password = "mypassword123";

    // Register
    const reg = await mockBackend.register(username, password);
    expect(reg.__kind__).toBe("ok");

    // Immediately log in
    const login = await mockBackend.login(username, password);
    expect(login.__kind__).toBe("ok");
    if (login.__kind__ === "ok") {
      expect(login.ok.username).toBe(username);
      expect(login.ok.role).toBe("user");
    }
  });

  it("newly registered user cannot log in with wrong password", async () => {
    const username = "testuser_wrongpass";
    const password = "correctpassword";

    await mockBackend.register(username, password);
    const login = await mockBackend.login(username, "wrongpassword");
    expect(login.__kind__).toBe("err");
  });

  it("registration fails for duplicate username", async () => {
    const username = "dupuser_test";
    await mockBackend.register(username, "pass1");
    const dup = await mockBackend.register(username, "pass2");
    expect(dup.__kind__).toBe("err");
  });

  it("newly registered user has user role, not admin", async () => {
    const username = "roletest_newuser";
    await mockBackend.register(username, "somepass");
    const login = await mockBackend.login(username, "somepass");
    expect(login.__kind__).toBe("ok");
    if (login.__kind__ === "ok") {
      expect(login.ok.role).toBe("user");
      expect(login.ok.role).not.toBe("admin");
    }
  });
});

// ── 8. backend null guard (mirrors LoginPage behavior) ───────────────────────

describe("Backend null guard (LoginPage behavior)", () => {
  /**
   * Mirrors LoginPage.handleSubmit:
   *   if (!backend) { toast.error("Connecting to server..."); return; }
   *
   * When backend is null (actor loading), no login attempt is made.
   */
  async function attemptLogin(
    backend: { login: (u: string, p: string) => Promise<LoginResult> } | null,
    username: string,
    password: string,
  ): Promise<{ attempted: boolean; result?: LoginResult }> {
    if (!backend) {
      return { attempted: false };
    }
    const result = await backend.login(username, password);
    return { attempted: true, result };
  }

  it("null backend returns attempted=false and does not throw", async () => {
    const outcome = await attemptLogin(null, "abcd", "abcd");
    expect(outcome.attempted).toBe(false);
    expect(outcome.result).toBeUndefined();
  });

  it("non-null backend returns attempted=true with login result", async () => {
    const outcome = await attemptLogin(mockBackend, "abcd", "abcd");
    expect(outcome.attempted).toBe(true);
    expect(outcome.result).toBeDefined();
    expect(outcome.result?.__kind__).toBe("ok");
  });

  it("null backend guard prevents unhandled promise rejection", async () => {
    await expect(attemptLogin(null, "abcd", "abcd")).resolves.not.toThrow();
  });
});

// ── 9. Credential typo regression tests ──────────────────────────────────────

describe("Credential typo regression — admin must be abcd/abcd", () => {
  const CORRECT_USERNAME = ADMIN_USERNAME;
  const CORRECT_PASSWORD = ADMIN_PASSWORD;

  it("correct admin credentials succeed", async () => {
    const result = await mockBackend.login(CORRECT_USERNAME, CORRECT_PASSWORD);
    expect(result.__kind__).toBe("ok");
  });

  it("typo username adbc fails", async () => {
    const result = await mockBackend.login("adbc", CORRECT_PASSWORD);
    expect(result.__kind__).toBe("err");
  });

  it("typo username ABCD fails (case-sensitive)", async () => {
    const result = await mockBackend.login("ABCD", CORRECT_PASSWORD);
    expect(result.__kind__).toBe("err");
  });

  it("typo username abdc fails", async () => {
    const result = await mockBackend.login("abdc", CORRECT_PASSWORD);
    expect(result.__kind__).toBe("err");
  });

  it("typo password adbc fails", async () => {
    const result = await mockBackend.login(CORRECT_USERNAME, "adbc");
    expect(result.__kind__).toBe("err");
  });

  it("typo password ABCD fails (case-sensitive)", async () => {
    const result = await mockBackend.login(CORRECT_USERNAME, "ABCD");
    expect(result.__kind__).toBe("err");
  });

  it("typo password abcdd (extra char) fails", async () => {
    const result = await mockBackend.login(CORRECT_USERNAME, "abcdd");
    expect(result.__kind__).toBe("err");
  });

  it("typo password abc (short) fails", async () => {
    const result = await mockBackend.login(CORRECT_USERNAME, "abc");
    expect(result.__kind__).toBe("err");
  });
});
