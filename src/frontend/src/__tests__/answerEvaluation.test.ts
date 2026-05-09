/**
 * Pure logic tests for answer evaluation (no React, no DOM).
 * Mirrors the evaluation rules used in backend/lib/results.mo.
 */
import { describe, expect, it } from "vitest";
import { QuestionType } from "./mocks/backendStub";
import type { Question } from "./mocks/backendStub";

// ── helpers (mirrors backend logic) ──────────────────────────────────────────

function evalMcSingle(q: Question, selectedOptions: bigint[]): boolean {
  if (selectedOptions.length !== 1) return false;
  return q.correctAnswers.some((c) => c === selectedOptions[0]);
}

function evalMcMultiple(q: Question, selectedOptions: bigint[]): boolean {
  if (selectedOptions.length !== q.correctAnswers.length) return false;
  const selected = new Set(selectedOptions.map(String));
  return q.correctAnswers.every((c) => selected.has(String(c)));
}

function evalTextInput(q: Question, textAnswer: string): boolean {
  return textAnswer.trim().toLowerCase() === q.correctText.trim().toLowerCase();
}

function evalDragOrder(q: Question, orderedItems: bigint[]): boolean {
  if (orderedItems.length !== q.correctOrder.length) return false;
  return q.correctOrder.every((v, i) => v === orderedItems[i]);
}

// ── fixtures ─────────────────────────────────────────────────────────────────

const mcSingleQ: Question = {
  id: BigInt(1),
  testId: BigInt(1),
  orderIndex: BigInt(0),
  text: "Which is correct?",
  questionType: QuestionType.mcSingle,
  options: ["A", "B", "C", "D"],
  correctAnswers: [BigInt(2)],
  correctText: "",
  correctOrder: [],
};

const mcMultiQ: Question = {
  id: BigInt(2),
  testId: BigInt(1),
  orderIndex: BigInt(1),
  text: "Select all that apply",
  questionType: QuestionType.mcMulti,
  options: ["Alpha", "Beta", "Gamma", "Delta"],
  correctAnswers: [BigInt(0), BigInt(2)],
  correctText: "",
  correctOrder: [],
};

const textQ: Question = {
  id: BigInt(3),
  testId: BigInt(1),
  orderIndex: BigInt(2),
  text: "What is it called?",
  questionType: QuestionType.textInput,
  options: [],
  correctAnswers: [],
  correctText: "Memory Consolidation",
  correctOrder: [],
};

const dragQ: Question = {
  id: BigInt(4),
  testId: BigInt(1),
  orderIndex: BigInt(3),
  text: "Arrange in order",
  questionType: QuestionType.dragOrder,
  options: ["Step C", "Step A", "Step B"],
  correctAnswers: [],
  correctText: "",
  correctOrder: [BigInt(1), BigInt(2), BigInt(0)],
};

// ── mcSingle ─────────────────────────────────────────────────────────────────

describe("Answer evaluation – mcSingle", () => {
  it("returns true when correct option is selected", () => {
    expect(evalMcSingle(mcSingleQ, [BigInt(2)])).toBe(true);
  });

  it("returns false when wrong option is selected", () => {
    expect(evalMcSingle(mcSingleQ, [BigInt(0)])).toBe(false);
    expect(evalMcSingle(mcSingleQ, [BigInt(1)])).toBe(false);
    expect(evalMcSingle(mcSingleQ, [BigInt(3)])).toBe(false);
  });

  it("returns false when no option is selected", () => {
    expect(evalMcSingle(mcSingleQ, [])).toBe(false);
  });

  it("returns false when multiple options are selected", () => {
    expect(evalMcSingle(mcSingleQ, [BigInt(0), BigInt(2)])).toBe(false);
  });
});

// ── mcMultiple ────────────────────────────────────────────────────────────────

describe("Answer evaluation – mcMultiple", () => {
  it("returns true when all correct options selected (unordered)", () => {
    expect(evalMcMultiple(mcMultiQ, [BigInt(0), BigInt(2)])).toBe(true);
    expect(evalMcMultiple(mcMultiQ, [BigInt(2), BigInt(0)])).toBe(true);
  });

  it("returns false when only one of two correct options selected", () => {
    expect(evalMcMultiple(mcMultiQ, [BigInt(0)])).toBe(false);
    expect(evalMcMultiple(mcMultiQ, [BigInt(2)])).toBe(false);
  });

  it("returns false when wrong options selected", () => {
    expect(evalMcMultiple(mcMultiQ, [BigInt(1), BigInt(3)])).toBe(false);
  });

  it("returns false when correct + extra options selected", () => {
    expect(evalMcMultiple(mcMultiQ, [BigInt(0), BigInt(1), BigInt(2)])).toBe(
      false,
    );
  });

  it("returns false when no options selected", () => {
    expect(evalMcMultiple(mcMultiQ, [])).toBe(false);
  });
});

