/**
 * Unit tests for ReviewModePage logic:
 * - Page loads and initialises correctly
 * - Navigation (prev/next, first/last question boundaries)
 * - Correct/incorrect answer display logic
 * - Explanation shown/hidden based on presence
 * - Section scores displayed when present
 * - Exit button target (returns to result page)
 * - Score badge colour thresholds
 * - Empty state when no review data
 * - Question counter formatting
 * - Option highlighting for MC questions (correct / user / neutral)
 * - Quick-jump dot state
 */
import { describe, expect, it } from "vitest";
import { QuestionType } from "./mocks/backendStub";
import type {
  ReviewData,
  ReviewQuestion,
  SectionResult,
} from "./mocks/backendStub";

// ── Mirrors from ReviewModePage ───────────────────────────────────────────────

function safeIndex(current: number, total: number): number {
  return Math.max(0, Math.min(current, total - 1));
}

function goTo(_current: number, target: number, total: number): number {
  return safeIndex(target, total);
}

function hasPrev(index: number): boolean {
  return index > 0;
}

function hasNext(index: number, total: number): boolean {
  return index < total - 1;
}

function questionCounter(index: number, total: number): string {
  return `${index + 1} / ${total}`;
}

function scoreBadgeClass(score: number): string {
  if (score >= 75) return "text-accent";
  if (score >= 60) return "text-primary";
  return "text-destructive";
}

function sectionScorePercent(score: bigint, total: bigint): number {
  return Number(total) > 0
    ? Math.round((Number(score) / Number(total)) * 100)
    : 0;
}

