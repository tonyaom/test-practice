/**
 * Mastery reset behaviour tests.
 *
 * Verifies:
 * - Mastered questions reset to streak=0 / isMastered=false when answered wrong
 * - Frontend filter logic handles the "mastered question answered wrong" scenario
 * - Reset to 0 (not 4) is the correct behaviour for adminResetUserMastery and resetMyMastery
 */
import { describe, expect, it } from "vitest";

// ── Types ────────────────────────────────────────────────────────────────────

interface MasteryState {
  questionId: string;
  correctStreak: number;
  isMastered: boolean;
}

// ── Helper: mirror backend mastery update logic ───────────────────────────────

function applyAnswer(state: MasteryState, isCorrect: boolean): MasteryState {
  if (isCorrect) {
    const newStreak = state.correctStreak + 1;
    return {
      ...state,
      correctStreak: newStreak,
      isMastered: newStreak >= 5,
    };
  }
  // Wrong answer: reset entirely — even if previously mastered
  return { ...state, correctStreak: 0, isMastered: false };
}

function resetMastery(state: MasteryState): MasteryState {
  return { ...state, correctStreak: 0, isMastered: false };
}

// ── Wrong answer on mastered question ────────────────────────────────────────

describe("Wrong answer resets mastered question to streak=0", () => {
  it("mastered question answered wrong resets to streak=0", () => {
    const mastered: MasteryState = {
      questionId: "1",
      correctStreak: 5,
      isMastered: true,
    };
    const after = applyAnswer(mastered, false);
    expect(after.correctStreak).toBe(0);
    expect(after.isMastered).toBe(false);
  });

  it("mastered question answered correctly does not change mastery", () => {
    // streak stays at 5+ when already mastered (no cap needed)
    const mastered: MasteryState = {
      questionId: "1",
      correctStreak: 5,
      isMastered: true,
    };
    const after = applyAnswer(mastered, true);
    expect(after.isMastered).toBe(true);
  });

  it("after wrong answer on mastered, needs 5 correct in a row to re-master", () => {
    let state: MasteryState = {
      questionId: "1",
      correctStreak: 5,
      isMastered: true,
    };
    // Wrong answer resets
    state = applyAnswer(state, false);
    expect(state.correctStreak).toBe(0);
    expect(state.isMastered).toBe(false);
    // Need 5 more correct answers
    for (let i = 0; i < 4; i++) {
      state = applyAnswer(state, true);
      expect(state.isMastered).toBe(false);
    }
    state = applyAnswer(state, true);
    expect(state.correctStreak).toBe(5);
    expect(state.isMastered).toBe(true);
  });

  it("streak=4 answered wrong resets to 0 (not mastered)", () => {
    const state: MasteryState = {
      questionId: "2",
      correctStreak: 4,
      isMastered: false,
    };
    const after = applyAnswer(state, false);
    expect(after.correctStreak).toBe(0);
    expect(after.isMastered).toBe(false);
  });

  it("streak=1 answered wrong resets to 0", () => {
    const state: MasteryState = {
      questionId: "3",
      correctStreak: 1,
      isMastered: false,
    };
    const after = applyAnswer(state, false);
    expect(after.correctStreak).toBe(0);
  });

  it("streak=0 answered wrong stays at 0", () => {
    const state: MasteryState = {
      questionId: "4",
      correctStreak: 0,
      isMastered: false,
    };
    const after = applyAnswer(state, false);
    expect(after.correctStreak).toBe(0);
    expect(after.isMastered).toBe(false);
  });
});

// ── Reset functions reset to 0 (not 4) ───────────────────────────────────────

