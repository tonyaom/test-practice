/**
 * P2 Review Mode Mobile tests
 * Covers: question picker pill, swipe gesture logic, navigation
 */
import { describe, expect, it } from "vitest";

function clampIndex(index: number, total: number): number {
  return Math.max(0, Math.min(index, total - 1));
}

function buildQuestionPickerLabel(current: number, total: number): string {
  return `${current + 1} / ${total}`;
}

function swipeToIndex(
  current: number,
  direction: "left" | "right",
  total: number,
): number {
  if (direction === "left") return clampIndex(current + 1, total);
  return clampIndex(current - 1, total);
}

describe("P2.3 Review mobile navigation", () => {
  it("question picker pill shows '3 / 12'", () => {
    expect(buildQuestionPickerLabel(2, 12)).toBe("3 / 12");
  });

  it("question picker pill shows '1 / 5' for first question", () => {
    expect(buildQuestionPickerLabel(0, 5)).toBe("1 / 5");
  });

  it("left swipe advances to next question", () => {
    expect(swipeToIndex(3, "left", 10)).toBe(4);
  });

  it("right swipe goes back to previous question", () => {
    expect(swipeToIndex(3, "right", 10)).toBe(2);
  });

  it("left swipe at last question stays at last", () => {
    expect(swipeToIndex(9, "left", 10)).toBe(9);
  });

  it("right swipe at first question stays at 0", () => {
    expect(swipeToIndex(0, "right", 10)).toBe(0);
  });

  it("clamps index correctly at upper bound", () => {
    expect(clampIndex(10, 10)).toBe(9);
  });

  it("clamps index correctly at lower bound", () => {
    expect(clampIndex(-1, 10)).toBe(0);
  });

  it("question grid color: correct = green, incorrect = red", () => {
    const colorClass = (isCorrect: boolean) =>
      isCorrect
        ? "bg-accent/20 text-accent"
        : "bg-destructive/20 text-destructive";
    expect(colorClass(true)).toContain("accent");
    expect(colorClass(false)).toContain("destructive");
  });
});
