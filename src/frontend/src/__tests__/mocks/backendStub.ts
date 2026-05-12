/**
 * Test stub for backend.ts / backend.d.ts
 * Provides all exported types and enums without ICP/candid dependencies.
 * This is only used in the vitest test environment.
 */

export enum QuestionType {
  textInput = "textInput",
  mcSingle = "mcSingle",
  dragOrder = "dragOrder",
  mcMulti = "mcMulti",
}

export enum UserRole {
  admin = "admin",
  user = "user",
}

export interface Some<T> {
  __kind__: "Some";
  value: T;
}
export interface None {
  __kind__: "None";
}
export type Option<T> = Some<T> | None;

/** Minimal ExternalBlob stub for tests */
export class ExternalBlob {
  private url: string;
  constructor(url: string) {
    this.url = url;
  }
  getDirectURL(): string {
    return this.url;
  }
  async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
    return new Uint8Array();
  }
  withUploadProgress(_onProgress: (p: number) => void): ExternalBlob {
    return this;
  }
  static fromURL(url: string): ExternalBlob {
    return new ExternalBlob(url);
  }
  static fromBytes(_blob: Uint8Array<ArrayBuffer>): ExternalBlob {
    return new ExternalBlob("blob://test");
  }
}

export interface UserSession {
  username: string;
  displayName?: string;
  role: UserRole;
}

export interface Test {
  id: bigint;
  name: string;
  createdAt: bigint;
  description: string;
  updatedAt?: bigint;
}

export interface SectionResult {
  sectionId: bigint;
  sectionName: string;
  score: bigint;
  totalQuestions: bigint;
}

export interface TestResult {
  completedAt: bigint;
  username: string;
  questionResults: Array<QuestionResult>;
  score: bigint;
  totalQuestions: bigint;
  sessionId: string;
  testId: bigint;
  sectionResults: Array<SectionResult>;
}

export interface QuestionResult {
  isCorrect: boolean;
  questionId: bigint;
}

export interface Question {
  id: bigint;
  imageBlob?: ExternalBlob;
  text: string;
  questionType: QuestionType;
  correctAnswers: Array<bigint>;
  correctText: string;
  correctOrder: Array<bigint>;
  testId: bigint;
  options: Array<string>;
  orderIndex: bigint;
  questionUpdatedAt?: bigint;
  /** Optional section ID; undefined means uncategorized */
  sectionId?: bigint;
  /** Optional explanation shown after answering */
  explanation?: string;
}

export interface CreateTestInput {
  name: string;
  description: string;
}

export interface UpdateTestInput {
  name: string;
  description: string;
}

export interface CreateQuestionInput {
  imageBlob?: ExternalBlob;
  text: string;
  questionType: QuestionType;
  correctAnswers: Array<bigint>;
  correctText: string;
  correctOrder: Array<bigint>;
  options: Array<string>;
  sectionId?: bigint;
  /** Optional rich-text HTML explanation shown after answering */
  explanation?: string;
}

export interface UpdateQuestionInput {
  imageBlob?: ExternalBlob;
  text: string;
  questionType: QuestionType;
  correctAnswers: Array<bigint>;
  correctText: string;
  correctOrder: Array<bigint>;
  options: Array<string>;
  sectionId?: bigint;
  /** Optional rich-text HTML explanation shown after answering */
  explanation?: string;
}

export interface AnswerSubmission {
  selectedOptions: Array<bigint>;
  orderedItems: Array<bigint>;
  textAnswer: string;
  questionId: bigint;
}

export interface TestProgress {
  username: string;
  answers: Array<AnswerSubmission>;
  selectedSectionIds: Array<bigint>;
  savedAt: bigint;
  sessionId: string;
  testId: bigint;
}

export interface SessionInfo {
  completed: boolean;
  sessionId: string;
  testId: bigint;
}

export type LoginResult =
  | { __kind__: "ok"; ok: UserSession }
  | { __kind__: "err"; err: string }
  | { __kind__: "accountDeactivated"; accountDeactivated: null }
  | { __kind__: "requiresTOTP"; requiresTOTP: null };

export interface AdminUserInfo {
  username: string;
  displayName: string;
  role: "admin" | "user";
  isActive: boolean;
}

export interface UserProgressInfo {
  username: string;
  testId: bigint;
  totalQuestions: bigint;
  masteredCount: bigint;
  inProgressCount: bigint;
}

export interface QuestionMastery {
  userId: string;
  testId: bigint;
  questionId: bigint;
  correctStreak: bigint;
  isMastered: boolean;
  updatedAt: bigint;
}

export interface ReviewQuestion {
  question: {
    id: bigint;
    explanation?: string;
    text: string;
    questionType: QuestionType;
    options: Array<string>;
  };
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
}

export interface ReviewData {
  totalScore: number;
  questions: Array<ReviewQuestion>;
  sectionScores: Array<SectionResult>;
}

