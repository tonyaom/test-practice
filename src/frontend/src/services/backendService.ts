/**
 * BackendService — the single interface through which all frontend code
 * accesses backend operations.
 *
 * Every method mirrors the corresponding method on backendInterface from
 * backend.d.ts, but lives in a framework-independent file that can be
 * implemented by the real ICP actor (icpBackendService.ts) or a mock
 * (used in unit tests).
 *
 * Pages and hooks import BackendService, never the raw actor directly.
 */
import type {
  AdminDashboardStats,
  AdminUserInfo,
  AnswerSubmission,
  CreateQuestionInput,
  CreateSectionInput,
  CreateTestInput,
  LoginResult,
  Question,
  QuestionMastery,
  ReviewData,
  Section,
  SessionInfo,
  Test,
  TestProgress,
  TestResult,
  TopTestInfo,
  UpdateQuestionInput,
  UpdateSectionInput,
  UpdateTestInput,
  UserProgressInfo,
  UserSession,
} from "../backend";
import { QuestionType, Variant_admin_user } from "../backend";

/** User role type — mapped from backend enum */
export type UserRole = Variant_admin_user;
export { QuestionType, Variant_admin_user };

/** Re-export backend types so callers only need to import from this file. */
export type {
  AdminDashboardStats,
  AdminUserInfo,
  AnswerSubmission,
  CreateQuestionInput,
  CreateSectionInput,
  CreateTestInput,
  LoginResult,
  Question,
  QuestionMastery,
  ReviewData,
  Section,
  SessionInfo,
  Test,
  TestProgress,
  TestResult,
  TopTestInfo,
  UpdateQuestionInput,
  UpdateSectionInput,
  UpdateTestInput,
  UserProgressInfo,
  UserSession,
};

export type SimpleResult =
  | { __kind__: "ok"; ok: null }
  | { __kind__: "err"; err: string };

export type UserSessionResult =
  | { __kind__: "ok"; ok: UserSession }
  | { __kind__: "err"; err: string };

export type Setup2FAResult =
  | { __kind__: "ok"; ok: [string, string] }
  | { __kind__: "err"; err: string };

/**
 * All backend operations exposed to the frontend.
 * Exactly mirrors backendInterface so the ICP implementation is a
 * zero-logic passthrough.
 */
export interface BackendService {
  // ── Auth ──────────────────────────────────────────────────────────────────
  login(username: string, password: string): Promise<LoginResult>;
  register(username: string, password: string): Promise<SimpleResult>;
  verifyTOTPLogin(username: string, code: string): Promise<UserSessionResult>;
  getUserRole(username: string): Promise<UserRole | null>;

  // ── Profile ───────────────────────────────────────────────────────────────
  updatePassword(
    username: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<SimpleResult>;
  updateProfile(username: string, displayName: string): Promise<SimpleResult>;

  // ── 2FA ───────────────────────────────────────────────────────────────────
  getTwoFAStatus(username: string): Promise<boolean>;
  setup2FA(username: string): Promise<Setup2FAResult>;
  enable2FA(username: string, code: string): Promise<SimpleResult>;
  disable2FA(
    username: string,
    password: string,
    code: string,
  ): Promise<SimpleResult>;

  // ── Tests ─────────────────────────────────────────────────────────────────
  listTests(): Promise<Array<Test>>;
  getTest(testId: bigint): Promise<Test | null>;
  createTest(username: string, input: CreateTestInput): Promise<Test>;
  updateTest(
    username: string,
    testId: bigint,
    input: UpdateTestInput,
  ): Promise<Test | null>;
  deleteTest(username: string, testId: bigint): Promise<boolean>;

  // ── Sections ──────────────────────────────────────────────────────────────
  listSectionsForTest(testId: bigint): Promise<Array<Section>>;
  getSection(sectionId: bigint): Promise<Section | null>;
  createSection(
    username: string,
    testId: bigint,
    input: CreateSectionInput,
  ): Promise<Section>;
  updateSection(
    username: string,
    sectionId: bigint,
    input: UpdateSectionInput,
  ): Promise<Section | null>;
  deleteSection(username: string, sectionId: bigint): Promise<boolean>;

  // ── Questions ─────────────────────────────────────────────────────────────
  listQuestionsForTest(testId: bigint): Promise<Array<Question>>;
  getQuestion(questionId: bigint): Promise<Question | null>;
  addQuestion(
    username: string,
    testId: bigint,
    input: CreateQuestionInput,
  ): Promise<Question>;
  updateQuestion(
    username: string,
    questionId: bigint,
    input: UpdateQuestionInput,
  ): Promise<Question | null>;
  deleteQuestion(username: string, questionId: bigint): Promise<boolean>;

  // ── Test sessions & results ───────────────────────────────────────────────
  listActiveTestSessions(username: string): Promise<Array<SessionInfo>>;
  getTestProgress(
    username: string,
    testId: bigint,
    sessionId: string,
  ): Promise<TestProgress | null>;
  saveTestProgress(
    username: string,
    testId: bigint,
    sessionId: string,
    answers: Array<AnswerSubmission>,
  ): Promise<void>;
  submitTestAnswers(
    username: string,
    testId: bigint,
    sessionId: string,
    submissions: Array<AnswerSubmission>,
  ): Promise<TestResult>;
  getTestResult(username: string, testId: bigint): Promise<TestResult | null>;
  getTestResultBySession(
    username: string,
    testId: bigint,
    sessionId: string,
  ): Promise<TestResult | null>;

  // ── Mastery ───────────────────────────────────────────────────────────────
  getMasteryForTest(
    username: string,
    testId: number,
  ): Promise<QuestionMastery[]>;
  resetMyMastery(username: string, testId: number): Promise<void>;

  // ── Admin: User Management ────────────────────────────────────────────────
  adminListUsers(username: string): Promise<AdminUserInfo[]>;
  adminActivateUser(
    adminUsername: string,
    targetUsername: string,
  ): Promise<boolean>;
  adminDeactivateUser(
    adminUsername: string,
    targetUsername: string,
  ): Promise<boolean>;
  adminGetUserProgress(
    adminUsername: string,
    targetUsername: string,
    testId: number,
  ): Promise<UserProgressInfo | null>;
  adminResetUserMastery(
    adminUsername: string,
    targetUsername: string,
    testId: number,
  ): Promise<boolean>;

  // ── Admin: Dashboard Stats ────────────────────────────────────────────────
  getAdminDashboardStats(adminUsername: string): Promise<AdminDashboardStats>;

  // ── Test History ─────────────────────────────────────────────────────────
  listMyTestResults(username: string): Promise<TestResult[]>;

  // ── Test Review ───────────────────────────────────────────────────────────
  getTestReview(
    username: string,
    testId: number,
    sessionId: string,
  ): Promise<ReviewData | null>;

  // ── Audio ─────────────────────────────────────────────────────────────────
  downloadAudio(
    username: string,
    questionId: bigint,
    audioUrl: string,
  ): Promise<SimpleResult>;
  getAudioBlob(questionId: bigint): Promise<Uint8Array | null>;
}
