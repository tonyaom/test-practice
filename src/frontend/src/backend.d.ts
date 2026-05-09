import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TestProgress {
    username: string;
    answers: Array<AnswerSubmission>;
    selectedSectionIds: Array<bigint>;
    savedAt: bigint;
    sessionId: string;
    testId: bigint;
}
export type Timestamp = bigint;
export interface UserSession {
    username: string;
    displayName?: string;
    role: UserRole;
}
export interface AdminDashboardStats {
    totalTests: bigint;
    totalActiveUsers: bigint;
    topTests: Array<TopTestInfo>;
    totalQuestions: bigint;
    totalDeactivatedUsers: bigint;
    totalMasteredQuestions: bigint;
    totalMasteryRecords: bigint;
    totalUsers: bigint;
}
export interface CreateSectionInput {
    name: string;
    description: string;
}
export interface TestMasteryInfo {
    timeSpentSeconds: bigint;
    inProgressCount: bigint;
    testName: string;
    totalQuestions: bigint;
    isTestMastered: boolean;
    masteredCount: bigint;
    sections: Array<SectionMasteryInfo>;
    testId: TestId;
}
export interface SectionResult {
    sectionName: string;
    score: bigint;
    sectionId: bigint;
    totalQuestions: bigint;
}
export interface CreateQuestionInput {
    imageBlob?: ExternalBlob;
    explanation?: string;
    text: string;
    audioUrl?: string;
    questionType: QuestionType;
    sectionId?: bigint;
    correctAnswers: Array<bigint>;
    correctText: string;
    correctOrder: Array<bigint>;
    options: Array<string>;
}
export interface SessionInfo {
    completed: boolean;
    sessionId: string;
    testId: bigint;
}
export interface TopTestInfo {
    testName: string;
    testId: TestId;
    sessionCount: bigint;
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
export interface CreateTestInput {
    name: string;
    description: string;
}
export interface UpdateSectionInput {
    name: string;
    description: string;
}
export interface AdminUserInfo {
    username: UserId;
    displayName: string;
    role: Variant_admin_user;
    isActive: boolean;
}
export interface ReviewData {
    totalScore: number;
    questions: Array<ReviewQuestion>;
    sectionScores: Array<SectionResult>;
}
export interface UpdateQuestionInput {
    imageBlob?: ExternalBlob;
    explanation?: string;
    text: string;
    audioUrl?: string;
    questionType: QuestionType;
    sectionId?: bigint;
    correctAnswers: Array<bigint>;
    correctText: string;
    correctOrder: Array<bigint>;
    options: Array<string>;
}
export interface QuestionMastery {
    userId: UserId;
    updatedAt: Timestamp;
    isMastered: boolean;
    questionId: QuestionId;
    testId: TestId;
    correctStreak: bigint;
}
export interface SectionMasteryInfo {
    timeSpentSeconds: bigint;
    totalInSection: bigint;
    sectionName: string;
    sectionId: SectionId;
    masteredCount: bigint;
    isSectionMastered: boolean;
}
export interface AnswerSubmission {
    selectedOptions: Array<bigint>;
    orderedItems: Array<bigint>;
    textAnswer: string;
    questionId: bigint;
}
export type TestId = bigint;
export interface Test {
    id: bigint;
    name: string;
    createdAt: bigint;
    description: string;
    updatedAt: bigint;
}
export type QuestionId = bigint;
export interface TestResult {
    completedAt: bigint;
    timeSpentSeconds: bigint;
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
export type UserId = string;
export interface UpdateTestInput {
    name: string;
    description: string;
}
export interface ResetMasteryInput {
    sectionId?: SectionId;
    testId: TestId;
}
export type LoginResult = {
    __kind__: "ok";
    ok: UserSession;
} | {
    __kind__: "err";
    err: string;
} | {
    __kind__: "accountDeactivated";
    accountDeactivated: null;
} | {
    __kind__: "requiresTOTP";
    requiresTOTP: null;
};
export interface Section {
    id: bigint;
    name: string;
    createdAt: bigint;
    description: string;
    updatedAt: bigint;
    testId: bigint;
}
export interface UserDetailedProgress {
    tests: Array<TestMasteryInfo>;
    username: UserId;
    lifetimeTimeSpentSeconds: bigint;
}
export type SectionId = bigint;
export interface Question {
    id: bigint;
    imageBlob?: ExternalBlob;
    explanation?: string;
    questionUpdatedAt: bigint;
    text: string;
    audioBlob?: Uint8Array;
    audioDownloadStatus?: string;
    audioUrl?: string;
    questionType: QuestionType;
    sectionId?: bigint;
    correctAnswers: Array<bigint>;
    correctText: string;
    correctOrder: Array<bigint>;
    testId: bigint;
    options: Array<string>;
    orderIndex: bigint;
}
export interface UserProgressInfo {
    inProgressCount: bigint;
    username: UserId;
    totalQuestions: bigint;
    masteredCount: bigint;
    testId: TestId;
}
export enum QuestionType {
    textInput = "textInput",
    mcSingle = "mcSingle",
    dragOrder = "dragOrder",
    mcMulti = "mcMulti"
}
export enum Variant_admin_user {
    admin = "admin",
    user = "user"
}
export interface backendInterface {
    addQuestion(username: string, testId: bigint, input: CreateQuestionInput): Promise<Question>;
    adminActivateUser(callerUsername: string, username: UserId): Promise<boolean>;
    adminDeactivateUser(callerUsername: string, username: UserId): Promise<boolean>;
    adminGetUserDetailedProgress(callerUsername: string, username: UserId): Promise<UserDetailedProgress>;
    adminGetUserProgress(callerUsername: string, username: UserId, testId: TestId): Promise<UserProgressInfo | null>;
    adminListUsers(username: string): Promise<Array<AdminUserInfo>>;
    adminResetUserMastery(callerUsername: string, username: UserId, input: ResetMasteryInput): Promise<boolean>;
    createSection(username: string, testId: bigint, input: CreateSectionInput): Promise<Section>;
    createTest(username: string, input: CreateTestInput): Promise<Test>;
    deleteQuestion(username: string, questionId: bigint): Promise<boolean>;
    deleteSection(username: string, sectionId: bigint): Promise<boolean>;
    deleteTest(username: string, testId: bigint): Promise<boolean>;
    disable2FA(username: string, password: string, code: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    downloadAudio(username: string, questionId: bigint, audioUrl: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    enable2FA(username: string, code: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAdminDashboardStats(callerUsername: string): Promise<AdminDashboardStats>;
    getAudioBlob(questionId: bigint): Promise<Uint8Array | null>;
    getMasteryForTest(username: string, testId: TestId): Promise<Array<QuestionMastery>>;
    getQuestion(questionId: bigint): Promise<Question | null>;
    getSection(sectionId: bigint): Promise<Section | null>;
    getTest(testId: bigint): Promise<Test | null>;
    getTestProgress(username: string, testId: bigint, sessionId: string): Promise<TestProgress | null>;
    getTestResult(username: string, testId: bigint): Promise<TestResult | null>;
    getTestResultBySession(username: string, testId: bigint, sessionId: string): Promise<TestResult | null>;
    getTestReview(username: string, testId: bigint, sessionId: string): Promise<ReviewData | null>;
    getTwoFAStatus(username: string): Promise<boolean>;
    getUserProgress(username: UserId): Promise<UserDetailedProgress>;
    getUserRole(username: string): Promise<UserRole | null>;
    listActiveTestSessions(username: string): Promise<Array<SessionInfo>>;
    listMyTestResults(username: string): Promise<Array<TestResult>>;
    listQuestionsForTest(testId: bigint): Promise<Array<Question>>;
    listSectionsForTest(testId: bigint): Promise<Array<Section>>;
    listTests(): Promise<Array<Test>>;
    login(username: string, password: string): Promise<LoginResult>;
    register(username: string, password: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    resetMyMastery(username: string, input: ResetMasteryInput): Promise<void>;
    saveTestProgress(username: string, testId: bigint, sessionId: string, answers: Array<AnswerSubmission>): Promise<void>;
    setup2FA(username: string): Promise<{
        __kind__: "ok";
        ok: [string, string];
    } | {
        __kind__: "err";
        err: string;
    }>;
    submitTestAnswers(username: string, testId: bigint, sessionId: string, submissions: Array<AnswerSubmission>, timeSpentSeconds: bigint): Promise<TestResult>;
    updatePassword(username: string, currentPassword: string, newPassword: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateProfile(username: string, displayName: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateQuestion(username: string, questionId: bigint, input: UpdateQuestionInput): Promise<Question | null>;
    updateSection(username: string, sectionId: bigint, input: UpdateSectionInput): Promise<Section | null>;
    updateTest(username: string, testId: bigint, input: UpdateTestInput): Promise<Test | null>;
    verifyTOTPLogin(username: string, code: string): Promise<{
        __kind__: "ok";
        ok: UserSession;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
