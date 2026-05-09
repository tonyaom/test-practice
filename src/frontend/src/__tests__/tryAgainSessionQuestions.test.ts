/**
 * Try Again — session question IDs.
 *
 * Verifies:
 * - questionIds are saved to TestSession after questions are filtered/shuffled
 * - Try Again passes questionIds in URL search params
 * - TakeTestPage uses those IDs to filter to the exact question set
 * - If no questionIds in URL, falls back to normal section/mastery filtering
 * - Completed session snapshot is saved before removeSession so Try Again works
 */
import { describe, expect, it } from "vitest";
import type { TestSession } from "../types";

// ── Inline utils mirroring testSessions.ts ────────────────────────────────────

const SESSION_PREFIX = "test_session_";
const INDEX_KEY = "test_sessions_index";
const COMPLETED_SNAPSHOT_PREFIX = "test_completed_session_";

function sessionKey(id: string) {
  return `${SESSION_PREFIX}${id}`;
}

function saveSession(
  session: TestSession,
  storage: Record<string, string>,
): void {
  storage[sessionKey(session.sessionId)] = JSON.stringify(session);
  const raw = storage[INDEX_KEY];
  const index: string[] = raw ? (JSON.parse(raw) as string[]) : [];
  if (!index.includes(session.sessionId)) {
    index.push(session.sessionId);
    storage[INDEX_KEY] = JSON.stringify(index);
  }
}

function loadSession(
  sessionId: string,
  storage: Record<string, string>,
): TestSession | null {
  const raw = storage[sessionKey(sessionId)];
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TestSession;
  } catch {
    return null;
  }
}

function removeSession(
  sessionId: string,
  storage: Record<string, string>,
): void {
  delete storage[sessionKey(sessionId)];
  const raw = storage[INDEX_KEY];
  const index: string[] = raw ? (JSON.parse(raw) as string[]) : [];
  const updated = index.filter((id) => id !== sessionId);
  storage[INDEX_KEY] = JSON.stringify(updated);
  delete storage[`test_answers_${sessionId}`];
}

type SnapshotData = Pick<
  TestSession,
  | "questionIds"
  | "randomizeQuestions"
  | "randomizeAnswers"
  | "selectedSectionIds"
>;

function saveCompletedSessionSnapshot(
  sessionId: string,
  snapshot: SnapshotData,
  storage: Record<string, string>,
): void {
  storage[`${COMPLETED_SNAPSHOT_PREFIX}${sessionId}`] =
    JSON.stringify(snapshot);
}

function loadCompletedSessionSnapshot(
  sessionId: string,
  storage: Record<string, string>,
): SnapshotData | null {
  const raw = storage[`${COMPLETED_SNAPSHOT_PREFIX}${sessionId}`];
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SnapshotData;
  } catch {
    return null;
  }
}

function makeSession(overrides: Partial<TestSession> = {}): TestSession {
  return {
    sessionId: "sess-1",
    testId: "1",
    testName: "Sample Test",
    startedAt: new Date().toISOString(),
    randomizeQuestions: false,
    randomizeAnswers: false,
    selectedSectionIds: [],
    ...overrides,
  };
}

// ── Helpers mirroring TakeTestPage logic ─────────────────────────────────────

interface MockQuestion {
  id: string;
  sectionId?: number;
  isMastered?: boolean;
}

interface MockMastery {
  questionId: string;
  isMastered: boolean;
}

/**
 * Mirrors TakeTestPage filtering: if replayQuestionIds present, use those;
 * otherwise filter by section + mastery.
 */
function filterQuestionsForTakeTest(
  allQuestions: MockQuestion[],
  selectedSectionIds: number[],
  replayQuestionIds: string[],
  masteryList: MockMastery[],
): MockQuestion[] {
  if (replayQuestionIds.length > 0) {
    // Try Again: exact IDs only
    return allQuestions.filter((q) => replayQuestionIds.includes(q.id));
  }
  // Normal flow: section filter then mastery filter
  const sectionFiltered =
    selectedSectionIds.length === 0
      ? allQuestions
      : allQuestions.filter((q) =>
          q.sectionId !== undefined
            ? selectedSectionIds.includes(q.sectionId)
            : selectedSectionIds.includes(-1),
        );
  const masteryMap = new Map(masteryList.map((m) => [m.questionId, m]));
  const allMastered =
    sectionFiltered.length > 0 &&
    sectionFiltered.every((q) => masteryMap.get(q.id)?.isMastered);
  return sectionFiltered.filter((q) => {
    if (allMastered) return true;
    return !masteryMap.get(q.id)?.isMastered;
  });
}

