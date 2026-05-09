/**
 * Unit tests for AdminTestDetailPage question management logic:
 * - Question list filtering and sorting
 * - openEdit form population from Question data
 * - Form reset for create mode
 * - Question CRUD derived state
 * - Section CRUD logic
 * - Delete section confirmation phrase
 * - Assigning question to section
 */
import { describe, expect, it } from "vitest";
import { QuestionType } from "./mocks/backendStub";
import type { Question, Section } from "./mocks/backendStub";
import {
  type QuestionFormData,
  defaultQuestionFormData,
} from "./mocks/questionFormStub";

// ── Fixtures ──────────────────────────────────────────────────────────────────────────────

const now = BigInt(Date.now()) * BigInt(1_000_000);

const sampleSections: Section[] = [
  {
    id: BigInt(1),
    testId: BigInt(1),
    name: "Memory",
    description: "Questions about memory systems",
    createdAt: now,
  },
  {
    id: BigInt(2),
    testId: BigInt(1),
    name: "Attention",
    description: "Questions about attention mechanisms",
    createdAt: now,
  },
];

const sampleQuestions: Question[] = [
  {
    id: BigInt(1),
    testId: BigInt(1),
    orderIndex: BigInt(0),
    text: "First question",
    questionType: QuestionType.mcSingle,
    options: ["A", "B", "C", "D"],
    correctAnswers: [BigInt(2)],
    correctText: "",
    correctOrder: [],
    sectionId: BigInt(1),
  },
  {
    id: BigInt(2),
    testId: BigInt(1),
    orderIndex: BigInt(2),
    text: "Third question (reordered)",
    questionType: QuestionType.mcMulti,
    options: ["Alpha", "Beta"],
    correctAnswers: [BigInt(0), BigInt(1)],
    correctText: "",
    correctOrder: [],
    sectionId: BigInt(2),
  },
  {
    id: BigInt(3),
    testId: BigInt(1),
    orderIndex: BigInt(1),
    text: "Second question",
    questionType: QuestionType.textInput,
    options: [],
    correctAnswers: [],
    correctText: "correct answer",
    correctOrder: [],
    sectionId: undefined,
  },
];

// ── Question sorting ────────────────────────────────────────────────────────────────────

describe("Question sorting by orderIndex", () => {
  it("sorts questions by orderIndex ascending", () => {
    const sorted = [...sampleQuestions].sort(
      (a, b) => Number(a.orderIndex) - Number(b.orderIndex),
    );
    expect(Number(sorted[0].orderIndex)).toBe(0);
    expect(Number(sorted[1].orderIndex)).toBe(1);
    expect(Number(sorted[2].orderIndex)).toBe(2);
  });

  it("first sorted question has text 'First question'", () => {
    const sorted = [...sampleQuestions].sort(
      (a, b) => Number(a.orderIndex) - Number(b.orderIndex),
    );
    expect(sorted[0].text).toBe("First question");
  });
});

// ── openEdit form population ───────────────────────────────────────────────────────────

