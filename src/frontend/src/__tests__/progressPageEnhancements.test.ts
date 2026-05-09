/**
 * Progress page enhancement tests.
 *
 * Verifies:
 * - Test mastery detection (all questions mastered)
 * - Mastery summary computation (totals across tests)
 * - Per-test mastery percentage calculation
 * - Lifetime time formatting
 * - Section score extraction from TestResult
 */
import { describe, expect, it } from "vitest";
import { formatElapsed } from "../utils/timerStorage";

// ── Types (mirrors backend/UserProgressInfo) ─────────────────────────────────

interface ProgressInfo {
  testId: bigint;
  username: string;
  totalQuestions: bigint;
  masteredCount: bigint;
  inProgressCount: bigint;
}

interface SectionResult {
  sectionId: bigint;
  sectionName: string;
  score: bigint;
  totalQuestions: bigint;
}

// ── Helpers mirroring AdminUsersPage UserProgressModal logic ─────────────────

function isTestMastered(p: ProgressInfo): boolean {
  const total = Number(p.totalQuestions);
  const mastered = Number(p.masteredCount);
  return total > 0 && mastered === total;
}

function masteryPct(p: ProgressInfo): number {
  const total = Number(p.totalQuestions);
  if (total === 0) return 0;
  return Math.round((Number(p.masteredCount) / total) * 100);
}

function summarizeProgress(progressList: ProgressInfo[]): {
  totalMastered: number;
  totalQuestions: number;
  totalInProgress: number;
  masteredTests: number;
} {
  return {
    totalMastered: progressList.reduce(
      (sum, p) => sum + Number(p.masteredCount),
      0,
    ),
    totalQuestions: progressList.reduce(
      (sum, p) => sum + Number(p.totalQuestions),
      0,
    ),
    totalInProgress: progressList.reduce(
      (sum, p) => sum + Number(p.inProgressCount),
      0,
    ),
    masteredTests: progressList.filter(isTestMastered).length,
  };
}

function sectionPct(sr: SectionResult): number {
  const total = Number(sr.totalQuestions);
  if (total === 0) return 0;
  return Math.round((Number(sr.score) / total) * 100);
}

// ── isTestMastered ────────────────────────────────────────────────────────────

describe("isTestMastered", () => {
  it("returns true when all questions are mastered", () => {
    expect(
      isTestMastered({
        testId: BigInt(1),
        username: "u",
        totalQuestions: BigInt(5),
        masteredCount: BigInt(5),
        inProgressCount: BigInt(0),
      }),
    ).toBe(true);
  });

  it("returns false when only some questions are mastered", () => {
    expect(
      isTestMastered({
        testId: BigInt(1),
        username: "u",
        totalQuestions: BigInt(5),
        masteredCount: BigInt(3),
        inProgressCount: BigInt(1),
      }),
    ).toBe(false);
  });

  it("returns false for zero questions (no division by zero)", () => {
    expect(
      isTestMastered({
        testId: BigInt(1),
        username: "u",
        totalQuestions: BigInt(0),
        masteredCount: BigInt(0),
        inProgressCount: BigInt(0),
      }),
    ).toBe(false);
  });

  it("returns false when mastered=0", () => {
    expect(
      isTestMastered({
        testId: BigInt(2),
        username: "u",
        totalQuestions: BigInt(4),
        masteredCount: BigInt(0),
        inProgressCount: BigInt(2),
      }),
    ).toBe(false);
  });

  it("returns true when single question test is mastered", () => {
    expect(
      isTestMastered({
        testId: BigInt(3),
        username: "u",
        totalQuestions: BigInt(1),
        masteredCount: BigInt(1),
        inProgressCount: BigInt(0),
      }),
    ).toBe(true);
  });
});

// ── masteryPct ────────────────────────────────────────────────────────────────

describe("masteryPct", () => {
  it("returns 0 for empty test", () => {
    expect(
      masteryPct({
        testId: BigInt(1),
        username: "u",
        totalQuestions: BigInt(0),
        masteredCount: BigInt(0),
        inProgressCount: BigInt(0),
      }),
    ).toBe(0);
  });

  it("returns 100 when fully mastered", () => {
    expect(
      masteryPct({
        testId: BigInt(1),
        username: "u",
        totalQuestions: BigInt(10),
        masteredCount: BigInt(10),
        inProgressCount: BigInt(0),
      }),
    ).toBe(100);
  });

  it("returns 50 when half mastered", () => {
    expect(
      masteryPct({
        testId: BigInt(1),
        username: "u",
        totalQuestions: BigInt(10),
        masteredCount: BigInt(5),
        inProgressCount: BigInt(2),
      }),
    ).toBe(50);
  });

  it("rounds percentage correctly (3/7 ≈ 43%)", () => {
    expect(
      masteryPct({
        testId: BigInt(1),
        username: "u",
        totalQuestions: BigInt(7),
        masteredCount: BigInt(3),
        inProgressCount: BigInt(1),
      }),
    ).toBe(43);
  });
});

// ── summarizeProgress ─────────────────────────────────────────────────────────