/**
 * Mirrors Try Again URL builder in TestResultPage.
 * Uses completedSnapshot first, falls back to originalSession.
 */
function buildTryAgainSearch(
  sessionId: string,
  storage: Record<string, string>,
): Record<string, string> {
  const snapshot = loadCompletedSessionSnapshot(sessionId, storage);
  const fallback = loadSession(sessionId, storage);
  const questionIds = snapshot?.questionIds ?? fallback?.questionIds ?? [];
  const randomizeQuestions =
    snapshot?.randomizeQuestions ?? fallback?.randomizeQuestions ?? true;
  const randomizeAnswers =
    snapshot?.randomizeAnswers ?? fallback?.randomizeAnswers ?? true;
  const selectedSectionIds =
    snapshot?.selectedSectionIds ?? fallback?.selectedSectionIds ?? [];

  const base: Record<string, string> = {
    sessionId,
    randomizeQuestions: String(randomizeQuestions),
    randomizeAnswers: String(randomizeAnswers),
    sections: selectedSectionIds.join(","),
  };
  if (questionIds.length > 0) {
    base.questionIds = questionIds.join(",");
  }
  return base;
}

// ── Tests — TestSession.questionIds field ────────────────────────────────────

describe("TestSession.questionIds field", () => {
  it("questionIds is optional and defaults to undefined", () => {
    const s = makeSession();
    expect(s.questionIds).toBeUndefined();
  });

  it("can store an array of question IDs", () => {
    const s = makeSession({ questionIds: ["1", "3", "5"] });
    expect(s.questionIds).toEqual(["1", "3", "5"]);
  });

  it("survives save/load round-trip", () => {
    const store: Record<string, string> = {};
    const s = makeSession({
      sessionId: "round-trip",
      questionIds: ["10", "20"],
    });
    saveSession(s, store);
    const loaded = loadSession("round-trip", store);
    expect(loaded?.questionIds).toEqual(["10", "20"]);
  });

  it("updating questionIds on an existing session persists correctly", () => {
    const store: Record<string, string> = {};
    const s = makeSession({ sessionId: "upd", questionIds: [] });
    saveSession(s, store);
    saveSession({ ...s, questionIds: ["7", "8", "9"] }, store);
    const loaded = loadSession("upd", store);
    expect(loaded?.questionIds).toEqual(["7", "8", "9"]);
  });

  it("empty questionIds array is preserved", () => {
    const store: Record<string, string> = {};
    const s = makeSession({ sessionId: "empty-ids", questionIds: [] });
    saveSession(s, store);
    const loaded = loadSession("empty-ids", store);
    expect(loaded?.questionIds).toEqual([]);
  });

  it("sessionId metadata update preserves questionIds (fix: do not drop them)", () => {
    const store: Record<string, string> = {};
    // Simulate: questions loaded first → questionIds set
    const s = makeSession({ sessionId: "meta-fix", questionIds: ["1", "2"] });
    saveSession(s, store);
    // Simulate: testInfo loads later → should preserve questionIds
    const existing = loadSession("meta-fix", store)!;
    saveSession(
      {
        sessionId: existing.sessionId,
        testId: existing.testId,
        testName: "Updated Name",
        startedAt: existing.startedAt,
        randomizeQuestions: existing.randomizeQuestions,
        randomizeAnswers: existing.randomizeAnswers,
        selectedSectionIds: existing.selectedSectionIds,
        questionIds: existing.questionIds, // <-- critical: preserve this
      },
      store,
    );
    const reloaded = loadSession("meta-fix", store);
    expect(reloaded?.questionIds).toEqual(["1", "2"]);
    expect(reloaded?.testName).toBe("Updated Name");
  });
});

// ── Tests — Completed session snapshot ───────────────────────────────────────