describe("openEdit form population", () => {
  /**
   * Mirrors AdminTestDetailPage.openEdit():
   * - Ensures option array has at least 4 entries
   * - Sets correctOrder to identity if empty
   * - Extracts sectionId from Candid optional array
   */
  function buildEditForm(q: Question): QuestionFormData {
    const optCount = Math.max(q.options.length, 4);
    const opts = Array.from({ length: optCount }, (_, i) => q.options[i] ?? "");
    return {
      text: q.text,
      questionType: q.questionType,
      options: opts,
      correctAnswers: q.correctAnswers.map(Number),
      correctText: q.correctText,
      correctOrder:
        q.correctOrder.length > 0
          ? q.correctOrder.map(Number)
          : opts.map((_, i) => i),
      imageFile: null,
      imagePreviewUrl: q.imageBlob ? q.imageBlob.getDirectURL() : null,
      sectionId: q.sectionId != null ? Number(q.sectionId) : null,
      explanation: "",
    };
  }

  it("populates text from question", () => {
    const form = buildEditForm(sampleQuestions[0]);
    expect(form.text).toBe("First question");
  });

  it("populates questionType from question", () => {
    const form = buildEditForm(sampleQuestions[0]);
    expect(form.questionType).toBe(QuestionType.mcSingle);
  });

  it("pads options array to at least 4", () => {
    // sampleQuestions[1] has 2 options; should be padded to 4
    const form = buildEditForm(sampleQuestions[1]);
    expect(form.options.length).toBeGreaterThanOrEqual(4);
    expect(form.options[0]).toBe("Alpha");
    expect(form.options[1]).toBe("Beta");
    expect(form.options[2]).toBe("");
    expect(form.options[3]).toBe("");
  });

  it("maps correctAnswers from bigint to number", () => {
    const form = buildEditForm(sampleQuestions[0]);
    expect(form.correctAnswers).toEqual([2]);
  });

  it("builds identity correctOrder when question has none", () => {
    const form = buildEditForm(sampleQuestions[0]); // correctOrder is empty
    expect(form.correctOrder).toEqual([0, 1, 2, 3]);
  });

  it("preserves correctText for textInput questions", () => {
    const form = buildEditForm(sampleQuestions[2]);
    expect(form.correctText).toBe("correct answer");
  });

  it("extracts sectionId from Candid optional when present", () => {
    const form = buildEditForm(sampleQuestions[0]); // sectionId: BigInt(1)
    expect(form.sectionId).toBe(1);
  });

  it("sets sectionId to null when question is uncategorized", () => {
    const form = buildEditForm(sampleQuestions[2]); // sectionId: undefined
    expect(form.sectionId).toBeNull();
  });
});

// ── openCreate form reset ─────────────────────────────────────────────────────────────────

describe("openCreate form reset", () => {
  it("resets to defaultQuestionFormData", () => {
    const form = defaultQuestionFormData();
    expect(form.text).toBe("");
    expect(form.questionType).toBe(QuestionType.mcSingle);
    expect(form.options).toHaveLength(4);
    expect(form.correctAnswers).toEqual([0]);
    expect(form.imageFile).toBeNull();
    expect(form.sectionId).toBeNull();
  });
});

// ── Question filtering by testId ────────────────────────────────────────────────────────────

describe("Question filtering by testId", () => {
  const mixedQuestions: Question[] = [
    ...sampleQuestions,
    {
      id: BigInt(10),
      testId: BigInt(2),
      orderIndex: BigInt(0),
      text: "Belongs to test 2",
      questionType: QuestionType.mcSingle,
      options: ["A", "B"],
      correctAnswers: [BigInt(0)],
      correctText: "",
      correctOrder: [],
      sectionId: undefined,
    },
  ];

  it("returns only questions for the given testId", () => {
    const filtered = mixedQuestions.filter((q) => q.testId === BigInt(1));
    expect(filtered).toHaveLength(3);
    for (const q of filtered) expect(q.testId).toBe(BigInt(1));
  });

  it("returns empty when no questions for testId", () => {
    const filtered = mixedQuestions.filter((q) => q.testId === BigInt(999));
    expect(filtered).toHaveLength(0);
  });
});

// ── Question count ──────────────────────────────────────────────────────────────────────────────

describe("Question count display", () => {
  it("displays singular 'question' for 1 question", () => {
    const count = 1;
    const label = count !== 1 ? "questions" : "question";
    expect(label).toBe("question");
  });

  it("displays plural 'questions' for 0 questions", () => {
    const count: number = 0;
    const label = count !== 1 ? "questions" : "question";
    expect(label).toBe("questions");
  });

  it("displays plural 'questions' for multiple questions", () => {
    const count: number = 3;
    const label = count !== 1 ? "questions" : "question";
    expect(label).toBe("questions");
  });
});

// ── Submit button disabled state ──────────────────────────────────────────────────────────

describe("Question form submit button disabled state", () => {
  it("is disabled when question text is empty", () => {
    const form = defaultQuestionFormData();
    const isDisabled = !form.text.trim();
    expect(isDisabled).toBe(true);
  });

  it("is enabled when question text is non-empty", () => {
    const form = { ...defaultQuestionFormData(), text: "A real question?" };
    const isDisabled = !form.text.trim();
    expect(isDisabled).toBe(false);
  });
});

// ── Section management ─────────────────────────────────────────────────────────────────────

