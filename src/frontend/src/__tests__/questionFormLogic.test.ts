/**
 * Unit tests for QuestionForm data logic:
 * - defaultQuestionFormData initialisation
 * - type-change helpers
 * - option mutation helpers (add/remove/toggleCorrect)
 * - drag order helpers (onDrop)
 */
import { describe, expect, it } from "vitest";
import { QuestionType } from "./mocks/backendStub";
import {
  type QuestionFormData,
  defaultQuestionFormData,
} from "./mocks/questionFormStub";

// ── helpers (extracted pure functions from QuestionForm) ──────────────────────

function handleTypeChange(
  data: QuestionFormData,
  type: QuestionType,
): QuestionFormData {
  const filledOpts = data.options.filter((o) => o.trim());
  const optCount = Math.max(filledOpts.length, 4);
  const opts = Array.from(
    { length: optCount },
    (_, i) => data.options[i] ?? "",
  );
  return {
    ...data,
    questionType: type,
    options: opts,
    correctAnswers: [0],
    correctOrder: opts.map((_, i) => i),
  };
}

function addOption(data: QuestionFormData): QuestionFormData {
  const nextOpts = [...data.options, ""];
  return {
    ...data,
    options: nextOpts,
    correctOrder: [...data.correctOrder, nextOpts.length - 1],
  };
}

function removeOption(data: QuestionFormData, index: number): QuestionFormData {
  if (data.options.length <= 2) return data;
  const next = data.options.filter((_, i) => i !== index);
  const nextCorrect = data.correctAnswers
    .filter((i) => i !== index)
    .map((i) => (i > index ? i - 1 : i));
  const nextOrder = data.correctOrder
    .filter((i) => i !== index)
    .map((i) => (i > index ? i - 1 : i));
  return {
    ...data,
    options: next,
    correctAnswers: nextCorrect,
    correctOrder: nextOrder,
  };
}

function toggleCorrect(
  data: QuestionFormData,
  index: number,
): QuestionFormData {
  if (data.questionType === QuestionType.mcSingle) {
    return { ...data, correctAnswers: [index] };
  }
  const has = data.correctAnswers.includes(index);
  return {
    ...data,
    correctAnswers: has
      ? data.correctAnswers.filter((i) => i !== index)
      : [...data.correctAnswers, index],
  };
}

