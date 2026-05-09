/**
 * Comprehensive unit tests for the offlineCache utility.
 *
 * Covers:
 * - getTestCache: returns null on miss, retrieves saved entries
 * - saveTestCache: stores data with correct shape, updates meta
 * - clearTestCache: removes only the targeted test entry
 * - clearAllCache: removes every cached test entry
 * - isCacheValid: compares cached vs server updatedAt strings
 * - getCacheMeta: returns the full version map
 * - cache key format: prepstream_test_cache_{testId}
 * - meta key: prepstream_cache_meta
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  clearAllCache,
  clearTestCache,
  getCacheMeta,
  getTestCache,
  isCacheValid,
  saveTestCache,
} from "../utils/offlineCache";
import type { TestCacheEntry } from "../utils/offlineCache";

// ── helpers ───────────────────────────────────────────────────────────────────

function makeEntry(
  testId: string,
  updatedAt = "1000000000",
): Omit<TestCacheEntry, "savedAt"> {
  return {
    test: {
      id: testId,
      name: `Test ${testId}`,
      description: `Description for test ${testId}`,
      updatedAt,
    },
    questions: [
      {
        id: "1",
        testId,
        orderIndex: "0",
        text: "What is 2+2?",
        questionType: "mcSingle",
        options: ["3", "4", "5"],
        correctAnswers: ["1"],
        correctText: "",
        correctOrder: [],
        questionUpdatedAt: updatedAt,
      },
      {
        id: "2",
        testId,
        orderIndex: "1",
        text: "Which of these are prime? Select all.",
        questionType: "mcMulti",
        options: ["2", "3", "4"],
        correctAnswers: ["0", "1"],
        correctText: "",
        correctOrder: [],
        questionUpdatedAt: updatedAt,
      },
    ],
    sections: [
      {
        id: "10",
        testId,
        name: "Section A",
        description: "First section",
        updatedAt,
      },
    ],
    updatedAt,
  };
}

// ── setup / teardown ──────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

// ── getTestCache ──────────────────────────────────────────────────────────────

describe("getTestCache", () => {
  it("returns null when no cache entry exists", () => {
    expect(getTestCache("nonexistent_12345")).toBeNull();
  });

  it("returns null for numeric testId when no entry exists", () => {
    expect(getTestCache(9999)).toBeNull();
  });

  it("returns the saved entry after saveTestCache", () => {
    const entry = makeEntry("42");
    saveTestCache("42", entry, "1000000000");
    const cached = getTestCache("42");
    expect(cached).not.toBeNull();
    expect(cached?.test.id).toBe("42");
    expect(cached?.test.name).toBe("Test 42");
  });

  it("returns questions array with correct length", () => {
    const entry = makeEntry("7");
    saveTestCache("7", entry, "1000000000");
    const cached = getTestCache("7");
    expect(cached?.questions.length).toBe(2);
  });

  it("returns sections array", () => {
    const entry = makeEntry("5");
    saveTestCache("5", entry, "1000000000");
    const cached = getTestCache("5");
    expect(cached?.sections.length).toBe(1);
    expect(cached?.sections[0].name).toBe("Section A");
  });

  it("accepts numeric testId for retrieval", () => {
    const entry = makeEntry("15");
    saveTestCache(15, entry, "1000000000");
    const cached = getTestCache(15);
    expect(cached).not.toBeNull();
    expect(cached?.test.id).toBe("15");
  });

  it("returns null when localStorage contains malformed JSON", () => {
    localStorage.setItem("prepstream_test_cache_bad", "{{not-json}}");
    expect(getTestCache("bad")).toBeNull();
  });

  it("includes savedAt timestamp after save", () => {
    const entry = makeEntry("3");
    const before = Date.now();
    saveTestCache("3", entry, "1000000000");
    const after = Date.now();
    const cached = getTestCache("3");
    expect(cached?.savedAt).toBeGreaterThanOrEqual(before);
    expect(cached?.savedAt).toBeLessThanOrEqual(after);
  });
});

// ── saveTestCache ─────────────────────────────────────────────────────────────

describe("saveTestCache", () => {
  it("stores entry with the provided updatedAt", () => {
    const entry = makeEntry("10");
    saveTestCache("10", entry, "9999999999");
    const cached = getTestCache("10");
    expect(cached?.updatedAt).toBe("9999999999");
  });

  it("overwriting an entry replaces updatedAt", () => {
    const entry = makeEntry("11", "100");
    saveTestCache("11", entry, "100");
    const updated = makeEntry("11", "200");
    saveTestCache("11", updated, "200");
    const cached = getTestCache("11");
    expect(cached?.updatedAt).toBe("200");
  });

  it("updates the meta map when saving", () => {
    saveTestCache("20", makeEntry("20", "555"), "555");
    const meta = getCacheMeta();
    expect(meta["20"]).toBe("555");
  });

  it("overwrites meta entry on second save", () => {
    saveTestCache("21", makeEntry("21", "1"), "1");
    saveTestCache("21", makeEntry("21", "2"), "2");
    const meta = getCacheMeta();
    expect(meta["21"]).toBe("2");
  });

  it("stores test metadata correctly (name, description)", () => {
    const entry = makeEntry("30");
    saveTestCache("30", entry, "1000000000");
    const cached = getTestCache("30");
    expect(cached?.test.name).toBe("Test 30");
    expect(cached?.test.description).toBe("Description for test 30");
  });

  it("stores question fields correctly", () => {
    const entry = makeEntry("31");
    saveTestCache("31", entry, "1000000000");
    const cached = getTestCache("31");
    const q = cached?.questions[0];
    expect(q?.text).toBe("What is 2+2?");
    expect(q?.questionType).toBe("mcSingle");
    expect(q?.options).toEqual(["3", "4", "5"]);
    expect(q?.correctAnswers).toEqual(["1"]);
  });
});

// ── clearTestCache ────────────────────────────────────────────────────────────

describe("clearTestCache", () => {
  it("removes a specific test entry by string id", () => {
    saveTestCache("50", makeEntry("50"), "1000000000");
    clearTestCache("50");
    expect(getTestCache("50")).toBeNull();
  });

  it("removes a specific test entry by numeric id", () => {
    saveTestCache(51, makeEntry("51"), "1000000000");
    clearTestCache(51);
    expect(getTestCache(51)).toBeNull();
  });

  it("removes entry from meta map", () => {
    saveTestCache("52", makeEntry("52"), "1000000000");
    clearTestCache("52");
    const meta = getCacheMeta();
    expect(meta["52"]).toBeUndefined();
  });

  it("does NOT remove other test entries", () => {
    saveTestCache("53", makeEntry("53"), "1000000000");
    saveTestCache("54", makeEntry("54"), "2000000000");
    clearTestCache("53");
    expect(getTestCache("53")).toBeNull();
    expect(getTestCache("54")).not.toBeNull();
  });

  it("does NOT remove other entries from meta", () => {
    saveTestCache("55", makeEntry("55"), "1000000000");
    saveTestCache("56", makeEntry("56"), "2000000000");
    clearTestCache("55");
    const meta = getCacheMeta();
    expect(meta["55"]).toBeUndefined();
    expect(meta["56"]).toBe("2000000000");
  });

  it("is a no-op when the entry does not exist", () => {
    // Should not throw when clearing a non-existent entry
    expect(() => clearTestCache("nonexistent_99999")).not.toThrow();
  });
});

// ── clearAllCache ─────────────────────────────────────────────────────────────

describe("clearAllCache", () => {
  it("removes all cached test entries", () => {
    saveTestCache("60", makeEntry("60"), "1000000000");
    saveTestCache("61", makeEntry("61"), "2000000000");
    saveTestCache("62", makeEntry("62"), "3000000000");
    clearAllCache();
    expect(getTestCache("60")).toBeNull();
    expect(getTestCache("61")).toBeNull();
    expect(getTestCache("62")).toBeNull();
  });

  it("empties the meta map", () => {
    saveTestCache("70", makeEntry("70"), "1000000000");
    saveTestCache("71", makeEntry("71"), "2000000000");
    clearAllCache();
    const meta = getCacheMeta();
    expect(Object.keys(meta).length).toBe(0);
  });

  it("is a no-op when no entries exist", () => {
    expect(() => clearAllCache()).not.toThrow();
    expect(Object.keys(getCacheMeta()).length).toBe(0);
  });

  it("does NOT remove non-cache localStorage keys", () => {
    localStorage.setItem("my_other_key", "some_value");
    saveTestCache("80", makeEntry("80"), "1000000000");
    clearAllCache();
    expect(localStorage.getItem("my_other_key")).toBe("some_value");
  });
});

// ── isCacheValid ──────────────────────────────────────────────────────────────

describe("isCacheValid", () => {
  it("returns true when cached and server updatedAt are equal", () => {
    expect(isCacheValid("1000000000", "1000000000")).toBe(true);
  });

  it("returns false when server has a newer updatedAt", () => {
    expect(isCacheValid("1000000000", "2000000000")).toBe(false);
  });

  it("returns false when cache is newer than server (stale state from mismatch)", () => {
    expect(isCacheValid("2000000000", "1000000000")).toBe(false);
  });

  it("returns true for identical string timestamps", () => {
    expect(isCacheValid("9876543210987654321", "9876543210987654321")).toBe(
      true,
    );
  });

  it("returns false for empty vs non-empty updatedAt", () => {
    expect(isCacheValid("", "1000000000")).toBe(false);
  });

  it("returns false for non-empty vs empty updatedAt", () => {
    expect(isCacheValid("1000000000", "")).toBe(false);
  });

  it("returns true for two empty strings", () => {
    expect(isCacheValid("", "")).toBe(true);
  });

  it("treats values as strings — does NOT compare numerically", () => {
    // "10" !== "010" even though they're numerically equal
    expect(isCacheValid("10", "010")).toBe(false);
  });
});

// ── getCacheMeta ──────────────────────────────────────────────────────────────

describe("getCacheMeta", () => {
  it("returns empty object when nothing is cached", () => {
    expect(getCacheMeta()).toEqual({});
  });

  it("returns the correct version map after saving entries", () => {
    saveTestCache("90", makeEntry("90"), "111");
    saveTestCache("91", makeEntry("91"), "222");
    const meta = getCacheMeta();
    expect(meta["90"]).toBe("111");
    expect(meta["91"]).toBe("222");
  });

  it("meta keys are string representations of testId", () => {
    saveTestCache(92, makeEntry("92"), "333");
    const meta = getCacheMeta();
    expect(typeof Object.keys(meta)[0]).toBe("string");
    expect(meta["92"]).toBe("333");
  });

  it("meta is updated after clearing an entry", () => {
    saveTestCache("93", makeEntry("93"), "444");
    clearTestCache("93");
    const meta = getCacheMeta();
    expect(meta["93"]).toBeUndefined();
  });
});

// ── cache key format ──────────────────────────────────────────────────────────

describe("cache key format", () => {
  it("uses the key prepstream_test_cache_{testId} in localStorage", () => {
    saveTestCache("100", makeEntry("100"), "1000000000");
    const raw = localStorage.getItem("prepstream_test_cache_100");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.test.id).toBe("100");
  });

  it("uses the key prepstream_cache_meta for the meta map", () => {
    saveTestCache("101", makeEntry("101"), "5000");
    const rawMeta = localStorage.getItem("prepstream_cache_meta");
    expect(rawMeta).not.toBeNull();
    const parsed = JSON.parse(rawMeta!);
    expect(parsed["101"]).toBe("5000");
  });

  it("separate test IDs produce separate localStorage keys", () => {
    saveTestCache("200", makeEntry("200"), "111");
    saveTestCache("201", makeEntry("201"), "222");
    expect(localStorage.getItem("prepstream_test_cache_200")).not.toBeNull();
    expect(localStorage.getItem("prepstream_test_cache_201")).not.toBeNull();
    // Ensure they are separate entries
    const raw200 = JSON.parse(
      localStorage.getItem("prepstream_test_cache_200")!,
    );
    const raw201 = JSON.parse(
      localStorage.getItem("prepstream_test_cache_201")!,
    );
    expect(raw200.test.id).toBe("200");
    expect(raw201.test.id).toBe("201");
  });
});
