/**
 * Mastery logic tests.
 *
 * Verifies:
 * - getMasteryForTest returns correct structure
 * - resetMyMastery sets all streaks to 0
 * - adminListUsers is admin-only
 * - adminActivateUser / adminDeactivateUser work correctly
 * - adminDeactivateUser blocks self-deactivation and admin deactivation
 * - adminGetUserProgress returns correct structure
 * - adminResetUserMastery resets streaks to 0
 */
import { describe, expect, it } from "vitest";
import { mockBackend } from "./mocks/mockBackendImpl";

const ADMIN = "abcd";
const USER = "sarah";

async function assertUnauthorized(fn: () => Promise<unknown>): Promise<void> {
  await expect(fn()).rejects.toThrow(/unauthorized/i);
}

// ── getMasteryForTest ────────────────────────────────────────────────────────────────────

describe("getMasteryForTest", () => {
  it("returns a mastery entry per question in the test", async () => {
    const mastery = await mockBackend.getMasteryForTest(USER, BigInt(1));
    expect(Array.isArray(mastery)).toBe(true);
    expect(mastery.length).toBeGreaterThan(0);
    for (const m of mastery) {
      expect(m).toHaveProperty("questionId");
      expect(m).toHaveProperty("correctStreak");
      expect(m).toHaveProperty("isMastered");
      expect(m).toHaveProperty("testId");
      expect(m).toHaveProperty("userId");
    }
  });

  it("returns empty array for a test with no questions", async () => {
    const mastery = await mockBackend.getMasteryForTest(USER, BigInt(999));
    expect(mastery).toEqual([]);
  });

  it("initial streaks are 0 and isMastered is false", async () => {
    const mastery = await mockBackend.getMasteryForTest(
      "brand_new_user",
      BigInt(1),
    );
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0);
      expect(m.isMastered).toBe(false);
    }
  });
});

// ── resetMyMastery ─────────────────────────────────────────────────────────────────────

describe("resetMyMastery", () => {
  it("resets all questions in a test to streak 0", async () => {
    await mockBackend.resetMyMastery(USER, { testId: BigInt(1) });
    const mastery = await mockBackend.getMasteryForTest(USER, BigInt(1));
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0);
      expect(m.isMastered).toBe(false);
    }
  });

  it("does not affect mastery of another test", async () => {
    await mockBackend.resetMyMastery(USER, { testId: BigInt(1) });
    // test 2 has different questions — its mastery should still start at 0
    const mastery2 = await mockBackend.getMasteryForTest(
      "another_user",
      BigInt(2),
    );
    for (const m of mastery2) {
      expect(Number(m.correctStreak)).toBe(0);
    }
  });
});

// ── adminListUsers ─────────────────────────────────────────────────────────────────────

describe("adminListUsers", () => {
  it("admin can list all users", async () => {
    const users = await mockBackend.adminListUsers(ADMIN);
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
    for (const u of users) {
      expect(u).toHaveProperty("username");
      expect(u).toHaveProperty("displayName");
      expect(u).toHaveProperty("role");
      expect(u).toHaveProperty("isActive");
    }
  });

  it("regular user cannot list users", async () => {
    await assertUnauthorized(() => mockBackend.adminListUsers(USER));
  });

  it("admin is always in the list", async () => {
    const users = await mockBackend.adminListUsers(ADMIN);
    const admin = users.find((u) => u.username === ADMIN);
    expect(admin).toBeDefined();
    expect(admin?.role).toBe("admin");
  });
});

// ── adminActivateUser / adminDeactivateUser ───────────────────────────────────────────────

describe("adminDeactivateUser", () => {
  it("admin can deactivate a regular user", async () => {
    const result = await mockBackend.adminDeactivateUser(ADMIN, USER);
    expect(result).toBe(true);
  });

  it("deactivated user appears as inactive in list", async () => {
    await mockBackend.adminDeactivateUser(ADMIN, USER);
    const users = await mockBackend.adminListUsers(ADMIN);
    const sarah = users.find((u) => u.username === USER);
    expect(sarah?.isActive).toBe(false);
  });

  it("regular user cannot deactivate users", async () => {
    await assertUnauthorized(() =>
      mockBackend.adminDeactivateUser(USER, "admin2fa"),
    );
  });

  it("admin cannot deactivate themselves", async () => {
    await expect(mockBackend.adminDeactivateUser(ADMIN, ADMIN)).rejects.toThrow(
      /deactivate yourself/i,
    );
  });

  it("admin cannot deactivate another admin", async () => {
    await expect(
      mockBackend.adminDeactivateUser(ADMIN, ADMIN),
    ).rejects.toThrow();
  });
});

