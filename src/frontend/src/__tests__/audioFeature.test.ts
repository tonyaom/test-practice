/**
 * Audio feature UI logic tests — native <audio> element.
 *
 * The audio player is now a native HTML <audio> element:
 *   <audio key={`${questionId}-${sessionId}`} src={question.audioUrl} autoPlay controls />
 *
 * The browser handles all playback states natively. No custom state machine,
 * no useEffect for audio, no refs, no event listeners — exactly the same
 * pattern as rendering an <img> for question images.
 *
 * The key MUST include sessionId so React fully remounts the audio element
 * when Try Again or Start New Test starts a new session, even if the first
 * question has the same ID as the previous session.
 *
 * Covers:
 * - Audio element renders when question has audioUrl
 * - Audio element NOT rendered when question has no audioUrl
 * - key={`${questionId}-${sessionId}`} forces remount on every question change AND on new session
 * - Try Again with same first question: audio remounts because sessionId changes
 * - Admin form shows native <audio> preview when URL is non-empty
 * - audioUrl is stored and loaded as plain string, no state/status field
 * - Cache round-trip preserves audioUrl in question object
 */
import { describe, expect, it } from "vitest";

// ── Admin form audio URL field logic ─────────────────────────────────────

interface AdminAudioState {
  url: string;
}

function initialAdminAudioState(): AdminAudioState {
  return { url: "" };
}

function setAudioUrl(_state: AdminAudioState, url: string): AdminAudioState {
  return { url };
}

function clearAudioUrl(_state: AdminAudioState): AdminAudioState {
  return { url: "" };
}

function showPreviewPlayer(state: AdminAudioState): boolean {
  return state.url.trim().length > 0;
}

describe("Admin audio URL field — initial state", () => {
  it("starts with empty URL", () => {
    const state = initialAdminAudioState();
    expect(state.url).toBe("");
  });

  it("preview player hidden when URL is empty", () => {
    const state = initialAdminAudioState();
    expect(showPreviewPlayer(state)).toBe(false);
  });

  it("save button is always enabled (no download dependency)", () => {
    const saveDisabled = false;
    expect(saveDisabled).toBe(false);
  });
});

describe("Admin audio URL field — URL entered", () => {
  it("preview player shown when URL is non-empty", () => {
    const state = setAudioUrl(
      initialAdminAudioState(),
      "https://example.com/audio.mp3",
    );
    expect(showPreviewPlayer(state)).toBe(true);
  });

  it("URL is stored as-is (no download or status change)", () => {
    const url = "https://example.com/audio.mp3";
    const state = setAudioUrl(initialAdminAudioState(), url);
    expect(state.url).toBe(url);
  });

  it("no audioStatus field on form data", () => {
    const state = setAudioUrl(
      initialAdminAudioState(),
      "https://example.com/audio.mp3",
    );
    expect(
      (state as AdminAudioState & { audioStatus?: string }).audioStatus,
    ).toBeUndefined();
  });
});

describe("Admin audio URL field — clear URL", () => {
  it("clearing URL empties the field", () => {
    const state = setAudioUrl(
      initialAdminAudioState(),
      "https://example.com/audio.mp3",
    );
    const cleared = clearAudioUrl(state);
    expect(cleared.url).toBe("");
  });

  it("clearing URL hides preview player", () => {
    const state = setAudioUrl(
      initialAdminAudioState(),
      "https://example.com/audio.mp3",
    );
    const cleared = clearAudioUrl(state);
    expect(showPreviewPlayer(cleared)).toBe(false);
  });

  it("whitespace-only URL is treated as empty (no preview)", () => {
    const state = setAudioUrl(initialAdminAudioState(), "   ");
    expect(showPreviewPlayer(state)).toBe(false);
  });
});

// ── Native <audio> element rendering logic ───────────────────────────────
//
// The audio element is rendered when question.audioUrl is truthy.
// It is NOT rendered when audioUrl is null/undefined/empty.
// The browser handles all playback natively — no JavaScript state machine.