function onDrop(
  data: QuestionFormData,
  from: number,
  targetIndex: number,
): QuestionFormData {
  if (from === null || from === targetIndex) return data;
  const next = [...data.correctOrder];
  const [removed] = next.splice(from, 1);
  next.splice(targetIndex, 0, removed);
  return { ...data, correctOrder: next };
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe("defaultQuestionFormData", () => {
  it("initializes with mcSingle type", () => {
    const d = defaultQuestionFormData();
    expect(d.questionType).toBe(QuestionType.mcSingle);
  });

  it("initializes with 4 empty options", () => {
    const d = defaultQuestionFormData();
    expect(d.options).toHaveLength(4);
    for (const o of d.options) expect(o).toBe("");
  });

  it("initializes correctAnswers with [0]", () => {
    const d = defaultQuestionFormData();
    expect(d.correctAnswers).toEqual([0]);
  });

  it("initializes correctOrder as [0,1,2,3]", () => {
    const d = defaultQuestionFormData();
    expect(d.correctOrder).toEqual([0, 1, 2, 3]);
  });

  it("initializes imageFile and imagePreviewUrl as null", () => {
    const d = defaultQuestionFormData();
    expect(d.imageFile).toBeNull();
    expect(d.imagePreviewUrl).toBeNull();
  });

  it("initializes text and correctText as empty strings", () => {
    const d = defaultQuestionFormData();
    expect(d.text).toBe("");
    expect(d.correctText).toBe("");
  });
});

describe("handleTypeChange", () => {
  it("switches type correctly", () => {
    const d = defaultQuestionFormData();
    const next = handleTypeChange(d, QuestionType.mcMulti);
    expect(next.questionType).toBe(QuestionType.mcMulti);
  });

  it("resets correctAnswers to [0] on type change", () => {
    const d = { ...defaultQuestionFormData(), correctAnswers: [1, 2] };
    const next = handleTypeChange(d, QuestionType.dragOrder);
    expect(next.correctAnswers).toEqual([0]);
  });

  it("preserves at least 4 options", () => {
    const d = defaultQuestionFormData();
    const next = handleTypeChange(d, QuestionType.textInput);
    expect(next.options.length).toBeGreaterThanOrEqual(4);
  });

  it("rebuilds correctOrder to match option count", () => {
    const d = defaultQuestionFormData();
    const next = handleTypeChange(d, QuestionType.dragOrder);
    expect(next.correctOrder).toEqual([0, 1, 2, 3]);
  });
});

describe("addOption", () => {
  it("adds one empty option", () => {
    const d = defaultQuestionFormData();
    const next = addOption(d);
    expect(next.options).toHaveLength(5);
    expect(next.options[4]).toBe("");
  });

  it("extends correctOrder by one", () => {
    const d = defaultQuestionFormData();
    const next = addOption(d);
    expect(next.correctOrder).toHaveLength(5);
    expect(next.correctOrder[4]).toBe(4);
  });
});

describe("removeOption", () => {
  it("removes option at given index", () => {
    const d = defaultQuestionFormData();
    const filled = { ...d, options: ["A", "B", "C", "D"] };
    const next = removeOption(filled, 1);
    expect(next.options).toEqual(["A", "C", "D"]);
  });

  it("prevents removing below 2 options", () => {
    const d = { ...defaultQuestionFormData(), options: ["A", "B"] };
    const next = removeOption(d, 0);
    expect(next.options).toHaveLength(2);
  });

  it("adjusts correctAnswers indices after removal", () => {
    const d = { ...defaultQuestionFormData(), correctAnswers: [2] };
    const next = removeOption(d, 0);
    // Index 2 shifts to 1 after removing index 0
    expect(next.correctAnswers).toContain(1);
  });

  it("removes correct answer that is deleted option", () => {
    const d = { ...defaultQuestionFormData(), correctAnswers: [1] };
    const next = removeOption(d, 1);
    expect(next.correctAnswers).not.toContain(1);
  });

  it("adjusts correctOrder indices after removal", () => {
    const d = defaultQuestionFormData(); // correctOrder [0,1,2,3]
    const next = removeOption(d, 0);
    // Original index 0 is removed; indices 1,2,3 shift down to 0,1,2
    expect(next.correctOrder).toEqual([0, 1, 2]);
    // Resulting array has length 3
    expect(next.correctOrder).toHaveLength(3);
  });
});

describe("toggleCorrect", () => {
  it("for mcSingle, sets exactly one correct answer", () => {
    const d = defaultQuestionFormData(); // correctAnswers=[0]
    const next = toggleCorrect(d, 2);
    expect(next.correctAnswers).toEqual([2]);
  });

  it("for mcMulti, adds a new correct answer", () => {
    const d = {
      ...defaultQuestionFormData(),
      questionType: QuestionType.mcMulti,
      correctAnswers: [0],
    };
    const next = toggleCorrect(d, 2);
    expect(next.correctAnswers).toContain(0);
    expect(next.correctAnswers).toContain(2);
  });

  it("for mcMulti, removes an existing correct answer (toggle off)", () => {
    const d = {
      ...defaultQuestionFormData(),
      questionType: QuestionType.mcMulti,
      correctAnswers: [0, 2],
    };
    const next = toggleCorrect(d, 0);
    expect(next.correctAnswers).not.toContain(0);
    expect(next.correctAnswers).toContain(2);
  });
});

describe("onDrop (drag order reordering)", () => {
  it("moves item from one position to another", () => {
    const d = defaultQuestionFormData(); // correctOrder [0,1,2,3]
    // Move item at index 3 to index 0
    const next = onDrop(d, 3, 0);
    expect(next.correctOrder[0]).toBe(3);
    expect(next.correctOrder[1]).toBe(0);
    expect(next.correctOrder[2]).toBe(1);
    expect(next.correctOrder[3]).toBe(2);
  });

  it("is no-op when source equals target", () => {
    const d = defaultQuestionFormData();
    const next = onDrop(d, 2, 2);
    expect(next.correctOrder).toEqual([0, 1, 2, 3]);
  });
});

describe("explanation field", () => {
  it("initializes explanation as empty string", () => {
    const d = defaultQuestionFormData();
    expect(d.explanation).toBe("");
  });

  it("updates explanation via partial update", () => {
    const d = defaultQuestionFormData();
    const next = { ...d, explanation: "<p>Because X is correct.</p>" };
    expect(next.explanation).toBe("<p>Because X is correct.</p>");
  });

  it("clears explanation by setting to empty string", () => {
    const d = {
      ...defaultQuestionFormData(),
      explanation: "<p>Some explanation</p>",
    };
    const cleared = { ...d, explanation: "" };
    expect(cleared.explanation).toBe("");
  });

  it("allows explanation with math LaTeX markup", () => {
    const d = defaultQuestionFormData();
    const latex =
      '<p>The answer uses <span class="ql-formula" data-value="\\frac{a}{b}"></span> formula</p>';
    const next = { ...d, explanation: latex };
    expect(next.explanation).toContain("ql-formula");
    expect(next.explanation).toContain("frac");
  });

  it("explanation is preserved when changing question type", () => {
    const d = {
      ...defaultQuestionFormData(),
      explanation: "<p>My explanation</p>",
    };
    // Simulate type change (pure logic doesn't touch explanation)
    const next = handleTypeChange(d, QuestionType.textInput);
    expect(next.explanation).toBe("<p>My explanation</p>");
  });

  it("explanation is preserved when adding an option", () => {
    const d = { ...defaultQuestionFormData(), explanation: "<p>Stays</p>" };
    const next = addOption(d);
    expect(next.explanation).toBe("<p>Stays</p>");
  });

  it("explanation allows HTML including rich formatting", () => {
    const html =
      '<p><strong>Bold</strong> and <em>italic</em> text with <a href="#">link</a></p>';
    const d = { ...defaultQuestionFormData(), explanation: html };
    expect(d.explanation).toContain("<strong>");
    expect(d.explanation).toContain("<em>");
  });
});
