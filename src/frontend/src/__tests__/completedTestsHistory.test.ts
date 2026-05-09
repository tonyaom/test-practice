/**
 * Unit tests for listMyTestResults / completed tests history logic:
 * - Returns empty array for a user with no completed results
 * - Returns only the requesting user's results
 * - Respects the 50-result limit
 * - Results are sorted by completedAt descending
 * - In-progress (completedAt = 0) results are excluded
 */
import { describe, expect, it } from "vitest";
import type { TestResult } from "./mocks/backendStub";

// ── Mirrors listForUser from lib/results.mo ───────────────────────────────────

function listForUser(
  results: TestResult[],
  username: string,
  limit: number,
): TestResult[] {
  const filtered = results.filter(
    (r) => r.username === username && r.completedAt !== BigInt(0),
  );
  const sorted = [...filtered].sort((a, b) => {
    if (b.completedAt > a.completedAt) return 1;
    if (b.completedAt < a.completedAt) return -1;
    return 0;
  });
  return sorted.slice(0, limit);
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeResult(
  overrides: Partial<TestResult> & { username: string; completedAt: bigint },
): TestResult {
  return {
    testId: BigInt(1),
    sessionId: `session-${Math.random().toString(36).slice(2)}`,
    score: BigInt(3),
    totalQuestions: BigInt(5),
    questionResults: [],
    sectionResults: [],
    ...overrides,
  };
}

const aliceResults: TestResult[] = [
  makeResult({ username: "alice", completedAt: BigInt(1000) }),
  makeResult({ username: "alice", completedAt: BigInt(3000) }),
  makeResult({ username: "alice", completedAt: BigInt(2000) }),
];

const bobResult: TestResult = makeResult({
  username: "bob",
  completedAt: BigInt(2500),
});

const allResults: TestResult[] = [...aliceResults, bobResult];

// ── Returns empty for new user ─────────────────────────────────────────────────

describe("listMyTestResults — empty result", () => {
  it("returns an empty array when the user has no results", () => {
    expect(listForUser(allResults, "charlie", 50)).toEqual([]);
  });

  it("returns an empty array when the overall results list is empty", () => {
    expect(listForUser([], "alice", 50)).toEqual([]);
  });

  it("excludes in-progress results (completedAt = 0)", () => {
    const inProgressResult = makeResult({
      username: "alice",
      completedAt: BigInt(0),
    });
    const results = [inProgressResult];
    expect(listForUser(results, "alice", 50)).toEqual([]);
  });
});

// ── Returns only the correct user's results ────────────────────────────────────

describe("listMyTestResults — user isolation", () => {
  it("returns only alice's results, not bob's", () => {
    const aliceOnly = listForUser(allResults, "alice", 50);
    expect(aliceOnly.every((r) => r.username === "alice")).toBe(true);
    expect(aliceOnly.some((r) => r.username === "bob")).toBe(false);
  });

  it("returns alice's 3 results when there are also bob results in the store", () => {
    expect(listForUser(allResults, "alice", 50)).toHaveLength(3);
  });

  it("returns only bob's single result", () => {
    const bobOnly = listForUser(allResults, "bob", 50);
    expect(bobOnly).toHaveLength(1);
    expect(bobOnly[0].username).toBe("bob");
  });
});

// ── Respects the 50-result limit ───────────────────────────────────────────────

describe("listMyTestResults — 50-result limit", () => {
  const manyResults: TestResult[] = Array.from({ length: 75 }, (_, i) =>
    makeResult({
      username: "alice",
      completedAt: BigInt(i + 1),
      sessionId: `session-${i}`,
    }),
  );

  it("returns exactly 50 results when the user has more than 50", () => {
    expect(listForUser(manyResults, "alice", 50)).toHaveLength(50);
  });

  it("returns all results when the user has fewer than 50", () => {
    expect(listForUser(aliceResults, "alice", 50)).toHaveLength(3);
  });

  it("returns exactly 50 when the user has exactly 50 completed results", () => {
    const exactly50 = manyResults.slice(0, 50);
    expect(listForUser(exactly50, "alice", 50)).toHaveLength(50);
  });

  it("the 50 returned are the 50 most recent when there are 75 total", () => {
    const result = listForUser(manyResults, "alice", 50);
    // Most recent has completedAt = 75, least recent kept = 26
    expect(result[0].completedAt).toBe(BigInt(75));
    expect(result[49].completedAt).toBe(BigInt(26));
  });
});

// ── Sorted by completedAt descending ──────────────────────────────────────────

describe("listMyTestResults — sort order (descending by completedAt)", () => {
  it("first result has the highest completedAt", () => {
    const result = listForUser(aliceResults, "alice", 50);
    expect(result[0].completedAt).toBe(BigInt(3000));
  });

  it("last result has the lowest completedAt", () => {
    const result = listForUser(aliceResults, "alice", 50);
    expect(result[result.length - 1].completedAt).toBe(BigInt(1000));
  });

  it("results are in strictly descending order when all timestamps differ", () => {
    const result = listForUser(aliceResults, "alice", 50);
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].completedAt > result[i + 1].completedAt).toBe(true);
    }
  });

  it("single-result list is already sorted", () => {
    const single = listForUser(allResults, "bob", 50);
    expect(single).toHaveLength(1);
    expect(single[0].completedAt).toBe(BigInt(2500));
  });

  it("mixed in-progress and completed: only completed are returned, sorted", () => {
    const mixed: TestResult[] = [
      makeResult({ username: "alice", completedAt: BigInt(0) }), // in progress
      makeResult({ username: "alice", completedAt: BigInt(500) }),
      makeResult({ username: "alice", completedAt: BigInt(1500) }),
    ];
    const result = listForUser(mixed, "alice", 50);
    expect(result).toHaveLength(2);
    expect(result[0].completedAt).toBe(BigInt(1500));
    expect(result[1].completedAt).toBe(BigInt(500));
  });
});

// ── testId and score fields are preserved ─────────────────────────────────────

describe("listMyTestResults — data integrity", () => {
  const specificResult = makeResult({
    username: "alice",
    completedAt: BigInt(9999),
    testId: BigInt(42),
    score: BigInt(5),
    totalQuestions: BigInt(5),
  });

  it("preserves testId, score, and totalQuestions fields", () => {
    const result = listForUser([specificResult], "alice", 50);
    expect(result[0].testId).toBe(BigInt(42));
    expect(result[0].score).toBe(BigInt(5));
    expect(result[0].totalQuestions).toBe(BigInt(5));
  });

  it("preserves sectionResults array from the original result", () => {
    const withSections = makeResult({
      username: "alice",
      completedAt: BigInt(100),
      sectionResults: [
        {
          sectionId: BigInt(1),
          sectionName: "Section A",
          score: BigInt(2),
          totalQuestions: BigInt(3),
        },
      ],
    });
    const result = listForUser([withSections], "alice", 50);
    expect(result[0].sectionResults).toHaveLength(1);
    expect(result[0].sectionResults[0].sectionName).toBe("Section A");
  });
});
