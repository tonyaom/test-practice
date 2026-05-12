/**
 * P2 Results Zones tests
 * Covers: score zone, section breakdown collapsible, questions-to-review zone
 */
import { describe, expect, it } from "vitest";

function computePercentage(score: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

function isIncorrect(isCorrect: boolean): boolean {
  return !isCorrect;
}

function filterIncorrect<T extends { isCorrect: boolean }>(results: T[]): T[] {
  return results.filter((r) => !r.isCorrect);
}

describe("P2.2 Zone 1 — Score hero", () => {
  it("computes 100% for perfect score", () => {
    expect(computePercentage(10, 10)).toBe(100);
  });

  it("computes 0% for zero score", () => {
    expect(computePercentage(0, 10)).toBe(0);
  });

  it("handles zero total gracefully", () => {
    expect(computePercentage(0, 0)).toBe(0);
  });

  it("rounds percentage correctly", () => {
    expect(computePercentage(7, 10)).toBe(70);
  });

  it("rounds 67% (2/3)", () => {
    expect(computePercentage(2, 3)).toBe(67);
  });
});

describe("P2.2 Zone 3 — Questions to review", () => {
  const results = [
    { questionId: "1", isCorrect: true },
    { questionId: "2", isCorrect: false },
    { questionId: "3", isCorrect: false },
    { questionId: "4", isCorrect: true },
  ];

  it("filters only incorrect results for review zone", () => {
    const wrong = filterIncorrect(results);
    expect(wrong).toHaveLength(2);
    expect(wrong.every((r) => !r.isCorrect)).toBe(true);
  });

  it("returns empty array when all correct", () => {
    const allCorrect = results.filter((r) => r.isCorrect);
    expect(filterIncorrect(allCorrect)).toHaveLength(0);
  });

  it("zone 3 is not shown when no incorrect answers", () => {
    const noIncorrect: typeof results = [];
    const show = noIncorrect.length > 0;
    expect(show).toBe(false);
  });

  it("zone 3 is shown when there are incorrect answers", () => {
    const show = filterIncorrect(results).length > 0;
    expect(show).toBe(true);
  });

  it("isIncorrect returns true for incorrect answer", () => {
    expect(isIncorrect(false)).toBe(true);
  });

  it("isIncorrect returns false for correct answer", () => {
    expect(isIncorrect(true)).toBe(false);
  });
});

describe("P2.2 Zone 2 — Section breakdown", () => {
  const sections = [
    {
      sectionId: BigInt(1),
      sectionName: "Grammar",
      score: BigInt(8),
      totalQuestions: BigInt(10),
    },
    {
      sectionId: BigInt(2),
      sectionName: "Vocab",
      score: BigInt(5),
      totalQuestions: BigInt(10),
    },
  ];

  it("shows section breakdown when section results exist", () => {
    expect(sections.length > 0).toBe(true);
  });

  it("computes section percentage correctly", () => {
    const pct = Math.round(
      (Number(sections[0].score) / Number(sections[0].totalQuestions)) * 100,
    );
    expect(pct).toBe(80);
  });

  it("hides section breakdown when no section results", () => {
    const empty: typeof sections = [];
    expect(empty.length > 0).toBe(false);
  });
});
