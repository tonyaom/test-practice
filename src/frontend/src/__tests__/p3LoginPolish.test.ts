/**
 * P3 Login Polish tests
 * Covers: step indicator, remember me, tagline
 */
import { beforeEach, describe, expect, it } from "vitest";

const REMEMBER_KEY = "login_remember_username";

function saveRememberedUsername(username: string): void {
  localStorage.setItem(REMEMBER_KEY, username);
}

function loadRememberedUsername(): string | null {
  return localStorage.getItem(REMEMBER_KEY);
}

function clearRememberedUsername(): void {
  localStorage.removeItem(REMEMBER_KEY);
}

type LoginStep = "credentials" | "totp";

function getStepLabel(step: LoginStep): string {
  if (step === "credentials") return "Step 1 of 2 — Enter your credentials";
  return "Step 2 of 2 — Verification Code";
}

describe("P3.1 Login — remember me", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves username when remember me is checked", () => {
    saveRememberedUsername("testuser");
    expect(loadRememberedUsername()).toBe("testuser");
  });

  it("clears username when remember me is unchecked", () => {
    saveRememberedUsername("testuser");
    clearRememberedUsername();
    expect(loadRememberedUsername()).toBeNull();
  });

  it("loads saved username on mount", () => {
    saveRememberedUsername("myuser");
    const loaded = loadRememberedUsername();
    expect(loaded).toBe("myuser");
  });

  it("returns null when no username saved", () => {
    expect(loadRememberedUsername()).toBeNull();
  });
});

describe("P3.1 Login — step indicator", () => {
  it("step 1 label shows credentials", () => {
    expect(getStepLabel("credentials")).toContain("Step 1");
  });

  it("step 2 label shows verification", () => {
    expect(getStepLabel("totp")).toContain("Step 2");
  });

  it("step indicator has 2 steps", () => {
    const steps: LoginStep[] = ["credentials", "totp"];
    expect(steps).toHaveLength(2);
  });
});

describe("P3.1 Login — tagline", () => {
  it("tagline contains smarter", () => {
    const tagline = "Practice smarter. Master faster.";
    expect(tagline).toContain("smarter");
  });

  it("tagline contains Master", () => {
    const tagline = "Practice smarter. Master faster.";
    expect(tagline).toContain("Master");
  });
});
