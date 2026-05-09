export type {
  Test,
  Question,
  TestResult,
  QuestionResult,
  AnswerSubmission,
  UserSession,
  CreateTestInput,
  UpdateTestInput,
  CreateQuestionInput,
  UpdateQuestionInput,
  LoginResult,
  SectionResult,
  Section,
  AdminUserInfo,
  UserProgressInfo,
  QuestionMastery,
  AdminDashboardStats,
  TopTestInfo,
  ReviewQuestion,
  ReviewData,
} from "../backend";
export { QuestionType, Variant_admin_user } from "../backend";
/** UserRole alias for Variant_admin_user */
export type UserRole = import("../backend").Variant_admin_user;
export interface AuthSession {
  username: string;
  role: "admin" | "user";
  displayName?: string;
}

/** A test session stored in localStorage while the user is mid-test */
export interface TestSession {
  sessionId: string;
  testId: string;
  testName: string;
  /** ISO timestamp of when this session was created */
  startedAt: string;
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  /** Selected section IDs — empty array means entire test */
  selectedSectionIds: number[];
  /** Exact question IDs (as strings) used in this session — set after questions are filtered/shuffled */
  questionIds?: string[];
}