describe("summarizeProgress", () => {
  it("returns zeros for empty list", () => {
    const s = summarizeProgress([]);
    expect(s.totalMastered).toBe(0);
    expect(s.totalQuestions).toBe(0);
    expect(s.totalInProgress).toBe(0);
    expect(s.masteredTests).toBe(0);
  });

  it("sums mastered, questions, and in-progress across tests", () => {
    const list: ProgressInfo[] = [
      {
        testId: BigInt(1),
        username: "u",
        totalQuestions: BigInt(5),
        masteredCount: BigInt(5),
        inProgressCount: BigInt(0),
      },
      {
        testId: BigInt(2),
        username: "u",
        totalQuestions: BigInt(8),
        masteredCount: BigInt(3),
        inProgressCount: BigInt(2),
      },
    ];
    const s = summarizeProgress(list);
    expect(s.totalMastered).toBe(8);
    expect(s.totalQuestions).toBe(13);
    expect(s.totalInProgress).toBe(2);
  });

  it("counts masteredTests correctly", () => {
    const list: ProgressInfo[] = [
      {
        testId: BigInt(1),
        username: "u",
        totalQuestions: BigInt(4),
        masteredCount: BigInt(4),
        inProgressCount: BigInt(0),
      }, // mastered
      {
        testId: BigInt(2),
        username: "u",
        totalQuestions: BigInt(4),
        masteredCount: BigInt(2),
        inProgressCount: BigInt(1),
      }, // not mastered
      {
        testId: BigInt(3),
        username: "u",
        totalQuestions: BigInt(2),
        masteredCount: BigInt(2),
        inProgressCount: BigInt(0),
      }, // mastered
    ];
    const s = summarizeProgress(list);
    expect(s.masteredTests).toBe(2);
  });

  it("single test fully mastered", () => {
    const list: ProgressInfo[] = [
      {
        testId: BigInt(1),
        username: "u",
        totalQuestions: BigInt(3),
        masteredCount: BigInt(3),
        inProgressCount: BigInt(0),
      },
    ];
    const s = summarizeProgress(list);
    expect(s.masteredTests).toBe(1);
    expect(s.totalMastered).toBe(3);
  });
});

// ── sectionPct ────────────────────────────────────────────────────────────────

describe("sectionPct", () => {
  it("returns 0 for zero total", () => {
    expect(
      sectionPct({
        sectionId: BigInt(1),
        sectionName: "S",
        score: BigInt(0),
        totalQuestions: BigInt(0),
      }),
    ).toBe(0);
  });

  it("returns 100 for perfect section score", () => {
    expect(
      sectionPct({
        sectionId: BigInt(1),
        sectionName: "S",
        score: BigInt(5),
        totalQuestions: BigInt(5),
      }),
    ).toBe(100);
  });

  it("returns 75 for 3/4 score", () => {
    expect(
      sectionPct({
        sectionId: BigInt(2),
        sectionName: "S",
        score: BigInt(3),
        totalQuestions: BigInt(4),
      }),
    ).toBe(75);
  });
});

// ── Lifetime time formatting (uses timerStorage.formatElapsed) ────────────────

describe("Lifetime time formatting", () => {
  it("formats 0 seconds as '0:00'", () => {
    expect(formatElapsed(0)).toBe("0:00");
  });

  it("formats 65 seconds as '1:05'", () => {
    expect(formatElapsed(65)).toBe("1:05");
  });

  it("formats 3661 seconds as '1:01:01'", () => {
    expect(formatElapsed(3661)).toBe("1:01:01");
  });

  it("formats 1800 seconds as '30:00'", () => {
    expect(formatElapsed(1800)).toBe("30:00");
  });

  it("formats 7200 seconds as '2:00:00'", () => {
    expect(formatElapsed(7200)).toBe("2:00:00");
  });
});

// ── TestHistory section scores extraction ─────────────────────────────────────

describe("TestHistory section score display", () => {
  interface MockTestResult {
    sessionId: string;
    testId: bigint;
    score: bigint;
    totalQuestions: bigint;
    sectionResults: SectionResult[];
    completedAt: bigint;
  }

  it("extracts section scores from a TestResult with sections", () => {
    const result: MockTestResult = {
      sessionId: "s1",
      testId: BigInt(1),
      score: BigInt(7),
      totalQuestions: BigInt(10),
      completedAt: BigInt(0),
      sectionResults: [
        {
          sectionId: BigInt(1),
          sectionName: "Chapter 1",
          score: BigInt(4),
          totalQuestions: BigInt(5),
        },
        {
          sectionId: BigInt(2),
          sectionName: "Chapter 2",
          score: BigInt(3),
          totalQuestions: BigInt(5),
        },
      ],
    };
    const hasSections =
      Array.isArray(result.sectionResults) && result.sectionResults.length > 0;
    expect(hasSections).toBe(true);
    expect(result.sectionResults[0].sectionName).toBe("Chapter 1");
    expect(sectionPct(result.sectionResults[0])).toBe(80);
    expect(sectionPct(result.sectionResults[1])).toBe(60);
  });

  it("hasSections is false when sectionResults is empty", () => {
    const hasSections = (result: MockTestResult) =>
      Array.isArray(result.sectionResults) && result.sectionResults.length > 0;
    expect(
      hasSections({
        sessionId: "s2",
        testId: BigInt(1),
        score: BigInt(3),
        totalQuestions: BigInt(5),
        completedAt: BigInt(0),
        sectionResults: [],
      }),
    ).toBe(false);
  });
});
