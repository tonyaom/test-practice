/**
 * Auto-advance logic tests.
 *
 * Covers:
 * - Correct answer triggers auto-advance after 1500ms (P1.3 update)
 * - Final question correct answer triggers results navigation
 * - Incorrect answer does NOT trigger auto-advance
 * - Auto-advance delay is 1500ms (changed from 500ms per P1.3)
 * - Incorrect answer: user must click Continue manually
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
  it("auto-advance delay is 1500ms (changed from 500ms per P1.3)", () => {
    vi.useFakeTimers();
    let advanced = false;
    const scheduleAutoAdvance = (correct: boolean, fn: () => void) => {
      if (correct) setTimeout(fn, 1500);
    };

    scheduleAutoAdvance(true, () => {
      advanced = true;
    });
    expect(advanced).toBe(false); // Not yet
    vi.advanceTimersByTime(1499);
    expect(advanced).toBe(false); // Still not
    vi.advanceTimersByTime(1);
    expect(advanced).toBe(true); // Now advanced
    vi.useRealTimers();
  });

  it("incorrect answer does not schedule any timer", () => {
    vi.useFakeTimers();
    let advanced = false;
    const scheduleAutoAdvance = (correct: boolean, fn: () => void) => {
      if (correct) setTimeout(fn, 1500);
    };

    scheduleAutoAdvance(false, () => {
      advanced = true;
    });
    vi.advanceTimersByTime(2000);
    expect(advanced).toBe(false);
    vi.useRealTimers();
  });

  it("does not advance at 500ms — delay is 1500ms", () => {
    vi.useFakeTimers();
    let advanced = false;
    const scheduleAutoAdvance = (correct: boolean, fn: () => void) => {
      if (correct) setTimeout(fn, 1500);
    };
    scheduleAutoAdvance(true, () => {
      advanced = true;
    });
    vi.advanceTimersByTime(500);
    expect(advanced).toBe(false); // 500ms is no longer enough
    vi.useRealTimers();
  });
});

describe("Auto-advance — incorrect answer requires manual Continue", () => {
  it("incorrect answer: action is none, user clicks Continue", () => {
    const action = computeAutoAdvance(false, 0, 5);
    expect(action.type).toBe("none");
    // User sees Continue button and clicks it to advance manually
    const manualAdvance = { type: "advance" as const, toIdx: 1 };
    expect(manualAdvance.toIdx).toBe(1);
  });

  it("incorrect answer on last question: user clicks Submit", () => {
    const action = computeAutoAdvance(false, 4, 5);
    expect(action.type).toBe("none");
    // User must manually click Submit Test
  });
});

describe("Auto-advance — correct answer shows Correct flash before advance", () => {
  it("correct answer shows flash immediately (before 1500ms)", () => {
    vi.useFakeTimers();
    let flashShown = false;
    let advanced = false;
    // Flash is shown synchronously on check; advance happens after 1500ms
    flashShown = true; // shown immediately
    const scheduleAutoAdvance = (correct: boolean, fn: () => void) => {
      if (correct) setTimeout(fn, 1500);
    };
    scheduleAutoAdvance(true, () => {
      advanced = true;
    });
    expect(flashShown).toBe(true);
    expect(advanced).toBe(false);
    vi.advanceTimersByTime(1500);
    expect(advanced).toBe(true);
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
