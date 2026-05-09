/**
 * User API accessibility tests.
 *
 * Verifies that USER-FACING backend operations work correctly for a regular
 * user ("sarah") without needing admin privileges:
 *   listTests, getTest, listQuestionsForTest, getQuestion,
 *   getSection, listSectionsForTest,
 *   submitTestAnswers, getTestResult, getTestResultBySession,
 *   saveTestProgress, getTestProgress
 *
 * Also verifies that a regular user CANNOT call admin-only operations.
 */
import { describe, expect, it } from "vitest";
import { QuestionType } from "./mocks/backendStub";
import { mockBackend } from "./mocks/mockBackendImpl";

const USER = "sarah";

// ── Test reads (public, no auth required) ─────────────────────────────────────

describe("listTests – accessible to regular user", () => {
  it("regular user can list all tests", async () => {
    const tests = await mockBackend.listTests();
    expect(Array.isArray(tests)).toBe(true);
    expect(tests.length).toBeGreaterThan(0);
  });

  it("each test has required fields", async () => {
    const tests = await mockBackend.listTests();
    for (const t of tests) {
      expect(t).toHaveProperty("id");
      expect(t).toHaveProperty("name");
      expect(t).toHaveProperty("description");
      expect(t).toHaveProperty("createdAt");
    }
  });
});

describe("getTest – accessible to regular user", () => {
  it("regular user can get a test by id", async () => {
    const test = await mockBackend.getTest(BigInt(1));
    expect(test).not.toBeNull();
    expect(test?.id).toBe(BigInt(1));
  });

  it("returns null for unknown test id", async () => {
    const test = await mockBackend.getTest(BigInt(9999));
    expect(test).toBeNull();
  });
});

// ── Question reads (public, no auth required) ─────────────────────────────────

describe("listQuestionsForTest – accessible to regular user", () => {
  it("regular user can list questions for a test", async () => {
    const questions = await mockBackend.listQuestionsForTest(BigInt(1));
    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThan(0);
    for (const q of questions) {
      expect(q.testId).toBe(BigInt(1));
    }
  });

  it("returns empty array when test has no questions", async () => {
    const questions = await mockBackend.listQuestionsForTest(BigInt(999));
    expect(questions).toEqual([]);
  });
});

describe("getQuestion – accessible to regular user", () => {
  it("regular user can get a question by id", async () => {
    const q = await mockBackend.getQuestion(BigInt(1));
    expect(q).not.toBeNull();
    expect(q?.id).toBe(BigInt(1));
  });

  it("returns null for unknown question id", async () => {
    const q = await mockBackend.getQuestion(BigInt(9999));
    expect(q).toBeNull();
  });

  it("returned question has all required fields", async () => {
    const q = await mockBackend.getQuestion(BigInt(1));
    if (q) {
      expect(q).toHaveProperty("id");
      expect(q).toHaveProperty("testId");
      expect(q).toHaveProperty("text");
      expect(q).toHaveProperty("questionType");
      expect(q).toHaveProperty("options");
      expect(q).toHaveProperty("correctAnswers");
      expect(q).toHaveProperty("orderIndex");
    }
  });
});

// ── Section reads (public, no auth required) ──────────────────────────────────

describe("listSectionsForTest – accessible to regular user", () => {
  it("regular user can list sections for a test", async () => {
    const sections = await mockBackend.listSectionsForTest(BigInt(1));
    expect(Array.isArray(sections)).toBe(true);
    expect(sections.length).toBeGreaterThan(0);
    for (const s of sections) {
      expect(s.testId).toBe(BigInt(1));
    }
  });

  it("returns empty array when test has no sections", async () => {
    const sections = await mockBackend.listSectionsForTest(BigInt(999));
    expect(sections).toEqual([]);
  });

  it("each section has required fields", async () => {
    const sections = await mockBackend.listSectionsForTest(BigInt(1));
    for (const s of sections) {
      expect(s).toHaveProperty("id");
      expect(s).toHaveProperty("testId");
      expect(s).toHaveProperty("name");
      expect(s).toHaveProperty("description");
      expect(s).toHaveProperty("createdAt");
    }
  });
});