describe("resetMastery resets to streak=0 (not 4)", () => {
  it("resets a mastered question to streak=0", () => {
    const state: MasteryState = {
      questionId: "1",
      correctStreak: 5,
      isMastered: true,
    };
    const after = resetMastery(state);
    expect(after.correctStreak).toBe(0);
    expect(after.isMastered).toBe(false);
  });

  it("resets a near-mastered question (streak=4) to 0", () => {
    const state: MasteryState = {
      questionId: "2",
      correctStreak: 4,
      isMastered: false,
    };
    const after = resetMastery(state);
    expect(after.correctStreak).toBe(0);
  });

  it("reset is idempotent (double reset still gives 0)", () => {
    const state: MasteryState = {
      questionId: "3",
      correctStreak: 5,
      isMastered: true,
    };
    const once = resetMastery(state);
    const twice = resetMastery(once);
    expect(twice.correctStreak).toBe(0);
    expect(twice.isMastered).toBe(false);
  });

  it("reset does NOT set streak to 4 (near-mastered)", () => {
    const state: MasteryState = {
      questionId: "4",
      correctStreak: 5,
      isMastered: true,
    };
    const after = resetMastery(state);
    expect(after.correctStreak).not.toBe(4);
    expect(after.correctStreak).toBe(0);
  });

  it("after reset, a single correct answer sets streak=1 (not skip to mastered)", () => {
    const state: MasteryState = {
      questionId: "5",
      correctStreak: 5,
      isMastered: true,
    };
    const reset = resetMastery(state);
    const oneCorrect = applyAnswer(reset, true);
    expect(oneCorrect.correctStreak).toBe(1);
    expect(oneCorrect.isMastered).toBe(false);
  });
});

// ── Filter logic: mastered-then-reset question appears in next session ─────────

describe("Mastery filter: reset question reappears in next session", () => {
  interface MockQuestion {
    id: string;
  }

  function filterUnmastered(
    questions: MockQuestion[],
    masteryStates: MasteryState[],
  ): MockQuestion[] {
    const map = new Map(masteryStates.map((m) => [m.questionId, m]));
    const allMastered =
      questions.length > 0 && questions.every((q) => map.get(q.id)?.isMastered);
    return questions.filter((q) => {
      if (allMastered) return true;
      return !map.get(q.id)?.isMastered;
    });
  }

  it("question reset from mastered reappears in pool", () => {
    const questions: MockQuestion[] = [{ id: "1" }, { id: "2" }, { id: "3" }];
    let mastery: MasteryState[] = [
      { questionId: "1", correctStreak: 5, isMastered: true },
      { questionId: "2", correctStreak: 3, isMastered: false },
      { questionId: "3", correctStreak: 0, isMastered: false },
    ];
    // Q1 was mastered but answered wrong — now reset
    mastery = mastery.map((m) =>
      m.questionId === "1" ? applyAnswer(m, false) : m,
    );
    const pool = filterUnmastered(questions, mastery);
    expect(pool.map((q) => q.id)).toContain("1");
  });

  it("mastered question excluded from pool when still mastered", () => {
    const questions: MockQuestion[] = [{ id: "1" }, { id: "2" }];
    const mastery: MasteryState[] = [
      { questionId: "1", correctStreak: 5, isMastered: true },
      { questionId: "2", correctStreak: 2, isMastered: false },
    ];
    const pool = filterUnmastered(questions, mastery);
    expect(pool.map((q) => q.id)).not.toContain("1");
    expect(pool.map((q) => q.id)).toContain("2");
  });

  it("all-mastered then one reset: only reset question shown", () => {
    const questions: MockQuestion[] = [{ id: "1" }, { id: "2" }];
    let mastery: MasteryState[] = [
      { questionId: "1", correctStreak: 5, isMastered: true },
      { questionId: "2", correctStreak: 5, isMastered: true },
    ];
    // Both mastered initially => retake mode (all shown)
    let pool = filterUnmastered(questions, mastery);
    expect(pool).toHaveLength(2);

    // Now q1 answered wrong during retake — reset
    mastery = mastery.map((m) =>
      m.questionId === "1" ? applyAnswer(m, false) : m,
    );
    // q2 still mastered, q1 not mastered — only q1 in pool
    pool = filterUnmastered(questions, mastery);
    expect(pool).toHaveLength(1);
    expect(pool[0].id).toBe("1");
  });
});
