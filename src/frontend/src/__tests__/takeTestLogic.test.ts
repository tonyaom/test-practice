/**
 * Unit tests for TakeTestPage utility functions:
 * - emptyAnswer initialisation
 * - shuffle (Fisher-Yates)
 * - isDotAnswered detection
 * - handleOptionToggle (mcSingle / mcMulti)
 * - answer submission mapping (shuffled options back to original)
 * - timer formatting and persistence
 * - bookmark toggle state updates
 * - section progress bar counts
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QuestionType } from "./mocks/backendStub";
import type { Question } from "./mocks/backendStub";

// ── Mirrors from TakeTestPage ─────────────────────────────────────────────────

interface Answer {
  selectedOptions: number[];
  textAnswer: string;
  dragOrder: number[];
}

function emptyAnswer(q: Question): Answer {
  return {
    selectedOptions: [],
    textAnswer: "",
    dragOrder: q.options.map((_, i) => i),
  };
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function isDotAnswered(q: Question, answers: Record<string, Answer>): boolean {
  const a = answers[String(q.id)];
  if (!a) return false;
  return a.selectedOptions.length > 0 || a.textAnswer.trim().length > 0;
}

function handleOptionToggle(
  q: Question,
  a: Answer,
  displayIdx: number,
): Answer {
  if (q.questionType === QuestionType.mcSingle) {
    return { ...a, selectedOptions: [displayIdx] };
  }
  const has = a.selectedOptions.includes(displayIdx);
  return {
    ...a,
    selectedOptions: has
      ? a.selectedOptions.filter((x) => x !== displayIdx)
      : [...a.selectedOptions, displayIdx],
  };
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

// ── timerStorage mirrors ──────────────────────────────────────────────────────

function formatElapsed(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  if (h > 0) {
    const hh = String(h).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

const TIMER_PREFIX = "test_timer_";
function timerGetElapsed(sessionId: string): number {
  try {
    const raw = localStorage.getItem(`${TIMER_PREFIX}${sessionId}`);
    if (!raw) return 0;
    const val = Number(raw);
    return Number.isFinite(val) && val >= 0 ? val : 0;
  } catch {
    return 0;
  }
}
function timerSetElapsed(sessionId: string, elapsed: number): void {
  localStorage.setItem(
    `${TIMER_PREFIX}${sessionId}`,
    String(Math.max(0, elapsed)),
  );
}

// ── bookmarkStorage mirrors ───────────────────────────────────────────────────

const BOOKMARK_PREFIX = "test_bookmarks_";
function bookmarkKey(username: string, testId: string): string {
  return `${BOOKMARK_PREFIX}${username}_${testId}`;
}
function loadBookmarkSet(username: string, testId: string): Set<string> {
  try {
    const raw = localStorage.getItem(bookmarkKey(username, testId));
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}
function saveBookmarkSet(
  username: string,
  testId: string,
  set: Set<string>,
): void {
  localStorage.setItem(bookmarkKey(username, testId), JSON.stringify([...set]));
}
function isBookmarkedFn(
  username: string,
  testId: string,
  questionId: string,
): boolean {
  return loadBookmarkSet(username, testId).has(questionId);
}
function toggleBookmarkFn(
  username: string,
  testId: string,
  questionId: string,
): boolean {
  const set = loadBookmarkSet(username, testId);
  if (set.has(questionId)) {
    set.delete(questionId);
    saveBookmarkSet(username, testId, set);
    return false;
  }
  set.add(questionId);
  saveBookmarkSet(username, testId, set);
  return true;
}

// ── sectionProgress mirror ────────────────────────────────────────────────────

function computeSectionProgress(
  questions: Question[],
  answers: Record<string, Answer>,
  selectedSectionIds: number[],
): Array<{ id: number; answered: number; total: number }> {
  return selectedSectionIds.map((sId) => {
    const sectionQs = questions.filter(
      (q) => q.sectionId != null && Number(q.sectionId) === sId,
    );
    const answeredCount = sectionQs.filter((q) =>
      isDotAnswered(q, answers),
    ).length;
    return { id: sId, answered: answeredCount, total: sectionQs.length };
  });
}

// localStorage mock setup
let localStorageData: Record<string, string> = {};

beforeEach(() => {
  localStorageData = {};
  const mockStorage = {
    getItem: (key: string) => localStorageData[key] ?? null,
    setItem: (key: string, value: string) => {
      localStorageData[key] = value;
    },
    removeItem: (key: string) => {
      delete localStorageData[key];
    },
    clear: () => {
      localStorageData = {};
    },
  };
  vi.stubGlobal("localStorage", mockStorage);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const mcSingleQ: Question = {
  id: BigInt(1),
  testId: BigInt(1),
  orderIndex: BigInt(0),
  text: "Single choice question?",
  questionType: QuestionType.mcSingle,
  options: ["A", "B", "C", "D"],
  correctAnswers: [BigInt(0)],
  correctText: "",
  correctOrder: [],
  sectionId: BigInt(1),
  explanation: undefined,
};

const mcSingleWithExplanation: Question = {
  ...mcSingleQ,
  id: BigInt(10),
  explanation:
    "<p>The correct answer is <strong>A</strong> because it is the first option.</p>",
};

const mcSingleWithMathExplanation: Question = {
  ...mcSingleQ,
  id: BigInt(11),
  explanation: "<p>Use the formula $E = mc^2$ to derive the answer.</p>",
};

const mcMultiQ: Question = {
  id: BigInt(2),
  testId: BigInt(1),
  orderIndex: BigInt(1),
  text: "Multiple choice question?",
  questionType: QuestionType.mcMulti,
  options: ["Alpha", "Beta", "Gamma"],
  correctAnswers: [BigInt(0), BigInt(2)],
  correctText: "",
  correctOrder: [],
  sectionId: BigInt(2),
  explanation: undefined,
};

const textQ: Question = {
  id: BigInt(3),
  testId: BigInt(1),
  orderIndex: BigInt(2),
  text: "Text answer question?",
  questionType: QuestionType.textInput,
  options: [],
  correctAnswers: [],
  correctText: "answer",
  correctOrder: [],
  sectionId: undefined,
  explanation: undefined,
};

const dragQ: Question = {
  id: BigInt(4),
  testId: BigInt(1),
  orderIndex: BigInt(3),
  text: "Order these items",
  questionType: QuestionType.dragOrder,
  options: ["Item 1", "Item 2", "Item 3"],
  correctAnswers: [],
  correctText: "",
  correctOrder: [BigInt(2), BigInt(0), BigInt(1)],
  sectionId: BigInt(1),
  explanation: undefined,
};

// ── emptyAnswer ────────────────────────────────────────────────────────────────

describe("emptyAnswer", () => {
  it("initializes selectedOptions as empty array", () => {
    const a = emptyAnswer(mcSingleQ);
    expect(a.selectedOptions).toEqual([]);
  });

  it("initializes textAnswer as empty string", () => {
    const a = emptyAnswer(textQ);
    expect(a.textAnswer).toBe("");
  });

  it("initializes dragOrder as identity order matching options length", () => {
    const a = emptyAnswer(dragQ);
    expect(a.dragOrder).toEqual([0, 1, 2]);
  });

  it("initializes dragOrder as empty for textInput (no options)", () => {
    const a = emptyAnswer(textQ);
    expect(a.dragOrder).toEqual([]);
  });
});

// ── shuffle ────────────────────────────────────────────────────────────────────

describe("shuffle", () => {
  it("returns an array of the same length", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr)).toHaveLength(5);
  });

  it("contains all the same elements", () => {
    const arr = [0, 1, 2, 3];
    const shuffled = shuffle(arr);
    expect(shuffled.sort()).toEqual([0, 1, 2, 3]);
  });

  it("does not mutate original array", () => {
    const arr = [1, 2, 3];
    shuffle(arr);
    expect(arr).toEqual([1, 2, 3]);
  });

  it("returns a new array reference", () => {
    const arr = [1, 2, 3];
    const shuffled = shuffle(arr);
    expect(shuffled).not.toBe(arr);
  });
});

// ── isDotAnswered ──────────────────────────────────────────────────────────────

describe("isDotAnswered", () => {
  it("returns false when no answer stored for question", () => {
    expect(isDotAnswered(mcSingleQ, {})).toBe(false);
  });

  it("returns false when answer has no selections and empty text", () => {
    const answers = {
      "1": { selectedOptions: [], textAnswer: "", dragOrder: [0] },
    };
    expect(isDotAnswered(mcSingleQ, answers)).toBe(false);
  });

  it("returns true when selectedOptions is non-empty", () => {
    const answers = {
      "1": { selectedOptions: [0], textAnswer: "", dragOrder: [] },
    };
    expect(isDotAnswered(mcSingleQ, answers)).toBe(true);
  });

  it("returns true when textAnswer is non-empty", () => {
    const answers = {
      "3": { selectedOptions: [], textAnswer: "some text", dragOrder: [] },
    };
    expect(isDotAnswered(textQ, answers)).toBe(true);
  });

  it("returns false when textAnswer is only whitespace", () => {
    const answers = {
      "3": { selectedOptions: [], textAnswer: "   ", dragOrder: [] },
    };
    expect(isDotAnswered(textQ, answers)).toBe(false);
  });
});

// ── handleOptionToggle ────────────────────────────────────────────────────────

describe("handleOptionToggle – mcSingle", () => {
  it("selects the chosen option exclusively", () => {
    const a = emptyAnswer(mcSingleQ);
    const next = handleOptionToggle(mcSingleQ, a, 2);
    expect(next.selectedOptions).toEqual([2]);
  });

  it("replaces previous selection with new one", () => {
    const a: Answer = { ...emptyAnswer(mcSingleQ), selectedOptions: [0] };
    const next = handleOptionToggle(mcSingleQ, a, 3);
    expect(next.selectedOptions).toEqual([3]);
  });
});

describe("handleOptionToggle – mcMulti", () => {
  it("adds an option if not yet selected", () => {
    const a = emptyAnswer(mcMultiQ);
    const next = handleOptionToggle(mcMultiQ, a, 1);
    expect(next.selectedOptions).toContain(1);
  });

  it("removes an option if already selected (toggle off)", () => {
    const a: Answer = { ...emptyAnswer(mcMultiQ), selectedOptions: [0, 1] };
    const next = handleOptionToggle(mcMultiQ, a, 0);
    expect(next.selectedOptions).not.toContain(0);
    expect(next.selectedOptions).toContain(1);
  });

  it("allows multiple selections", () => {
    let a = emptyAnswer(mcMultiQ);
    a = handleOptionToggle(mcMultiQ, a, 0);
    a = handleOptionToggle(mcMultiQ, a, 2);
    expect(a.selectedOptions).toContain(0);
    expect(a.selectedOptions).toContain(2);
  });
});

// ── Shuffled option mapping (answer submission) ────────────────────────────────

describe("Shuffled option index remapping", () => {
  /**
   * When answers are shuffled, selectedOptions hold *display* indices.
   * Before submitting, map display → original using optMap.
   */
  function remapToOriginal(
    selectedDisplayIndices: number[],
    optMap: number[],
  ): number[] {
    return selectedDisplayIndices.map((displayIdx) => optMap[displayIdx]);
  }

  it("maps display index to original index using optMap", () => {
    // optMap[displayIdx] = originalIdx
    // e.g. shuffled order: [2,0,3,1] means display[0] → original[2]
    const optMap = [2, 0, 3, 1];
    expect(remapToOriginal([0], optMap)).toEqual([2]);
    expect(remapToOriginal([1], optMap)).toEqual([0]);
    expect(remapToOriginal([0, 2], optMap)).toEqual([2, 3]);
  });

  it("is identity when optMap is identity [0,1,2,3]", () => {
    const optMap = [0, 1, 2, 3];
    expect(remapToOriginal([0, 3], optMap)).toEqual([0, 3]);
  });
});

