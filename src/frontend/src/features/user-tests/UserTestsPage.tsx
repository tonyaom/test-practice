import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  ChevronRight,
  ClipboardList,
  HardDrive,
  History,
  Layers,
  LayoutDashboard,
  PlayCircle,
  RotateCcw,
  Shuffle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MasteryBadge } from "../../components/MasteryBadge";
import { useDataSyncContext } from "../../context/DataSyncContext";
import { useAuth } from "../../hooks/useAuth";
import { useBackend } from "../../hooks/useBackend";
import type { Section, Test, TestSession } from "../../types";
import type { CachedTest } from "../../utils/offlineCache";
import {
  clearAllCache,
  getTestCache,
  isCacheValid,
  saveTestCache,
} from "../../utils/offlineCache";
import {
  generateSessionId,
  isAtCapacity,
  loadActiveSessions,
  loadSession,
  saveSession,
} from "../../utils/testSessions";

/** Convert a CachedTest to a minimal Test shape the modal understands. */
function cachedTestToTest(ct: CachedTest): Test {
  return {
    id: BigInt(ct.id),
    name: ct.name,
    description: ct.description,
    updatedAt: BigInt(ct.updatedAt),
    createdAt: BigInt(0),
  };
}

interface StartTestModalProps {
  test: Test;
  onClose: () => void;
}

