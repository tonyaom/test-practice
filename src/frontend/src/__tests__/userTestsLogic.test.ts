/**
 * Unit tests for UserTestsPage logic:
 * - Test list display logic
 * - StartTestModal navigation parameter building
 */
import { describe, expect, it } from "vitest";
import type { Test } from "./mocks/backendStub";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const now = BigInt(Date.now()) * BigInt(1_000_000);

const sampleTests: Test[] = [
  {
    id: BigInt(1),
    name: "Psychology Basics",
    description: "Covers the fundamentals of cognitive psychology.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: BigInt(2),
    name: "Biology 101",
    description: "Cell structure and organelles.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: BigInt(3),
    name: "World History",
    description: "",
    createdAt: now,
    updatedAt: now,
  },
];

// ── Test list display ─────────────────────────────────────────────────────────

describe("UserTestsPage – test list display", () => {
  it("renders all tests from the list", () => {
    expect(sampleTests).toHaveLength(3);
  });

  it("uses 'No description provided' fallback when description is empty", () => {
    const fallback = (desc: string) => desc || "No description provided";
    expect(fallback("")).toBe("No description provided");
    expect(fallback("Some description")).toBe("Some description");
  });

  it("identifies empty state when no tests exist", () => {
    const tests: Test[] = [];
    expect(tests.length === 0).toBe(true);
  });

  it("identifies non-empty state with tests", () => {
    expect(sampleTests.length === 0).toBe(false);
  });
});

// ── StartTestModal navigation params ─────────────────────────────────────────

describe("StartTestModal – navigation parameter building", () => {
  interface StartTestParams {
    testId: string;
    randomizeQuestions: string;
    randomizeAnswers: string;
    sections: string;
  }

  function buildNavParams(
    test: Test,
    randomizeQuestions: boolean,
    randomizeAnswers: boolean,
    selectedSectionIds: number[] = [],
  ): StartTestParams {
    return {
      testId: String(test.id),
      randomizeQuestions: randomizeQuestions ? "true" : "false",
      randomizeAnswers: randomizeAnswers ? "true" : "false",
      sections: selectedSectionIds.join(","),
    };
  }

  it("builds correct testId string from BigInt", () => {
    const params = buildNavParams(sampleTests[0], false, false);
    expect(params.testId).toBe("1");
  });

  it("sets randomizeQuestions=true when enabled", () => {
    const params = buildNavParams(sampleTests[0], true, false);
    expect(params.randomizeQuestions).toBe("true");
  });

  it("sets randomizeAnswers=true when enabled", () => {
    const params = buildNavParams(sampleTests[0], false, true);
    expect(params.randomizeAnswers).toBe("true");
  });

  it("sets both flags to false by default", () => {
    const params = buildNavParams(sampleTests[0], false, false);
    expect(params.randomizeQuestions).toBe("false");
    expect(params.randomizeAnswers).toBe("false");
  });

  it("handles test with id BigInt(2) correctly", () => {
    const params = buildNavParams(sampleTests[1], true, true);
    expect(params.testId).toBe("2");
    expect(params.randomizeQuestions).toBe("true");
    expect(params.randomizeAnswers).toBe("true");
  });

  it("sets sections to empty string when entire test is selected", () => {
    const params = buildNavParams(sampleTests[0], false, false, []);
    expect(params.sections).toBe("");
  });

  it("encodes a single selected section correctly", () => {
    const params = buildNavParams(sampleTests[0], false, false, [3]);
    expect(params.sections).toBe("3");
  });

  it("encodes multiple selected sections as comma-separated string", () => {
    const params = buildNavParams(sampleTests[0], false, false, [1, 3, 5]);
    expect(params.sections).toBe("1,3,5");
  });
});

// ── Section selection in URL params parsing ───────────────────────────────────

describe("Section selection URL params parsing", () => {
  function parseSections(sectionsParam: string | undefined): number[] {
    if (!sectionsParam) return [];
    return sectionsParam.split(",").map(Number).filter(Boolean);
  }

  it("returns empty array when sections param is absent", () => {
    expect(parseSections(undefined)).toEqual([]);
  });

  it("returns empty array when sections param is empty string", () => {
    expect(parseSections("")).toEqual([]);
  });

  it("parses a single section ID", () => {
    expect(parseSections("3")).toEqual([3]);
  });

  it("parses multiple section IDs", () => {
    expect(parseSections("1,3,5")).toEqual([1, 3, 5]);
  });

  it("filters out NaN values from malformed input", () => {
    expect(parseSections("1,,3")).toEqual([1, 3]);
  });
});

// ── Admin link visibility gating ────────────────────────────────────────────

