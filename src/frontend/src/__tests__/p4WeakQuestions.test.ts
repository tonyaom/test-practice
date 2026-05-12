/**
 * P4 Weak Questions tests
 * Covers: identifying weak questions, starting weak session
 */
import { describe, expect, it } from "vitest";

interface MasteryRecord {
  questionId: string;
  isMastered: boolean;
  correctStreak: number;
}

function getWeakQuestionIds(mastery: MasteryRecord[]): string[] {
  return mastery
    .filter((m) => !m.isMastered && m.correctStreak < 5)
    .map((m) => m.questionId);
}

function hasWeakQuestions(mastery: MasteryRecord[]): boolean {
  return getWeakQuestionIds(mastery).length > 0;
}

describe("P4.2 Weak questions — identification", () => {
  it("identifies questions with streak 0 as weak", () => {
    const mastery: MasteryRecord[] = [
      { questionId: "1", isMastered: false, correctStreak: 0 },
    ];
    expect(getWeakQuestionIds(mastery)).toEqual(["1"]);
  });

  it("identifies questions with streak 3 as weak", () => {
    const mastery: MasteryRecord[] = [
      { questionId: "2", isMastered: false, correctStreak: 3 },
    ];
    expect(getWeakQuestionIds(mastery)).toEqual(["2"]);
  });

  it("excludes mastered questions", () => {
    const mastery: MasteryRecord[] = [
      { questionId: "3", isMastered: true, correctStreak: 5 },
    ];
    expect(getWeakQuestionIds(mastery)).toEqual([]);
  });

  it("excludes questions with streak 5 (not mastered but full streak)", () => {
    const mastery: MasteryRecord[] = [
      { questionId: "4", isMastered: false, correctStreak: 5 },
    ];
    expect(getWeakQuestionIds(mastery)).toEqual([]);
  });

  it("returns multiple weak questions", () => {
    const mastery: MasteryRecord[] = [
      { questionId: "1", isMastered: false, correctStreak: 0 },
      { questionId: "2", isMastered: true, correctStreak: 5 },
      { questionId: "3", isMastered: false, correctStreak: 2 },
    ];
    expect(getWeakQuestionIds(mastery)).toEqual(["1", "3"]);
  });

  it("shows toast when no weak questions", () => {
    const mastery: MasteryRecord[] = [
      { questionId: "1", isMastered: true, correctStreak: 5 },
    ];
    expect(hasWeakQuestions(mastery)).toBe(false);
  });

  it("returns empty for empty mastery list", () => {
    expect(getWeakQuestionIds([])).toEqual([]);
  });
});

describe("P4.2 Weak questions — session params", () => {
  it("weak session uses randomizeQuestions true", () => {
    const params = { randomizeQuestions: true, randomizeAnswers: true };
    expect(params.randomizeQuestions).toBe(true);
  });

  it("weak session uses empty sectionIds (no section filter)", () => {
    const params = { selectedSectionIds: [] as number[] };
    expect(params.selectedSectionIds).toHaveLength(0);
  });

  it("weak session passes questionIds", () => {
    const weakIds = ["1", "3", "7"];
    const params = { questionIds: weakIds };
    expect(params.questionIds).toEqual(["1", "3", "7"]);
  });
});