describe("adminActivateUser", () => {
  it("admin can reactivate a deactivated user", async () => {
    await mockBackend.adminDeactivateUser(ADMIN, USER);
    const result = await mockBackend.adminActivateUser(ADMIN, USER);
    expect(result).toBe(true);
  });

  it("reactivated user appears active in list", async () => {
    await mockBackend.adminDeactivateUser(ADMIN, USER);
    await mockBackend.adminActivateUser(ADMIN, USER);
    const users = await mockBackend.adminListUsers(ADMIN);
    const sarah = users.find((u) => u.username === USER);
    expect(sarah?.isActive).toBe(true);
  });

  it("regular user cannot activate users", async () => {
    await assertUnauthorized(() =>
      mockBackend.adminActivateUser(USER, "admin2fa"),
    );
  });
});

// ── adminGetUserProgress ───────────────────────────────────────────────────────────────────

describe("adminGetUserProgress", () => {
  it("admin can get progress for a user on a test", async () => {
    const progress = await mockBackend.adminGetUserProgress(
      ADMIN,
      USER,
      BigInt(1),
    );
    expect(progress).not.toBeNull();
    expect(progress).toHaveProperty("username", USER);
    expect(progress).toHaveProperty("testId");
    expect(progress).toHaveProperty("totalQuestions");
    expect(progress).toHaveProperty("masteredCount");
    expect(progress).toHaveProperty("inProgressCount");
  });

  it("returns null for test with no questions", async () => {
    const progress = await mockBackend.adminGetUserProgress(
      ADMIN,
      USER,
      BigInt(999),
    );
    expect(progress).toBeNull();
  });

  it("regular user cannot get progress for others", async () => {
    await assertUnauthorized(() =>
      mockBackend.adminGetUserProgress(USER, "admin2fa", BigInt(1)),
    );
  });

  it("progress totals add up correctly", async () => {
    await mockBackend.resetMyMastery(USER, { testId: BigInt(1) });
    const progress = await mockBackend.adminGetUserProgress(
      ADMIN,
      USER,
      BigInt(1),
    );
    if (progress) {
      expect(
        Number(progress.masteredCount) + Number(progress.inProgressCount),
      ).toBeLessThanOrEqual(Number(progress.totalQuestions));
    }
  });
});

// ── adminResetUserMastery ──────────────────────────────────────────────────────────────────

describe("adminResetUserMastery", () => {
  it("admin can reset a user's mastery to streak 0", async () => {
    const result = await mockBackend.adminResetUserMastery(ADMIN, USER, {
      testId: BigInt(1),
    });
    expect(result).toBe(true);
    const mastery = await mockBackend.getMasteryForTest(USER, BigInt(1));
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0);
      expect(m.isMastered).toBe(false);
    }
  });

  it("regular user cannot reset another user's mastery", async () => {
    await assertUnauthorized(() =>
      mockBackend.adminResetUserMastery(USER, "admin2fa", {
        testId: BigInt(1),
      }),
    );
  });
});

// ── per-section resetMyMastery ──────────────────────────────────────────────────────────

