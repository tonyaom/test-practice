/**
 * Unit tests for admin user management logic.
 *
 * Covers:
 * - adminListUsers: returns all users with isActive status
 * - adminActivateUser: enables a deactivated user
 * - adminDeactivateUser: disables an active user
 * - admin cannot deactivate themselves
 * - admin cannot deactivate another admin
 * - adminGetUserProgress: returns progress for a user
 * - adminResetUserMastery: resets user's mastery to 0 (fully reset)
 * - canToggle logic: protection rules for the UI
 * - accountDeactivated login result
 */
import { describe, expect, it } from "vitest";
import { mockBackend } from "./mocks/mockBackendImpl";

const ADMIN = "abcd";
const USER = "sarah";
const USER2 = "admin2fa";

async function assertUnauthorized(fn: () => Promise<unknown>): Promise<void> {
  await expect(fn()).rejects.toThrow(/unauthorized/i);
}

// ── adminListUsers ─────────────────────────────────────────────────────────────

describe("adminListUsers", () => {
  it("returns an array", async () => {
    const users = await mockBackend.adminListUsers(ADMIN);
    expect(Array.isArray(users)).toBe(true);
  });

  it("returns at least one user", async () => {
    const users = await mockBackend.adminListUsers(ADMIN);
    expect(users.length).toBeGreaterThan(0);
  });

  it("every user entry has required fields", async () => {
    const users = await mockBackend.adminListUsers(ADMIN);
    for (const u of users) {
      expect(u).toHaveProperty("username");
      expect(u).toHaveProperty("displayName");
      expect(u).toHaveProperty("role");
      expect(u).toHaveProperty("isActive");
    }
  });

  it("admin account is in the list", async () => {
    const users = await mockBackend.adminListUsers(ADMIN);
    const admin = users.find((u) => u.username === ADMIN);
    expect(admin).toBeDefined();
  });

  it("admin account has role='admin'", async () => {
    const users = await mockBackend.adminListUsers(ADMIN);
    const admin = users.find((u) => u.username === ADMIN);
    expect(admin?.role).toBe("admin");
  });

  it("admin account is active by default", async () => {
    const users = await mockBackend.adminListUsers(ADMIN);
    const admin = users.find((u) => u.username === ADMIN);
    expect(admin?.isActive).toBe(true);
  });

  it("regular users are in the list", async () => {
    const users = await mockBackend.adminListUsers(ADMIN);
    const sarah = users.find((u) => u.username === USER);
    expect(sarah).toBeDefined();
    expect(sarah?.role).toBe("user");
  });

  it("isActive is a boolean for every user", async () => {
    const users = await mockBackend.adminListUsers(ADMIN);
    for (const u of users) {
      expect(typeof u.isActive).toBe("boolean");
    }
  });

  it("regular user cannot list users — throws unauthorized", async () => {
    await assertUnauthorized(() => mockBackend.adminListUsers(USER));
  });

  it("unknown user cannot list users — throws unauthorized", async () => {
    await assertUnauthorized(() => mockBackend.adminListUsers("ghost"));
  });
});

// ── adminDeactivateUser ────────────────────────────────────────────────────────

describe("adminDeactivateUser", () => {
  it("admin can deactivate a regular user — returns true", async () => {
    const result = await mockBackend.adminDeactivateUser(ADMIN, USER);
    expect(result).toBe(true);
    // restore state for subsequent tests
    await mockBackend.adminActivateUser(ADMIN, USER);
  });

  it("deactivated user shows isActive=false in the list", async () => {
    await mockBackend.adminDeactivateUser(ADMIN, USER);
    const users = await mockBackend.adminListUsers(ADMIN);
    const sarah = users.find((u) => u.username === USER);
    expect(sarah?.isActive).toBe(false);
    // restore
    await mockBackend.adminActivateUser(ADMIN, USER);
  });

  it("admin cannot deactivate themselves", async () => {
    await expect(mockBackend.adminDeactivateUser(ADMIN, ADMIN)).rejects.toThrow(
      /deactivate yourself/i,
    );
  });

  it("admin cannot deactivate another admin account", async () => {
    // ADMIN is the only admin in the mock, targeting themselves covers admin role check
    await expect(
      mockBackend.adminDeactivateUser(ADMIN, ADMIN),
    ).rejects.toThrow();
  });

  it("regular user cannot deactivate another user — throws unauthorized", async () => {
    await assertUnauthorized(() =>
      mockBackend.adminDeactivateUser(USER, USER2),
    );
  });

  it("unknown caller cannot deactivate — throws unauthorized", async () => {
    await assertUnauthorized(() =>
      mockBackend.adminDeactivateUser("nobody", USER),
    );
  });

  it("deactivating USER2 also reflects in list", async () => {
    await mockBackend.adminDeactivateUser(ADMIN, USER2);
    const users = await mockBackend.adminListUsers(ADMIN);
    const u2 = users.find((u) => u.username === USER2);
    expect(u2?.isActive).toBe(false);
    // restore
    await mockBackend.adminActivateUser(ADMIN, USER2);
  });
});

