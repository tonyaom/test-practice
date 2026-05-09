/**
 * REST backend service implementation.
 *
 * Implements the BackendService interface using plain fetch() calls against
 * a conventional REST API. All endpoints are prefixed with /api/.
 *
 * Authentication token is stored in memory (factory closure) for security —
 * never written to localStorage. It is set automatically after a successful
 * login or TOTP verify call.
 *
 * REST Contract (inline)
 * ─────────────────────────────────────────────────────────────────────────
 * POST   /api/auth/login              { username, password }
 *          → LoginResult (same discriminated union shape as ICP)
 * POST   /api/auth/register           { username, password }
 *          → SimpleResult
 * POST   /api/auth/verify-totp        { username, code }
 *          → UserSessionResult
 * GET    /api/users/:username/role    Authorization: Bearer <token>
 *          → { role: "admin" | "user" }
 * PUT    /api/users/:username/password { currentPassword, newPassword }
 *          → SimpleResult
 * PUT    /api/users/:username/profile  { displayName }
 *          → SimpleResult
 * GET    /api/users/:username/2fa      Authorization: Bearer <token>
 *          → { enabled: boolean }
 * POST   /api/users/:username/2fa/setup Authorization: Bearer <token>
 *          → Setup2FAResult  { __kind__: "ok", ok: [secret, otpauthUrl] }
 * POST   /api/users/:username/2fa/enable { code }
 *          → SimpleResult
 * DELETE /api/users/:username/2fa      { password, code }
 *          → SimpleResult
 * GET    /api/tests                   Authorization: Bearer <token>
 *          → { tests: Test[] }
 * GET    /api/tests/:testId           Authorization: Bearer <token>
 *          → Test | null
 * POST   /api/tests                   { username, name, description }
 *          → Test
 * PUT    /api/tests/:testId           { username, name, description }
 *          → Test | null
 * DELETE /api/tests/:testId           { username }
 *          → { deleted: boolean }
 * GET    /api/tests/:testId/sections  Authorization: Bearer <token>
 *          → { sections: Section[] }
 * GET    /api/sections/:sectionId     Authorization: Bearer <token>
 *          → Section | null
 * POST   /api/tests/:testId/sections  { username, name, description }
 *          → Section
 * PUT    /api/sections/:sectionId     { username, name, description }
 *          → Section | null
 * DELETE /api/sections/:sectionId     { username }
 *          → { deleted: boolean }
 * GET    /api/tests/:testId/questions Authorization: Bearer <token>
 *          → { questions: Question[] }
 * GET    /api/questions/:questionId   Authorization: Bearer <token>
 *          → Question | null
 * POST   /api/tests/:testId/questions { username, text, questionType, options,
 *                                       correctAnswers, correctText,
 *                                       correctOrder, sectionId? }
 *          → Question  (image upload: multipart/form-data with "image" field)
 * PUT    /api/questions/:questionId   { username, ...fields }
 *          → Question | null
 * DELETE /api/questions/:questionId   { username }
 *          → { deleted: boolean }
 * GET    /api/users/:username/sessions Authorization: Bearer <token>
 *          → { sessions: SessionInfo[] }
 * GET    /api/users/:username/sessions/:sessionId/progress
 *          → TestProgress | null
 * PUT    /api/users/:username/sessions/:sessionId/progress
 *          { testId, answers: AnswerSubmission[] }
 *          → { ok: true }
 * POST   /api/tests/:testId/sessions/:sessionId/submit
 *          { username, submissions: AnswerSubmission[] }
 *          → TestResult
 * GET    /api/users/:username/results/:testId  Authorization: Bearer <token>
 *          → TestResult | null
 * GET    /api/users/:username/results/:testId/sessions/:sessionId
 *          → TestResult | null
 * ─────────────────────────────────────────────────────────────────────────
 */

import type {
  AdminDashboardStats,
  AdminUserInfo,
  AnswerSubmission,
  BackendService,
  CreateQuestionInput,
  CreateSectionInput,
  CreateTestInput,
  LoginResult,
  Question,
  QuestionMastery,
  ReviewData,
  Section,
  SessionInfo,
  Setup2FAResult,
  SimpleResult,
  Test,
  TestProgress,
  TestResult,
  UpdateQuestionInput,
  UpdateSectionInput,
  UpdateTestInput,
  UserProgressInfo,
  UserRole,
  UserSession,
  UserSessionResult,
} from "./backendService";