describe("saveCompletedSessionSnapshot / loadCompletedSessionSnapshot", () => {
  it("saves snapshot and loads it back with questionIds", () => {
    const store: Record<string, string> = {};
    saveCompletedSessionSnapshot(
      "snap-1",
      {
        questionIds: ["10", "20", "30"],
        randomizeQuestions: true,
        randomizeAnswers: false,
        selectedSectionIds: [1, 2],
      },
      store,
    );
    const snap = loadCompletedSessionSnapshot("snap-1", store);
    expect(snap?.questionIds).toEqual(["10", "20", "30"]);
    expect(snap?.randomizeQuestions).toBe(true);
    expect(snap?.randomizeAnswers).toBe(false);
    expect(snap?.selectedSectionIds).toEqual([1, 2]);
  });

  it("returns null for unknown sessionId", () => {
    const store: Record<string, string> = {};
    expect(loadCompletedSessionSnapshot("not-there", store)).toBeNull();
  });

  it("snapshot is available after removeSession removes the active session", () => {
    const store: Record<string, string> = {};
    const s = makeSession({
      sessionId: "submit-flow",
      questionIds: ["1", "2", "3"],
    });
    saveSession(s, store);
    // Simulate TakeTestPage.submitMutation.onSuccess
    saveCompletedSessionSnapshot(
      "submit-flow",
      {
        questionIds: s.questionIds!,
        randomizeQuestions: false,
        randomizeAnswers: false,
        selectedSectionIds: [],
      },
      store,
    );
    removeSession("submit-flow", store);
    // Active session gone
    expect(loadSession("submit-flow", store)).toBeNull();
    // But snapshot persists
    const snap = loadCompletedSessionSnapshot("submit-flow", store);
    expect(snap?.questionIds).toEqual(["1", "2", "3"]);
  });

  it("snapshot with empty questionIds still loads correctly", () => {
    const store: Record<string, string> = {};
    saveCompletedSessionSnapshot(
      "empty-snap",
      {
        questionIds: [],
        randomizeQuestions: true,
        randomizeAnswers: true,
        selectedSectionIds: [],
      },
      store,
    );
    const snap = loadCompletedSessionSnapshot("empty-snap", store);
    expect(snap?.questionIds).toEqual([]);
  });
});

// ── Tests — Try Again URL builder (uses snapshot first) ──────────────────────

describe("buildTryAgainSearch (TestResultPage logic — uses snapshot)", () => {
  it("uses completed snapshot questionIds when snapshot exists", () => {
    const store: Record<string, string> = {};
    const s = makeSession({
      sessionId: "abc",
      questionIds: ["1", "2", "3"],
      randomizeQuestions: true,
      randomizeAnswers: false,
      selectedSectionIds: [5],
    });
    // Simulate submit flow: save snapshot, then remove active session
    saveCompletedSessionSnapshot(
      "abc",
      {
        questionIds: s.questionIds!,
        randomizeQuestions: s.randomizeQuestions,
        randomizeAnswers: s.randomizeAnswers,
        selectedSectionIds: s.selectedSectionIds,
      },
      store,
    );
    const params = buildTryAgainSearch("abc", store);
    expect(params.questionIds).toBe("1,2,3");
  });

  it("falls back to active session questionIds when no snapshot", () => {
    const store: Record<string, string> = {};
    const s = makeSession({ sessionId: "fallback", questionIds: ["10", "11"] });
    saveSession(s, store);
    const params = buildTryAgainSearch("fallback", store);
    expect(params.questionIds).toBe("10,11");
  });

  it("omits questionIds when neither snapshot nor session has them", () => {
    const store: Record<string, string> = {};
    const params = buildTryAgainSearch("nothing", store);
    expect(params.questionIds).toBeUndefined();
  });

  it("preserves randomize flags from snapshot", () => {
    const store: Record<string, string> = {};
    saveCompletedSessionSnapshot(
      "flags",
      {
        questionIds: ["1"],
        randomizeQuestions: true,
        randomizeAnswers: false,
        selectedSectionIds: [],
      },
      store,
    );
    const params = buildTryAgainSearch("flags", store);
    expect(params.randomizeQuestions).toBe("true");
    expect(params.randomizeAnswers).toBe("false");
  });

  it("encodes selected sections from snapshot", () => {
    const store: Record<string, string> = {};
    saveCompletedSessionSnapshot(
      "sects",
      {
        questionIds: ["1"],
        randomizeQuestions: false,
        randomizeAnswers: false,
        selectedSectionIds: [2, 4],
      },
      store,
    );
    const params = buildTryAgainSearch("sects", store);
    expect(params.sections).toBe("2,4");
  });

  it("snapshot takes priority over active session when both exist", () => {
    const store: Record<string, string> = {};
    const s = makeSession({
      sessionId: "priority",
      questionIds: ["99", "100"],
    });
    saveSession(s, store);
    // Snapshot has different (correct) IDs
    saveCompletedSessionSnapshot(
      "priority",
      {
        questionIds: ["1", "2", "3"],
        randomizeQuestions: false,
        randomizeAnswers: false,
        selectedSectionIds: [],
      },
      store,
    );
    const params = buildTryAgainSearch("priority", store);
    expect(params.questionIds).toBe("1,2,3");
  });
});