function StartTestModal({ test, onClose }: StartTestModalProps) {
  const navigate = useNavigate();
  const backend = useBackend();
  const { session } = useAuth();
  const username = session?.username ?? "";
  const { getSections, getQuestions } = useDataSyncContext();
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [randomizeAnswers, setRandomizeAnswers] = useState(true);
  /** "sections" = pick specific sections; "entire" = whole test */
  const [practiceMode, setPracticeMode] = useState<"sections" | "entire">(
    "sections",
  );
  const entireTest = practiceMode === "entire";
  const [selectedSectionIds, setSelectedSectionIds] = useState<number[]>([]);
  const [existingSession, setExistingSession] = useState<TestSession | null>(
    null,
  );
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [preloading, setPreloading] = useState(false);
  const [resettingSectionId, setResettingSectionId] = useState<bigint | null>(
    null,
  );

  useEffect(() => {
    const sessions = loadActiveSessions();
    const found = sessions.find((s) => s.testId === String(test.id)) ?? null;
    setExistingSession(found);
  }, [test.id]);

  // Read sections/questions from cache (no backend calls needed)
  const cachedSections = getSections(String(test.id));
  const sectionsLoading = false;
  // Convert CachedSection[] to Section[]-compatible shape for downstream code
  const sections: Section[] = cachedSections.map((cs) => ({
    id: BigInt(cs.id),
    testId: BigInt(cs.testId),
    name: cs.name,
    description: cs.description,
    updatedAt: BigInt(cs.updatedAt),
    createdAt: BigInt(0),
  }));

  const cachedQuestions = getQuestions(String(test.id));
  // Convert CachedQuestion[] to Question[]-compatible shape for counts
  const allQuestions = cachedQuestions.map((cq) => ({
    id: BigInt(cq.id),
    sectionId: cq.sectionId != null ? BigInt(cq.sectionId) : undefined,
  }));

  // Pre-select all sections once they are loaded
  // biome-ignore lint/correctness/useExhaustiveDependencies: only run when sections first load
  useEffect(() => {
    if (sections.length === 0) return;
    // Build the full list of section IDs (including uncategorised if needed)
    const ids = sections.map((s) => Number(s.id));
    setSelectedSectionIds(ids);
    // Switch to sections mode when sections first load
  }, [sections.length]);

  /** Count questions that belong to a given section */
  function sectionQuestionCount(sectionId: bigint): number {
    return allQuestions.filter(
      (q) => q.sectionId != null && BigInt(Number(q.sectionId)) === sectionId,
    ).length;
  }

  /** Count questions with no section assignment */
  const uncategorisedCount = allQuestions.filter(
    (q) => q.sectionId == null,
  ).length;

  /** Sentinel ID used to represent the virtual Uncategorised section in URL params */
  const UNCATEGORISED_ID = -1;

  function toggleSection(id: bigint) {
    const numId = Number(id);
    setSelectedSectionIds((prev) =>
      prev.includes(numId) ? prev.filter((x) => x !== numId) : [...prev, numId],
    );
  }

  function toggleUncategorised() {
    setSelectedSectionIds((prev) =>
      prev.includes(UNCATEGORISED_ID)
        ? prev.filter((x) => x !== UNCATEGORISED_ID)
        : [...prev, UNCATEGORISED_ID],
    );
  }

  function handleResetSectionMastery(sectionId: bigint) {
    if (!backend) return;
    setResettingSectionId(sectionId);
    backend
      .resetMyMastery(username, {
        testId: BigInt(test.id),
        ...(sectionId !== BigInt(-1) ? { sectionId } : {}),
      } as unknown as Parameters<typeof backend.resetMyMastery>[1])
      .then(() => {
        toast.success("Mastery reset for this section.");
      })
      .catch(() => {
        toast.error("Failed to reset section mastery.");
      })
      .finally(() => {
        setResettingSectionId(null);
      });
  }

  /** The final list of section IDs to pass to session: empty means entire test */
  function resolvedSectionIds(): number[] {
    if (entireTest) return [];
    return selectedSectionIds;
  }

  /**
   * Preload questions + sections into offline cache before navigating.
   * Checks updatedAt — skips if cache is already current.
   */
  async function preloadCache(): Promise<void> {
    if (!backend) return;
    try {
      const testIdStr = String(test.id);
      const serverUpdatedAt = String(test.updatedAt);
      const cached = getTestCache(testIdStr);
      if (cached && isCacheValid(cached.updatedAt, serverUpdatedAt)) return;

      const [questions, sects] = await Promise.all([
        backend.listQuestionsForTest(BigInt(test.id)),
        backend.listSectionsForTest(BigInt(test.id)),
      ]);

      // Fetch mastery if logged in (best-effort, don't block start)
      let mastery: Array<{
        questionId: bigint;
        correctStreak: bigint;
        isMastered: boolean;
      }> = [];
      try {
        mastery = await backend.getMasteryForTest(username, Number(test.id));
      } catch {
        // ignore
      }
      const masteryMap = new Map(mastery.map((m) => [String(m.questionId), m]));

      saveTestCache(
        testIdStr,
        {
          test: {
            id: testIdStr,
            name: test.name,
            description: test.description,
            updatedAt: serverUpdatedAt,
          },
          questions: questions.map((q) => ({
            id: String(q.id),
            testId: String(q.testId),
            orderIndex: String(q.orderIndex),
            text: q.text,
            questionType: q.questionType,
            options: q.options,
            correctAnswers: q.correctAnswers.map(String),
            correctText: q.correctText,
            correctOrder: q.correctOrder.map(String),
            sectionId: q.sectionId != null ? String(q.sectionId) : undefined,
            questionUpdatedAt: String(q.questionUpdatedAt),
            isMastered: masteryMap.get(String(q.id))?.isMastered ?? false,
            correctStreak: String(
              masteryMap.get(String(q.id))?.correctStreak ?? 0,
            ),
          })),
          sections: sects.map((s) => ({
            id: String(s.id),
            testId: String(s.testId),
            name: s.name,
            description: s.description,
            updatedAt: String(s.updatedAt),
          })),
          updatedAt: serverUpdatedAt,
        },
        serverUpdatedAt,
      );
    } catch {
      // Cache write failure is non-fatal — continue with normal flow
    }
  }

  async function startFresh() {
    if (isAtCapacity() && !existingSession) return;
    setPreloading(true);
    await preloadCache();
    setPreloading(false);
    const sectionIds = resolvedSectionIds();
    const sessionId = generateSessionId();
    saveSession({
      sessionId,
      testId: String(test.id),
      testName: test.name,
      startedAt: new Date().toISOString(),
      randomizeQuestions,
      randomizeAnswers,
      selectedSectionIds: sectionIds,
    });
    navigate({
      to: "/tests/$testId",
      params: { testId: String(test.id) },
      search: {
        sessionId,
        randomizeQuestions: randomizeQuestions ? "true" : "false",
        randomizeAnswers: randomizeAnswers ? "true" : "false",
        sections: sectionIds.join(","),
      },
    });
    onClose();
  }

  function continueExisting() {
    if (!existingSession) return;
    navigate({
      to: "/tests/$testId",
      params: { testId: existingSession.testId },
      search: {
        sessionId: existingSession.sessionId,
        randomizeQuestions: existingSession.randomizeQuestions
          ? "true"
          : "false",
        randomizeAnswers: existingSession.randomizeAnswers ? "true" : "false",
        sections: existingSession.selectedSectionIds.join(","),
      },
    });
    onClose();
  }

  function handleStart() {
    if (existingSession) {
      setShowConflictDialog(true);
      return;
    }
    startFresh();
  }

  const canStart = entireTest || selectedSectionIds.length > 0;

  // Compute total selected question count for badge
  const selectedTotalCount =
    practiceMode === "entire"
      ? allQuestions.length
      : selectedSectionIds.reduce((sum, sid) => {
          if (sid === UNCATEGORISED_ID) return sum + uncategorisedCount;
          const sec = sections.find((s) => Number(s.id) === sid);
          return sec ? sum + sectionQuestionCount(sec.id) : sum;
        }, 0);

  return (
    <>
      <Dialog open onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md" data-ocid="start_test.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              Start Test
            </DialogTitle>
            <p className="text-sm text-muted-foreground leading-relaxed pt-1">
              <span className="font-medium text-foreground">{test.name}</span>
              {test.description ? ` — ${test.description}` : ""}
            </p>
          </DialogHeader>

          <div className="py-4 border-y border-border space-y-5">
            {/* Group 1: What to practice */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                What to practice
              </p>
              {sections.length === 0 ? (
                <div className="text-sm text-muted-foreground pl-1">
                  No sections defined — the full test will be used.
                </div>
              ) : (
                <>
                  {/* Segmented control */}
                  <div
                    className="flex gap-1 p-1 bg-muted rounded-lg"
                    data-ocid="start_test.practice_mode.toggle"
                  >
                    <button
                      type="button"
                      onClick={() => setPracticeMode("entire")}
                      data-ocid="start_test.practice_mode.entire"
                      className={`flex-1 text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                        practiceMode === "entire"
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Entire Test
                      {practiceMode === "entire" && (
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          {allQuestions.length} Q
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPracticeMode("sections")}
                      data-ocid="start_test.practice_mode.sections"
                      className={`flex-1 text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                        practiceMode === "sections"
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Select Sections
                      {practiceMode === "sections" &&
                        selectedSectionIds.length > 0 && (
                          <span className="ml-1.5 text-xs text-muted-foreground">
                            {selectedSectionIds.length} section
                            {selectedSectionIds.length !== 1 ? "s" : ""} ·{" "}
                            {selectedTotalCount} Q
                          </span>
                        )}
                    </button>
                  </div>

                  {/* Section checklist — only shown in sections mode */}
                  {practiceMode === "sections" && (
                    <div
                      className="space-y-2.5 pl-1"
                      data-ocid="start_test.sections.list"
                    >
                      {sectionsLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-5 w-40" />
                        </div>
                      ) : (
                        <>
                          {sections.map((section, idx) => {
                            const qCount = sectionQuestionCount(section.id);
                            const isResetting =
                              resettingSectionId === section.id;
                            return (
                              <div
                                key={String(section.id)}
                                className="flex items-center gap-3"
                                data-ocid={`start_test.section.item.${idx + 1}`}
                              >
                                <Checkbox
                                  id={`section-${String(section.id)}`}
                                  checked={selectedSectionIds.includes(
                                    Number(section.id),
                                  )}
                                  onCheckedChange={() =>
                                    toggleSection(section.id)
                                  }
                                  data-ocid={`start_test.section.checkbox.${idx + 1}`}
                                />
                                <div className="flex-1 min-w-0">
                                  <Label
                                    htmlFor={`section-${String(section.id)}`}
                                    className="text-sm font-medium cursor-pointer"
                                  >
                                    {section.name}
                                  </Label>
                                  {section.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {section.description}
                                    </p>
                                  )}
                                </div>
                                <span
                                  className={`question-count-badge shrink-0 ${
                                    qCount === 0 ? "opacity-40" : ""
                                  }`}
                                  data-ocid={`start_test.section.question_count.${idx + 1}`}
                                  title={`${qCount} question${
                                    qCount !== 1 ? "s" : ""
                                  } in this section`}
                                >
                                  {qCount}&thinsp;Q
                                </span>
                                <button
                                  type="button"
                                  disabled={isResetting}
                                  onClick={() =>
                                    handleResetSectionMastery(section.id)
                                  }
                                  aria-label={`Reset mastery for ${section.name}`}
                                  title="Reset Master Question for this section"
                                  className="shrink-0 text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                                  data-ocid={`start_test.section.reset_mastery.${idx + 1}`}
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                          {/* Virtual Uncategorised section */}
                          {uncategorisedCount > 0 && (
                            <div
                              className="flex items-center gap-3"
                              data-ocid={`start_test.section.item.${sections.length + 1}`}
                            >
                              <Checkbox
                                id="section-uncategorised"
                                checked={selectedSectionIds.includes(
                                  UNCATEGORISED_ID,
                                )}
                                onCheckedChange={toggleUncategorised}
                                data-ocid={`start_test.section.checkbox.${sections.length + 1}`}
                              />
                              <div className="flex-1 min-w-0">
                                <Label
                                  htmlFor="section-uncategorised"
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  Uncategorised
                                </Label>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Questions not assigned to any section
                                </p>
                              </div>
                              <span
                                className="question-count-badge shrink-0"
                                data-ocid={`start_test.section.question_count.${sections.length + 1}`}
                                title={`${uncategorisedCount} question${uncategorisedCount !== 1 ? "s" : ""} with no section`}
                              >
                                {uncategorisedCount}&thinsp;Q
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Group 2: How to practice */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Shuffle className="w-3.5 h-3.5" />
                How to practice
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="randomize-questions"
                    checked={randomizeQuestions}
                    onCheckedChange={(v) => setRandomizeQuestions(!!v)}
                    data-ocid="start_test.randomize_questions.checkbox"
                  />
                  <div>
                    <Label
                      htmlFor="randomize-questions"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Randomize question order
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Questions appear in a different order each time
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="randomize-answers"
                    checked={randomizeAnswers}
                    onCheckedChange={(v) => setRandomizeAnswers(!!v)}
                    data-ocid="start_test.randomize_answers.checkbox"
                  />
                  <div>
                    <Label
                      htmlFor="randomize-answers"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Randomize answer choices
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Answer options are shuffled for each question
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              data-ocid="start_test.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStart}
              className="gap-2"
              disabled={!canStart || preloading}
              data-ocid="start_test.confirm_button"
            >
              {preloading ? (
                "Loading…"
              ) : (
                <>
                  Start Test
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Conflict dialog */}
      <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <DialogContent
          className="max-w-sm"
          data-ocid="start_test.conflict.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              Session in progress
            </DialogTitle>
            <p className="text-sm text-muted-foreground pt-1">
              You already have an active session for{" "}
              <span className="font-medium text-foreground">{test.name}</span>.
              Would you like to continue where you left off or start fresh?
            </p>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                setShowConflictDialog(false);
                onClose();
                startFresh();
              }}
              data-ocid="start_test.conflict.fresh_button"
            >
              Start Fresh
            </Button>
            <Button
              onClick={() => {
                setShowConflictDialog(false);
                continueExisting();
              }}
              className="gap-2"
              data-ocid="start_test.conflict.continue_button"
            >
              <PlayCircle className="w-4 h-4" />
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function UserTestsPage() {
  const backend = useBackend();
  const navigate = useNavigate();
  const { isAdmin, session } = useAuth();
  const username = session?.username ?? "";
  const { tests: cachedTests, isLoading, refreshData } = useDataSyncContext();
  // Convert CachedTest[] to Test[] for compatibility with modal and handlers
  const tests: Test[] = cachedTests.map(cachedTestToTest);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [capacityError, setCapacityError] = useState(false);
  const [activeSessions, setActiveSessions] = useState<TestSession[]>([]);
  const [resetConfirmTest, setResetConfirmTest] = useState<Test | null>(null);
  const [resetting, setResetting] = useState(false);
  const [clearCacheConfirm, setClearCacheConfirm] = useState(false);

  // Mastery data per test (best-effort, keyed by testId string)
  const { data: masteryByTest = {} } = useQuery<
    Record<string, { mastered: number; total: number }>
  >({
    queryKey: ["mastery-summary", username],
    queryFn: async () => {
      if (!backend || !username) return {};
      const result: Record<string, { mastered: number; total: number }> = {};
      for (const t of cachedTests) {
        try {
          const list = await backend.getMasteryForTest(username, Number(t.id));
          result[t.id] = {
            mastered: list.filter((m) => m.isMastered).length,
            total: list.length,
          };
        } catch {
          // skip
        }
      }
      return result;
    },
    enabled: !!backend && !!username && cachedTests.length > 0,
    staleTime: 60_000,
  });

  // Refresh active sessions on mount only; after modal closes, handleModalClose refreshes manually
  useEffect(() => {
    setActiveSessions(loadActiveSessions());
  }, []);

  function handleModalClose() {
    setSelectedTest(null);
    setActiveSessions(loadActiveSessions());
  }

  function handleStartTest(test: Test) {
    // Block if at 5 sessions AND there's no existing session for this test
    const existing = activeSessions.find((s) => s.testId === String(test.id));
    if (!existing && isAtCapacity()) {
      setCapacityError(true);
      return;
    }
    setCapacityError(false);
    setSelectedTest(test);
  }

  function handleContinueSession(session: TestSession) {
    const stored = loadSession(session.sessionId);
    if (!stored) return;
    navigate({
      to: "/tests/$testId",
      params: { testId: stored.testId },
      search: {
        sessionId: stored.sessionId,
        randomizeQuestions: stored.randomizeQuestions ? "true" : "false",
        randomizeAnswers: stored.randomizeAnswers ? "true" : "false",
        sections: stored.selectedSectionIds.join(","),
      },
    });
  }

  async function handleResetMastery(test: Test) {
    if (!backend) return;
    setResetting(true);
    try {
      await backend.resetMyMastery(username, Number(test.id));
      toast.success(
        `Mastery reset for "${test.name}" — all questions reset to 0 correct answers.`,
      );
    } catch {
      toast.error("Failed to reset mastery. Please try again.");
    } finally {
      setResetting(false);
      setResetConfirmTest(null);
    }
  }

  async function handleStartWeakQuestions(test: Test) {
    if (!backend || !username) return;
    if (
      isAtCapacity() &&
      !activeSessions.find((s) => s.testId === String(test.id))
    ) {
      setCapacityError(true);
      return;
    }
    try {
      const mastery = await backend.getMasteryForTest(
        username,
        Number(test.id),
      );
      const weakIds = mastery
        .filter((m) => !m.isMastered && Number(m.correctStreak) < 5)
        .map((m) => String(m.questionId));
      if (weakIds.length === 0) {
        toast.success("No weak questions — you're doing great!");
        return;
      }
      const sessionId = generateSessionId();
      saveSession({
        sessionId,
        testId: String(test.id),
        testName: test.name,
        startedAt: new Date().toISOString(),
        randomizeQuestions: true,
        randomizeAnswers: true,
        selectedSectionIds: [],
        questionIds: weakIds,
      });
      navigate({
        to: "/tests/$testId",
        params: { testId: String(test.id) },
        search: {
          sessionId,
          randomizeQuestions: "true",
          randomizeAnswers: "true",
          sections: "",
          questionIds: weakIds.join(","),
        },
      });
    } catch {
      toast.error("Failed to load weak questions. Please try again.");
    }
  }

  function handleClearCache() {
    clearAllCache();
    refreshData();
    toast.success("All cached test data cleared.");
    setClearCacheConfirm(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Practice Tests
          </h1>
          <p className="text-muted-foreground mt-1">
            Choose a test to start practicing
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link to="/tests/history">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-muted-foreground"
              data-ocid="user.tests.history_button"
            >
              <History className="w-4 h-4" />
              History
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setClearCacheConfirm(true)}
            className="gap-1.5 text-muted-foreground"
            data-ocid="user.tests.clear_cache_button"
          >
            <HardDrive className="w-4 h-4" />
            Clear Cache
          </Button>
          {isAdmin && (
            <Link to="/admin">
              <Button
                variant="outline"
                className="gap-2"
                data-ocid="user.tests.manage_button"
              >
                <LayoutDashboard className="w-4 h-4" />
                Manage Tests
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Capacity error banner */}
      {capacityError && (
        <div
          className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive"
          data-ocid="user.tests.capacity_error"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Too many tests in progress</p>
            <p className="text-xs mt-0.5 text-destructive/80">
              You have 5 tests in progress. Please complete or submit one before
              starting another.
            </p>
          </div>
        </div>
      )}

      {/* Tests in Progress section */}
      {activeSessions.length > 0 && (
        <div className="mb-8" data-ocid="user.tests.in_progress.section">
          <h2 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-primary" />
            Tests in Progress
            <Badge variant="secondary" className="text-xs">
              {activeSessions.length} / 5
            </Badge>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeSessions.map((session, idx) => (
              <Card
                key={session.sessionId}
                className="shadow-subtle border-primary/20 bg-primary/5 flex flex-col"
                data-ocid={`user.tests.in_progress.item.${idx + 1}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs text-muted-foreground">
                      In Progress
                    </span>
                  </div>
                  <CardTitle className="font-display text-sm line-clamp-2">
                    {session.testName}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Started{" "}
                    {new Date(session.startedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 mt-auto">
                  <Button
                    className="w-full gap-2"
                    size="sm"
                    onClick={() => handleContinueSession(session)}
                    data-ocid={`user.tests.in_progress.continue_button.${idx + 1}`}
                  >
                    <PlayCircle className="w-4 h-4" />
                    Continue
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          data-ocid="user.tests.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-subtle">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tests.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="user.tests.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-lg text-foreground mb-2">
            No tests available yet
          </h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            {isAdmin
              ? "No tests have been created yet. Head to the admin area to create your first test."
              : "No tests are available yet. Check back later or ask an admin to create some tests."}
          </p>
          {isAdmin && (
            <Link to="/admin">
              <Button className="gap-2" data-ocid="user.tests.go_admin_button">
                <LayoutDashboard className="w-4 h-4" />
                Go to Admin Area
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          data-ocid="user.tests.list"
        >
          {tests.map((test, idx) => {
            const hasActiveSession = activeSessions.some(
              (s) => s.testId === String(test.id),
            );
            const mastery = masteryByTest[String(test.id)];
            return (
              <Card
                key={String(test.id)}
                className={`shadow-subtle hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col ${
                  hasActiveSession ? "border-l-4 border-l-primary" : ""
                }`}
                data-ocid={`user.tests.item.${idx + 1}`}
              >
                <CardHeader className="pb-3 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <Badge
                      variant={hasActiveSession ? "default" : "secondary"}
                      className="text-xs shrink-0"
                    >
                      {hasActiveSession ? "In Progress" : "Practice"}
                    </Badge>
                  </div>
                  <CardTitle className="font-display text-base mt-3 line-clamp-2">
                    {test.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {test.description || "No description provided"}
                  </CardDescription>
                  {/* Mastery badge */}
                  {mastery ? (
                    <div className="mt-1.5">
                      <MasteryBadge
                        masteredCount={mastery.mastered}
                        totalCount={mastery.total}
                      />
                    </div>
                  ) : (
                    <Skeleton className="h-4 w-24 mt-1.5 rounded-full" />
                  )}
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <Button
                    className="w-full gap-2"
                    onClick={() => handleStartTest(test)}
                    data-ocid={`user.tests.start_button.${idx + 1}`}
                  >
                    {hasActiveSession ? (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        Resume →
                      </>
                    ) : (
                      <>
                        Start Test
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 text-muted-foreground text-xs"
                    onClick={() => handleStartWeakQuestions(test)}
                    data-ocid={`user.tests.weak_questions_button.${idx + 1}`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Practice Weak Questions
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 text-muted-foreground text-xs"
                    onClick={() => setResetConfirmTest(test)}
                    data-ocid={`user.tests.reset_mastery_button.${idx + 1}`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Master Question
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedTest && (
        <StartTestModal test={selectedTest} onClose={handleModalClose} />
      )}

      {/* Reset mastery confirmation dialog */}
      <Dialog
        open={!!resetConfirmTest}
        onOpenChange={(o) => !o && setResetConfirmTest(null)}
      >
        <DialogContent
          className="max-w-sm"
          data-ocid="user.tests.reset_mastery.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              Reset Master Question?
            </DialogTitle>
            <p className="text-sm text-muted-foreground pt-1">
              This will reset all mastery streaks in{" "}
              <strong className="text-foreground">
                "{resetConfirmTest?.name}"
              </strong>{" "}
              back to 0. Questions you have mastered will need to be answered
              correctly again to regain mastery. Are you sure?
            </p>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setResetConfirmTest(null)}
              data-ocid="user.tests.reset_mastery.cancel_button"
            >
              Cancel
            </Button>
            <Button
              disabled={resetting}
              onClick={() =>
                resetConfirmTest && handleResetMastery(resetConfirmTest)
              }
              data-ocid="user.tests.reset_mastery.confirm_button"
            >
              {resetting ? "Resetting…" : "Reset Mastery"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear cache confirmation dialog */}
      <Dialog
        open={clearCacheConfirm}
        onOpenChange={(o) => !o && setClearCacheConfirm(false)}
      >
        <DialogContent
          className="max-w-sm"
          data-ocid="user.tests.clear_cache.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Clear Cache?</DialogTitle>
            <p className="text-sm text-muted-foreground pt-1">
              All locally cached test data will be removed. Tests will reload
              fresh from the server next time you start one.
            </p>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setClearCacheConfirm(false)}
              data-ocid="user.tests.clear_cache.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleClearCache}
              data-ocid="user.tests.clear_cache.confirm_button"
            >
              Clear Cache
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
