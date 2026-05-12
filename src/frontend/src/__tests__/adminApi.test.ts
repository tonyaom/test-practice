/**
 * Admin API authorization tests.
 *
 * Verifies that every ADMIN-ONLY backend operation:
 *   createTest, updateTest, deleteTest,
 *   addQuestion, updateQuestion, deleteQuestion,
 *   createSection, updateSection, deleteSection
 *
 * REJECTS calls made by a regular user ("sarah") with an "Unauthorized: admin only"
 * error, and ACCEPTS the same calls made by the seeded admin ("abcd").
 */
import { describe, expect, it } from "vitest";
import { QuestionType } from "./mocks/backendStub";
import { mockBackend } from "./mocks/mockBackendImpl";

const ADMIN = "abcd";
const USER = "sarah";
const UNKNOWN = "nobody";

// ── Helper ────────────────────────────────────────────────────────────────────

/** Asserts that the given async operation throws an Unauthorized error. */
async function assertUnauthorized(fn: () => Promise<unknown>): Promise<void> {
  await expect(fn()).rejects.toThrow(/unauthorized/i);
}

// ── createTest ────────────────────────────────────────────────────────────────

describe("createTest – admin-only guard", () => {
  const input = { name: "Test", description: "Description" };

  it("allows admin to create a test", async () => {
    const test = await mockBackend.createTest(ADMIN, input);
    expect(test.name).toBe("Test");
    expect(test.description).toBe("Description");
    expect(test.id).toBeDefined();
  });

  it("rejects a regular user calling createTest", async () => {
    await assertUnauthorized(() => mockBackend.createTest(USER, input));
  });

  it("rejects an unknown username calling createTest", async () => {
    await assertUnauthorized(() => mockBackend.createTest(UNKNOWN, input));
  });
});

// ── updateTest ────────────────────────────────────────────────────────────────

describe("updateTest – admin-only guard", () => {
  const input = { name: "Updated", description: "Updated desc" };

  it("allows admin to update a test", async () => {
    const test = await mockBackend.updateTest(ADMIN, BigInt(1), input);
    expect(test).not.toBeNull();
    expect(test?.name).toBe("Updated");
  });

  it("rejects a regular user calling updateTest", async () => {
    await assertUnauthorized(() =>
      mockBackend.updateTest(USER, BigInt(1), input),
    );
  });

  it("rejects an unknown username calling updateTest", async () => {
    await assertUnauthorized(() =>
      mockBackend.updateTest(UNKNOWN, BigInt(1), input),
    );
  });
});

// ── deleteTest ────────────────────────────────────────────────────────────────

describe("deleteTest – admin-only guard", () => {
  it("allows admin to delete a test", async () => {
    const ok = await mockBackend.deleteTest(ADMIN, BigInt(1));
    expect(ok).toBe(true);
  });

  it("rejects a regular user calling deleteTest", async () => {
    await assertUnauthorized(() => mockBackend.deleteTest(USER, BigInt(1)));
  });

  it("rejects an unknown username calling deleteTest", async () => {
    await assertUnauthorized(() => mockBackend.deleteTest(UNKNOWN, BigInt(1)));
  });
});

// ── addQuestion ───────────────────────────────────────────────────────────────

describe("addQuestion – admin-only guard", () => {
  const input = {
    text: "Question?",
    questionType: QuestionType.mcSingle,
    options: ["A", "B"],
    correctAnswers: [BigInt(0)],
    correctText: "",
    correctOrder: [],
  };

  it("allows admin to add a question", async () => {
    const q = await mockBackend.addQuestion(ADMIN, BigInt(1), input);
    expect(q.text).toBe("Question?");
    expect(q.testId).toBe(BigInt(1));
    expect(q.id).toBeDefined();
  });

  it("rejects a regular user calling addQuestion", async () => {
    await assertUnauthorized(() =>
      mockBackend.addQuestion(USER, BigInt(1), input),
    );
  });

  it("rejects an unknown username calling addQuestion", async () => {
    await assertUnauthorized(() =>
      mockBackend.addQuestion(UNKNOWN, BigInt(1), input),
    );
  });
});

// ── updateQuestion ────────────────────────────────────────────────────────────

describe("updateQuestion – admin-only guard", () => {
  const input = {
    text: "Updated question?",
    questionType: QuestionType.mcSingle,
    options: ["A", "B"],
    correctAnswers: [BigInt(0)],
    correctText: "",
    correctOrder: [],
  };

  it("allows admin to update a question", async () => {
    const q = await mockBackend.updateQuestion(ADMIN, BigInt(1), input);
    expect(q).not.toBeNull();
    expect(q?.text).toBe("Updated question?");
  });

  it("rejects a regular user calling updateQuestion", async () => {
    await assertUnauthorized(() =>
      mockBackend.updateQuestion(USER, BigInt(1), input),
    );
  });

  it("rejects an unknown username calling updateQuestion", async () => {
    await assertUnauthorized(() =>
      mockBackend.updateQuestion(UNKNOWN, BigInt(1), input),
    );
  });
});