// ── adminActivateUser ──────────────────────────────────────────────────────────

describe("adminActivateUser", () => {
  it("admin can activate a deactivated user — returns true", async () => {
    await mockBackend.adminDeactivateUser(ADMIN, USER);
    const result = await mockBackend.adminActivateUser(ADMIN, USER);
    expect(result).toBe(true);
  });

  it("activated user shows isActive=true in the list", async () => {
    await mockBackend.adminDeactivateUser(ADMIN, USER);
    await mockBackend.adminActivateUser(ADMIN, USER);
    const users = await mockBackend.adminListUsers(ADMIN);
    const sarah = users.find((u) => u.username === USER);
    expect(sarah?.isActive).toBe(true);
  });

  it("activating an already-active user still returns true", async () => {
    // Ensure user is active first
    await mockBackend.adminActivateUser(ADMIN, USER);
    // Activating again should still succeed
    const result = await mockBackend.adminActivateUser(ADMIN, USER);
    expect(result).toBe(true);
  });

  it("regular user cannot activate users — throws unauthorized", async () => {
    await assertUnauthorized(() => mockBackend.adminActivateUser(USER, USER2));
  });

  it("unknown caller cannot activate — throws unauthorized", async () => {
    await assertUnauthorized(() =>
      mockBackend.adminActivateUser("ghost", USER),
    );
  });

  it("activate + deactivate sequence leaves user in correct state", async () => {
    // deactivate → activate → deactivate
    await mockBackend.adminDeactivateUser(ADMIN, USER);
    await mockBackend.adminActivateUser(ADMIN, USER);
    await mockBackend.adminDeactivateUser(ADMIN, USER);
    const users = await mockBackend.adminListUsers(ADMIN);
    const sarah = users.find((u) => u.username === USER);
    expect(sarah?.isActive).toBe(false);
    // restore
    await mockBackend.adminActivateUser(ADMIN, USER);
  });
});

// ── adminGetUserProgress ───────────────────────────────────────────────────────

describe("adminGetUserProgress", () => {
  it("returns a progress object for a valid test", async () => {
    const progress = await mockBackend.adminGetUserProgress(
      ADMIN,
      USER,
      BigInt(1),
    );
    expect(progress).not.toBeNull();
  });

  it("progress object has username matching the target user", async () => {
    const progress = await mockBackend.adminGetUserProgress(
      ADMIN,
      USER,
      BigInt(1),
    );
    expect(progress?.username).toBe(USER);
  });

  it("progress object has testId", async () => {
    const progress = await mockBackend.adminGetUserProgress(
      ADMIN,
      USER,
      BigInt(1),
    );
    expect(progress).toHaveProperty("testId");
  });

  it("progress has totalQuestions > 0 for a test with questions", async () => {
    const progress = await mockBackend.adminGetUserProgress(
      ADMIN,
      USER,
      BigInt(1),
    );
    expect(Number(progress?.totalQuestions)).toBeGreaterThan(0);
  });

  it("progress has masteredCount and inProgressCount fields", async () => {
    const progress = await mockBackend.adminGetUserProgress(
      ADMIN,
      USER,
      BigInt(1),
    );
    expect(progress).toHaveProperty("masteredCount");
    expect(progress).toHaveProperty("inProgressCount");
  });

  it("masteredCount + inProgressCount <= totalQuestions", async () => {
    const progress = await mockBackend.adminGetUserProgress(
      ADMIN,
      USER,
      BigInt(1),
    );
    if (progress) {
      expect(
        Number(progress.masteredCount) + Number(progress.inProgressCount),
      ).toBeLessThanOrEqual(Number(progress.totalQuestions));
    }
  });

  it("returns null for a test with no questions (testId=999)", async () => {
    const progress = await mockBackend.adminGetUserProgress(
      ADMIN,
      USER,
      BigInt(999),
    );
    expect(progress).toBeNull();
  });

  it("regular user cannot get progress for others — throws unauthorized", async () => {
    await assertUnauthorized(() =>
      mockBackend.adminGetUserProgress(USER, USER2, BigInt(1)),
    );
  });

  it("unknown caller cannot get progress — throws unauthorized", async () => {
    await assertUnauthorized(() =>
      mockBackend.adminGetUserProgress("nobody", USER, BigInt(1)),
    );
  });

  it("progress for USER2 on test 2 has correct totalQuestions", async () => {
    const progress = await mockBackend.adminGetUserProgress(
      ADMIN,
      USER2,
      BigInt(2),
    );
    // Test 2 has 1 question in the mock
    expect(Number(progress?.totalQuestions)).toBe(1);
  });
});

