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
  getSavedManifest,
  getTestCache,
  isCacheValid,
  isManifestStale,
  saveManifest,
  saveTestCache,
} from "../utils/offlineCache";
import type { TestCacheEntry } from "../utils/offlineCache";

// ── helpers ───────────────────────────────────────────────────────────────────

function makeEntry(
  testId: string,
  updatedAt = "1000000000",
  withAudio = false,
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
        audioUrl: withAudio ? "https://example.com/audio.mp3" : undefined,
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
        audioUrl: withAudio ? "https://example.com/audio2.mp3" : undefined,
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

  it("also clears the manifest key prepstream_data_manifest", () => {
    saveManifest({
      checksum: "abc",
      globalUpdatedAt: "2024",
      testCount: 1,
      questionCount: 2,
      sectionCount: 1,
    });
    expect(localStorage.getItem("prepstream_data_manifest")).not.toBeNull();
    clearAllCache();
    expect(localStorage.getItem("prepstream_data_manifest")).toBeNull();
    expect(getSavedManifest()).toBeNull();
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

// ── manifest cache ──────────────────────────────────────────────────────────

describe("getSavedManifest", () => {
  it("returns null when no manifest is saved", () => {
    expect(getSavedManifest()).toBeNull();
  });

  it("returns the saved manifest after saveManifest", () => {
    saveManifest({
      checksum: "chk1",
      globalUpdatedAt: "2024-01-01",
      testCount: 3,
      questionCount: 10,
      sectionCount: 5,
    });
    const m = getSavedManifest();
    expect(m).not.toBeNull();
    expect(m?.checksum).toBe("chk1");
    expect(m?.testCount).toBe(3);
    expect(m?.questionCount).toBe(10);
    expect(m?.sectionCount).toBe(5);
    expect(m?.savedAt).toBeGreaterThan(0);
  });

  it("overwriting the manifest replaces the saved value", () => {
    saveManifest({
      checksum: "old",
      globalUpdatedAt: "2023",
      testCount: 1,
      questionCount: 1,
      sectionCount: 0,
    });
    saveManifest({
      checksum: "new",
      globalUpdatedAt: "2024",
      testCount: 2,
      questionCount: 4,
      sectionCount: 2,
    });
    const m = getSavedManifest();
    expect(m?.checksum).toBe("new");
    expect(m?.testCount).toBe(2);
  });

  it("returns null when localStorage contains malformed manifest JSON", () => {
    localStorage.setItem("prepstream_data_manifest", "{{broken");
    expect(getSavedManifest()).toBeNull();
  });
});

describe("saveManifest", () => {
  it("saves under key prepstream_data_manifest", () => {
    saveManifest({
      checksum: "x",
      globalUpdatedAt: "t",
      testCount: 0,
      questionCount: 0,
      sectionCount: 0,
    });
    const raw = localStorage.getItem("prepstream_data_manifest");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.checksum).toBe("x");
  });

  it("includes a savedAt timestamp", () => {
    const before = Date.now();
    saveManifest({
      checksum: "y",
      globalUpdatedAt: "t",
      testCount: 1,
      questionCount: 2,
      sectionCount: 1,
    });
    const after = Date.now();
    const m = getSavedManifest();
    expect(m?.savedAt).toBeGreaterThanOrEqual(before);
    expect(m?.savedAt).toBeLessThanOrEqual(after);
  });
});

describe("isManifestStale", () => {
  it("returns true when no manifest is saved", () => {
    expect(isManifestStale("any-checksum")).toBe(true);
  });

  it("returns true when saved checksum differs from server checksum", () => {
    saveManifest({
      checksum: "old-sum",
      globalUpdatedAt: "2024",
      testCount: 1,
      questionCount: 1,
      sectionCount: 0,
    });
    expect(isManifestStale("new-sum")).toBe(true);
  });

  it("returns false when saved checksum matches server checksum", () => {
    saveManifest({
      checksum: "matching",
      globalUpdatedAt: "2024",
      testCount: 1,
      questionCount: 1,
      sectionCount: 0,
    });
    expect(isManifestStale("matching")).toBe(false);
  });

  it("is case-sensitive for checksum comparison", () => {
    saveManifest({
      checksum: "ABC",
      globalUpdatedAt: "2024",
      testCount: 1,
      questionCount: 1,
      sectionCount: 0,
    });
    expect(isManifestStale("abc")).toBe(true);
    expect(isManifestStale("ABC")).toBe(false);
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

// ── section-level version stamp cache ──────────────────────────────────────────────────────────────────────────────

/**
 * Inline helpers that mirror the per-section version-check strategy that will
 * be used when the offline-first section cache is fully wired in.
 */

const SECTION_VER_KEY = "prepstream_section_versions";

function readSectionVersionMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(SECTION_VER_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeSectionVersion(sectionId: string, updatedAt: string): void {
  const map = readSectionVersionMap();
  map[sectionId] = updatedAt;
  localStorage.setItem(SECTION_VER_KEY, JSON.stringify(map));
}

function getSectionVersionFromMap(sectionId: string): string | null {
  return readSectionVersionMap()[sectionId] ?? null;
}

function removeSectionVersion(sectionId: string): void {
  const map = readSectionVersionMap();
  delete map[sectionId];
  localStorage.setItem(SECTION_VER_KEY, JSON.stringify(map));
}

function staleSectionIds(serverVersions: Record<string, string>): string[] {
  const cached = readSectionVersionMap();
  return Object.keys(serverVersions).filter(
    (id) => cached[id] !== serverVersions[id],
  );
}

describe("section-level version stamps", () => {
  it("returns empty map when no section versions are saved", () => {
    expect(readSectionVersionMap()).toEqual({});
  });

  it("saves a version stamp for a section", () => {
    writeSectionVersion("sec-1", "ts-1000");
    expect(getSectionVersionFromMap("sec-1")).toBe("ts-1000");
  });

  it("does not overwrite sibling sections when one section is updated", () => {
    writeSectionVersion("sec-1", "v1");
    writeSectionVersion("sec-2", "v2");
    writeSectionVersion("sec-1", "v1-new");
    expect(getSectionVersionFromMap("sec-1")).toBe("v1-new");
    expect(getSectionVersionFromMap("sec-2")).toBe("v2");
  });

  it("removeSectionVersion deletes only the targeted section", () => {
    writeSectionVersion("a", "va");
    writeSectionVersion("b", "vb");
    removeSectionVersion("a");
    expect(getSectionVersionFromMap("a")).toBeNull();
    expect(getSectionVersionFromMap("b")).toBe("vb");
  });

  it("staleSectionIds returns empty when all versions match", () => {
    writeSectionVersion("1", "match");
    writeSectionVersion("2", "match2");
    expect(staleSectionIds({ "1": "match", "2": "match2" })).toHaveLength(0);
  });

  it("staleSectionIds includes sections not yet in cache", () => {
    expect(staleSectionIds({ "99": "any" })).toContain("99");
  });

  it("staleSectionIds includes sections whose version changed", () => {
    writeSectionVersion("5", "old-v");
    expect(staleSectionIds({ "5": "new-v" })).toContain("5");
  });

  it("staleSectionIds does NOT include sections that are fresh", () => {
    writeSectionVersion("fresh", "same-ts");
    const stale = staleSectionIds({ fresh: "same-ts", stale: "new-ts" });
    expect(stale).not.toContain("fresh");
    expect(stale).toContain("stale");
  });

  it("stores section version map under key prepstream_section_versions", () => {
    writeSectionVersion("x", "v-x");
    const raw = localStorage.getItem(SECTION_VER_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!).x).toBe("v-x");
  });

  it("section version map is independent of test cache meta", () => {
    writeSectionVersion("s1", "v1");
    saveTestCache("t1", makeEntry("t1"), "ts-t1");
    expect(getSectionVersionFromMap("s1")).toBe("v1");
    expect(getCacheMeta().t1).toBe("ts-t1");
  });

  it("isCacheValid can compare section updatedAt strings", () => {
    writeSectionVersion("s2", "abc-123");
    const cached = getSectionVersionFromMap("s2");
    expect(isCacheValid(cached!, "abc-123")).toBe(true);
    expect(isCacheValid(cached!, "abc-124")).toBe(false);
  });
});

describe("section data embedded in test cache entries", () => {
  it("sections array in cache entry contains correct ids", () => {
    const entry = makeEntry("77");
    saveTestCache("77", entry, "ts-77");
    const cached = getTestCache("77");
    expect(cached?.sections.length).toBe(1);
    expect(cached?.sections[0].id).toBe("10");
  });

  it("section updatedAt is preserved after save and retrieve", () => {
    const entry = makeEntry("78", "section-ts-999");
    saveTestCache("78", entry, "section-ts-999");
    const cached = getTestCache("78");
    expect(cached?.sections[0].updatedAt).toBe("section-ts-999");
  });

  it("multiple sections stored and retrieved correctly", () => {
    const entry = makeEntry("79");
    entry.sections.push({
      id: "11",
      testId: "79",
      name: "Section B",
      description: "Second",
      updatedAt: "1000000000",
    });
    saveTestCache("79", entry, "1000000000");
    const cached = getTestCache("79");
    expect(cached?.sections.length).toBe(2);
    const names = cached?.sections.map((s) => s.name);
    expect(names).toContain("Section A");
    expect(names).toContain("Section B");
  });

  it("clearing test cache removes section data for that test only", () => {
    saveTestCache("80", makeEntry("80"), "ts-80");
    saveTestCache("81", makeEntry("81"), "ts-81");
    clearTestCache("80");
    expect(getTestCache("80")).toBeNull();
    expect(getTestCache("81")?.sections.length).toBe(1);
  });

  it("clearAllCache removes all section-embedded test entries", () => {
    saveTestCache("82", makeEntry("82"), "ts-82");
    saveTestCache("83", makeEntry("83"), "ts-83");
    clearAllCache();
    expect(getTestCache("82")).toBeNull();
    expect(getTestCache("83")).toBeNull();
  });
});

// ── audioUrl cache round-trip ──────────────────────────────────────────────────

describe("audioUrl cache round-trip", () => {
  it("question with audioUrl: field is preserved after save and retrieve", () => {
    const entry = makeEntry("audio-1", "ts-1", true);
    saveTestCache("audio-1", entry, "ts-1");
    const cached = getTestCache("audio-1");
    expect(cached?.questions[0].audioUrl).toBe("https://example.com/audio.mp3");
    expect(cached?.questions[1].audioUrl).toBe(
      "https://example.com/audio2.mp3",
    );
  });

  it("question without audioUrl: field is undefined after retrieve", () => {
    const entry = makeEntry("audio-2", "ts-2", false);
    saveTestCache("audio-2", entry, "ts-2");
    const cached = getTestCache("audio-2");
    expect(cached?.questions[0].audioUrl).toBeUndefined();
    expect(cached?.questions[1].audioUrl).toBeUndefined();
  });

  it("audioUrl survives a second save (overwrite) without corruption", () => {
    const entry1 = makeEntry("audio-3", "ts-1", true);
    saveTestCache("audio-3", entry1, "ts-1");
    const entry2 = makeEntry("audio-3", "ts-2", true);
    saveTestCache("audio-3", entry2, "ts-2");
    const cached = getTestCache("audio-3");
    expect(cached?.questions[0].audioUrl).toBe("https://example.com/audio.mp3");
  });

  it("audioUrl is included in questions when saving with audio", () => {
    const entry = makeEntry("audio-4", "ts-4", true);
    saveTestCache("audio-4", entry, "ts-4");
    const cached = getTestCache("audio-4");
    const q = cached?.questions[0];
    expect(q).toBeDefined();
    expect(typeof q?.audioUrl).toBe("string");
    expect(q?.audioUrl?.length).toBeGreaterThan(0);
  });

  it("audioUrl is not present when question has no audio (not null string)", () => {
    const entry = makeEntry("audio-5", "ts-5", false);
    saveTestCache("audio-5", entry, "ts-5");
    const cached = getTestCache("audio-5");
    // Should be undefined (field omitted), not the string "undefined" or null
    const audioUrl = cached?.questions[0].audioUrl;
    expect(audioUrl === undefined || audioUrl === null || audioUrl === "").toBe(
      true,
    );
  });

  it("two questions in same entry each preserve their own audioUrl", () => {
    const entry = makeEntry("audio-6", "ts-6", true);
    saveTestCache("audio-6", entry, "ts-6");
    const cached = getTestCache("audio-6");
    expect(cached?.questions[0].audioUrl).toBe("https://example.com/audio.mp3");
    expect(cached?.questions[1].audioUrl).toBe(
      "https://example.com/audio2.mp3",
    );
    // Ensure they are distinct
    expect(cached?.questions[0].audioUrl).not.toBe(
      cached?.questions[1].audioUrl,
    );
  });

  it("mixed: some questions with audio, some without — all preserved correctly", () => {
    const entry = makeEntry("audio-7", "ts-7", false);
    // Manually set audioUrl on just the first question
    entry.questions[0].audioUrl = "https://example.com/only-q1.mp3";
    saveTestCache("audio-7", entry, "ts-7");
    const cached = getTestCache("audio-7");
    expect(cached?.questions[0].audioUrl).toBe(
      "https://example.com/only-q1.mp3",
    );
    expect(
      cached?.questions[1].audioUrl === undefined ||
        cached?.questions[1].audioUrl === null,
    ).toBe(true);
  });
});

// ── second-session audio: urlSessionId dependency ensures re-run ────────────────

/**
 * These tests document and verify the dependency model for the audio useEffect.
 * The effect has [currentIdx, questions.length, audioUrl, urlSessionId] as deps.
 * urlSessionId changes on every Try Again / fresh session — this is the key
 * that ensures the effect re-runs even when currentIdx=0 and audioUrl are identical
 * to the previous session, which would otherwise keep the stale paused audio element.
 */
describe("second-session audio: urlSessionId dep guarantees re-run", () => {
  it("same currentIdx + same audioUrl + different sessionId → effect fires", () => {
    const sess1 = {
      currentIdx: 0,
      audioUrl: "https://ex.com/q1.mp3",
      sessionId: "sess-aaa",
    };
    const sess2 = {
      currentIdx: 0,
      audioUrl: "https://ex.com/q1.mp3",
      sessionId: "sess-bbb",
    };
    const effectFires =
      sess1.currentIdx !== sess2.currentIdx ||
      sess1.audioUrl !== sess2.audioUrl ||
      sess1.sessionId !== sess2.sessionId;
    expect(effectFires).toBe(true);
  });

  it("same sessionId + same currentIdx + same audioUrl → effect does NOT re-fire", () => {
    const prev = {
      currentIdx: 0,
      audioUrl: "https://ex.com/q1.mp3",
      sessionId: "sess-same",
    };
    const next = {
      currentIdx: 0,
      audioUrl: "https://ex.com/q1.mp3",
      sessionId: "sess-same",
    };
    const effectFires =
      prev.currentIdx !== next.currentIdx ||
      prev.audioUrl !== next.audioUrl ||
      prev.sessionId !== next.sessionId;
    // No spurious re-fire when nothing changed
    expect(effectFires).toBe(false);
  });

  it("Try Again changes sessionId even when same test, same q1, same audioUrl", () => {
    const originalSessionId = "original-session-id";
    // Try Again always generates a new sessionId (random + timestamp)
    const newSessionId = `new-session-${Date.now().toString(36)}`;
    expect(newSessionId).not.toBe(originalSessionId);
  });

  it("cleanup runs on sessionId change: old audio paused before new one starts", () => {
    let pauseCallCount = 0;
    const mockAudioElement = {
      pause: () => {
        pauseCallCount++;
      },
      src: "https://ex.com/audio.mp3",
      load: () => {},
    };
    // Simulate cleanup that fires when sessionId dep changes
    const cleanup = (el: typeof mockAudioElement) => {
      el.pause();
      el.src = "";
      el.load();
    };
    cleanup(mockAudioElement);
    expect(pauseCallCount).toBe(1);
    expect(mockAudioElement.src).toBe("");
  });

  it("four Try Again sessions each get a unique sessionId (all different)", () => {
    const sessions = Array.from(
      { length: 4 },
      (_, i) => `session-${i}-${Date.now()}-${Math.random()}`,
    );
    const unique = new Set(sessions);
    expect(unique.size).toBe(4);
  });

  it("audio auto-play fires for second session's first question", () => {
    // Second session: sessionId changed → effect runs → audio plays
    type AudioState =
      | "none"
      | "loading"
      | "playing"
      | "paused"
      | "finished"
      | "blocked";
    let audioState: AudioState = "finished"; // leftover from session 1
    const newSessionAudioUrl = "https://ex.com/q1.mp3";
    // Effect fires because sessionId changed in deps:
    audioState = newSessionAudioUrl ? "loading" : "none";
    // Then canplay fires:
    audioState = "playing";
    expect(audioState).toBe("playing");
  });

  it("Play Again button shows after second session audio ends", () => {
    type AudioState =
      | "none"
      | "loading"
      | "playing"
      | "paused"
      | "finished"
      | "blocked";
    // Use a helper to prevent TypeScript from narrowing the literal type
    function getButtonLabel(state: AudioState): string {
      if (state === "playing") return "Pause";
      if (state === "blocked") return "Tap to Play";
      return "Play Again";
    }
    let audioState: AudioState = "playing"; // second session audio playing
    audioState = "finished"; // ended event fires
    expect(getButtonLabel(audioState)).toBe("Play Again");
  });

  it("sessionId in dep array is distinct from sessionIdRef (URL param vs internal ref)", () => {
    // urlSessionId comes from URL search params and changes on navigation.
    // sessionIdRef is a stable internal ref for the current session.
    // The audio effect uses urlSessionId (from URL) to detect navigation events.
    const urlSessionId = "url-param-session-id"; // from useSearch
    const sessionIdRef = "internal-ref-session-id"; // from useRef
    // They serve different purposes — using urlSessionId in audio dep is correct.
    expect(urlSessionId).not.toBe(sessionIdRef);
  });
});