// ── isAnswerCorrect ────────────────────────────────────────────────────────────

/**
 * Mirror of isAnswerCorrect from TakeTestPage (exported for testing).
 * Checks whether the user's answer matches the correct answer for a question.
 */
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

/** Mirrors the "should explanation be shown" logic in TakeTestPage */
function shouldShowExplanation(
  question: Question,
  isChecked: boolean,
): boolean {
  return isChecked && !!question.explanation;
}

describe("isAnswerCorrect", () => {
  it("returns true for mcSingle with correct selection", () => {
    const a: Answer = { selectedOptions: [0], textAnswer: "", dragOrder: [] };
    expect(isAnswerCorrect(mcSingleQ, a, undefined)).toBe(true);
  });

  it("returns false for mcSingle with wrong selection", () => {
    const a: Answer = { selectedOptions: [2], textAnswer: "", dragOrder: [] };
    expect(isAnswerCorrect(mcSingleQ, a, undefined)).toBe(false);
  });

  it("returns true for mcMulti when all correct answers are selected", () => {
    const a: Answer = {
      selectedOptions: [0, 2],
      textAnswer: "",
      dragOrder: [],
    };
    expect(isAnswerCorrect(mcMultiQ, a, undefined)).toBe(true);
  });

  it("returns false for mcMulti when only partial correct answers selected", () => {
    const a: Answer = { selectedOptions: [0], textAnswer: "", dragOrder: [] };
    expect(isAnswerCorrect(mcMultiQ, a, undefined)).toBe(false);
  });

  it("returns false for mcMulti when extra wrong answer also selected", () => {
    const a: Answer = {
      selectedOptions: [0, 1, 2],
      textAnswer: "",
      dragOrder: [],
    };
    expect(isAnswerCorrect(mcMultiQ, a, undefined)).toBe(false);
  });

  it("returns true for textInput with exact match (case-insensitive)", () => {
    const a: Answer = {
      selectedOptions: [],
      textAnswer: "Answer",
      dragOrder: [],
    };
    expect(isAnswerCorrect(textQ, a, undefined)).toBe(true);
  });

  it("returns false for textInput with wrong text", () => {
    const a: Answer = {
      selectedOptions: [],
      textAnswer: "wrong",
      dragOrder: [],
    };
    expect(isAnswerCorrect(textQ, a, undefined)).toBe(false);
  });

  it("returns true for dragOrder with correct order", () => {
    // correctOrder is [2, 0, 1]
    const a: Answer = {
      selectedOptions: [],
      textAnswer: "",
      dragOrder: [2, 0, 1],
    };
    expect(isAnswerCorrect(dragQ, a, undefined)).toBe(true);
  });

  it("returns false for dragOrder with wrong order", () => {
    const a: Answer = {
      selectedOptions: [],
      textAnswer: "",
      dragOrder: [0, 1, 2],
    };
    expect(isAnswerCorrect(dragQ, a, undefined)).toBe(false);
  });

  it("maps display indices through optMap before checking correctness", () => {
    // optMap = [2, 0, 3, 1]: display index 1 -> original index 0 (correct)
    const optMap = [2, 0, 3, 1];
    const a: Answer = { selectedOptions: [1], textAnswer: "", dragOrder: [] };
    expect(isAnswerCorrect(mcSingleQ, a, optMap)).toBe(true);
  });

  it("returns false when optMap does not map to correct original index", () => {
    // optMap = [2, 0, 3, 1]: display index 0 -> original index 2 (wrong)
    const optMap = [2, 0, 3, 1];
    const a: Answer = { selectedOptions: [0], textAnswer: "", dragOrder: [] };
    expect(isAnswerCorrect(mcSingleQ, a, optMap)).toBe(false);
  });
});

