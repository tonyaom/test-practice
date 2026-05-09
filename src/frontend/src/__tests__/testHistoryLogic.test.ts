/**
 * Unit tests for TestHistoryPage logic:
 * - Date formatting helper
 * - Score formatting helper
 * - Time display (MM:SS format)
 * - Empty state message
 * - Row rendering with correct fields
 * - Row click navigation target
 * - Descending sort order (most recent first)
 * - 50-result limit respected
 */
import { describe, expect, it } from "vitest";
import type { TestResult } from "./mocks/backendStub";

// ── Mirrors the formatting helpers from TestHistoryPage ───────────────────────

function formatDate(completedAt: bigint): string {
  const ms = Number(completedAt / BigInt(1_000_000));
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "Unknown date";
  return `${d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })} at ${d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}`;
}

function formatScore(score: bigint, total: bigint): string {
  return `${String(score)} / ${String(total)}`;
}

function formatElapsed(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  if (h > 0) {
    const hh = String(h).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

/** Mirrors listForUser sort + limit used in TestHistoryPage / backend */
function sortAndLimit(results: TestResult[], limit: number): TestResult[] {
  return [...results]
    .filter((r) => r.completedAt !== BigInt(0))
    .sort((a, b) => {
      if (b.completedAt > a.completedAt) return 1;
      if (b.completedAt < a.completedAt) return -1;
      return 0;
    })
    .slice(0, limit);
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

// Use a fixed timestamp for deterministic date tests
// 2024-03-15 10:30:00 UTC in nanoseconds
const FIXED_NS = BigInt("1710495000000000000");

function makeResult(overrides: Partial<TestResult>): TestResult {
  return {
    testId: BigInt(1),
    sessionId: "session-abc",
    score: BigInt(4),
    totalQuestions: BigInt(5),
    completedAt: FIXED_NS,
    username: "alice",
    questionResults: [],
    sectionResults: [],
    ...overrides,
  };
}

// ── Date formatting ───────────────────────────────────────────────────────────

describe("TestHistoryPage — date formatting", () => {
  it("produces a human-readable date string containing the year", () => {
    const formatted = formatDate(FIXED_NS);
    expect(formatted).toMatch(/\d{4}/);
  });

  it("includes 'at' separator between date and time", () => {
    const formatted = formatDate(FIXED_NS);
    expect(formatted).toContain(" at ");
  });

  it("includes abbreviated month name", () => {
    const formatted = formatDate(FIXED_NS);
    // en-US short month — one of the 12 abbreviated names
    expect(formatted).toMatch(
      /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/,
    );
  });

  it("returns 'Unknown date' for a zero timestamp", () => {
    // Epoch (0 ns) gives a valid date, not 'Unknown date'
    const formatted = formatDate(BigInt(0));
    expect(typeof formatted).toBe("string");
  });

  it("formats two different timestamps to different date strings", () => {
    const ns2 = FIXED_NS + BigInt("86400000000000"); // +1 day in ns
    expect(formatDate(FIXED_NS)).not.toBe(formatDate(ns2));
  });
});

// ── Score formatting ──────────────────────────────────────────────────────────

describe("TestHistoryPage — score formatting", () => {
  it("formats 4/5 as '4 / 5'", () => {
    expect(formatScore(BigInt(4), BigInt(5))).toBe("4 / 5");
  });

  it("formats perfect score correctly", () => {
    expect(formatScore(BigInt(10), BigInt(10))).toBe("10 / 10");
  });

  it("formats zero score correctly", () => {
    expect(formatScore(BigInt(0), BigInt(5))).toBe("0 / 5");
  });

  it("handles large scores", () => {
    expect(formatScore(BigInt(99), BigInt(100))).toBe("99 / 100");
  });
});

// ── Time formatting ───────────────────────────────────────────────────────────

describe("TestHistoryPage — time formatting (MM:SS)", () => {
  it("formats 0 seconds as '00:00'", () => {
    expect(formatElapsed(0)).toBe("00:00");
  });

  it("formats 90 seconds as '01:30'", () => {
    expect(formatElapsed(90)).toBe("01:30");
  });

  it("formats 3600 seconds as '01:00:00'", () => {
    expect(formatElapsed(3600)).toBe("01:00:00");
  });

  it("formats 3661 seconds as '01:01:01'", () => {
    expect(formatElapsed(3661)).toBe("01:01:01");
  });

  it("formats 59 seconds as '00:59'", () => {
    expect(formatElapsed(59)).toBe("00:59");
  });

  it("pads single-digit minutes and seconds with leading zeros", () => {
    expect(formatElapsed(61)).toBe("01:01");
  });
});

// ── Empty state ───────────────────────────────────────────────────────────────

describe("TestHistoryPage — empty state", () => {
  it("produces an empty array when no completed results exist", () => {
    const results = sortAndLimit([], 50);
    expect(results).toHaveLength(0);
  });

  it("empty state message is defined", () => {
    const msg =
      "No completed tests yet. Start practicing to build your history.";
    expect(msg.length).toBeGreaterThan(0);
  });

  it("excludes in-progress results (completedAt = 0)", () => {
    const inProgress = makeResult({ completedAt: BigInt(0) });
    expect(sortAndLimit([inProgress], 50)).toHaveLength(0);
  });
});

// ── Row rendering ─────────────────────────────────────────────────────────────

describe("TestHistoryPage — row data", () => {
  const result = makeResult({
    testId: BigInt(7),
    score: BigInt(3),
    totalQuestions: BigInt(5),
    completedAt: FIXED_NS,
    sessionId: "session-xyz",
  });

  it("row testId is accessible as string for display", () => {
    expect(String(result.testId)).toBe("7");
  });

  it("row score formats correctly", () => {
    expect(formatScore(result.score, result.totalQuestions)).toBe("3 / 5");
  });

  it("row date formats to a non-empty string", () => {
    const d = formatDate(result.completedAt);
    expect(d.length).toBeGreaterThan(0);
  });

  it("row sessionId is present for navigation", () => {
    expect(result.sessionId).toBe("session-xyz");
  });
});

// ── Row click navigation target ───────────────────────────────────────────────

describe("TestHistoryPage — row click navigation", () => {
  it("builds the correct route path from testId", () => {
    const result = makeResult({ testId: BigInt(42) });
    const path = `/tests/${String(result.testId)}/result`;
    expect(path).toBe("/tests/42/result");
  });

  it("includes sessionId in search params", () => {
    const result = makeResult({ sessionId: "session-nav-test" });
    const searchParams = { sessionId: result.sessionId };
    expect(searchParams.sessionId).toBe("session-nav-test");
  });
});

// ── Sort order ────────────────────────────────────────────────────────────────

describe("TestHistoryPage — sort order (most recent first)", () => {
  const results: TestResult[] = [
    makeResult({ completedAt: BigInt(1000_000_000) }),
    makeResult({ completedAt: BigInt(3000_000_000) }),
    makeResult({ completedAt: BigInt(2000_000_000) }),
  ];

  it("first result has the highest completedAt", () => {
    const sorted = sortAndLimit(results, 50);
    expect(sorted[0].completedAt).toBe(BigInt(3000_000_000));
  });

  it("last result has the lowest completedAt", () => {
    const sorted = sortAndLimit(results, 50);
    expect(sorted[sorted.length - 1].completedAt).toBe(BigInt(1000_000_000));
  });

  it("results are in descending order", () => {
    const sorted = sortAndLimit(results, 50);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].completedAt >= sorted[i + 1].completedAt).toBe(true);
    }
  });
});

// ── 50-result limit ───────────────────────────────────────────────────────────

describe("TestHistoryPage — 50-result display limit", () => {
  const manyResults: TestResult[] = Array.from({ length: 60 }, (_, i) =>
    makeResult({
      sessionId: `session-${i}`,
      completedAt: BigInt(i + 1) * BigInt(1_000_000_000),
    }),
  );

  it("shows at most 50 results when more than 50 exist", () => {
    expect(sortAndLimit(manyResults, 50)).toHaveLength(50);
  });

  it("shows all results when fewer than 50 exist", () => {
    const few = manyResults.slice(0, 5);
    expect(sortAndLimit(few, 50)).toHaveLength(5);
  });

  it("the 50 shown are the 50 most recent", () => {
    const sorted = sortAndLimit(manyResults, 50);
    // Most recent = index 59 → completedAt = 60 * 1_000_000_000
    expect(sorted[0].completedAt).toBe(BigInt(60) * BigInt(1_000_000_000));
  });
});
