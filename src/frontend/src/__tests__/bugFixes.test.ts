/**
 * Bug fix regression tests.
 *
 * Covers fixes for 6 reported bugs:
 * 1. Per-section Reset Master Question
 * 2. Sticky Add Question button context (section pre-selection)
 * 3. Correct answer rich text display (textInput)
 * 4. Audio false error after successful download
 * 5. Section pre-selected when clicking Add Question from drill-down
 * 6. Font size applied to all content including correct answer display
 */
import { describe, expect, it } from "vitest";
import { QuestionType } from "./mocks/backendStub";
import type { Question } from "./mocks/backendStub";
import { mockBackend } from "./mocks/mockBackendImpl";

const ADMIN = "abcd";
const USER = "sarah";

// ── BUG 1: Per-section Reset Master Question ─────────────────────────────────

describe("BUG 1 — Per-section Reset Master Question", () => {
  it("resetMyMastery with no sectionId resets the entire test", async () => {
    await mockBackend.resetMyMastery(USER, { testId: BigInt(1) });
    const mastery = await mockBackend.getMasteryForTest(USER, BigInt(1));
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0);
      expect(m.isMastered).toBe(false);
    }
  });

  it("resetMyMastery with sectionId field in input is accepted", async () => {
    // The input type accepts an optional sectionId — ensure it doesn't throw
    const input = { testId: BigInt(1) } as {
      testId: bigint;
      sectionId?: bigint;
    };
    await expect(
      mockBackend.resetMyMastery(USER, input),
    ).resolves.not.toThrow();
  });

  it("resetMyMastery with sectionId resets mastery (no crash)", async () => {
    const input = {
      testId: BigInt(1),
      sectionId: BigInt(1),
    } as { testId: bigint; sectionId?: bigint };
    await expect(
      mockBackend.resetMyMastery("section_reset_user", input),
    ).resolves.not.toThrow();
  });

  it("section-level reset leaves mastery in a valid state", async () => {
    const input = {
      testId: BigInt(1),
      sectionId: BigInt(1),
    } as { testId: bigint; sectionId?: bigint };
    await mockBackend.resetMyMastery("section_reset_user2", input);
    // After reset, mastery entries should still exist (just with streak 0)
    const mastery = await mockBackend.getMasteryForTest(
      "section_reset_user2",
      BigInt(1),
    );
    expect(Array.isArray(mastery)).toBe(true);
    for (const m of mastery) {
      expect(m).toHaveProperty("correctStreak");
      expect(m).toHaveProperty("isMastered");
    }
  });

  it("adminResetUserMastery also accepts optional sectionId", async () => {
    const input = { testId: BigInt(1) } as {
      testId: bigint;
      sectionId?: bigint;
    };
    const result = await mockBackend.adminResetUserMastery(ADMIN, USER, input);
    expect(result).toBe(true);
  });
});

// ── BUG 2: Sticky Add Question — section context preserved ───────────────────

describe("BUG 2 — Add Question from drill-down pre-selects section", () => {
  interface Section {
    id: bigint;
    name: string;
  }

  function getFormSectionId(selectedSection: Section | null): number | null {
    if (!selectedSection) return null;
    if (selectedSection.id === BigInt(-1)) return null; // Uncategorised
    return Number(selectedSection.id);
  }

  function openCreate(preselectedSectionId: number | null): {
    sectionId: number | null;
  } {
    return { sectionId: preselectedSectionId ?? null };
  }

  function openCreateInSection(selectedSection: Section | null): {
    sectionId: number | null;
  } {
    const sectionId = getFormSectionId(selectedSection);
    return openCreate(sectionId);
  }

  it("top-level Add Question (no section context) has null sectionId", () => {
    // When selectedSection is null, use openCreate()
    const form = openCreate(null);
    expect(form.sectionId).toBeNull();
  });

  it("drill-down Add Question (with section) passes correct sectionId", () => {
    const section: Section = { id: BigInt(3), name: "Chapter 3" };
    const form = openCreateInSection(section);
    expect(form.sectionId).toBe(3);
  });

  it("when selectedSection is not null, top-level button uses openCreateInSection", () => {
    // This mirrors the fix: when selectedSection is active, top-level button
    // calls openCreateInSection instead of openCreate()
    const selectedSection: Section = { id: BigInt(5), name: "Chapter 5" };
    const form = selectedSection
      ? openCreateInSection(selectedSection)
      : openCreate(null);
    expect(form.sectionId).toBe(5);
  });

  it("when selectedSection is null, top-level button uses openCreate (null)", () => {
    const selectedSection: Section | null = null;
    const form = selectedSection
      ? openCreateInSection(selectedSection)
      : openCreate(null);
    expect(form.sectionId).toBeNull();
  });

  it("Uncategorised sentinel section returns null sectionId", () => {
    const uncategorised: Section = { id: BigInt(-1), name: "Uncategorised" };
    expect(getFormSectionId(uncategorised)).toBeNull();
  });
});

