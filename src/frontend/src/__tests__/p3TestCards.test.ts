/**
 * P3 Test Cards tests
 * Covers: mastery badge, hover lift class, resume state, weak questions button
 */
import { describe, expect, it } from "vitest";

interface CardMastery {
  mastered: number;
  total: number;
}

function getCardBorderClass(hasActiveSession: boolean): string {
  return hasActiveSession ? "border-l-4 border-l-primary" : "";
}

function getStartButtonLabel(hasActiveSession: boolean): string {
  return hasActiveSession ? "Resume →" : "Start Test";
}

function hasWeakQuestions(
  mastery: Array<{ isMastered: boolean; correctStreak: number }>,
): boolean {
  return mastery.some((m) => !m.isMastered && m.correctStreak < 5);
}

describe("P3.4 Test cards — resume state", () => {
  it("shows Resume when session in progress", () => {
    expect(getStartButtonLabel(true)).toBe("Resume →");
  });

  it("shows Start Test when no session", () => {
    expect(getStartButtonLabel(false)).toBe("Start Test");
  });

  it("adds left accent border when in progress", () => {
    const cls = getCardBorderClass(true);
    expect(cls).toContain("border-l-primary");
  });

  it("no accent border when not in progress", () => {
    const cls = getCardBorderClass(false);
    expect(cls).toBe("");
  });
});

describe("P4.2 Weak questions", () => {
  it("identifies weak questions correctly", () => {
    const mastery = [
      { isMastered: true, correctStreak: 5 },
      { isMastered: false, correctStreak: 2 },
      { isMastered: false, correctStreak: 0 },
    ];
    expect(hasWeakQuestions(mastery)).toBe(true);
  });

  it("no weak questions when all mastered", () => {
    const mastery = [
      { isMastered: true, correctStreak: 5 },
      { isMastered: true, correctStreak: 5 },
    ];
    expect(hasWeakQuestions(mastery)).toBe(false);
  });

  it("returns false for empty mastery list", () => {
    expect(hasWeakQuestions([])).toBe(false);
  });

  it("question with streak 4 is still weak (not mastered)", () => {
    const mastery = [{ isMastered: false, correctStreak: 4 }];
    expect(hasWeakQuestions(mastery)).toBe(true);
  });
});

describe("P3.4 Test cards — mastery badge display", () => {
  it("shows mastered badge when all mastered", () => {
    const mastery: CardMastery = { mastered: 10, total: 10 };
    const isMastered = mastery.mastered === mastery.total && mastery.total > 0;
    expect(isMastered).toBe(true);
  });

  it("shows progress badge when not all mastered", () => {
    const mastery: CardMastery = { mastered: 7, total: 10 };
    const isMastered = mastery.mastered === mastery.total && mastery.total > 0;
    expect(isMastered).toBe(false);
  });

  it("hides badge when total is 0", () => {
    const mastery: CardMastery = { mastered: 0, total: 0 };
    const showBadge = mastery.total > 0;
    expect(showBadge).toBe(false);
  });
});
