import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  Link,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  RotateCcw,
  Star,
  Trophy,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { RichTextDisplay } from "../../components/RichTextDisplay";
import { useDataSyncContext } from "../../context/DataSyncContext";
import { useAuth } from "../../hooks/useAuth";
import { useBackend } from "../../hooks/useBackend";
import { QuestionType } from "../../types";
import type {
  Question,
  QuestionMastery,
  SectionResult,
  Test,
  TestResult,
} from "../../types";
import { getBookmarks, toggleBookmark } from "../../utils/bookmarkStorage";
import {
  generateSessionId,
  loadCompletedSessionSnapshot,
  loadSession,
} from "../../utils/testSessions";

export function TestResultPage() {
  const { testId } = useParams({ from: "/tests/$testId/result" });
  const navigate = useNavigate();
  const { session, isAdmin } = useAuth();
  const backend = useBackend();
  const username = session?.username ?? "";
  const testIdBig = BigInt(testId);
  const searchParams = useSearch({ strict: false }) as Record<string, string>;
  const urlSessionId = searchParams?.sessionId ?? "";
  const { getTest: getCachedTest, getQuestions: getCachedQuestions } =
    useDataSyncContext();

  // Load the completed session snapshot first (saved just before submit in TakeTestPage).
  // Falls back to the active session for backward compatibility (old sessions before snapshot was added).
  const completedSnapshot = urlSessionId
    ? loadCompletedSessionSnapshot(urlSessionId)
    : null;
  const originalSession = completedSnapshot
    ? null
    : urlSessionId
      ? loadSession(urlSessionId)
      : null;
  // Question IDs stored in the session — used to replay the exact same question set
  const replayQuestionIds =
    completedSnapshot?.questionIds ?? originalSession?.questionIds ?? [];
  const sessionRandomizeQuestions =
    completedSnapshot?.randomizeQuestions ??
    originalSession?.randomizeQuestions ??
    true;
  const sessionRandomizeAnswers =
    completedSnapshot?.randomizeAnswers ??
    originalSession?.randomizeAnswers ??
    true;
  const sessionSelectedSectionIds =
    completedSnapshot?.selectedSectionIds ??
    originalSession?.selectedSectionIds ??
    [];

  const { data: result, isLoading: resultLoading } =
    useQuery<TestResult | null>({
      queryKey: ["testResult", testId, username],
      queryFn: async () => {
        if (!backend) return null;
        return backend.getTestResult(username, testIdBig);
      },
      enabled: !!backend,
    });

  const { data: questions = [] } = useQuery<Question[]>({
    queryKey: ["questions", testId],
    queryFn: async () => {
      const cachedQs = getCachedQuestions(testId);
      if (cachedQs.length > 0) {
        return cachedQs
          .map((q) => ({
            id: BigInt(q.id),
            testId: BigInt(q.testId),
            orderIndex: BigInt(q.orderIndex),
            text: q.text,
            questionType: q.questionType as Question["questionType"],
            options: q.options,
            correctAnswers: q.correctAnswers.map(BigInt),
            correctText: q.correctText,
            correctOrder: q.correctOrder.map(BigInt),
            sectionId: q.sectionId != null ? BigInt(q.sectionId) : undefined,
            questionUpdatedAt: BigInt(q.questionUpdatedAt),
            explanation: q.explanation ?? undefined,
          }))
          .sort((a, b) => Number(a.orderIndex) - Number(b.orderIndex));
      }
      if (!backend) return [];
      const qs = await backend.listQuestionsForTest(testIdBig);
      return qs.sort((a, b) => Number(a.orderIndex) - Number(b.orderIndex));
    },
    enabled: true,
  });

  const { data: test } = useQuery<Test | null>({
    queryKey: ["test", testId],
    queryFn: async () => {
      const cached = getCachedTest(testId);
      if (cached) {
        return {
          id: BigInt(cached.id),
          name: cached.name,
          description: cached.description,
          updatedAt: BigInt(cached.updatedAt),
          createdAt: BigInt(0),
        };
      }
      if (!backend) return null;
      return backend.getTest(testIdBig);
    },
    enabled: true,
  });

  const { data: masteryList = [] } = useQuery<QuestionMastery[]>({
    queryKey: ["mastery", testId, username],
    queryFn: async () => {
      if (!backend || !username) return [];
      try {
        return await backend.getMasteryForTest(username, Number(testId));
      } catch {
        return [];
      }
    },
    enabled: !!backend && !!username,
  });

  const masteryMap = new Map(masteryList.map((m) => [String(m.questionId), m]));

  // ── Bookmark panel state ─────────────────────────────────────────────────────
  const [bookmarkIds, setBookmarkIds] = useState<Set<string>>(() =>
    username ? getBookmarks(username, testId) : new Set<string>(),
  );
  const [bookmarkOpen, setBookmarkOpen] = useState(true);

  const bookmarkedQuestions = questions.filter((q) =>
    bookmarkIds.has(String(q.id)),
  );

  function handleRemoveBookmark(questionId: string) {
    if (!username) return;
    toggleBookmark(username, testId, Number(questionId));
    setBookmarkIds(getBookmarks(username, testId));
  }

  if (resultLoading) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-12 space-y-4"
        data-ocid="result.loading_state"
      >
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!result) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-12 text-center"
        data-ocid="result.error_state"
      >
        <p className="text-muted-foreground mb-4">Result not found.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/tests">
            <Button variant="outline" data-ocid="result.back_tests_button">
              Back to Practice Tests
            </Button>
          </Link>
          {isAdmin && (
            <Link to="/admin">
              <Button data-ocid="result.back_admin_button">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Admin Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  const score = Number(result.score);
  const total = Number(result.totalQuestions);
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  function getGrade(): { label: string; colorClass: string } {
    if (percentage >= 90)
      return { label: "Excellent!", colorClass: "text-accent" };
    if (percentage >= 75)
      return { label: "Good job!", colorClass: "text-primary" };
    if (percentage >= 60)
      return {
        label: "Keep practicing",
        colorClass: "text-secondary-foreground",
      };
    return { label: "Needs improvement", colorClass: "text-destructive" };
  }

  const grade = getGrade();
  const qMap = new Map(questions.map((q) => [String(q.id), q]));

  // Only show questions the user got wrong
  const incorrectResults = result.questionResults.filter((qr) => !qr.isCorrect);
  // Correct results for mastery display
  const correctResults = result.questionResults.filter((qr) => qr.isCorrect);

  // Section results (may be empty for legacy/no-section tests)
  const sectionResultsList: SectionResult[] = Array.isArray(
    result?.sectionResults,
  )
    ? result.sectionResults
    : [];
  const hasSectionResults = sectionResultsList.length > 0;

  // Build a map from sectionId (bigint) -> sectionName for breakdown labels
  const sectionMap = hasSectionResults
    ? new Map<bigint, string>(
        sectionResultsList.map((sr) => [sr.sectionId, sr.sectionName]),
      )
    : new Map<bigint, string>();

  /**
   * Render the correct answer as a React element using RichTextDisplay.
   * Handles MC (individual options), textInput (correctText), and dragOrder (ordered items).
   */
  function renderCorrectAnswer(
    q: Question,
    className = "text-sm font-medium text-accent",
  ) {
    if (q.questionType === QuestionType.textInput) {
      return (
        <RichTextDisplay
          html={q.correctText || "\u2014"}
          className={className}
        />
      );
    }
    if (
      q.questionType === QuestionType.mcSingle ||
      q.questionType === QuestionType.mcMulti
    ) {
      const correctOpts = q.correctAnswers
        .map((idx) => q.options[Number(idx)])
        .filter(Boolean);
      if (correctOpts.length === 0)
        return <span className={className}>&#8212;</span>;
      return (
        <div className="space-y-0.5">
          {correctOpts.map((opt) => (
            <RichTextDisplay key={opt} html={opt} className={className} />
          ))}
        </div>
      );
    }
    if (q.questionType === QuestionType.dragOrder) {
      const orderedOpts = q.correctOrder
        .map((idx) => q.options[Number(idx)])
        .filter(Boolean);
      if (orderedOpts.length === 0)
        return <span className={className}>&#8212;</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {orderedOpts.map((opt, i) => (
            <span
              key={opt}
              className="inline-flex items-center gap-1 text-xs bg-accent/15 text-accent px-2 py-0.5 rounded"
            >
              <span className="font-bold">{i + 1}.</span>
              <RichTextDisplay html={opt} className="inline" />
            </span>
          ))}
        </div>
      );
    }
    return <span className={className}>&#8212;</span>;
  }

  function getSectionName(q: Question): string | null {
    // Always attribute unsectioned questions to the virtual "Uncategorised" section
    // when any section results exist (so the section breakdown is complete)
    const qSectionId = (q as Question & { sectionId?: bigint }).sectionId;
    if (qSectionId == null) {
      return hasSectionResults ? "Uncategorised" : null;
    }
    if (!hasSectionResults) return null;
    return sectionMap.get(qSectionId) ?? null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Try Again — at the TOP */}
      <div className="mb-6">
        <Button
          className="w-full gap-2"
          onClick={() =>
            navigate({
              to: "/tests/$testId",
              params: { testId },
              search:
                replayQuestionIds.length > 0
                  ? {
                      // Generate a fresh session ID so the replay is independent of the old session.
                      sessionId: generateSessionId(),
                      randomizeQuestions: String(sessionRandomizeQuestions),
                      randomizeAnswers: String(sessionRandomizeAnswers),
                      sections: sessionSelectedSectionIds?.length
                        ? sessionSelectedSectionIds.join(",")
                        : "",
                      questionIds: replayQuestionIds.join(","),
                    }
                  : {
                      randomizeQuestions: "true",
                      randomizeAnswers: "true",
                      sections: "",
                    },
            })
          }
          data-ocid="result.try_again_top_button"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
      {/* Bookmarked Questions Panel */}
      {bookmarkedQuestions.length > 0 && (
        <div className="mb-6" data-ocid="result.bookmarks.panel">
          <button
            type="button"
            onClick={() => setBookmarkOpen((v) => !v)}
            className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl border border-border bg-card shadow-subtle hover:bg-muted/30 transition-colors"
            aria-expanded={bookmarkOpen}
            data-ocid="result.bookmarks.toggle"
          >
            <div className="flex items-center gap-2.5">
              <BookmarkCheck className="w-4 h-4 text-accent" />
              <span className="font-display font-semibold text-foreground text-sm">
                Bookmarked Questions
              </span>
              <span className="question-count-badge">
                {bookmarkedQuestions.length}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                bookmarkOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {bookmarkOpen && (
            <div className="mt-2 space-y-3" data-ocid="result.bookmarks.list">
              {bookmarkedQuestions.map((q, idx) => {
                const qSectionName = getSectionName(q);
                return (
                  <Card
                    key={String(q.id)}
                    className="border-accent/20 shadow-subtle overflow-hidden"
                    data-ocid={`result.bookmarks.item.${idx + 1}`}
                  >
                    <CardHeader className="pb-3 border-b border-border bg-accent/5 px-5 pt-4">
                      <div className="flex items-start gap-3">
                        <BookmarkCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Question {idx + 1}
                            </span>
                            {qSectionName && (
                              <Badge
                                variant="outline"
                                className="text-xs text-muted-foreground border-border"
                              >
                                {qSectionName}
                              </Badge>
                            )}
                          </div>
                          <RichTextDisplay
                            html={q.text}
                            className="text-sm font-medium leading-relaxed"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveBookmark(String(q.id))}
                          className="bookmark-toggle bookmarked shrink-0"
                          aria-label="Remove bookmark"
                          data-ocid={`result.bookmarks.remove_button.${idx + 1}`}
                        >
                          <Bookmark className="w-4 h-4" fill="currentColor" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pt-3 pb-4 space-y-3">
                      {/* User answer */}
                      {(() => {
                        const qr = result.questionResults.find(
                          (r) => String(r.questionId) === String(q.id),
                        );
                        if (!qr) return null;
                        const correct = renderCorrectAnswer(q);
                        return (
                          <>
                            <div
                              className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border ${
                                qr.isCorrect
                                  ? "bg-accent/10 border-accent/30"
                                  : "bg-destructive/10 border-destructive/30"
                              }`}
                            >
                              {qr.isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 shrink-0 text-accent mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 shrink-0 text-destructive mt-0.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <span
                                  className={`text-xs font-semibold uppercase tracking-wide block mb-0.5 ${
                                    qr.isCorrect
                                      ? "text-accent"
                                      : "text-destructive"
                                  }`}
                                >
                                  Your answer
                                </span>
                                <span className="text-sm text-foreground">
                                  {qr.isCorrect ? correct : "Incorrect"}
                                </span>
                              </div>
                            </div>
                            {!qr.isCorrect && (
                              <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-accent/10 border border-accent/30">
                                <CheckCircle2 className="w-4 h-4 shrink-0 text-accent mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-0.5">
                                    Correct answer
                                  </span>
                                  {correct}
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                      {/* Explanation */}
                      {q.explanation && (
                        <div className="explanation-card">
                          <div className="explanation-label">Explanation</div>
                          <div className="explanation-text">
                            <RichTextDisplay html={q.explanation} />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Score Hero */}
      <Card
        className="shadow-subtle mb-6 overflow-hidden"
        data-ocid="result.score.card"
      >
        <div className="bg-primary/5 border-b border-border px-6 py-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Test Complete!
          </h1>
          <p className="text-muted-foreground text-sm">{test?.name}</p>
        </div>
        <CardContent className="pt-6 pb-6">
          <div className="text-center mb-6">
            <div className="font-display text-5xl font-bold text-foreground mb-1">
              {percentage}%
            </div>
            <p className={`font-semibold text-lg ${grade.colorClass}`}>
              {grade.label}
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              You answered <strong className="text-foreground">{score}</strong>{" "}
              out of <strong className="text-foreground">{total}</strong>{" "}
              questions correctly
            </p>
          </div>
          <Progress value={percentage} className="h-3 rounded-full" />
        </CardContent>
      </Card>

      {/* Mastery progress summary */}
      {masteryList.length > 0 && (
        <div className="mb-6" data-ocid="result.mastery.panel">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-primary" />
            <h2 className="font-display font-semibold text-foreground text-sm uppercase tracking-wide">
              Mastery Progress
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Mastered",
                count: masteryList.filter((m) => m.isMastered).length,
                colorClass: "text-accent",
                bg: "bg-accent/5 border-accent/20",
              },
              {
                label: "Streak 4",
                count: masteryList.filter(
                  (m) => !m.isMastered && Number(m.correctStreak) === 4,
                ).length,
                colorClass: "text-primary",
                bg: "bg-primary/5 border-primary/20",
              },
              {
                label: "In Progress",
                count: masteryList.filter(
                  (m) =>
                    !m.isMastered &&
                    Number(m.correctStreak) > 0 &&
                    Number(m.correctStreak) < 4,
                ).length,
                colorClass: "text-foreground",
                bg: "bg-muted/40 border-border",
              },
              {
                label: "Not Started",
                count: masteryList.filter((m) => Number(m.correctStreak) === 0)
                  .length,
                colorClass: "text-muted-foreground",
                bg: "bg-muted/20 border-border",
              },
            ].map(({ label, count, colorClass, bg }) => (
              <div
                key={label}
                className={`flex flex-col items-center px-3 py-3 rounded-lg border ${bg}`}
              >
                <span
                  className={`font-display text-2xl font-bold ${colorClass}`}
                >
                  {count}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {label}
                </span>
              </div>
            ))}
          </div>
          {correctResults.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Questions answered correctly this session contribute toward
              mastery (5 correct answers in a row to master).
            </p>
          )}
        </div>
      )}

      {/* Per-section score breakdown */}
      {hasSectionResults && (
        <div className="mb-8" data-ocid="result.sections.panel">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-display font-semibold text-foreground text-sm uppercase tracking-wide">
              Section Scores
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {sectionResultsList.map((sr: SectionResult, idx: number) => {
              const secPct =
                Number(sr.totalQuestions) > 0
                  ? Math.round(
                      (Number(sr.score) / Number(sr.totalQuestions)) * 100,
                    )
                  : 0;
              return (
                <div
                  key={String(sr.sectionId)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card"
                  data-ocid={`result.section.item.${idx + 1}`}
                >
                  <span className="text-sm font-medium text-foreground truncate min-w-0 mr-2">
                    {sr.sectionName}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm text-muted-foreground">
                      {Number(sr.score)} / {Number(sr.totalQuestions)}
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        secPct >= 75
                          ? "text-accent border-accent/30 bg-accent/5"
                          : secPct >= 60
                            ? "text-primary border-primary/30 bg-primary/5"
                            : "text-destructive border-destructive/30 bg-destructive/5"
                      }
                    >
                      {secPct}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Total row */}
          <div className="flex items-center justify-between px-4 py-3 mt-2 rounded-lg border border-border bg-muted/40">
            <span className="text-sm font-semibold text-foreground">Total</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {score} / {total}
              </span>
              <Badge
                variant="outline"
                className={
                  percentage >= 75
                    ? "text-accent border-accent/30 bg-accent/5"
                    : percentage >= 60
                      ? "text-primary border-primary/30 bg-primary/5"
                      : "text-destructive border-destructive/30 bg-destructive/5"
                }
              >
                {percentage}%
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Per-question breakdown — incorrect answers only */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-foreground">
            Question Breakdown
          </h2>
          {incorrectResults.length === 0 ? (
            <Badge className="gap-1.5 bg-accent/10 text-accent border-accent/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              All correct!
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="gap-1.5 text-destructive border-destructive/30"
            >
              <XCircle className="w-3.5 h-3.5" />
              {incorrectResults.length} incorrect
            </Badge>
          )}
        </div>

        {incorrectResults.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-10 rounded-xl border border-accent/20 bg-accent/5 text-center"
            data-ocid="result.breakdown_list.empty_state"
          >
            <CheckCircle2 className="w-10 h-10 text-accent mb-3" />
            <p className="font-semibold text-foreground">
              Perfect score \u2014 no mistakes!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              You answered every question correctly.
            </p>
          </div>
        ) : (
          <div className="space-y-4" data-ocid="result.breakdown_list">
            {incorrectResults.map((qr, idx) => {
              const q = qMap.get(String(qr.questionId));
              const isMultiCorrect =
                q?.questionType === QuestionType.mcMulti ||
                q?.questionType === QuestionType.mcSingle;
              const correctIdxSet = new Set(
                q?.correctAnswers.map(Number) ?? [],
              );
              const sectionName = q ? getSectionName(q) : null;

              return (
                <Card
                  key={String(qr.questionId)}
                  className="border-destructive/20 shadow-subtle overflow-hidden"
                  data-ocid={`result.question.item.${idx + 1}`}
                >
                  <CardHeader className="pb-3 border-b border-border bg-destructive/5 px-5 pt-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Question {idx + 1}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs text-destructive border-destructive/30"
                          >
                            Incorrect
                          </Badge>
                          {sectionName && (
                            <Badge
                              variant="outline"
                              className="text-xs text-muted-foreground border-border"
                              data-ocid={`result.question.section_badge.${idx + 1}`}
                            >
                              {sectionName}
                            </Badge>
                          )}
                          {/* Mastery streak badge */}
                          {q &&
                            (() => {
                              const m = masteryMap.get(String(q.id));
                              const streak = m ? Number(m.correctStreak) : 0;
                              return (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-muted-foreground border-border gap-1"
                                  data-ocid={`result.question.mastery_badge.${idx + 1}`}
                                >
                                  <Star className="w-2.5 h-2.5" />
                                  {streak}/5
                                </Badge>
                              );
                            })()}
                        </div>
                        {q ? (
                          <RichTextDisplay
                            html={q.text}
                            className="text-sm font-medium leading-relaxed"
                          />
                        ) : (
                          <p className="text-sm font-medium text-foreground leading-relaxed">
                            Question not found
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pt-4 pb-4 space-y-3">
                    {/* Answer options for MC questions */}
                    {q && isMultiCorrect && q.options.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Answer options
                        </p>
                        {q.options.map((opt, i) => {
                          const isCorrectOpt = correctIdxSet.has(i);
                          return (
                            <div
                              key={`opt-${i}-${opt}`}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm border transition-colors ${
                                isCorrectOpt
                                  ? "bg-accent/10 border-accent/30 text-accent font-medium"
                                  : "bg-muted/40 border-transparent text-muted-foreground"
                              }`}
                            >
                              {isCorrectOpt ? (
                                <CheckCircle2 className="w-4 h-4 shrink-0 text-accent" />
                              ) : (
                                <span className="w-4 h-4 shrink-0 rounded-full border border-border flex items-center justify-center text-xs text-muted-foreground">
                                  {i + 1}
                                </span>
                              )}
                              <RichTextDisplay
                                html={opt}
                                className="flex-1 min-w-0 text-sm"
                              />
                              {isCorrectOpt && (
                                <Badge className="ml-auto text-xs bg-accent/20 text-accent border-accent/30 shrink-0">
                                  Correct
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Correct answer for text/order questions */}
                    {q && !isMultiCorrect && (
                      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-accent/10 border border-accent/30">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-accent" />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-0.5">
                            Correct answer
                          </span>
                          {renderCorrectAnswer(q)}
                        </div>
                      </div>
                    )}

                    {/* Explanation */}
                    {q?.explanation && (
                      <div className="explanation-card">
                        <div className="explanation-label">Explanation</div>
                        <div className="explanation-text">
                          <RichTextDisplay html={q.explanation} />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={() =>
            navigate({
              to: "/tests/$testId/review",
              params: { testId },
              search: { sessionId: result.sessionId },
            })
          }
          data-ocid="result.review_button"
        >
          <ClipboardList className="w-4 h-4" />
          Review Answers
        </Button>
        <Link to="/tests" className="flex-1">
          <Button
            variant="outline"
            className="w-full gap-2"
            data-ocid="result.back_tests_button"
          >
            All Tests
          </Button>
        </Link>
        {isAdmin && (
          <Link to="/admin" className="flex-1">
            <Button className="w-full gap-2" data-ocid="result.home_button">
              <LayoutDashboard className="w-4 h-4" />
              Admin Dashboard
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