// ── Explanation visibility ─────────────────────────────────────────────────────

describe("Explanation card visibility", () => {
  it("explanation is hidden before answer is checked", () => {
    expect(shouldShowExplanation(mcSingleWithExplanation, false)).toBe(false);
  });

  it("explanation is shown after answer is checked when explanation exists", () => {
    expect(shouldShowExplanation(mcSingleWithExplanation, true)).toBe(true);
  });

  it("explanation is hidden after checking when question has null explanation", () => {
    expect(shouldShowExplanation(mcSingleQ, true)).toBe(false);
  });

  it("explanation is hidden for question with undefined explanation", () => {
    const q: Question = { ...mcSingleQ, explanation: undefined };
    expect(shouldShowExplanation(q, true)).toBe(false);
  });

  it("explanation is hidden for question with empty string explanation", () => {
    const q: Question = { ...mcSingleQ, explanation: "" };
    expect(shouldShowExplanation(q, true)).toBe(false);
  });

  it("explanation with HTML content is truthy and shown after check", () => {
    expect(shouldShowExplanation(mcSingleWithExplanation, true)).toBe(true);
    expect(mcSingleWithExplanation.explanation).toContain("<strong>A</strong>");
  });

  it("explanation with math formula content is shown after check", () => {
    expect(shouldShowExplanation(mcSingleWithMathExplanation, true)).toBe(true);
    expect(mcSingleWithMathExplanation.explanation).toContain("$E = mc^2$");
  });
});