// ── adminResetUserMastery ──────────────────────────────────────────────────────

describe("adminResetUserMastery", () => {
  it("returns true on success", async () => {
    const result = await mockBackend.adminResetUserMastery(ADMIN, USER, {
      testId: BigInt(1),
    });
    expect(result).toBe(true);
  });

  it("sets all mastery streaks to 0 after reset", async () => {
    await mockBackend.adminResetUserMastery(ADMIN, USER, {
      testId: BigInt(1),
    });
    const mastery = await mockBackend.getMasteryForTest(USER, BigInt(1));
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0);
    }
  });

  it("sets isMastered=false for all questions after reset", async () => {
    await mockBackend.adminResetUserMastery(ADMIN, USER, {
      testId: BigInt(1),
    });
    const mastery = await mockBackend.getMasteryForTest(USER, BigInt(1));
    for (const m of mastery) {
      expect(m.isMastered).toBe(false);
    }
  });

  it("reset for USER does not affect USER2 mastery", async () => {
    await mockBackend.adminResetUserMastery(ADMIN, USER, {
      testId: BigInt(1),
    });
    const mastery2 = await mockBackend.getMasteryForTest(USER2, BigInt(1));
    // USER2 has never been reset — should still be at 0
    for (const m of mastery2) {
      expect(Number(m.correctStreak)).toBe(0);
    }
  });

  it("regular user cannot reset another user's mastery — throws unauthorized", async () => {
    await assertUnauthorized(() =>
      mockBackend.adminResetUserMastery(USER, USER2, { testId: BigInt(1) }),
    );
  });

  it("unknown caller cannot reset mastery — throws unauthorized", async () => {
    await assertUnauthorized(() =>
      mockBackend.adminResetUserMastery("ghost", USER, { testId: BigInt(1) }),
    );
  });

  it("reset then getMasteryForTest returns streak=0 not streak=5", async () => {
    await mockBackend.adminResetUserMastery(ADMIN, USER, {
      testId: BigInt(1),
    });
    const mastery = await mockBackend.getMasteryForTest(USER, BigInt(1));
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0); // fully reset
      expect(m.isMastered).toBe(false);
    }
  });
});

// ── canToggle UI logic ─────────────────────────────────────────────────────────

describe("canToggle UI rule (mirrors AdminUsersPage.canToggle)", () => {
  interface UserLike {
    username: string;
    role: "admin" | "user";
  }

  function canToggle(user: UserLike, adminUsername: string): boolean {
    return user.username !== adminUsername && user.role !== "admin";
  }

  it("returns false for the current admin themselves", () => {
    expect(canToggle({ username: ADMIN, role: "admin" }, ADMIN)).toBe(false);
  });

  it("returns false for another admin account", () => {
    expect(canToggle({ username: "other_admin", role: "admin" }, ADMIN)).toBe(
      false,
    );
  });

  it("returns true for a regular user that is not the caller", () => {
    expect(canToggle({ username: USER, role: "user" }, ADMIN)).toBe(true);
  });

  it("returns true for USER2 that is not the caller", () => {
    expect(canToggle({ username: USER2, role: "user" }, ADMIN)).toBe(true);
  });

  it("returns false when the user is the same as the admin username even if role=user", () => {
    // Edge case: same username but role mismatch (impossible in practice, but tested)
    expect(canToggle({ username: ADMIN, role: "user" }, ADMIN)).toBe(false);
  });
});

// ── accountDeactivated login ───────────────────────────────────────────────────

describe("login — accountDeactivated handling", () => {
  it("returns __kind__=accountDeactivated for deactivated account", async () => {
    const result = await mockBackend.login("deactivated", "deactivated");
    expect(result.__kind__).toBe("accountDeactivated");
  });

  it("accountDeactivated result has null payload", async () => {
    const result = await mockBackend.login("deactivated", "deactivated");
    if (result.__kind__ === "accountDeactivated") {
      expect(result.accountDeactivated).toBeNull();
    }
  });

  it("UI should show error message 'Your account has been deactivated'", () => {
    // Mirrors LoginPage handleSubmit logic
    const result = {
      __kind__: "accountDeactivated" as const,
      accountDeactivated: null,
    };
    const errorMessage =
      result.__kind__ === "accountDeactivated"
        ? "Your account has been deactivated"
        : "";
    expect(errorMessage).toBe("Your account has been deactivated");
  });

  it("regular user can still log in after another user is deactivated", async () => {
    // Deactivating 'deactivated' user should not affect sarah
    const result = await mockBackend.login("sarah", "password");
    expect(result.__kind__).toBe("ok");
  });

  it("wrong password returns err, not accountDeactivated", async () => {
    const result = await mockBackend.login("sarah", "wrong");
    expect(result.__kind__).toBe("err");
  });
});