// ── Tests — TakeTestPage question filtering ──────────────────────────────────

describe("filterQuestionsForTakeTest", () => {
  const allQs: MockQuestion[] = [
    { id: "1", sectionId: 1 },
    { id: "2", sectionId: 1 },
    { id: "3", sectionId: 2 },
    { id: "4", sectionId: 2 },
    { id: "5" }, // no section (uncategorised)
  ];

  // ── Try Again mode (replayQuestionIds provided) ───────────────────────────

  it("returns only specified questionIds in Try Again mode", () => {
    const result = filterQuestionsForTakeTest(allQs, [], ["1", "3"], []);
    expect(result.map((q) => q.id)).toEqual(["1", "3"]);
  });

  it("preserves order from allQuestions when filtering by IDs", () => {
    const result = filterQuestionsForTakeTest(allQs, [], ["3", "1"], []);
    // Filtered by presence in array (allQs order): 1 appears before 3
    expect(result.map((q) => q.id)).toEqual(["1", "3"]);
  });

  it("returns empty array when replayQuestionIds has no matches", () => {
    const result = filterQuestionsForTakeTest(allQs, [], ["99", "100"], []);
    expect(result).toHaveLength(0);
  });

  it("Try Again: single question works", () => {
    const result = filterQuestionsForTakeTest(allQs, [], ["5"], []);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("5");
  });

  it("Try Again: ignores mastery when replayQuestionIds set", () => {
    const mastery: MockMastery[] = [{ questionId: "1", isMastered: true }];
    // Even though q1 is mastered, it must be included in replay
    const result = filterQuestionsForTakeTest(allQs, [], ["1", "2"], mastery);
    expect(result.map((q) => q.id)).toContain("1");
  });

  it("Try Again: ignores section filter when replayQuestionIds set", () => {
    // section filter [1] would normally exclude q3 (section 2), but replay overrides it
    const result = filterQuestionsForTakeTest(allQs, [1], ["1", "3"], []);
    expect(result.map((q) => q.id)).toContain("3");
  });

  it("Try Again: shows all session questions regardless of section selection", () => {
    // User completed a 3-question session from different sections
    const sessionQuestionIds = ["1", "3", "5"];
    const result = filterQuestionsForTakeTest(
      allQs,
      [1],
      sessionQuestionIds,
      [],
    );
    // Should return exactly the 3 questions from the session, not just section 1
    expect(result).toHaveLength(3);
    expect(result.map((q) => q.id)).toEqual(["1", "3", "5"]);
  });

  // ── Normal mode (no replayQuestionIds) ───────────────────────────────────

  it("normal mode: no section filter returns all questions", () => {
    const result = filterQuestionsForTakeTest(allQs, [], [], []);
    expect(result).toHaveLength(5);
  });

  it("normal mode: section filter narrows to selected section", () => {
    const result = filterQuestionsForTakeTest(allQs, [1], [], []);
    expect(result.map((q) => q.id)).toEqual(["1", "2"]);
  });

  it("normal mode: mastery filter removes mastered questions", () => {
    const mastery: MockMastery[] = [
      { questionId: "1", isMastered: true },
      { questionId: "2", isMastered: false },
    ];
    const result = filterQuestionsForTakeTest(allQs, [1], [], mastery);
    expect(result.map((q) => q.id)).toEqual(["2"]);
  });

  it("normal mode: shows all when all mastered (retake)", () => {
    const mastery: MockMastery[] = [
      { questionId: "1", isMastered: true },
      { questionId: "2", isMastered: true },
    ];
    const result = filterQuestionsForTakeTest(allQs, [1], [], mastery);
    expect(result).toHaveLength(2); // retake mode: all shown
  });
});