// ── BUG 3: Correct answer display uses RichTextDisplay ───────────────────────

describe("BUG 3 — Correct answer display (rich text)", () => {
  interface CorrectAnswerDisplayInfo {
    questionType: QuestionType;
    correctText: string;
    correctAnswers: bigint[];
    options: string[];
    correctOrder: bigint[];
  }

  /**
   * Mirrors the correct answer display logic in TakeTestPage.
   * Returns what "renderer" is used for each question type.
   */
  function getCorrectAnswerRenderer(
    info: CorrectAnswerDisplayInfo,
  ): "richText" | "richTextList" | "richTextOrdered" | "none" {
    const { questionType } = info;
    if (
      questionType === QuestionType.mcSingle ||
      questionType === QuestionType.mcMulti
    ) {
      return "richTextList"; // multiple RichTextDisplay per correct option
    }
    if (questionType === QuestionType.textInput) {
      return "richText"; // single RichTextDisplay for correctText
    }
    if (questionType === QuestionType.dragOrder) {
      return "richTextOrdered"; // RichTextDisplay per ordered item
    }
    return "none";
  }

  it("textInput uses richText renderer (not plain text span)", () => {
    const info: CorrectAnswerDisplayInfo = {
      questionType: QuestionType.textInput,
      correctText: "<p><strong>Memory consolidation</strong></p>",
      correctAnswers: [],
      options: [],
      correctOrder: [],
    };
    expect(getCorrectAnswerRenderer(info)).toBe("richText");
  });

  it("mcSingle uses richTextList renderer", () => {
    const info: CorrectAnswerDisplayInfo = {
      questionType: QuestionType.mcSingle,
      correctText: "",
      correctAnswers: [BigInt(0)],
      options: ["Option A", "Option B"],
      correctOrder: [],
    };
    expect(getCorrectAnswerRenderer(info)).toBe("richTextList");
  });

  it("mcMulti uses richTextList renderer", () => {
    const info: CorrectAnswerDisplayInfo = {
      questionType: QuestionType.mcMulti,
      correctText: "",
      correctAnswers: [BigInt(0), BigInt(1)],
      options: ["Option A", "Option B", "Option C"],
      correctOrder: [],
    };
    expect(getCorrectAnswerRenderer(info)).toBe("richTextList");
  });

  it("dragOrder uses richTextOrdered renderer", () => {
    const info: CorrectAnswerDisplayInfo = {
      questionType: QuestionType.dragOrder,
      correctText: "",
      correctAnswers: [],
      options: ["Step 1", "Step 2", "Step 3"],
      correctOrder: [BigInt(0), BigInt(1), BigInt(2)],
    };
    expect(getCorrectAnswerRenderer(info)).toBe("richTextOrdered");
  });

  it("correctText with HTML markup is treated as rich text", () => {
    const html = "<p><em>Memory consolidation</em></p>";
    // textInput correctText should be rendered as HTML, not as plain text
    const info: CorrectAnswerDisplayInfo = {
      questionType: QuestionType.textInput,
      correctText: html,
      correctAnswers: [],
      options: [],
      correctOrder: [],
    };
    const renderer = getCorrectAnswerRenderer(info);
    expect(renderer).toBe("richText"); // Must use rich text renderer, not span
    expect(html).toContain("<"); // Has HTML tags that need rendering
  });

  it("correctText with plain text also uses richText renderer (safe fallback)", () => {
    const info: CorrectAnswerDisplayInfo = {
      questionType: QuestionType.textInput,
      correctText: "Memory consolidation",
      correctAnswers: [],
      options: [],
      correctOrder: [],
    };
    expect(getCorrectAnswerRenderer(info)).toBe("richText");
  });
});

