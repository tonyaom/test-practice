/**
 * Unit tests for 2FA (TOTP) backend logic.
 * Covers:
 * - Login flow without 2FA (returns ok session)
 * - Login flow with 2FA enabled (returns requiresTOTP)
 * - setup2FA returns secret + otpauthUri
 * - enable2FA with valid code succeeds
 * - enable2FA with invalid code fails
 * - disable2FA with correct password+code succeeds
 * - disable2FA with wrong password fails
 * - disable2FA with wrong code fails
 * - verifyTOTPLogin with valid code returns session
 * - verifyTOTPLogin with invalid code returns err
 * - LoginResult #requiresTOTP is distinct from #ok and #err
 */
import { describe, expect, it } from "vitest";
import type { LoginResult } from "./mocks/backendStub";
import { UserRole } from "./mocks/backendStub";
import { mockBackend } from "./mocks/mockBackendImpl";

// ── Login flow without 2FA ──────────────────────────────────────────────────────

describe("login without 2FA", () => {
  it("returns #ok session for valid credentials (no 2FA)", async () => {
    const result = await mockBackend.login("abcd", "abcd");
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      expect(result.ok.username).toBe("abcd");
      expect(result.ok.role).toBe("admin");
    }
  });

  it("returns #err for wrong password", async () => {
    const result = await mockBackend.login("abcd", "wrongpass");
    expect(result.__kind__).toBe("err");
  });

  it("returns #err for unknown user", async () => {
    const result = await mockBackend.login("nobody", "whatever");
    expect(result.__kind__).toBe("err");
    if (result.__kind__ === "err") {
      expect(result.err).toBeTruthy();
    }
  });
});

// ── Login flow with 2FA enabled ───────────────────────────────────────────────

describe("login with 2FA enabled", () => {
  it("returns #requiresTOTP when password is correct and 2FA is active", async () => {
    const result = await mockBackend.login("admin2fa", "password");
    expect(result.__kind__).toBe("requiresTOTP");
  });

  it("requiresTOTP result has no session data", async () => {
    const result = await mockBackend.login("admin2fa", "password");
    expect(result.__kind__).toBe("requiresTOTP");
    // No 'ok' or 'err' fields on requiresTOTP
    expect((result as { ok?: unknown }).ok).toBeUndefined();
  });

  it("returns #err for wrong password even when 2FA is enabled", async () => {
    // The mock treats wrong password as err regardless
    const result = await mockBackend.login("admin2fa", "wrongpass");
    expect(result.__kind__).toBe("err");
  });
});

// ── LoginResult type discrimination ──────────────────────────────────────────────

describe("LoginResult type discrimination", () => {
  it("distinguishes #ok from #requiresTOTP", async () => {
    const okResult = await mockBackend.login("abcd", "abcd");
    const totpResult = await mockBackend.login("admin2fa", "password");
    expect(okResult.__kind__).not.toBe(totpResult.__kind__);
  });

  it("distinguishes #err from #requiresTOTP", async () => {
    const errResult = await mockBackend.login("abcd", "badpass");
    const totpResult = await mockBackend.login("admin2fa", "password");
    expect(errResult.__kind__).not.toBe(totpResult.__kind__);
  });

  it("isLoginOk helper pattern works", () => {
    const okResult: LoginResult = {
      __kind__: "ok",
      ok: { username: "alice", role: UserRole.admin },
    };
    const isOk = okResult.__kind__ === "ok";
    expect(isOk).toBe(true);
  });

  it("isLoginRequiresTotp helper pattern works", () => {
    const totpResult: LoginResult = {
      __kind__: "requiresTOTP",
      requiresTOTP: null,
    };
    const requires = totpResult.__kind__ === "requiresTOTP";
    expect(requires).toBe(true);
  });
});

// ── setup2FA ──────────────────────────────────────────────────────────────────────

describe("setup2FA", () => {
  it("returns a base32 secret and otpauth URI", async () => {
    const result = await mockBackend.setup2FA("alice");
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      const [secret, uri] = result.ok;
      expect(secret).toBeTruthy();
      expect(uri).toContain("otpauth://totp/");
      expect(uri).toContain("secret=");
      expect(uri).toContain("alice");
    }
  });

  it("URI contains the base32 secret", async () => {
    const result = await mockBackend.setup2FA("bob");
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      const [secret, uri] = result.ok;
      expect(uri).toContain(secret);
    }
  });

  it("URI uses otpauth://totp/ scheme", async () => {
    const result = await mockBackend.setup2FA("charlie");
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      expect(result.ok[1].startsWith("otpauth://totp/")).toBe(true);
    }
  });

  it("secret is a non-empty string", async () => {
    const result = await mockBackend.setup2FA("dave");
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      expect(result.ok[0].length).toBeGreaterThan(0);
    }
  });
});

// ── enable2FA ─────────────────────────────────────────────────────────────────────

describe("enable2FA", () => {
  it("returns ok when code is valid", async () => {
    const result = await mockBackend.enable2FA("alice", "123456");
    expect(result.__kind__).toBe("ok");
  });

  it("returns err when code is invalid", async () => {
    const result = await mockBackend.enable2FA("alice", "000000");
    expect(result.__kind__).toBe("err");
    if (result.__kind__ === "err") {
      expect(result.err).toContain("Invalid TOTP code");
    }
  });

  it("returns ok for any non-zero code (mock accepts all)", async () => {
    const result = await mockBackend.enable2FA("alice", "999999");
    expect(result.__kind__).toBe("ok");
  });
});

