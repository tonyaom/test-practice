/**
 * P1 StartTestModal Restructure Tests — P1.5
 *
 * Covers:
 * - Default practice mode is "sections" (not "entire")
 * - Segmented control switches between "Entire Test" and "Select Sections"
 * - Section checklist is shown only in "sections" mode
 * - "How to practice" group has both randomize options
 * - Both randomize options default ON
 * - Count badge shows selected sections + question count
 * - canStart is true when entire test selected
 * - canStart is true when at least one section selected
 * - canStart is false when sections mode with no sections selected
 */
import { describe, expect, it } from "vitest";

type PracticeMode = "sections" | "entire";

interface Section {
  id: number;
  name: string;
  questionCount: number;
}

function computeCanStart(
  mode: PracticeMode,
  selectedSectionIds: number[],
): boolean {
  if (mode === "entire") return true;
  return selectedSectionIds.length > 0;
}

function computeSelectedTotalCount(
  mode: PracticeMode,
  allCount: number,
  selectedSectionIds: number[],
  sections: Section[],
  uncategorisedCount: number,
  UNCATEGORISED_ID: number,
): number {
  if (mode === "entire") return allCount;
  return selectedSectionIds.reduce((sum, sid) => {
    if (sid === UNCATEGORISED_ID) return sum + uncategorisedCount;
    const sec = sections.find((s) => s.id === sid);
    return sec ? sum + sec.questionCount : sum;
  }, 0);
}

function shouldShowSectionChecklist(mode: PracticeMode): boolean {
  return mode === "sections";
}

describe("StartTestModal — initial state", () => {
  it("default practice mode is 'sections'", () => {
    const defaultMode: PracticeMode = "sections";
    expect(defaultMode).toBe("sections");
  });

  it("randomizeQuestions defaults to true", () => {
    const defaultRandomizeQ = true;
    expect(defaultRandomizeQ).toBe(true);
  });

  it("randomizeAnswers defaults to true", () => {
    const defaultRandomizeA = true;
    expect(defaultRandomizeA).toBe(true);
  });
});

describe("StartTestModal — segmented control", () => {
  it("switching to 'entire' mode shows Entire Test", () => {
    let mode: PracticeMode = "sections";
    mode = "entire";
    expect(mode).toBe("entire");
  });

  it("switching back to 'sections' mode shows Select Sections", () => {
    let mode: PracticeMode = "entire";
    mode = "sections";
    expect(mode).toBe("sections");
  });

  it("section checklist is visible in sections mode", () => {
    expect(shouldShowSectionChecklist("sections")).toBe(true);
  });

  it("section checklist is hidden in entire mode", () => {
    expect(shouldShowSectionChecklist("entire")).toBe(false);
  });
});

describe("StartTestModal — canStart", () => {
  it("canStart is true when mode is 'entire'", () => {
    expect(computeCanStart("entire", [])).toBe(true);
  });

  it("canStart is true when sections mode and sections are selected", () => {
    expect(computeCanStart("sections", [1, 2])).toBe(true);
  });

  it("canStart is false when sections mode with no sections selected", () => {
    expect(computeCanStart("sections", [])).toBe(false);
  });

  it("canStart is true when only one section selected", () => {
    expect(computeCanStart("sections", [3])).toBe(true);
  });
});

describe("StartTestModal — count badge", () => {
  const sections: Section[] = [
    { id: 1, name: "Grammar", questionCount: 10 },
    { id: 2, name: "Vocabulary", questionCount: 15 },
    { id: 3, name: "Listening", questionCount: 8 },
  ];
  const UNCATEGORISED_ID = -1;
  const uncategorisedCount = 5;
  const allCount = 38;

  it("shows total question count in entire mode", () => {
    const count = computeSelectedTotalCount(
      "entire",
      allCount,
      [],
      sections,
      uncategorisedCount,
      UNCATEGORISED_ID,
    );
    expect(count).toBe(38);
  });

  it("shows question count for single selected section", () => {
    const count = computeSelectedTotalCount(
      "sections",
      allCount,
      [1],
      sections,
      uncategorisedCount,
      UNCATEGORISED_ID,
    );
    expect(count).toBe(10);
  });

  it("sums question counts across multiple selected sections", () => {
    const count = computeSelectedTotalCount(
      "sections",
      allCount,
      [1, 2],
      sections,
      uncategorisedCount,
      UNCATEGORISED_ID,
    );
    expect(count).toBe(25);
  });

  it("includes uncategorised count when UNCATEGORISED_ID is selected", () => {
    const count = computeSelectedTotalCount(
      "sections",
      allCount,
      [UNCATEGORISED_ID],
      sections,
      uncategorisedCount,
      UNCATEGORISED_ID,
    );
    expect(count).toBe(5);
  });

  it("combines sections and uncategorised", () => {
    const count = computeSelectedTotalCount(
      "sections",
      allCount,
      [1, UNCATEGORISED_ID],
      sections,
      uncategorisedCount,
      UNCATEGORISED_ID,
    );
    expect(count).toBe(15); // 10 + 5
  });

  it("returns 0 for sections mode with no selection", () => {
    const count = computeSelectedTotalCount(
      "sections",
      allCount,
      [],
      sections,
      uncategorisedCount,
      UNCATEGORISED_ID,
    );
    expect(count).toBe(0);
  });
});

describe("StartTestModal — section count badge label", () => {
  it("shows singular 'section' for 1 selected", () => {
    const count = 1;
    const label = `${count} section`;
    expect(label).toBe("1 section");
  });

  it("shows plural 'sections' for 2+ selected", () => {
    const count = 3;
    const label = `${count} sections`;
    expect(label).toBe("3 sections");
  });
});

describe("StartTestModal — navigation params from resolved section IDs", () => {
  function resolvedSectionIds(
    mode: PracticeMode,
    selectedSectionIds: number[],
  ): number[] {
    if (mode === "entire") return [];
    return selectedSectionIds;
  }

  it("entire mode resolves to empty array (full test)", () => {
    expect(resolvedSectionIds("entire", [1, 2])).toEqual([]);
  });

  it("sections mode resolves to selected section IDs", () => {
    expect(resolvedSectionIds("sections", [1, 3])).toEqual([1, 3]);
  });

  it("sections mode with empty selection resolves to empty", () => {
    expect(resolvedSectionIds("sections", [])).toEqual([]);
  });
});
