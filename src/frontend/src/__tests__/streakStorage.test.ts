import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  type StreakData,
  getStreak,
  getStreakDisplay,
  recordTestCompletion,
  todayLocalDate,
} from "../utils/streakStorage";

const USER = "charlie";
const OTHER_USER = "diana";

/** Freeze Date.now and new Date() to a specific YYYY-MM-DD local date string. */
function setFakeDate(dateStr: string): void {
  // Parse as local midnight
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day, 0, 0, 0, 0);
  vi.setSystemTime(d);
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("streakStorage", () => {
  describe("getStreak", () => {
    it("returns zero streak for a fresh user", () => {
      const data: StreakData = getStreak(USER);
      expect(data.currentStreak).toBe(0);
      expect(data.longestStreak).toBe(0);
      expect(data.lastCompletedDate).toBe("");
    });

    it("is isolated per user", () => {
      setFakeDate("2024-03-01");
      recordTestCompletion(USER);
      expect(getStreak(OTHER_USER).currentStreak).toBe(0);
    });
  });

  describe("recordTestCompletion", () => {
    it("sets streak to 1 on the very first completion", () => {
      setFakeDate("2024-03-01");
      const result = recordTestCompletion(USER);
      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(1);
      expect(result.lastCompletedDate).toBe("2024-03-01");
    });

    it("does not change streak when completing again on the same day", () => {
      setFakeDate("2024-03-01");
      recordTestCompletion(USER); // streak = 1
      const result = recordTestCompletion(USER); // same day
      expect(result.currentStreak).toBe(1);
    });

    it("increments streak to 2 on the next consecutive day", () => {
      setFakeDate("2024-03-01");
      recordTestCompletion(USER);
      setFakeDate("2024-03-02");
      const result = recordTestCompletion(USER);
      expect(result.currentStreak).toBe(2);
      expect(result.longestStreak).toBe(2);
    });

    it("continues incrementing over multiple consecutive days", () => {
      setFakeDate("2024-03-01");
      recordTestCompletion(USER);
      setFakeDate("2024-03-02");
      recordTestCompletion(USER);
      setFakeDate("2024-03-03");
      const result = recordTestCompletion(USER);
      expect(result.currentStreak).toBe(3);
      expect(result.longestStreak).toBe(3);
    });

    it("resets streak to 1 when a day is missed", () => {
      setFakeDate("2024-03-01");
      recordTestCompletion(USER); // streak = 1
      setFakeDate("2024-03-02");
      recordTestCompletion(USER); // streak = 2
      setFakeDate("2024-03-04"); // skipped 2024-03-03
      const result = recordTestCompletion(USER);
      expect(result.currentStreak).toBe(1);
    });

    it("preserves longestStreak after a reset", () => {
      setFakeDate("2024-03-01");
      recordTestCompletion(USER);
      setFakeDate("2024-03-02");
      recordTestCompletion(USER);
      setFakeDate("2024-03-03");
      recordTestCompletion(USER); // longest = 3
      setFakeDate("2024-03-05"); // missed a day
      const result = recordTestCompletion(USER);
      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(3);
    });

    it("updates longestStreak when current streak surpasses it", () => {
      setFakeDate("2024-01-01");
      recordTestCompletion(USER);
      setFakeDate("2024-01-02");
      recordTestCompletion(USER);
      setFakeDate("2024-01-04"); // break — streak resets to 1
      recordTestCompletion(USER);
      setFakeDate("2024-01-05");
      recordTestCompletion(USER);
      setFakeDate("2024-01-06");
      recordTestCompletion(USER); // streak = 3, surpasses previous longest of 2
      const result = recordTestCompletion(USER);
      expect(result.currentStreak).toBe(3); // same day — unchanged
      expect(result.longestStreak).toBe(3);
    });

    it("is isolated per user", () => {
      setFakeDate("2024-03-01");
      recordTestCompletion(USER);
      setFakeDate("2024-03-02");
      recordTestCompletion(USER); // USER streak = 2
      setFakeDate("2024-03-01");
      recordTestCompletion(OTHER_USER); // OTHER_USER streak = 1
      expect(getStreak(USER).currentStreak).toBe(2);
      expect(getStreak(OTHER_USER).currentStreak).toBe(1);
    });
  });

  describe("getStreakDisplay", () => {
    it('returns "🔥 0" for a user with no streak', () => {
      expect(getStreakDisplay(USER)).toBe("🔥 0");
    });

    it("returns the correct emoji + count after completions", () => {
      setFakeDate("2024-03-01");
      recordTestCompletion(USER);
      setFakeDate("2024-03-02");
      recordTestCompletion(USER);
      expect(getStreakDisplay(USER)).toBe("🔥 2");
    });
  });

  describe("todayLocalDate", () => {
    it("returns a YYYY-MM-DD string", () => {
      setFakeDate("2024-06-15");
      const result = todayLocalDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result).toBe("2024-06-15");
    });
  });
});