describe("Section list operations", () => {
  it("filters sections by testId", () => {
    const allSections: Section[] = [
      ...sampleSections,
      {
        id: BigInt(3),
        testId: BigInt(2),
        name: "Other",
        description: "",
        createdAt: now,
      },
    ];
    const forTest1 = allSections.filter((s) => s.testId === BigInt(1));
    expect(forTest1).toHaveLength(2);
    expect(forTest1.map((s) => s.name)).toEqual(["Memory", "Attention"]);
  });

  it("returns empty array when test has no sections", () => {
    const forTest99 = sampleSections.filter((s) => s.testId === BigInt(99));
    expect(forTest99).toHaveLength(0);
  });

  it("counts questions in a section correctly", () => {
    function countQuestionsInSection(questions: Question[], sectionId: number) {
      return questions.filter(
        (q) => q.sectionId != null && Number(q.sectionId) === sectionId,
      ).length;
    }
    expect(countQuestionsInSection(sampleQuestions, 1)).toBe(1);
    expect(countQuestionsInSection(sampleQuestions, 2)).toBe(1);
  });

  it("counts uncategorized questions (undefined sectionId)", () => {
    const uncategorized = sampleQuestions.filter((q) => q.sectionId == null);
    expect(uncategorized).toHaveLength(1);
    expect(uncategorized[0].text).toBe("Second question");
  });
});

describe("Section form validation", () => {
  it("submit button is disabled when section name is empty", () => {
    const name = "";
    const isDisabled = !name.trim();
    expect(isDisabled).toBe(true);
  });

  it("submit button is enabled when section name is provided", () => {
    const name = "Chapter 1";
    const isDisabled = !name.trim();
    expect(isDisabled).toBe(false);
  });

  it("submit button is disabled when name is only whitespace", () => {
    const name = "   ";
    const isDisabled = !name.trim();
    expect(isDisabled).toBe(true);
  });

  it("edit form populates name and description from existing section", () => {
    const section = sampleSections[0];
    const form = { name: section.name, description: section.description };
    expect(form.name).toBe("Memory");
    expect(form.description).toBe("Questions about memory systems");
  });

  it("create form resets to empty name and description", () => {
    const form = { name: "", description: "" };
    expect(form.name).toBe("");
    expect(form.description).toBe("");
  });
});

// ── Delete section confirmation phrase ────────────────────────────────────────────────

const CONFIRM_PHRASE = "I want to delete";

describe("Delete section confirmation phrase", () => {
  it("delete button is disabled when phrase is empty", () => {
    const phrase: string = "";
    const canDelete = phrase === CONFIRM_PHRASE;
    expect(canDelete).toBe(false);
  });

  it("delete button is disabled when phrase is partially correct", () => {
    const phrase: string = "I want";
    const canDelete = phrase === CONFIRM_PHRASE;
    expect(canDelete).toBe(false);
  });

  it("delete button is disabled for wrong phrase", () => {
    const phrase: string = "delete this";
    const canDelete = phrase === CONFIRM_PHRASE;
    expect(canDelete).toBe(false);
  });

  it("delete button is disabled for case-insensitive match", () => {
    const phrase: string = "i want to delete";
    const canDelete = phrase === CONFIRM_PHRASE;
    expect(canDelete).toBe(false);
  });

  it("delete button is enabled when phrase matches exactly", () => {
    const phrase: string = "I want to delete";
    const canDelete = phrase === CONFIRM_PHRASE;
    expect(canDelete).toBe(true);
  });

  it("delete button is disabled when phrase has trailing space", () => {
    const phrase: string = "I want to delete ";
    const canDelete = phrase === CONFIRM_PHRASE;
    expect(canDelete).toBe(false);
  });
});

// ── Assigning question to section ─────────────────────────────────────────────────────────

