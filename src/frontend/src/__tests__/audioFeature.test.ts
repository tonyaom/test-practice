/**
 * Audio feature UI logic tests.
 *
 * Covers:
 * - Audio URL field shows download progress state
 * - Error state shown when download fails
 * - Retry available after failure
 * - Save button disabled while downloading
 * - Audio player shown when audio is ready
 * - Audio URL cleared removes audio state
 */
import { describe, expect, it } from "vitest";

// ── Mirrors QuestionForm audio state machine ─────────────────────────────────

type AudioDownloadStatus = "idle" | "downloading" | "ready" | "error";

interface AudioState {
  url: string;
  status: AudioDownloadStatus;
  errorMsg: string;
}

function initialAudioState(): AudioState {
  return { url: "", status: "idle", errorMsg: "" };
}

function simulateDownloadStart(state: AudioState): AudioState {
  return { ...state, status: "downloading", errorMsg: "" };
}

function simulateDownloadSuccess(state: AudioState): AudioState {
  return { ...state, status: "ready", errorMsg: "" };
}

function simulateDownloadError(state: AudioState, msg: string): AudioState {
  return { ...state, status: "error", errorMsg: msg };
}

function simulateRetry(state: AudioState): AudioState {
  return { ...state, status: "downloading", errorMsg: "" };
}

function simulateClearUrl(_state: AudioState): AudioState {
  return { url: "", status: "idle", errorMsg: "" };
}

function isSaveDisabled(state: AudioState): boolean {
  return state.status === "downloading";
}

function showAudioPlayer(state: AudioState): boolean {
  return state.status === "ready";
}

function showErrorAlert(state: AudioState): boolean {
  return state.status === "error";
}

function showDownloadProgress(state: AudioState): boolean {
  return state.status === "downloading";
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("Audio URL field — initial state", () => {
  it("starts with idle status", () => {
    const state = initialAudioState();
    expect(state.status).toBe("idle");
  });

  it("starts with empty URL", () => {
    const state = initialAudioState();
    expect(state.url).toBe("");
  });

  it("save is NOT disabled when idle (no URL entered)", () => {
    const state = initialAudioState();
    expect(isSaveDisabled(state)).toBe(false);
  });
});

describe("Audio URL field — downloading state", () => {
  it("shows download progress when status=downloading", () => {
    const state = simulateDownloadStart(initialAudioState());
    expect(showDownloadProgress(state)).toBe(true);
  });

  it("save button is disabled while downloading", () => {
    const state = simulateDownloadStart(initialAudioState());
    expect(isSaveDisabled(state)).toBe(true);
  });

  it("does not show error while downloading", () => {
    const state = simulateDownloadStart(initialAudioState());
    expect(showErrorAlert(state)).toBe(false);
  });

  it("does not show audio player while downloading", () => {
    const state = simulateDownloadStart(initialAudioState());
    expect(showAudioPlayer(state)).toBe(false);
  });
});

describe("Audio URL field — success state", () => {
  it("shows audio player when download succeeds", () => {
    const state = simulateDownloadSuccess(
      simulateDownloadStart(initialAudioState()),
    );
    expect(showAudioPlayer(state)).toBe(true);
  });

  it("save button is enabled after successful download", () => {
    const state = simulateDownloadSuccess(
      simulateDownloadStart(initialAudioState()),
    );
    expect(isSaveDisabled(state)).toBe(false);
  });

  it("does not show progress after success", () => {
    const state = simulateDownloadSuccess(
      simulateDownloadStart(initialAudioState()),
    );
    expect(showDownloadProgress(state)).toBe(false);
  });

  it("does not show error after success", () => {
    const state = simulateDownloadSuccess(
      simulateDownloadStart(initialAudioState()),
    );
    expect(showErrorAlert(state)).toBe(false);
  });
});

describe("Audio URL field — error state", () => {
  it("shows error alert when download fails", () => {
    const state = simulateDownloadError(
      simulateDownloadStart(initialAudioState()),
      "HTTP 404",
    );
    expect(showErrorAlert(state)).toBe(true);
  });

  it("error message is preserved", () => {
    const state = simulateDownloadError(
      simulateDownloadStart(initialAudioState()),
      "Network error",
    );
    expect(state.errorMsg).toBe("Network error");
  });

  it("save button is NOT disabled after error (user can save without audio)", () => {
    const state = simulateDownloadError(
      simulateDownloadStart(initialAudioState()),
      "HTTP 404",
    );
    expect(isSaveDisabled(state)).toBe(false);
  });

  it("does not show audio player after error", () => {
    const state = simulateDownloadError(
      simulateDownloadStart(initialAudioState()),
      "failed",
    );
    expect(showAudioPlayer(state)).toBe(false);
  });

  it("retry resets status to downloading", () => {
    const errState = simulateDownloadError(
      simulateDownloadStart(initialAudioState()),
      "failed",
    );
    const retried = simulateRetry(errState);
    expect(retried.status).toBe("downloading");
  });

  it("retry clears error message", () => {
    const errState = simulateDownloadError(
      simulateDownloadStart(initialAudioState()),
      "failed",
    );
    const retried = simulateRetry(errState);
    expect(retried.errorMsg).toBe("");
  });
});

describe("Audio URL field — clear URL", () => {
  it("clearing URL resets state to idle", () => {
    const state = simulateDownloadSuccess(
      simulateDownloadStart({
        url: "https://example.com/audio.mp3",
        status: "idle",
        errorMsg: "",
      }),
    );
    const cleared = simulateClearUrl(state);
    expect(cleared.status).toBe("idle");
    expect(cleared.url).toBe("");
  });

  it("clearing URL hides audio player", () => {
    const state = simulateDownloadSuccess(
      simulateDownloadStart({
        url: "https://example.com/audio.mp3",
        status: "idle",
        errorMsg: "",
      }),
    );
    const cleared = simulateClearUrl(state);
    expect(showAudioPlayer(cleared)).toBe(false);
  });

  it("clearing URL hides download progress", () => {
    const cleared = simulateClearUrl(
      simulateDownloadStart(initialAudioState()),
    );
    expect(showDownloadProgress(cleared)).toBe(false);
  });
});

describe("Audio backend integration — downloadAudio and getAudioBlob", () => {
  it("downloadAudio returns #ok for a valid https URL (mock)", async () => {
    const { mockBackend } = await import("./mocks/mockBackendImpl");
    const result = await mockBackend.downloadAudio(
      "abcd",
      BigInt(1),
      "https://example.com/audio.mp3",
    );
    expect(result.__kind__).toBe("ok");
  });

  it("downloadAudio returns #err for empty URL (mock)", async () => {
    const { mockBackend } = await import("./mocks/mockBackendImpl");
    const result = await mockBackend.downloadAudio("abcd", BigInt(1), "");
    expect(result.__kind__).toBe("err");
  });

  it("getAudioBlob returns a Uint8Array for question 1 (mock)", async () => {
    const { mockBackend } = await import("./mocks/mockBackendImpl");
    const blob = await mockBackend.getAudioBlob(BigInt(1));
    expect(blob).not.toBeNull();
    expect(blob).toBeInstanceOf(Uint8Array);
  });

  it("getAudioBlob returns null for question with no audio (mock)", async () => {
    const { mockBackend } = await import("./mocks/mockBackendImpl");
    const blob = await mockBackend.getAudioBlob(BigInt(999));
    expect(blob).toBeNull();
  });
});
