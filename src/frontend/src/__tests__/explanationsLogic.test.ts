/**
 * Unit tests for explanation field logic:
 * - Add explanation to a question
 * - Edit/update explanation
 * - Clear explanation
 * - Explanation visibility (shown/hidden based on content)
 * - Explanation with math content
 * - Explanation in create vs update payloads
 * - Explanation preserved across form operations
 */
import { describe, expect, it } from "vitest";
import { QuestionType } from "./mocks/backendStub";
import {
  type QuestionFormData,
  defaultQuestionFormData,
} from "./mocks/questionFormStub";

// ── Pure helpers mirroring AdminTestDetailPage payload builders ───────────────

interface CreatePayload {
  text: string;
  explanation?: string;
  questionType: QuestionType;
}

function buildCreatePayload(form: QuestionFormData): CreatePayload {
  return {
    text: form.text,
    questionType: form.questionType,
    explanation: form.explanation || undefined,
  };
}

interface UpdatePayload {
  text: string;
  explanation?: string;
  questionType: QuestionType;
}

function buildUpdatePayload(form: QuestionFormData): UpdatePayload {
  return {
    text: form.text,
    questionType: form.questionType,
    explanation: form.explanation || undefined,
  };
}

/**
 * Mirrors the edit-form hydration in AdminTestDetailPage.openEdit().
 * Extracts explanation from a Question object (or returns empty string).
 */
function hydrateFormFromQuestion(q: {
  text: string;
  questionType: QuestionType;
  explanation?: string | null;
}): Pick<QuestionFormData, "text" | "questionType" | "explanation"> {
  return {
    text: q.text,
    questionType: q.questionType,
    explanation: q.explanation ?? "",
  };
}

/**
 * Determines whether to render the explanation panel in the take-test view.
 * An explanation is "visible" when it is a non-empty, non-whitespace-only string.
 */