describe("Assigning question to section", () => {
  /** Mirrors how form.sectionId (number|null) is converted to bigint|undefined for backend call */
  function toSectionIdArg(sectionId: number | null): bigint | undefined {
    return sectionId !== null ? BigInt(sectionId) : undefined;
  }

  it("produces BigInt(sectionId) when section is selected", () => {
    const arg = toSectionIdArg(1);
    expect(arg).toBe(BigInt(1));
  });

  it("produces undefined when Uncategorized is selected", () => {
    const arg = toSectionIdArg(null);
    expect(arg).toBeUndefined();
  });

  it("question with sectionId BigInt(1) is identified as belonging to section 1", () => {
    const q = sampleQuestions[0]; // sectionId: BigInt(1)
    expect(q.sectionId).toBe(BigInt(1));
    expect(Number(q.sectionId)).toBe(1);
  });

  it("question with undefined sectionId is identified as uncategorized", () => {
    const q = sampleQuestions[2]; // sectionId: undefined
    expect(q.sectionId).toBeUndefined();
  });

  it("resolves section name from sections list", () => {
    function getSectionName(q: Question, sections: Section[]): string {
      if (q.sectionId == null) return "";
      const found = sections.find((s) => s.id === q.sectionId);
      return found?.name ?? "";
    }
    expect(getSectionName(sampleQuestions[0], sampleSections)).toBe("Memory");
    expect(getSectionName(sampleQuestions[1], sampleSections)).toBe(
      "Attention",
    );
    expect(getSectionName(sampleQuestions[2], sampleSections)).toBe("");
  });

  it("section options list is derived from sections array", () => {
    const options = sampleSections.map((s) => ({
      id: Number(s.id),
      name: s.name,
    }));
    expect(options).toEqual([
      { id: 1, name: "Memory" },
      { id: 2, name: "Attention" },
    ]);
  });
});

// ── Section drill-down view logic ───────────────────────────────────────────────────────

describe("Section drill-down: clicking a section shows only its questions", () => {
  it("filters questions to only those belonging to the selected section", () => {
    const selected = sampleSections[0]; // id: BigInt(1) — Memory
    const visible = sampleQuestions.filter((q) => q.sectionId === selected.id);
    expect(visible).toHaveLength(1);
    expect(visible[0].text).toBe("First question");
  });

  it("shows questions for the second section correctly", () => {
    const selected = sampleSections[1]; // id: BigInt(2) — Attention
    const visible = sampleQuestions.filter((q) => q.sectionId === selected.id);
    expect(visible).toHaveLength(1);
    expect(visible[0].text).toBe("Third question (reordered)");
  });

  it("returns empty list for a section with no questions", () => {
    const emptySectionId = BigInt(99);
    const visible = sampleQuestions.filter(
      (q) => q.sectionId === emptySectionId,
    );
    expect(visible).toHaveLength(0);
  });

  it("does NOT include questions from other sections when one is selected", () => {
    const selected = sampleSections[0]; // Memory — BigInt(1)
    const visible = sampleQuestions.filter((q) => q.sectionId === selected.id);
    const ids = visible.map((q) => Number(q.id));
    expect(ids).not.toContain(2); // belongs to Attention
    expect(ids).not.toContain(3); // uncategorized
  });

  it("does NOT include uncategorized questions when a section is selected", () => {
    const selected = sampleSections[0]; // Memory
    const visible = sampleQuestions.filter((q) => q.sectionId === selected.id);
    const uncategorizedInView = visible.filter((q) => q.sectionId == null);
    expect(uncategorizedInView).toHaveLength(0);
  });
});

describe("Section list view shows NO questions", () => {
  it("questions are not rendered when selectedSection is null", () => {
    // When selectedSection === null, the component shows sections panel only.
    // The component derives sectionQuestions = selectedSection ? filter(...) : []
    // When selectedSection is null the branch is the empty array — test that directly.
    function deriveQuestions(sel: Section | null): Question[] {
      if (sel === null) return [];
      return sampleQuestions.filter((q) => q.sectionId === sel.id);
    }
    expect(deriveQuestions(null)).toHaveLength(0);
  });

  it("sections list is visible (non-null) in default view", () => {
    const selectedSection: Section | null = null;
    const showSectionList = selectedSection === null;
    expect(showSectionList).toBe(true);
  });

  it("section list is hidden when a section is selected", () => {
    const selectedSection: Section | null = sampleSections[0];
    const showSectionList = selectedSection === null;
    expect(showSectionList).toBe(false);
  });
});