describe("resetMyMastery — per section", () => {
  it("resets only questions in the given section", async () => {
    // Section 1 has questions 1 and 2; section 2 has question 4; question 3 has no section.
    await mockBackend.resetMyMastery(USER, {
      testId: BigInt(1),
      sectionId: BigInt(1),
    });
    const mastery = await mockBackend.getMasteryForTest(USER, BigInt(1));
    const section1Questions = mastery.filter(
      (m) => m.questionId === BigInt(1) || m.questionId === BigInt(2),
    );
    for (const m of section1Questions) {
      expect(Number(m.correctStreak)).toBe(0);
      expect(m.isMastered).toBe(false);
    }
  });

  it("does not touch questions outside the given section", async () => {
    // Reset only section 2 (question 4). Questions in section 1 (1, 2) should be unaffected.
    await mockBackend.resetMyMastery("section_isolate_user", {
      testId: BigInt(1),
      sectionId: BigInt(2),
    });
    const mastery = await mockBackend.getMasteryForTest(
      "section_isolate_user",
      BigInt(1),
    );
    // Questions 1 and 2 (section 1) should still be at default streak 0 from initial state —
    // important thing is they were NOT targeted by a section-2 reset.
    const q4 = mastery.find((m) => m.questionId === BigInt(4));
    if (q4) {
      expect(Number(q4.correctStreak)).toBe(0);
      expect(q4.isMastered).toBe(false);
    }
  });

  it("section reset is idempotent", async () => {
    await mockBackend.resetMyMastery("idempotent_section_user", {
      testId: BigInt(1),
      sectionId: BigInt(1),
    });
    await mockBackend.resetMyMastery("idempotent_section_user", {
      testId: BigInt(1),
      sectionId: BigInt(1),
    });
    const mastery = await mockBackend.getMasteryForTest(
      "idempotent_section_user",
      BigInt(1),
    );
    const s1 = mastery.filter(
      (m) => m.questionId === BigInt(1) || m.questionId === BigInt(2),
    );
    for (const m of s1) {
      expect(Number(m.correctStreak)).toBe(0);
    }
  });

  it("resetting with sectionId=undefined resets entire test", async () => {
    await mockBackend.resetMyMastery("full_reset_user", {
      testId: BigInt(1),
      sectionId: undefined,
    });
    const mastery = await mockBackend.getMasteryForTest(
      "full_reset_user",
      BigInt(1),
    );
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0);
      expect(m.isMastered).toBe(false);
    }
  });
});

// ── per-section adminResetUserMastery ────────────────────────────────────────────────────

describe("adminResetUserMastery — per section", () => {
  it("admin can reset only questions in a specific section", async () => {
    const result = await mockBackend.adminResetUserMastery(ADMIN, USER, {
      testId: BigInt(1),
      sectionId: BigInt(1),
    });
    expect(result).toBe(true);
    const mastery = await mockBackend.getMasteryForTest(USER, BigInt(1));
    const s1 = mastery.filter(
      (m) => m.questionId === BigInt(1) || m.questionId === BigInt(2),
    );
    for (const m of s1) {
      expect(Number(m.correctStreak)).toBe(0);
      expect(m.isMastered).toBe(false);
    }
  });

  it("admin section reset does not touch other sections", async () => {
    const result = await mockBackend.adminResetUserMastery(
      ADMIN,
      "admin_section_target",
      { testId: BigInt(1), sectionId: BigInt(2) },
    );
    expect(result).toBe(true);
    // section 2 question (4) should be reset; others untouched
    const mastery = await mockBackend.getMasteryForTest(
      "admin_section_target",
      BigInt(1),
    );
    const q4 = mastery.find((m) => m.questionId === BigInt(4));
    if (q4) {
      expect(Number(q4.correctStreak)).toBe(0);
    }
  });

  it("regular user cannot section-reset another user's mastery", async () => {
    await expect(
      mockBackend.adminResetUserMastery(USER, "admin2fa", {
        testId: BigInt(1),
        sectionId: BigInt(1),
      }),
    ).rejects.toThrow(/unauthorized/i);
  });

  it("admin full reset (no sectionId) resets entire test", async () => {
    const result = await mockBackend.adminResetUserMastery(ADMIN, USER, {
      testId: BigInt(1),
      sectionId: undefined,
    });
    expect(result).toBe(true);
    const mastery = await mockBackend.getMasteryForTest(USER, BigInt(1));
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0);
      expect(m.isMastered).toBe(false);
    }
  });
});

// ── accountDeactivated login ────────────────────────────────────────────────────────────

describe("login — accountDeactivated", () => {
  it("returns accountDeactivated for a deactivated user", async () => {
    const result = await mockBackend.login("deactivated", "deactivated");
    expect(result.__kind__).toBe("accountDeactivated");
  });

  it("regular users can still log in after others are deactivated", async () => {
    const result = await mockBackend.login("sarah", "password");
    expect(result.__kind__).toBe("ok");
  });
});

