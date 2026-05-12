/**
 * P3 Streak Badge tests
 * Covers: hide when 0, gold at 7+, tooltip text
 */
import { describe, expect, it } from "vitest";

function shouldShowStreakBadge(streakCount: number): boolean {
  return streakCount > 0;
}

function isGoldStreak(streakCount: number): boolean {
  return streakCount >= 7;
}

function getStreakTooltip(streakCount: number): string {
  return `${streakCount}-day study streak — practice today to keep it going!`;
}

describe("P3.6 Streak badge — visibility", () => {
  it("hides badge when streak is 0", () => {
    expect(shouldShowStreakBadge(0)).toBe(false);
  });

  it("shows badge when streak is 1", () => {
    expect(shouldShowStreakBadge(1)).toBe(true);
  });

  it("shows badge when streak is 5", () => {
    expect(shouldShowStreakBadge(5)).toBe(true);
  });

  it("shows badge when streak is 7", () => {
    expect(shouldShowStreakBadge(7)).toBe(true);
  });
});

describe("P3.6 Streak badge — gold at 7+", () => {
  it("streak is NOT gold at 6", () => {
    expect(isGoldStreak(6)).toBe(false);
  });

  it("streak IS gold at 7", () => {
    expect(isGoldStreak(7)).toBe(true);
  });

  it("streak IS gold at 100", () => {
    expect(isGoldStreak(100)).toBe(true);
  });

  it("streak is NOT gold at 0", () => {
    expect(isGoldStreak(0)).toBe(false);
  });
});

describe("P3.6 Streak badge — tooltip", () => {
  it("tooltip contains streak count", () => {
    const tip = getStreakTooltip(5);
    expect(tip).toContain("5");
  });

  it("tooltip says 'practice today'", () => {
    const tip = getStreakTooltip(3);
    expect(tip).toContain("practice today");
  });

  it("tooltip shows correct day count", () => {
    const tip = getStreakTooltip(7);
    expect(tip).toContain("7-day");
  });
});
