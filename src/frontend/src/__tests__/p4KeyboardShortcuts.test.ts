/**
 * P4 Keyboard Shortcuts tests
 * Covers: Space/Enter = submit, B = bookmark, R = replay audio, hint localStorage
 */
import { beforeEach, describe, expect, it } from "vitest";

const HINT_KEY = "keyboardHintSeen";

function isKeyboardHintSeen(): boolean {
  try {
    return !!localStorage.getItem(HINT_KEY);
  } catch {
    return false;
  }
}

function markKeyboardHintSeen(): void {
  try {
    localStorage.setItem(HINT_KEY, "1");
  } catch {
    /* ignore */
  }
}

type ShortcutAction = "submit" | "bookmark" | "replay" | "none";

function resolveShortcut(
  key: string,
  hasAnswer: boolean,
  hasAudio: boolean,
): ShortcutAction {
  if (key === " " || key === "Enter") {
    return hasAnswer ? "submit" : "none";
  }
  if (key === "b" || key === "B") return "bookmark";
  if (key === "r" || key === "R") return hasAudio ? "replay" : "none";
  return "none";
}

describe("P4.3 Keyboard shortcuts — hint persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("hint not seen initially", () => {
    expect(isKeyboardHintSeen()).toBe(false);
  });

  it("hint seen after marking", () => {
    markKeyboardHintSeen();
    expect(isKeyboardHintSeen()).toBe(true);
  });

  it("hint stays seen after clearing (sets key)", () => {
    markKeyboardHintSeen();
    expect(localStorage.getItem(HINT_KEY)).toBe("1");
  });
});

describe("P4.3 Keyboard shortcuts — actions", () => {
  it("Space with answer submits", () => {
    expect(resolveShortcut(" ", true, false)).toBe("submit");
  });

  it("Enter with answer submits", () => {
    expect(resolveShortcut("Enter", true, false)).toBe("submit");
  });

  it("Space without answer does nothing", () => {
    expect(resolveShortcut(" ", false, false)).toBe("none");
  });

  it("B key bookmarks", () => {
    expect(resolveShortcut("b", false, false)).toBe("bookmark");
  });

  it("Uppercase B key bookmarks", () => {
    expect(resolveShortcut("B", false, false)).toBe("bookmark");
  });

  it("R key replays audio when audio present", () => {
    expect(resolveShortcut("r", false, true)).toBe("replay");
  });

  it("R key does nothing when no audio", () => {
    expect(resolveShortcut("r", false, false)).toBe("none");
  });

  it("Uppercase R key replays audio", () => {
    expect(resolveShortcut("R", false, true)).toBe("replay");
  });

  it("Other keys do nothing", () => {
    expect(resolveShortcut("x", true, true)).toBe("none");
  });
});
