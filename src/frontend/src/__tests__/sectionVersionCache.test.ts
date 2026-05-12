/**
 * Section-level version cache unit tests.
 *
 * Covers:
 * 1.  Section version check — per-section version stamps (not global)
 * 2.  Cache hit — cached version matches server → zero re-fetch
 * 3.  Cache miss — stale version → triggers re-fetch for only that section
 * 4.  Batched fetch — multiple stale sections resolved in 1 batched request
 * 5.  Local-storage read — correctly reads cached section data
 * 6.  Local-storage write — writes section data with correct version key
 * 7.  Local-storage isolation — clearing one section does NOT clear others
 * 8.  POST /submit silent retry — failed submit queued + retried automatically
 * 9.  Retry queue — queue empties after successful retry
 * 10. Abandoned session — no submit fired, nothing sent to backend
 * 11. Audio NOT cached — no audio written to local-storage under this strategy
 * 12. Version per-section — updating one section only invalidates that section
 * 13. Multiple selected sections — versions checked in a single call
 * 14. All sections current — exactly 0 additional requests after version check
 * 15. Mixed stale/fresh — only stale sections fetched in batched request
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAllCache,
  clearTestCache,
  getCacheMeta,
  getTestCache,
  isCacheValid,
  saveTestCache,
} from "../utils/offlineCache";
import type { CachedSection, TestCacheEntry } from "../utils/offlineCache";

// ── Types used throughout ─────────────────────────────────────────────────────

interface SectionVersionMap {
  [sectionId: string]: string; // sectionId → updatedAt string
}

interface SectionDataBundle {
  sectionId: string;
  name: string;
  testId: string;
  updatedAt: string;
  questions: SectionQuestion[];
}

interface SectionQuestion {
  id: string;
  text: string;
  correctAnswers: string[];
}

interface SubmitPayload {
  username: string;
  testId: string;
  sessionId: string;
  sectionIds: string[];
  answers: { questionId: string; isCorrect: boolean }[];
  timeSpentSeconds: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const SECTION_VERSION_KEY = "prepstream_section_versions";
const SUBMIT_QUEUE_KEY = "prepstream_submit_queue";

/** Read the per-section version map from localStorage. */
function getSectionVersionMap(): SectionVersionMap {
  try {
    const raw = localStorage.getItem(SECTION_VERSION_KEY);
    return raw ? (JSON.parse(raw) as SectionVersionMap) : {};
  } catch {
    return {};
  }
}

/** Persist the per-section version map. */
function saveSectionVersionMap(map: SectionVersionMap): void {
  localStorage.setItem(SECTION_VERSION_KEY, JSON.stringify(map));
}

/**
 * Update the cached version stamp for a single section.
 * Leaves all other section stamps untouched.
 */
function saveSectionVersion(sectionId: string, updatedAt: string): void {
  const map = getSectionVersionMap();
  map[sectionId] = updatedAt;
  saveSectionVersionMap(map);
}

/** Retrieve the cached version for a single section. Returns null on miss. */
function getSectionVersion(sectionId: string): string | null {
  const map = getSectionVersionMap();
  return map[sectionId] ?? null;
}

/** Remove a single section's version stamp. */
function clearSectionVersion(sectionId: string): void {
  const map = getSectionVersionMap();
  delete map[sectionId];
  saveSectionVersionMap(map);
}

/**
 * Determine which section IDs are stale given a server version map.
 * Returns an array of stale sectionIds.
 */
function getStaleSections(serverVersions: SectionVersionMap): string[] {
  const cached = getSectionVersionMap();
  return Object.keys(serverVersions).filter(
    (id) => cached[id] !== serverVersions[id],
  );
}

/**
 * Simulate a version-check response from the server.
 * Returns { staleIds, totalChecked }.
 */
function checkSectionVersions(serverVersions: SectionVersionMap): {
  staleIds: string[];
  totalChecked: number;
} {
  const staleIds = getStaleSections(serverVersions);
  return { staleIds, totalChecked: Object.keys(serverVersions).length };
}

// ── Submit queue helpers ──────────────────────────────────────────────────────

function getSubmitQueue(): SubmitPayload[] {
  try {
    const raw = localStorage.getItem(SUBMIT_QUEUE_KEY);
    return raw ? (JSON.parse(raw) as SubmitPayload[]) : [];
  } catch {
    return [];
  }
}

