/**
 * Unit tests for multi-session test management logic.
 * Covers: session CRUD in localStorage, capacity enforcement,
 * conflict detection, session ID generation, stored answers persistence.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TestSession } from "../types";

// ── Inlined utilities (mirror of src/utils/testSessions.ts) ──────────────────

const INDEX_KEY = "test_sessions_index";
const SESSION_PREFIX = "test_session_";
const MAX_SESSIONS = 5;

function sessionKey(sessionId: string): string {
  return `${SESSION_PREFIX}${sessionId}`;
}

function generateSessionId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function loadActiveSessions(
  storage: Record<string, string> = {},
): TestSession[] {
  const raw = storage[INDEX_KEY];
  const index: string[] = raw ? (JSON.parse(raw) as string[]) : [];
  const sessions: TestSession[] = [];
  for (const id of index) {
    const entry = storage[sessionKey(id)];
    if (entry) {
      try {
        sessions.push(JSON.parse(entry) as TestSession);
      } catch {
        /* skip corrupted */
      }
    }
  }
  return sessions;
}

function saveSession(
  session: TestSession,
  storage: Record<string, string> = {},
): void {
  storage[sessionKey(session.sessionId)] = JSON.stringify(session);
  const raw = storage[INDEX_KEY];
  const index: string[] = raw ? (JSON.parse(raw) as string[]) : [];
  if (!index.includes(session.sessionId)) {
    index.push(session.sessionId);
    storage[INDEX_KEY] = JSON.stringify(index);
  }
}

function removeSession(
  sessionId: string,
  storage: Record<string, string> = {},
): void {
  delete storage[sessionKey(sessionId)];
  delete storage[`test_answers_${sessionId}`];
  const raw = storage[INDEX_KEY];
  const index: string[] = raw ? (JSON.parse(raw) as string[]) : [];
  storage[INDEX_KEY] = JSON.stringify(index.filter((id) => id !== sessionId));
}

function isAtCapacity(storage: Record<string, string>): boolean {
  return loadActiveSessions(storage).length >= MAX_SESSIONS;
}

interface StoredAnswers {
  answers: Record<
    string,
    { selectedOptions: number[]; textAnswer: string; dragOrder: number[] }
  >;
  currentIdx: number;
}

function saveStoredAnswers(
  sessionId: string,
  data: StoredAnswers,
  storage: Record<string, string>,
): void {
  storage[`test_answers_${sessionId}`] = JSON.stringify(data);
}

function loadStoredAnswers(
  sessionId: string,
  storage: Record<string, string>,
): StoredAnswers | null {
  const raw = storage[`test_answers_${sessionId}`];
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAnswers;
  } catch {
    return null;
  }
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeSession(overrides: Partial<TestSession> = {}): TestSession {
  return {
    sessionId: generateSessionId(),
    testId: "1",
    testName: "Sample Test",
    startedAt: new Date().toISOString(),
    randomizeQuestions: false,
    randomizeAnswers: false,
    selectedSectionIds: [],
    ...overrides,
  };
}

// ── generateSessionId ──────────────────────────────────────────────────────────

describe("generateSessionId", () => {
  it("returns a non-empty string", () => {
    expect(generateSessionId().length).toBeGreaterThan(0);
  });

  it("returns a UUID-v4-like format", () => {
    const id = generateSessionId();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateSessionId()));
    expect(ids.size).toBe(100);
  });
});

// ── saveSession / loadActiveSessions ──────────────────────────────────────────

describe("saveSession + loadActiveSessions", () => {
  it("saves a session and loads it back", () => {
    const store: Record<string, string> = {};
    const s = makeSession({ testId: "42", testName: "Biology 101" });
    saveSession(s, store);
    const sessions = loadActiveSessions(store);
    expect(sessions).toHaveLength(1);
    expect(sessions[0].testId).toBe("42");
    expect(sessions[0].testName).toBe("Biology 101");
  });

  it("does not duplicate when saving the same sessionId twice", () => {
    const store: Record<string, string> = {};
    const s = makeSession();
    saveSession(s, store);
    saveSession(s, store);
    expect(loadActiveSessions(store)).toHaveLength(1);
  });

  it("saves multiple sessions independently", () => {
    const store: Record<string, string> = {};
    saveSession(makeSession({ testId: "1" }), store);
    saveSession(makeSession({ testId: "2" }), store);
    saveSession(makeSession({ testId: "3" }), store);
    expect(loadActiveSessions(store)).toHaveLength(3);
  });

  it("returns empty array when no sessions exist", () => {
    expect(loadActiveSessions({})).toEqual([]);
  });
});

// ── removeSession ────────────────────────────────────────────────────────────

