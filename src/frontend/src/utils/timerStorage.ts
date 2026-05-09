/**
 * Timer storage — tracks elapsed seconds per test session.
 *
 * Timers are elapsed-only (no countdown).
 *
 * Key pattern: timer:{sessionId}
 */

const TIMER_PREFIX = "timer:";

function timerKey(sessionId: string): string {
  return `${TIMER_PREFIX}${sessionId}`;
}

/**
 * Get elapsed seconds for a session.
 * Returns 0 if no timer has been stored yet.
 */
export function getElapsedSeconds(sessionId: string): number {
  try {
    const raw = localStorage.getItem(timerKey(sessionId));
    if (raw === null) return 0;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

/**
 * Store the elapsed seconds for a session.
 */
export function setElapsedSeconds(sessionId: string, seconds: number): void {
  try {
    const value = Math.max(0, Math.floor(seconds));
    localStorage.setItem(timerKey(sessionId), String(value));
  } catch {
    // localStorage may be full — silently ignore
  }
}

/**
 * Remove the timer entry for a session (e.g. after test submission).
 */
export function clearTimer(sessionId: string): void {
  try {
    localStorage.removeItem(timerKey(sessionId));
  } catch {
    // ignore
  }
}

/** Alias for clearTimer — matches the name used in TakeTestPage. */
export const clearElapsedSeconds = clearTimer;

/**
 * Format elapsed seconds as a human-readable string.
 * Examples: 65 -> "1:05", 3661 -> "1:01:01"
 */
export function formatElapsed(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${mins}:${String(secs).padStart(2, "0")}`;
}
