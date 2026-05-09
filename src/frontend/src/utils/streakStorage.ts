/**
 * Streak storage — tracks daily study streaks per user.
 *
 * A streak increments when the user completes a test on a new calendar day
 * (local time). If a full calendar day is skipped the streak resets to 1.
 * Same-day completions do not change the streak count.
 *
 * Key pattern: streak:{username}
 */

export interface StreakData {
  /** Current consecutive-day streak. */
  currentStreak: number;
  /** ISO date string of the last day a test was completed (YYYY-MM-DD, local). */
  lastCompletedDate: string;
  /** Highest streak ever recorded for this user. */
  longestStreak: number;
}

const STREAK_PREFIX = "streak:";

const EMPTY_STREAK: StreakData = {
  currentStreak: 0,
  lastCompletedDate: "",
  longestStreak: 0,
};

function streakKey(username: string): string {
  return `${STREAK_PREFIX}${username}`;
}

/** Return today's date as YYYY-MM-DD in local time. */
export function todayLocalDate(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Compute the difference in calendar days between two YYYY-MM-DD strings.
 * Positive means b is after a.
 */
function dayDiff(a: string, b: string): number {
  const msPerDay = 86_400_000;
  const tsA = new Date(a).getTime();
  const tsB = new Date(b).getTime();
  return Math.round((tsB - tsA) / msPerDay);
}

/** Retrieve the streak record for a user. Returns a zero-streak if not found. */
export function getStreak(username: string): StreakData {
  try {
    const raw = localStorage.getItem(streakKey(username));
    if (!raw) return { ...EMPTY_STREAK };
    return JSON.parse(raw) as StreakData;
  } catch {
    return { ...EMPTY_STREAK };
  }
}

function saveStreak(username: string, data: StreakData): void {
  try {
    localStorage.setItem(streakKey(username), JSON.stringify(data));
  } catch {
    // localStorage may be full — silently ignore
  }
}

/**
 * Record that the user completed a test today.
 *
 * Rules:
 * - First completion ever → streak = 1
 * - Same calendar day as last completion → no change
 * - Exactly 1 calendar day later → streak + 1
 * - 2+ calendar days later (missed at least one day) → streak resets to 1
 *
 * longestStreak is updated whenever currentStreak exceeds it.
 *
 * Returns the updated StreakData.
 */
export function recordTestCompletion(username: string): StreakData {
  const today = todayLocalDate();
  const current = getStreak(username);

  if (!current.lastCompletedDate) {
    // First ever completion
    const updated: StreakData = {
      currentStreak: 1,
      lastCompletedDate: today,
      longestStreak: 1,
    };
    saveStreak(username, updated);
    return updated;
  }

  const diff = dayDiff(current.lastCompletedDate, today);

  if (diff === 0) {
    // Same day — no change
    return { ...current };
  }

  let newStreak: number;
  if (diff === 1) {
    // Consecutive day
    newStreak = current.currentStreak + 1;
  } else {
    // Missed one or more days — reset
    newStreak = 1;
  }

  const updated: StreakData = {
    currentStreak: newStreak,
    lastCompletedDate: today,
    longestStreak: Math.max(current.longestStreak, newStreak),
  };
  saveStreak(username, updated);
  return updated;
}

/**
 * Returns a short display string for the streak, e.g. "🔥 5".
 * Returns "🔥 0" for users with no streak.
 */
export function getStreakDisplay(username: string): string {
  const { currentStreak } = getStreak(username);
  return `🔥 ${currentStreak}`;
}