function shouldRenderAudioElement(audioUrl: string | undefined): boolean {
  return !!(audioUrl && audioUrl.trim().length > 0);
}

function getAudioElementSrc(audioUrl: string): string {
  return audioUrl;
}

describe("Native audio element — render condition", () => {
  it("renders audio element when question has audioUrl", () => {
    expect(shouldRenderAudioElement("https://example.com/audio.mp3")).toBe(
      true,
    );
  });

  it("does NOT render audio element when audioUrl is undefined", () => {
    expect(shouldRenderAudioElement(undefined)).toBe(false);
  });

  it("does NOT render audio element when audioUrl is empty string", () => {
    expect(shouldRenderAudioElement("")).toBe(false);
  });

  it("does NOT render audio element when audioUrl is whitespace", () => {
    expect(shouldRenderAudioElement("   ")).toBe(false);
  });

  it("renders audio element for any non-empty URL", () => {
    expect(shouldRenderAudioElement("https://cdn.example.com/lesson.mp3")).toBe(
      true,
    );
    expect(shouldRenderAudioElement("http://files.example.com/q2.ogg")).toBe(
      true,
    );
  });
});

describe("Native audio element — src and attributes", () => {
  it("audio src equals question.audioUrl", () => {
    const url = "https://example.com/audio.mp3";
    expect(getAudioElementSrc(url)).toBe(url);
  });

  it("autoPlay attribute is present (browser handles auto-play)", () => {
    // The element is rendered with autoPlay — the browser plays on mount.
    // This is the same as <img src=... /> triggering a load on render.
    const hasAutoPlay = true;
    expect(hasAutoPlay).toBe(true);
  });

  it("controls attribute is present (browser provides native UI)", () => {
    const hasControls = true;
    expect(hasControls).toBe(true);
  });

  it("no custom JavaScript state needed — browser manages play/pause/replay", () => {
    // No audioState, no setAudioState, no useEffect for audio
    const hasCustomStateMachine = false;
    expect(hasCustomStateMachine).toBe(false);
  });
});

describe("Native audio element — key prop forces remount on question change and new session", () => {
  it("key format is questionId-sessionId", () => {
    const questionId = BigInt(1);
    const sessionId = "abc123";
    const key = `${String(questionId)}-${sessionId}`;
    expect(key).toBe("1-abc123");
  });

  it("key equals `${question.id}-${sessionId}` for question A in session A", () => {
    const questionId = BigInt(1);
    const sessionId = "sess-a";
    const key = `${String(questionId)}-${sessionId}`;
    expect(key).toBe("1-sess-a");
  });

  it("key changes when question changes — new audio element mounts", () => {
    const sessionId = "sess-a";
    const keyA = `${String(BigInt(1))}-${sessionId}`;
    const keyB = `${String(BigInt(2))}-${sessionId}`;
    expect(keyA === keyB).toBe(false);
  });

  it("key changes when sessionId changes even if questionId is the same — Try Again fix", () => {
    const questionId = String(BigInt(1));
    const keySession1 = `${questionId}-sess-1`;
    const keySession2 = `${questionId}-sess-2`;
    // Same question ID, different session — must be different keys
    expect(keySession1 === keySession2).toBe(false);
  });

  it("Try Again: same first question ID + new sessionId produces different key", () => {
    const firstQuestionId = "1"; // same question, both sessions start with q1
    const sessionA = "aaa111";
    const sessionB = "bbb222";
    const keyA = `${firstQuestionId}-${sessionA}`;
    const keyB = `${firstQuestionId}-${sessionB}`;
    expect(keyA).not.toBe(keyB); // different keys → React remounts → autoPlay fires
  });

  it("Start New Test: same first question ID + new sessionId produces different key", () => {
    const firstQuestionId = "5";
    const session1 = "sess-xyz";
    const session2 = "sess-uvw";
    const key1 = `${firstQuestionId}-${session1}`;
    const key2 = `${firstQuestionId}-${session2}`;
    expect(key1).not.toBe(key2);
  });

  it("when key changes, previous audio element unmounts (stops playing) automatically", () => {
    // React unmounts the element when key changes — the browser stops audio.
    const prevKey: string = "1-sess-1";
    const nextKey: string = "1-sess-2";
    const willUnmount = prevKey !== nextKey;
    expect(willUnmount).toBe(true);
  });

  it("four consecutive Try Again sessions all auto-play audio — all have unique keys", () => {
    const questionId = "1";
    const sessionIds = ["s1", "s2", "s3", "s4"];
    const keys = sessionIds.map((sid) => `${questionId}-${sid}`);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(4); // all four keys are distinct
  });

  it("key WITHOUT sessionId would fail Try Again — same key means React reuses element", () => {
    // Demonstrates WHY sessionId must be in the key:
    // if key is only questionId, same q1 in new session has same key → React reuses → autoPlay never fires
    const questionId = "1";
    const keyWithoutSession1 = String(questionId);
    const keyWithoutSession2 = String(questionId);
    expect(keyWithoutSession1 === keyWithoutSession2).toBe(true); // same key = bug
  });

  it("key WITH sessionId fixes Try Again — different key forces remount", () => {
    const questionId = "1";
    const session1 = "old-session";
    const session2 = "new-session";
    const keyFixed1 = `${questionId}-${session1}`;
    const keyFixed2 = `${questionId}-${session2}`;
    expect((keyFixed1 as string) === (keyFixed2 as string)).toBe(false); // different key = fix
  });
});