// ── Serialisation helpers ────────────────────────────────────────────────────

/**
 * JSON does not support BigInt. The REST API returns bigint fields as strings;
 * we convert them back here.
 */
function parseBigInt(v: unknown): bigint {
  return BigInt(v as string | number);
}

function deserialiseTest(raw: Record<string, unknown>): Test {
  return {
    id: parseBigInt(raw.id),
    name: raw.name as string,
    description: raw.description as string,
    createdAt: parseBigInt(raw.createdAt),
    updatedAt: raw.updatedAt != null ? parseBigInt(raw.updatedAt) : BigInt(0),
  };
}

function deserialiseSection(raw: Record<string, unknown>): Section {
  return {
    id: parseBigInt(raw.id),
    testId: parseBigInt(raw.testId),
    name: raw.name as string,
    description: raw.description as string,
    createdAt: parseBigInt(raw.createdAt),
    updatedAt: raw.updatedAt != null ? parseBigInt(raw.updatedAt) : BigInt(0),
  };
}

function deserialiseQuestion(raw: Record<string, unknown>): Question {
  return {
    id: parseBigInt(raw.id),
    testId: parseBigInt(raw.testId),
    orderIndex: parseBigInt(raw.orderIndex),
    text: raw.text as string,
    questionType: raw.questionType as Question["questionType"],
    options: raw.options as string[],
    correctAnswers: (raw.correctAnswers as (string | number)[]).map(
      parseBigInt,
    ),
    correctText: raw.correctText as string,
    correctOrder: (raw.correctOrder as (string | number)[]).map(parseBigInt),
    sectionId: raw.sectionId != null ? parseBigInt(raw.sectionId) : undefined,
    questionUpdatedAt:
      raw.questionUpdatedAt != null
        ? parseBigInt(raw.questionUpdatedAt)
        : BigInt(0),
    // imageBlob intentionally omitted — REST API serves images via URL
  };
}

function deserialiseUserSession(raw: Record<string, unknown>): UserSession {
  return {
    username: raw.username as string,
    role: raw.role as UserRole,
    displayName: raw.displayName as string | undefined,
  };
}

// ── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a BackendService that calls a REST API at `baseUrl`.
 *
 * Usage:
 *   import { createRestBackendService } from "./restBackendService";
 *   const svc = createRestBackendService("http://localhost:3000");
 */
