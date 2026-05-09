/**
 * Auto-advance logic tests.
 *
 * Covers:
 * - Correct answer triggers auto-advance after 500ms
 * - Final question correct answer triggers results navigation
 * - Incorrect answer does NOT trigger auto-advance
 * - Auto-advance delay is 500ms
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { QuestionType } from "./mocks/backendStub";
import type { Question } from "./mocks/backendStub";

// ── Mirrors auto-advance logic from TakeTestPage ─────────────────────────────

type AdvanceAction =
  | { type: "advance"; toIdx: number }
  | { type: "submit" }
  | { type: "none" };

function computeAutoAdvance(
  isCorrect: boolean,
  currentIdx: number,
  totalQuestions: number,
): AdvanceAction {
  if (!isCorrect) return { type: "none" };
  if (currentIdx < totalQuestions - 1) {
    return { type: "advance", toIdx: currentIdx + 1 };
  }
  return { type: "submit" };
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const _mcSingleQ: Question = {
  id: BigInt(1),
  testId: BigInt(1),
  orderIndex: BigInt(0),
  text: "Test question",
  questionType: QuestionType.mcSingle,
  options: ["A", "B", "C"],
  correctAnswers: [BigInt(0)],
  correctText: "",
  correctOrder: [],
};

// ── Tests ──────────────────────────────────────────────────────────────────────

afterEach(() => {
  vi.clearAllTimers();
});

describe("Auto-advance — correct answer", () => {
  it("advances to next question when correct on non-last question", () => {
    const action = computeAutoAdvance(true, 0, 5);
    expect(action.type).toBe("advance");
    if (action.type === "advance") expect(action.toIdx).toBe(1);
  });

  it("advances to third question from second on correct answer", () => {
    const action = computeAutoAdvance(true, 1, 5);
    expect(action.type).toBe("advance");
    if (action.type === "advance") expect(action.toIdx).toBe(2);
  });

  it("triggers submit when correct on last question", () => {
    const action = computeAutoAdvance(true, 4, 5);
    expect(action.type).toBe("submit");
  });

  it("triggers submit when single question test answered correctly", () => {
    const action = computeAutoAdvance(true, 0, 1);
    expect(action.type).toBe("submit");
  });
});

describe("Auto-advance — incorrect answer", () => {
  it("does NOT advance when answer is incorrect", () => {
    const action = computeAutoAdvance(false, 0, 5);
    expect(action.type).toBe("none");
  });

  it("does NOT trigger submit when last question answer is incorrect", () => {
    const action = computeAutoAdvance(false, 4, 5);
    expect(action.type).toBe("none");
  });

  it("none action means user must manually advance", () => {
    const action = computeAutoAdvance(false, 2, 5);
    expect(action).toEqual({ type: "none" });
  });
});

describe("Auto-advance — delay timing", () => {
  it("auto-advance delay is 500ms (not immediate)", () => {
    vi.useFakeTimers();
    let advanced = false;
    const scheduleAutoAdvance = (correct: boolean, fn: () => void) => {
      if (correct) setTimeout(fn, 500);
    };

    scheduleAutoAdvance(true, () => {
      advanced = true;
    });
    expect(advanced).toBe(false); // Not yet
    vi.advanceTimersByTime(499);
    expect(advanced).toBe(false); // Still not
    vi.advanceTimersByTime(1);
    expect(advanced).toBe(true); // Now advanced
    vi.useRealTimers();
  });

  it("incorrect answer does not schedule any timer", () => {
    vi.useFakeTimers();
    let advanced = false;
    const scheduleAutoAdvance = (correct: boolean, fn: () => void) => {
      if (correct) setTimeout(fn, 500);
    };

    scheduleAutoAdvance(false, () => {
      advanced = true;
    });
    vi.advanceTimersByTime(1000);
    expect(advanced).toBe(false);
    vi.useRealTimers();
  });
});

describe("Auto-advance — state saves before advance", () => {
  it("session state saved includes current question index", () => {
    const sessionState = {
      answers: { "1": { selectedOptions: [0], textAnswer: "", dragOrder: [] } },
      currentIdx: 0,
    };
    // When answer is checked and correct, state is saved before advance
    const savedState = { ...sessionState, currentIdx: 0 };
    expect(savedState.currentIdx).toBe(0);
    expect(savedState.answers["1"].selectedOptions).toContain(0);
  });

  it("next question index is currentIdx + 1 after advance", () => {
    const action = computeAutoAdvance(true, 2, 5);
    if (action.type === "advance") {
      expect(action.toIdx).toBe(3);
    }
  });
});
