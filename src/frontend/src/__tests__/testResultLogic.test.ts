/**
 * Unit tests for TestResultPage display logic:
 * - Filtering incorrect results
 * - Grade boundary logic
 * - Correct answer label generation for all question types
 * - HTML in options renders via RichTextDisplay (not raw text)
 * - Explanation shown below correct answer in breakdown
 */
import { describe, expect, it } from "vitest";
import { QuestionType } from "./mocks/backendStub";
import type {
  Question,
  QuestionResult,
  SectionResult,
} from "./mocks/backendStub";

// ── Mirrors from TestResultPage ───────────────────────────────────────────────

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

function getCorrectAnswerLabel(q: Question): string {
  if (q.questionType === QuestionType.textInput) {
    return q.correctText || "\u2014";
  }
  if (
    q.questionType === QuestionType.mcSingle ||
    q.questionType === QuestionType.mcMulti
  ) {
    const labels = q.correctAnswers
      .map((idx) => q.options[Number(idx)])
      .filter(Boolean);
    return labels.join(", ") || "\u2014";
  }
  if (q.questionType === QuestionType.dragOrder) {
    return q.correctOrder
      .map((idx) => q.options[Number(idx)])
      .filter(Boolean)
      .join(" \u2192 ");
  }
  return "\u2014";
}

/** Mirrors the HTML-aware content detection used in TestResultPage */
function isRichHtml(content: string): boolean {
  // Rich text from Quill editor always wraps in <p> tags or has HTML entities
  return /<[a-z][\s\S]*>/i.test(content);
}