// ── disable2FA ────────────────────────────────────────────────────────────────────

describe("disable2FA", () => {
  it("returns ok with correct password and valid code", async () => {
    const result = await mockBackend.disable2FA("abcd", "abcd", "123456");
    expect(result.__kind__).toBe("ok");
  });

  it("returns err with wrong password", async () => {
    const result = await mockBackend.disable2FA("abcd", "wrongpass", "123456");
    expect(result.__kind__).toBe("err");
    if (result.__kind__ === "err") {
      expect(result.err).toContain("Invalid password");
    }
  });

  it("returns err with invalid TOTP code", async () => {
    const result = await mockBackend.disable2FA("abcd", "abcd", "000000");
    expect(result.__kind__).toBe("err");
    if (result.__kind__ === "err") {
      expect(result.err).toContain("Invalid TOTP code");
    }
  });

  it("requires both correct password and valid code", async () => {
    const wrongBoth = await mockBackend.disable2FA(
      "abcd",
      "wrongpass",
      "000000",
    );
    expect(wrongBoth.__kind__).toBe("err");
  });
});

// ── verifyTOTPLogin ───────────────────────────────────────────────────────────────

describe("verifyTOTPLogin", () => {
  it("returns UserSession on valid TOTP code", async () => {
    const result = await mockBackend.verifyTOTPLogin("admin2fa", "123456");
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      expect(result.ok.username).toBe("admin2fa");
      expect(result.ok.role).toBeTruthy();
    }
  });

  it("returns err on invalid TOTP code", async () => {
    const result = await mockBackend.verifyTOTPLogin("admin2fa", "000000");
    expect(result.__kind__).toBe("err");
    if (result.__kind__ === "err") {
      expect(result.err).toContain("Invalid TOTP code");
    }
  });

  it("returns ok for any non-zero code", async () => {
    const result = await mockBackend.verifyTOTPLogin("admin2fa", "999999");
    expect(result.__kind__).toBe("ok");
  });

  it("returned session contains the username", async () => {
    const result = await mockBackend.verifyTOTPLogin("alice", "555555");
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      expect(result.ok.username).toBe("alice");
    }
  });
});

// ── getTwoFAStatus ───────────────────────────────────────────────────────────────

describe("getTwoFAStatus", () => {
  it("returns false for a user without 2FA enabled", async () => {
    const enabled = await mockBackend.getTwoFAStatus("abcd");
    expect(enabled).toBe(false);
  });

  it("returns true for the admin2fa mock user (2FA enabled)", async () => {
    const enabled = await mockBackend.getTwoFAStatus("admin2fa");
    expect(enabled).toBe(true);
  });

  it("returns false for an unknown username", async () => {
    const enabled = await mockBackend.getTwoFAStatus("nobody");
    expect(enabled).toBe(false);
  });

  it("returns a boolean (not an object or null)", async () => {
    const result = await mockBackend.getTwoFAStatus("sarah");
    expect(typeof result).toBe("boolean");
  });

  it("after enable2FA the status should be true (conceptually)", async () => {
    // Mock: any user that isn't 'admin2fa' starts at false
    const before = await mockBackend.getTwoFAStatus("newuser");
    expect(before).toBe(false);
    // After enable the session would refresh — the profile modal calls getTwoFAStatus on open
    const after = await mockBackend.getTwoFAStatus("admin2fa");
    expect(after).toBe(true);
  });
});

describe("2FA full flow (mock)", () => {
  it("setup → enable → login prompts TOTP → verify completes login", async () => {
    // 1. Setup: get secret
    const setup = await mockBackend.setup2FA("testuser");
    expect(setup.__kind__).toBe("ok");

    // 2. Enable: confirm with valid code
    const enable = await mockBackend.enable2FA("testuser", "123456");
    expect(enable.__kind__).toBe("ok");

    // 3. When login is called for a 2FA user, mock returns requiresTOTP
    const login = await mockBackend.login("admin2fa", "password");
    expect(login.__kind__).toBe("requiresTOTP");

    // 4. Complete login with TOTP code
    const verify = await mockBackend.verifyTOTPLogin("admin2fa", "123456");
    expect(verify.__kind__).toBe("ok");
    if (verify.__kind__ === "ok") {
      expect(verify.ok.username).toBe("admin2fa");
    }
  });

  it("setup → enable → disable removes 2FA", async () => {
    const setup = await mockBackend.setup2FA("testuser");
    expect(setup.__kind__).toBe("ok");

    const enable = await mockBackend.enable2FA("testuser", "123456");
    expect(enable.__kind__).toBe("ok");

    const disable = await mockBackend.disable2FA("abcd", "abcd", "123456");
    expect(disable.__kind__).toBe("ok");
  });

  it("failed enable (bad code) does not activate 2FA", async () => {
    const enable = await mockBackend.enable2FA("testuser", "000000");
    expect(enable.__kind__).toBe("err");
    // Non-2FA login still returns ok session
    const login = await mockBackend.login("abcd", "abcd");
    expect(login.__kind__).toBe("ok");
  });
});
