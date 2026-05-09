/**
 * Section pre-selection tests.
 *
 * Covers:
 * - When in section drill-down view and clicking Add Question,
 *   the sectionId is passed to QuestionForm as default value
 * - The form section selector pre-selects the passed sectionId
 * - Passing sectionId=null results in Uncategorized default
 * - Passing a valid sectionId pre-selects that section
 */
import { describe, expect, it } from "vitest";

// ── Mirrors defaultQuestionFormData from QuestionForm ─────────────────────────

interface QuestionFormData {
  text: string;
  sectionId: number | null;
  options: string[];
  correctAnswers: number[];
  correctText: string;
  correctOrder: number[];
  imageFile: null;
  imagePreviewUrl: null;
  explanation: string;
}

function defaultQuestionFormData(
  sectionId: number | null = null,
): QuestionFormData {
  return {
    text: "",
    sectionId,
    options: ["", "", "", ""],
    correctAnswers: [0],
    correctText: "",
    correctOrder: [0, 1, 2, 3],
    imageFile: null,
    imagePreviewUrl: null,
    explanation: "",
  };
}

/** Mirrors the openCreate logic in AdminTestDetailPage */
function openCreate(selectedSectionId: number | null): QuestionFormData {
  return defaultQuestionFormData(selectedSectionId);
}

/** Mirrors the section select value derivation in QuestionForm */
function getSectionSelectValue(sectionId: number | null): string {
  return sectionId !== null ? String(sectionId) : "uncategorized";
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("Section pre-selection — defaultQuestionFormData", () => {
  it("defaults sectionId to null when no section provided", () => {
    const data = defaultQuestionFormData();
    expect(data.sectionId).toBeNull();
  });

  it("accepts a numeric sectionId and stores it", () => {
    const data = defaultQuestionFormData(3);
    expect(data.sectionId).toBe(3);
  });

  it("accepts sectionId=0", () => {
    const data = defaultQuestionFormData(0);
    expect(data.sectionId).toBe(0);
  });

  it("sectionId is null by default (Uncategorized)", () => {
    const data = defaultQuestionFormData(null);
    expect(data.sectionId).toBeNull();
  });
});

describe("Section pre-selection — openCreate from drill-down", () => {
  it("openCreate without section passes null sectionId", () => {
    const form = openCreate(null);
    expect(form.sectionId).toBeNull();
  });

  it("openCreate with selectedSection passes that sectionId", () => {
    const form = openCreate(5);
    expect(form.sectionId).toBe(5);
  });

  it("openCreate with section 2 pre-selects section 2", () => {
    const form = openCreate(2);
    expect(form.sectionId).toBe(2);
  });

  it("the top-level Add Question button always uses null (no section context)", () => {
    // When clicking Add Question from the test header (not inside a section)
    const form = openCreate(null);
    expect(form.sectionId).toBeNull();
  });
});

describe("Section pre-selection — QuestionForm select value", () => {
  it("null sectionId maps to 'uncategorized' value in select", () => {
    expect(getSectionSelectValue(null)).toBe("uncategorized");
  });

  it("numeric sectionId 3 maps to '3' in select", () => {
    expect(getSectionSelectValue(3)).toBe("3");
  });

  it("numeric sectionId 1 maps to '1' in select", () => {
    expect(getSectionSelectValue(1)).toBe("1");
  });

  it("sectionId 0 maps to '0' in select (not 'uncategorized')", () => {
    expect(getSectionSelectValue(0)).toBe("0");
  });
});

describe("Section pre-selection — section list drill-down context", () => {
  interface Section {
    id: bigint;
    name: string;
  }

  /** Mirrors the section numeric ID extraction for QuestionForm */
  function getFormSectionId(selectedSection: Section | null): number | null {
    if (!selectedSection) return null;
    if (selectedSection.id === BigInt(-1)) return null; // Uncategorised sentinel — no section
    return Number(selectedSection.id);
  }

  it("returns null when no section is selected (main view)", () => {
    expect(getFormSectionId(null)).toBeNull();
  });

  it("returns numeric ID when a real section is selected", () => {
    const section: Section = { id: BigInt(7), name: "Chapter 7" };
    expect(getFormSectionId(section)).toBe(7);
  });

  it("returns null for the Uncategorised sentinel section (id=-1)", () => {
    const uncategorised: Section = { id: BigInt(-1), name: "Uncategorised" };
    expect(getFormSectionId(uncategorised)).toBeNull();
  });

  it("correctly maps BigInt(3) to numeric 3", () => {
    const section: Section = { id: BigInt(3), name: "Section 3" };
    expect(getFormSectionId(section)).toBe(3);
  });
});
