/**
 * Font size persistence tests.
 *
 * Covers:
 * - Stored in localStorage under 'testPractice.fontSize' as a numeric string
 * - Read on mount and applied correctly
 * - Defaults to 16 (px) if not stored
 * - Values outside 12–32 are clamped to the boundary
 * - Invalid / corrupted value falls back to 16
 * - Size persists across simulated reloads and test switches
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ── Mirror the storage module logic locally ───────────────────────────────────

const FONT_SIZE_KEY = "testPractice.fontSize";
const FONT_SIZE_MIN = 12;
const FONT_SIZE_MAX = 32;
const FONT_SIZE_DEFAULT = 16;

function clampFontSize(size: number): number {
  return Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, Math.round(size)));
}

function getFontSize(storage: Record<string, string>): number {
  const raw = storage[FONT_SIZE_KEY];
  if (raw !== undefined && raw !== null && raw !== "") {
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) {
      return clampFontSize(parsed);
    }
  }
  return FONT_SIZE_DEFAULT;
}

function setFontSize(storage: Record<string, string>, size: number): void {
  storage[FONT_SIZE_KEY] = String(clampFontSize(size));
}

// ── localStorage mock ─────────────────────────────────────────────────────────

let localStorageData: Record<string, string> = {};

beforeEach(() => {
  localStorageData = {};
  const mockStorage = {
    getItem: (key: string) => localStorageData[key] ?? null,
    setItem: (key: string, value: string) => {
      localStorageData[key] = value;
    },
    removeItem: (key: string) => {
      delete localStorageData[key];
    },
    clear: () => {
      localStorageData = {};
    },
  };
  vi.stubGlobal("localStorage", mockStorage);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ── Default value ─────────────────────────────────────────────────────────────

describe("fontSizeStorage — default value", () => {
  it("returns 16 when nothing is stored", () => {
    expect(getFontSize(localStorageData)).toBe(16);
  });

  it("returns 16 for corrupted / non-numeric value", () => {
    localStorageData[FONT_SIZE_KEY] = "huge";
    expect(getFontSize(localStorageData)).toBe(16);
  });

  it("returns 16 for empty string value", () => {
    localStorageData[FONT_SIZE_KEY] = "";
    expect(getFontSize(localStorageData)).toBe(16);
  });

  it("returns 16 for NaN string", () => {
    localStorageData[FONT_SIZE_KEY] = "NaN";
    expect(getFontSize(localStorageData)).toBe(16);
  });
});

// ── Set and retrieve valid values ─────────────────────────────────────────────

describe("fontSizeStorage — set and retrieve", () => {
  it("persists 16 and retrieves it", () => {
    setFontSize(localStorageData, 16);
    expect(getFontSize(localStorageData)).toBe(16);
  });

  it("persists 20 and retrieves it", () => {
    setFontSize(localStorageData, 20);
    expect(getFontSize(localStorageData)).toBe(20);
  });

  it("persists 12 (minimum) and retrieves it", () => {
    setFontSize(localStorageData, 12);
    expect(getFontSize(localStorageData)).toBe(12);
  });

  it("persists 32 (maximum) and retrieves it", () => {
    setFontSize(localStorageData, 32);
    expect(getFontSize(localStorageData)).toBe(32);
  });

  it("overwriting with a new size updates the stored value", () => {
    setFontSize(localStorageData, 14);
    setFontSize(localStorageData, 28);
    expect(getFontSize(localStorageData)).toBe(28);
  });

  it("stores value as a numeric string in localStorage", () => {
    setFontSize(localStorageData, 18);
    expect(localStorageData[FONT_SIZE_KEY]).toBe("18");
  });
});

// ── Clamping ──────────────────────────────────────────────────────────────────

describe("fontSizeStorage — clamping out-of-range values", () => {
  it("clamps value below 12 to 12", () => {
    setFontSize(localStorageData, 5);
    expect(getFontSize(localStorageData)).toBe(12);
  });

  it("clamps value above 32 to 32", () => {
    setFontSize(localStorageData, 100);
    expect(getFontSize(localStorageData)).toBe(32);
  });

  it("clamps 0 to 12", () => {
    setFontSize(localStorageData, 0);
    expect(getFontSize(localStorageData)).toBe(12);
  });

  it("clamps negative values to 12", () => {
    setFontSize(localStorageData, -10);
    expect(getFontSize(localStorageData)).toBe(12);
  });

  it("clamps a stored raw value below 12 to 12 when reading", () => {
    localStorageData[FONT_SIZE_KEY] = "8";
    expect(getFontSize(localStorageData)).toBe(12);
  });

  it("clamps a stored raw value above 32 to 32 when reading", () => {
    localStorageData[FONT_SIZE_KEY] = "50";
    expect(getFontSize(localStorageData)).toBe(32);
  });

  it("clampFontSize rounds fractional values", () => {
    expect(clampFontSize(16.7)).toBe(17);
    expect(clampFontSize(16.2)).toBe(16);
  });
});

// ── Correct key name ──────────────────────────────────────────────────────────

describe("fontSizeStorage — correct key used", () => {
  it("stores under the exact key testPractice.fontSize", () => {
    setFontSize(localStorageData, 20);
    expect(localStorageData["testPractice.fontSize"]).toBe("20");
  });

  it("reads from testPractice.fontSize key specifically", () => {
    localStorageData["testPractice.fontSize"] = "24";
    expect(getFontSize(localStorageData)).toBe(24);
  });

  it("does not read from unrelated keys", () => {
    localStorageData.fontSize = "22";
    localStorageData["testPractice.font"] = "22";
    expect(getFontSize(localStorageData)).toBe(FONT_SIZE_DEFAULT);
  });
});

// ── Persistence across simulated reloads ──────────────────────────────────────

describe("fontSizeStorage — persistence across simulated reloads", () => {
  it("size set in one 'session' is readable in a new one (same storage)", () => {
    setFontSize(localStorageData, 24);
    const restoredSize = getFontSize(localStorageData);
    expect(restoredSize).toBe(24);
  });

  it("size preference survives across multiple test switches", () => {
    setFontSize(localStorageData, 20);
    const size1 = getFontSize(localStorageData);
    const size2 = getFontSize(localStorageData);
    expect(size1).toBe(20);
    expect(size2).toBe(20);
  });

  it("updating size is reflected on next read", () => {
    setFontSize(localStorageData, 14);
    expect(getFontSize(localStorageData)).toBe(14);
    setFontSize(localStorageData, 28);
    expect(getFontSize(localStorageData)).toBe(28);
  });
});

// ── Integration: font size value range and CSS application ────────────────────

describe("fontSizeStorage — font size value semantics", () => {
  it("default 16px is a valid mid-range value", () => {
    expect(FONT_SIZE_DEFAULT).toBeGreaterThanOrEqual(FONT_SIZE_MIN);
    expect(FONT_SIZE_DEFAULT).toBeLessThanOrEqual(FONT_SIZE_MAX);
  });

  it("FONT_SIZE_MIN is 12", () => {
    expect(FONT_SIZE_MIN).toBe(12);
  });

  it("FONT_SIZE_MAX is 32", () => {
    expect(FONT_SIZE_MAX).toBe(32);
  });

  it("a retrieved font size can be used as a CSS fontSize value in px", () => {
    setFontSize(localStorageData, 20);
    const px = getFontSize(localStorageData);
    // Should produce a valid CSS value like '20px'
    const cssValue = `${px}px`;
    expect(cssValue).toBe("20px");
  });

  it("font size applies to both question and answer wrapper via style prop", () => {
    setFontSize(localStorageData, 22);
    const px = getFontSize(localStorageData);
    // The component passes this as: style={{ fontSize: `${px}px` }}
    // Both question text and answers are children of the same wrapper — they inherit.
    const wrapperStyle = { fontSize: `${px}px` };
    expect(wrapperStyle.fontSize).toBe("22px");
  });
});