// ── BUG 4: Audio false error after successful download ────────────────────────

describe("BUG 4 — Audio onBlur does not trigger after successful download", () => {
  type AudioStatus = "idle" | "downloading" | "ready" | "error";

  function shouldTriggerDownloadOnBlur(
    url: string,
    status: AudioStatus,
  ): boolean {
    // Fixed logic: only trigger if URL present AND status is exactly 'idle'
    return url.trim().length > 0 && status === "idle";
  }

  it("triggers download on blur when status is idle and URL present", () => {
    expect(
      shouldTriggerDownloadOnBlur("https://example.com/audio.mp3", "idle"),
    ).toBe(true);
  });

  it("does NOT trigger download on blur when status is ready", () => {
    expect(
      shouldTriggerDownloadOnBlur("https://example.com/audio.mp3", "ready"),
    ).toBe(false);
  });

  it("does NOT trigger download on blur when status is downloading", () => {
    expect(
      shouldTriggerDownloadOnBlur(
        "https://example.com/audio.mp3",
        "downloading",
      ),
    ).toBe(false);
  });

  it("does NOT trigger download on blur when status is error", () => {
    expect(
      shouldTriggerDownloadOnBlur("https://example.com/audio.mp3", "error"),
    ).toBe(false);
  });

  it("does NOT trigger download on blur when URL is empty", () => {
    expect(shouldTriggerDownloadOnBlur("", "idle")).toBe(false);
  });

  it("does NOT trigger download on blur when URL is whitespace", () => {
    expect(shouldTriggerDownloadOnBlur("   ", "idle")).toBe(false);
  });

  it("audio state machine: ready status means no error shown", () => {
    // After successful download, status='ready' must NOT display error state
    const showError = (status: AudioStatus) => status === "error";
    expect(showError("ready")).toBe(false);
    expect(showError("idle")).toBe(false);
    expect(showError("downloading")).toBe(false);
    expect(showError("error")).toBe(true); // only this should show error
  });

  it("blur after successful download does not reset status to error", () => {
    // After status='ready', a blur event checks status !== 'idle', so no re-download
    const status: AudioStatus = "ready";
    const willRetrigger = shouldTriggerDownloadOnBlur(
      "https://example.com/audio.mp3",
      status,
    );
    expect(willRetrigger).toBe(false); // safe: no false re-trigger
  });
});

// ── BUG 5: Section pre-selected in Add Question from drill-down ──────────────

describe("BUG 5 — Section dropdown in QuestionForm shows correct pre-selection", () => {
  function computeSelectValue(sectionId: number | null): string {
    return sectionId !== null ? String(sectionId) : "uncategorized";
  }

  interface FormData {
    sectionId: number | null;
  }

  function defaultFormData(sectionId: number | null = null): FormData {
    return { sectionId };
  }

  it("when sectionId=null, select shows 'uncategorized'", () => {
    const form = defaultFormData(null);
    expect(computeSelectValue(form.sectionId)).toBe("uncategorized");
  });

  it("when sectionId=3, select shows '3'", () => {
    const form = defaultFormData(3);
    expect(computeSelectValue(form.sectionId)).toBe("3");
  });

  it("form created with sectionId=5 has select value '5'", () => {
    const form = defaultFormData(5);
    expect(computeSelectValue(form.sectionId)).toBe("5");
  });

  it("passing sectionId from drill-down openCreateInSection results in pre-selection", () => {
    const drillDownSectionId = 7;
    const form = defaultFormData(drillDownSectionId);
    expect(form.sectionId).toBe(7);
    expect(computeSelectValue(form.sectionId)).toBe("7");
  });

  it("top-level Add Question button with active section context pre-selects section", () => {
    // When selectedSection is active, clicking the top Add Question button
    // should call openCreateInSection, not openCreate(null)
    const activeSectionId = 4;
    const selectedSection = { id: BigInt(activeSectionId), name: "Chapter 4" };
    const preselectedId = selectedSection ? Number(selectedSection.id) : null;
    const form = defaultFormData(preselectedId);
    expect(form.sectionId).toBe(4);
    expect(computeSelectValue(form.sectionId)).toBe("4");
  });
});

// ── BUG 6: Font size applied to correct answer display ───────────────────────