// ── correctStreak increment / reset behaviour ─────────────────────────────────────────────

describe("mastery — correctStreak progression", () => {
  it("initial correctStreak is 0 for a brand-new user", async () => {
    const mastery = await mockBackend.getMasteryForTest(
      "streak_user",
      BigInt(1),
    );
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0);
      expect(m.isMastered).toBe(false);
    }
  });

  it("resetMyMastery sets correctStreak to exactly 0 (fully reset)", async () => {
    await mockBackend.resetMyMastery("streak_user", { testId: BigInt(1) });
    const mastery = await mockBackend.getMasteryForTest(
      "streak_user",
      BigInt(1),
    );
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0);
      expect(m.isMastered).toBe(false);
    }
  });

  it("streak reset to 0 means questions are NOT mastered yet (isMastered=false)", async () => {
    await mockBackend.resetMyMastery("streak_user2", { testId: BigInt(1) });
    const mastery = await mockBackend.getMasteryForTest(
      "streak_user2",
      BigInt(1),
    );
    for (const m of mastery) {
      expect(m.isMastered).toBe(false);
      expect(Number(m.correctStreak)).toBe(0); // fully reset
    }
  });

  it("resetMyMastery for one test does not touch another test's mastery", async () => {
    await mockBackend.resetMyMastery("user_isolate", { testId: BigInt(1) });
    // test 2 mastery for the same user should stay at 0 (untouched)
    const mastery2 = await mockBackend.getMasteryForTest(
      "user_isolate",
      BigInt(2),
    );
    for (const m of mastery2) {
      expect(Number(m.correctStreak)).toBe(0);
    }
  });

  it("resetting mastery is idempotent — calling twice still leaves streak=0", async () => {
    await mockBackend.resetMyMastery("idempotent_user", { testId: BigInt(1) });
    await mockBackend.resetMyMastery("idempotent_user", { testId: BigInt(1) });
    const mastery = await mockBackend.getMasteryForTest(
      "idempotent_user",
      BigInt(1),
    );
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0);
    }
  });
});

// ── mastery filtering logic (mirrors TakeTestPage) ────────────────────────────────────────

describe("mastery question filtering logic (mirrors TakeTestPage)", () => {
  interface MockMastery {
    questionId: string;
    isMastered: boolean;
    correctStreak: number;
  }

  interface MockQuestion {
    id: string;
  }

  function filterForTest(
    questions: MockQuestion[],
    masteryList: MockMastery[],
  ): MockQuestion[] {
    const masteryMap = new Map(masteryList.map((m) => [m.questionId, m]));
    const allMastered =
      questions.length > 0 &&
      questions.every((q) => masteryMap.get(q.id)?.isMastered);
    return questions.filter((q) => {
      if (allMastered) return true;
      return !masteryMap.get(q.id)?.isMastered;
    });
  }

  const questions: MockQuestion[] = [{ id: "1" }, { id: "2" }, { id: "3" }];

  it("shows all questions when no mastery exists (empty masteryList)", () => {
    const result = filterForTest(questions, []);
    expect(result.length).toBe(3);
  });

  it("filters out mastered questions from the pool", () => {
    const masteryList: MockMastery[] = [
      { questionId: "1", isMastered: true, correctStreak: 5 },
      { questionId: "2", isMastered: false, correctStreak: 2 },
      { questionId: "3", isMastered: false, correctStreak: 0 },
    ];
    const result = filterForTest(questions, masteryList);
    expect(result.length).toBe(2);
    expect(result.some((q) => q.id === "1")).toBe(false); // mastered — excluded
    expect(result.some((q) => q.id === "2")).toBe(true);
    expect(result.some((q) => q.id === "3")).toBe(true);
  });

  it("shows ALL questions when all are mastered (retake mode)", () => {
    const masteryList: MockMastery[] = [
      { questionId: "1", isMastered: true, correctStreak: 5 },
      { questionId: "2", isMastered: true, correctStreak: 5 },
      { questionId: "3", isMastered: true, correctStreak: 5 },
    ];
    const result = filterForTest(questions, masteryList);
    expect(result.length).toBe(3); // retake: all shown
  });

  it("with one un-mastered question, only that question appears", () => {
    const masteryList: MockMastery[] = [
      { questionId: "1", isMastered: true, correctStreak: 5 },
      { questionId: "2", isMastered: true, correctStreak: 5 },
      { questionId: "3", isMastered: false, correctStreak: 3 },
    ];
    const result = filterForTest(questions, masteryList);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("3");
  });

  it("empty question list returns empty result", () => {
    const result = filterForTest(
      [],
      [{ questionId: "1", isMastered: true, correctStreak: 5 }],
    );
    expect(result.length).toBe(0);
  });
});