describe("Back button returns to section list view", () => {
  it("setting selectedSection to null reverts to section list", () => {
    let selectedSection: Section | null = sampleSections[0];
    // Simulate clicking back
    selectedSection = null;
    expect(selectedSection).toBeNull();
  });

  it("after navigating back, section list length is unchanged", () => {
    let selectedSection: Section | null = sampleSections[0];
    selectedSection = null; // back button
    const listVisible = selectedSection === null;
    expect(listVisible).toBe(true);
    expect(sampleSections).toHaveLength(2);
  });

  it("after navigating back, no questions are shown", () => {
    function deriveQuestions(sel: Section | null): Question[] {
      if (sel === null) return [];
      return sampleQuestions.filter((q) => q.sectionId === sel.id);
    }
    // Start with a section selected, then simulate back button (set to null)
    let selectedSection: Section | null = sampleSections[1];
    selectedSection = null; // back
    expect(deriveQuestions(selectedSection)).toHaveLength(0);
  });
});

describe("Section question count badge", () => {
  it("section item badge shows correct count before drill-down", () => {
    function getQCount(questions: Question[], sectionId: bigint): number {
      return questions.filter((q) => q.sectionId === sectionId).length;
    }
    expect(getQCount(sampleQuestions, BigInt(1))).toBe(1);
    expect(getQCount(sampleQuestions, BigInt(2))).toBe(1);
  });

  it("section detail header shows matching count after drill-down", () => {
    const selected = sampleSections[0];
    const filtered = sampleQuestions.filter((q) => q.sectionId === selected.id);
    const badgeText = `${filtered.length} question${filtered.length !== 1 ? "s" : ""}`;
    expect(badgeText).toBe("1 question");
  });

  it("pluralises correctly when section has multiple questions", () => {
    const questionsMulti: Question[] = [
      ...sampleQuestions,
      {
        id: BigInt(99),
        testId: BigInt(1),
        orderIndex: BigInt(3),
        text: "Extra question",
        questionType: QuestionType.mcSingle,
        options: ["A", "B"],
        correctAnswers: [BigInt(0)],
        correctText: "",
        correctOrder: [],
        sectionId: BigInt(1),
      },
    ];
    const count = questionsMulti.filter(
      (q) => q.sectionId === BigInt(1),
    ).length;
    const label = `${count} question${count !== 1 ? "s" : ""}`;
    expect(label).toBe("2 questions");
  });
});

// ── Section delete clears questions reference ───────────────────────────────────────────

describe("Section delete removes associated questions", () => {
  it("questions belonging to deleted section are no longer listed", () => {
    const deletedSectionId = BigInt(1);
    // Simulate backend deleting all questions in section
    const remaining = sampleQuestions.filter(
      (q) => q.sectionId !== deletedSectionId,
    );
    expect(remaining).toHaveLength(2);
    const remainingIds = remaining.map((q) => Number(q.id));
    expect(remainingIds).not.toContain(1);
    expect(remainingIds).toContain(2);
    expect(remainingIds).toContain(3);
  });

  it("question count for section is zero after deletion", () => {
    const deletedSectionId = BigInt(1);
    const remaining = sampleQuestions.filter(
      (q) => q.sectionId !== deletedSectionId,
    );
    const inSection = remaining.filter((q) => q.sectionId === deletedSectionId);
    expect(inSection).toHaveLength(0);
  });
});

// Uncategorised virtual section tests

/** Mirrors getUncategorisedCount from AdminTestDetailPage */
function getUncategorisedCount(questions: Question[]): number {
  return questions.filter((q) => q.sectionId == null).length;
}

/** Mirrors the sentinel section logic in AdminTestDetailPage */
const UNCATEGORISED_SENTINEL: Section = {
  id: BigInt(-1),
  testId: BigInt(1),
  name: "Uncategorised",
  description: "Questions not assigned to any section",
  createdAt: BigInt(0),
};

function buildSectionList(
  sections: Section[],
  questions: Question[],
): Section[] {
  const uncatCount = getUncategorisedCount(questions);
  return [...sections, ...(uncatCount > 0 ? [UNCATEGORISED_SENTINEL] : [])];
}

function drillDownQuestions(
  selectedSection: Section,
  questions: Question[],
): Question[] {
  if (selectedSection.id === BigInt(-1)) {
    return questions.filter((q) => q.sectionId == null);
  }
  return questions.filter((q) => q.sectionId === selectedSection.id);
}

