/**
 * Unit tests for the data sync manifest + cache integration.
 *
 * Covers:
 * - clearAllCache also clears the manifest (tested in offlineCache.test.ts too)
 * - getSavedManifest / saveManifest / isManifestStale behaviour under several scenarios
 * - Mock backend getDataManifest + getAllTestData returns correct shape
 * - Manifest checksum comparison logic
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockBackendService } from "../mocks/backend";
import {
  clearAllCache,
  getCacheMeta,
  getSavedManifest,
  getTestCache,
  isManifestStale,
  saveManifest,
  saveTestCache,
} from "../utils/offlineCache";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

// ── Manifest cache contract ──────────────────────────────────────────────────────────────

describe("manifest cache contract", () => {
  it("initial load from cache returns null manifest", () => {
    expect(getSavedManifest()).toBeNull();
  });

  it("isManifestStale returns true when no manifest saved — triggers getAllTestData", () => {
    // On cold start, no manifest exists, so any checksum should be stale
    expect(isManifestStale("any-server-checksum")).toBe(true);
  });

  it("after saving manifest, isManifestStale returns false for matching checksum", () => {
    saveManifest({
      checksum: "v1",
      globalUpdatedAt: "2024",
      testCount: 2,
      questionCount: 5,
      sectionCount: 3,
    });
    expect(isManifestStale("v1")).toBe(false);
  });

  it("after saving manifest, isManifestStale returns true when checksum differs", () => {
    saveManifest({
      checksum: "v1",
      globalUpdatedAt: "2024",
      testCount: 2,
      questionCount: 5,
      sectionCount: 3,
    });
    expect(isManifestStale("v2")).toBe(true);
  });

  it("saving manifest with new checksum updates the stored value", () => {
    saveManifest({
      checksum: "v1",
      globalUpdatedAt: "2024",
      testCount: 1,
      questionCount: 2,
      sectionCount: 1,
    });
    saveManifest({
      checksum: "v2",
      globalUpdatedAt: "2025",
      testCount: 2,
      questionCount: 4,
      sectionCount: 2,
    });
    const m = getSavedManifest();
    expect(m?.checksum).toBe("v2");
    expect(m?.testCount).toBe(2);
  });
});

// ── Data stored in localStorage after bulk fetch ────────────────────────────────────────

describe("data stored in localStorage after bulk fetch simulation", () => {
  it("saving test bundles populates getCacheMeta", () => {
    const updAt = String(Date.now());
    saveTestCache(
      "1",
      {
        test: {
          id: "1",
          name: "Test A",
          description: "Desc",
          updatedAt: updAt,
        },
        questions: [],
        sections: [],
        updatedAt: updAt,
      },
      updAt,
    );
    const meta = getCacheMeta();
    expect(meta["1"]).toBe(updAt);
  });

  it("saving manifest after bulk fetch makes isManifestStale return false", () => {
    saveManifest({
      checksum: "bulk-v1",
      globalUpdatedAt: "2024",
      testCount: 1,
      questionCount: 0,
      sectionCount: 0,
    });
    expect(isManifestStale("bulk-v1")).toBe(false);
  });

  it("getTestCache returns saved test after simulated bulk save", () => {
    const updAt = String(BigInt(Date.now()) * BigInt(1_000_000));
    saveTestCache(
      "42",
      {
        test: {
          id: "42",
          name: "Bulk Test",
          description: "Fetched via getAllTestData",
          updatedAt: updAt,
        },
        questions: [
          {
            id: "101",
            testId: "42",
            orderIndex: "0",
            text: "Q1",
            questionType: "mcSingle",
            options: ["A", "B"],
            correctAnswers: ["0"],
            correctText: "",
            correctOrder: [],
            questionUpdatedAt: updAt,
          },
        ],
        sections: [
          {
            id: "201",
            testId: "42",
            name: "Section 1",
            description: "",
            updatedAt: updAt,
          },
        ],
        updatedAt: updAt,
      },
      updAt,
    );
    const cached = getTestCache("42");
    expect(cached).not.toBeNull();
    expect(cached?.test.name).toBe("Bulk Test");
    expect(cached?.questions.length).toBe(1);
    expect(cached?.sections.length).toBe(1);
  });
});

// ── clearAllCache clears manifest ───────────────────────────────────────────────────────

describe("clearAllCache clears the manifest", () => {
  it("clearAllCache removes manifest so next sync sees stale", () => {
    saveManifest({
      checksum: "stored-v1",
      globalUpdatedAt: "2024",
      testCount: 1,
      questionCount: 2,
      sectionCount: 1,
    });
    expect(isManifestStale("stored-v1")).toBe(false);
    clearAllCache();
    // After clearing, should be stale again
    expect(isManifestStale("stored-v1")).toBe(true);
    expect(getSavedManifest()).toBeNull();
  });

  it("clearAllCache removes all test cache entries", () => {
    const updAt = String(Date.now());
    saveTestCache(
      "1",
      {
        test: { id: "1", name: "T1", description: "", updatedAt: updAt },
        questions: [],
        sections: [],
        updatedAt: updAt,
      },
      updAt,
    );
    saveTestCache(
      "2",
      {
        test: { id: "2", name: "T2", description: "", updatedAt: updAt },
        questions: [],
        sections: [],
        updatedAt: updAt,
      },
      updAt,
    );
    clearAllCache();
    expect(getTestCache("1")).toBeNull();
    expect(getTestCache("2")).toBeNull();
  });
});

// ── Mock backend getDataManifest ────────────────────────────────────────────────────────────

describe("mock backend getDataManifest", () => {
  it("returns a DataManifest with a non-empty checksum", async () => {
    const manifest = await mockBackendService.getDataManifest();
    expect(manifest.checksum).toBeTruthy();
    expect(typeof manifest.checksum).toBe("string");
  });

  it("testCount, questionCount, sectionCount are BigInt", async () => {
    const manifest = await mockBackendService.getDataManifest();
    expect(typeof manifest.testCount).toBe("bigint");
    expect(typeof manifest.questionCount).toBe("bigint");
    expect(typeof manifest.sectionCount).toBe("bigint");
  });

  it("testCount matches the seeded test count", async () => {
    const manifest = await mockBackendService.getDataManifest();
    expect(Number(manifest.testCount)).toBe(3); // 3 seeded tests
  });
});

// ── Mock backend getAllTestData ───────────────────────────────────────────────────────────

describe("mock backend getAllTestData", () => {
  it("returns manifest and tests array", async () => {
    const data = await mockBackendService.getAllTestData();
    expect(data.manifest).toBeDefined();
    expect(Array.isArray(data.tests)).toBe(true);
  });

  it("manifest checksum matches getDataManifest checksum", async () => {
    const manifestOnly = await mockBackendService.getDataManifest();
    const allData = await mockBackendService.getAllTestData();
    expect(allData.manifest.checksum).toBe(manifestOnly.checksum);
  });

  it("tests array includes nested questions and sections", async () => {
    const data = await mockBackendService.getAllTestData();
    // Test 1 has seeded questions and sections
    const test1 = data.tests.find((t) => String(t.id) === "1");
    expect(test1).toBeDefined();
    expect(Array.isArray(test1?.questions)).toBe(true);
    expect(Array.isArray(test1?.sections)).toBe(true);
    expect(test1?.questions?.length ?? 0).toBeGreaterThan(0);
  });

  it("manifest in getAllTestData has non-zero testCount", async () => {
    const data = await mockBackendService.getAllTestData();
    expect(Number(data.manifest.testCount)).toBeGreaterThan(0);
  });

  it("2-call sync cycle: getDataManifest then getAllTestData updates cache", async () => {
    // Step 1: version check
    const manifest = await mockBackendService.getDataManifest();
    const isStale = isManifestStale(manifest.checksum);
    expect(isStale).toBe(true); // no manifest in cache yet

    // Step 2: bulk fetch
    const allData = await mockBackendService.getAllTestData();
    for (const t of allData.tests) {
      const testId = String(t.id);
      const updatedAt = String(t.updatedAt);
      saveTestCache(
        testId,
        {
          test: {
            id: testId,
            name: t.name,
            description: t.description,
            updatedAt,
          },
          questions: t.questions.map((q) => ({
            id: String(q.id),
            testId: String(q.testId),
            orderIndex: String(q.orderIndex),
            text: q.text,
            questionType: q.questionType,
            options: q.options,
            correctAnswers: q.correctAnswers.map(String),
            correctText: q.correctText,
            correctOrder: q.correctOrder.map(String),
            sectionId: q.sectionId != null ? String(q.sectionId) : undefined,
            questionUpdatedAt: String(q.questionUpdatedAt),
          })),
          sections: t.sections.map((s) => ({
            id: String(s.id),
            testId: String(s.testId),
            name: s.name,
            description: s.description,
            updatedAt: String(s.updatedAt),
          })),
          updatedAt,
        },
        updatedAt,
      );
    }
    saveManifest({
      checksum: allData.manifest.checksum,
      globalUpdatedAt: allData.manifest.globalUpdatedAt,
      testCount: Number(allData.manifest.testCount),
      questionCount: Number(allData.manifest.questionCount),
      sectionCount: Number(allData.manifest.sectionCount),
    });

    // After saving: manifest matches, no stale
    expect(isManifestStale(manifest.checksum)).toBe(false);

    // Test cache populated
    const cached = getTestCache("1");
    expect(cached).not.toBeNull();
    expect(cached?.test.name).toBeTruthy();
  });
});

// ── Section version-check sync flow ──────────────────────────────────────────────────────────────────────────

const SEC_VER_KEY = "prepstream_section_versions";

function readSecVers(): Record<string, string> {
  try {
    const raw = localStorage.getItem(SEC_VER_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeSecVer(id: string, ts: string): void {
  const m = readSecVers();
  m[id] = ts;
  localStorage.setItem(SEC_VER_KEY, JSON.stringify(m));
}

function staleSecs(serverVersions: Record<string, string>): string[] {
  const cached = readSecVers();
  return Object.keys(serverVersions).filter(
    (id) => cached[id] !== serverVersions[id],
  );
}

describe("section version-check sync flow", () => {
  it("cold start: all selected sections are stale (no cache)", () => {
    const serverVersions: Record<string, string> = { "1": "v1", "2": "v2" };
    expect(staleSecs(serverVersions)).toHaveLength(2);
  });

  it("warm start: sections fetched previously, versions match → zero stale", () => {
    writeSecVer("1", "v1");
    writeSecVer("2", "v2");
    const serverVersions: Record<string, string> = { "1": "v1", "2": "v2" };
    expect(staleSecs(serverVersions)).toHaveLength(0);
  });

  it("partial warm start: 1 of 3 sections stale after content update", () => {
    writeSecVer("1", "v1");
    writeSecVer("2", "v2");
    writeSecVer("3", "v3");
    const stale = staleSecs({ "1": "v1", "2": "v2-updated", "3": "v3" });
    expect(stale).toEqual(["2"]);
  });

  it("after fetching stale section and saving version, next sync sees 0 stale", () => {
    writeSecVer("1", "v1");
    let stale = staleSecs({ "1": "v1", "2": "v2-new" });
    expect(stale).toContain("2");
    writeSecVer("2", "v2-new");
    stale = staleSecs({ "1": "v1", "2": "v2-new" });
    expect(stale).toHaveLength(0);
  });

  it("section version map is preserved after saving test cache", () => {
    writeSecVer("s1", "preserve-me");
    const updAt = String(Date.now());
    saveTestCache(
      "300",
      {
        test: { id: "300", name: "T", description: "", updatedAt: updAt },
        questions: [],
        sections: [],
        updatedAt: updAt,
      },
      updAt,
    );
    expect(readSecVers().s1).toBe("preserve-me");
  });

  it("section version map is independent of global manifest checksum", () => {
    writeSecVer("sA", "v-a");
    saveManifest({
      checksum: "chk-xyz",
      globalUpdatedAt: "2025",
      testCount: 1,
      questionCount: 2,
      sectionCount: 1,
    });
    expect(readSecVers().sA).toBe("v-a");
    expect(isManifestStale("chk-xyz")).toBe(false);
  });

  it("version check covers only the sections in the current session", () => {
    for (let i = 1; i <= 10; i++) {
      writeSecVer(String(i), `v${i}`);
    }
    const selectedSections: Record<string, string> = { "3": "v3", "7": "v7" };
    const stale = staleSecs(selectedSections);
    expect(stale).toHaveLength(0);
  });

  it("sync cycle: version check + stale fetch + cache save + no-op on next cycle", async () => {
    const serverV1: Record<string, string> = { "1": "ts-100", "2": "ts-200" };
    let stale = staleSecs(serverV1);
    expect(stale.length).toBe(2);

    const mockFetch = vi.fn().mockResolvedValue([
      { sectionId: "1", updatedAt: "ts-100", questions: [] },
      { sectionId: "2", updatedAt: "ts-200", questions: [] },
    ]);
    await mockFetch(stale);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    for (const [id, ts] of Object.entries(serverV1)) {
      writeSecVer(id, ts);
    }
    stale = staleSecs(serverV1);
    expect(stale.length).toBe(0);
  });

  it("mock backend getAllTestData includes section updatedAt for per-section versioning", async () => {
    const data = await mockBackendService.getAllTestData();
    const test1 = data.tests.find((t) => String(t.id) === "1");
    expect(test1).toBeDefined();
    expect(Array.isArray(test1?.sections)).toBe(true);
    for (const s of test1!.sections) {
      expect(s).toHaveProperty("updatedAt");
      expect(String((s as { updatedAt: bigint }).updatedAt)).toBeTruthy();
    }
  });

  it("getDataManifest sectionCount reflects correct number of seeded sections", async () => {
    const manifest = await mockBackendService.getDataManifest();
    expect(Number(manifest.sectionCount)).toBe(2);
  });

  it("5 sections all fresh → zero stale IDs in version check result", () => {
    for (let i = 1; i <= 5; i++) {
      writeSecVer(String(i), `v${i}`);
    }
    const serverVersions: Record<string, string> = {};
    for (let i = 1; i <= 5; i++) {
      serverVersions[String(i)] = `v${i}`;
    }
    expect(staleSecs(serverVersions)).toHaveLength(0);
  });

  it("changing only one section's version stales only that section", () => {
    writeSecVer("alpha", "ts-1");
    writeSecVer("beta", "ts-2");
    writeSecVer("gamma", "ts-3");
    const stale = staleSecs({
      alpha: "ts-1",
      beta: "ts-2-updated",
      gamma: "ts-3",
    });
    expect(stale).toEqual(["beta"]);
  });
});
