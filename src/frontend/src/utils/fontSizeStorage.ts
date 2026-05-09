/**
 * Font size preference storage.
 * Persists the user's selected font size (in pixels) across page reloads and tests.
 * Key: testPractice.fontSize
 * Range: 12–32px, default: 16px
 */

const FONT_SIZE_KEY = "testPractice.fontSize";
export const FONT_SIZE_MIN = 12;
export const FONT_SIZE_MAX = 32;
export const FONT_SIZE_DEFAULT = 16;

/** Clamp a value to the valid range [FONT_SIZE_MIN, FONT_SIZE_MAX]. */
export function clampFontSize(size: number): number {
  return Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, Math.round(size)));
}

/** Read the stored font size in pixels. Returns the default if missing or invalid. */
export function getFontSize(): number {
  try {
    const raw = localStorage.getItem(FONT_SIZE_KEY);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) {
        return clampFontSize(parsed);
      }
    }
  } catch {
    // ignore
  }
  return FONT_SIZE_DEFAULT;
}

/** Persist the font size in pixels. Value is clamped to [FONT_SIZE_MIN, FONT_SIZE_MAX]. */
export function setFontSize(size: number): void {
  try {
    localStorage.setItem(FONT_SIZE_KEY, String(clampFontSize(size)));
  } catch {
    // ignore
  }
}