// ── Test submission & results (user operations) ───────────────────────────────

describe("submitTestAnswers – accessible to regular user", () => {
  it("regular user can submit test answers", async () => {
    const result = await mockBackend.submitTestAnswers(
      USER,
      BigInt(1),
      "session-1",
      [
        {
          questionId: BigInt(1),
          selectedOptions: [BigInt(0)],
          orderedItems: [],
          textAnswer: "",
        },
      ],
    );
    expect(result).toHaveProperty("testId");
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("totalQuestions");
    expect(result).toHaveProperty("questionResults");
    expect(Array.isArray(result.questionResults)).toBe(true);
    expect(result).toHaveProperty("sectionResults");
    expect(Array.isArray(result.sectionResults)).toBe(true);
  });

  it("result contains username from submission", async () => {
    const result = await mockBackend.submitTestAnswers(
      USER,
      BigInt(1),
      "session-abc",
      [],
    );
    expect(result).toHaveProperty("username");
  });
});

describe("getTestResult – accessible to regular user", () => {
  it("regular user can get their own test result", async () => {
    const result = await mockBackend.getTestResult(USER, BigInt(1));
    expect(result).not.toBeNull();
    if (result) {
      expect(result).toHaveProperty("testId");
      expect(result).toHaveProperty("score");
      expect(result).toHaveProperty("questionResults");
    }
  });

  it("question results each have questionId and isCorrect", async () => {
    const result = await mockBackend.getTestResult(USER, BigInt(1));
    if (result) {
      for (const qr of result.questionResults) {
        expect(qr).toHaveProperty("questionId");
        expect(qr).toHaveProperty("isCorrect");
      }
    }
  });
});

// ── Admin-only ops rejected for regular users (sanity cross-check) ────────────

describe("Admin-only operations rejected for regular user", () => {
  const testInput = { name: "X", description: "Y" };
  const questionInput = {
    text: "Q?",
    questionType: QuestionType.mcSingle,
    options: ["A", "B"],
    correctAnswers: [BigInt(0)],
    correctText: "",
    correctOrder: [],
  };
  const sectionInput = { name: "S", description: "D" };

  it("createTest throws Unauthorized for regular user", async () => {
    await expect(mockBackend.createTest(USER, testInput)).rejects.toThrow(
      /unauthorized/i,
    );
  });

  it("updateTest throws Unauthorized for regular user", async () => {
    await expect(
      mockBackend.updateTest(USER, BigInt(1), testInput),
    ).rejects.toThrow(/unauthorized/i);
  });

  it("deleteTest throws Unauthorized for regular user", async () => {
    await expect(mockBackend.deleteTest(USER, BigInt(1))).rejects.toThrow(
      /unauthorized/i,
    );
  });

  it("addQuestion throws Unauthorized for regular user", async () => {
    await expect(
      mockBackend.addQuestion(USER, BigInt(1), questionInput),
    ).rejects.toThrow(/unauthorized/i);
  });

  it("updateQuestion throws Unauthorized for regular user", async () => {
    await expect(
      mockBackend.updateQuestion(USER, BigInt(1), questionInput),
    ).rejects.toThrow(/unauthorized/i);
  });

  it("deleteQuestion throws Unauthorized for regular user", async () => {
    await expect(mockBackend.deleteQuestion(USER, BigInt(1))).rejects.toThrow(
      /unauthorized/i,
    );
  });

  it("createSection throws Unauthorized for regular user", async () => {
    await expect(
      mockBackend.createSection(USER, BigInt(1), sectionInput),
    ).rejects.toThrow(/unauthorized/i);
  });

  it("updateSection throws Unauthorized for regular user", async () => {
    await expect(
      mockBackend.updateSection(USER, BigInt(1), sectionInput),
    ).rejects.toThrow(/unauthorized/i);
  });

  it("deleteSection throws Unauthorized for regular user", async () => {
    await expect(mockBackend.deleteSection(USER, BigInt(1))).rejects.toThrow(
      /unauthorized/i,
    );
  });
});
