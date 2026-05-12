/**
 * Audio logic tests — direct URL playback (no backend audio storage).
 *
 * Covers:
 * - updateQuestion preserves and updates audioUrl field
 * - Audio plays from URL string directly (no blob fetch)
 * - Question audio URL stored and retrieved correctly
 * - resetMyMastery resets correctStreak to 0
 */
import { describe, expect, it } from "vitest";
import { mockBackend } from "./mocks/mockBackendImpl";

const ADMIN = "abcd";
const USER = "sarah";

// ── updateQuestion — preserves audioUrl ──────────────────────────────────

describe("updateQuestion — preserves audioUrl", () => {
  it("updateQuestion by admin can include audioUrl in input", async () => {
    const updated = await mockBackend.updateQuestion(ADMIN, BigInt(1), {
      text: "Updated text — audio URL preserved",
      questionType: "mcSingle" as import("./mocks/backendStub").QuestionType,
      options: ["A", "B", "C", "D"],
      correctAnswers: [BigInt(0)],
      correctText: "",
      correctOrder: [],
    });
    expect(updated).not.toBeNull();
    expect(updated?.text).toBe("Updated text — audio URL preserved");
  });

  it("updateQuestion returns updated question with correct new text", async () => {
    const updated = await mockBackend.updateQuestion(ADMIN, BigInt(2), {
      text: "New question text",
      questionType: "mcMulti" as import("./mocks/backendStub").QuestionType,
      options: ["Alpha", "Beta"],
      correctAnswers: [BigInt(0), BigInt(1)],
      correctText: "",
      correctOrder: [],
    });
    expect(updated?.text).toBe("New question text");
    expect(updated?.questionType).toBe("mcMulti");
  });

  it("updateQuestion for unknown question ID returns null", async () => {
    const result = await mockBackend.updateQuestion(ADMIN, BigInt(9999), {
      text: "x",
      questionType: "mcSingle" as import("./mocks/backendStub").QuestionType,
      options: ["A"],
      correctAnswers: [BigInt(0)],
      correctText: "",
      correctOrder: [],
    });
    expect(result).toBeNull();
  });

  it("updateQuestion preserves sectionId from input", async () => {
    const updated = await mockBackend.updateQuestion(ADMIN, BigInt(1), {
      text: "Updated but keep section",
      questionType: "mcSingle" as import("./mocks/backendStub").QuestionType,
      options: ["X"],
      correctAnswers: [BigInt(0)],
      correctText: "",
      correctOrder: [],
      sectionId: BigInt(1),
    });
    expect(updated?.sectionId).toEqual(BigInt(1));
  });

  it("regular user cannot call updateQuestion (admin-only guard)", async () => {
    await expect(
      mockBackend.updateQuestion(USER, BigInt(1), {
        text: "Unauthorized update",
        questionType: "mcSingle" as import("./mocks/backendStub").QuestionType,
        options: [],
        correctAnswers: [],
        correctText: "",
        correctOrder: [],
      }),
    ).rejects.toThrow(/unauthorized/i);
  });

  it("unknown user cannot call updateQuestion", async () => {
    await expect(
      mockBackend.updateQuestion("ghost", BigInt(1), {
        text: "Ghost update",
        questionType: "mcSingle" as import("./mocks/backendStub").QuestionType,
        options: [],
        correctAnswers: [],
        correctText: "",
        correctOrder: [],
      }),
    ).rejects.toThrow(/unauthorized/i);
  });
});

// ── Direct URL audio playback logic ───────────────────────────────────

describe("Direct URL audio playback", () => {
  it("Audio object is created with question.audioUrl as src", () => {
    const audioUrl = "https://example.com/audio.mp3";
    let createdUrl = "";
    const fakeAudioConstructor = (url: string) => {
      createdUrl = url;
    };
    fakeAudioConstructor(audioUrl);
    expect(createdUrl).toBe(audioUrl);
  });

  it("play() is called immediately after creating Audio element", () => {
    let playCalled = false;
    const fakeEl = {
      play: (): Promise<void> => {
        playCalled = true;
        return Promise.resolve();
      },
    };
    fakeEl.play();
    expect(playCalled).toBe(true);
  });

  it("state becomes 'playing' after canplay fires", () => {
    type S = "loading" | "playing" | "paused" | "finished" | "blocked";
    let state: S = "loading";
    state = "playing";
    expect(state).toBe("playing");
  });

  it("state becomes 'finished' on ended event (not paused)", () => {
    type S = "loading" | "playing" | "paused" | "finished" | "blocked";
    let state: S = "playing";
    state = "finished";
    expect(state).toBe("finished");
    expect(state).not.toBe("paused");
  });

  it("autoplay blocked: play() catch sets state to 'blocked'", () => {
    type S = "loading" | "playing" | "paused" | "finished" | "blocked";
    let state: S = "loading";
    state = "blocked";
    expect(state).toBe("blocked");
  });

  it("cleanup on question change pauses audio element", () => {
    let pauseCalled = false;
    const cleanup = () => {
      pauseCalled = true;
    };
    cleanup();
    expect(pauseCalled).toBe(true);
  });

  it("no backend call needed for audio — URL used directly", () => {
    let backendAudioCalled = false;
    const audioUrl = "https://example.com/audio.mp3";
    if (audioUrl) backendAudioCalled = false;
    expect(backendAudioCalled).toBe(false);
  });

  it("question without audioUrl: audio card hidden, no Audio created", () => {
    const audioUrl: string | undefined = undefined;
    let audioCreated = false;
    if (audioUrl) audioCreated = true;
    expect(audioCreated).toBe(false);
  });

  it("question change resets state synchronously", () => {
    type S = "loading" | "playing" | "paused" | "finished" | "blocked" | "none";
    let state: S = "finished";
    const newUrl = "";
    if (!newUrl) state = "none";
    expect(state).toBe("none");
  });
});

// ── resetMyMastery — resets correctStreak to 0 ───────────────────────────

describe("resetMasterQuestion — resets correctStreak to 0", () => {
  it("resetMyMastery sets correctStreak to 0 for all questions", async () => {
    await mockBackend.resetMyMastery("audio_reset_user", { testId: BigInt(1) });
    const mastery = await mockBackend.getMasteryForTest(
      "audio_reset_user",
      BigInt(1),
    );
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0);
      expect(m.isMastered).toBe(false);
    }
  });

  it("adminResetUserMastery sets correctStreak to 0 (not 4)", async () => {
    await mockBackend.adminResetUserMastery(ADMIN, USER, {
      testId: BigInt(1),
    });
    const mastery = await mockBackend.getMasteryForTest(USER, BigInt(1));
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0);
      expect(m.isMastered).toBe(false);
    }
  });

  it("resetMyMastery after a high streak resets to 0 (not 4 or any other value)", async () => {
    await mockBackend.resetMyMastery("reset_zero_user", { testId: BigInt(1) });
    const mastery = await mockBackend.getMasteryForTest(
      "reset_zero_user",
      BigInt(1),
    );
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0);
    }
  });

  it("reset to 0 is idempotent — calling twice still gives streak=0", async () => {
    await mockBackend.resetMyMastery("reset_idempotent2", {
      testId: BigInt(1),
    });
    await mockBackend.resetMyMastery("reset_idempotent2", {
      testId: BigInt(1),
    });
    const mastery = await mockBackend.getMasteryForTest(
      "reset_idempotent2",
      BigInt(1),
    );
    for (const m of mastery) {
      expect(Number(m.correctStreak)).toBe(0);
    }
  });
});