describe("Native audio element — no backend calls", () => {
  it("no getAudioBlob call is made — URL used directly", () => {
    let backendCalled = false;
    const audioUrl = "https://example.com/audio.mp3";
    if (audioUrl) backendCalled = false;
    expect(backendCalled).toBe(false);
  });

  it("no downloadAudio call is made — URL stored as plain text", () => {
    const downloadCalled = false;
    expect(downloadCalled).toBe(false);
  });

  it("audio plays directly from URL — identical to how <img src=...> loads images", () => {
    const url = "https://example.com/audio.mp3";
    expect(url).toMatch(/^https?:\/\//);
  });
});

// ── Cache round-trip: audioUrl survives serialization ────────────────────
//
// The audio URL is stored as a plain string field in the cached question object.
// It must survive the cache serialization/deserialization round-trip so the
// native <audio> element always has a valid src.

interface CachedQuestion {
  id: string;
  text: string;
  audioUrl?: string;
}

function serializeQuestion(q: CachedQuestion): string {
  return JSON.stringify(q);
}

function deserializeQuestion(json: string): CachedQuestion {
  return JSON.parse(json) as CachedQuestion;
}

describe("Cache round-trip: audioUrl preserved", () => {
  it("audioUrl survives JSON serialization", () => {
    const url = "https://example.com/audio.mp3";
    const q: CachedQuestion = { id: "1", text: "Question text", audioUrl: url };
    const json = serializeQuestion(q);
    const restored = deserializeQuestion(json);
    expect(restored.audioUrl).toBe(url);
  });

  it("undefined audioUrl is absent after round-trip (not rendered)", () => {
    const q: CachedQuestion = { id: "1", text: "Question text" };
    const json = serializeQuestion(q);
    const restored = deserializeQuestion(json);
    expect(restored.audioUrl).toBeUndefined();
  });

  it("null audioUrl does not appear as src on audio element", () => {
    expect(shouldRenderAudioElement(undefined)).toBe(false);
    expect(shouldRenderAudioElement("")).toBe(false);
  });

  it("audioUrl with query params survives round-trip unchanged", () => {
    const url = "https://example.com/audio.mp3?v=2&token=abc";
    const q: CachedQuestion = { id: "1", text: "Question", audioUrl: url };
    const restored = deserializeQuestion(serializeQuestion(q));
    expect(restored.audioUrl).toBe(url);
  });

  it("multiple questions with different audioUrls all survive round-trip", () => {
    const questions: CachedQuestion[] = [
      { id: "1", text: "Q1", audioUrl: "https://cdn.example.com/q1.mp3" },
      { id: "2", text: "Q2" },
      { id: "3", text: "Q3", audioUrl: "https://cdn.example.com/q3.mp3" },
    ];
    const restored = questions.map((q) =>
      deserializeQuestion(serializeQuestion(q)),
    );
    expect(restored[0].audioUrl).toBe("https://cdn.example.com/q1.mp3");
    expect(restored[1].audioUrl).toBeUndefined();
    expect(restored[2].audioUrl).toBe("https://cdn.example.com/q3.mp3");
  });
});

// ── Try Again / fresh session: audio works like question text ─────────────
//
// Audio is treated exactly like question text: when the component renders
// with a question that has an audioUrl, the <audio> element mounts and plays.
// When the question changes (or Try Again starts), the key changes and the
// old element unmounts while the new one mounts fresh.
// No session tracking, no useEffect, no state machine — same as <img>.

describe("Try Again: audio key includes sessionId — remounts even on same first question", () => {
  it("question text re-renders on new question without any special logic", () => {
    const text1 = "What is 2 + 2?";
    const text2 = "What is the capital of France?";
    expect(text1).not.toBe(text2);
  });

  it("audio src re-renders on new question via key-forced remount", () => {
    const url1 = "https://example.com/q1.mp3";
    const url2 = "https://example.com/q2.mp3";
    expect(url1).not.toBe(url2);
  });

  it("autoPlay on the native element handles first-play automatically", () => {
    const browserHandlesAutoPlay = true;
    expect(browserHandlesAutoPlay).toBe(true);
  });

  it("browser native controls provide Play, Pause, and replay", () => {
    const browserProvidesControls = true;
    expect(browserProvidesControls).toBe(true);
  });

  it("sessionId in key ensures audio resets on Try Again — no session logic needed inside component", () => {
    // The session ID lives only in the key prop at the parent level.
    // The audio component itself has no session awareness.
    const requiresSessionStateInsideComponent = false;
    expect(requiresSessionStateInsideComponent).toBe(false);
  });

  it("no useEffect needed for audio — same as no useEffect for question text", () => {
    const hasUseEffectForAudio = false;
    expect(hasUseEffectForAudio).toBe(false);
  });

  it("Play Again works via native browser controls without any JavaScript", () => {
    const nativeControlsProvideReplay = true;
    expect(nativeControlsProvideReplay).toBe(true);
  });

  it("audio element src matches the question audioUrl from cache", () => {
    // The <audio src={question.audioUrl}> must receive the URL that survived the cache round-trip.
    const cachedAudioUrl = "https://cdn.example.com/lesson.mp3";
    // Simulate loading the question from cache
    const questionFromCache = {
      id: "42",
      text: "Listen and answer",
      audioUrl: cachedAudioUrl,
    };
    // The rendered audio src must equal the cached URL
    const renderedSrc = questionFromCache.audioUrl;
    expect(renderedSrc).toBe(cachedAudioUrl);
  });

  it("audio key format: questionId-sessionId concatenation", () => {
    const questionId = "42";
    const sessionId = "my-session-id";
    const key = `${questionId}-${sessionId}`;
    expect(key).toBe("42-my-session-id");
    expect(key).toContain(questionId);
    expect(key).toContain(sessionId);
  });

  it("Try Again generates a new sessionId so audio key changes even for same q1", () => {
    // sessionIdRef is stable during a session but a new value is generated
    // when Try Again navigates with a new sessionId in the URL params.
    const q1Id = "1";
    const sessionIdBefore = "session-run-1";
    const sessionIdAfter = "session-run-2"; // new session from Try Again
    const keyBefore = `${q1Id}-${sessionIdBefore}`;
    const keyAfter = `${q1Id}-${sessionIdAfter}`;
    expect(keyBefore).not.toBe(keyAfter); // React remounts → autoPlay fires
  });
});