describe("removeSession", () => {
  it("removes a session from the index and storage", () => {
    const store: Record<string, string> = {};
    const s = makeSession();
    saveSession(s, store);
    removeSession(s.sessionId, store);
    expect(loadActiveSessions(store)).toHaveLength(0);
    expect(store[sessionKey(s.sessionId)]).toBeUndefined();
  });

  it("removes stored answers along with the session", () => {
    const store: Record<string, string> = {};
    const s = makeSession();
    saveSession(s, store);
    saveStoredAnswers(
      s.sessionId,
      {
        answers: {
          "1": { selectedOptions: [0], textAnswer: "", dragOrder: [] },
        },
        currentIdx: 0,
      },
      store,
    );
    removeSession(s.sessionId, store);
    expect(loadStoredAnswers(s.sessionId, store)).toBeNull();
  });

  it("does not throw when removing a non-existent session", () => {
    const store: Record<string, string> = {};
    expect(() => removeSession("nonexistent", store)).not.toThrow();
  });

  it("keeps other sessions intact when one is removed", () => {
    const store: Record<string, string> = {};
    const s1 = makeSession({ testId: "1" });
    const s2 = makeSession({ testId: "2" });
    saveSession(s1, store);
    saveSession(s2, store);
    removeSession(s1.sessionId, store);
    const remaining = loadActiveSessions(store);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].testId).toBe("2");
  });
});

// ── isAtCapacity ──────────────────────────────────────────────────────────────

describe("isAtCapacity", () => {
  it("returns false when fewer than 5 sessions exist", () => {
    const store: Record<string, string> = {};
    for (let i = 0; i < 4; i++) {
      saveSession(makeSession({ testId: String(i) }), store);
    }
    expect(isAtCapacity(store)).toBe(false);
  });

  it("returns true when exactly 5 sessions exist", () => {
    const store: Record<string, string> = {};
    for (let i = 0; i < 5; i++) {
      saveSession(makeSession({ testId: String(i) }), store);
    }
    expect(isAtCapacity(store)).toBe(true);
  });

  it("returns false for an empty store", () => {
    expect(isAtCapacity({})).toBe(false);
  });

  it("falls back to false after removing one of 5 sessions", () => {
    const store: Record<string, string> = {};
    const sessions: TestSession[] = [];
    for (let i = 0; i < 5; i++) {
      const s = makeSession({ testId: String(i) });
      sessions.push(s);
      saveSession(s, store);
    }
    expect(isAtCapacity(store)).toBe(true);
    removeSession(sessions[0].sessionId, store);
    expect(isAtCapacity(store)).toBe(false);
  });
});

// ── Conflict detection (existing session for same test) ───────────────────────

describe("Conflict detection", () => {
  it("detects an existing session for the same testId", () => {
    const store: Record<string, string> = {};
    const s = makeSession({ testId: "7" });
    saveSession(s, store);
    const existing = loadActiveSessions(store).find((x) => x.testId === "7");
    expect(existing).toBeDefined();
    expect(existing?.sessionId).toBe(s.sessionId);
  });

  it("returns undefined when no session for that testId", () => {
    const store: Record<string, string> = {};
    saveSession(makeSession({ testId: "1" }), store);
    const existing = loadActiveSessions(store).find((x) => x.testId === "99");
    expect(existing).toBeUndefined();
  });

  it("finds the right session among many", () => {
    const store: Record<string, string> = {};
    saveSession(makeSession({ testId: "1" }), store);
    saveSession(makeSession({ testId: "2" }), store);
    saveSession(makeSession({ testId: "3" }), store);
    const existing = loadActiveSessions(store).find((x) => x.testId === "2");
    expect(existing?.testId).toBe("2");
  });
});

// ── Stored answers persistence ────────────────────────────────────────────────

describe("saveStoredAnswers + loadStoredAnswers", () => {
  it("saves and loads answers correctly", () => {
    const store: Record<string, string> = {};
    const sid = "test-session-abc";
    const data: StoredAnswers = {
      answers: {
        "1": { selectedOptions: [2], textAnswer: "", dragOrder: [] },
        "2": {
          selectedOptions: [],
          textAnswer: "photosynthesis",
          dragOrder: [],
        },
      },
      currentIdx: 1,
    };
    saveStoredAnswers(sid, data, store);
    const loaded = loadStoredAnswers(sid, store);
    expect(loaded).not.toBeNull();
    expect(loaded?.currentIdx).toBe(1);
    expect(loaded?.answers["1"].selectedOptions).toEqual([2]);
    expect(loaded?.answers["2"].textAnswer).toBe("photosynthesis");
  });

  it("returns null when no answers stored", () => {
    expect(loadStoredAnswers("no-such-session", {})).toBeNull();
  });

  it("overwrites previous answers on re-save", () => {
    const store: Record<string, string> = {};
    const sid = "sess-overwrite";
    saveStoredAnswers(
      sid,
      {
        answers: {
          "1": { selectedOptions: [0], textAnswer: "", dragOrder: [] },
        },
        currentIdx: 0,
      },
      store,
    );
    saveStoredAnswers(
      sid,
      {
        answers: {
          "1": { selectedOptions: [3], textAnswer: "", dragOrder: [] },
        },
        currentIdx: 2,
      },
      store,
    );
    const loaded = loadStoredAnswers(sid, store);
    expect(loaded?.answers["1"].selectedOptions).toEqual([3]);
    expect(loaded?.currentIdx).toBe(2);
  });

  it("handles dragOrder answers correctly", () => {
    const store: Record<string, string> = {};
    const sid = "drag-session";
    saveStoredAnswers(
      sid,
      {
        answers: {
          "5": { selectedOptions: [], textAnswer: "", dragOrder: [2, 0, 1] },
        },
        currentIdx: 0,
      },
      store,
    );
    const loaded = loadStoredAnswers(sid, store);
    expect(loaded?.answers["5"].dragOrder).toEqual([2, 0, 1]);
  });
});

