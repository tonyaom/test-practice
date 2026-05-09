function bookmarkKey(username, testId) {
  return `bookmarks:${username}:${testId}`;
}
function loadBookmarkSet(username, testId) {
  try {
    const raw = localStorage.getItem(bookmarkKey(username, testId));
    if (!raw) return /* @__PURE__ */ new Set();
    const arr = JSON.parse(raw);
    return new Set(arr.map(String));
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function saveBookmarkSet(username, testId, set) {
  try {
    localStorage.setItem(
      bookmarkKey(username, testId),
      JSON.stringify([...set])
    );
  } catch {
  }
}
function toggleBookmark(username, testId, questionId) {
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
function getBookmarks(username, testId) {
  return loadBookmarkSet(username, testId);
}
export {
  getBookmarks as g,
  toggleBookmark as t
};