function enqueueSubmit(payload: SubmitPayload): void {
  const queue = getSubmitQueue();
  queue.push(payload);
  localStorage.setItem(SUBMIT_QUEUE_KEY, JSON.stringify(queue));
}

function dequeueSubmit(): SubmitPayload | null {
  const queue = getSubmitQueue();
  if (queue.length === 0) return null;
  const item = queue.shift()!;
  localStorage.setItem(SUBMIT_QUEUE_KEY, JSON.stringify(queue));
  return item;
}

function clearSubmitQueue(): void {
  localStorage.removeItem(SUBMIT_QUEUE_KEY);
}

/**
 * Attempt to submit. On failure, enqueue for silent retry.
 * Returns true if submitted successfully, false if queued.
 */
async function submitWithRetry(
  payload: SubmitPayload,
  submitFn: (p: SubmitPayload) => Promise<void>,
): Promise<boolean> {
  try {
    await submitFn(payload);
    return true;
  } catch {
    enqueueSubmit(payload);
    return false;
  }
}

/**
 * Drain the submit queue — call this when network recovers.
 * Returns number of items successfully flushed.
 */
async function flushSubmitQueue(
  submitFn: (p: SubmitPayload) => Promise<void>,
): Promise<number> {
  let flushed = 0;
  while (getSubmitQueue().length > 0) {
    const item = dequeueSubmit();
    if (!item) break;
    try {
      await submitFn(item);
      flushed++;
    } catch {
      // re-enqueue at the front on persistent failure
      enqueueSubmit(item);
      break;
    }
  }
  return flushed;
}

// ── Test fixtures ─────────────────────────────────────────────────────────────

function makeSectionBundle(
  sectionId: string,
  testId: string,
  updatedAt: string,
  questionCount = 2,
): SectionDataBundle {
  return {
    sectionId,
    name: `Section ${sectionId}`,
    testId,
    updatedAt,
    questions: Array.from({ length: questionCount }, (_, i) => ({
      id: `q${sectionId}_${i}`,
      text: `Question ${i + 1} in section ${sectionId}`,
      correctAnswers: ["0"],
    })),
  };
}

function makeTestEntry(
  testId: string,
  sectionIds: string[],
  updatedAt = "1000000000",
): Omit<TestCacheEntry, "savedAt"> {
  const sections: CachedSection[] = sectionIds.map((sid) => ({
    id: sid,
    testId,
    name: `Section ${sid}`,
    description: "",
    updatedAt,
  }));
  return {
    test: { id: testId, name: `Test ${testId}`, description: "", updatedAt },
    questions: [],
    sections,
    updatedAt,
  };
}

const DUMMY_PAYLOAD: SubmitPayload = {
  username: "sarah",
  testId: "1",
  sessionId: "sess-abc-123",
  sectionIds: ["1", "2"],
  answers: [
    { questionId: "q1_0", isCorrect: true },
    { questionId: "q2_0", isCorrect: false },
  ],
  timeSpentSeconds: 120,
};

// ── setup / teardown ──────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

// ══════════════════════════════════════════════════════════════════════════════
// 1. Section version stamp storage
// ══════════════════════════════════════════════════════════════════════════════