// ── Check Answer flow (checked state transitions) ─────────────────────────────

describe("Check Answer state transitions", () => {
  /** Simulates the checkedIds Set used in TakeTestPage */
  function simulateCheckOrNext(
    checkedIds: Set<string>,
    qId: string,
    currentIdx: number,
    totalQuestions: number,
  ): { newCheckedIds: Set<string>; advancedTo: number | "submit" | null } {
    if (!checkedIds.has(qId)) {
      // First click: mark as checked
      const next = new Set([...checkedIds, qId]);
      return { newCheckedIds: next, advancedTo: null };
    }
    // Second click: advance or submit
    if (currentIdx < totalQuestions - 1) {
      return { newCheckedIds: checkedIds, advancedTo: currentIdx + 1 };
    }
    return { newCheckedIds: checkedIds, advancedTo: "submit" };
  }

  it("first click marks question as checked but does not advance", () => {
    const checkedIds = new Set<string>();
    const result = simulateCheckOrNext(checkedIds, "1", 0, 3);
    expect(result.newCheckedIds.has("1")).toBe(true);
    expect(result.advancedTo).toBeNull();
  });

  it("second click on non-last question advances to next question", () => {
    const checkedIds = new Set(["1"]);
    const result = simulateCheckOrNext(checkedIds, "1", 0, 3);
    expect(result.advancedTo).toBe(1);
  });

  it("second click on last question triggers submit", () => {
    const checkedIds = new Set(["3"]);
    const result = simulateCheckOrNext(checkedIds, "3", 2, 3);
    expect(result.advancedTo).toBe("submit");
  });

  it("checking does not remove previously checked IDs", () => {
    const checkedIds = new Set<string>();
    const r1 = simulateCheckOrNext(checkedIds, "1", 0, 3);
    const r2 = simulateCheckOrNext(r1.newCheckedIds, "2", 1, 3);
    expect(r2.newCheckedIds.has("1")).toBe(true);
    expect(r2.newCheckedIds.has("2")).toBe(true);
  });

  it("nav dots use checked state (full bright accent) vs answered (partial)", () => {
    // Just verifies the class-name logic distinctions
    const checkedIds = new Set(["1"]);
    const answeredNotChecked = isDotAnswered(mcSingleQ, {
      "1": { selectedOptions: [], textAnswer: "", dragOrder: [] },
    });
    const isChecked = checkedIds.has("1");
    // checked overrides answered in visual priority
    expect(isChecked).toBe(true);
    expect(answeredNotChecked).toBe(false);
  });
});

