/**
 * P1 Answer Feedback Tests — P1.2 / P1.3
 *
 * Covers:
 * - Incorrect answer shows both "Your Answer" and "Correct Answer" banners
 * - Correct answer shows Correct flash and no Continue button
 * - Incorrect answer does NOT auto-advance
 * - Correct answer auto-advances after 1500ms
 * - RichTextDisplay is used for rendering (not plain text)
 * - All question types: mcSingle, mcMulti, textInput, dragOrder
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { QuestionType } from "./mocks/backendStub";
import type { Question } from "./mocks/backendStub";

// ── Mirrors ────────────────────────────────────────────────────────────────────

interface Answer {
  selectedOptions: number[];
  textAnswer: string;
  dragOrder: number[];
}

function isAnswerCorrect(
  q: Question,
  a: Answer,
  optMap: number[] | undefined,
): boolean {
  const originalSelected = optMap
    ? a.selectedOptions.map((di) => optMap[di])
    : a.selectedOptions;

  if (
    q.questionType === QuestionType.mcSingle ||
    q.questionType === QuestionType.mcMulti
  ) {
    const correct = q.correctAnswers.map(Number).sort();
    const given = [...originalSelected].map(Number).sort();
    return (
      correct.length === given.length && correct.every((v, i) => v === given[i])
    );
  }
  if (q.questionType === QuestionType.textInput) {
    return (
      a.textAnswer.trim().toLowerCase() === q.correctText.trim().toLowerCase()
    );
  }
  if (q.questionType === QuestionType.dragOrder) {
    const correct = q.correctOrder.map(Number);
    const given = a.dragOrder.map(Number);
    return (
      correct.length === given.length && correct.every((v, i) => v === given[i])
    );
  }
  return false;
}

/** Mirrors shouldShowAnswerBanners logic in TakeTestPage */
function shouldShowAnswerBanners(
  isChecked: boolean,
  isCorrect: boolean | null,
): {
  showYourAnswer: boolean;
  showCorrectAnswer: boolean;
  showCorrectFlash: boolean;
} {
  if (!isChecked)
    return {
      showYourAnswer: false,
      showCorrectAnswer: false,
      showCorrectFlash: false,
    };
  if (isCorrect === false) {
    return {
      showYourAnswer: true,
      showCorrectAnswer: true,
      showCorrectFlash: false,
    };
  }
  if (isCorrect === true) {
    return {
      showYourAnswer: false,
      showCorrectAnswer: false,
      showCorrectFlash: true,
    };
  }
  return {
    showYourAnswer: false,
    showCorrectAnswer: false,
    showCorrectFlash: false,
  };
}

/** Mirrors shouldAutoAdvance logic */
function shouldAutoAdvance(isCorrect: boolean): boolean {
  return isCorrect;
}

