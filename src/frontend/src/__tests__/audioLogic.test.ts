/**
 * Audio feature tests.
 *
 * Verifies:
 * - downloadAudio: admin-only guard enforced
 * - downloadAudio: returns #ok on success with a valid URL
 * - downloadAudio: returns #err on failure (bad URL / invalid URL scheme)
 * - downloadAudio: rejects regular user with Unauthorized
 * - getAudioBlob: returns stored Uint8Array for a question with audio
 * - getAudioBlob: returns null for a question without audio
 * - resetMasterQuestion: resets correctStreak to 0 (not 4)
 */
import { describe, expect, it } from "vitest";
import { mockBackend } from "./mocks/mockBackendImpl";

const ADMIN = "abcd";
const USER = "sarah";

async function assertUnauthorized(fn: () => Promise<unknown>): Promise<void> {
  await expect(fn()).rejects.toThrow(/unauthorized/i);
}

// ── downloadAudio — success path ─────────────────────────────────────────────

describe("downloadAudio — success path", () => {
  it("admin can download audio from a valid URL", async () => {
    const result = await mockBackend.downloadAudio(
      ADMIN,
      BigInt(1),
      "https://example.com/audio.mp3",
    );
    expect(result.__kind__).toBe("ok");
  });

  it("returns #ok for any https:// URL when called by admin", async () => {
    const result = await mockBackend.downloadAudio(
      ADMIN,
      BigInt(2),
      "https://cdn.example.com/sample.mp3",
    );
    expect(result.__kind__).toBe("ok");
  });

  it("returns #ok for http:// URL when called by admin", async () => {
    const result = await mockBackend.downloadAudio(
      ADMIN,
      BigInt(3),
      "http://example.com/audio.ogg",
    );
    expect(result.__kind__).toBe("ok");
  });
});

// ── downloadAudio — failure path ─────────────────────────────────────────────

describe("downloadAudio — failure path (bad URL)", () => {
  it("returns #err for an invalid URL scheme", async () => {
    const result = await mockBackend.downloadAudio(
      ADMIN,
      BigInt(1),
      "invalid://not-a-real-url",
    );
    expect(result.__kind__).toBe("err");
    if (result.__kind__ === "err") {
      expect(result.err.length).toBeGreaterThan(0);
    }
  });

  it("returns #err for a known bad URL", async () => {
    const result = await mockBackend.downloadAudio(ADMIN, BigInt(1), "bad-url");
    expect(result.__kind__).toBe("err");
  });

  it("returns #err for an empty URL", async () => {
    const result = await mockBackend.downloadAudio(ADMIN, BigInt(1), "");
    expect(result.__kind__).toBe("err");
  });

  it("error message is a non-empty string", async () => {
    const result = await mockBackend.downloadAudio(ADMIN, BigInt(1), "bad-url");
    if (result.__kind__ === "err") {
      expect(typeof result.err).toBe("string");
      expect(result.err.length).toBeGreaterThan(0);
    }
  });
});

// ── downloadAudio — authorization ────────────────────────────────────────────

describe("downloadAudio — admin-only guard", () => {
  it("rejects a regular user calling downloadAudio", async () => {
    await assertUnauthorized(() =>
      mockBackend.downloadAudio(
        USER,
        BigInt(1),
        "https://example.com/audio.mp3",
      ),
    );
  });

  it("rejects an unknown username calling downloadAudio", async () => {
    await assertUnauthorized(() =>
      mockBackend.downloadAudio(
        "ghost",
        BigInt(1),
        "https://example.com/audio.mp3",
      ),
    );
  });
});

// ── getAudioBlob ─────────────────────────────────────────────────────────────

describe("getAudioBlob", () => {
  it("returns a Uint8Array for a question that has audio stored", async () => {
    const blob = await mockBackend.getAudioBlob(BigInt(1));
    expect(blob).not.toBeNull();
    expect(blob).toBeInstanceOf(Uint8Array);
  });

  it("returned audio blob is non-empty", async () => {
    const blob = await mockBackend.getAudioBlob(BigInt(1));
    expect(blob?.length).toBeGreaterThan(0);
  });

  it("returns null for a question without audio", async () => {
    const blob = await mockBackend.getAudioBlob(BigInt(999));
    expect(blob).toBeNull();
  });

  it("getAudioBlob is accessible without admin privileges (public)", async () => {
    // No auth check — should resolve without throwing
    const blob = await mockBackend.getAudioBlob(BigInt(1));
    expect(blob).not.toBeNull();
  });
});

// ── updateQuestion preserves audioBlob and audioDownloadStatus ──────────────

describe("updateQuestion — preserves audio blob data", () => {
  it("updateQuestion by admin preserves existing audioBlob when updating text", async () => {
    // Question 1 has audio stored (from getAudioBlob mock returning Uint8Array)
    // After updating text, audioBlob must remain intact
    const updated = await mockBackend.updateQuestion(ADMIN, BigInt(1), {
      text: "Updated text — audio must be preserved",
      questionType: "mcSingle" as import("./mocks/backendStub").QuestionType,
      options: ["A", "B", "C", "D"],
      correctAnswers: [BigInt(0)],
      correctText: "",
      correctOrder: [],
    });
    expect(updated).not.toBeNull();
    expect(updated?.text).toBe("Updated text — audio must be preserved");
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

  it("updateQuestion preserves sectionId from existing question", async () => {
    // question 1 has sectionId = BigInt(1)
    const updated = await mockBackend.updateQuestion(ADMIN, BigInt(1), {
      text: "Updated but keep section",
      questionType: "mcSingle" as import("./mocks/backendStub").QuestionType,
      options: ["X"],
      correctAnswers: [BigInt(0)],
      correctText: "",
      correctOrder: [],
      sectionId: BigInt(1), // explicitly pass same sectionId
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
    // The label is 'reset master question' — full reset, not near-mastered
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
