/**
 * DataSyncContext — provides synced test/question/section data to all pages.
 *
 * Initialised once at app startup (wrapped around the router in App.tsx).
 * All pages consume this context instead of calling listTests(), getTest(),
 * listQuestionsForTest(), or listSectionsForTest() directly.
 *
 * After a mutation (create/update/delete test, question, or section),
 * call refreshData() to trigger a 2-call re-sync cycle:
 *   1. getDataManifest() — detects the change
 *   2. getAllTestData()   — fetches fresh data
 */
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useDataSync } from "../hooks/useDataSync";
import type { Question, Section, Test } from "../services/backendService";
import type {
  CachedQuestion,
  CachedSection,
  CachedTest,
} from "../utils/offlineCache";

// ── Context value type ───────────────────────────────────────────────────────────────

export interface DataSyncContextValue {
  /** All tests available in cache (deserialized to Test-like shape). */
  tests: CachedTest[];
  /** true until the first sync cycle completes (may briefly be true on cold start) */
  isLoading: boolean;
  /** true while a manifest or bulk-fetch request is in flight */
  isSyncing: boolean;
  /** Non-null if a sync error occurred AND there was no cached data to fall back to */
  error: string | null;
  /** Look up a single test by string or number ID */
  getTest: (id: string | number) => CachedTest | undefined;
  /** Look up questions for a test by string or number ID */
  getQuestions: (testId: string | number) => CachedQuestion[];
  /** Look up sections for a test by string or number ID */
  getSections: (testId: string | number) => CachedSection[];
  /**
   * Trigger a full re-sync after a mutation.
   * Internally: getDataManifest() then (if stale) getAllTestData().
   */
  refreshData: () => void;
  /** Clear all local cache (both test bundles and the manifest). */
  clearCache: () => void;
}

const DataSyncContext = createContext<DataSyncContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────────────────

export function DataSyncProvider({ children }: { children: ReactNode }) {
  const { syncedTests, isLoading, isSyncing, error, refreshData, clearCache } =
    useDataSync();

  // Build an index map for O(1) lookups
  const indexedByTestId = useMemo(() => {
    const map = new Map(syncedTests.map((st) => [st.test.id, st]));
    return map;
  }, [syncedTests]);

  const tests: CachedTest[] = useMemo(
    () => syncedTests.map((st) => st.test),
    [syncedTests],
  );

  const getTest = useCallback(
    (id: string | number) => indexedByTestId.get(String(id))?.test,
    [indexedByTestId],
  );

  const getQuestions = useCallback(
    (testId: string | number) =>
      indexedByTestId.get(String(testId))?.questions ?? [],
    [indexedByTestId],
  );

  const getSections = useCallback(
    (testId: string | number) =>
      indexedByTestId.get(String(testId))?.sections ?? [],
    [indexedByTestId],
  );

  const value: DataSyncContextValue = useMemo(
    () => ({
      tests,
      isLoading,
      isSyncing,
      error,
      getTest,
      getQuestions,
      getSections,
      refreshData,
      clearCache,
    }),
    [
      tests,
      isLoading,
      isSyncing,
      error,
      getTest,
      getQuestions,
      getSections,
      refreshData,
      clearCache,
    ],
  );

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  );
}

// ── Consumer hook ───────────────────────────────────────────────────────────────────

export function useDataSyncContext(): DataSyncContextValue {
  const ctx = useContext(DataSyncContext);
  if (!ctx) {
    throw new Error("useDataSyncContext must be used within DataSyncProvider");
  }
  return ctx;
}

// ── Re-export cache types for consumer convenience ──────────────────────────────────

export type { CachedQuestion, CachedSection, CachedTest };
// Re-export full types for pages that still need backend-shaped data
export type { Question, Section, Test };