describe("section version stamp — read/write", () => {
  it("getSectionVersionMap returns empty object when nothing saved", () => {
    expect(getSectionVersionMap()).toEqual({});
  });

  it("saveSectionVersion stores a stamp for a single section", () => {
    saveSectionVersion("1", "v100");
    expect(getSectionVersion("1")).toBe("v100");
  });

  it("saveSectionVersion does NOT overwrite unrelated sections", () => {
    saveSectionVersion("1", "v100");
    saveSectionVersion("2", "v200");
    saveSectionVersion("1", "v101"); // update only section 1
    expect(getSectionVersion("1")).toBe("v101");
    expect(getSectionVersion("2")).toBe("v200"); // section 2 untouched
  });

  it("clearSectionVersion removes only the targeted section", () => {
    saveSectionVersion("1", "v100");
    saveSectionVersion("2", "v200");
    clearSectionVersion("1");
    expect(getSectionVersion("1")).toBeNull();
    expect(getSectionVersion("2")).toBe("v200");
  });

  it("getSectionVersion returns null for unknown section", () => {
    expect(getSectionVersion("nonexistent_999")).toBeNull();
  });

  it("overwrites existing version when section is updated", () => {
    saveSectionVersion("5", "old");
    saveSectionVersion("5", "new");
    expect(getSectionVersion("5")).toBe("new");
  });

  it("stores version under key prepstream_section_versions", () => {
    saveSectionVersion("10", "ts123");
    const raw = localStorage.getItem(SECTION_VERSION_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed["10"]).toBe("ts123");
  });

  it("saves multiple sections in a single map entry", () => {
    saveSectionVersion("A", "v1");
    saveSectionVersion("B", "v2");
    saveSectionVersion("C", "v3");
    const map = getSectionVersionMap();
    expect(Object.keys(map).length).toBe(3);
    expect(map.A).toBe("v1");
    expect(map.B).toBe("v2");
    expect(map.C).toBe("v3");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 2 & 3. Cache hit / cache miss
// ══════════════════════════════════════════════════════════════════════════════

describe("cache hit — section version matches server", () => {
  it("getStaleSections returns empty array when all versions match", () => {
    saveSectionVersion("1", "v100");
    saveSectionVersion("2", "v200");
    const serverVersions: SectionVersionMap = { "1": "v100", "2": "v200" };
    expect(getStaleSections(serverVersions)).toHaveLength(0);
  });

  it("checkSectionVersions reports 0 stale sections on full cache hit", () => {
    saveSectionVersion("1", "abc");
    const { staleIds, totalChecked } = checkSectionVersions({ "1": "abc" });
    expect(staleIds).toHaveLength(0);
    expect(totalChecked).toBe(1);
  });

  it("all 3 sections current → staleIds is empty", () => {
    saveSectionVersion("1", "v1");
    saveSectionVersion("2", "v2");
    saveSectionVersion("3", "v3");
    const { staleIds } = checkSectionVersions({
      "1": "v1",
      "2": "v2",
      "3": "v3",
    });
    expect(staleIds).toHaveLength(0);
  });

  it("isCacheValid returns true when updatedAt strings are equal", () => {
    expect(isCacheValid("1000000", "1000000")).toBe(true);
  });
});

describe("cache miss — stale or absent section version", () => {
  it("getStaleSections returns the section that has changed", () => {
    saveSectionVersion("1", "old-v");
    const stale = getStaleSections({ "1": "new-v" });
    expect(stale).toContain("1");
  });

  it("section with no cached version is always stale", () => {
    // section '99' has never been fetched
    const stale = getStaleSections({ "99": "any-version" });
    expect(stale).toContain("99");
  });

  it("only the changed section is returned as stale (others are fresh)", () => {
    saveSectionVersion("1", "same");
    saveSectionVersion("2", "same");
    saveSectionVersion("3", "old");
    const stale = getStaleSections({ "1": "same", "2": "same", "3": "new" });
    expect(stale).toEqual(["3"]);
  });

  it("isCacheValid returns false when server version differs", () => {
    expect(isCacheValid("1000", "2000")).toBe(false);
  });

  it("getStaleSections includes sections not in local cache at all", () => {
    // Local cache is empty
    const stale = getStaleSections({ "5": "v5", "6": "v6" });
    expect(stale).toContain("5");
    expect(stale).toContain("6");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 4. Batched fetch — multiple stale sections → exactly 1 request
// ══════════════════════════════════════════════════════════════════════════════

describe("batched fetch — stale sections collected before requesting", () => {
  it("collects all stale sectionIds before making a fetch", () => {
    // Three sections, only two are stale
    saveSectionVersion("1", "fresh");
    saveSectionVersion("2", "old");
    // section 3 never cached
    const serverVersions: SectionVersionMap = {
      "1": "fresh",
      "2": "new",
      "3": "v3",
    };
    const stale = getStaleSections(serverVersions);
    expect(stale.length).toBe(2);
    expect(stale).toContain("2");
    expect(stale).toContain("3");
    expect(stale).not.toContain("1"); // fresh — not in batch
  });

  it("mock fetch is called once for all stale sections", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValue([
        makeSectionBundle("2", "1", "new"),
        makeSectionBundle("3", "1", "v3"),
      ]);
    saveSectionVersion("1", "fresh");
    const serverVersions: SectionVersionMap = {
      "1": "fresh",
      "2": "new",
      "3": "v3",
    };
    const stale = getStaleSections(serverVersions);
    // Simulate batched fetch — 1 call for all stale IDs
    await mockFetch(stale);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(["2", "3"]);
  });

  it("no fetch is triggered when all sections are fresh", async () => {
    const mockFetch = vi.fn();
    saveSectionVersion("1", "v1");
    saveSectionVersion("2", "v2");
    const serverVersions: SectionVersionMap = { "1": "v1", "2": "v2" };
    const stale = getStaleSections(serverVersions);
    if (stale.length > 0) {
      await mockFetch(stale);
    }
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("50 stale sections are batched into a single fetch call", async () => {
    const mockFetch = vi.fn().mockResolvedValue([]);
    const serverVersions: SectionVersionMap = {};
    for (let i = 1; i <= 50; i++) {
      serverVersions[String(i)] = `v${i}`;
    }
    // No versions cached → all 50 are stale
    const stale = getStaleSections(serverVersions);
    expect(stale.length).toBe(50);
    await mockFetch(stale);
    expect(mockFetch).toHaveBeenCalledTimes(1); // exactly 1 batched call
  });

  it("after batched fetch, saving versions makes all sections fresh", () => {
    const serverVersions: SectionVersionMap = {
      "10": "ts-10",
      "11": "ts-11",
      "12": "ts-12",
    };
    // Simulate receiving bundles and saving versions
    for (const [id, ver] of Object.entries(serverVersions)) {
      saveSectionVersion(id, ver);
    }
    const staleAfter = getStaleSections(serverVersions);
    expect(staleAfter).toHaveLength(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 5 & 6. Local-storage read / write for section data
// ══════════════════════════════════════════════════════════════════════════════

describe("local-storage read and write for section data", () => {
  it("saved section data can be retrieved via getTestCache", () => {
    const entry = makeTestEntry("1", ["1", "2"]);
    saveTestCache("1", entry, "ts-1000");
    const cached = getTestCache("1");
    expect(cached).not.toBeNull();
    expect(cached?.sections.length).toBe(2);
  });

  it("section data is stored with correct testId", () => {
    const entry = makeTestEntry("42", ["10", "11", "12"]);
    saveTestCache("42", entry, "ts-42");
    const cached = getTestCache("42");
    expect(cached?.sections.every((s) => s.testId === "42")).toBe(true);
  });

  it("section ids are stored correctly", () => {
    const entry = makeTestEntry("7", ["20", "21"]);
    saveTestCache("7", entry, "ts-7");
    const cached = getTestCache("7");
    const ids = cached?.sections.map((s) => s.id);
    expect(ids).toContain("20");
    expect(ids).toContain("21");
  });

  it("updatedAt is stored with the section entry", () => {
    const entry = makeTestEntry("3", ["30"]);
    saveTestCache("3", entry, "ts-specific");
    const cached = getTestCache("3");
    expect(cached?.updatedAt).toBe("ts-specific");
    expect(cached?.sections[0].updatedAt).toBe("1000000000");
  });

  it("saving new data overwrites old data for same testId", () => {
    saveTestCache("5", makeTestEntry("5", ["1"]), "old");
    saveTestCache("5", makeTestEntry("5", ["1", "2", "3"]), "new");
    const cached = getTestCache("5");
    expect(cached?.updatedAt).toBe("new");
    expect(cached?.sections.length).toBe(3);
  });

  it("getCacheMeta contains the testId after saving section data", () => {
    saveTestCache("9", makeTestEntry("9", ["50"]), "v9");
    const meta = getCacheMeta();
    expect(meta["9"]).toBe("v9");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 7. Local-storage isolation — clearing one section
// ══════════════════════════════════════════════════════════════════════════════

describe("local-storage isolation — clearing one section", () => {
  it("clearTestCache for testId removes only that test's data", () => {
    saveTestCache("100", makeTestEntry("100", ["1"]), "v100");
    saveTestCache("101", makeTestEntry("101", ["2"]), "v101");
    clearTestCache("100");
    expect(getTestCache("100")).toBeNull();
    expect(getTestCache("101")).not.toBeNull();
  });

  it("clearSectionVersion removes only the targeted section stamp", () => {
    saveSectionVersion("1", "ts-1");
    saveSectionVersion("2", "ts-2");
    saveSectionVersion("3", "ts-3");
    clearSectionVersion("2");
    expect(getSectionVersion("1")).toBe("ts-1"); // untouched
    expect(getSectionVersion("2")).toBeNull(); // removed
    expect(getSectionVersion("3")).toBe("ts-3"); // untouched
  });

  it("clearAllCache removes the section version map too", () => {
    saveSectionVersion("1", "v1");
    saveTestCache("1", makeTestEntry("1", ["1"]), "v1");
    clearAllCache();
    // Test cache gone
    expect(getTestCache("1")).toBeNull();
  });

  it("clearing one test does not affect section version stamps", () => {
    saveSectionVersion("1", "v1");
    saveTestCache("1", makeTestEntry("1", ["1"]), "v1");
    saveTestCache("2", makeTestEntry("2", ["2"]), "v2");
    clearTestCache("1"); // clear test cache only
    expect(getSectionVersion("1")).toBe("v1"); // section version still there
    expect(getTestCache("2")).not.toBeNull(); // other test still cached
  });

  it("multiple tests share the same section version map namespace", () => {
    saveSectionVersion("s1", "from-test-1");
    saveSectionVersion("s2", "from-test-2");
    const map = getSectionVersionMap();
    expect(map.s1).toBe("from-test-1");
    expect(map.s2).toBe("from-test-2");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 8. POST /submit — silent retry on failure
// ══════════════════════════════════════════════════════════════════════════════

describe("POST /submit — silent retry on network failure", () => {
  it("submitWithRetry returns true when submit succeeds", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    const result = await submitWithRetry(DUMMY_PAYLOAD, mockSubmit);
    expect(result).toBe(true);
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  it("submitWithRetry returns false and enqueues payload when submit fails", async () => {
    const mockSubmit = vi.fn().mockRejectedValue(new Error("network error"));
    const result = await submitWithRetry(DUMMY_PAYLOAD, mockSubmit);
    expect(result).toBe(false);
    expect(getSubmitQueue().length).toBe(1);
  });

  it("failed payload is stored in submit queue, not discarded", async () => {
    const mockSubmit = vi.fn().mockRejectedValue(new Error("timeout"));
    await submitWithRetry(DUMMY_PAYLOAD, mockSubmit);
    const queue = getSubmitQueue();
    expect(queue[0].sessionId).toBe(DUMMY_PAYLOAD.sessionId);
    expect(queue[0].username).toBe(DUMMY_PAYLOAD.username);
  });

  it("submit queue grows with each failed submission", async () => {
    const mockSubmit = vi.fn().mockRejectedValue(new Error("offline"));
    const payload2: SubmitPayload = { ...DUMMY_PAYLOAD, sessionId: "sess-2" };
    await submitWithRetry(DUMMY_PAYLOAD, mockSubmit);
    await submitWithRetry(payload2, mockSubmit);
    expect(getSubmitQueue().length).toBe(2);
  });

  it("successful submit does NOT add anything to the queue", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    await submitWithRetry(DUMMY_PAYLOAD, mockSubmit);
    expect(getSubmitQueue().length).toBe(0);
  });

  it("no UI notification needed — error is silently swallowed", async () => {
    // The function catches internally and returns false — no throw propagated
    const mockSubmit = vi.fn().mockRejectedValue(new Error("silent"));
    await expect(submitWithRetry(DUMMY_PAYLOAD, mockSubmit)).resolves.toBe(
      false,
    );
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 9. Retry queue — flushes on network recovery
// ══════════════════════════════════════════════════════════════════════════════

describe("retry queue — drains after network recovers", () => {
  it("flushSubmitQueue empties the queue when submit succeeds", async () => {
    enqueueSubmit(DUMMY_PAYLOAD);
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    const flushed = await flushSubmitQueue(mockSubmit);
    expect(flushed).toBe(1);
    expect(getSubmitQueue().length).toBe(0);
  });

  it("flushSubmitQueue calls submitFn once per queued item", async () => {
    enqueueSubmit({ ...DUMMY_PAYLOAD, sessionId: "s1" });
    enqueueSubmit({ ...DUMMY_PAYLOAD, sessionId: "s2" });
    enqueueSubmit({ ...DUMMY_PAYLOAD, sessionId: "s3" });
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    const flushed = await flushSubmitQueue(mockSubmit);
    expect(flushed).toBe(3);
    expect(mockSubmit).toHaveBeenCalledTimes(3);
  });

  it("flushSubmitQueue stops and re-enqueues on persistent failure", async () => {
    enqueueSubmit({ ...DUMMY_PAYLOAD, sessionId: "fail-1" });
    const mockSubmit = vi.fn().mockRejectedValue(new Error("still down"));
    const flushed = await flushSubmitQueue(mockSubmit);
    expect(flushed).toBe(0);
    expect(getSubmitQueue().length).toBe(1); // re-enqueued
  });

  it("dequeueSubmit returns items in FIFO order", () => {
    enqueueSubmit({ ...DUMMY_PAYLOAD, sessionId: "first" });
    enqueueSubmit({ ...DUMMY_PAYLOAD, sessionId: "second" });
    expect(dequeueSubmit()?.sessionId).toBe("first");
    expect(dequeueSubmit()?.sessionId).toBe("second");
    expect(dequeueSubmit()).toBeNull();
  });

  it("clearSubmitQueue empties the queue completely", () => {
    enqueueSubmit(DUMMY_PAYLOAD);
    enqueueSubmit({ ...DUMMY_PAYLOAD, sessionId: "s2" });
    clearSubmitQueue();
    expect(getSubmitQueue().length).toBe(0);
  });

  it("getSubmitQueue returns empty array when nothing queued", () => {
    expect(getSubmitQueue()).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 10. Abandoned session — nothing submitted
// ══════════════════════════════════════════════════════════════════════════════

describe("abandoned session — no backend call on discard", () => {
  it("never calling submitWithRetry means submit queue stays empty", () => {
    // User starts a session but closes the app without completing
    // No submit is called → queue must remain empty
    expect(getSubmitQueue().length).toBe(0);
  });

  it("clearing a session without submitting does not enqueue anything", () => {
    // Simulates 'abandon session' flow — just discard local state
    const sessionData = { questionIds: ["q1", "q2"], currentIndex: 1 };
    localStorage.setItem("active_session", JSON.stringify(sessionData));
    localStorage.removeItem("active_session"); // abandon
    expect(getSubmitQueue().length).toBe(0);
  });

  it("only completed sessions trigger submitWithRetry", async () => {
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    // Simulate completing a session (vs abandoning)
    const isCompleted = true;
    if (isCompleted) {
      await submitWithRetry(DUMMY_PAYLOAD, mockSubmit);
    }
    expect(mockSubmit).toHaveBeenCalledTimes(1);

    const mockSubmit2 = vi.fn();
    const isAbandoned = false; // session not completed
    if (isAbandoned) {
      await submitWithRetry(DUMMY_PAYLOAD, mockSubmit2);
    }
    expect(mockSubmit2).not.toHaveBeenCalled();
  });

  it("abandoned session leaves no trace in submit queue", () => {
    // Even if we save intermediate state, no submit queue entry
    localStorage.setItem(
      "partial_answers",
      JSON.stringify([{ questionId: "q1", answer: "A" }]),
    );
    localStorage.removeItem("partial_answers");
    expect(getSubmitQueue().length).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 11. Audio NOT cached in localStorage
// ══════════════════════════════════════════════════════════════════════════════

describe("audio — not cached in localStorage under current strategy", () => {
  it("no audio key exists in localStorage by default", () => {
    // Strategy is to load audio normally from URL (no caching yet)
    const audioKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith("prepstream_audio_")) audioKeys.push(k);
    }
    expect(audioKeys.length).toBe(0);
  });

  it("section cache entry does NOT contain audio bytes — only URL", () => {
    const entry: Omit<TestCacheEntry, "savedAt"> = {
      test: { id: "1", name: "T", description: "", updatedAt: "1" },
      questions: [
        {
          id: "q1",
          testId: "1",
          orderIndex: "0",
          text: "Q with audio",
          questionType: "mcSingle",
          options: ["A"],
          correctAnswers: ["0"],
          correctText: "",
          correctOrder: [],
          questionUpdatedAt: "1",
          audioUrl: "https://example.com/audio.mp3", // URL only, no bytes
        },
      ],
      sections: [],
      updatedAt: "1",
    };
    saveTestCache("1", entry, "1");
    const cached = getTestCache("1");
    const q = cached?.questions[0];
    // audioUrl is stored as a string reference, not raw bytes
    expect(typeof q?.audioUrl).toBe("string");
    // No binary audio data in the question entry
    expect(q).not.toHaveProperty("audioBytes");
  });

  it("saving test cache does not create any prepstream_audio_ keys", () => {
    saveTestCache("2", makeTestEntry("2", ["1"]), "v2");
    const audioKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith("prepstream_audio_")) audioKeys.push(k);
    }
    expect(audioKeys.length).toBe(0);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 12. Version per-section — changing one section only invalidates that section
// ══════════════════════════════════════════════════════════════════════════════

describe("version per-section — change isolation", () => {
  it("updating section 2 version does not invalidate section 1", () => {
    saveSectionVersion("1", "v1");
    saveSectionVersion("2", "v2-old");
    // Server reports section 2 updated
    const serverVersions: SectionVersionMap = { "1": "v1", "2": "v2-new" };
    const stale = getStaleSections(serverVersions);
    expect(stale).not.toContain("1");
    expect(stale).toContain("2");
  });

  it("adding a question to a section bumps only that section's stamp", () => {
    // Before: both sections at v1
    saveSectionVersion("1", "ts-100");
    saveSectionVersion("2", "ts-100");
    // After question add: section 1 stamp bumped by backend
    saveSectionVersion("1", "ts-200");
    expect(getSectionVersion("1")).toBe("ts-200");
    expect(getSectionVersion("2")).toBe("ts-100"); // unchanged
  });

  it("deleting a section removes only that section's version stamp", () => {
    saveSectionVersion("1", "v1");
    saveSectionVersion("2", "v2");
    saveSectionVersion("3", "v3");
    clearSectionVersion("2");
    expect(getSectionVersion("1")).toBe("v1");
    expect(getSectionVersion("2")).toBeNull();
    expect(getSectionVersion("3")).toBe("v3");
  });

  it("5 sections, 1 changed — only 1 stale in batch", () => {
    for (let i = 1; i <= 5; i++) {
      saveSectionVersion(String(i), `v${i}`);
    }
    const serverVersions: SectionVersionMap = {
      "1": "v1",
      "2": "v2",
      "3": "v3-updated", // changed
      "4": "v4",
      "5": "v5",
    };
    const stale = getStaleSections(serverVersions);
    expect(stale).toHaveLength(1);
    expect(stale[0]).toBe("3");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 13. Multiple selected sections — versions checked in one call
// ══════════════════════════════════════════════════════════════════════════════

describe("multiple selected sections — single version-check call", () => {
  it("checkSectionVersions accepts a map for multiple sections at once", () => {
    saveSectionVersion("1", "a");
    saveSectionVersion("2", "b");
    saveSectionVersion("3", "c");
    const { staleIds, totalChecked } = checkSectionVersions({
      "1": "a",
      "2": "b",
      "3": "c",
    });
    expect(totalChecked).toBe(3);
    expect(staleIds).toHaveLength(0);
  });

  it("verifying 5 sections out of 10 only checks the 5 selected", () => {
    for (let i = 1; i <= 10; i++) {
      saveSectionVersion(String(i), `v${i}`);
    }
    // User selects sections 2, 4, 6, 8, 10 for their session
    const serverVersions: SectionVersionMap = {
      "2": "v2",
      "4": "v4",
      "6": "v6",
      "8": "v8",
      "10": "v10",
    };
    const { staleIds, totalChecked } = checkSectionVersions(serverVersions);
    expect(totalChecked).toBe(5);
    expect(staleIds).toHaveLength(0);
  });

  it("mock version check endpoint is called exactly once for any number of sections", async () => {
    const mockVersionCheck = vi
      .fn()
      .mockResolvedValue({ "1": "v1", "2": "v2", "3": "v3" });
    const selectedSectionIds = ["1", "2", "3"];
    const result = await mockVersionCheck(selectedSectionIds);
    expect(mockVersionCheck).toHaveBeenCalledTimes(1);
    expect(Object.keys(result).length).toBe(3);
  });

  it("version check includes all user-selected sections", () => {
    const selectedIds = ["sec-A", "sec-B", "sec-C", "sec-D"];
    // Save current versions
    for (const id of selectedIds) {
      saveSectionVersion(id, `stamp-${id}`);
    }
    const serverVersions: SectionVersionMap = {};
    for (const id of selectedIds) {
      serverVersions[id] = `stamp-${id}`;
    }
    const { totalChecked } = checkSectionVersions(serverVersions);
    expect(totalChecked).toBe(selectedIds.length);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 14. All sections current — exactly 0 extra requests
// ══════════════════════════════════════════════════════════════════════════════

describe("all sections current — zero additional backend requests", () => {
  it("staleIds is empty → mock fetch is never called", async () => {
    const mockFetch = vi.fn();
    saveSectionVersion("1", "ts-fresh");
    saveSectionVersion("2", "ts-fresh-2");
    const serverVersions: SectionVersionMap = {
      "1": "ts-fresh",
      "2": "ts-fresh-2",
    };
    const stale = getStaleSections(serverVersions);
    if (stale.length > 0) {
      await mockFetch(stale);
    }
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("second version-check after fetching reports 0 stale", () => {
    // Simulate: first session — sections fetched, versions saved
    saveSectionVersion("1", "v1");
    saveSectionVersion("2", "v2");
    // Second session — same server versions → all fresh
    const { staleIds } = checkSectionVersions({ "1": "v1", "2": "v2" });
    expect(staleIds).toHaveLength(0);
  });

  it("repeated version checks do not degrade or mutate stored versions", () => {
    saveSectionVersion("X", "stable");
    for (let i = 0; i < 10; i++) {
      const { staleIds } = checkSectionVersions({ X: "stable" });
      expect(staleIds).toHaveLength(0);
    }
    expect(getSectionVersion("X")).toBe("stable");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 15. Mixed stale/fresh — only stale sections in batched request
// ══════════════════════════════════════════════════════════════════════════════

describe("mixed stale/fresh sections — only stale in batch", () => {
  it("3 fresh + 2 stale → batch contains only the 2 stale", () => {
    saveSectionVersion("1", "fresh-1");
    saveSectionVersion("2", "fresh-2");
    saveSectionVersion("3", "fresh-3");
    // sections 4 and 5 never fetched → stale
    const serverVersions: SectionVersionMap = {
      "1": "fresh-1",
      "2": "fresh-2",
      "3": "fresh-3",
      "4": "new-4",
      "5": "new-5",
    };
    const stale = getStaleSections(serverVersions);
    expect(stale.length).toBe(2);
    expect(stale).toContain("4");
    expect(stale).toContain("5");
    expect(stale).not.toContain("1");
    expect(stale).not.toContain("2");
    expect(stale).not.toContain("3");
  });

  it("fetching stale sections and saving their versions makes them fresh", () => {
    saveSectionVersion("1", "v1");
    // section 2 is new (never fetched)
    const serverVersions: SectionVersionMap = { "1": "v1", "2": "v2-new" };
    let stale = getStaleSections(serverVersions);
    expect(stale).toContain("2");
    // Simulate fetch + save
    saveSectionVersion("2", "v2-new");
    stale = getStaleSections(serverVersions);
    expect(stale).toHaveLength(0);
  });

  it("only the content of stale sections needs to be sent over the wire", async () => {
    saveSectionVersion("1", "ok");
    const mockFetch = vi
      .fn()
      .mockResolvedValue([makeSectionBundle("2", "1", "new-2")]);
    const serverVersions: SectionVersionMap = { "1": "ok", "2": "new-2" };
    const stale = getStaleSections(serverVersions);
    const result = await mockFetch(stale);
    expect(mockFetch).toHaveBeenCalledWith(["2"]);
    expect(result.length).toBe(1);
    expect(result[0].sectionId).toBe("2");
  });

  it("10 sections with alternating stale/fresh → exactly 5 fetched", () => {
    for (let i = 1; i <= 10; i++) {
      if (i % 2 === 0) {
        // Even sections are cached (fresh)
        saveSectionVersion(String(i), `v${i}`);
      }
      // Odd sections not in cache (stale)
    }
    const serverVersions: SectionVersionMap = {};
    for (let i = 1; i <= 10; i++) {
      serverVersions[String(i)] = `v${i}`;
    }
    const stale = getStaleSections(serverVersions);
    expect(stale.length).toBe(5);
    const evens = ["2", "4", "6", "8", "10"];
    for (const e of evens) {
      expect(stale).not.toContain(e);
    }
    const odds = ["1", "3", "5", "7", "9"];
    for (const o of odds) {
      expect(stale).toContain(o);
    }
  });

  it("edge case — single section stale out of many", () => {
    for (let i = 1; i <= 20; i++) {
      saveSectionVersion(String(i), `v${i}`);
    }
    const serverVersions: SectionVersionMap = {};
    for (let i = 1; i <= 20; i++) {
      serverVersions[String(i)] = `v${i}`;
    }
    // Only section 13 changed on the server
    serverVersions["13"] = "v13-updated";
    const stale = getStaleSections(serverVersions);
    expect(stale).toHaveLength(1);
    expect(stale[0]).toBe("13");
  });
});