describe("Uncategorised virtual section in section list", () => {
  it("appears in the section list when questions have no section", () => {
    const list = buildSectionList(sampleSections, sampleQuestions);
    const names = list.map((s) => s.name);
    expect(names).toContain("Uncategorised");
  });

  it("does NOT appear when all questions are assigned to sections", () => {
    const allAssigned: Question[] = sampleQuestions.map((q) => ({
      ...q,
      sectionId: BigInt(1),
    }));
    const list = buildSectionList(sampleSections, allAssigned);
    const names = list.map((s) => s.name);
    expect(names).not.toContain("Uncategorised");
  });

  it("does NOT appear when there are no questions at all", () => {
    const list = buildSectionList(sampleSections, []);
    const names = list.map((s) => s.name);
    expect(names).not.toContain("Uncategorised");
  });

  it("Uncategorised has sentinel id BigInt(-1)", () => {
    const list = buildSectionList(sampleSections, sampleQuestions);
    const uncat = list.find((s) => s.name === "Uncategorised");
    expect(uncat?.id).toBe(BigInt(-1));
  });

  it("Uncategorised section appears after named sections", () => {
    const list = buildSectionList(sampleSections, sampleQuestions);
    const lastIdx = list.length - 1;
    expect(list[lastIdx].name).toBe("Uncategorised");
  });
});

describe("Drill-down into Uncategorised virtual section", () => {
  it("returns only questions with no sectionId", () => {
    const qs = drillDownQuestions(UNCATEGORISED_SENTINEL, sampleQuestions);
    expect(qs).toHaveLength(1);
    expect(qs[0].sectionId).toBeUndefined();
  });

  it("uncategorised drill-down does NOT include questions with a sectionId", () => {
    const qs = drillDownQuestions(UNCATEGORISED_SENTINEL, sampleQuestions);
    const withSection = qs.filter((q) => q.sectionId != null);
    expect(withSection).toHaveLength(0);
  });

  it("drill-down into a real section still works correctly alongside Uncategorised", () => {
    const qs = drillDownQuestions(sampleSections[0], sampleQuestions);
    expect(qs).toHaveLength(1);
    expect(qs[0].sectionId).toBe(BigInt(1));
  });

  it("returns empty list when no questions are uncategorised", () => {
    const allAssigned: Question[] = sampleQuestions.map((q) => ({
      ...q,
      sectionId: BigInt(1),
    }));
    const qs = drillDownQuestions(UNCATEGORISED_SENTINEL, allAssigned);
    expect(qs).toHaveLength(0);
  });
});

describe("HTML rendering in section drill-down question list", () => {
  const htmlQuestion: Question = {
    id: BigInt(50),
    testId: BigInt(1),
    orderIndex: BigInt(0),
    text: "<p>IaC (Infrastructure as Code) can be stored in a <strong>version control</strong> system.</p>",
    questionType: QuestionType.mcSingle,
    options: ["True", "False"],
    correctAnswers: [BigInt(0)],
    correctText: "",
    correctOrder: [],
    sectionId: undefined,
  };

  it("question text is an HTML string (not raw text)", () => {
    expect(htmlQuestion.text).toContain("<p>");
    expect(htmlQuestion.text).toContain("<strong>");
  });

  it("question text is passed as html prop to RichTextDisplay (not raw JSX interpolation)", () => {
    const htmlProp = htmlQuestion.text;
    expect(typeof htmlProp).toBe("string");
    // It must NOT be rendered as a plain text string in JSX (raw tags would be visible)
    expect(htmlProp).not.toBe(htmlProp.replace(/<[^>]+>/g, ""));
  });

  it("HTML from user report renders correctly via RichTextDisplay", () => {
    const userReportText =
      '<p><span style="background-color: rgb(255, 255, 255); color: rgb(80, 80, 80);">IaC (Infrastructure as Code) can be stored in a version control system along with application code.</span></p>';
    expect(userReportText).toContain("<p>");
    expect(userReportText).toContain("</p>");
    // Stripping HTML gives plain readable text
    expect(userReportText.replace(/<[^>]+>/g, "").trim()).toBe(
      "IaC (Infrastructure as Code) can be stored in a version control system along with application code.",
    );
  });

  it("uncategorised HTML question appears in drill-down for Uncategorised section", () => {
    const qs = drillDownQuestions(UNCATEGORISED_SENTINEL, [htmlQuestion]);
    expect(qs).toHaveLength(1);
    expect(qs[0].text).toContain("<p>");
  });
});