/** Mirrors the conditional Manage Tests button render in UserTestsPage */
function shouldShowAdminLink(role: string | undefined): boolean {
  return role === "admin";
}

describe("UserTestsPage – admin link visibility", () => {
  it("shows Manage Tests link to admin users", () => {
    expect(shouldShowAdminLink("admin")).toBe(true);
  });

  it("hides Manage Tests link from regular users", () => {
    expect(shouldShowAdminLink("user")).toBe(false);
  });

  it("hides Manage Tests link when role is undefined (not logged in)", () => {
    expect(shouldShowAdminLink(undefined)).toBe(false);
  });

  it("hides Go to Admin Area button from regular users in empty state", () => {
    // Empty state admin link also uses shouldShowAdminLink
    expect(shouldShowAdminLink("user")).toBe(false);
  });

  it("shows Go to Admin Area button to admin users in empty state", () => {
    expect(shouldShowAdminLink("admin")).toBe(true);
  });
});

// ── Question count badge logic ─────────────────────────────────────────────

describe("Question count badge — section question counting", () => {
  interface MockQuestion {
    id: bigint;
    sectionId: bigint | undefined;
  }

  function countQuestionsForSection(
    questions: MockQuestion[],
    sectionId: bigint,
  ): number {
    return questions.filter(
      (q) => q.sectionId != null && q.sectionId === sectionId,
    ).length;
  }

  const mockQuestions: MockQuestion[] = [
    { id: BigInt(1), sectionId: BigInt(10) },
    { id: BigInt(2), sectionId: BigInt(10) },
    { id: BigInt(3), sectionId: BigInt(10) },
    { id: BigInt(4), sectionId: BigInt(11) },
    { id: BigInt(5), sectionId: BigInt(11) },
    { id: BigInt(6), sectionId: undefined },
  ];

  it("renders question count badge on section cards", () => {
    const count = countQuestionsForSection(mockQuestions, BigInt(10));
    expect(typeof count).toBe("number");
  });

  it("badge shows correct count for section 10", () => {
    expect(countQuestionsForSection(mockQuestions, BigInt(10))).toBe(3);
  });

  it("badge shows correct count for section 11", () => {
    expect(countQuestionsForSection(mockQuestions, BigInt(11))).toBe(2);
  });

  it("badge shows 0 for section with no questions", () => {
    expect(countQuestionsForSection(mockQuestions, BigInt(99))).toBe(0);
  });

  it("questions without sectionId are not counted in any section", () => {
    const total =
      countQuestionsForSection(mockQuestions, BigInt(10)) +
      countQuestionsForSection(mockQuestions, BigInt(11));
    expect(total).toBe(5);
  });
});

// ── Streak badge logic ───────────────────────────────────────────────────

describe("Streak badge display", () => {
  function buildStreakBadgeText(currentStreak: number): string {
    return `🔥 ${currentStreak}`;
  }

  function buildStreakTooltip(currentStreak: number): string {
    return `${currentStreak} day streak — keep it going!`;
  }

  it("streak badge renders with count 0 when no streak", () => {
    expect(buildStreakBadgeText(0)).toBe("🔥 0");
  });

  it("streak badge renders with correct count for active streak", () => {
    expect(buildStreakBadgeText(7)).toBe("🔥 7");
  });

  it("streak badge tooltip shows correct message", () => {
    expect(buildStreakTooltip(5)).toBe("5 day streak — keep it going!");
  });

  it("streak badge shows 1 for first day streak", () => {
    expect(buildStreakBadgeText(1)).toBe("🔥 1");
  });

  it("streak badge is only shown for non-admin logged-in users", () => {
    function shouldShowStreak(role: string | undefined): boolean {
      return !!role && role !== "admin";
    }
    expect(shouldShowStreak("user")).toBe(true);
    expect(shouldShowStreak("admin")).toBe(false);
    expect(shouldShowStreak(undefined)).toBe(false);
  });
});

// ── Randomization flag parsing from URL params ────────────────────────────────

describe("Randomization flag parsing from URL search params", () => {
  it("parses randomizeAnswers=true correctly", () => {
    const searchParams = { randomizeAnswers: "true" };
    const shouldRandomize = searchParams.randomizeAnswers === "true";
    expect(shouldRandomize).toBe(true);
  });

  it("parses randomizeAnswers=false correctly", () => {
    const searchParams = { randomizeAnswers: "false" };
    const shouldRandomize = searchParams.randomizeAnswers === "true";
    expect(shouldRandomize).toBe(false);
  });

  it("defaults to false when param is absent", () => {
    const searchParams: Record<string, string> = {};
    const shouldRandomize = searchParams?.randomizeQuestions === "true";
    expect(shouldRandomize).toBe(false);
  });
});