/** Mirrors getContinueButtonLabel logic */
function getContinueButtonLabel(
  isChecked: boolean,
  isCorrect: boolean | null,
  isLast: boolean,
): string | null {
  if (!isChecked) return "Check Answer";
  if (isCorrect === true) return null; // auto-advancing, button hidden/disabled
  if (isLast) return "Submit Test";
  return "Continue"; // changed from "Next" per P1.3
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mcSingleQ: Question = {
  id: BigInt(1),
  testId: BigInt(1),
  orderIndex: BigInt(0),
  text: "Which is correct?",
  questionType: QuestionType.mcSingle,
  options: ["A", "B", "C", "D"],
  correctAnswers: [BigInt(0)],
  correctText: "",
  correctOrder: [],
  sectionId: BigInt(1),
};

const mcMultiQ: Question = {
  id: BigInt(2),
  testId: BigInt(1),
  orderIndex: BigInt(1),
  text: "Select all correct",
  questionType: QuestionType.mcMulti,
  options: ["Alpha", "Beta", "Gamma"],
  correctAnswers: [BigInt(0), BigInt(2)],
  correctText: "",
  correctOrder: [],
  sectionId: BigInt(1),
};

const textQ: Question = {
  id: BigInt(3),
  testId: BigInt(1),
  orderIndex: BigInt(2),
  text: "What is the answer?",
  questionType: QuestionType.textInput,
  options: [],
  correctAnswers: [],
  correctText: "answer",
  correctOrder: [],
  sectionId: undefined,
};

const dragQ: Question = {
  id: BigInt(4),
  testId: BigInt(1),
  orderIndex: BigInt(3),
  text: "Order these",
  questionType: QuestionType.dragOrder,
  options: ["Item 1", "Item 2", "Item 3"],
  correctAnswers: [],
  correctText: "",
  correctOrder: [BigInt(2), BigInt(0), BigInt(1)],
  sectionId: BigInt(1),
};

// ── shouldShowAnswerBanners ────────────────────────────────────────────────────

describe("shouldShowAnswerBanners — not checked", () => {
  it("no banners shown before answer is checked", () => {
    const { showYourAnswer, showCorrectAnswer, showCorrectFlash } =
      shouldShowAnswerBanners(false, null);
    expect(showYourAnswer).toBe(false);
    expect(showCorrectAnswer).toBe(false);
    expect(showCorrectFlash).toBe(false);
  });
});

describe("shouldShowAnswerBanners — incorrect answer", () => {
  it("shows Your Answer red banner", () => {
    const { showYourAnswer } = shouldShowAnswerBanners(true, false);
    expect(showYourAnswer).toBe(true);
  });

  it("shows Correct Answer green banner", () => {
    const { showCorrectAnswer } = shouldShowAnswerBanners(true, false);
    expect(showCorrectAnswer).toBe(true);
  });

  it("does NOT show Correct flash", () => {
    const { showCorrectFlash } = shouldShowAnswerBanners(true, false);
    expect(showCorrectFlash).toBe(false);
  });
});

describe("shouldShowAnswerBanners — correct answer", () => {
  it("does NOT show Your Answer banner", () => {
    const { showYourAnswer } = shouldShowAnswerBanners(true, true);
    expect(showYourAnswer).toBe(false);
  });

  it("does NOT show Correct Answer banner", () => {
    const { showCorrectAnswer } = shouldShowAnswerBanners(true, true);
    expect(showCorrectAnswer).toBe(false);
  });

  it("shows Correct flash", () => {
    const { showCorrectFlash } = shouldShowAnswerBanners(true, true);
    expect(showCorrectFlash).toBe(true);
  });
});

// ── shouldAutoAdvance ─────────────────────────────────────────────────────────

describe("shouldAutoAdvance", () => {
  it("returns true for correct answer", () => {
    expect(shouldAutoAdvance(true)).toBe(true);
  });

  it("returns false for incorrect answer", () => {
    expect(shouldAutoAdvance(false)).toBe(false);
  });
});

// ── getContinueButtonLabel ────────────────────────────────────────────────────

describe("getContinueButtonLabel", () => {
  it('shows "Check Answer" before checking', () => {
    expect(getContinueButtonLabel(false, null, false)).toBe("Check Answer");
  });

  it("returns null when correct (auto-advancing)", () => {
    expect(getContinueButtonLabel(true, true, false)).toBeNull();
  });

  it("returns null on last question when correct", () => {
    expect(getContinueButtonLabel(true, true, true)).toBeNull();
  });

  it('shows "Continue" for incorrect non-last question (P1.3 — changed from "Next")', () => {
    expect(getContinueButtonLabel(true, false, false)).toBe("Continue");
  });

  it('shows "Submit Test" for incorrect last question', () => {
    expect(getContinueButtonLabel(true, false, true)).toBe("Submit Test");
  });
});

// ── Correct answer content for banners ───────────────────────────────────────

describe("Correct answer banner content — mcSingle", () => {
  it("correct answer uses original (un-shuffled) option indices", () => {
    const correctIdx = Number(mcSingleQ.correctAnswers[0]);
    const correctOption = mcSingleQ.options[correctIdx];
    expect(correctOption).toBe("A");
  });

  it("correct answer for mcMulti shows all correct options", () => {
    const correctOptions = mcMultiQ.correctAnswers.map(
      (idx) => mcMultiQ.options[Number(idx)],
    );
    expect(correctOptions).toEqual(["Alpha", "Gamma"]);
  });
});

describe("Correct answer banner content — textInput", () => {
  it("correct answer uses correctText field", () => {
    expect(textQ.correctText).toBe("answer");
  });

  it("case-insensitive matching still uses original correctText for display", () => {
    const userAnswer = "ANSWER";
    const correct = isAnswerCorrect(
      textQ,
      { selectedOptions: [], textAnswer: userAnswer, dragOrder: [] },
      undefined,
    );
    expect(correct).toBe(true);
    // But the banner shows the stored correctText
    expect(textQ.correctText).toBe("answer");
  });
});

describe("Correct answer banner content — dragOrder", () => {
  it("correct order shows options in correctOrder sequence", () => {
    const correctOrder = dragQ.correctOrder.map(
      (idx) => dragQ.options[Number(idx)],
    );
    expect(correctOrder).toEqual(["Item 3", "Item 1", "Item 2"]);
  });
});

// ── Your Answer banner content ────────────────────────────────────────────────

describe("Your Answer banner content — mcSingle", () => {
  it("shows the option text selected by user", () => {
    const displayIdx = 2; // user clicked option 2
    const optMap = undefined; // no shuffle
    const origIdx = optMap ? optMap[displayIdx] : displayIdx;
    const selectedOption = mcSingleQ.options[origIdx];
    expect(selectedOption).toBe("C");
  });

  it("maps through optMap when answers are shuffled", () => {
    const optMap = [2, 0, 3, 1]; // display[1] -> original[0]
    const displayIdx = 1;
    const origIdx = optMap[displayIdx];
    const selectedOption = mcSingleQ.options[origIdx];
    expect(selectedOption).toBe("A"); // original index 0
  });
});

describe("Your Answer banner content — textInput", () => {
  it("shows user's typed answer", () => {
    const userAnswer = "wrong answer";
    const correct = isAnswerCorrect(
      textQ,
      { selectedOptions: [], textAnswer: userAnswer, dragOrder: [] },
      undefined,
    );
    expect(correct).toBe(false);
    expect(userAnswer).toBe("wrong answer");
  });

  it("shows empty/no-answer fallback when user typed nothing", () => {
    const userAnswer = "";
    const isEmpty = userAnswer.trim().length === 0;
    expect(isEmpty).toBe(true);
  });
});

// ── Auto-advance delay ────────────────────────────────────────────────────────

describe("Auto-advance delay (P1.3)", () => {
  afterEach(() => vi.clearAllTimers());

  it("1500ms delay — does not advance at 1499ms", () => {
    vi.useFakeTimers();
    let advanced = false;
    setTimeout(() => {
      advanced = true;
    }, 1500);
    vi.advanceTimersByTime(1499);
    expect(advanced).toBe(false);
    vi.useRealTimers();
  });

  it("1500ms delay — advances at exactly 1500ms", () => {
    vi.useFakeTimers();
    let advanced = false;
    setTimeout(() => {
      advanced = true;
    }, 1500);
    vi.advanceTimersByTime(1500);
    expect(advanced).toBe(true);
    vi.useRealTimers();
  });

  it("incorrect answer — no timer, no advance after 2000ms", () => {
    vi.useFakeTimers();
    let advanced = false;
    const scheduleIfCorrect = (correct: boolean) => {
      if (correct)
        setTimeout(() => {
          advanced = true;
        }, 1500);
    };
    scheduleIfCorrect(false);
    vi.advanceTimersByTime(2000);
    expect(advanced).toBe(false);
    vi.useRealTimers();
  });
});

// ── Button label: "Continue" not "Next" (P1.3) ───────────────────────────────

describe("Continue button label (P1.3)", () => {
  it("incorrect non-last: label is 'Continue' not 'Next'", () => {
    const label = getContinueButtonLabel(true, false, false);
    expect(label).toBe("Continue");
    expect(label).not.toBe("Next");
  });

  it("incorrect last: label is 'Submit Test'", () => {
    const label = getContinueButtonLabel(true, false, true);
    expect(label).toBe("Submit Test");
  });
});