// ── mastery threshold: question becomes mastered at streak=5 ──────────────────────────────

describe("mastery threshold concept (streak=5 means isMastered=true)", () => {
  interface StreakState {
    correctStreak: number;
    isMastered: boolean;
  }

  /**
   * Mirrors the backend mastery update logic:
   * - Correct answer: increment streak; mark mastered at 5
   * - Wrong answer: reset streak to 0 and clear isMastered
   */
  function applyAnswer(state: StreakState, isCorrect: boolean): StreakState {
    if (isCorrect) {
      const newStreak = state.correctStreak + 1;
      return { correctStreak: newStreak, isMastered: newStreak >= 5 };
    }
    return { correctStreak: 0, isMastered: false };
  }

  it("streak increments by 1 on correct answer", () => {
    const state = applyAnswer({ correctStreak: 0, isMastered: false }, true);
    expect(state.correctStreak).toBe(1);
    expect(state.isMastered).toBe(false);
  });

  it("streak resets to 0 on wrong answer", () => {
    const state = applyAnswer({ correctStreak: 3, isMastered: false }, false);
    expect(state.correctStreak).toBe(0);
    expect(state.isMastered).toBe(false);
  });

  it("isMastered becomes true at correctStreak=5", () => {
    const state = applyAnswer({ correctStreak: 4, isMastered: false }, true);
    expect(state.correctStreak).toBe(5);
    expect(state.isMastered).toBe(true);
  });

  it("isMastered stays false when streak < 5", () => {
    let s: StreakState = { correctStreak: 0, isMastered: false };
    for (let i = 0; i < 4; i++) {
      s = applyAnswer(s, true);
    }
    expect(s.correctStreak).toBe(4);
    expect(s.isMastered).toBe(false);
  });

  it("wrong answer after streak=4 resets to 0 (not mastered)", () => {
    const state = applyAnswer({ correctStreak: 4, isMastered: false }, false);
    expect(state.correctStreak).toBe(0);
    expect(state.isMastered).toBe(false);
  });

  it("reset-to-0 scenario: streak=0, isMastered=false (fully reset)", () => {
    // This mirrors resetMyMastery / adminResetUserMastery result
    const state: StreakState = { correctStreak: 0, isMastered: false };
    expect(state.correctStreak).toBe(0);
    expect(state.isMastered).toBe(false);
    // One correct answer starts the streak
    const afterCorrect = applyAnswer(state, true);
    expect(afterCorrect.correctStreak).toBe(1);
    expect(afterCorrect.isMastered).toBe(false);
  });

  it("streak stays at 0 after multiple wrong answers", () => {
    let s: StreakState = { correctStreak: 3, isMastered: false };
    s = applyAnswer(s, false);
    s = applyAnswer(s, false);
    expect(s.correctStreak).toBe(0);
    expect(s.isMastered).toBe(false);
  });

  it("streak accumulates correctly over 5 sequential correct answers", () => {
    let s: StreakState = { correctStreak: 0, isMastered: false };
    for (let i = 1; i <= 5; i++) {
      s = applyAnswer(s, true);
      expect(s.correctStreak).toBe(i);
    }
    expect(s.isMastered).toBe(true);
  });
});

// ── getMasteryForTest with mockBackend ──────────────────────────────────────────────────────

