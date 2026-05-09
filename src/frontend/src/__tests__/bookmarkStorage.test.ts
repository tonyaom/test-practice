import { beforeEach, describe, expect, it } from "vitest";
import {
  clearBookmarksForTest,
  getBookmarksForTest,
  isBookmarked,
  toggleBookmark,
} from "../utils/bookmarkStorage";

const USER = "alice";
const OTHER_USER = "bob";
const TEST_ID = "test-1";
const OTHER_TEST = "test-2";

beforeEach(() => {
  localStorage.clear();
});

describe("bookmarkStorage", () => {
  describe("isBookmarked", () => {
    it("returns false when no bookmark exists", () => {
      expect(isBookmarked(USER, TEST_ID, 1)).toBe(false);
    });

    it("returns true after bookmarking a question", () => {
      toggleBookmark(USER, TEST_ID, 5);
      expect(isBookmarked(USER, TEST_ID, 5)).toBe(true);
    });

    it("returns false after removing a bookmark", () => {
      toggleBookmark(USER, TEST_ID, 5);
      toggleBookmark(USER, TEST_ID, 5);
      expect(isBookmarked(USER, TEST_ID, 5)).toBe(false);
    });
  });

  describe("toggleBookmark", () => {
    it("returns true (bookmarked) when toggling an un-bookmarked question", () => {
      expect(toggleBookmark(USER, TEST_ID, 10)).toBe(true);
    });

    it("returns false (removed) when toggling an already-bookmarked question", () => {
      toggleBookmark(USER, TEST_ID, 10);
      expect(toggleBookmark(USER, TEST_ID, 10)).toBe(false);
    });

    it("can bookmark multiple questions independently", () => {
      toggleBookmark(USER, TEST_ID, 1);
      toggleBookmark(USER, TEST_ID, 3);
      toggleBookmark(USER, TEST_ID, 7);
      expect(isBookmarked(USER, TEST_ID, 1)).toBe(true);
      expect(isBookmarked(USER, TEST_ID, 3)).toBe(true);
      expect(isBookmarked(USER, TEST_ID, 7)).toBe(true);
      expect(isBookmarked(USER, TEST_ID, 2)).toBe(false);
    });

    it("does not affect a different user's bookmarks", () => {
      toggleBookmark(USER, TEST_ID, 5);
      expect(isBookmarked(OTHER_USER, TEST_ID, 5)).toBe(false);
    });

    it("does not affect a different test's bookmarks", () => {
      toggleBookmark(USER, TEST_ID, 5);
      expect(isBookmarked(USER, OTHER_TEST, 5)).toBe(false);
    });
  });

  describe("getBookmarksForTest", () => {
    it("returns an empty array when no bookmarks exist", () => {
      expect(getBookmarksForTest(USER, TEST_ID)).toEqual([]);
    });

    it("returns all bookmarked question IDs sorted ascending", () => {
      toggleBookmark(USER, TEST_ID, 7);
      toggleBookmark(USER, TEST_ID, 2);
      toggleBookmark(USER, TEST_ID, 5);
      expect(getBookmarksForTest(USER, TEST_ID)).toEqual(["2", "5", "7"]);
    });

    it("reflects removals correctly", () => {
      toggleBookmark(USER, TEST_ID, 1);
      toggleBookmark(USER, TEST_ID, 2);
      toggleBookmark(USER, TEST_ID, 3);
      toggleBookmark(USER, TEST_ID, 2); // remove 2
      expect(getBookmarksForTest(USER, TEST_ID)).toEqual(["1", "3"]);
    });

    it("is isolated per user", () => {
      toggleBookmark(USER, TEST_ID, 9);
      expect(getBookmarksForTest(OTHER_USER, TEST_ID)).toEqual([]);
    });

    it("is isolated per test", () => {
      toggleBookmark(USER, TEST_ID, 9);
      expect(getBookmarksForTest(USER, OTHER_TEST)).toEqual([]);
    });
  });

  describe("clearBookmarksForTest", () => {
    it("removes all bookmarks for a user + test", () => {
      toggleBookmark(USER, TEST_ID, 1);
      toggleBookmark(USER, TEST_ID, 2);
      clearBookmarksForTest(USER, TEST_ID);
      expect(getBookmarksForTest(USER, TEST_ID)).toEqual([]);
    });

    it("does not affect bookmarks for a different test", () => {
      toggleBookmark(USER, TEST_ID, 1);
      toggleBookmark(USER, OTHER_TEST, 2);
      clearBookmarksForTest(USER, TEST_ID);
      expect(getBookmarksForTest(USER, OTHER_TEST)).toEqual(["2"]);
    });

    it("does not affect bookmarks for a different user", () => {
      toggleBookmark(USER, TEST_ID, 1);
      toggleBookmark(OTHER_USER, TEST_ID, 1);
      clearBookmarksForTest(USER, TEST_ID);
      expect(getBookmarksForTest(OTHER_USER, TEST_ID)).toEqual(["1"]);
    });

    it("is safe to call when no bookmarks exist", () => {
      expect(() => clearBookmarksForTest(USER, TEST_ID)).not.toThrow();
    });
  });
});
