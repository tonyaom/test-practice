import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../../constants/auth.constants";
/**
 * Test-only mock backend implementation.
 * Copied from src/mocks/backend.ts but imports from local backendStub
 * instead of the real ICP-bound backend module.
 */
import type {
  AdminUserInfo,
  LoginResult,
  Question,
  QuestionMastery,
  Section,
  Test,
  TestResult,
  UserProgressInfo,
  UserRole,
  backendInterface,
} from "./backendStub";
import { QuestionType } from "./backendStub";

const now = BigInt(Date.now()) * BigInt(1_000_000);

const sampleTests: Test[] = [
  {
    id: BigInt(1),
    name: "Introduction to Cognitive Psychology",
    description:
      "Covers foundational concepts in cognitive psychology including memory, attention, and perception.",
    createdAt: now,
  },
  {
    id: BigInt(2),
    name: "Biology 101: Cell Structure",
    description:
      "Explore the basic building blocks of life — cell types, organelles, and their functions.",
    createdAt: now,
  },
  {
    id: BigInt(3),
    name: "World History: Modern Era",
    description:
      "Key events and figures from the 19th century to the present day.",
    createdAt: now,
  },
];

const sampleSections: Section[] = [
  {
    id: BigInt(1),
    testId: BigInt(1),
    name: "Memory",
    description: "Questions about memory",
    createdAt: now,
  },
  {
    id: BigInt(2),
    testId: BigInt(1),
    name: "Attention",
    description: "Questions about attention",
    createdAt: now,
  },
];

const sampleQuestions: Question[] = [
  {
    id: BigInt(1),
    testId: BigInt(1),
    orderIndex: BigInt(0),
    text: "Which of the following cognitive functions is primarily associated with the Prefrontal Cortex?",
    questionType: QuestionType.mcSingle,
    options: [
      "Decision Making and Planning",
      "Language Production (Broca's Area)",
      "Visual Processing",
      "Auditory Memory",
    ],
    correctAnswers: [BigInt(0)],
    correctText: "",
    correctOrder: [],
    sectionId: BigInt(1),
  },
  {
    id: BigInt(2),
    testId: BigInt(1),
    orderIndex: BigInt(1),
    text: "Which of the following are associated with long-term memory storage? Select all that apply.",
    questionType: QuestionType.mcMulti,
    options: ["Hippocampus", "Amygdala", "Cerebellum", "Prefrontal Cortex"],
    correctAnswers: [BigInt(0), BigInt(1)],
    correctText: "",
    correctOrder: [],
    sectionId: BigInt(1),
  },
  {
    id: BigInt(3),
    testId: BigInt(1),
    orderIndex: BigInt(2),
    text: "What is the term for the process by which short-term memories are consolidated into long-term memories?",
    questionType: QuestionType.textInput,
    options: [],
    correctAnswers: [],
    correctText: "memory consolidation",
    correctOrder: [],
    sectionId: undefined,
  },
  {
    id: BigInt(4),
    testId: BigInt(1),
    orderIndex: BigInt(3),
    text: "Arrange the stages of memory processing in the correct order:",
    questionType: QuestionType.dragOrder,
    options: ["Retrieval", "Encoding", "Storage", "Attention"],
    correctAnswers: [],
    correctText: "",
    correctOrder: [BigInt(3), BigInt(1), BigInt(2), BigInt(0)],
    sectionId: BigInt(2),
  },
  {
    id: BigInt(5),
    testId: BigInt(2),
    orderIndex: BigInt(0),
    text: "Which organelle is known as the powerhouse of the cell?",
    questionType: QuestionType.mcSingle,
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Apparatus"],
    correctAnswers: [BigInt(1)],
    correctText: "",
    correctOrder: [],
    sectionId: undefined,
  },
];

const sampleResult: TestResult = {
  testId: BigInt(1),
  username: "sarah",
  completedAt: now,
  score: BigInt(3),
  totalQuestions: BigInt(4),
  sessionId: "test-session-1",
  questionResults: [
    { questionId: BigInt(1), isCorrect: true },
    { questionId: BigInt(2), isCorrect: true },
    { questionId: BigInt(3), isCorrect: false },
    { questionId: BigInt(4), isCorrect: true },
  ],
  sectionResults: [],
};

/** Roles known to the mock backend */
const knownRoles: Record<string, UserRole> = {
  [ADMIN_USERNAME]: "admin" as UserRole,
  admin2fa: "user" as UserRole,
  sarah: "user" as UserRole,
};

/** Active status for users */
const userActiveStatus: Record<string, boolean> = {
  [ADMIN_USERNAME]: true,
  admin2fa: true,
  sarah: true,
};