// ── deleteQuestion ────────────────────────────────────────────────────────────

describe("deleteQuestion – admin-only guard", () => {
  it("allows admin to delete a question", async () => {
    const ok = await mockBackend.deleteQuestion(ADMIN, BigInt(1));
    expect(ok).toBe(true);
  });

  it("rejects a regular user calling deleteQuestion", async () => {
    await assertUnauthorized(() => mockBackend.deleteQuestion(USER, BigInt(1)));
  });

  it("rejects an unknown username calling deleteQuestion", async () => {
    await assertUnauthorized(() =>
      mockBackend.deleteQuestion(UNKNOWN, BigInt(1)),
    );
  });
});

// ── createSection ─────────────────────────────────────────────────────────────

describe("createSection – admin-only guard", () => {
  const input = { name: "Section A", description: "Desc" };

  it("allows admin to create a section", async () => {
    const section = await mockBackend.createSection(ADMIN, BigInt(1), input);
    expect(section.name).toBe("Section A");
    expect(section.testId).toBe(BigInt(1));
    expect(section.id).toBeDefined();
  });

  it("rejects a regular user calling createSection", async () => {
    await assertUnauthorized(() =>
      mockBackend.createSection(USER, BigInt(1), input),
    );
  });

  it("rejects an unknown username calling createSection", async () => {
    await assertUnauthorized(() =>
      mockBackend.createSection(UNKNOWN, BigInt(1), input),
    );
  });
});

// ── updateSection ─────────────────────────────────────────────────────────────

describe("updateSection – admin-only guard", () => {
  const input = { name: "Updated Section", description: "Updated desc" };

  it("allows admin to update a section", async () => {
    const section = await mockBackend.updateSection(ADMIN, BigInt(1), input);
    expect(section).not.toBeNull();
    expect(section?.name).toBe("Updated Section");
  });

  it("rejects a regular user calling updateSection", async () => {
    await assertUnauthorized(() =>
      mockBackend.updateSection(USER, BigInt(1), input),
    );
  });

  it("rejects an unknown username calling updateSection", async () => {
    await assertUnauthorized(() =>
      mockBackend.updateSection(UNKNOWN, BigInt(1), input),
    );
  });
});

// ── deleteSection ─────────────────────────────────────────────────────────────

describe("deleteSection – admin-only guard", () => {
  it("allows admin to delete a section", async () => {
    const ok = await mockBackend.deleteSection(ADMIN, BigInt(1));
    expect(ok).toBe(true);
  });

  it("rejects a regular user calling deleteSection", async () => {
    await assertUnauthorized(() => mockBackend.deleteSection(USER, BigInt(1)));
  });

  it("rejects an unknown username calling deleteSection", async () => {
    await assertUnauthorized(() =>
      mockBackend.deleteSection(UNKNOWN, BigInt(1)),
    );
  });
});

// ── adminDeleteUser ────────────────────────────────────────────────────────────

describe("adminDeleteUser – admin-only guard", () => {
  it("allows admin to delete a regular user", async () => {
    const result = await mockBackend.adminDeleteUser(ADMIN, "admin2fa");
    expect(result.__kind__).toBe("ok");
  });

  it("rejects a regular user calling adminDeleteUser", async () => {
    await assertUnauthorized(() =>
      mockBackend.adminDeleteUser(USER, "admin2fa"),
    );
  });

  it("rejects an unknown username calling adminDeleteUser", async () => {
    await assertUnauthorized(() =>
      mockBackend.adminDeleteUser(UNKNOWN, "admin2fa"),
    );
  });

  it("blocks deleting the seeded admin account 'abcd'", async () => {
    const result = await mockBackend.adminDeleteUser(ADMIN, ADMIN);
    // Seeded admin is 'abcd' — must be blocked
    expect(result.__kind__).toBe("err");
  });

  it("blocks admin from deleting themselves", async () => {
    // Admin is 'abcd', trying to delete themselves
    const result = await mockBackend.adminDeleteUser(ADMIN, ADMIN);
    expect(result.__kind__).toBe("err");
  });

  it("deleted user no longer appears in adminListUsers", async () => {
    // Use a fresh username not used in other tests
    await mockBackend.adminDeleteUser(ADMIN, "sarah");
    const users = await mockBackend.adminListUsers(ADMIN);
    const found = users.find((u) => u.username === "sarah");
    expect(found).toBeUndefined();
  });
});
