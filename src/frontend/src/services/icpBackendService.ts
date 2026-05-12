/**
 * ICP backend service implementation.
 *
 * Wraps the raw backendInterface actor returned by useActor and exposes it as
 * a BackendService. Every method is a direct passthrough — no logic changes.
 * This is the only file that imports from the raw actor layer.
 */
import type { backendInterface } from "../backend";
import type { BackendService } from "./backendService";

/**
 * Creates a BackendService that delegates every call to the provided actor.
 * Called inside useBackend() so consumers never touch the actor directly.
 */
export function createIcpBackendService(
  actor: backendInterface,
): BackendService {
  return {
    // ── Auth ────────────────────────────────────────────────────────────────
    login: (username, password) => actor.login(username, password),
    register: (username, password) => actor.register(username, password),
    verifyTOTPLogin: (username, code) => actor.verifyTOTPLogin(username, code),
    getUserRole: (username) => actor.getUserRole(username),

    // ── Profile ─────────────────────────────────────────────────────────────
    updatePassword: (username, currentPassword, newPassword) =>
      actor.updatePassword(username, currentPassword, newPassword),
    updateProfile: (username, displayName) =>
      actor.updateProfile(username, displayName),

    // ── 2FA ─────────────────────────────────────────────────────────────────
    getTwoFAStatus: (username) => actor.getTwoFAStatus(username),
    setup2FA: (username) => actor.setup2FA(username),
    enable2FA: (username, code) => actor.enable2FA(username, code),
    disable2FA: (username, password, code) =>
      actor.disable2FA(username, password, code),

    // ── Tests ───────────────────────────────────────────────────────────────
    listTests: () => actor.listTests(),
    getTest: (testId) => actor.getTest(testId),
    createTest: (username, input) => actor.createTest(username, input),
    updateTest: (username, testId, input) =>
      actor.updateTest(username, testId, input),
    deleteTest: (username, testId) => actor.deleteTest(username, testId),

    // ── Sections ────────────────────────────────────────────────────────────
    listSectionsForTest: (testId) => actor.listSectionsForTest(testId),
    getSection: (sectionId) => actor.getSection(sectionId),
    createSection: (username, testId, input) =>
      actor.createSection(username, testId, input),
    updateSection: (username, sectionId, input) =>
      actor.updateSection(username, sectionId, input),
    deleteSection: (username, sectionId) =>
      actor.deleteSection(username, sectionId),

    // ── Questions ───────────────────────────────────────────────────────────
    listQuestionsForTest: (testId) => actor.listQuestionsForTest(testId),
    getQuestion: (questionId) => actor.getQuestion(questionId),
    addQuestion: (username, testId, input) =>
      actor.addQuestion(username, testId, input),
    updateQuestion: (username, questionId, input) =>
      actor.updateQuestion(username, questionId, input),
    deleteQuestion: (username, questionId) =>
      actor.deleteQuestion(username, questionId),

    // ── Test sessions & results ──────────────────────────────────────────────
    listActiveTestSessions: (username) =>
      actor.listActiveTestSessions(username),
    getTestProgress: (username, testId, sessionId) =>
      actor.getTestProgress(username, testId, sessionId),
    saveTestProgress: (username, testId, sessionId, answers) =>
      actor.saveTestProgress(username, testId, sessionId, answers),
    submitTestAnswers: (
      username,
      testId,
      sessionId,
      submissions,
      timeSpentSeconds,
    ) =>
      actor.submitTestAnswers(
        username,
        testId,
        sessionId,
        submissions,
        timeSpentSeconds,
      ),
    getTestResult: (username, testId) => actor.getTestResult(username, testId),
    getTestResultBySession: (username, testId, sessionId) =>
      actor.getTestResultBySession(username, testId, sessionId),

    // ── Mastery ──────────────────────────────────────────────────────────────
    getMasteryForTest: (username, testId) =>
      actor.getMasteryForTest(username, BigInt(testId)),
    resetMyMastery: async (username, testId) =>
      actor.resetMyMastery(username, { testId: BigInt(testId) }),

    // ── Admin: User Management ───────────────────────────────────────────────
    adminListUsers: (username) => actor.adminListUsers(username),
    adminActivateUser: (adminUsername, targetUsername) =>
      actor.adminActivateUser(adminUsername, targetUsername),
    adminDeactivateUser: (adminUsername, targetUsername) =>
      actor.adminDeactivateUser(adminUsername, targetUsername),
    adminDeleteUser: async (adminUsername, targetUsername) => {
      // Cast: the backend exposes adminDeleteUser but bindgen may not have
      // reflected it yet. Safe to call — method exists on the canister.
      const a = actor as typeof actor & {
        adminDeleteUser: (
          caller: string,
          target: string,
        ) => Promise<
          { __kind__: "ok"; ok: null } | { __kind__: "err"; err: string }
        >;
      };
      return a.adminDeleteUser(adminUsername, targetUsername);
    },
    adminGetUserProgress: async (adminUsername, targetUsername, testId) => {
      const result = await actor.adminGetUserProgress(
        adminUsername,
        targetUsername,
        BigInt(testId),
      );
      return result ?? null;
    },
    adminResetUserMastery: (adminUsername, targetUsername, testId) =>
      actor.adminResetUserMastery(adminUsername, targetUsername, {
        testId: BigInt(testId),
      }),

    // ── Admin: Dashboard Stats ───────────────────────────────────────────────
    getAdminDashboardStats: (adminUsername) =>
      actor.getAdminDashboardStats(adminUsername),

    // ── Test History ─────────────────────────────────────────────────────────
    listMyTestResults: (username) => actor.listMyTestResults(username),

    // ── Test Review ──────────────────────────────────────────────────────────
    getTestReview: async (username, testId, sessionId) => {
      const result = await actor.getTestReview(
        username,
        BigInt(testId),
        sessionId,
      );
      return result ?? null;
    },
    // ── Data Sync ─────────────────────────────────────────────────────────────
    getDataManifest: () => actor.getDataManifest(),
    getAllTestData: () => actor.getAllTestData(),
  };
}
