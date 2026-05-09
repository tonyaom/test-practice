/**
 * Mock BackendService implementation for e2e and unit tests.
 *
 * Implements the BackendService interface directly (not backendInterface)
 * so it can be returned from useBackend() without going through the ICP actor.
 *
 * State is persisted to sessionStorage so it survives page.goto() navigations
 * within the same browser context (tab). Each new browser context starts fresh.
 *
 * Credentials:
 *   Admin:  username='adbc', password='abcd'
 *   User:   username='sarah', password='password'
 *   2FA:    username='admin2fa', password='password'
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
  UserSessionResult,
} from "../services/backendService";
import { QuestionType, Variant_admin_user } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

// ── Persistence helpers ───────────────────────────────────────────────

const STORAGE_KEY = "__mock_backend_state__";

type MockState = {
  users: UserRecord[];
  tests: SerializableTest[];
  questions: SerializableQuestion[];
  sections: SerializableSection[];
  testResults: SerializableTestResult[];
  nextTestId: number;
  nextQuestionId: number;
  nextSectionId: number;
};

type UserRecord = {
  username: string;
  password: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
};

// JSON-serializable versions (bigints -> strings)
type SerializableTest = { id: string; name: string; description: string; createdAt: string; updatedAt: string };
type SerializableSection = { id: string; testId: string; name: string; description: string; createdAt: string; updatedAt: string };
type SerializableQuestion = {
  id: string; testId: string; orderIndex: string; questionUpdatedAt: string;
  text: string; questionType: string; options: string[];
  correctAnswers: string[]; correctText: string; correctOrder: string[];
  sectionId?: string; explanation?: string;
};
type SerializableTestResult = {
  testId: string; username: string; sessionId: string;
  completedAt: string; score: string; totalQuestions: string; timeSpentSeconds: string;
  questionResults: { questionId: string; isCorrect: boolean }[];
  sectionResults: { sectionId: string; sectionName: string; score: string; totalQuestions: string }[];
};

const DEFAULT_STATE: MockState = {
  users: [
    { username: "adbc", password: "abcd", displayName: "Admin", role: Variant_admin_user.admin, isActive: true },
    { username: "sarah", password: "password", displayName: "Sarah", role: Variant_admin_user.user, isActive: true },
    { username: "admin2fa", password: "password", displayName: "Admin2FA", role: Variant_admin_user.user, isActive: true },
    { username: "alice", password: "password", displayName: "Alice Smith", role: Variant_admin_user.user, isActive: true },
    { username: "bob", password: "password", displayName: "Bob Jones", role: Variant_admin_user.user, isActive: true },
    { username: "charlie", password: "password", displayName: "Charlie Brown", role: Variant_admin_user.user, isActive: false },
  ],
  tests: [
    { id: "1", name: "Introduction to Cognitive Psychology", description: "Covers foundational concepts in cognitive psychology including memory, attention, and perception.", createdAt: String(now), updatedAt: String(now) },
    { id: "2", name: "Biology 101: Cell Structure", description: "Explore the basic building blocks of life.", createdAt: String(now), updatedAt: String(now) },
    { id: "3", name: "World History: Modern Era", description: "Key events and figures from the 19th century to the present day.", createdAt: String(now), updatedAt: String(now) },
  ],
  questions: [
    { id: "1", testId: "1", orderIndex: "0", questionUpdatedAt: String(now), text: "Which cognitive function is primarily associated with the Prefrontal Cortex?", questionType: QuestionType.mcSingle, options: ["Decision Making and Planning", "Language Production", "Visual Processing", "Auditory Memory"], correctAnswers: ["0"], correctText: "", correctOrder: [], sectionId: "1" },
    { id: "2", testId: "1", orderIndex: "1", questionUpdatedAt: String(now), text: "Which areas are associated with long-term memory storage?", questionType: QuestionType.mcMulti, options: ["Hippocampus", "Amygdala", "Cerebellum", "Prefrontal Cortex"], correctAnswers: ["0", "1"], correctText: "", correctOrder: [], sectionId: "1" },
    { id: "3", testId: "1", orderIndex: "2", questionUpdatedAt: String(now), text: "What is the term for consolidating short-term to long-term memories?", questionType: QuestionType.textInput, options: [], correctAnswers: [], correctText: "memory consolidation", correctOrder: [], sectionId: "2" },
    { id: "4", testId: "1", orderIndex: "3", questionUpdatedAt: String(now), text: "Arrange the stages of memory processing in the correct order:", questionType: QuestionType.dragOrder, options: ["Retrieval", "Encoding", "Storage", "Attention"], correctAnswers: [], correctText: "", correctOrder: ["3", "1", "2", "0"], sectionId: "2" },
    { id: "5", testId: "2", orderIndex: "0", questionUpdatedAt: String(now), text: "Which organelle is known as the powerhouse of the cell?", questionType: QuestionType.mcSingle, options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Apparatus"], correctAnswers: ["1"], correctText: "", correctOrder: [] },
  ],
  sections: [
    { id: "1", testId: "1", name: "Foundations", description: "Core concepts", createdAt: String(now), updatedAt: String(now) },
    { id: "2", testId: "1", name: "Advanced Topics", description: "Deep dives", createdAt: String(now), updatedAt: String(now) },
  ],
  testResults: [
    {
      testId: "1", username: "sarah", sessionId: "mock-session-1",
      completedAt: String(now - BigInt(86400000_000_000)), score: "3", totalQuestions: "4", timeSpentSeconds: "120",
      questionResults: [
        { questionId: "1", isCorrect: true }, { questionId: "2", isCorrect: true },
        { questionId: "3", isCorrect: false }, { questionId: "4", isCorrect: true },
      ],
      sectionResults: [
        { sectionId: "1", sectionName: "Foundations", score: "2", totalQuestions: "2" },
        { sectionId: "2", sectionName: "Advanced Topics", score: "1", totalQuestions: "2" },
      ],
    },
  ],
  nextTestId: 4,
  nextQuestionId: 6,
  nextSectionId: 3,
};

function loadState(): MockState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MockState;
      return parsed;
    }
  } catch {
    // ignore
  }
  return JSON.parse(JSON.stringify(DEFAULT_STATE)) as MockState;
}

function saveState(state: MockState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore if storage is unavailable
  }
}

// ── Conversion helpers ────────────────────────────────────────────────

function toTest(s: SerializableTest): Test {
  return { id: BigInt(s.id), name: s.name, description: s.description, createdAt: BigInt(s.createdAt), updatedAt: BigInt(s.updatedAt) };
}
function fromTest(t: Test): SerializableTest {
  return { id: String(t.id), name: t.name, description: t.description, createdAt: String(t.createdAt), updatedAt: String(t.updatedAt) };
}

function toSection(s: SerializableSection): Section {
  return { id: BigInt(s.id), testId: BigInt(s.testId), name: s.name, description: s.description, createdAt: BigInt(s.createdAt), updatedAt: BigInt(s.updatedAt) };
}
function fromSection(s: Section): SerializableSection {
  return { id: String(s.id), testId: String(s.testId), name: s.name, description: s.description, createdAt: String(s.createdAt), updatedAt: String(s.updatedAt) };
}

function toQuestion(q: SerializableQuestion): Question {
  return {
    id: BigInt(q.id), testId: BigInt(q.testId), orderIndex: BigInt(q.orderIndex),
    questionUpdatedAt: BigInt(q.questionUpdatedAt), text: q.text,
    questionType: q.questionType as QuestionType,
    options: q.options,
    correctAnswers: q.correctAnswers.map((c) => BigInt(c)),
    correctText: q.correctText,
    correctOrder: q.correctOrder.map((c) => BigInt(c)),
    sectionId: q.sectionId !== undefined ? BigInt(q.sectionId) : undefined,
    explanation: q.explanation,
  };
}
function fromQuestion(q: Question): SerializableQuestion {
  return {
    id: String(q.id), testId: String(q.testId), orderIndex: String(q.orderIndex),
    questionUpdatedAt: String(q.questionUpdatedAt), text: q.text,
    questionType: q.questionType,
    options: q.options,
    correctAnswers: q.correctAnswers.map(String),
    correctText: q.correctText,
    correctOrder: q.correctOrder.map(String),
    sectionId: q.sectionId !== undefined ? String(q.sectionId) : undefined,
    explanation: q.explanation,
  };
}

function toTestResult(r: SerializableTestResult): TestResult {
  return {
    testId: BigInt(r.testId), username: r.username, sessionId: r.sessionId,
    completedAt: BigInt(r.completedAt), score: BigInt(r.score),
    totalQuestions: BigInt(r.totalQuestions), timeSpentSeconds: BigInt(r.timeSpentSeconds),
    questionResults: r.questionResults.map((qr) => ({ questionId: BigInt(qr.questionId), isCorrect: qr.isCorrect })),
    sectionResults: r.sectionResults.map((sr) => ({
      sectionId: BigInt(sr.sectionId), sectionName: sr.sectionName,
      score: BigInt(sr.score), totalQuestions: BigInt(sr.totalQuestions),
    })),
  };
}
function fromTestResult(r: TestResult): SerializableTestResult {
  return {
    testId: String(r.testId), username: r.username, sessionId: r.sessionId,
    completedAt: String(r.completedAt), score: String(r.score),
    totalQuestions: String(r.totalQuestions), timeSpentSeconds: String(r.timeSpentSeconds),
    questionResults: r.questionResults.map((qr) => ({ questionId: String(qr.questionId), isCorrect: qr.isCorrect })),
    sectionResults: r.sectionResults.map((sr) => ({
      sectionId: String(sr.sectionId), sectionName: sr.sectionName,
      score: String(sr.score), totalQuestions: String(sr.totalQuestions),
    })),
  };
}

// ── Mock BackendService ───────────────────────────────────────────────────────

export const mockBackendService: BackendService = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  login: async (username: string, password: string): Promise<LoginResult> => {
    if (username === "admin2fa" && password === "password") {
      return { __kind__: "requiresTOTP", requiresTOTP: null };
    }
    const state = loadState();
    const user = state.users.find((u) => u.username === username && u.password === password);
    if (!user) return { __kind__: "err", err: "Invalid username or password" };
    if (!user.isActive) return { __kind__: "accountDeactivated", accountDeactivated: null };
    return { __kind__: "ok", ok: { username: user.username, role: user.role, displayName: user.displayName } };
  },

  register: async (username: string, password: string): Promise<SimpleResult> => {
    const state = loadState();
    if (state.users.find((u) => u.username === username)) {
      return { __kind__: "err", err: "Username already taken" };
    }
    state.users.push({ username, password, displayName: username, role: Variant_admin_user.user, isActive: true });
    saveState(state);
    return { __kind__: "ok", ok: null };
  },

  verifyTOTPLogin: async (username: string, _code: string): Promise<UserSessionResult> => {
    const state = loadState();
    const user = state.users.find((u) => u.username === username);
    if (!user) return { __kind__: "err", err: "User not found" };
    return { __kind__: "ok", ok: { username: user.username, role: user.role, displayName: user.displayName } };
  },

  getUserRole: async (username: string): Promise<UserRole | null> => {
    const state = loadState();
    const user = state.users.find((u) => u.username === username);
    return user?.role ?? null;
  },

  // ── Profile ───────────────────────────────────────────────────────────────
  updatePassword: async (_username: string, _currentPassword: string, _newPassword: string): Promise<SimpleResult> => {
    return { __kind__: "ok", ok: null };
  },

  updateProfile: async (username: string, displayName: string): Promise<SimpleResult> => {
    const state = loadState();
    const user = state.users.find((u) => u.username === username);
    if (user) user.displayName = displayName;
    saveState(state);
    return { __kind__: "ok", ok: null };
  },

  // ── 2FA ───────────────────────────────────────────────────────────────────
  getTwoFAStatus: async (username: string): Promise<boolean> => {
    return username === "admin2fa";
  },

  setup2FA: async (_username: string): Promise<Setup2FAResult> => {
    return { __kind__: "ok", ok: ["JBSWY3DPEHPK3PXP", "otpauth://totp/PrepStream:test@example.com?secret=JBSWY3DPEHPK3PXP&issuer=PrepStream"] };
  },

  enable2FA: async (_username: string, _code: string): Promise<SimpleResult> => {
    return { __kind__: "ok", ok: null };
  },

  disable2FA: async (_username: string, _password: string, _code: string): Promise<SimpleResult> => {
    return { __kind__: "ok", ok: null };
  },

  // ── Tests ─────────────────────────────────────────────────────────────────
  listTests: async (): Promise<Test[]> => {
    const state = loadState();
    return state.tests.map(toTest);
  },

  getTest: async (testId: bigint): Promise<Test | null> => {
    const state = loadState();
    const t = state.tests.find((t) => t.id === String(testId));
    return t ? toTest(t) : null;
  },

  createTest: async (_username: string, input: CreateTestInput): Promise<Test> => {
    const state = loadState();
    const id = String(state.nextTestId++);
    const nowTs = String(BigInt(Date.now()) * BigInt(1_000_000));
    const t: SerializableTest = { id, name: input.name, description: input.description, createdAt: nowTs, updatedAt: nowTs };
    state.tests.push(t);
    saveState(state);
    return toTest(t);
  },

  updateTest: async (_username: string, testId: bigint, input: UpdateTestInput): Promise<Test | null> => {
    const state = loadState();
    const idx = state.tests.findIndex((t) => t.id === String(testId));
    if (idx === -1) return null;
    state.tests[idx] = { ...state.tests[idx], ...input, updatedAt: String(BigInt(Date.now()) * BigInt(1_000_000)) };
    saveState(state);
    return toTest(state.tests[idx]);
  },

  deleteTest: async (_username: string, testId: bigint): Promise<boolean> => {
    const state = loadState();
    const idx = state.tests.findIndex((t) => t.id === String(testId));
    if (idx === -1) return false;
    state.tests.splice(idx, 1);
    saveState(state);
    return true;
  },

  // ── Sections ──────────────────────────────────────────────────────────────
  listSectionsForTest: async (testId: bigint): Promise<Section[]> => {
    const state = loadState();
    return state.sections.filter((s) => s.testId === String(testId)).map(toSection);
  },

  getSection: async (sectionId: bigint): Promise<Section | null> => {
    const state = loadState();
    const s = state.sections.find((s) => s.id === String(sectionId));
    return s ? toSection(s) : null;
  },

  createSection: async (_username: string, testId: bigint, input: CreateSectionInput): Promise<Section> => {
    const state = loadState();
    const id = String(state.nextSectionId++);
    const nowTs = String(BigInt(Date.now()) * BigInt(1_000_000));
    const s: SerializableSection = { id, testId: String(testId), name: input.name, description: input.description, createdAt: nowTs, updatedAt: nowTs };
    state.sections.push(s);
    saveState(state);
    return toSection(s);
  },

  updateSection: async (_username: string, sectionId: bigint, input: UpdateSectionInput): Promise<Section | null> => {
    const state = loadState();
    const idx = state.sections.findIndex((s) => s.id === String(sectionId));
    if (idx === -1) return null;
    state.sections[idx] = { ...state.sections[idx], ...input, updatedAt: String(BigInt(Date.now()) * BigInt(1_000_000)) };
    saveState(state);
    return toSection(state.sections[idx]);
  },

  deleteSection: async (_username: string, sectionId: bigint): Promise<boolean> => {
    const state = loadState();
    const idx = state.sections.findIndex((s) => s.id === String(sectionId));
    if (idx === -1) return false;
    state.sections.splice(idx, 1);
    saveState(state);
    return true;
  },

  // ── Questions ─────────────────────────────────────────────────────────────
  listQuestionsForTest: async (testId: bigint): Promise<Question[]> => {
    const state = loadState();
    return state.questions.filter((q) => q.testId === String(testId)).map(toQuestion);
  },

  getQuestion: async (questionId: bigint): Promise<Question | null> => {
    const state = loadState();
    const q = state.questions.find((q) => q.id === String(questionId));
    return q ? toQuestion(q) : null;
  },

  addQuestion: async (_username: string, testId: bigint, input: CreateQuestionInput): Promise<Question> => {
    const state = loadState();
    const id = String(state.nextQuestionId++);
    const existing = state.questions.filter((q) => q.testId === String(testId));
    const nowTs = String(BigInt(Date.now()) * BigInt(1_000_000));
    const q: SerializableQuestion = {
      id,
      testId: String(testId),
      orderIndex: String(existing.length),
      questionUpdatedAt: nowTs,
      text: input.text,
      questionType: input.questionType,
      options: input.options,
      correctAnswers: input.correctAnswers.map(String),
      correctText: input.correctText,
      correctOrder: input.correctOrder.map(String),
      sectionId: input.sectionId !== undefined ? String(input.sectionId) : undefined,
      explanation: input.explanation,
    };
    state.questions.push(q);
    saveState(state);
    return toQuestion(q);
  },

  updateQuestion: async (_username: string, questionId: bigint, input: UpdateQuestionInput): Promise<Question | null> => {
    const state = loadState();
    const idx = state.questions.findIndex((q) => q.id === String(questionId));
    if (idx === -1) return null;
    const updated: SerializableQuestion = {
      ...state.questions[idx],
      text: input.text,
      questionType: input.questionType,
      options: input.options,
      correctAnswers: input.correctAnswers.map(String),
      correctText: input.correctText,
      correctOrder: input.correctOrder.map(String),
      sectionId: input.sectionId !== undefined ? String(input.sectionId) : undefined,
      explanation: input.explanation,
      questionUpdatedAt: String(BigInt(Date.now()) * BigInt(1_000_000)),
    };
    state.questions[idx] = updated;
    saveState(state);
    return toQuestion(updated);
  },

  deleteQuestion: async (_username: string, questionId: bigint): Promise<boolean> => {
    const state = loadState();
    const idx = state.questions.findIndex((q) => q.id === String(questionId));
    if (idx === -1) return false;
    state.questions.splice(idx, 1);
    saveState(state);
    return true;
  },

  // ── Test sessions & results ────────────────────────────────────────────────
  listActiveTestSessions: async (_username: string): Promise<SessionInfo[]> => {
    return [];
  },

  getTestProgress: async (_username: string, _testId: bigint, _sessionId: string): Promise<TestProgress | null> => {
    return null;
  },

  saveTestProgress: async (
    _username: string,
    _testId: bigint,
    _sessionId: string,
    _answers: AnswerSubmission[],
  ): Promise<void> => {},

  submitTestAnswers: async (
    username: string,
    testId: bigint,
    sessionId: string,
    submissions: AnswerSubmission[],
  ): Promise<TestResult> => {
    const state = loadState();
    const testQs = state.questions.filter((q) => q.testId === String(testId)).map(toQuestion);
    let score = 0;
    const questionResults = submissions.map((sub) => {
      const q = testQs.find((tq) => tq.id === sub.questionId);
      let isCorrect = false;
      if (q) {
        if (q.questionType === QuestionType.textInput) {
          isCorrect = sub.textAnswer.trim().toLowerCase() === (q.correctText ?? "").toLowerCase();
        } else if (q.questionType === QuestionType.mcSingle) {
          isCorrect = sub.selectedOptions.length === 1 && sub.selectedOptions[0] === q.correctAnswers[0];
        } else if (q.questionType === QuestionType.mcMulti) {
          const sorted = [...sub.selectedOptions].sort((a, b) => Number(a - b));
          const correct = [...q.correctAnswers].sort((a, b) => Number(a - b));
          isCorrect = sorted.length === correct.length && sorted.every((v, i) => v === correct[i]);
        } else {
          isCorrect = sub.orderedItems.every((v, i) => v === q.correctOrder[i]);
        }
      }
      if (isCorrect) score++;
      return { questionId: sub.questionId, isCorrect };
    });

    const nowTs = BigInt(Date.now()) * BigInt(1_000_000);
    const result: TestResult = {
      testId,
      username,
      sessionId,
      completedAt: nowTs,
      score: BigInt(score),
      totalQuestions: BigInt(submissions.length),
      timeSpentSeconds: BigInt(0),
      questionResults,
      sectionResults: [],
    };
    state.testResults.push(fromTestResult(result));
    saveState(state);
    return result;
  },

  getTestResult: async (username: string, testId: bigint): Promise<TestResult | null> => {
    const state = loadState();
    const r = state.testResults.find((r) => r.username === username && r.testId === String(testId));
    return r ? toTestResult(r) : null;
  },

  getTestResultBySession: async (username: string, testId: bigint, sessionId: string): Promise<TestResult | null> => {
    const state = loadState();
    const r = state.testResults.find((r) => r.username === username && r.testId === String(testId) && r.sessionId === sessionId);
    return r ? toTestResult(r) : null;
  },

  // ── Mastery ───────────────────────────────────────────────────────────────
  getMasteryForTest: async (_username: string, _testId: number): Promise<QuestionMastery[]> => {
    return [];
  },

  resetMyMastery: async (_username: string, _testId: number): Promise<void> => {},

  // ── Admin: User Management ────────────────────────────────────────────────
  adminListUsers: async (_username: string): Promise<AdminUserInfo[]> => {
    const state = loadState();
    return state.users.map((u) => ({
      username: u.username,
      displayName: u.displayName,
      role: u.role,
      isActive: u.isActive,
    }));
  },

  adminActivateUser: async (_adminUsername: string, targetUsername: string): Promise<boolean> => {
    const state = loadState();
    const user = state.users.find((u) => u.username === targetUsername);
    if (!user) return false;
    user.isActive = true;
    saveState(state);
    return true;
  },

  adminDeactivateUser: async (_adminUsername: string, targetUsername: string): Promise<boolean> => {
    const state = loadState();
    const user = state.users.find((u) => u.username === targetUsername);
    if (!user) return false;
    user.isActive = false;
    saveState(state);
    return true;
  },

  adminGetUserProgress: async (
    _adminUsername: string,
    targetUsername: string,
    _testId: number,
  ): Promise<UserProgressInfo | null> => {
    return {
      username: targetUsername,
      testId: BigInt(1),
      totalQuestions: BigInt(20),
      masteredCount: BigInt(12),
      inProgressCount: BigInt(3),
    };
  },

  adminResetUserMastery: async (_adminUsername: string, _targetUsername: string, _testId: number): Promise<boolean> => {
    return true;
  },

  // ── Admin: Dashboard Stats ────────────────────────────────────────────────
  getAdminDashboardStats: async (_adminUsername: string): Promise<AdminDashboardStats> => {
    const state = loadState();
    return {
      totalTests: BigInt(state.tests.length),
      totalQuestions: BigInt(state.questions.length),
      totalUsers: BigInt(state.users.length),
      totalActiveUsers: BigInt(state.users.filter((u) => u.isActive).length),
      totalDeactivatedUsers: BigInt(state.users.filter((u) => !u.isActive).length),
      totalMasteredQuestions: BigInt(0),
      totalMasteryRecords: BigInt(0),
      topTests: state.tests.slice(0, 3).map((t) => ({
        testId: BigInt(t.id),
        testName: t.name,
        sessionCount: BigInt(0),
      })),
    };
  },

  // ── Test History ─────────────────────────────────────────────────────────
  listMyTestResults: async (username: string): Promise<TestResult[]> => {
    const state = loadState();
    return state.testResults.filter((r) => r.username === username).map(toTestResult);
  },

  // ── Test Review ───────────────────────────────────────────────────────────
  getTestReview: async (_username: string, _testId: number, _sessionId: string): Promise<ReviewData | null> => {
    return {
      totalScore: 75,
      sectionScores: [
        { sectionId: BigInt(1), sectionName: "Foundations", score: BigInt(4), totalQuestions: BigInt(4) },
      ],
      questions: [
        {
          question: {
            id: BigInt(1),
            text: "Which cognitive function is primarily associated with the Prefrontal Cortex?",
            questionType: QuestionType.mcSingle,
            options: ["Decision Making and Planning", "Language Production", "Visual Processing", "Auditory Memory"],
            explanation: "The Prefrontal Cortex is responsible for executive functions.",
          },
          userAnswer: "Decision Making and Planning",
          correctAnswer: "Decision Making and Planning",
          isCorrect: true,
        },
      ],
    };
  },

  // ── Audio ─────────────────────────────────────────────────────────────────
  downloadAudio: async (
    _username: string,
    _questionId: bigint,
    audioUrl: string,
  ): Promise<SimpleResult> => {
    if (!audioUrl || audioUrl.trim() === "") {
      return { __kind__: "err", err: "Invalid URL" };
    }
    return { __kind__: "ok", ok: null };
  },

  getAudioBlob: async (questionId: bigint): Promise<Uint8Array | null> => {
    if (questionId === BigInt(1)) {
      return new Uint8Array([0x49, 0x44, 0x33]);
    }
    return null;
  },
};

// Keep backward-compat export so existing unit test imports still work
export { mockBackendService as mockBackend };
