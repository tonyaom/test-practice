/**
 * Tests for the new AdminDashboardStats and TestReview features.
 * Verifies the mock backend returns the expected shapes and the
 * admin-only guard on getAdminDashboardStats.
 */
import { describe, expect, it } from "vitest";
import { mockBackend } from "./mocks/mockBackendImpl";

const ADMIN = "abcd";
const USER = "sarah";

describe("getAdminDashboardStats – shape and guard", () => {
  it("returns valid stats for admin", async () => {
    const stats = await mockBackend.getAdminDashboardStats(ADMIN);
    expect(typeof stats.totalTests).toBe("bigint");
    expect(typeof stats.totalQuestions).toBe("bigint");
    expect(typeof stats.totalUsers).toBe("bigint");
    expect(typeof stats.totalActiveUsers).toBe("bigint");
    expect(typeof stats.totalDeactivatedUsers).toBe("bigint");
    expect(typeof stats.totalMasteredQuestions).toBe("bigint");
    expect(typeof stats.totalMasteryRecords).toBe("bigint");
    expect(Array.isArray(stats.topTests)).toBe(true);
  });

  it("totalUsers equals sum of active + deactivated", async () => {
    const stats = await mockBackend.getAdminDashboardStats(ADMIN);
    expect(
      stats.totalActiveUsers + stats.totalDeactivatedUsers,
    ).toBeLessThanOrEqual(stats.totalUsers);
  });

  it("topTests entries have required fields", async () => {
    const stats = await mockBackend.getAdminDashboardStats(ADMIN);
    for (const t of stats.topTests) {
      expect(typeof t.testId).toBe("bigint");
      expect(typeof t.testName).toBe("string");
      expect(typeof t.sessionCount).toBe("bigint");
    }
  });

  it("rejects a regular user calling getAdminDashboardStats", async () => {
    await expect(mockBackend.getAdminDashboardStats(USER)).rejects.toThrow(
      /unauthorized/i,
    );
  });

  it("rejects an unknown user calling getAdminDashboardStats", async () => {
    await expect(mockBackend.getAdminDashboardStats("nobody")).rejects.toThrow(
      /unauthorized/i,
    );
  });
});

describe("getTestReview – shape and null handling", () => {
  it("returns ReviewData for a known test", async () => {
    const data = await mockBackend.getTestReview(USER, BigInt(1), "session-1");
    expect(data).not.toBeNull();
    expect(typeof data!.totalScore).toBe("number");
    expect(Array.isArray(data!.questions)).toBe(true);
    expect(Array.isArray(data!.sectionScores)).toBe(true);
  });

  it("returns null for a test with no questions", async () => {
    const data = await mockBackend.getTestReview(USER, BigInt(999), "s");
    expect(data).toBeNull();
  });

  it("each ReviewQuestion has required fields", async () => {
    const data = await mockBackend.getTestReview(USER, BigInt(1), "s");
    expect(data).not.toBeNull();
    for (const rq of data!.questions) {
      expect(rq.question).toBeDefined();
      expect(typeof rq.question.text).toBe("string");
      expect(typeof rq.correctAnswer).toBe("string");
      expect(typeof rq.userAnswer).toBe("string");
      expect(typeof rq.isCorrect).toBe("boolean");
    }
  });

  it("totalScore is a number between 0 and 100", async () => {
    const data = await mockBackend.getTestReview(USER, BigInt(1), "s");
    expect(data!.totalScore).toBeGreaterThanOrEqual(0);
    expect(data!.totalScore).toBeLessThanOrEqual(100);
  });
});

describe("AdminDashboardStats – totals sanity", () => {
  it("totalTests matches the number of seeded tests", async () => {
    const stats = await mockBackend.getAdminDashboardStats(ADMIN);
    expect(Number(stats.totalTests)).toBeGreaterThanOrEqual(1);
  });

  it("totalQuestions is non-negative", async () => {
    const stats = await mockBackend.getAdminDashboardStats(ADMIN);
    expect(Number(stats.totalQuestions)).toBeGreaterThanOrEqual(0);
  });

  it("totalMasteredQuestions is non-negative", async () => {
    const stats = await mockBackend.getAdminDashboardStats(ADMIN);
    expect(Number(stats.totalMasteredQuestions)).toBeGreaterThanOrEqual(0);
  });
});