export function createRestBackendService(baseUrl: string): BackendService {
  // Auth token stored in closure — never persisted to localStorage
  let token: string | null = null;

  const api = baseUrl.replace(/\/$/, "");

  function authHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const res = await fetch(`${api}${path}`, {
      method,
      headers: authHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const err = (await res.json()) as { error?: string };
        if (err.error) message = err.error;
      } catch {
        // ignore json parse failure
      }
      throw new Error(message);
    }
    return res.json() as Promise<T>;
  }

  function setTokenFromSession(session: UserSession) {
    // REST API should return a session token alongside the user object;
    // for now we store the username as a fallback bearer token until the
    // REST server defines its token format.
    token = session.username;
  }

  return {
    // ── Auth ──────────────────────────────────────────────────────────────
    // POST /api/auth/login
    login: async (username, password): Promise<LoginResult> => {
      const res = await request<LoginResult>("POST", "/api/auth/login", {
        username,
        password,
      });
      if (res.__kind__ === "ok") {
        // Deserialise the user session (bigint fields) and set auth token
        const session = deserialiseUserSession(
          res.ok as unknown as Record<string, unknown>,
        );
        (res as { __kind__: "ok"; ok: UserSession }).ok = session;
        setTokenFromSession(session);
      }
      return res;
    },

    // POST /api/auth/register
    register: async (username, password): Promise<SimpleResult> => {
      return request("POST", "/api/auth/register", { username, password });
    },

    // POST /api/auth/verify-totp
    verifyTOTPLogin: async (username, code): Promise<UserSessionResult> => {
      const res = await request<UserSessionResult>(
        "POST",
        "/api/auth/verify-totp",
        { username, code },
      );
      if (res.__kind__ === "ok") {
        // Deserialise the user session (bigint fields) and set auth token
        const session = deserialiseUserSession(
          res.ok as unknown as Record<string, unknown>,
        );
        (res as { __kind__: "ok"; ok: UserSession }).ok = session;
        setTokenFromSession(session);
      }
      return res;
    },

    // GET /api/users/:username/role
    getUserRole: async (username): Promise<UserRole | null> => {
      const res = await request<{ role: UserRole | null }>(
        "GET",
        `/api/users/${encodeURIComponent(username)}/role`,
      );
      return res.role;
    },

    // ── Profile ───────────────────────────────────────────────────────────
    // PUT /api/users/:username/password
    updatePassword: async (
      username,
      currentPassword,
      newPassword,
    ): Promise<SimpleResult> => {
      return request(
        "PUT",
        `/api/users/${encodeURIComponent(username)}/password`,
        { currentPassword, newPassword },
      );
    },

    // PUT /api/users/:username/profile
    updateProfile: async (username, displayName): Promise<SimpleResult> => {
      return request(
        "PUT",
        `/api/users/${encodeURIComponent(username)}/profile`,
        { displayName },
      );
    },

    // ── 2FA ───────────────────────────────────────────────────────────────
    // GET /api/users/:username/2fa
    getTwoFAStatus: async (username): Promise<boolean> => {
      const res = await request<{ enabled: boolean }>(
        "GET",
        `/api/users/${encodeURIComponent(username)}/2fa`,
      );
      return res.enabled;
    },

    // POST /api/users/:username/2fa/setup
    setup2FA: async (username): Promise<Setup2FAResult> => {
      return request(
        "POST",
        `/api/users/${encodeURIComponent(username)}/2fa/setup`,
      );
    },

    // POST /api/users/:username/2fa/enable
    enable2FA: async (username, code): Promise<SimpleResult> => {
      return request(
        "POST",
        `/api/users/${encodeURIComponent(username)}/2fa/enable`,
        { code },
      );
    },

    // DELETE /api/users/:username/2fa
    disable2FA: async (username, password, code): Promise<SimpleResult> => {
      return request(
        "DELETE",
        `/api/users/${encodeURIComponent(username)}/2fa`,
        { password, code },
      );
    },

    // ── Tests ─────────────────────────────────────────────────────────────
    // GET /api/tests
    listTests: async (): Promise<Test[]> => {
      const res = await request<{ tests: Record<string, unknown>[] }>(
        "GET",
        "/api/tests",
      );
      return res.tests.map(deserialiseTest);
    },

    // GET /api/tests/:testId
    getTest: async (testId): Promise<Test | null> => {
      const res = await request<Record<string, unknown> | null>(
        "GET",
        `/api/tests/${String(testId)}`,
      );
      return res ? deserialiseTest(res) : null;
    },

    // POST /api/tests
    createTest: async (username, input: CreateTestInput): Promise<Test> => {
      const res = await request<Record<string, unknown>>("POST", "/api/tests", {
        username,
        ...input,
      });
      return deserialiseTest(res);
    },

    // PUT /api/tests/:testId
    updateTest: async (
      username,
      testId,
      input: UpdateTestInput,
    ): Promise<Test | null> => {
      const res = await request<Record<string, unknown> | null>(
        "PUT",
        `/api/tests/${String(testId)}`,
        { username, ...input },
      );
      return res ? deserialiseTest(res) : null;
    },

    // DELETE /api/tests/:testId
    deleteTest: async (username, testId): Promise<boolean> => {
      const res = await request<{ deleted: boolean }>(
        "DELETE",
        `/api/tests/${String(testId)}`,
        { username },
      );
      return res.deleted;
    },

    // ── Sections ──────────────────────────────────────────────────────────
    // GET /api/tests/:testId/sections
    listSectionsForTest: async (testId): Promise<Section[]> => {
      const res = await request<{ sections: Record<string, unknown>[] }>(
        "GET",
        `/api/tests/${String(testId)}/sections`,
      );
      return res.sections.map(deserialiseSection);
    },

    // GET /api/sections/:sectionId
    getSection: async (sectionId): Promise<Section | null> => {
      const res = await request<Record<string, unknown> | null>(
        "GET",
        `/api/sections/${String(sectionId)}`,
      );
      return res ? deserialiseSection(res) : null;
    },

    // POST /api/tests/:testId/sections
    createSection: async (
      username,
      testId,
      input: CreateSectionInput,
    ): Promise<Section> => {
      const res = await request<Record<string, unknown>>(
        "POST",
        `/api/tests/${String(testId)}/sections`,
        { username, ...input },
      );
      return deserialiseSection(res);
    },

    // PUT /api/sections/:sectionId
    updateSection: async (
      username,
      sectionId,
      input: UpdateSectionInput,
    ): Promise<Section | null> => {
      const res = await request<Record<string, unknown> | null>(
        "PUT",
        `/api/sections/${String(sectionId)}`,
        { username, ...input },
      );
      return res ? deserialiseSection(res) : null;
    },

    // DELETE /api/sections/:sectionId
    deleteSection: async (username, sectionId): Promise<boolean> => {
      const res = await request<{ deleted: boolean }>(
        "DELETE",
        `/api/sections/${String(sectionId)}`,
        { username },
      );
      return res.deleted;
    },

    // ── Questions ─────────────────────────────────────────────────────────
    // GET /api/tests/:testId/questions
    listQuestionsForTest: async (testId): Promise<Question[]> => {
      const res = await request<{ questions: Record<string, unknown>[] }>(
        "GET",
        `/api/tests/${String(testId)}/questions`,
      );
      return res.questions.map(deserialiseQuestion);
    },

    // GET /api/questions/:questionId
    getQuestion: async (questionId): Promise<Question | null> => {
      const res = await request<Record<string, unknown> | null>(
        "GET",
        `/api/questions/${String(questionId)}`,
      );
      return res ? deserialiseQuestion(res) : null;
    },

    // POST /api/tests/:testId/questions
    addQuestion: async (
      username,
      testId,
      input: CreateQuestionInput,
    ): Promise<Question> => {
      // Image uploads use multipart/form-data; text-only questions use JSON.
      // If imageBlob is present the caller should use a FormData approach;
      // this implementation sends JSON and ignores imageBlob for simplicity.
      const res = await request<Record<string, unknown>>(
        "POST",
        `/api/tests/${String(testId)}/questions`,
        {
          username,
          text: input.text,
          questionType: input.questionType,
          options: input.options,
          correctAnswers: input.correctAnswers.map(String),
          correctText: input.correctText,
          correctOrder: input.correctOrder.map(String),
          sectionId: input.sectionId != null ? String(input.sectionId) : null,
        },
      );
      return deserialiseQuestion(res);
    },

    // PUT /api/questions/:questionId
    updateQuestion: async (
      username,
      questionId,
      input: UpdateQuestionInput,
    ): Promise<Question | null> => {
      const res = await request<Record<string, unknown> | null>(
        "PUT",
        `/api/questions/${String(questionId)}`,
        {
          username,
          text: input.text,
          questionType: input.questionType,
          options: input.options,
          correctAnswers: input.correctAnswers.map(String),
          correctText: input.correctText,
          correctOrder: input.correctOrder.map(String),
          sectionId: input.sectionId != null ? String(input.sectionId) : null,
        },
      );
      return res ? deserialiseQuestion(res) : null;
    },

    // DELETE /api/questions/:questionId
    deleteQuestion: async (username, questionId): Promise<boolean> => {
      const res = await request<{ deleted: boolean }>(
        "DELETE",
        `/api/questions/${String(questionId)}`,
        { username },
      );
      return res.deleted;
    },

    // ── Test sessions & results ───────────────────────────────────────────
    // GET /api/users/:username/sessions
    listActiveTestSessions: async (username): Promise<SessionInfo[]> => {
      const res = await request<{ sessions: SessionInfo[] }>(
        "GET",
        `/api/users/${encodeURIComponent(username)}/sessions`,
      );
      return res.sessions;
    },

    // GET /api/users/:username/sessions/:sessionId/progress
    getTestProgress: async (
      username,
      _testId,
      sessionId,
    ): Promise<TestProgress | null> => {
      return request(
        "GET",
        `/api/users/${encodeURIComponent(username)}/sessions/${encodeURIComponent(sessionId)}/progress`,
      );
    },

    // PUT /api/users/:username/sessions/:sessionId/progress
    saveTestProgress: async (
      username,
      testId,
      sessionId,
      answers: AnswerSubmission[],
    ): Promise<void> => {
      await request(
        "PUT",
        `/api/users/${encodeURIComponent(username)}/sessions/${encodeURIComponent(sessionId)}/progress`,
        { testId: String(testId), answers },
      );
    },

    // POST /api/tests/:testId/sessions/:sessionId/submit
    submitTestAnswers: async (
      username,
      testId,
      sessionId,
      submissions: AnswerSubmission[],
    ): Promise<TestResult> => {
      return request(
        "POST",
        `/api/tests/${String(testId)}/sessions/${encodeURIComponent(sessionId)}/submit`,
        { username, submissions },
      );
    },

    // GET /api/users/:username/results/:testId
    getTestResult: async (username, testId): Promise<TestResult | null> => {
      return request(
        "GET",
        `/api/users/${encodeURIComponent(username)}/results/${String(testId)}`,
      );
    },

    // GET /api/users/:username/results/:testId/sessions/:sessionId
    getTestResultBySession: async (
      username,
      testId,
      sessionId,
    ): Promise<TestResult | null> => {
      return request(
        "GET",
        `/api/users/${encodeURIComponent(username)}/results/${String(testId)}/sessions/${encodeURIComponent(sessionId)}`,
      );
    },

    // ── Mastery ──────────────────────────────────────────────────────────────
    // GET /api/users/:username/mastery/:testId
    getMasteryForTest: async (username, testId): Promise<QuestionMastery[]> => {
      const res = await request<{ mastery: Record<string, unknown>[] }>(
        "GET",
        `/api/users/${encodeURIComponent(username)}/mastery/${testId}`,
      );
      return res.mastery.map((m) => ({
        userId: m.userId as string,
        testId: BigInt(m.testId as string | number),
        questionId: BigInt(m.questionId as string | number),
        correctStreak: BigInt(m.correctStreak as string | number),
        isMastered: m.isMastered as boolean,
        updatedAt: BigInt(m.updatedAt as string | number),
      }));
    },

    // POST /api/users/:username/mastery/:testId/reset
    resetMyMastery: async (username, testId): Promise<void> => {
      await request(
        "POST",
        `/api/users/${encodeURIComponent(username)}/mastery/${testId}/reset`,
      );
    },

    // ── Admin: User Management ────────────────────────────────────────────────
    // GET /api/admin/users
    adminListUsers: async (username): Promise<AdminUserInfo[]> => {
      const res = await request<{ users: Record<string, unknown>[] }>(
        "GET",
        `/api/admin/users?caller=${encodeURIComponent(username)}`,
      );
      return res.users.map((u) => ({
        username: u.username as string,
        displayName: u.displayName as string,
        role: u.role as AdminUserInfo["role"],
        isActive: u.isActive as boolean,
      }));
    },

    // POST /api/admin/users/:username/activate
    adminActivateUser: async (
      adminUsername,
      targetUsername,
    ): Promise<boolean> => {
      const res = await request<{ activated: boolean }>(
        "POST",
        `/api/admin/users/${encodeURIComponent(targetUsername)}/activate`,
        { callerUsername: adminUsername },
      );
      return res.activated;
    },

    // POST /api/admin/users/:username/deactivate
    adminDeactivateUser: async (
      adminUsername,
      targetUsername,
    ): Promise<boolean> => {
      const res = await request<{ deactivated: boolean }>(
        "POST",
        `/api/admin/users/${encodeURIComponent(targetUsername)}/deactivate`,
        { callerUsername: adminUsername },
      );
      return res.deactivated;
    },

    // GET /api/admin/users/:username/progress/:testId
    adminGetUserProgress: async (
      adminUsername,
      targetUsername,
      testId,
    ): Promise<UserProgressInfo | null> => {
      const res = await request<Record<string, unknown> | null>(
        "GET",
        `/api/admin/users/${encodeURIComponent(targetUsername)}/progress/${testId}?caller=${encodeURIComponent(adminUsername)}`,
      );
      if (!res) return null;
      return {
        username: res.username as string,
        testId: BigInt(res.testId as string | number),
        totalQuestions: BigInt(res.totalQuestions as string | number),
        masteredCount: BigInt(res.masteredCount as string | number),
        inProgressCount: BigInt(res.inProgressCount as string | number),
      };
    },

    // POST /api/admin/users/:username/mastery/:testId/reset
    adminResetUserMastery: async (
      adminUsername,
      targetUsername,
      testId,
    ): Promise<boolean> => {
      const res = await request<{ reset: boolean }>(
        "POST",
        `/api/admin/users/${encodeURIComponent(targetUsername)}/mastery/${testId}/reset`,
        { callerUsername: adminUsername },
      );
      return res.reset;
    },

    // ── Admin: Dashboard Stats ────────────────────────────────────────────────
    // GET /api/admin/dashboard-stats
    getAdminDashboardStats: async (
      adminUsername,
    ): Promise<AdminDashboardStats> => {
      const res = await request<Record<string, unknown>>(
        "GET",
        `/api/admin/dashboard-stats?caller=${encodeURIComponent(adminUsername)}`,
      );
      return {
        totalTests: BigInt(res.totalTests as string | number),
        totalQuestions: BigInt(res.totalQuestions as string | number),
        totalUsers: BigInt(res.totalUsers as string | number),
        totalActiveUsers: BigInt(res.totalActiveUsers as string | number),
        totalDeactivatedUsers: BigInt(
          res.totalDeactivatedUsers as string | number,
        ),
        totalMasteredQuestions: BigInt(
          res.totalMasteredQuestions as string | number,
        ),
        totalMasteryRecords: BigInt(res.totalMasteryRecords as string | number),
        topTests: ((res.topTests as Record<string, unknown>[]) ?? []).map(
          (t) => ({
            testId: BigInt(t.testId as string | number),
            testName: t.testName as string,
            sessionCount: BigInt(t.sessionCount as string | number),
          }),
        ),
      };
    },

    // ── Test History ──────────────────────────────────────────────────────────
    // GET /api/users/:username/results
    listMyTestResults: async (username): Promise<TestResult[]> => {
      const res = await request<{ results: Record<string, unknown>[] }>(
        "GET",
        `/api/users/${encodeURIComponent(username)}/results`,
      ).catch(() => ({ results: [] }));
      return (res.results ?? []).map((r) => ({
        testId: BigInt(r.testId as string | number),
        sessionId: r.sessionId as string,
        score: BigInt(r.score as string | number),
        totalQuestions: BigInt(r.totalQuestions as string | number),
        completedAt: BigInt(r.completedAt as string | number),
        username: r.username as string,
        questionResults: (
          (r.questionResults as Record<string, unknown>[]) ?? []
        ).map((qr) => ({
          questionId: BigInt(qr.questionId as string | number),
          isCorrect: qr.isCorrect as boolean,
        })),
        sectionResults: (
          (r.sectionResults as Record<string, unknown>[]) ?? []
        ).map((sr) => ({
          sectionId: BigInt(sr.sectionId as string | number),
          sectionName: sr.sectionName as string,
          score: BigInt(sr.score as string | number),
          totalQuestions: BigInt(sr.totalQuestions as string | number),
        })),
      })) as TestResult[];
    },

    // ── Test Review ──────────────────────────────────────────────────────────
    // GET /api/users/:username/results/:testId/sessions/:sessionId/review
    getTestReview: async (
      username,
      testId,
      sessionId,
    ): Promise<ReviewData | null> => {
      return request(
        "GET",
        `/api/users/${encodeURIComponent(username)}/results/${testId}/sessions/${encodeURIComponent(sessionId)}/review`,
      );
    },

    // POST /api/questions/:questionId/audio
    downloadAudio: async (
      username,
      questionId,
      audioUrl,
    ): Promise<SimpleResult> => {
      return request("POST", `/api/questions/${String(questionId)}/audio`, {
        username,
        audioUrl,
      });
    },

    // GET /api/questions/:questionId/audio
    getAudioBlob: async (questionId): Promise<Uint8Array | null> => {
      try {
        const res = await fetch(
          `${baseUrl}/api/questions/${String(questionId)}/audio`,
          {
            headers: authHeaders(),
          },
        );
        if (!res.ok) return null;
        const buf = await res.arrayBuffer();
        return new Uint8Array(buf);
      } catch {
        return null;
      }
    },
  };
}
