/**
 * Bookmark storage — tracks bookmarked questions per user + test.
 *
 * Key pattern: bookmarks:{username}:{testId}
 * Value: JSON array of bookmarked questionIds stored as strings
 */

function bookmarkKey(username: string, testId: string | number): string {
  return `bookmarks:${username}:${testId}`;
}

function loadBookmarkSet(
  username: string,
  testId: string | number,
): Set<string> {
  try {
    const raw = localStorage.getItem(bookmarkKey(username, testId));
    if (!raw) return new Set();
    // Support both legacy number[] and current string[] storage
    const arr = JSON.parse(raw) as Array<string | number>;
    return new Set(arr.map(String));
  } catch {
    return new Set();
  }
}

function saveBookmarkSet(
  username: string,
  testId: string | number,
  set: Set<string>,
): void {
  try {
    localStorage.setItem(
      bookmarkKey(username, testId),
      JSON.stringify([...set]),
    );
  } catch {
    // localStorage may be full — silently ignore
  }
}

/**
 * Returns true if the given questionId is bookmarked for this user + test.
 * Accepts string or number — both are compared as strings.
 */
export function isBookmarked(
  username: string,
  testId: string | number,
  questionId: string | number,
): boolean {
  return loadBookmarkSet(username, testId).has(String(questionId));
}

/**
 * Toggle the bookmark state for a question.
 * Returns the new bookmark state (true = bookmarked, false = removed).
 * Accepts string or number questionId.
 */
export function toggleBookmark(
  username: string,
  testId: string | number,
  questionId: string | number,
): boolean {
  const set = loadBookmarkSet(username, testId);
  const key = String(questionId);
  if (set.has(key)) {
    set.delete(key);
    saveBookmarkSet(username, testId, set);
    return false;
  }
  set.add(key);
  saveBookmarkSet(username, testId, set);
  return true;
}

/**
 * Return all bookmarked questionIds for a user + test as strings, sorted ascending.
 */
export function getBookmarksForTest(
  username: string,
  testId: string | number,
): string[] {
  return [...loadBookmarkSet(username, testId)].sort();
}

/**
 * Remove all bookmarks for a user + test.
 */
export function clearBookmarksForTest(
  username: string,
  testId: string | number,
): void {
  try {
    localStorage.removeItem(bookmarkKey(username, testId));
  } catch {
    // ignore
  }
}

/**
 * Returns all bookmarked questionIds as a Set<string>.
 * Primary accessor used by pages that track questionId as a string.
 */
export function getBookmarks(
  username: string,
  testId: string | number,
): Set<string> {
  return loadBookmarkSet(username, testId);
}