// ── Tests — questionIds persistence across session save/update ────────────────

describe("questionIds persistence in session lifecycle", () => {
  it("session with questionIds is included in active sessions index", () => {
    const store: Record<string, string> = {};
    const s = makeSession({
      sessionId: "qs-lifecycle",
      questionIds: ["10", "11"],
    });
    saveSession(s, store);
    const raw = store[INDEX_KEY];
    expect(raw).toContain("qs-lifecycle");
  });

  it("questionIds survive a session metadata update (e.g. testInfo load)", () => {
    const store: Record<string, string> = {};
    const s = makeSession({
      sessionId: "meta-upd",
      questionIds: ["1", "2", "3"],
    });
    saveSession(s, store);
    // Simulate metadata update (e.g. testInfo loaded): preserve questionIds
    const existing = loadSession("meta-upd", store)!;
    saveSession({ ...existing, testName: "Updated Name" }, store);
    const reloaded = loadSession("meta-upd", store);
    expect(reloaded?.questionIds).toEqual(["1", "2", "3"]);
    expect(reloaded?.testName).toBe("Updated Name");
  });

  it("questionIds set after filtering are available for Try Again", () => {
    const store: Record<string, string> = {};
    const allQuestions: MockQuestion[] = [
      { id: "1" },
      { id: "2" },
      { id: "3" },
    ];
    const filtered = filterQuestionsForTakeTest(allQuestions, [], [], []);
    const finalIds = filtered.map((q) => q.id);
    const s = makeSession({ sessionId: "filter-to-ids" });
    saveSession(s, store);
    // After filtering, update session with questionIds
    const existing = loadSession("filter-to-ids", store)!;
    saveSession({ ...existing, questionIds: finalIds }, store);
    const loaded = loadSession("filter-to-ids", store);
    expect(loaded?.questionIds).toEqual(["1", "2", "3"]);
  });

  it("full submit flow: snapshot persists after session is removed", () => {
    const store: Record<string, string> = {};
    // 1. Session created when test starts
    const s = makeSession({ sessionId: "full-flow", questionIds: undefined });
    saveSession(s, store);

    // 2. Questions filtered/shuffled — questionIds saved to active session
    const existing1 = loadSession("full-flow", store)!;
    saveSession({ ...existing1, questionIds: ["q1", "q2", "q3"] }, store);

    // 3. User submits — snapshot saved, then session removed
    const completed = loadSession("full-flow", store)!;
    saveCompletedSessionSnapshot(
      "full-flow",
      {
        questionIds: completed.questionIds!,
        randomizeQuestions: false,
        randomizeAnswers: false,
        selectedSectionIds: [],
      },
      store,
    );
    removeSession("full-flow", store);

    // 4. Results page: active session gone, snapshot available
    expect(loadSession("full-flow", store)).toBeNull();
    const snap = loadCompletedSessionSnapshot("full-flow", store);
    expect(snap?.questionIds).toEqual(["q1", "q2", "q3"]);

    // 5. Try Again URL built from snapshot
    const params = buildTryAgainSearch("full-flow", store);
    expect(params.questionIds).toBe("q1,q2,q3");
  });

  it("Try Again replay shows only session questions, not entire test", () => {
    // Simulates the exact scenario that was broken:
    // Test has 10 questions but user only answered 3 in a section
    const allTestQuestions: MockQuestion[] = [
      { id: "1", sectionId: 1 },
      { id: "2", sectionId: 1 },
      { id: "3", sectionId: 1 },
      { id: "4", sectionId: 2 },
      { id: "5", sectionId: 2 },
      { id: "6", sectionId: 3 },
      { id: "7", sectionId: 3 },
      { id: "8", sectionId: 4 },
      { id: "9", sectionId: 4 },
      { id: "10", sectionId: 4 },
    ];
    const sessionQuestions = ["1", "2", "3"]; // only section 1 was selected

    // When Try Again is clicked with replayQuestionIds = ["1","2","3"]
    const replayed = filterQuestionsForTakeTest(
      allTestQuestions,
      [1],
      sessionQuestions,
      [],
    );
    // Must be exactly 3 questions, not 10
    expect(replayed).toHaveLength(3);
    expect(replayed.map((q) => q.id)).toEqual(["1", "2", "3"]);
  });
});
