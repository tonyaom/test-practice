/**
 * Utilities for managing concurrent test sessions stored in localStorage.
 * Each session is stored under key: test_session_{sessionId}
 * The list of active session IDs is stored under: test_sessions_index
 */

import type { TestSession } from "../types";

const INDEX_KEY = "test_sessions_index";
const SESSION_PREFIX = "test_session_";
const MAX_SESSIONS = 5;

/** Generate a simple UUID v4 */
export function generateSessionId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function sessionKey(sessionId: string): string {
  return `${SESSION_PREFIX}${sessionId}`;
}

/** Load all active sessions from localStorage */
export function loadActiveSessions(): TestSession[] {
  try {
    const index: string[] = JSON.parse(localStorage.getItem(INDEX_KEY) ?? "[]");
    const sessions: TestSession[] = [];
    for (const id of index) {
      const raw = localStorage.getItem(sessionKey(id));
      if (raw) {
        try {
          sessions.push(JSON.parse(raw) as TestSession);
        } catch {
          // corrupted entry — skip
        }
      }
    }
    return sessions;
  } catch {
    return [];
  }
}

/** Get a single session by ID */
export function loadSession(sessionId: string): TestSession | null {
  try {
    const raw = localStorage.getItem(sessionKey(sessionId));
    if (!raw) return null;
    return JSON.parse(raw) as TestSession;
  } catch {
    return null;
  }
}

/** Save (create or update) a session */
export function saveSession(session: TestSession): void {
  localStorage.setItem(sessionKey(session.sessionId), JSON.stringify(session));
  const index: string[] = JSON.parse(localStorage.getItem(INDEX_KEY) ?? "[]");
  if (!index.includes(session.sessionId)) {
    index.push(session.sessionId);
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
  }
}

/** Remove a session (called after submit) */
export function removeSession(sessionId: string): void {
  localStorage.removeItem(sessionKey(sessionId));
  const index: string[] = JSON.parse(localStorage.getItem(INDEX_KEY) ?? "[]");
  const updated = index.filter((id) => id !== sessionId);
  localStorage.setItem(INDEX_KEY, JSON.stringify(updated));
  // Also remove stored answers
  localStorage.removeItem(`test_answers_${sessionId}`);
}

/** Return number of active sessions */
export function activeSessionCount(): number {
  return loadActiveSessions().length;
}

/** Check if max sessions reached */
export function isAtCapacity(): boolean {
  return activeSessionCount() >= MAX_SESSIONS;
}

/** Load stored answers for a session */
export interface StoredAnswers {
  answers: Record<
    string,
    { selectedOptions: number[]; textAnswer: string; dragOrder: number[] }
  >;
  currentIdx: number;
}

export function loadStoredAnswers(sessionId: string): StoredAnswers | null {
  try {
    const raw = localStorage.getItem(`test_answers_${sessionId}`);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAnswers;
  } catch {
    return null;
  }
}

export function saveStoredAnswers(
  sessionId: string,
  data: StoredAnswers,
): void {
  localStorage.setItem(`test_answers_${sessionId}`, JSON.stringify(data));
}

/**
 * Save a lightweight snapshot of the completed session's question IDs.
 * Called just before removeSession() so the results page can still access questionIds.
 * Key: test_completed_session_{sessionId}  (separate from the active session index)
 */
export function saveCompletedSessionSnapshot(
  sessionId: string,
  snapshot: Pick<
    TestSession,
    | "questionIds"
    | "randomizeQuestions"
    | "randomizeAnswers"
    | "selectedSectionIds"
  >,
): void {
  try {
    localStorage.setItem(
      `test_completed_session_${sessionId}`,
      JSON.stringify(snapshot),
    );
  } catch {
    // ignore storage errors
  }
}

/**
 * Load the completed session snapshot for the given session ID.
 * Returns null if not found (e.g., old session before this feature was added).
 */
export function loadCompletedSessionSnapshot(
  sessionId: string,
): Pick<
  TestSession,
  | "questionIds"
  | "randomizeQuestions"
  | "randomizeAnswers"
  | "selectedSectionIds"
> | null {
  try {
    const raw = localStorage.getItem(`test_completed_session_${sessionId}`);
    if (!raw) return null;
    return JSON.parse(raw) as Pick<
      TestSession,
      | "questionIds"
      | "randomizeQuestions"
      | "randomizeAnswers"
      | "selectedSectionIds"
    >;
  } catch {
    return null;
  }
}

/** Remove the completed session snapshot (called when cleaning up old sessions) */
export function removeCompletedSessionSnapshot(sessionId: string): void {
  try {
    localStorage.removeItem(`test_completed_session_${sessionId}`);
  } catch {
    // ignore
  }
}