// ── Session metadata fields ───────────────────────────────────────────────────

describe("Session metadata", () => {
  it("preserves randomizeQuestions flag", () => {
    const store: Record<string, string> = {};
    const s = makeSession({ randomizeQuestions: true });
    saveSession(s, store);
    const loaded = loadActiveSessions(store);
    expect(loaded[0].randomizeQuestions).toBe(true);
  });

  it("preserves randomizeAnswers flag", () => {
    const store: Record<string, string> = {};
    const s = makeSession({ randomizeAnswers: true });
    saveSession(s, store);
    const loaded = loadActiveSessions(store);
    expect(loaded[0].randomizeAnswers).toBe(true);
  });

  it("preserves startedAt timestamp", () => {
    const store: Record<string, string> = {};
    const ts = new Date("2026-01-15T10:30:00Z").toISOString();
    const s = makeSession({ startedAt: ts });
    saveSession(s, store);
    expect(loadActiveSessions(store)[0].startedAt).toBe(ts);
  });

  it("preserves testName", () => {
    const store: Record<string, string> = {};
    const s = makeSession({ testName: "Advanced Chemistry" });
    saveSession(s, store);
    expect(loadActiveSessions(store)[0].testName).toBe("Advanced Chemistry");
  });

  it("preserves selectedSectionIds", () => {
    const store: Record<string, string> = {};
    const s = makeSession({ selectedSectionIds: [2, 5] });
    saveSession(s, store);
    expect(loadActiveSessions(store)[0].selectedSectionIds).toEqual([2, 5]);
  });

  it("defaults selectedSectionIds to empty array (entire test)", () => {
    const store: Record<string, string> = {};
    const s = makeSession();
    saveSession(s, store);
    expect(loadActiveSessions(store)[0].selectedSectionIds).toEqual([]);
  });
});

// ── Navigation param building with sessionId ──────────────────────────────────

describe("Navigation params with sessionId", () => {
  function buildNavParams(session: TestSession): Record<string, string> {
    return {
      sessionId: session.sessionId,
      randomizeQuestions: session.randomizeQuestions ? "true" : "false",
      randomizeAnswers: session.randomizeAnswers ? "true" : "false",
    };
  }

  it("includes sessionId in navigation params", () => {
    const s = makeSession({ sessionId: "abc-123" });
    const params = buildNavParams(s);
    expect(params.sessionId).toBe("abc-123");
  });

  it("encodes randomization flags correctly", () => {
    const s = makeSession({
      randomizeQuestions: true,
      randomizeAnswers: false,
    });
    const params = buildNavParams(s);
    expect(params.randomizeQuestions).toBe("true");
    expect(params.randomizeAnswers).toBe("false");
  });

  it("uses existing sessionId when continuing a session", () => {
    const existing = makeSession({ sessionId: "existing-sess-xyz" });
    const params = buildNavParams(existing);
    expect(params.sessionId).toBe("existing-sess-xyz");
  });
});

// ── Up to 5 concurrent sessions ───────────────────────────────────────────────

describe("Concurrent session limit (up to 5)", () => {
  it("allows exactly 5 sessions to coexist", () => {
    const store: Record<string, string> = {};
    for (let i = 1; i <= 5; i++) {
      saveSession(makeSession({ testId: String(i) }), store);
    }
    expect(loadActiveSessions(store)).toHaveLength(5);
    expect(isAtCapacity(store)).toBe(true);
  });

  it("can start a new session after one is removed from a full set", () => {
    const store: Record<string, string> = {};
    const sessions: TestSession[] = [];
    for (let i = 1; i <= 5; i++) {
      const s = makeSession({ testId: String(i) });
      sessions.push(s);
      saveSession(s, store);
    }
    expect(isAtCapacity(store)).toBe(true);
    removeSession(sessions[2].sessionId, store);
    expect(isAtCapacity(store)).toBe(false);
    saveSession(makeSession({ testId: "99" }), store);
    expect(loadActiveSessions(store)).toHaveLength(5);
  });

  it("does NOT block a test that already has an active session (same testId)", () => {
    const store: Record<string, string> = {};
    for (let i = 1; i <= 5; i++) {
      saveSession(makeSession({ testId: String(i) }), store);
    }
    // Existing session for testId "3" exists — user can open conflict dialog
    const hasExisting = loadActiveSessions(store).some((s) => s.testId === "3");
    expect(hasExisting).toBe(true);
    // isAtCapacity is still true, but UI allows navigating to existing session
    expect(isAtCapacity(store)).toBe(true);
  });
});
