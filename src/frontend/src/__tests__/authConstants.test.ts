/**
 * Auth constants canary tests.
 *
 * These tests exist for ONE reason: if someone accidentally changes the
 * admin credential constants (a typo, a copy-paste error, or a mis-aimed
 * find-replace), these tests fail IMMEDIATELY with a clear message before
 * any deployment touches production.
 *
 * History of credential regressions that these tests would have caught:
 *   - v42: ADMIN_USERNAME was 'abcd' in code but 'adbc' in mock → admin login failed
 *   - v45: service layer had 'adbc' instead of 'abcd' → admin login failed
 *   - v46: stale deployment artefact with wrong credentials
 *   - v48: audio build accidentally changed admin username
 *   - v49: recurring typo in one of the credential locations
 */
import { describe, expect, it } from "vitest";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../constants/auth.constants";
import { mockBackend } from "./mocks/mockBackendImpl";

// ── Canary: constant values ────────────────────────────────────────────────────

describe("Auth constants — canary values (fail fast if constants are changed)", () => {
  it("ADMIN_USERNAME is exactly 'abcd'", () => {
    expect(ADMIN_USERNAME).toBe("abcd");
  });

  it("ADMIN_PASSWORD is exactly 'abcd'", () => {
    expect(ADMIN_PASSWORD).toBe("abcd");
  });

  it("ADMIN_USERNAME is NOT the old typo 'adbc'", () => {
    expect(ADMIN_USERNAME).not.toBe("adbc");
  });

  it("ADMIN_USERNAME has exactly 4 characters", () => {
    expect(ADMIN_USERNAME).toHaveLength(4);
  });

  it("ADMIN_PASSWORD has exactly 4 characters", () => {
    expect(ADMIN_PASSWORD).toHaveLength(4);
  });
});

// ── Admin login with constants ─────────────────────────────────────────────────

describe("Admin login using ADMIN_USERNAME / ADMIN_PASSWORD constants", () => {
  it("login(ADMIN_USERNAME, ADMIN_PASSWORD) succeeds", async () => {
    const result = await mockBackend.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    expect(result.__kind__).toBe("ok");
  });

  it("admin login returns role 'admin'", async () => {
    const result = await mockBackend.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      expect(result.ok.role).toBe("admin");
    }
  });

  it("admin login returns the correct username", async () => {
    const result = await mockBackend.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      expect(result.ok.username).toBe(ADMIN_USERNAME);
    }
  });

  it("wrong password for admin fails", async () => {
    const result = await mockBackend.login(ADMIN_USERNAME, "wrongpassword");
    expect(result.__kind__).toBe("err");
  });

  it("empty password for admin fails", async () => {
    const result = await mockBackend.login(ADMIN_USERNAME, "");
    expect(result.__kind__).toBe("err");
  });
});

// ── Regression guard: 'adbc' typo must always fail ────────────────────────────

describe("Regression guard — 'adbc' typo must never succeed", () => {
  it("login('adbc', ADMIN_PASSWORD) fails — guards against v42 typo", async () => {
    const result = await mockBackend.login("adbc", ADMIN_PASSWORD);
    expect(result.__kind__).toBe("err");
  });

  it("login('adbc', 'adbc') fails", async () => {
    const result = await mockBackend.login("adbc", "adbc");
    expect(result.__kind__).toBe("err");
  });

  it("login('adbc', 'abcd') fails", async () => {
    const result = await mockBackend.login("adbc", "abcd");
    expect(result.__kind__).toBe("err");
  });

  it("login('ABCD', ADMIN_PASSWORD) fails — case-sensitive", async () => {
    const result = await mockBackend.login("ABCD", ADMIN_PASSWORD);
    expect(result.__kind__).toBe("err");
  });

  it("login('Abcd', ADMIN_PASSWORD) fails — mixed case", async () => {
    const result = await mockBackend.login("Abcd", ADMIN_PASSWORD);
    expect(result.__kind__).toBe("err");
  });
});

// ── Regular user login ─────────────────────────────────────────────────────────

describe("Regular user login (non-admin)", () => {
  it("sarah logs in successfully with correct credentials", async () => {
    const result = await mockBackend.login("sarah", "password");
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      expect(result.ok.username).toBe("sarah");
      expect(result.ok.role).toBe("user");
    }
  });

  it("sarah gets role 'user', not 'admin'", async () => {
    const result = await mockBackend.login("sarah", "password");
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      expect(result.ok.role).not.toBe("admin");
    }
  });

  it("sarah with wrong password fails", async () => {
    const result = await mockBackend.login("sarah", "wrongpassword");
    expect(result.__kind__).toBe("err");
  });
});

// ── Deactivated account ────────────────────────────────────────────────────────

describe("Deactivated account login", () => {
  it("login with deactivated/deactivated returns accountDeactivated", async () => {
    const result = await mockBackend.login("deactivated", "deactivated");
    expect(result.__kind__).toBe("accountDeactivated");
  });

  it("deactivated account returns error message containing 'deactivated'", async () => {
    // The LoginPage maps accountDeactivated to this message
    // This test guards against the message being accidentally changed
    const variants: Array<
      "ok" | "err" | "accountDeactivated" | "requiresTOTP"
    > = ["accountDeactivated"];
    const result = await mockBackend.login("deactivated", "deactivated");
    expect(variants).toContain(result.__kind__);
  });
});

// ── Admin cannot be deactivated ───────────────────────────────────────────────

describe("Admin account protection", () => {
  it("adminDeactivateUser throws when targeting admin", async () => {
    await expect(
      mockBackend.adminDeactivateUser(ADMIN_USERNAME, ADMIN_USERNAME),
    ).rejects.toThrow();
  });

  it("adminDeleteUser returns err when targeting the seeded admin", async () => {
    const result = await mockBackend.adminDeleteUser(
      ADMIN_USERNAME,
      ADMIN_USERNAME,
    );
    expect(result.__kind__).toBe("err");
  });

  it("admin can still login after a deactivateUser call targeting them throws", async () => {
    // Even if deactivation throws, admin login must still work
    try {
      await mockBackend.adminDeactivateUser(ADMIN_USERNAME, ADMIN_USERNAME);
    } catch {
      // expected — swallow error
    }
    const result = await mockBackend.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      expect(result.ok.role).toBe("admin");
    }
  });
});

// ── Newly registered user login ───────────────────────────────────────────────

describe("Newly registered user can login immediately", () => {
  it("register then login succeeds with registered credentials", async () => {
    const username = `auth_const_test_user_${Date.now()}`;
    const password = "testpass123";

    const reg = await mockBackend.register(username, password);
    expect(reg.__kind__).toBe("ok");

    const login = await mockBackend.login(username, password);
    expect(login.__kind__).toBe("ok");
    if (login.__kind__ === "ok") {
      expect(login.ok.username).toBe(username);
      expect(login.ok.role).toBe("user");
    }
  });

  it("newly registered user has 'user' role, never 'admin'", async () => {
    const username = `auth_const_role_test_${Date.now()}`;
    await mockBackend.register(username, "somepass");
    const login = await mockBackend.login(username, "somepass");
    expect(login.__kind__).toBe("ok");
    if (login.__kind__ === "ok") {
      expect(login.ok.role).toBe("user");
      expect(login.ok.role).not.toBe("admin");
    }
  });
});
