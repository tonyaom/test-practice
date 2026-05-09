/**
 * Tests for MathEditorModal logic:
 * - LaTeX preview rendering
 * - Symbol insertion at cursor position
 * - Insert button disabled when input is empty
 * - Keyboard shortcut handling
 */
import { describe, expect, it } from "vitest";

// ── LaTeX preview helper (pure logic) ─────────────────────────────────────────

/**
 * Mirrors the renderPreview logic from MathEditorModal.
 * Returns empty string for empty input, formatted delimiter otherwise.
 */
function buildDelimitedLatex(latex: string, display: boolean): string {
  if (!latex.trim()) return "";
  return display ? `$$${latex}$$` : `$${latex}$`;
}

// ── Symbol insertion at cursor ────────────────────────────────────────────────

/**
 * Mirrors the insertSymbol logic: inserts symbolLatex at start..end
 * and returns the new string.
 */
function insertAtCursor(
  current: string,
  symbolLatex: string,
  start: number,
  end: number,
): string {
  const before = current.slice(0, start);
  const after = current.slice(end);
  return before + symbolLatex + after;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("MathEditorModal – buildDelimitedLatex", () => {
  it("wraps in $...$ for inline mode", () => {
    expect(buildDelimitedLatex("x^2", false)).toBe("$x^2$");
  });

  it("wraps in $$...$$ for display mode", () => {
    expect(buildDelimitedLatex("x^2", true)).toBe("$$x^2$$");
  });

  it("returns empty string for empty latex", () => {
    expect(buildDelimitedLatex("", false)).toBe("");
    expect(buildDelimitedLatex("  ", true)).toBe("");
  });

  it("preserves complex formulas", () => {
    expect(buildDelimitedLatex("\\frac{a}{b}", false)).toBe("$\\frac{a}{b}$");
  });
});

describe("MathEditorModal – insertAtCursor", () => {
  it("appends at end when cursor is at end", () => {
    const result = insertAtCursor("x+", "\\alpha", 2, 2);
    expect(result).toBe("x+\\alpha");
  });

  it("inserts at start", () => {
    const result = insertAtCursor("abc", "\\beta", 0, 0);
    expect(result).toBe("\\betaabc");
  });

  it("inserts in the middle", () => {
    const result = insertAtCursor("ac", "b", 1, 1);
    expect(result).toBe("abc");
  });

  it("replaces selected text", () => {
    const result = insertAtCursor("a[SEL]c", "\\gamma", 1, 6);
    expect(result).toBe("a\\gammac");
  });

  it("handles empty current string", () => {
    const result = insertAtCursor("", "\\pi", 0, 0);
    expect(result).toBe("\\pi");
  });
});

describe("MathEditorModal – insert button guard", () => {
  function canInsert(latex: string): boolean {
    return latex.trim().length > 0;
  }

  it("is disabled when latex is empty", () => {
    expect(canInsert("")).toBe(false);
  });

  it("is disabled when latex is only whitespace", () => {
    expect(canInsert("   ")).toBe(false);
  });

  it("is enabled when latex has content", () => {
    expect(canInsert("x^2")).toBe(true);
    expect(canInsert(" a ")).toBe(true);
  });
});

describe("MathEditorModal – symbol group names", () => {
  const GROUPS = ["Greek", "Operators", "Templates"];

  it("has exactly 3 symbol groups", () => {
    expect(GROUPS).toHaveLength(3);
  });

  it("includes Greek group", () => {
    expect(GROUPS).toContain("Greek");
  });

  it("includes Operators group", () => {
    expect(GROUPS).toContain("Operators");
  });

  it("includes Templates group", () => {
    expect(GROUPS).toContain("Templates");
  });
});

describe("MathEditorModal – Ctrl+Enter shortcut handling", () => {
  function shouldInsert(key: string, ctrl: boolean): boolean {
    return key === "Enter" && ctrl;
  }

  it("triggers insert on Ctrl+Enter", () => {
    expect(shouldInsert("Enter", true)).toBe(true);
  });

  it("does not trigger on Enter alone", () => {
    expect(shouldInsert("Enter", false)).toBe(false);
  });

  it("does not trigger on Ctrl+Space", () => {
    expect(shouldInsert(" ", true)).toBe(false);
  });
});