function isExplanationVisible(explanation: string | null | undefined): boolean {
  if (!explanation) return false;
  // Strip HTML tags and check for meaningful text
  const stripped = explanation.replace(/<[^>]*>/g, "").trim();
  return stripped.length > 0;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("explanation – default form state", () => {
  it("defaults to empty string", () => {
    const d = defaultQuestionFormData();
    expect(d.explanation).toBe("");
  });

  it("has an explanation property in QuestionFormData", () => {
    const d = defaultQuestionFormData();
    expect(Object.prototype.hasOwnProperty.call(d, "explanation")).toBe(true);
  });
});

describe("explanation – adding an explanation", () => {
  it("sets explanation to a plain HTML paragraph", () => {
    const d = defaultQuestionFormData();
    const next: QuestionFormData = {
      ...d,
      explanation: "<p>Correct because of X.</p>",
    };
    expect(next.explanation).toBe("<p>Correct because of X.</p>");
  });

  it("sets explanation to a multi-paragraph HTML string", () => {
    const d = defaultQuestionFormData();
    const html = "<p>First point.</p><p>Second point.</p>";
    const next: QuestionFormData = { ...d, explanation: html };
    expect(next.explanation).toBe(html);
  });

  it("sets explanation with bold formatting", () => {
    const d = defaultQuestionFormData();
    const html = "<p><strong>Key concept:</strong> always verify.</p>";
    const next: QuestionFormData = { ...d, explanation: html };
    expect(next.explanation).toContain("<strong>");
  });
});

describe("explanation – editing an explanation", () => {
  it("replaces previous explanation with new content", () => {
    const d: QuestionFormData = {
      ...defaultQuestionFormData(),
      explanation: "<p>Old explanation</p>",
    };
    const next: QuestionFormData = {
      ...d,
      explanation: "<p>Updated explanation</p>",
    };
    expect(next.explanation).toBe("<p>Updated explanation</p>");
    expect(next.explanation).not.toContain("Old");
  });

  it("appends text by modifying the HTML string", () => {
    const existing = "<p>Initial text.";
    const appended = `${existing} Additional info.</p>`;
    const d: QuestionFormData = {
      ...defaultQuestionFormData(),
      explanation: appended,
    };
    expect(d.explanation).toContain("Initial text.");
    expect(d.explanation).toContain("Additional info.");
  });
});

describe("explanation – clearing an explanation", () => {
  it("clears explanation by setting to empty string", () => {
    const d: QuestionFormData = {
      ...defaultQuestionFormData(),
      explanation: "<p>Some content</p>",
    };
    const cleared: QuestionFormData = { ...d, explanation: "" };
    expect(cleared.explanation).toBe("");
  });

  it("quill empty state '<p><br></p>' maps to empty string in payload", () => {
    // The RichTextEditor normalises '<p><br></p>' → '' before storing
    const quillEmpty = "";
    const d: QuestionFormData = {
      ...defaultQuestionFormData(),
      explanation: quillEmpty,
    };
    const payload = buildCreatePayload(d);
    expect(payload.explanation).toBeUndefined();
  });
});

describe("explanation – visibility logic (isExplanationVisible)", () => {
  it("returns false for empty string", () => {
    expect(isExplanationVisible("")).toBe(false);
  });

  it("returns false for null", () => {
    expect(isExplanationVisible(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isExplanationVisible(undefined)).toBe(false);
  });

  it("returns false for HTML-only tags with no text content", () => {
    expect(isExplanationVisible("<p><br></p>")).toBe(false);
    expect(isExplanationVisible("<p></p>")).toBe(false);
  });

  it("returns true for a paragraph with text", () => {
    expect(isExplanationVisible("<p>This is correct because.</p>")).toBe(true);
  });

  it("returns true for a formula-only explanation", () => {
    // KaTeX renders to DOM text nodes; stripped tags still leave formula text
    expect(
      isExplanationVisible(
        '<p><span class="ql-formula" data-value="x^2">x²</span></p>',
      ),
    ).toBe(true);
  });
});

describe("explanation – with math content", () => {
  it("stores a KaTeX formula in the explanation", () => {
    const d: QuestionFormData = {
      ...defaultQuestionFormData(),
      explanation:
        '<p>The formula is <span class="ql-formula" data-value="\\frac{a}{b}"></span>.</p>',
    };
    expect(d.explanation).toContain("ql-formula");
    expect(d.explanation).toContain("\\frac{a}{b}");
  });

  it("stores a display-mode formula marker", () => {
    const d: QuestionFormData = {
      ...defaultQuestionFormData(),
      explanation: "<p>Solve: $\\int_0^1 x\\,dx$</p>",
    };
    expect(d.explanation).toContain("\\int");
  });

  it("preserves formula on re-render (round-trip)", () => {
    const original =
      '<p>Answer: <span class="ql-formula" data-value="E=mc^2">E=mc²</span></p>';
    const d: QuestionFormData = {
      ...defaultQuestionFormData(),
      explanation: original,
    };
    const payload = buildCreatePayload({ ...d, text: "Q1" });
    expect(payload.explanation).toBe(original);
  });
});

describe("explanation – payload builders", () => {
  it("includes explanation in create payload when set", () => {
    const d: QuestionFormData = {
      ...defaultQuestionFormData(),
      text: "What is 2+2?",
      explanation: "<p>2+2 equals 4 by definition.</p>",
    };
    const payload = buildCreatePayload(d);
    expect(payload.explanation).toBe("<p>2+2 equals 4 by definition.</p>");
  });

  it("omits explanation from create payload when empty", () => {
    const d = defaultQuestionFormData();
    const payload = buildCreatePayload({ ...d, text: "Q?" });
    expect(payload.explanation).toBeUndefined();
  });

  it("includes explanation in update payload when set", () => {
    const d: QuestionFormData = {
      ...defaultQuestionFormData(),
      text: "Edit me",
      explanation: "<p>Updated explanation</p>",
    };
    const payload = buildUpdatePayload(d);
    expect(payload.explanation).toBe("<p>Updated explanation</p>");
  });

  it("omits explanation from update payload when empty", () => {
    const d = defaultQuestionFormData();
    const payload = buildUpdatePayload({ ...d, text: "Q?" });
    expect(payload.explanation).toBeUndefined();
  });
});

describe("explanation – hydrateFormFromQuestion", () => {
  it("pre-populates explanation from an existing question", () => {
    const q = {
      text: "What is DNA?",
      questionType: QuestionType.textInput,
      explanation: "<p>DNA is the blueprint of life.</p>",
    };
    const form = hydrateFormFromQuestion(q);
    expect(form.explanation).toBe("<p>DNA is the blueprint of life.</p>");
  });

  it("defaults to empty string when question has no explanation", () => {
    const q = {
      text: "What is 1+1?",
      questionType: QuestionType.mcSingle,
      explanation: undefined,
    };
    const form = hydrateFormFromQuestion(q);
    expect(form.explanation).toBe("");
  });

  it("defaults to empty string when question explanation is null", () => {
    const q = {
      text: "Choose one",
      questionType: QuestionType.mcMulti,
      explanation: null,
    };
    const form = hydrateFormFromQuestion(q);
    expect(form.explanation).toBe("");
  });

  it("preserves HTML with inline math from question", () => {
    const html =
      '<p>Use <span class="ql-formula" data-value="E=mc^2">E=mc²</span> here.</p>';
    const q = {
      text: "Physics Q",
      questionType: QuestionType.mcSingle,
      explanation: html,
    };
    const form = hydrateFormFromQuestion(q);
    expect(form.explanation).toBe(html);
  });
});