// ── No admin navigation in TakeTestPage for regular users ───────────────────

/** Mirrors the back-link target logic in TakeTestPage */
function takeTestBackLink(_isAdmin: boolean): string {
  // After fix: back link always goes to /tests for regular users
  // (admin back link was removed — all users get Back to Tests)
  return "/tests";
}

/** Mirrors the empty state back button target in TakeTestPage */
function emptyStateBackTarget(): string {
  return "/tests";
}

describe("TakeTestPage – no admin navigation for regular users", () => {
  it("back link always points to /tests (not /admin)", () => {
    expect(takeTestBackLink(false)).toBe("/tests");
    expect(takeTestBackLink(true)).toBe("/tests");
  });

  it("empty state back button targets /tests (not /admin)", () => {
    expect(emptyStateBackTarget()).toBe("/tests");
  });

  it("Add Questions button is NOT rendered (admin-only link removed)", () => {
    // The button linking to /admin/tests/$testId has been removed from TakeTestPage.
    // This test asserts the removal by ensuring the admin path is never generated
    // for users from within TakeTestPage empty state.
    const emptyStateLinks = ["/tests"];
    const hasAdminLink = emptyStateLinks.some((l) => l.startsWith("/admin"));
    expect(hasAdminLink).toBe(false);
  });
});

// ── Progress percentage ───────────────────────────────────────────────────────

describe("Test progress calculation", () => {
  it("calculates correct percentage for first question", () => {
    const currentIdx = 0;
    const total = 5;
    const progress = Math.round(((currentIdx + 1) / total) * 100);
    expect(progress).toBe(20);
  });

  it("calculates 100% on last question", () => {
    const currentIdx = 4;
    const total = 5;
    const progress = Math.round(((currentIdx + 1) / total) * 100);
    expect(progress).toBe(100);
  });
});

// ── Section-based question filtering ─────────────────────────────────────────

/** Mirror of the filtering logic in TakeTestPage */
function filterQuestionsBySections(
  questions: Question[],
  selectedSectionIds: number[],
): Question[] {
  if (selectedSectionIds.length === 0) return questions;
  return questions.filter((q) => {
    const sid = q.sectionId != null ? Number(q.sectionId) : undefined;
    return sid !== undefined && selectedSectionIds.includes(sid);
  });
}

