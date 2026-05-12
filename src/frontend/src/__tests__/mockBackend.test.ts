/**
 * Unit tests for the mockBackend — verifies mock contract matches backendInterface.
 * Tests auth (register/login/updatePassword/updateProfile),
 * test CRUD, and question CRUD.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { QuestionType } from "./mocks/backendStub";
import { mockBackend } from "./mocks/mockBackendImpl";

// ── Authentication ────────────────────────────────────────────────────────────

describe("mockBackend.login", () => {
  it("returns ok session for known admin credentials", async () => {
    const result = await mockBackend.login("abcd", "abcd");
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      expect(result.ok.username).toBe("abcd");
      expect(result.ok.role).toBe("admin");
    }
  });

  it("returns ok session for known user credentials", async () => {
    const result = await mockBackend.login("sarah", "password");
    expect(result.__kind__).toBe("ok");
    if (result.__kind__ === "ok") {
      expect(result.ok.username).toBe("sarah");
    }
  });

  it("returns err for wrong password", async () => {
    const result = await mockBackend.login("abcd", "wrongpass");
    expect(result.__kind__).toBe("err");
  });

  it("returns err for unknown user", async () => {
    const result = await mockBackend.login("unknown", "anything");
    expect(result.__kind__).toBe("err");
    if (result.__kind__ === "err") {
      expect(result.err).toBeTruthy();
    }
  });
});

describe("mockBackend.register", () => {
  it("always returns ok for registration (mock)", async () => {
    const result = await mockBackend.register("newuser", "newpass");
    expect(result.__kind__).toBe("ok");
  });

  it("returns ok for any username/password combination", async () => {
    const result = await mockBackend.register("anotheruser", "pass1234");
    expect(result.__kind__).toBe("ok");
  });
});

describe("mockBackend.updatePassword", () => {
  it("returns ok for any password change", async () => {
    const result = await mockBackend.updatePassword(
      "abcd",
      "currentPass",
      "newPass",
    );
    expect(result.__kind__).toBe("ok");
  });
});

describe("mockBackend.updateProfile", () => {
  it("returns ok for profile update", async () => {
    const result = await mockBackend.updateProfile("abcd", "Admin User");
    expect(result.__kind__).toBe("ok");
  });
});

describe("mockBackend.getUserRole", () => {
  it("returns admin role for admin user", async () => {
    const role = await mockBackend.getUserRole("abcd");
    expect(role).toBe("admin");
  });

  it("returns user role for non-admin", async () => {
    const role = await mockBackend.getUserRole("sarah");
    expect(role).toBe("user");
  });
});

// ── Test CRUD ─────────────────────────────────────────────────────────────────

describe("mockBackend test CRUD", () => {
  it("listTests returns all sample tests", async () => {
    const tests = await mockBackend.listTests();
    expect(tests.length).toBeGreaterThan(0);
    expect(tests[0]).toHaveProperty("id");
    expect(tests[0]).toHaveProperty("name");
    expect(tests[0]).toHaveProperty("description");
    expect(tests[0]).toHaveProperty("createdAt");
  });

  it("getTest returns test by id", async () => {
    const test = await mockBackend.getTest(BigInt(1));
    expect(test).not.toBeNull();
    expect(test?.id).toBe(BigInt(1));
  });

  it("getTest returns null for unknown id", async () => {
    const test = await mockBackend.getTest(BigInt(9999));
    expect(test).toBeNull();
  });

  it("createTest returns a test with given name and description", async () => {
    const created = await mockBackend.createTest("abcd", {
      name: "New Test",
      description: "A description",
    });
    expect(created.name).toBe("New Test");
    expect(created.description).toBe("A description");
    expect(created.id).toBeDefined();
  });

  it("updateTest returns updated test", async () => {
    const updated = await mockBackend.updateTest("abcd", BigInt(1), {
      name: "Updated Name",
      description: "Updated Desc",
    });
    expect(updated).not.toBeNull();
    expect(updated?.name).toBe("Updated Name");
    expect(updated?.description).toBe("Updated Desc");
  });

  it("updateTest returns null for unknown id", async () => {
    const result = await mockBackend.updateTest("abcd", BigInt(9999), {
      name: "X",
      description: "X",
    });
    expect(result).toBeNull();
  });

  it("deleteTest returns true", async () => {
    const result = await mockBackend.deleteTest("abcd", BigInt(1));
    expect(result).toBe(true);
  });
});

// ── Question CRUD ─────────────────────────────────────────────────────────────

describe("mockBackend question CRUD", () => {
  it("listQuestionsForTest returns questions for given test", async () => {
    const questions = await mockBackend.listQuestionsForTest(BigInt(1));
    expect(questions.length).toBeGreaterThan(0);
    for (const q of questions) expect(q.testId).toBe(BigInt(1));
  });

  it("listQuestionsForTest returns empty array for test with no questions", async () => {
    const questions = await mockBackend.listQuestionsForTest(BigInt(999));
    expect(questions).toEqual([]);
  });

  it("getQuestion returns question by id", async () => {
    const question = await mockBackend.getQuestion(BigInt(1));
    expect(question).not.toBeNull();
    expect(question?.id).toBe(BigInt(1));
  });

  it("getQuestion returns null for unknown id", async () => {
    const question = await mockBackend.getQuestion(BigInt(9999));
    expect(question).toBeNull();
  });

  it("addQuestion (mcSingle) returns question with correct shape", async () => {
    const q = await mockBackend.addQuestion("abcd", BigInt(1), {
      text: "Test question?",
      questionType: QuestionType.mcSingle,
      options: ["A", "B", "C", "D"],
      correctAnswers: [BigInt(0)],
      correctText: "",
      correctOrder: [],
    });
    expect(q.text).toBe("Test question?");
    expect(q.questionType).toBe(QuestionType.mcSingle);
    expect(q.testId).toBe(BigInt(1));
    expect(q.id).toBeDefined();
    expect(q.orderIndex).toBeDefined();
  });

  it("addQuestion (mcMulti) returns question with correctAnswers", async () => {
    const q = await mockBackend.addQuestion("abcd", BigInt(1), {
      text: "Multiple choice question",
      questionType: QuestionType.mcMulti,
      options: ["Alpha", "Beta", "Gamma"],
      correctAnswers: [BigInt(0), BigInt(2)],
      correctText: "",
      correctOrder: [],
    });
    expect(q.questionType).toBe(QuestionType.mcMulti);
    expect(q.correctAnswers).toEqual([BigInt(0), BigInt(2)]);
  });

  it("addQuestion (textInput) returns question with correctText", async () => {
    const q = await mockBackend.addQuestion("abcd", BigInt(1), {
      text: "Text question",
      questionType: QuestionType.textInput,
      options: [],
      correctAnswers: [],
      correctText: "Expected answer",
      correctOrder: [],
    });
    expect(q.questionType).toBe(QuestionType.textInput);
    expect(q.correctText).toBe("Expected answer");
  });

  it("addQuestion (dragOrder) returns question with correctOrder", async () => {
    const q = await mockBackend.addQuestion("abcd", BigInt(1), {
      text: "Drag order question",
      questionType: QuestionType.dragOrder,
      options: ["First", "Second", "Third"],
      correctAnswers: [],
      correctText: "",
      correctOrder: [BigInt(2), BigInt(0), BigInt(1)],
    });
    expect(q.questionType).toBe(QuestionType.dragOrder);
    expect(q.correctOrder).toEqual([BigInt(2), BigInt(0), BigInt(1)]);
  });

  it("addQuestion increments orderIndex based on existing questions", async () => {
    const existingCount = (await mockBackend.listQuestionsForTest(BigInt(1)))
      .length;
    const q = await mockBackend.addQuestion("abcd", BigInt(1), {
      text: "Another question",
      questionType: QuestionType.mcSingle,
      options: ["A", "B"],
      correctAnswers: [BigInt(0)],
      correctText: "",
      correctOrder: [],
    });
    expect(Number(q.orderIndex)).toBe(existingCount);
  });

  it("updateQuestion returns updated question", async () => {
    const updated = await mockBackend.updateQuestion("abcd", BigInt(1), {
      text: "Updated question text",
      questionType: QuestionType.mcSingle,
      options: ["X", "Y", "Z"],
      correctAnswers: [BigInt(1)],
      correctText: "",
      correctOrder: [],
    });
    expect(updated).not.toBeNull();
    expect(updated?.text).toBe("Updated question text");
  });

  it("updateQuestion returns null for unknown question id", async () => {
    const result = await mockBackend.updateQuestion("abcd", BigInt(9999), {
      text: "x",
      questionType: QuestionType.mcSingle,
      options: ["A"],
      correctAnswers: [BigInt(0)],
      correctText: "",
      correctOrder: [],
    });
    expect(result).toBeNull();
  });

  it("deleteQuestion returns true", async () => {
    const result = await mockBackend.deleteQuestion("abcd", BigInt(1));
    expect(result).toBe(true);
  });
});

// ── submitTestAnswers ─────────────────────────────────────────────────────────

describe("mockBackend.submitTestAnswers", () => {
  it("returns a TestResult with expected shape", async () => {
    const result = await mockBackend.submitTestAnswers(
      "abcd",
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
      BigInt(60),
    );
    expect(result).toHaveProperty("testId");
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("totalQuestions");
    expect(result).toHaveProperty("questionResults");
    expect(Array.isArray(result.questionResults)).toBe(true);
  });
});

describe("mockBackend.getTestResult", () => {
  it("returns TestResult with questionResults array", async () => {
    const result = await mockBackend.getTestResult("sarah", BigInt(1));
    expect(result).not.toBeNull();
    expect(result?.questionResults.length).toBeGreaterThan(0);
    if (result) {
      for (const qr of result.questionResults) {
        expect(qr).toHaveProperty("questionId");
        expect(qr).toHaveProperty("isCorrect");
      }
    }
  });
});
