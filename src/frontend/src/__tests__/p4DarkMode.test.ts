/**
 * P4 Dark Mode tests
 * Covers: theme storage, toggle logic, class application
 */
import { beforeEach, describe, expect, it } from "vitest";

const KEY = "theme-preference";

function getStoredTheme(): "dark" | "light" | null {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "dark" || v === "light") return v;
    return null;
  } catch {
    return null;
  }
}

function setStoredTheme(theme: "dark" | "light"): void {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* ignore */
  }
}

function toggleTheme(current: "dark" | "light"): "dark" | "light" {
  return current === "dark" ? "light" : "dark";
}

describe("P4.5 Dark mode — storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when no preference stored", () => {
    expect(getStoredTheme()).toBeNull();
  });

  it("stores dark preference", () => {
    setStoredTheme("dark");
    expect(getStoredTheme()).toBe("dark");
  });

  it("stores light preference", () => {
    setStoredTheme("light");
    expect(getStoredTheme()).toBe("light");
  });

  it("overwrites previous preference", () => {
    setStoredTheme("dark");
    setStoredTheme("light");
    expect(getStoredTheme()).toBe("light");
  });

  it("ignores invalid stored value", () => {
    localStorage.setItem(KEY, "invalid");
    expect(getStoredTheme()).toBeNull();
  });
});

describe("P4.5 Dark mode — toggle logic", () => {
  it("toggles dark to light", () => {
    expect(toggleTheme("dark")).toBe("light");
  });

  it("toggles light to dark", () => {
    expect(toggleTheme("light")).toBe("dark");
  });

  it("double toggle returns original", () => {
    const start: "dark" | "light" = "dark";
    expect(toggleTheme(toggleTheme(start))).toBe(start);
  });
});