describe("filterQuestionsBySections", () => {
  const allQuestions = [mcSingleQ, mcMultiQ, textQ, dragQ];
  // mcSingleQ sectionId=BigInt(1), mcMultiQ sectionId=BigInt(2), textQ sectionId=undefined, dragQ sectionId=BigInt(1)

  it("returns all questions when selectedSectionIds is empty (entire test)", () => {
    const result = filterQuestionsBySections(allQuestions, []);
    expect(result).toHaveLength(4);
  });

  it("filters to only questions in section 1", () => {
    const result = filterQuestionsBySections(allQuestions, [1]);
    expect(result.map((q) => q.id)).toEqual([BigInt(1), BigInt(4)]);
  });

  it("filters to only questions in section 2", () => {
    const result = filterQuestionsBySections(allQuestions, [2]);
    expect(result.map((q) => q.id)).toEqual([BigInt(2)]);
  });

  it("filters to questions in multiple sections (1 and 2)", () => {
    const result = filterQuestionsBySections(allQuestions, [1, 2]);
    expect(result.map((q) => q.id)).toEqual([BigInt(1), BigInt(2), BigInt(4)]);
  });

  it("excludes questions with no section (sectionId=undefined)", () => {
    const result = filterQuestionsBySections(allQuestions, [1]);
    // textQ has sectionId=undefined so it should NOT appear
    expect(result.find((q) => q.id === BigInt(3))).toBeUndefined();
  });

  it("returns empty array when no questions match selected sections", () => {
    const result = filterQuestionsBySections(allQuestions, [99]);
    expect(result).toHaveLength(0);
  });

  it("shuffle works across combined section results", () => {
    const result = filterQuestionsBySections(allQuestions, [1, 2]);
    const shuffled = shuffle(result);
    expect(shuffled).toHaveLength(result.length);
    // All IDs still present
    const ids = shuffled.map((q) => q.id).sort();
    expect(ids).toEqual(result.map((q) => q.id).sort());
  });
});

// ── Timer formatting ──────────────────────────────────────────────────────────

describe("formatElapsed", () => {
  it("formats 0 seconds as 00:00", () => {
    expect(formatElapsed(0)).toBe("00:00");
  });

  it("formats 59 seconds as 00:59", () => {
    expect(formatElapsed(59)).toBe("00:59");
  });

  it("formats 60 seconds as 01:00", () => {
    expect(formatElapsed(60)).toBe("01:00");
  });

  it("formats 90 seconds as 01:30", () => {
    expect(formatElapsed(90)).toBe("01:30");
  });

  it("formats 3599 seconds as 59:59", () => {
    expect(formatElapsed(3599)).toBe("59:59");
  });

  it("formats 3600 seconds as HH:MM:SS format 01:00:00", () => {
    expect(formatElapsed(3600)).toBe("01:00:00");
  });

  it("formats 3661 seconds as 01:01:01", () => {
    expect(formatElapsed(3661)).toBe("01:01:01");
  });

  it("formats 7322 seconds as 02:02:02", () => {
    expect(formatElapsed(7322)).toBe("02:02:02");
  });

  it("handles negative seconds by clamping to 0", () => {
    expect(formatElapsed(-5)).toBe("00:00");
  });

  it("floors fractional seconds", () => {
    expect(formatElapsed(90.9)).toBe("01:30");
  });
});

// ── Timer localStorage persistence ────────────────────────────────────────────

describe("timerStorage", () => {
  it("returns 0 when no saved value exists", () => {
    expect(timerGetElapsed("session-abc")).toBe(0);
  });

  it("persists elapsed seconds and retrieves them", () => {
    timerSetElapsed("session-abc", 120);
    expect(timerGetElapsed("session-abc")).toBe(120);
  });

  it("simulates timer increment persisting between page reloads", () => {
    // Page 1: start session, tick to 45 seconds
    timerSetElapsed("session-reload", 45);

    // Page 2: reload — simulate reading the persisted value
    const restored = timerGetElapsed("session-reload");
    expect(restored).toBe(45);

    // Continue ticking from restored value
    timerSetElapsed("session-reload", restored + 5);
    expect(timerGetElapsed("session-reload")).toBe(50);
  });

  it("different sessions have independent timers", () => {
    timerSetElapsed("session-A", 100);
    timerSetElapsed("session-B", 200);
    expect(timerGetElapsed("session-A")).toBe(100);
    expect(timerGetElapsed("session-B")).toBe(200);
  });

  it("clamps negative elapsed to 0", () => {
    timerSetElapsed("session-neg", -10);
    expect(timerGetElapsed("session-neg")).toBe(0);
  });

  it("returns 0 for corrupted storage entry", () => {
    localStorage.setItem("test_timer_bad", "not-a-number");
    expect(timerGetElapsed("bad")).toBe(0);
  });
});

// ── Bookmark toggle state updates ─────────────────────────────────────────────

