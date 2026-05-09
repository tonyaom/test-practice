/**
 * Unit tests for AdminDashboardPage logic.
 * Covers: stats loading, shape validation, error handling,
 * top tests display, empty states, and admin guard.
 */
import { describe, expect, it } from "vitest";
import { mockBackend } from "./mocks/mockBackendImpl";

const ADMIN = "abcd";
const USER = "sarah";
const UNKNOWN = "ghost";

// ── Helper ───────────────────────────────────────────────────────────────────
async function fetchStats(username: string) {
  return mockBackend.getAdminDashboardStats(username);
}

// ── Stats shape & values ─────────────────────────────────────────────────────
describe("AdminDashboardPage – stats shape", () => {
  it("returns all required stat fields for admin", async () => {
    const stats = await fetchStats(ADMIN);
    expect(stats).toHaveProperty("totalTests");
    expect(stats).toHaveProperty("totalQuestions");
    expect(stats).toHaveProperty("totalUsers");
    expect(stats).toHaveProperty("totalActiveUsers");
    expect(stats).toHaveProperty("totalDeactivatedUsers");
    expect(stats).toHaveProperty("totalMasteredQuestions");
    expect(stats).toHaveProperty("totalMasteryRecords");
    expect(stats).toHaveProperty("topTests");
  });

  it("all numeric fields are bigint", async () => {
    const stats = await fetchStats(ADMIN);
    expect(typeof stats.totalTests).toBe("bigint");
    expect(typeof stats.totalQuestions).toBe("bigint");
    expect(typeof stats.totalUsers).toBe("bigint");
    expect(typeof stats.totalActiveUsers).toBe("bigint");
    expect(typeof stats.totalDeactivatedUsers).toBe("bigint");
    expect(typeof stats.totalMasteredQuestions).toBe("bigint");
    expect(typeof stats.totalMasteryRecords).toBe("bigint");
  });

  it("totalUsers >= totalActiveUsers + totalDeactivatedUsers", async () => {
    const s = await fetchStats(ADMIN);
    expect(s.totalActiveUsers + s.totalDeactivatedUsers).toBeLessThanOrEqual(
      s.totalUsers,
    );
  });

  it("totalTests is >= 1 (seeded tests exist)", async () => {
    const s = await fetchStats(ADMIN);
    expect(Number(s.totalTests)).toBeGreaterThanOrEqual(1);
  });

  it("totalQuestions is >= 1 (seeded questions exist)", async () => {
    const s = await fetchStats(ADMIN);
    expect(Number(s.totalQuestions)).toBeGreaterThanOrEqual(1);
  });

  it("totalActiveUsers is non-negative", async () => {
    const s = await fetchStats(ADMIN);
    expect(Number(s.totalActiveUsers)).toBeGreaterThanOrEqual(0);
  });

  it("totalDeactivatedUsers is non-negative", async () => {
    const s = await fetchStats(ADMIN);
    expect(Number(s.totalDeactivatedUsers)).toBeGreaterThanOrEqual(0);
  });

  it("totalMasteredQuestions is non-negative", async () => {
    const s = await fetchStats(ADMIN);
    expect(Number(s.totalMasteredQuestions)).toBeGreaterThanOrEqual(0);
  });

  it("totalMasteryRecords is non-negative", async () => {
    const s = await fetchStats(ADMIN);
    expect(Number(s.totalMasteryRecords)).toBeGreaterThanOrEqual(0);
  });
});

// ── Top Tests ────────────────────────────────────────────────────────────────
describe("AdminDashboardPage – top tests", () => {
  it("topTests is an array", async () => {
    const s = await fetchStats(ADMIN);
    expect(Array.isArray(s.topTests)).toBe(true);
  });

  it("topTests has at most 3 entries", async () => {
    const s = await fetchStats(ADMIN);
    expect(s.topTests.length).toBeLessThanOrEqual(3);
  });

  it("each topTest entry has testId (bigint)", async () => {
    const s = await fetchStats(ADMIN);
    for (const t of s.topTests) {
      expect(typeof t.testId).toBe("bigint");
    }
  });

  it("each topTest entry has testName (string)", async () => {
    const s = await fetchStats(ADMIN);
    for (const t of s.topTests) {
      expect(typeof t.testName).toBe("string");
      expect(t.testName.length).toBeGreaterThan(0);
    }
  });

  it("each topTest entry has sessionCount (bigint)", async () => {
    const s = await fetchStats(ADMIN);
    for (const t of s.topTests) {
      expect(typeof t.sessionCount).toBe("bigint");
    }
  });
});

// ── Admin Guard ───────────────────────────────────────────────────────────────
describe("AdminDashboardPage – access control", () => {
  it("throws for a regular user", async () => {
    await expect(fetchStats(USER)).rejects.toThrow(/unauthorized/i);
  });

  it("throws for an unknown username", async () => {
    await expect(fetchStats(UNKNOWN)).rejects.toThrow(/unauthorized/i);
  });

  it("does NOT throw for the seeded admin", async () => {
    await expect(fetchStats(ADMIN)).resolves.toBeDefined();
  });
});

// ── Deactivation impact on stats ─────────────────────────────────────────────
describe("AdminDashboardPage – deactivation flow", () => {
  it("deactivating a user increments deactivatedUsers count", async () => {
    const before = await fetchStats(ADMIN);
    await mockBackend.adminDeactivateUser(ADMIN, USER);
    const after = await fetchStats(ADMIN);
    expect(after.totalDeactivatedUsers).toBeGreaterThan(
      before.totalDeactivatedUsers,
    );
    // Restore for other tests
    await mockBackend.adminActivateUser(ADMIN, USER);
  });

  it("reactivating a user decrements deactivatedUsers count", async () => {
    await mockBackend.adminDeactivateUser(ADMIN, USER);
    const before = await fetchStats(ADMIN);
    await mockBackend.adminActivateUser(ADMIN, USER);
    const after = await fetchStats(ADMIN);
    expect(after.totalDeactivatedUsers).toBeLessThan(
      before.totalDeactivatedUsers,
    );
  });
});

// ── Edge cases ────────────────────────────────────────────────────────────────
describe("AdminDashboardPage – edge cases", () => {
  it("returns stats even when no mastery records exist", async () => {
    const s = await fetchStats(ADMIN);
    // Mastery may be 0 on a fresh run
    expect(Number(s.totalMasteredQuestions)).toBeGreaterThanOrEqual(0);
    expect(Number(s.totalMasteryRecords)).toBeGreaterThanOrEqual(0);
  });

  it("topTests testId matches a known test in the list", async () => {
    const s = await fetchStats(ADMIN);
    const tests = await mockBackend.listTests();
    const testIds = new Set(tests.map((t) => String(t.id)));
    for (const top of s.topTests) {
      expect(testIds.has(String(top.testId))).toBe(true);
    }
  });
});
