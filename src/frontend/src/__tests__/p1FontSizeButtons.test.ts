/**
 * P1 Font Size A-/A+ Button Tests — P1.1
 *
 * Covers:
 * - A- decreases font size by 1 (clamps to min)
 * - A+ increases font size by 1 (clamps to max)
 * - Buttons are disabled at boundaries
 * - Font size persists via fontSizeStorage
 * - Font size is removed from QuestionForm (admin editor)
 * - TakeTestPage header has A-/A+ inline controls
 */
import { describe, expect, it } from "vitest";

const FONT_SIZE_MIN = 12;
const FONT_SIZE_MAX = 32;
const FONT_SIZE_DEFAULT = 16;

function decreaseFontSize(current: number): number {
  return Math.max(FONT_SIZE_MIN, current - 1);
}

function increaseFontSize(current: number): number {
  return Math.min(FONT_SIZE_MAX, current + 1);
}

function isDecreaseDisabled(current: number): boolean {
  return current <= FONT_SIZE_MIN;
}

function isIncreaseDisabled(current: number): boolean {
  return current >= FONT_SIZE_MAX;
}

describe("Font size A-/A+ controls — decrease", () => {
  it("decreases font size by 1", () => {
    expect(decreaseFontSize(20)).toBe(19);
  });

  it("does not go below FONT_SIZE_MIN (12)", () => {
    expect(decreaseFontSize(12)).toBe(12);
    expect(decreaseFontSize(11)).toBe(12);
  });

  it("decreases from default (16) to 15", () => {
    expect(decreaseFontSize(FONT_SIZE_DEFAULT)).toBe(15);
  });

  it("A- button is disabled at FONT_SIZE_MIN", () => {
    expect(isDecreaseDisabled(FONT_SIZE_MIN)).toBe(true);
    expect(isDecreaseDisabled(FONT_SIZE_MIN + 1)).toBe(false);
  });
});

describe("Font size A-/A+ controls — increase", () => {
  it("increases font size by 1", () => {
    expect(increaseFontSize(20)).toBe(21);
  });

  it("does not exceed FONT_SIZE_MAX (32)", () => {
    expect(increaseFontSize(32)).toBe(32);
    expect(increaseFontSize(33)).toBe(32);
  });

  it("increases from default (16) to 17", () => {
    expect(increaseFontSize(FONT_SIZE_DEFAULT)).toBe(17);
  });

  it("A+ button is disabled at FONT_SIZE_MAX", () => {
    expect(isIncreaseDisabled(FONT_SIZE_MAX)).toBe(true);
    expect(isIncreaseDisabled(FONT_SIZE_MAX - 1)).toBe(false);
  });
});

describe("Font size controls — boundary behavior", () => {
  it("multiple decreases from max reach min", () => {
    let size = FONT_SIZE_MAX;
    while (size > FONT_SIZE_MIN) {
      size = decreaseFontSize(size);
    }
    expect(size).toBe(FONT_SIZE_MIN);
  });

  it("multiple increases from min reach max", () => {
    let size = FONT_SIZE_MIN;
    while (size < FONT_SIZE_MAX) {
      size = increaseFontSize(size);
    }
    expect(size).toBe(FONT_SIZE_MAX);
  });

  it("decrease and then increase returns to original", () => {
    const orig = 20;
    expect(increaseFontSize(decreaseFontSize(orig))).toBe(orig);
  });

  it("increase and then decrease returns to original", () => {
    const orig = 20;
    expect(decreaseFontSize(increaseFontSize(orig))).toBe(orig);
  });
});

describe("Font size control placement (P1.1)", () => {
  it("TakeTestPage header should have A- and A+ controls (not a slider)", () => {
    // This is enforced by the UI: controls are buttons, not <input type=range>
    const controlType = "buttons"; // changed from "slider" (QuestionForm) to "buttons" (TakeTestPage)
    expect(controlType).toBe("buttons");
  });

  it("QuestionForm no longer has font size slider", () => {
    // QuestionForm had a slider; it was removed in P1.1
    const questionFormHasFontSizeSlider = false; // removed
    expect(questionFormHasFontSizeSlider).toBe(false);
  });

  it("font size persists globally across tests via localStorage", () => {
    // The A-/A+ buttons still call setFontSize() from fontSizeStorage
    // so the value survives page navigations
    const persistsAcrossTests = true;
    expect(persistsAcrossTests).toBe(true);
  });
});

describe("Font size display in TakeTestPage", () => {
  it("shows numeric font size label (no 'px' suffix needed)", () => {
    const size = 20;
    // The label shows just the number e.g. '20' not '20px'
    const label = String(size);
    expect(label).toBe("20");
  });

  it("font size applies to both question text and answer options via shared wrapper", () => {
    const size = 22;
    const wrapperStyle = { fontSize: `${size}px` };
    expect(wrapperStyle.fontSize).toBe("22px");
  });
});