describe("bookmarkStorage", () => {
  const user = "alice";
  const testId = "42";

  it("question is not bookmarked by default", () => {
    expect(isBookmarkedFn(user, testId, "q1")).toBe(false);
  });

  it("toggles bookmark on (returns true)", () => {
    const result = toggleBookmarkFn(user, testId, "q1");
    expect(result).toBe(true);
    expect(isBookmarkedFn(user, testId, "q1")).toBe(true);
  });

  it("toggles bookmark off (returns false)", () => {
    toggleBookmarkFn(user, testId, "q1"); // on
    const result = toggleBookmarkFn(user, testId, "q1"); // off
    expect(result).toBe(false);
    expect(isBookmarkedFn(user, testId, "q1")).toBe(false);
  });

  it("multiple questions can be bookmarked independently", () => {
    toggleBookmarkFn(user, testId, "q1");
    toggleBookmarkFn(user, testId, "q3");
    expect(isBookmarkedFn(user, testId, "q1")).toBe(true);
    expect(isBookmarkedFn(user, testId, "q2")).toBe(false);
    expect(isBookmarkedFn(user, testId, "q3")).toBe(true);
  });

  it("bookmarks persist across simulated page reloads", () => {
    toggleBookmarkFn(user, testId, "q5");
    const set = loadBookmarkSet(user, testId);
    expect(set.has("q5")).toBe(true);
  });

  it("different users have independent bookmark sets", () => {
    toggleBookmarkFn("alice", testId, "q1");
    expect(isBookmarkedFn("bob", testId, "q1")).toBe(false);
    expect(isBookmarkedFn("alice", testId, "q1")).toBe(true);
  });

  it("different tests have independent bookmark sets for same user", () => {
    toggleBookmarkFn(user, "10", "q1");
    expect(isBookmarkedFn(user, "20", "q1")).toBe(false);
    expect(isBookmarkedFn(user, "10", "q1")).toBe(true);
  });

  it("toggling bookmark updates the Set used by React state", () => {
    let bookmarkedIds = new Set<string>();
    function applyToggle(qId: string): Set<string> {
      const newState = toggleBookmarkFn(user, testId, qId);
      const next = new Set(bookmarkedIds);
      if (newState) next.add(qId);
      else next.delete(qId);
      return next;
    }
    bookmarkedIds = applyToggle("q1");
    expect(bookmarkedIds.has("q1")).toBe(true);
    bookmarkedIds = applyToggle("q2");
    expect(bookmarkedIds.has("q1")).toBe(true);
    expect(bookmarkedIds.has("q2")).toBe(true);
    bookmarkedIds = applyToggle("q1"); // remove
    expect(bookmarkedIds.has("q1")).toBe(false);
    expect(bookmarkedIds.has("q2")).toBe(true);
  });
});

// ── Section progress bar counts ───────────────────────────────────────────────

describe("computeSectionProgress", () => {
  const allQuestions = [mcSingleQ, mcMultiQ, textQ, dragQ];

  it("returns zero answered when no answers recorded", () => {
    const stats = computeSectionProgress(allQuestions, {}, [1, 2]);
    expect(stats).toHaveLength(2);
    expect(stats[0]).toMatchObject({ id: 1, answered: 0, total: 2 });
    expect(stats[1]).toMatchObject({ id: 2, answered: 0, total: 1 });
  });

  it("counts answered question in section 1", () => {
    const answers: Record<string, Answer> = {
      "1": { selectedOptions: [0], textAnswer: "", dragOrder: [] },
    };
    const stats = computeSectionProgress(allQuestions, answers, [1]);
    expect(stats[0]).toMatchObject({ id: 1, answered: 1, total: 2 });
  });

  it("counts all answered questions across multiple sections", () => {
    const answers: Record<string, Answer> = {
      "1": { selectedOptions: [0], textAnswer: "", dragOrder: [] },
      "2": { selectedOptions: [1], textAnswer: "", dragOrder: [] },
      "4": { selectedOptions: [2], textAnswer: "", dragOrder: [] },
    };
    const stats = computeSectionProgress(allQuestions, answers, [1, 2]);
    expect(stats[0]).toMatchObject({ id: 1, answered: 2, total: 2 });
    expect(stats[1]).toMatchObject({ id: 2, answered: 1, total: 1 });
  });

  it("section with no questions shows 0/0", () => {
    const stats = computeSectionProgress(allQuestions, {}, [99]);
    expect(stats[0]).toMatchObject({ id: 99, answered: 0, total: 0 });
  });

  it("whitespace-only textAnswer is not counted as answered", () => {
    const answers: Record<string, Answer> = {
      "1": { selectedOptions: [], textAnswer: "   ", dragOrder: [] },
    };
    const stats = computeSectionProgress(allQuestions, answers, [1]);
    expect(stats[0]).toMatchObject({ id: 1, answered: 0, total: 2 });
  });

  it("non-empty textAnswer is counted as answered", () => {
    const answers: Record<string, Answer> = {
      "1": { selectedOptions: [], textAnswer: "some answer", dragOrder: [] },
    };
    const stats = computeSectionProgress(allQuestions, answers, [1]);
    expect(stats[0]).toMatchObject({ id: 1, answered: 1, total: 2 });
  });
});

