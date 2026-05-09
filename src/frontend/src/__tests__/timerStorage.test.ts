import { beforeEach, describe, expect, it } from "vitest";
import {
  clearTimer,
  getElapsedSeconds,
  setElapsedSeconds,
} from "../utils/timerStorage";

const SESSION_A = "session-abc";
const SESSION_B = "session-xyz";

beforeEach(() => {
  localStorage.clear();
});

describe("timerStorage", () => {
  describe("getElapsedSeconds", () => {
    it("returns 0 when no timer has been stored", () => {
      expect(getElapsedSeconds(SESSION_A)).toBe(0);
    });

    it("returns the stored elapsed seconds", () => {
      setElapsedSeconds(SESSION_A, 42);
      expect(getElapsedSeconds(SESSION_A)).toBe(42);
    });

    it("returns 0 for a different session that was never set", () => {
      setElapsedSeconds(SESSION_A, 100);
      expect(getElapsedSeconds(SESSION_B)).toBe(0);
    });
  });

  describe("setElapsedSeconds", () => {
    it("stores the elapsed seconds", () => {
      setElapsedSeconds(SESSION_A, 120);
      expect(getElapsedSeconds(SESSION_A)).toBe(120);
    });

    it("overwrites a previously stored value", () => {
      setElapsedSeconds(SESSION_A, 50);
      setElapsedSeconds(SESSION_A, 75);
      expect(getElapsedSeconds(SESSION_A)).toBe(75);
    });

    it("clamps negative values to 0", () => {
      setElapsedSeconds(SESSION_A, -10);
      expect(getElapsedSeconds(SESSION_A)).toBe(0);
    });

    it("floors fractional seconds", () => {
      setElapsedSeconds(SESSION_A, 9.9);
      expect(getElapsedSeconds(SESSION_A)).toBe(9);
    });
  });

  describe("clearTimer", () => {
    it("removes the stored timer", () => {
      setElapsedSeconds(SESSION_A, 200);
      clearTimer(SESSION_A);
      expect(getElapsedSeconds(SESSION_A)).toBe(0);
    });

    it("does not affect timers for other sessions", () => {
      setElapsedSeconds(SESSION_A, 100);
      setElapsedSeconds(SESSION_B, 999);
      clearTimer(SESSION_A);
      expect(getElapsedSeconds(SESSION_B)).toBe(999);
    });

    it("is safe to call when no timer exists", () => {
      expect(() => clearTimer(SESSION_A)).not.toThrow();
    });
  });

  describe("multiple sessions in isolation", () => {
    it("tracks separate elapsed times for independent sessions", () => {
      setElapsedSeconds(SESSION_A, 30);
      setElapsedSeconds(SESSION_B, 60);
      expect(getElapsedSeconds(SESSION_A)).toBe(30);
      expect(getElapsedSeconds(SESSION_B)).toBe(60);
    });

    it("clearing one session does not affect the other", () => {
      setElapsedSeconds(SESSION_A, 30);
      setElapsedSeconds(SESSION_B, 60);
      clearTimer(SESSION_B);
      expect(getElapsedSeconds(SESSION_A)).toBe(30);
      expect(getElapsedSeconds(SESSION_B)).toBe(0);
    });
  });
});