/** Passwords for dynamically registered users (seeded users are hard-coded in login) */
const registeredPasswords: Record<string, string> = {};

/** Mastery data per user+question */
const masteryData: Record<
  string,
  Record<string, { correctStreak: bigint; isMastered: boolean }>
> = {};

const sampleUsers: AdminUserInfo[] = [
  {
    username: ADMIN_USERNAME,
    displayName: "Admin User",
    role: "admin",
    isActive: true,
  },
  {
    username: "sarah",
    displayName: "Sarah Jones",
    role: "user",
    isActive: true,
  },
  {
    username: "admin2fa",
    displayName: "2FA User",
    role: "user",
    isActive: true,
  },
];

/**
 * Returns true when `username` is a registered admin in the mock.
 * Used by admin-only operations to simulate the backend requireAdmin guard.
 */
function isAdmin(username: string): boolean {
  return knownRoles[username] === ("admin" as UserRole);
}

/**
 * Throws the same message the Motoko backend uses so tests can assert the
 * rejection message without coupling to implementation details.
 */
function assertAdmin(username: string): void {
  const role = knownRoles[username];
  if (!role) throw new Error("Unauthorized: unknown user");
  if (!isAdmin(username)) throw new Error("Unauthorized: admin only");
}

export const mockBackend: backendInterface = {
  login: async (username: string, password: string): Promise<LoginResult> => {
    // Check deactivated special-case first
    if (username === "deactivated" && password === "deactivated") {
      return { __kind__: "accountDeactivated", accountDeactivated: null };
    }
    // Check if account is deactivated
    if (userActiveStatus[username] === false) {
      return { __kind__: "accountDeactivated", accountDeactivated: null };
    }
    // Seeded admin
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return {
        __kind__: "ok",
        ok: { username: ADMIN_USERNAME, role: "admin" as UserRole },
      };
    }
    // 2FA user
    if (username === "admin2fa" && password === "password") {
      return { __kind__: "requiresTOTP", requiresTOTP: null };
    }
    // Seeded regular user
    if (username === "sarah" && password === "password") {
      return {
        __kind__: "ok",
        ok: { username: "sarah", role: "user" as UserRole },
      };
    }
    // Dynamically registered users (registered via register() in this session)
    if (registeredPasswords[username] !== undefined) {
      if (registeredPasswords[username] === password) {
        const role = knownRoles[username] ?? ("user" as UserRole);
        return { __kind__: "ok", ok: { username, role } };
      }
      return { __kind__: "err", err: "Invalid username or password" };
    }
    return { __kind__: "err", err: "Invalid username or password" };
  },

  register: async (username: string, password: string) => {
    // Check for duplicate username (seeded or previously registered)
    if (
      knownRoles[username] !== undefined ||
      registeredPasswords[username] !== undefined
    ) {
      return { __kind__: "err", err: "Username already taken" };
    }
    // Add the new user so they can immediately log in after registering
    knownRoles[username] = "user" as UserRole;
    userActiveStatus[username] = true;
    registeredPasswords[username] = password;
    sampleUsers.push({
      username,
      displayName: username,
      role: "user",
      isActive: true,
    });
    return { __kind__: "ok", ok: null };
  },

  getUserRole: async (username: string) => {
    if (username === ADMIN_USERNAME) return "admin" as UserRole;
    return "user" as UserRole;
  },

  listTests: async () => sampleTests,

  getTest: async (testId: bigint) => {
    return sampleTests.find((t) => t.id === testId) ?? null;
  },

  // ADMIN-ONLY
  createTest: async (username: string, input) => {
    assertAdmin(username);
    return {
      id: BigInt(99),
      name: input.name,
      description: input.description,
      createdAt: now,
    };
  },

  // ADMIN-ONLY
  updateTest: async (username: string, testId: bigint, input) => {
    assertAdmin(username);
    const test = sampleTests.find((t) => t.id === testId);
    if (!test) return null;
    return { ...test, ...input };
  },

  // ADMIN-ONLY
  deleteTest: async (username: string) => {
    assertAdmin(username);
    return true;
  },

  listQuestionsForTest: async (testId: bigint) => {
    return sampleQuestions.filter((q) => q.testId === testId);
  },

  getQuestion: async (questionId: bigint) => {
    return sampleQuestions.find((q) => q.id === questionId) ?? null;
  },

  // ADMIN-ONLY
  addQuestion: async (username: string, testId: bigint, input) => {
    assertAdmin(username);
    return {
      id: BigInt(99),
      testId,
      orderIndex: BigInt(
        sampleQuestions.filter((q) => q.testId === testId).length,
      ),
      ...input,
      imageBlob: undefined,
    };
  },

  // ADMIN-ONLY — preserves existing question data (audioUrl is part of input)
  updateQuestion: async (username: string, questionId: bigint, input) => {
    assertAdmin(username);
    const q = sampleQuestions.find((q) => q.id === questionId);
    if (!q) return null;
    // Mirror the Motoko backend: only update with the provided input fields.
    return {
      ...q,
      ...input,
      imageBlob: undefined,
    };
  },

  // ADMIN-ONLY
  deleteQuestion: async (username: string) => {
    assertAdmin(username);
    return true;
  },

  getSection: async (sectionId: bigint) => {
    return sampleSections.find((s) => s.id === sectionId) ?? null;
  },

  listSectionsForTest: async (testId: bigint) => {
    return sampleSections.filter((s) => s.testId === testId);
  },

  // ADMIN-ONLY
  createSection: async (username: string, testId: bigint, input) => {
    assertAdmin(username);
    return {
      id: BigInt(99),
      testId,
      name: input.name,
      description: input.description,
      createdAt: now,
      updatedAt: now,
    };
  },

  // ADMIN-ONLY
  updateSection: async (username: string, sectionId: bigint, input) => {
    assertAdmin(username);
    const section = sampleSections.find((s) => s.id === sectionId);
    if (!section) return null;
    return { ...section, ...input };
  },

  // ADMIN-ONLY
  deleteSection: async (username: string) => {
    assertAdmin(username);
    return true;
  },

  listActiveTestSessions: async (_username: string) => {
    return [];
  },

  getTestProgress: async () => {
    return null;
  },

  saveTestProgress: async () => {
    // no-op in mock
  },

  getTestResultBySession: async () => sampleResult,

  submitTestAnswers: async (
    _username: string,
    _testId: bigint,
    _sessionId: string,
    _submissions: unknown[],
    _timeSpentSeconds?: bigint,
  ) => sampleResult,

  getTestResult: async () => sampleResult,

  updatePassword: async () => {
    return { __kind__: "ok" as const, ok: null };
  },

  updateProfile: async () => {
    return { __kind__: "ok" as const, ok: null };
  },

  // 2FA methods
  getTwoFAStatus: async (username: string) => {
    // Only the admin2fa mock user has 2FA enabled
    return username === "admin2fa";
  },

  setup2FA: async (username: string) => {
    return {
      __kind__: "ok" as const,
      ok: [
        "JBSWY3DPEHPK3PXP",
        `otpauth://totp/TestPractice:${username}?secret=JBSWY3DPEHPK3PXP&issuer=TestPractice`,
      ] as [string, string],
    };
  },

  enable2FA: async (_username: string, code: string) => {
    if (code === "000000") {
      return { __kind__: "err" as const, err: "Invalid TOTP code" };
    }
    return { __kind__: "ok" as const, ok: null };
  },

  disable2FA: async (_username: string, password: string, code: string) => {
    if (password !== ADMIN_PASSWORD || code === "000000") {
      return {
        __kind__: "err" as const,
        err:
          password !== ADMIN_PASSWORD
            ? "Invalid password"
            : "Invalid TOTP code",
      };
    }
    return { __kind__: "ok" as const, ok: null };
  },

  verifyTOTPLogin: async (username: string, code: string) => {
    if (code === "000000") {
      return { __kind__: "err" as const, err: "Invalid TOTP code" };
    }
    return {
      __kind__: "ok" as const,
      ok: { username, role: "admin" as UserRole },
    };
  },

  // ── Mastery ─────────────────────────────────────────────────────────
  getMasteryForTest: async (
    username: string,
    testId: bigint,
  ): Promise<QuestionMastery[]> => {
    const userMastery = masteryData[username] ?? {};
    return sampleQuestions
      .filter((q) => q.testId === testId)
      .map((q) => {
        const m = userMastery[String(q.id)] ?? {
          correctStreak: BigInt(0),
          isMastered: false,
        };
        return {
          userId: username,
          testId: q.testId,
          questionId: q.id,
          correctStreak: m.correctStreak,
          isMastered: m.isMastered,
          updatedAt: now,
        };
      });
  },

  resetMyMastery: async (username: string, input) => {
    if (!masteryData[username]) masteryData[username] = {};
    const testQuestions = sampleQuestions.filter(
      (q) =>
        q.testId === input.testId &&
        (input.sectionId === undefined
          ? true
          : q.sectionId === input.sectionId),
    );
    for (const q of testQuestions) {
      masteryData[username][String(q.id)] = {
        correctStreak: BigInt(0),
        isMastered: false,
      };
    }
  },

  // ── Admin: User Management ───────────────────────────────────────────────
  adminListUsers: async (username: string) => {
    assertAdmin(username);
    return sampleUsers.map((u) => ({
      ...u,
      isActive: userActiveStatus[u.username] ?? true,
    }));
  },

  adminActivateUser: async (
    callerUsername: string,
    targetUsername: string,
  ): Promise<boolean> => {
    assertAdmin(callerUsername);
    userActiveStatus[targetUsername] = true;
    return true;
  },

  adminDeactivateUser: async (
    callerUsername: string,
    targetUsername: string,
  ): Promise<boolean> => {
    assertAdmin(callerUsername);
    if (callerUsername === targetUsername)
      throw new Error("Cannot deactivate yourself");
    if (knownRoles[targetUsername] === ("admin" as UserRole))
      throw new Error("Cannot deactivate admin");
    userActiveStatus[targetUsername] = false;
    return true;
  },

  adminDeleteUser: async (
    callerUsername: string,
    targetUsername: string,
  ): Promise<
    { __kind__: "ok"; ok: null } | { __kind__: "err"; err: string }
  > => {
    assertAdmin(callerUsername);
    if (targetUsername === ADMIN_USERNAME) {
      return { __kind__: "err", err: "Cannot delete the seeded admin account" };
    }
    if (callerUsername === targetUsername) {
      return { __kind__: "err", err: "Cannot delete your own account" };
    }
    const idx = sampleUsers.findIndex((u) => u.username === targetUsername);
    if (idx !== -1) sampleUsers.splice(idx, 1);
    delete knownRoles[targetUsername];
    delete userActiveStatus[targetUsername];
    return { __kind__: "ok", ok: null };
  },

  adminGetUserProgress: async (
    callerUsername: string,
    targetUsername: string,
    testId: bigint,
  ): Promise<UserProgressInfo | null> => {
    assertAdmin(callerUsername);
    const testQs = sampleQuestions.filter((q) => q.testId === testId);
    if (testQs.length === 0) return null;
    const userMastery = masteryData[targetUsername] ?? {};
    const masteredCount = BigInt(
      testQs.filter((q) => userMastery[String(q.id)]?.isMastered).length,
    );
    const inProgressCount = BigInt(
      testQs.filter(
        (q) =>
          !userMastery[String(q.id)]?.isMastered &&
          Number(userMastery[String(q.id)]?.correctStreak ?? 0) > 0,
      ).length,
    );
    return {
      username: targetUsername,
      testId,
      totalQuestions: BigInt(testQs.length),
      masteredCount,
      inProgressCount,
    };
  },

  adminResetUserMastery: async (
    callerUsername: string,
    targetUsername: string,
    input,
  ): Promise<boolean> => {
    assertAdmin(callerUsername);
    if (!masteryData[targetUsername]) masteryData[targetUsername] = {};
    const testQuestions = sampleQuestions.filter(
      (q) =>
        q.testId === input.testId &&
        (input.sectionId === undefined
          ? true
          : q.sectionId === input.sectionId),
    );
    for (const q of testQuestions) {
      masteryData[targetUsername][String(q.id)] = {
        correctStreak: BigInt(0),
        isMastered: false,
      };
    }
    return true;
  },

  // Admin: Dashboard Stats
  getAdminDashboardStats: async (callerUsername: string) => {
    assertAdmin(callerUsername);
    const topTests = sampleTests.slice(0, 3).map((t) => ({
      testId: t.id,
      testName: t.name,
      sessionCount: BigInt(0),
    }));
    return {
      totalTests: BigInt(sampleTests.length),
      totalQuestions: BigInt(sampleQuestions.length),
      totalUsers: BigInt(sampleUsers.length),
      totalActiveUsers: BigInt(
        sampleUsers.filter((u) => userActiveStatus[u.username] !== false)
          .length,
      ),
      totalDeactivatedUsers: BigInt(
        sampleUsers.filter((u) => userActiveStatus[u.username] === false)
          .length,
      ),
      totalMasteredQuestions: BigInt(0),
      totalMasteryRecords: BigInt(0),
      topTests,
    };
  },

  // Completed test history
  listMyTestResults: async (
    _username: string,
  ): Promise<import("./backendStub").TestResult[]> => {
    return [];
  },

  // Test Review
  getTestReview: async (
    _username: string,
    testId: bigint,
    _sessionId: string,
  ) => {
    const questions = sampleQuestions.filter((q) => q.testId === testId);
    if (questions.length === 0) return null;
    return {
      totalScore: 75,
      sectionScores: [] as import("./backendStub").SectionResult[],
      questions: questions.map((q) => ({
        question: {
          id: q.id,
          text: q.text,
          questionType: q.questionType,
          options: q.options,
        },
        correctAnswer: q.correctText || String(q.correctAnswers[0] ?? 0),
        userAnswer: "",
        isCorrect: false,
      })) as import("./backendStub").ReviewQuestion[],
    };
  },
};