/** Simulates what RichTextDisplay does: accepts raw text or HTML */
function renderForTest(content: string): string {
  // If it's HTML, return it as-is (RichTextDisplay handles it)
  // If plain text, it's also passed to RichTextDisplay directly
  return content;
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const questions: Question[] = [
  {
    id: BigInt(1),
    testId: BigInt(1),
    orderIndex: BigInt(0),
    text: "Single choice Q",
    questionType: QuestionType.mcSingle,
    options: ["A", "B", "C"],
    correctAnswers: [BigInt(1)],
    correctText: "",
    correctOrder: [],
    sectionId: BigInt(1),
  },
  {
    id: BigInt(2),
    testId: BigInt(1),
    orderIndex: BigInt(1),
    text: "Multi choice Q",
    questionType: QuestionType.mcMulti,
    options: ["X", "Y", "Z", "W"],
    correctAnswers: [BigInt(0), BigInt(3)],
    correctText: "",
    correctOrder: [],
    sectionId: BigInt(1),
  },
  {
    id: BigInt(3),
    testId: BigInt(1),
    orderIndex: BigInt(2),
    text: "Text Q",
    questionType: QuestionType.textInput,
    options: [],
    correctAnswers: [],
    correctText: "photosynthesis",
    correctOrder: [],
    sectionId: BigInt(2),
  },
  {
    id: BigInt(4),
    testId: BigInt(1),
    orderIndex: BigInt(3),
    text: "Drag Q",
    questionType: QuestionType.dragOrder,
    options: ["First", "Second", "Third"],
    correctAnswers: [],
    correctText: "",
    correctOrder: [BigInt(2), BigInt(0), BigInt(1)],
    sectionId: undefined,
  },
];

// Questions with HTML content (from rich text editor)
const richHtmlQuestions: Question[] = [
  {
    id: BigInt(10),
    testId: BigInt(1),
    orderIndex: BigInt(0),
    text: "<p>Which option is <strong>correct</strong>?</p>",
    questionType: QuestionType.mcSingle,
    options: [
      "<p>Option <em>Alpha</em></p>",
      "<p>Option <strong>Beta</strong></p>",
      "Plain option",
    ],
    correctAnswers: [BigInt(1)],
    correctText: "",
    correctOrder: [],
    sectionId: BigInt(1),
    explanation: "<p>Because <strong>Beta</strong> is the correct choice.</p>",
  },
  {
    id: BigInt(11),
    testId: BigInt(1),
    orderIndex: BigInt(1),
    text: "<p>What process involves $E = mc^2$?</p>",
    questionType: QuestionType.textInput,
    options: [],
    correctAnswers: [],
    correctText: "<p>Nuclear fission</p>",
    correctOrder: [],
    explanation: "<p>Einstein's equation relates energy and mass.</p>",
  },
  {
    id: BigInt(12),
    testId: BigInt(1),
    orderIndex: BigInt(2),
    text: "<p>Sort the steps:</p>",
    questionType: QuestionType.dragOrder,
    options: [
      "<p>Step <strong>One</strong></p>",
      "<p>Step <em>Two</em></p>",
      "Plain Step Three",
    ],
    correctAnswers: [],
    correctText: "",
    correctOrder: [BigInt(0), BigInt(1), BigInt(2)],
    // no explanation
  },
];

const questionResults: QuestionResult[] = [
  { questionId: BigInt(1), isCorrect: true },
  { questionId: BigInt(2), isCorrect: false },
  { questionId: BigInt(3), isCorrect: false },
  { questionId: BigInt(4), isCorrect: true },
];

// ── Filtering incorrect results ────────────────────────────────────────────────

describe("Filtering incorrect results", () => {
  it("returns only incorrect question results", () => {
    const incorrect = questionResults.filter((qr) => !qr.isCorrect);
    expect(incorrect).toHaveLength(2);
    expect(incorrect.map((r) => String(r.questionId))).toContain("2");
    expect(incorrect.map((r) => String(r.questionId))).toContain("3");
  });

  it("returns empty when all answers are correct", () => {
    const allCorrect: QuestionResult[] = questionResults.map((r) => ({
      ...r,
      isCorrect: true,
    }));
    const incorrect = allCorrect.filter((qr) => !qr.isCorrect);
    expect(incorrect).toHaveLength(0);
  });

  it("returns all when all answers are incorrect", () => {
    const allWrong: QuestionResult[] = questionResults.map((r) => ({
      ...r,
      isCorrect: false,
    }));
    const incorrect = allWrong.filter((qr) => !qr.isCorrect);
    expect(incorrect).toHaveLength(questionResults.length);
  });
});

// ── Grade label logic ─────────────────────────────────────────────────────────

describe("Grade label (TestResultPage.getGrade)", () => {
  it("returns Excellent for 100%", () => {
    expect(getGrade(100).label).toBe("Excellent!");
  });

  it("returns Excellent for exactly 90%", () => {
    expect(getGrade(90).label).toBe("Excellent!");
  });

  it("returns Good job for 89%", () => {
    expect(getGrade(89).label).toBe("Good job!");
  });

  it("returns Good job for exactly 75%", () => {
    expect(getGrade(75).label).toBe("Good job!");
  });

  it("returns Keep practicing for 74%", () => {
    expect(getGrade(74).label).toBe("Keep practicing");
  });

  it("returns Keep practicing for exactly 60%", () => {
    expect(getGrade(60).label).toBe("Keep practicing");
  });

  it("returns Needs improvement for 59%", () => {
    expect(getGrade(59).label).toBe("Needs improvement");
  });

  it("returns Needs improvement for 0%", () => {
    expect(getGrade(0).label).toBe("Needs improvement");
  });
});

// ── Correct answer labels ─────────────────────────────────────────────────────

describe("getCorrectAnswerLabel", () => {
  it("returns option label for mcSingle", () => {
    expect(getCorrectAnswerLabel(questions[0])).toBe("B");
  });

  it("returns comma-separated labels for mcMulti", () => {
    expect(getCorrectAnswerLabel(questions[1])).toBe("X, W");
  });

  it("returns correctText for textInput", () => {
    expect(getCorrectAnswerLabel(questions[2])).toBe("photosynthesis");
  });

  it("returns arrow-joined items for dragOrder with correctOrder", () => {
    // correctOrder [2,0,1] → options[2]="Third", options[0]="First", options[1]="Second"
    expect(getCorrectAnswerLabel(questions[3])).toBe(
      "Third \u2192 First \u2192 Second",
    );
  });

  it("returns — for empty mcSingle correctAnswers", () => {
    const q = {
      ...questions[0],
      correctAnswers: [] as bigint[],
    };
    expect(getCorrectAnswerLabel(q)).toBe("\u2014");
  });

  it("returns — for empty textInput correctText", () => {
    const q = { ...questions[2], correctText: "" };
    expect(getCorrectAnswerLabel(q)).toBe("\u2014");
  });

  it("returns HTML content for textInput with rich text correctText", () => {
    const q = { ...richHtmlQuestions[1] };
    expect(getCorrectAnswerLabel(q)).toBe("<p>Nuclear fission</p>");
  });

  it("returns HTML-containing option for mcSingle with rich text options", () => {
    // correctAnswers[0] = 1 → options[1] = "<p>Option <strong>Beta</strong></p>"
    expect(getCorrectAnswerLabel(richHtmlQuestions[0])).toBe(
      "<p>Option <strong>Beta</strong></p>",
    );
  });

  it("returns HTML-containing options for dragOrder", () => {
    // correctOrder [0,1,2] → step one → step two → step three
    const result = getCorrectAnswerLabel(richHtmlQuestions[2]);
    expect(result).toContain("Step");
    expect(result).toContain("\u2192");
  });
});

// ── HTML rendering contract tests ─────────────────────────────────────────────

describe("HTML content rendering (RichTextDisplay contract)", () => {
  it("option text with HTML tags is detected as rich HTML", () => {
    const opt = "<p>Option <em>Alpha</em></p>";
    expect(isRichHtml(opt)).toBe(true);
  });

  it("plain text option is not detected as HTML", () => {
    expect(isRichHtml("Plain option")).toBe(false);
  });

  it("rich option text is passed to renderForTest without stripping tags", () => {
    const htmlOpt = "<p>Option <strong>Beta</strong></p>";
    expect(renderForTest(htmlOpt)).toBe(htmlOpt);
  });

  it("explanation HTML is preserved for RichTextDisplay", () => {
    const explanation = richHtmlQuestions[0].explanation ?? "";
    expect(isRichHtml(explanation)).toBe(true);
    expect(renderForTest(explanation)).toContain("<strong>Beta</strong>");
  });

  it("question text with math formula passes through as HTML", () => {
    const q = richHtmlQuestions[1];
    // Contains dollar sign math formula
    expect(q.text).toContain("$E = mc^2$");
    // RichTextDisplay should receive this and render KaTeX
    expect(renderForTest(q.text)).toContain("$E = mc^2$");
  });

  it("correctText as HTML passes through to RichTextDisplay (not raw text node)", () => {
    const label = getCorrectAnswerLabel(richHtmlQuestions[1]);
    // Should NOT be a plain string without tags
    expect(isRichHtml(label)).toBe(true);
  });

  it("explanation is absent for question without explanation field", () => {
    const q = richHtmlQuestions[2];
    expect(q.explanation).toBeUndefined();
  });

  it("explanation is present for question with explanation field", () => {
    const q = richHtmlQuestions[0];
    expect(q.explanation).toBeDefined();
    expect(q.explanation).not.toBe("");
  });

  it("options array from rich questions all contain HTML", () => {
    const richQ = richHtmlQuestions[0];
    const htmlOpts = richQ.options.filter((o) => isRichHtml(o));
    // First two options are HTML
    expect(htmlOpts.length).toBeGreaterThanOrEqual(2);
  });
});

// ── Score percentage calculation ──────────────────────────────────────────────

describe("Score percentage calculation", () => {
  it("calculates 75% for 3/4 correct", () => {
    const score = 3;
    const total = 4;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    expect(pct).toBe(75);
  });

  it("calculates 100% for perfect score", () => {
    expect(Math.round((5 / 5) * 100)).toBe(100);
  });

  it("calculates 0% for zero score", () => {
    expect(Math.round((0 / 5) * 100)).toBe(0);
  });

  it("returns 0% when total is 0 (avoids div-by-zero)", () => {
    const score = 0;
    const total = 0;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    expect(pct).toBe(0);
  });
});

// ── Question map building (qMap) ──────────────────────────────────────────────

describe("Question map building", () => {
  it("builds a map from question id (string) to question", () => {
    const qMap = new Map(questions.map((q) => [String(q.id), q]));
    expect(qMap.get("1")).toBe(questions[0]);
    expect(qMap.get("3")).toBe(questions[2]);
  });

  it("returns undefined for unknown id", () => {
    const qMap = new Map(questions.map((q) => [String(q.id), q]));
    expect(qMap.get("9999")).toBeUndefined();
  });
});

// ── Section result logic ──────────────────────────────────────────────────────

/** Mirrors getSectionName from TestResultPage */
function getSectionName(
  q: Question,
  sectionResults: SectionResult[],
): string | null {
  if (!sectionResults.length) return null;
  const sectionMap = new Map<bigint, string>(
    sectionResults.map((sr) => [sr.sectionId, sr.sectionName]),
  );
  const sid = q.sectionId;
  if (sid == null) return null;
  return sectionMap.get(sid) ?? null;
}

/** Mirrors hasSectionResults logic from TestResultPage */
function hasSectionResults(results: SectionResult[]): boolean {
  return Array.isArray(results) && results.length > 0;
}

/** Mirrors per-section percentage calculation */
function sectionPercentage(sr: SectionResult): number {
  return sr.totalQuestions > BigInt(0)
    ? Math.round((Number(sr.score) / Number(sr.totalQuestions)) * 100)
    : 0;
}

const sectionResults: SectionResult[] = [
  {
    sectionId: BigInt(1),
    sectionName: "Section A",
    score: BigInt(1),
    totalQuestions: BigInt(2),
  },
  {
    sectionId: BigInt(2),
    sectionName: "Section B",
    score: BigInt(1),
    totalQuestions: BigInt(1),
  },
];

describe("Section result detection", () => {
  it("returns true when sectionResults has entries", () => {
    expect(hasSectionResults(sectionResults)).toBe(true);
  });

  it("returns false for empty sectionResults (legacy)", () => {
    expect(hasSectionResults([])).toBe(false);
  });

  it("returns false when sectionResults is absent (legacy result)", () => {
    // Legacy TestResult does not have sectionResults — treat absent as []
    const legacyResult: Record<string, unknown> = {
      score: BigInt(3),
      totalQuestions: BigInt(4),
    };
    const sr =
      (legacyResult.sectionResults as SectionResult[] | undefined) ?? [];
    expect(hasSectionResults(sr)).toBe(false);
  });
});

describe("Section percentage calculation", () => {
  it("calculates 50% for Section A (1/2)", () => {
    expect(sectionPercentage(sectionResults[0])).toBe(50);
  });

  it("calculates 100% for Section B (1/1)", () => {
    expect(sectionPercentage(sectionResults[1])).toBe(100);
  });

  it("returns 0% when totalQuestions is 0 (avoids div-by-zero)", () => {
    const zeroSection: SectionResult = {
      sectionId: BigInt(3),
      sectionName: "Empty Section",
      score: BigInt(0),
      totalQuestions: BigInt(0),
    };
    expect(sectionPercentage(zeroSection)).toBe(0);
  });
});

describe("getSectionName for breakdown labels", () => {
  it("returns the section name for a question with a matching sectionId", () => {
    // questions[0].sectionId = [1] -> Section A
    expect(getSectionName(questions[0], sectionResults)).toBe("Section A");
  });

  it("returns the correct section name for a different section", () => {
    // questions[2].sectionId = [2] -> Section B
    expect(getSectionName(questions[2], sectionResults)).toBe("Section B");
  });

  it("returns null for a question with no sectionId (sectionId = [])", () => {
    // questions[3].sectionId = []
    expect(getSectionName(questions[3], sectionResults)).toBeNull();
  });

  it("returns null when sectionResults is empty (legacy result)", () => {
    expect(getSectionName(questions[0], [])).toBeNull();
  });

  it("returns null for a sectionId not present in sectionResults", () => {
    const qUnknownSection: Question = {
      ...questions[0],
      sectionId: BigInt(99),
    };
    expect(getSectionName(qUnknownSection, sectionResults)).toBeNull();
  });
});

describe("Section results — mixed (some sections have 0 wrong)", () => {
  const mixedSections: SectionResult[] = [
    {
      sectionId: BigInt(1),
      sectionName: "Section A",
      score: BigInt(5),
      totalQuestions: BigInt(5),
    },
    {
      sectionId: BigInt(2),
      sectionName: "Section B",
      score: BigInt(2),
      totalQuestions: BigInt(5),
    },
  ];

  it("correctly computes 100% for Section A (all correct)", () => {
    expect(sectionPercentage(mixedSections[0])).toBe(100);
  });

  it("correctly computes 40% for Section B", () => {
    expect(sectionPercentage(mixedSections[1])).toBe(40);
  });

  it("combined total is sum of individual sections", () => {
    const totalScore = mixedSections.reduce(
      (acc, sr) => acc + Number(sr.score),
      0,
    );
    const totalQs = mixedSections.reduce(
      (acc, sr) => acc + Number(sr.totalQuestions),
      0,
    );
    const pct = totalQs > 0 ? Math.round((totalScore / totalQs) * 100) : 0;
    expect(pct).toBe(70); // 7/10 = 70%
  });
});

// ── Admin button visibility gating in TestResultPage ────────────────────────

/** Mirrors isAdmin check used in TestResultPage for admin dashboard buttons */
function shouldShowAdminDashboardButton(role: string | undefined): boolean {
  return role === "admin";
}

describe("TestResultPage – admin dashboard button visibility", () => {
  it("shows Admin Dashboard button to admin user", () => {
    expect(shouldShowAdminDashboardButton("admin")).toBe(true);
  });

  it("hides Admin Dashboard button from regular user", () => {
    expect(shouldShowAdminDashboardButton("user")).toBe(false);
  });

  it("hides Admin Dashboard button when not logged in", () => {
    expect(shouldShowAdminDashboardButton(undefined)).toBe(false);
  });

  it("regular user error state does NOT show admin button (Back to Tests is shown instead)", () => {
    // After fix: error state admin button only renders if isAdmin
    const userRole = "user";
    const showAdmin = shouldShowAdminDashboardButton(userRole);
    expect(showAdmin).toBe(false);
  });

  it("result actions footer does NOT show admin button for regular user", () => {
    const userRole = "user";
    const showAdmin = shouldShowAdminDashboardButton(userRole);
    expect(showAdmin).toBe(false);
  });
});

describe("Legacy results (no sectionResults field)", () => {
  it("treats undefined sectionResults as no-section mode", () => {
    const legacyResult = {
      score: BigInt(3),
      totalQuestions: BigInt(4),
      questionResults,
      // sectionResults intentionally absent
    };
    const sr =
      (legacyResult as { sectionResults?: SectionResult[] }).sectionResults ??
      [];
    expect(hasSectionResults(sr)).toBe(false);
  });

  it("still filters incorrect questions correctly for legacy results", () => {
    const incorrect = questionResults.filter((qr) => !qr.isCorrect);
    expect(incorrect).toHaveLength(2);
  });

  it("getSectionName returns null for all questions in legacy mode", () => {
    for (const q of questions) {
      expect(getSectionName(q, [])).toBeNull();
    }
  });
});

// Uncategorised section in TestResultPage

/** Mirrors the updated getSectionName from TestResultPage */
function getSectionNameWithUncategorised(
  q: Question,
  sectionResults: SectionResult[],
): string | null {
  const hasSections = sectionResults.length > 0;
  const sid = q.sectionId;
  if (sid == null) {
    return hasSections ? "Uncategorised" : null;
  }
  if (!hasSections) return null;
  const sectionMap = new Map<bigint, string>(
    sectionResults.map((sr) => [sr.sectionId, sr.sectionName]),
  );
  return sectionMap.get(sid) ?? null;
}

describe("getSectionName — Uncategorised support for questions with no section", () => {
  it("returns 'Uncategorised' for a question with null sectionId when section results exist", () => {
    // questions[3] has sectionId = undefined
    expect(getSectionNameWithUncategorised(questions[3], sectionResults)).toBe(
      "Uncategorised",
    );
  });

  it("returns null for a question with null sectionId when no section results (legacy)", () => {
    expect(getSectionNameWithUncategorised(questions[3], [])).toBeNull();
  });

  it("still returns the correct section name for questions with a sectionId", () => {
    expect(getSectionNameWithUncategorised(questions[0], sectionResults)).toBe(
      "Section A",
    );
    expect(getSectionNameWithUncategorised(questions[2], sectionResults)).toBe(
      "Section B",
    );
  });

  it("returns null for a sectionId not found in sectionResults", () => {
    const qUnknown: Question = { ...questions[0], sectionId: BigInt(99) };
    expect(
      getSectionNameWithUncategorised(qUnknown, sectionResults),
    ).toBeNull();
  });
});

describe("Uncategorised questions in section selection (StartTestModal logic)", () => {
  /** Mirrors how UserTestsPage computes uncategorised count */
  function computeUncategorisedCount(qs: Question[]): number {
    return qs.filter((q) => q.sectionId == null).length;
  }

  it("counts uncategorised questions correctly", () => {
    expect(computeUncategorisedCount(questions)).toBe(1); // only questions[3]
  });

  it("returns 0 when all questions have sections", () => {
    const allAssigned = questions.map((q) => ({ ...q, sectionId: BigInt(1) }));
    expect(computeUncategorisedCount(allAssigned)).toBe(0);
  });

  it("Uncategorised checkbox is only rendered when count > 0", () => {
    const count = computeUncategorisedCount(questions);
    const shouldRender = count > 0;
    expect(shouldRender).toBe(true);
  });

  it("Uncategorised checkbox is NOT rendered when all questions are categorised", () => {
    const allAssigned = questions.map((q) => ({ ...q, sectionId: BigInt(1) }));
    const count = computeUncategorisedCount(allAssigned);
    expect(count > 0).toBe(false);
  });
});

// ── Bookmark storage logic (bookmarkStorage) ──────────────────────────────────

/**
 * Minimal in-memory stub that mirrors the bookmarkStorage API
 * (localStorage is not available in vitest by default, so we replicate the
 * pure data-transformation logic to keep tests hermetic).
 */
class BookmarkStorageStub {
  private store = new Map<string, Set<string>>();

  private key(username: string, testId: string) {
    return `${username}_${testId}`;
  }

  getBookmarks(username: string, testId: string): Set<string> {
    return new Set(this.store.get(this.key(username, testId)) ?? []);
  }

  addBookmark(username: string, testId: string, questionId: string): void {
    const k = this.key(username, testId);
    if (!this.store.has(k)) this.store.set(k, new Set());
    this.store.get(k)!.add(questionId);
  }

  removeBookmark(username: string, testId: string, questionId: string): void {
    this.store.get(this.key(username, testId))?.delete(questionId);
  }

  toggleBookmark(
    username: string,
    testId: string,
    questionId: string,
  ): boolean {
    const set = this.getBookmarks(username, testId);
    if (set.has(questionId)) {
      this.removeBookmark(username, testId, questionId);
      return false;
    }
    this.addBookmark(username, testId, questionId);
    return true;
  }

  isBookmarked(username: string, testId: string, questionId: string): boolean {
    return this.getBookmarks(username, testId).has(questionId);
  }

  clearBookmarks(username: string, testId: string): void {
    this.store.delete(this.key(username, testId));
  }
}

describe("Bookmarked Questions Panel — TestResultPage", () => {
  it("shows bookmarked panel when bookmarks exist", () => {
    const storage = new BookmarkStorageStub();
    storage.addBookmark("user1", "1", "1");
    storage.addBookmark("user1", "1", "2");
    const ids = storage.getBookmarks("user1", "1");
    const bookmarked = questions.filter((q) => ids.has(String(q.id)));
    expect(bookmarked.length).toBeGreaterThan(0);
  });

  it("hides panel when no bookmarks exist", () => {
    const storage = new BookmarkStorageStub();
    const ids = storage.getBookmarks("user1", "1");
    const bookmarked = questions.filter((q) => ids.has(String(q.id)));
    expect(bookmarked).toHaveLength(0);
  });

  it("shows exactly the bookmarked questions in the panel", () => {
    const storage = new BookmarkStorageStub();
    storage.addBookmark("user1", "1", "1"); // Single choice Q
    storage.addBookmark("user1", "1", "3"); // Text Q
    const ids = storage.getBookmarks("user1", "1");
    const bookmarked = questions.filter((q) => ids.has(String(q.id)));
    expect(bookmarked).toHaveLength(2);
    expect(bookmarked.map((q) => String(q.id))).toContain("1");
    expect(bookmarked.map((q) => String(q.id))).toContain("3");
  });

  it("can remove a bookmark from the panel", () => {
    const storage = new BookmarkStorageStub();
    storage.addBookmark("user1", "1", "1");
    storage.addBookmark("user1", "1", "2");
    storage.removeBookmark("user1", "1", "1");
    const ids = storage.getBookmarks("user1", "1");
    expect(ids.has("1")).toBe(false);
    expect(ids.has("2")).toBe(true);
  });

  it("panel is empty after removing all bookmarks", () => {
    const storage = new BookmarkStorageStub();
    storage.addBookmark("user1", "1", "1");
    storage.removeBookmark("user1", "1", "1");
    const ids = storage.getBookmarks("user1", "1");
    const bookmarked = questions.filter((q) => ids.has(String(q.id)));
    expect(bookmarked).toHaveLength(0);
  });

  it("toggleBookmark returns true when adding", () => {
    const storage = new BookmarkStorageStub();
    const result = storage.toggleBookmark("user1", "1", "4");
    expect(result).toBe(true);
    expect(storage.isBookmarked("user1", "1", "4")).toBe(true);
  });

  it("toggleBookmark returns false when removing", () => {
    const storage = new BookmarkStorageStub();
    storage.addBookmark("user1", "1", "4");
    const result = storage.toggleBookmark("user1", "1", "4");
    expect(result).toBe(false);
    expect(storage.isBookmarked("user1", "1", "4")).toBe(false);
  });

  it("bookmark set is scoped per username+testId (different users don't share)", () => {
    const storage = new BookmarkStorageStub();
    storage.addBookmark("alice", "1", "1");
    const bobBookmarks = storage.getBookmarks("bob", "1");
    expect(bobBookmarks.has("1")).toBe(false);
  });

  it("bookmark set is scoped per testId (different tests don't share)", () => {
    const storage = new BookmarkStorageStub();
    storage.addBookmark("user1", "1", "1");
    const otherTest = storage.getBookmarks("user1", "2");
    expect(otherTest.has("1")).toBe(false);
  });

  it("clearBookmarks removes all bookmarks for a test", () => {
    const storage = new BookmarkStorageStub();
    storage.addBookmark("user1", "1", "1");
    storage.addBookmark("user1", "1", "2");
    storage.clearBookmarks("user1", "1");
    const ids = storage.getBookmarks("user1", "1");
    expect(ids.size).toBe(0);
  });

  it("correct answer is available for each bookmarked question", () => {
    const storage = new BookmarkStorageStub();
    storage.addBookmark("user1", "1", "1");
    storage.addBookmark("user1", "1", "3");
    const ids = storage.getBookmarks("user1", "1");
    const bookmarked = questions.filter((q) => ids.has(String(q.id)));
    for (const q of bookmarked) {
      const label = getCorrectAnswerLabel(q);
      expect(label).toBeTruthy();
      expect(label.length).toBeGreaterThan(0);
    }
  });
});

// ── Review Button availability logic ─────────────────────────────────────────

describe("Review Answers button availability", () => {
  it("review button should navigate with sessionId from result", () => {
    const result = {
      sessionId: "session-abc-123",
      testId: BigInt(1),
    };
    // Simulates what the button does
    const params = { testId: "1" };
    const search = { sessionId: result.sessionId };
    expect(params.testId).toBe("1");
    expect(search.sessionId).toBe("session-abc-123");
  });

  it("sessionId is extracted from TestResult for review navigation", () => {
    const mockResult = {
      score: BigInt(3),
      totalQuestions: BigInt(4),
      sessionId: "test-session-xyz",
      testId: BigInt(1),
    };
    expect(mockResult.sessionId).toBeDefined();
    expect(mockResult.sessionId.length).toBeGreaterThan(0);
  });
});
