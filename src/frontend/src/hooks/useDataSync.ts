/**
 * useDataSync — central data sync orchestrator.
 *
 * Flow:
 *   1. On mount: immediately return any data already in cache (zero backend calls).
 *   2. Call actor.getDataManifest() — the single version-check GET.
 *   3. If checksum matches saved manifest: stop, use cache, done.
 *   4. If checksum differs or no manifest: call actor.getAllTestData() to fetch
 *      all tests/questions/sections in one bulk GET, save to cache, save manifest.
 *
 * This means the happy-path (no changes) costs exactly 1 GET total per session.
 * After a mutation the caller calls refreshData() which re-runs the same 2-call cycle.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { Question, Section, Test } from "../services/backendService";
import type {
  CachedQuestion,
  CachedSection,
  CachedTest,
} from "../utils/offlineCache";
import {
  clearAllCache,
  getCacheMeta,
  getTestCache,
  isManifestStale,
  saveManifest,
  saveTestCache,
} from "../utils/offlineCache";
import { useBackend } from "./useBackend";

export interface SyncedTest {
  test: CachedTest;
  questions: CachedQuestion[];
  sections: CachedSection[];
}

export interface DataSyncState {
  /** All synced tests (from cache). Empty until first sync completes. */
  syncedTests: SyncedTest[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  refreshData: () => void;
  clearCache: () => void;
}

/** Convert a backend Test to a CachedTest */
function toCachedTest(t: Test): CachedTest {
  return {
    id: String(t.id),
    name: t.name,
    description: t.description,
    updatedAt: String(t.updatedAt),
  };
}

/** Convert a backend Question to a CachedQuestion */
function toCachedQuestion(q: Question): CachedQuestion {
  return {
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
    explanation: q.explanation ?? null,
    audioUrl: (q as Question & { audioUrl?: string }).audioUrl ?? null,
  };
}

/** Convert a backend Section to a CachedSection */
function toCachedSection(s: Section): CachedSection {
  return {
    id: String(s.id),
    testId: String(s.testId),
    name: s.name,
    description: s.description,
    updatedAt: String(s.updatedAt),
  };
}

/** Load all currently cached tests from localStorage */
function loadAllFromCache(): SyncedTest[] {
  const meta = getCacheMeta();
  const results: SyncedTest[] = [];
  for (const testId of Object.keys(meta)) {
    const entry = getTestCache(testId);
    if (entry) {
      results.push({
        test: entry.test,
        questions: entry.questions,
        sections: entry.sections,
      });
    }
  }
  return results;
}

export function useDataSync(): DataSyncState {
  const backend = useBackend();
  const [syncedTests, setSyncedTests] = useState<SyncedTest[]>(() =>
    loadAllFromCache(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const syncRunRef = useRef(false);

  const runSync = useCallback(
    async (force = false) => {
      if (!backend) return;
      if (!force && syncRunRef.current) return;
      syncRunRef.current = true;

      setIsSyncing(true);
      setError(null);

      try {
        // Step 1: single version-check GET
        const manifest = await backend.getDataManifest();
        const serverChecksum = manifest.checksum;

        // Step 2: compare with saved manifest
        if (!force && !isManifestStale(serverChecksum)) {
          // Cache is current — load from localStorage, no bulk fetch needed
          const cached = loadAllFromCache();
          setSyncedTests(cached);
          setIsLoading(false);
          setIsSyncing(false);
          return;
        }

        // Step 3: checksum differs — bulk fetch
        const allData = await backend.getAllTestData();

        // Save each test bundle to localStorage
        for (const t of allData.tests) {
          const testId = String(t.id);
          const updatedAt = String(t.updatedAt);
          const questions = (t.questions as Question[]).map(toCachedQuestion);
          const sections = (t.sections as unknown as Section[]).map(
            toCachedSection,
          );
          saveTestCache(
            testId,
            {
              test: toCachedTest(t as unknown as Test),
              questions,
              sections,
              updatedAt,
            },
            updatedAt,
          );
        }

        // Save the manifest so future runs don’t re-fetch
        saveManifest({
          checksum: allData.manifest.checksum,
          globalUpdatedAt: allData.manifest.globalUpdatedAt,
          testCount: Number(allData.manifest.testCount),
          questionCount: Number(allData.manifest.questionCount),
          sectionCount: Number(allData.manifest.sectionCount),
        });

        const cached = loadAllFromCache();
        setSyncedTests(cached);
      } catch (err) {
        // Network failure — fall back to whatever is in cache
        const cached = loadAllFromCache();
        setSyncedTests(cached);
        if (cached.length === 0) {
          setError(String(err));
        }
      } finally {
        setIsLoading(false);
        setIsSyncing(false);
      }
    },
    [backend],
  );

  // Run on first mount once backend is ready
  // biome-ignore lint/correctness/useExhaustiveDependencies: only run once when backend becomes available
  useEffect(() => {
    if (backend && !syncRunRef.current) {
      runSync();
    }
  }, [backend]);

  const refreshData = useCallback(() => {
    syncRunRef.current = false;
    runSync(true);
  }, [runSync]);

  const clearCache = useCallback(() => {
    clearAllCache();
    setSyncedTests([]);
  }, []);

  return { syncedTests, isLoading, isSyncing, error, refreshData, clearCache };
}
