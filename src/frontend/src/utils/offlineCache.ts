/**
 * Offline-first cache for test data (questions + sections).
 *
 * Keys used in localStorage:
 *   prepstream_test_cache_{testId}  — full test+questions+sections bundle
 *   prepstream_cache_meta           — map of testId -> updatedAt for fast invalidation
 *   prepstream_data_manifest        — global version manifest for one-call version check
 */

export interface TestCacheEntry {
  test: CachedTest;
  questions: CachedQuestion[];
  sections: CachedSection[];
  /** Unix ms timestamp string (from backend bigint updatedAt / 1_000_000) */
  updatedAt: string;
  savedAt: number;
}

export interface CachedTest {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
}

export interface CachedQuestion {
  id: string;
  testId: string;
  orderIndex: string;
  text: string;
  questionType: string;
  options: string[];
  correctAnswers: string[];
  correctText: string;
  correctOrder: string[];
  sectionId?: string;
  questionUpdatedAt: string;
  explanation?: string | null;
  /** Cached audio URL — if set, audio blob is also cached under audio key */
  audioUrl?: string | null;
  isMastered?: boolean;
  correctStreak?: string;
}

export interface CachedSection {
  id: string;
  testId: string;
  name: string;
  description: string;
  updatedAt: string;
}

/** Stored manifest shape in localStorage */
export interface DataManifestCache {
  checksum: string;
  globalUpdatedAt: string;
  testCount: number;
  questionCount: number;
  sectionCount: number;
  savedAt: number;
}

type CacheMeta = Record<string, string>;

const CACHE_KEY = (testId: string | number) =>
  `prepstream_test_cache_${testId}`;
const META_KEY = "prepstream_cache_meta";
const MANIFEST_KEY = "prepstream_data_manifest";

function loadMeta(): CacheMeta {
  try {
    const raw = localStorage.getItem(META_KEY);
    return raw ? (JSON.parse(raw) as CacheMeta) : {};
  } catch {
    return {};
  }
}

function saveMeta(meta: CacheMeta): void {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  } catch {
    // localStorage may be full — silently ignore
  }
}

/** Retrieve cached data for a test. Returns null on cache miss. */
export function getTestCache(testId: string | number): TestCacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY(testId));
    if (!raw) return null;
    return JSON.parse(raw) as TestCacheEntry;
  } catch {
    return null;
  }
}

/**
 * Save test data to the cache.
 * @param testId    numeric or string test ID
 * @param data      the bundle to store
 * @param updatedAt serialisable string representation of the server updatedAt
 */
export function saveTestCache(
  testId: string | number,
  data: Omit<TestCacheEntry, "savedAt">,
  updatedAt: string,
): void {
  try {
    const entry: TestCacheEntry = { ...data, updatedAt, savedAt: Date.now() };
    localStorage.setItem(CACHE_KEY(testId), JSON.stringify(entry));
    const meta = loadMeta();
    meta[String(testId)] = updatedAt;
    saveMeta(meta);
  } catch {
    // Storage full — silently ignore
  }
}

/** Remove the cached data for a single test. */
export function clearTestCache(testId: string | number): void {
  try {
    localStorage.removeItem(CACHE_KEY(testId));
    const meta = loadMeta();
    delete meta[String(testId)];
    saveMeta(meta);
  } catch {
    // ignore
  }
}

/** Key for storing a cached audio blob (as base64) per question */
const AUDIO_CACHE_KEY = (questionId: string | number) =>
  `prepstream_audio_${questionId}`;

/** Store audio bytes for a question in localStorage (base64 encoded). */
export function saveAudioCache(
  questionId: string | number,
  bytes: Uint8Array,
): void {
  try {
    // Convert Uint8Array to base64 string for storage
    let binary = "";
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    localStorage.setItem(AUDIO_CACHE_KEY(questionId), base64);
  } catch {
    // Storage full — silently ignore
  }
}

/** Retrieve cached audio bytes for a question. Returns null on cache miss. */
export function getAudioCache(questionId: string | number): Uint8Array | null {
  try {
    const base64 = localStorage.getItem(AUDIO_CACHE_KEY(questionId));
    if (!base64) return null;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

/** Remove cached audio for a single question. */
export function clearAudioCache(questionId: string | number): void {
  try {
    localStorage.removeItem(AUDIO_CACHE_KEY(questionId));
  } catch {
    // ignore
  }
}

/** Remove all cached test data (keeps other localStorage keys). */
export function clearAllCache(): void {
  try {
    const meta = loadMeta();
    for (const testId of Object.keys(meta)) {
      localStorage.removeItem(CACHE_KEY(testId));
    }
    localStorage.removeItem(META_KEY);
    localStorage.removeItem(MANIFEST_KEY);
    // Also clear all audio caches by scanning all keys
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith("prepstream_audio_")) keysToRemove.push(k);
    }
    for (const k of keysToRemove) localStorage.removeItem(k);
  } catch {
    // ignore
  }
}

// ── Manifest cache ──────────────────────────────────────────────────────────────

/** Retrieve the saved data manifest from localStorage. Returns null if none saved. */
export function getSavedManifest(): DataManifestCache | null {
  try {
    const raw = localStorage.getItem(MANIFEST_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DataManifestCache;
  } catch {
    return null;
  }
}

/** Save a data manifest to localStorage. */
export function saveManifest(
  manifest: Omit<DataManifestCache, "savedAt">,
): void {
  try {
    const entry: DataManifestCache = { ...manifest, savedAt: Date.now() };
    localStorage.setItem(MANIFEST_KEY, JSON.stringify(entry));
  } catch {
    // Storage full — silently ignore
  }
}

/**
 * Returns true if the local manifest is stale (different checksum or no manifest saved).
 * Returns false if the saved manifest matches the server checksum — data is current.
 */
export function isManifestStale(serverChecksum: string): boolean {
  const saved = getSavedManifest();
  if (!saved) return true;
  return saved.checksum !== serverChecksum;
}

/**
 * Returns the cache meta map (testId -> updatedAt string).
 * Useful for iterating over all cached tests.
 */
export function getCacheMeta(): CacheMeta {
  return loadMeta();
}

/**
 * Compare cached updatedAt against the server value.
 * Returns true if the cache is still valid (server hasn't changed).
 * Both values are ns-bigint strings from the backend; we compare as strings.
 */
export function isCacheValid(
  cachedUpdatedAt: string,
  serverUpdatedAt: string,
): boolean {
  return cachedUpdatedAt === serverUpdatedAt;
}