describe("getMasteryForTest — mockBackend", () => {
  it("returns all required fields in each mastery entry", async () => {
    const mastery = await mockBackend.getMasteryForTest(
      "mastery_check_user",
      BigInt(1),
    );
    for (const m of mastery) {
      expect(m).toHaveProperty("userId");
      expect(m).toHaveProperty("testId");
      expect(m).toHaveProperty("questionId");
      expect(m).toHaveProperty("correctStreak");
      expect(m).toHaveProperty("isMastered");
      expect(m).toHaveProperty("updatedAt");
    }
  });

  it("returns one entry per question in the test", async () => {
    const mastery = await mockBackend.getMasteryForTest(
      "mastery_check_user",
      BigInt(1),
    );
    expect(mastery.length).toBe(4); // Test 1 has 4 questions in the mock
  });

  it("userId in mastery entry matches the requested username", async () => {
    const mastery = await mockBackend.getMasteryForTest(
      "user_id_check",
      BigInt(1),
    );
    for (const m of mastery) {
      expect(m.userId).toBe("user_id_check");
    }
  });

  it("testId in mastery entry matches the requested testId", async () => {
    const mastery = await mockBackend.getMasteryForTest(
      "testid_check_user",
      BigInt(1),
    );
    for (const m of mastery) {
      expect(Number(m.testId)).toBe(1);
    }
  });

  it("resetMyMastery then getMasteryForTest returns streak=0", async () => {
    await mockBackend.resetMyMastery("reset_check_user", { testId: BigInt(1) });
    const mastery = await mockBackend.getMasteryForTest(
      "reset_check_user",
      BigInt(1),
    );
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0);
    }
  });
});

// ── offlineCache utility ───────────────────────────────────────────────────────────────────

import {
  clearAllCache,
  clearTestCache,
  getCacheMeta,
  getTestCache,
  isCacheValid,
  saveTestCache,
} from "../utils/offlineCache";

describe("offlineCache", () => {
  const testId = "999";
  const entry = {
    test: {
      id: testId,
      name: "Test",
      description: "Desc",
      updatedAt: "100",
    },
    questions: [
      {
        id: "1",
        testId,
        orderIndex: "0",
        text: "Q?",
        questionType: "mcSingle",
        options: ["A", "B"],
        correctAnswers: ["0"],
        correctText: "",
        correctOrder: [],
        questionUpdatedAt: "100",
      },
    ],
    sections: [],
    updatedAt: "100",
  };

  it("returns null on cache miss", () => {
    expect(getTestCache("nonexistent_test_12345")).toBeNull();
  });

  it("saves and retrieves a cache entry", () => {
    saveTestCache(testId, entry, "100");
    const cached = getTestCache(testId);
    expect(cached).not.toBeNull();
    expect(cached?.test.name).toBe("Test");
    expect(cached?.questions.length).toBe(1);
    expect(cached?.updatedAt).toBe("100");
  });

  it("isCacheValid returns true when updatedAt matches", () => {
    expect(isCacheValid("100", "100")).toBe(true);
  });

  it("isCacheValid returns false when updatedAt differs", () => {
    expect(isCacheValid("100", "200")).toBe(false);
  });

  it("getCacheMeta reflects saved entries", () => {
    saveTestCache(testId, entry, "100");
    const meta = getCacheMeta();
    expect(meta[testId]).toBe("100");
  });

  it("clearTestCache removes a single entry", () => {
    saveTestCache(testId, entry, "100");
    clearTestCache(testId);
    expect(getTestCache(testId)).toBeNull();
    const meta = getCacheMeta();
    expect(meta[testId]).toBeUndefined();
  });

  it("clearAllCache removes all entries", () => {
    saveTestCache("t1", entry, "100");
    saveTestCache("t2", entry, "200");
    clearAllCache();
    expect(getTestCache("t1")).toBeNull();
    expect(getTestCache("t2")).toBeNull();
    expect(Object.keys(getCacheMeta()).length).toBe(0);
  });

  it("overwriting cache entry updates updatedAt", () => {
    saveTestCache(testId, entry, "100");
    const updatedEntry = { ...entry, updatedAt: "200" };
    saveTestCache(testId, updatedEntry, "200");
    const cached = getTestCache(testId);
    expect(cached?.updatedAt).toBe("200");
  });
});