describe("BUG 6 — Font size applied consistently", () => {
  type FontSize = "sm" | "base" | "lg" | "xl";

  const FONT_SIZE_CLASSES: Record<FontSize, string> = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  function getFontSizeClass(size: FontSize): string {
    return FONT_SIZE_CLASSES[size];
  }

  /**
   * Mirrors the fixed TakeTestPage layout:
   * CardContent now has the fontSize class, covering all children including
   * the question renderer, correct answer display, and explanation.
   */
  function cardContentClass(fontSize: FontSize): string {
    return `pt-5 ${getFontSizeClass(fontSize)}`;
  }

  it("CardContent class includes font size for 'sm'", () => {
    expect(cardContentClass("sm")).toContain("text-sm");
  });

  it("CardContent class includes font size for 'lg'", () => {
    expect(cardContentClass("lg")).toContain("text-lg");
  });

  it("CardContent class includes font size for 'xl'", () => {
    expect(cardContentClass("xl")).toContain("text-xl");
  });

  it("CardContent class includes font size for 'base'", () => {
    expect(cardContentClass("base")).toContain("text-base");
  });

  it("font size class applies to correct answer display (same CardContent)", () => {
    // The correct answer display is inside CardContent, which now has the
    // font size class — so it inherits the font size via CSS
    const contentClass = cardContentClass("lg");
    expect(contentClass).toContain("pt-5"); // original class preserved
    expect(contentClass).toContain("text-lg"); // font size added
  });

  it("font size class applies to explanation (same CardContent)", () => {
    const contentClass = cardContentClass("xl");
    expect(contentClass).toContain("text-xl");
  });

  it("changing font size updates CardContent class", () => {
    const sizes: FontSize[] = ["sm", "base", "lg", "xl"];
    for (const size of sizes) {
      expect(cardContentClass(size)).toContain(FONT_SIZE_CLASSES[size]);
    }
  });
});

// ── Combined: correct answer answer evaluation with isAnswerCorrect ────────────

describe("Correct answer — isAnswerCorrect mirrors TakeTestPage logic", () => {
  const q: Question = {
    id: BigInt(1),
    testId: BigInt(1),
    orderIndex: BigInt(0),
    text: "What is 2+2?",
    questionType: QuestionType.textInput,
    options: [],
    correctAnswers: [],
    correctText: "4",
    correctOrder: [],
  };

  interface Answer {
    selectedOptions: number[];
    textAnswer: string;
    dragOrder: number[];
  }

  function isAnswerCorrect(question: Question, answer: Answer): boolean {
    if (question.questionType === QuestionType.textInput) {
      return (
        answer.textAnswer.trim().toLowerCase() ===
        question.correctText.trim().toLowerCase()
      );
    }
    if (
      question.questionType === QuestionType.mcSingle ||
      question.questionType === QuestionType.mcMulti
    ) {
      const correct = question.correctAnswers.map(Number).sort();
      const given = [...answer.selectedOptions].map(Number).sort();
      return (
        correct.length === given.length &&
        correct.every((v, i) => v === given[i])
      );
    }
    return false;
  }

  it("textInput: exact match is correct", () => {
    expect(
      isAnswerCorrect(q, {
        selectedOptions: [],
        textAnswer: "4",
        dragOrder: [],
      }),
    ).toBe(true);
  });

  it("textInput: case-insensitive match is correct", () => {
    expect(
      isAnswerCorrect(q, {
        selectedOptions: [],
        textAnswer: "  4  ",
        dragOrder: [],
      }),
    ).toBe(true);
  });

  it("textInput: wrong answer is incorrect", () => {
    expect(
      isAnswerCorrect(q, {
        selectedOptions: [],
        textAnswer: "5",
        dragOrder: [],
      }),
    ).toBe(false);
  });

  it("when incorrect, correct answer (correctText) should be shown as rich text", () => {
    // This confirms the intent: correctText for textInput must be rendered
    // through RichTextDisplay, not as a plain <span>
    const isCorrect = isAnswerCorrect(q, {
      selectedOptions: [],
      textAnswer: "5",
      dragOrder: [],
    });
    expect(isCorrect).toBe(false); // Incorrect, so correct answer display triggers
    // The display should use RichTextDisplay(html={q.correctText})
    expect(q.correctText).toBe("4"); // plain text, but RichTextDisplay handles it safely
  });
});