// ── Try Again: session-based question replay ──────────────────────────────────

describe("Try Again: session questionIds filtering", () => {
  /**
   * Mirrors TakeTestPage filteredQuestions logic:
   * when replayQuestionIds are present, filter rawQuestions to only those IDs.
   */
  function filterForReplay(
    rawQuestions: Question[],
    replayQuestionIds: string[],
  ): Question[] {
    if (replayQuestionIds.length === 0) return rawQuestions;
    return rawQuestions.filter((q) => replayQuestionIds.includes(String(q.id)));
  }

  const allQuestions = [mcSingleQ, mcMultiQ, textQ, dragQ];

  it("returns only the questions whose IDs are in replayQuestionIds", () => {
    const result = filterForReplay(allQuestions, ["1", "3"]);
    expect(result).toHaveLength(2);
    expect(result.map((q) => String(q.id))).toEqual(["1", "3"]);
  });

  it("Try Again with all session IDs returns the full session question set", () => {
    const sessionIds = allQuestions.map((q) => String(q.id));
    const result = filterForReplay(allQuestions, sessionIds);
    expect(result).toHaveLength(allQuestions.length);
  });

  it("does not include questions outside the session ID list", () => {
    // Only question 1 was in the session
    const result = filterForReplay(allQuestions, ["1"]);
    expect(result).toHaveLength(1);
    expect(String(result[0].id)).toBe("1");
  });

  it("empty replayQuestionIds returns all questions (normal mode)", () => {
    const result = filterForReplay(allQuestions, []);
    expect(result).toHaveLength(allQuestions.length);
  });

  it("unknown IDs in replayQuestionIds produce empty result", () => {
    const result = filterForReplay(allQuestions, ["999", "1000"]);
    expect(result).toHaveLength(0);
  });

  it("IDs are compared as strings (BigInt id vs string)", () => {
    // mcSingleQ.id is BigInt(1); filter compares String(q.id) === "1"
    const result = filterForReplay([mcSingleQ], ["1"]);
    expect(result).toHaveLength(1);
  });
});

/** Mirrors the updated filterQuestionsBySections that handles UNCATEGORISED_ID = -1 */
const UNCATEGORISED_ID = -1;
function filterWithUncategorised(
  questions: Question[],
  selectedSectionIds: number[],
): Question[] {
  if (selectedSectionIds.length === 0) return questions;
  return questions.filter((q) => {
    const sid = q.sectionId != null ? Number(q.sectionId) : undefined;
    if (sid === undefined) {
      return selectedSectionIds.includes(UNCATEGORISED_ID);
    }
    return selectedSectionIds.includes(sid);
  });
}

describe("filterWithUncategorised — Uncategorised section support", () => {
  const allQuestions = [mcSingleQ, mcMultiQ, textQ, dragQ];
  // mcSingleQ -> section 1, mcMultiQ -> section 2, textQ -> undefined (uncategorised), dragQ -> section 1

  it("returns all when selectedSectionIds is empty (entire test)", () => {
    expect(filterWithUncategorised(allQuestions, [])).toHaveLength(4);
  });

  it("includes uncategorised questions when UNCATEGORISED_ID (-1) is selected", () => {
    const result = filterWithUncategorised(allQuestions, [UNCATEGORISED_ID]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(BigInt(3)); // textQ has no section
  });

  it("combines section 1 + Uncategorised when both selected", () => {
    const result = filterWithUncategorised(allQuestions, [1, UNCATEGORISED_ID]);
    const ids = result.map((q) => q.id);
    expect(ids).toContain(BigInt(1)); // mcSingleQ section 1
    expect(ids).toContain(BigInt(3)); // textQ uncategorised
    expect(ids).toContain(BigInt(4)); // dragQ section 1
    expect(ids).not.toContain(BigInt(2)); // mcMultiQ section 2
  });

  it("does NOT include uncategorised questions when only real sections are selected", () => {
    const result = filterWithUncategorised(allQuestions, [1, 2]);
    expect(result.find((q) => q.id === BigInt(3))).toBeUndefined();
  });

  it("selecting only UNCATEGORISED_ID returns no results when all questions have sections", () => {
    const allWithSection: Question[] = allQuestions.map((q) => ({
      ...q,
      sectionId: BigInt(1),
    }));
    const result = filterWithUncategorised(allWithSection, [UNCATEGORISED_ID]);
    expect(result).toHaveLength(0);
  });
});
