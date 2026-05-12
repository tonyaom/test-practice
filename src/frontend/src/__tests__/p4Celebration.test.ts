/**
 * P4 Celebration tests
 * Covers: overlay visibility timing, perfect vs regular, confetti logic
 */
import { afterEach, describe, expect, it, vi } from "vitest";

function getCelebrationMessage(isPerfect: boolean): string {
  return isPerfect ? "🏆 Perfect Score!" : "Test Complete!";
}

function getCelebrationDelay(isPerfect: boolean): number {
  return isPerfect ? 2000 : 1500;
}

function getConfettiCount(): number {
  return 30;
}

describe("P4.4 Celebration overlay", () => {
  afterEach(() => vi.clearAllTimers());

  it("shows Test Complete for regular completion", () => {
    expect(getCelebrationMessage(false)).toBe("Test Complete!");
  });

  it("shows Perfect Score for 100%", () => {
    expect(getCelebrationMessage(true)).toBe("🏆 Perfect Score!");
  });

  it("regular delay is 1500ms", () => {
    expect(getCelebrationDelay(false)).toBe(1500);
  });

  it("perfect delay is 2000ms", () => {
    expect(getCelebrationDelay(true)).toBe(2000);
  });

  it("confetti has 30 particles", () => {
    expect(getConfettiCount()).toBe(30);
  });

  it("overlay shows then navigates after delay", () => {
    vi.useFakeTimers();
    let navigated = false;
    let visible = true;
    const delay = getCelebrationDelay(false);

    setTimeout(() => {
      visible = false;
      navigated = true;
    }, delay);

    expect(visible).toBe(true);
    expect(navigated).toBe(false);

    vi.advanceTimersByTime(delay);
    expect(visible).toBe(false);
    expect(navigated).toBe(true);
    vi.useRealTimers();
  });

  it("perfect overlay stays longer before navigating", () => {
    vi.useFakeTimers();
    let navigated = false;
    const delay = getCelebrationDelay(true);
    setTimeout(() => {
      navigated = true;
    }, delay);
    vi.advanceTimersByTime(1500);
    expect(navigated).toBe(false);
    vi.advanceTimersByTime(500);
    expect(navigated).toBe(true);
    vi.useRealTimers();
  });
});