export interface TopTestInfo {
  testId: bigint;
  testName: string;
  sessionCount: bigint;
}

export interface AdminDashboardStats {
  totalTests: bigint;
  totalQuestions: bigint;
  totalUsers: bigint;
  totalActiveUsers: bigint;
  totalDeactivatedUsers: bigint;
  totalMasteredQuestions: bigint;
  totalMasteryRecords: bigint;
  topTests: Array<TopTestInfo>;
}

export interface ResetMasteryInput {
  testId: bigint;
  sectionId?: bigint; // undefined = reset entire test; provided = reset only that section
}

export interface backendInterface {
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
  addQuestion(
    username: string,
    testId: bigint,
    input: CreateQuestionInput,
  ): Promise<Question>;
  createTest(username: string, input: CreateTestInput): Promise<Test>;
  deleteQuestion(username: string, questionId: bigint): Promise<boolean>;
  deleteTest(username: string, testId: bigint): Promise<boolean>;
  getQuestion(questionId: bigint): Promise<Question | null>;
  getTest(testId: bigint): Promise<Test | null>;
  getTestProgress(
    username: string,
    testId: bigint,
    sessionId: string,
  ): Promise<TestProgress | null>;
  getTestResult(username: string, testId: bigint): Promise<TestResult | null>;
  getTestResultBySession(
    username: string,
    testId: bigint,
    sessionId: string,
  ): Promise<TestResult | null>;
  getUserRole(username: string): Promise<UserRole | null>;
  listActiveTestSessions(username: string): Promise<Array<SessionInfo>>;
  listQuestionsForTest(testId: bigint): Promise<Array<Question>>;
  listTests(): Promise<Array<Test>>;
  login(username: string, password: string): Promise<LoginResult>;
  register(
    username: string,
    password: string,
  ): Promise<{ __kind__: "ok"; ok: null } | { __kind__: "err"; err: string }>;
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
    timeSpentSeconds: bigint,
  ): Promise<TestResult>;
  updatePassword(
    username: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ __kind__: "ok"; ok: null } | { __kind__: "err"; err: string }>;
  updateProfile(
    username: string,
    displayName: string,
  ): Promise<{ __kind__: "ok"; ok: null } | { __kind__: "err"; err: string }>;
  updateQuestion(
    username: string,
    questionId: bigint,
    input: UpdateQuestionInput,
  ): Promise<Question | null>;
  updateTest(
    username: string,
    testId: bigint,
    input: UpdateTestInput,
  ): Promise<Test | null>;
  // 2FA
  getTwoFAStatus(username: string): Promise<boolean>;
  setup2FA(
    username: string,
  ): Promise<
    { __kind__: "ok"; ok: [string, string] } | { __kind__: "err"; err: string }
  >;
  enable2FA(
    username: string,
    code: string,
  ): Promise<{ __kind__: "ok"; ok: null } | { __kind__: "err"; err: string }>;
  disable2FA(
    username: string,
    password: string,
    code: string,
  ): Promise<{ __kind__: "ok"; ok: null } | { __kind__: "err"; err: string }>;
  verifyTOTPLogin(
    username: string,
    code: string,
  ): Promise<
    { __kind__: "ok"; ok: UserSession } | { __kind__: "err"; err: string }
  >;
  // Mastery
  getMasteryForTest(
    username: string,
    testId: bigint,
  ): Promise<Array<QuestionMastery>>;
  resetMyMastery(username: string, input: ResetMasteryInput): Promise<void>;
  // Admin: User Management
  adminListUsers(username: string): Promise<Array<AdminUserInfo>>;
  adminActivateUser(callerUsername: string, username: string): Promise<boolean>;
  adminDeactivateUser(
    callerUsername: string,
    username: string,
  ): Promise<boolean>;
  adminDeleteUser(
    callerUsername: string,
    username: string,
  ): Promise<{ __kind__: "ok"; ok: null } | { __kind__: "err"; err: string }>;
  adminGetUserProgress(
    callerUsername: string,
    username: string,
    testId: bigint,
  ): Promise<UserProgressInfo | null>;
  adminResetUserMastery(
    callerUsername: string,
    username: string,
    input: ResetMasteryInput,
  ): Promise<boolean>;
  // Admin: Dashboard Stats
  getAdminDashboardStats(callerUsername: string): Promise<AdminDashboardStats>;
  // Completed test history
  listMyTestResults(username: string): Promise<Array<TestResult>>;
  // Test Review
  getTestReview(
    username: string,
    testId: bigint,
    sessionId: string,
  ): Promise<ReviewData | null>;
}

export interface Section {
  id: bigint;
  testId: bigint;
  name: string;
  description: string;
  createdAt: bigint;
  updatedAt?: bigint;
}

export interface CreateSectionInput {
  name: string;
  description: string;
}

export interface UpdateSectionInput {
  name: string;
  description: string;
}

export interface AuthSession {
  username: string;
  role: "admin" | "user";
  displayName?: string;
}