// ── textInput ─────────────────────────────────────────────────────────────────

describe("Answer evaluation – textInput", () => {
  it("returns true for exact match (case-insensitive)", () => {
    expect(evalTextInput(textQ, "memory consolidation")).toBe(true);
    expect(evalTextInput(textQ, "Memory Consolidation")).toBe(true);
    expect(evalTextInput(textQ, "MEMORY CONSOLIDATION")).toBe(true);
  });

  it("returns true when answer has surrounding whitespace", () => {
    expect(evalTextInput(textQ, "  memory consolidation  ")).toBe(true);
  });

  it("returns false for wrong answer", () => {
    expect(evalTextInput(textQ, "memory")).toBe(false);
    expect(evalTextInput(textQ, "memorization")).toBe(false);
    expect(evalTextInput(textQ, "")).toBe(false);
  });
});

// ── dragOrder ─────────────────────────────────────────────────────────────────

describe("Answer evaluation – dragOrder", () => {
  it("returns true when order matches correctOrder exactly", () => {
    expect(evalDragOrder(dragQ, [BigInt(1), BigInt(2), BigInt(0)])).toBe(true);
  });

  it("returns false when order is wrong", () => {
    expect(evalDragOrder(dragQ, [BigInt(0), BigInt(1), BigInt(2)])).toBe(false);
    expect(evalDragOrder(dragQ, [BigInt(2), BigInt(0), BigInt(1)])).toBe(false);
  });

  it("returns false when length mismatches", () => {
    expect(evalDragOrder(dragQ, [BigInt(1), BigInt(2)])).toBe(false);
    expect(evalDragOrder(dragQ, [])).toBe(false);
  });
});

// ── getCorrectAnswerLabel (mirrors TestResultPage helper) ─────────────────────

describe("getCorrectAnswerLabel logic", () => {
  function getCorrectAnswerLabel(q: Question): string {
    if (q.questionType === QuestionType.textInput) {
      return q.correctText || "—";
    }
    if (
      q.questionType === QuestionType.mcSingle ||
      q.questionType === QuestionType.mcMulti
    ) {
      const labels = q.correctAnswers
        .map((idx) => q.options[Number(idx)])
        .filter(Boolean);
      return labels.join(", ") || "—";
    }
    if (q.questionType === QuestionType.dragOrder) {
      return q.correctOrder
        .map((idx) => q.options[Number(idx)])
        .filter(Boolean)
        .join(" → ");
    }
    return "—";
  }

  it("returns correct option label for mcSingle", () => {
    expect(getCorrectAnswerLabel(mcSingleQ)).toBe("C");
  });

  it("returns comma-joined labels for mcMulti", () => {
    expect(getCorrectAnswerLabel(mcMultiQ)).toBe("Alpha, Gamma");
  });

  it("returns correctText for textInput", () => {
    expect(getCorrectAnswerLabel(textQ)).toBe("Memory Consolidation");
  });

  it("returns arrow-joined items for dragOrder", () => {
    // correctOrder [1,2,0] → options[1]="Step A", options[2]="Step B", options[0]="Step C"
    expect(getCorrectAnswerLabel(dragQ)).toBe("Step A → Step B → Step C");
  });

  it("returns — when correctText is empty for textInput", () => {
    const emptyTextQ = { ...textQ, correctText: "" };
    expect(getCorrectAnswerLabel(emptyTextQ)).toBe("—");
  });
});

// ── gradeTest scoring helper ───────────────────────────────────────────────────

describe("gradeTest scoring", () => {
  function getGrade(percentage: number): { label: string; colorClass: string } {
    if (percentage >= 90)
      return { label: "Excellent!", colorClass: "text-accent" };
    if (percentage >= 75)
      return { label: "Good job!", colorClass: "text-primary" };
    if (percentage >= 60)
      return {
        label: "Keep practicing",
        colorClass: "text-secondary-foreground",
      };
    return { label: "Needs improvement", colorClass: "text-destructive" };
  }

  it("gives Excellent for >= 90%", () => {
    expect(getGrade(100).label).toBe("Excellent!");
    expect(getGrade(90).label).toBe("Excellent!");
  });

  it("gives Good job for 75–89%", () => {
    expect(getGrade(75).label).toBe("Good job!");
    expect(getGrade(89).label).toBe("Good job!");
  });

  it("gives Keep practicing for 60–74%", () => {
    expect(getGrade(60).label).toBe("Keep practicing");
    expect(getGrade(74).label).toBe("Keep practicing");
  });

  it("gives Needs improvement for < 60%", () => {
    expect(getGrade(59).label).toBe("Needs improvement");
    expect(getGrade(0).label).toBe("Needs improvement");
  });

  it("correctly calculates percentage from score/total", () => {
    const score = 3;
    const total = 4;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    expect(percentage).toBe(75);
  });
});