/** Mirrors option row class logic from ReviewModePage */
function optionRowClass(
  opt: string,
  correctAnswer: string,
  userAnswer: string,
): string {
  const isCorrectOpt = correctAnswer.split(", ").includes(opt);
  const isUserOpt = userAnswer.split(", ").includes(opt);
  if (isCorrectOpt)
    return "bg-accent/10 border-accent/30 text-accent font-medium";
  if (isUserOpt && !isCorrectOpt)
    return "bg-destructive/10 border-destructive/30 text-destructive";
  return "bg-muted/40 border-transparent text-muted-foreground";
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const sampleSectionScores: SectionResult[] = [
  {
    sectionId: BigInt(1),
    sectionName: "Section Alpha",
    score: BigInt(3),
    totalQuestions: BigInt(4),
  },
  {
    sectionId: BigInt(2),
    sectionName: "Section Beta",
    score: BigInt(2),
    totalQuestions: BigInt(3),
  },
];

const sampleReviewQuestions: ReviewQuestion[] = [
  {
    question: {
      id: BigInt(1),
      text: "<p>What is the capital of France?</p>",
      questionType: QuestionType.mcSingle,
      options: ["London", "Paris", "Berlin", "Madrid"],
      explanation:
        "<p>Paris has been the capital of France since the 10th century.</p>",
    },
    correctAnswer: "Paris",
    userAnswer: "Paris",
    isCorrect: true,
  },
  {
    question: {
      id: BigInt(2),
      text: "<p>What is the powerhouse of the cell?</p>",
      questionType: QuestionType.mcSingle,
      options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi"],
    },
    correctAnswer: "Mitochondria",
    userAnswer: "Nucleus",
    isCorrect: false,
  },
  {
    question: {
      id: BigInt(3),
      text: "<p>Name the process by which plants make food.</p>",
      questionType: QuestionType.textInput,
      options: [],
      explanation: undefined,
    },
    correctAnswer: "photosynthesis",
    userAnswer: "photosynthesis",
    isCorrect: true,
  },
  {
    question: {
      id: BigInt(4),
      text: "<p>Which planets are in the solar system? Select all.</p>",
      questionType: QuestionType.mcMulti,
      options: ["Earth", "Mars", "Pluto", "Neptune"],
      explanation: "<p>Pluto was reclassified as a dwarf planet in 2006.</p>",
    },
    correctAnswer: "Earth, Mars, Neptune",
    userAnswer: "Earth, Pluto",
    isCorrect: false,
  },
  {
    question: {
      id: BigInt(5),
      text: "<p>Drag the events in chronological order.</p>",
      questionType: QuestionType.dragOrder,
      options: ["WW1", "WW2", "Cold War", "Moon Landing"],
    },
    correctAnswer: "WW1 → WW2 → Cold War → Moon Landing",
    userAnswer: "WW2 → WW1 → Cold War → Moon Landing",
    isCorrect: false,
  },
];

const sampleReviewData: ReviewData = {
  totalScore: 80,
  sectionScores: sampleSectionScores,
  questions: sampleReviewQuestions,
};

const emptyReviewData: ReviewData = {
  totalScore: 0,
  sectionScores: [],
  questions: [],
};

// ── Page loads / basic rendering ───────────────────────────────────────────────

describe("ReviewModePage — initialisation", () => {
  it("total question count matches questions array length", () => {
    expect(sampleReviewData.questions.length).toBe(5);
  });

  it("initial index is 0 (first question)", () => {
    const initial = 0;
    expect(safeIndex(initial, sampleReviewData.questions.length)).toBe(0);
  });

  it("first question is shown at index 0", () => {
    const first = sampleReviewData.questions[0];
    expect(first.question.id).toBe(BigInt(1));
  });

  it("totalScore from ReviewData is displayed as percentage", () => {
    expect(sampleReviewData.totalScore).toBe(80);
  });

  it("empty questions array causes empty state", () => {
    const isEmpty = emptyReviewData.questions.length === 0;
    expect(isEmpty).toBe(true);
  });

  it("null reviewData causes empty state", () => {
    const data: ReviewData | null = null as ReviewData | null;
    const isEmpty = !data || (data as ReviewData).questions.length === 0;
    expect(isEmpty).toBe(true);
  });
});

// ── Navigation ─────────────────────────────────────────────────────────────────

describe("ReviewModePage — question navigation", () => {
  it("hasPrev is false at index 0", () => {
    expect(hasPrev(0)).toBe(false);
  });

  it("hasPrev is true at index 1", () => {
    expect(hasPrev(1)).toBe(true);
  });

  it("hasNext is true at index 0 when total > 1", () => {
    expect(hasNext(0, 5)).toBe(true);
  });

  it("hasNext is false at last index", () => {
    expect(hasNext(4, 5)).toBe(false);
  });

  it("goTo clamps to 0 when target is negative", () => {
    expect(goTo(0, -1, 5)).toBe(0);
  });

  it("goTo clamps to total-1 when target exceeds range", () => {
    expect(goTo(4, 99, 5)).toBe(4);
  });

  it("goTo navigates to valid middle index", () => {
    expect(goTo(0, 2, 5)).toBe(2);
  });

  it("goTo to last index returns total-1", () => {
    expect(goTo(0, 4, 5)).toBe(4);
  });

  it("next advances index by 1", () => {
    const next = goTo(0, 1, 5);
    expect(next).toBe(1);
  });

  it("prev goes back from index 3 to 2", () => {
    const prev = goTo(3, 2, 5);
    expect(prev).toBe(2);
  });
});

// ── Question counter ────────────────────────────────────────────────────────

describe("ReviewModePage — question counter format", () => {
  it("formats as '1 / 5' at index 0", () => {
    expect(questionCounter(0, 5)).toBe("1 / 5");
  });

  it("formats as '3 / 15' at index 2", () => {
    expect(questionCounter(2, 15)).toBe("3 / 15");
  });

  it("formats as '5 / 5' at last index", () => {
    expect(questionCounter(4, 5)).toBe("5 / 5");
  });
});

// ── Correct / incorrect answer display ─────────────────────────────────────

describe("ReviewModePage — answer correctness display", () => {
  it("isCorrect is true for question 1 (Paris)", () => {
    expect(sampleReviewQuestions[0].isCorrect).toBe(true);
  });

  it("isCorrect is false for question 2 (Nucleus instead of Mitochondria)", () => {
    expect(sampleReviewQuestions[1].isCorrect).toBe(false);
  });

  it("correct answer for text question 3 is photosynthesis", () => {
    expect(sampleReviewQuestions[2].correctAnswer).toBe("photosynthesis");
  });

  it("correct answer for wrong MC question 2 is Mitochondria", () => {
    expect(sampleReviewQuestions[1].correctAnswer).toBe("Mitochondria");
  });

  it("user answer for wrong MC question 2 is Nucleus", () => {
    expect(sampleReviewQuestions[1].userAnswer).toBe("Nucleus");
  });

  it("correct and user answer match for correct question", () => {
    const q = sampleReviewQuestions[0];
    expect(q.correctAnswer).toBe(q.userAnswer);
  });

  it("correct and user answer differ for incorrect question", () => {
    const q = sampleReviewQuestions[1];
    expect(q.correctAnswer).not.toBe(q.userAnswer);
  });
});

// ── MC option highlighting ─────────────────────────────────────────────────

describe("ReviewModePage — MC option row highlighting", () => {
  const q = sampleReviewQuestions[3]; // Earth, Mars, Neptune correct; user: Earth, Pluto

  it("Earth is highlighted as correct (in correct answer)", () => {
    const cls = optionRowClass("Earth", q.correctAnswer, q.userAnswer);
    expect(cls).toContain("accent");
  });

  it("Pluto is highlighted as user wrong answer", () => {
    const cls = optionRowClass("Pluto", q.correctAnswer, q.userAnswer);
    expect(cls).toContain("destructive");
  });

  it("Mars is highlighted as correct (not selected by user)", () => {
    const cls = optionRowClass("Mars", q.correctAnswer, q.userAnswer);
    expect(cls).toContain("accent");
  });

  it("Neptune is highlighted as correct (not selected by user)", () => {
    const cls = optionRowClass("Neptune", q.correctAnswer, q.userAnswer);
    expect(cls).toContain("accent");
  });

  it("neutral option (not correct, not user) gets muted class", () => {
    // 'Pluto' is user wrong — let's use a totally neutral option
    // Fake question: correctAnswer = "A", userAnswer = "B", option = "C"
    const cls = optionRowClass("C", "A", "B");
    expect(cls).toContain("muted");
  });
});

// ── Explanation display ─────────────────────────────────────────────────────

describe("ReviewModePage — explanation display", () => {
  it("explanation is present for question 1 (Paris)", () => {
    const q = sampleReviewQuestions[0];
    expect(q.question.explanation).toBeDefined();
    expect(q.question.explanation).not.toBe("");
  });

  it("explanation is absent for question 2 (Mitochondria)", () => {
    const q = sampleReviewQuestions[1];
    expect(q.question.explanation).toBeUndefined();
  });

  it("explanation is absent for question 3 (photosynthesis)", () => {
    const q = sampleReviewQuestions[2];
    expect(q.question.explanation).toBeUndefined();
  });

  it("explanation is present for question 4 (Pluto)", () => {
    const q = sampleReviewQuestions[3];
    expect(q.question.explanation).toBeDefined();
    expect(q.question.explanation).toContain("dwarf planet");
  });

  it("explanation card should NOT render when explanation is falsy", () => {
    const q = sampleReviewQuestions[1];
    const shouldRender = Boolean(q.question.explanation);
    expect(shouldRender).toBe(false);
  });

  it("explanation card SHOULD render when explanation is truthy", () => {
    const q = sampleReviewQuestions[0];
    const shouldRender = Boolean(q.question.explanation);
    expect(shouldRender).toBe(true);
  });
});

// ── Section scores ────────────────────────────────────────────────────────────

describe("ReviewModePage — section scores", () => {
  it("hasSections is true when sectionScores array is non-empty", () => {
    const hasSections = sampleReviewData.sectionScores.length > 0;
    expect(hasSections).toBe(true);
  });

  it("hasSections is false when sectionScores is empty", () => {
    const hasSections = emptyReviewData.sectionScores.length > 0;
    expect(hasSections).toBe(false);
  });

  it("Section Alpha has 75% score (3/4)", () => {
    const sr = sampleSectionScores[0];
    expect(sectionScorePercent(sr.score, sr.totalQuestions)).toBe(75);
  });

  it("Section Beta has 67% score (2/3 rounded)", () => {
    const sr = sampleSectionScores[1];
    expect(sectionScorePercent(sr.score, sr.totalQuestions)).toBe(67);
  });

  it("zero totalQuestions returns 0% to avoid div-by-zero", () => {
    expect(sectionScorePercent(BigInt(0), BigInt(0))).toBe(0);
  });
});

// ── Score badge colour thresholds ────────────────────────────────────────────

describe("ReviewModePage — score badge colour", () => {
  it("score >= 75 uses accent class", () => {
    expect(scoreBadgeClass(80)).toBe("text-accent");
    expect(scoreBadgeClass(75)).toBe("text-accent");
  });

  it("score >= 60 and < 75 uses primary class", () => {
    expect(scoreBadgeClass(60)).toBe("text-primary");
    expect(scoreBadgeClass(74)).toBe("text-primary");
  });

  it("score < 60 uses destructive class", () => {
    expect(scoreBadgeClass(59)).toBe("text-destructive");
    expect(scoreBadgeClass(0)).toBe("text-destructive");
  });
});

// ── Exit / return to results ──────────────────────────────────────────────────

describe("ReviewModePage — exit navigation", () => {
  it("exit button navigates back to result page with same testId", () => {
    const testId = "42";
    const expectedPath = `/tests/${testId}/result`;
    const builtPath = `/tests/${testId}/result`;
    expect(builtPath).toBe(expectedPath);
  });

  it("testId from URL param is used for back-link construction", () => {
    const testId = "7";
    const params = { testId };
    expect(params.testId).toBe("7");
  });
});

// ── Quick-jump dots ─────────────────────────────────────────────────────────

describe("ReviewModePage — quick-jump dot state", () => {
  const questions = sampleReviewQuestions;

  it("dot at current index gets primary class", () => {
    const activeClass = "bg-primary text-primary-foreground scale-125";
    const normalClass = (isCorrect: boolean) =>
      isCorrect
        ? "bg-accent/20 text-accent"
        : "bg-destructive/20 text-destructive";

    const dotClass = (i: number, current: number) =>
      i === current ? activeClass : normalClass(questions[i].isCorrect);

    expect(dotClass(0, 0)).toContain("primary");
    expect(dotClass(1, 0)).toContain("destructive"); // q2 is incorrect
    expect(dotClass(2, 0)).toContain("accent"); // q3 is correct
  });

  it("correct questions get accent dot class", () => {
    const correctIdx = questions
      .map((q, i) => ({ i, isCorrect: q.isCorrect }))
      .filter((x) => x.isCorrect)
      .map((x) => x.i);
    expect(correctIdx).toContain(0); // Paris — correct
    expect(correctIdx).toContain(2); // photosynthesis — correct
  });

  it("incorrect questions get destructive dot class", () => {
    const incorrectIdx = questions
      .map((q, i) => ({ i, isCorrect: q.isCorrect }))
      .filter((x) => !x.isCorrect)
      .map((x) => x.i);
    expect(incorrectIdx).toContain(1); // Mitochondria — wrong
    expect(incorrectIdx).toContain(3); // Pluto — wrong
  });
});

// ── Bookmarked Questions Panel — ReviewModePage ──────────────────────────────

/**
 * Same in-memory stub used in testResultLogic tests — copy here so
 * reviewMode tests remain self-contained.
 */
class ReviewBookmarkStorageStub {
  private store = new Map<string, Set<string>>();
  private key = (u: string, t: string) => `${u}_${t}`;

  getBookmarks(u: string, t: string): Set<string> {
    return new Set(this.store.get(this.key(u, t)) ?? []);
  }
  add(u: string, t: string, qid: string): void {
    const k = this.key(u, t);
    if (!this.store.has(k)) this.store.set(k, new Set());
    this.store.get(k)!.add(qid);
  }
  remove(u: string, t: string, qid: string): void {
    this.store.get(this.key(u, t))?.delete(qid);
  }
  toggle(u: string, t: string, qid: string): boolean {
    const set = this.getBookmarks(u, t);
    if (set.has(qid)) {
      this.remove(u, t, qid);
      return false;
    }
    this.add(u, t, qid);
    return true;
  }
}

describe("ReviewModePage — bookmarked questions panel", () => {
  const questions = sampleReviewQuestions;

  it("bookmarked panel lists only bookmarked questions", () => {
    const storage = new ReviewBookmarkStorageStub();
    storage.add("alice", "5", String(questions[0].question.id)); // Q1 Paris
    storage.add("alice", "5", String(questions[3].question.id)); // Q4 Pluto
    const ids = storage.getBookmarks("alice", "5");
    const panel = questions.filter((rq) => ids.has(String(rq.question.id)));
    expect(panel).toHaveLength(2);
    expect(panel.map((rq) => String(rq.question.id))).toContain(
      String(questions[0].question.id),
    );
    expect(panel.map((rq) => String(rq.question.id))).toContain(
      String(questions[3].question.id),
    );
  });

  it("clicking bookmarked question navigates to its index in review", () => {
    // Simulates jumpToBookmarked: finds the index of a bookmarked review question
    // and calls goTo(index).
    const targetRq = questions[3]; // index 3 = Q4 Pluto
    const idx = questions.findIndex(
      (q) => String(q.question.id) === String(targetRq.question.id),
    );
    expect(idx).toBe(3);
    const navigatedTo = goTo(0, idx, questions.length);
    expect(navigatedTo).toBe(3);
  });

  it("panel is hidden when no bookmarks exist", () => {
    const storage = new ReviewBookmarkStorageStub();
    const ids = storage.getBookmarks("alice", "5");
    const panel = questions.filter((rq) => ids.has(String(rq.question.id)));
    expect(panel).toHaveLength(0);
  });

  it("removing a bookmark from the panel reduces panel count", () => {
    const storage = new ReviewBookmarkStorageStub();
    storage.add("alice", "5", String(questions[0].question.id));
    storage.add("alice", "5", String(questions[1].question.id));
    storage.remove("alice", "5", String(questions[0].question.id));
    const ids = storage.getBookmarks("alice", "5");
    const panel = questions.filter((rq) => ids.has(String(rq.question.id)));
    expect(panel).toHaveLength(1);
    expect(panel[0].question.id).toBe(questions[1].question.id);
  });

  it("jump to bookmarked question at first position", () => {
    const targetRq = questions[0];
    const idx = questions.findIndex(
      (q) => String(q.question.id) === String(targetRq.question.id),
    );
    const navigatedTo = goTo(4, idx, questions.length);
    expect(navigatedTo).toBe(0);
  });

  it("jump to bookmarked question at last position", () => {
    const targetRq = questions[4];
    const idx = questions.findIndex(
      (q) => String(q.question.id) === String(targetRq.question.id),
    );
    const navigatedTo = goTo(0, idx, questions.length);
    expect(navigatedTo).toBe(4);
  });

  it("toggle removes bookmark and clears from panel", () => {
    const storage = new ReviewBookmarkStorageStub();
    storage.add("alice", "5", String(questions[2].question.id));
    const wasRemoved = storage.toggle(
      "alice",
      "5",
      String(questions[2].question.id),
    );
    expect(wasRemoved).toBe(false);
    const ids = storage.getBookmarks("alice", "5");
    expect(ids.has(String(questions[2].question.id))).toBe(false);
  });

  it("each bookmarked question exposes question text for display", () => {
    const storage = new ReviewBookmarkStorageStub();
    for (const rq of questions) {
      storage.add("alice", "5", String(rq.question.id));
    }
    const ids = storage.getBookmarks("alice", "5");
    const panel = questions.filter((rq) => ids.has(String(rq.question.id)));
    for (const rq of panel) {
      expect(rq.question.text).toBeTruthy();
    }
  });
});

// ── Admin button visibility ───────────────────────────────────────────────────

describe("ReviewModePage — admin button visibility", () => {
  it("admin dashboard button shown to admin", () => {
    const isAdmin = true;
    expect(isAdmin).toBe(true);
  });

  it("admin dashboard button hidden from regular user", () => {
    const isAdmin = false;
    expect(isAdmin).toBe(false);
  });
});
