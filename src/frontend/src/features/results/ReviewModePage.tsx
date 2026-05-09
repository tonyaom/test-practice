import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  LayoutDashboard,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { RichTextDisplay } from "../../components/RichTextDisplay";
import { useAuth } from "../../hooks/useAuth";
import { useBackend } from "../../hooks/useBackend";
import { QuestionType } from "../../types";
import type { ReviewData, ReviewQuestion } from "../../types";
import { getBookmarks, toggleBookmark } from "../../utils/bookmarkStorage";

export function ReviewModePage() {
  const { testId } = useParams({ from: "/tests/$testId/review" });
  // sessionId is passed as a search param: /tests/1/review?sessionId=abc
  const search = useSearch({ from: "/tests/$testId/review" }) as {
    sessionId?: string;
  };
  const sessionId = search.sessionId ?? "";

  const { session, isAdmin } = useAuth();
  const backend = useBackend();
  const username = session?.username ?? "";
  const testIdBig = BigInt(testId);

  const [currentIndex, setCurrentIndex] = useState(0);

  // ── Bookmark panel state ─────────────────────────────────────────────────────
  const [bookmarkIds, setBookmarkIds] = useState<Set<string>>(() =>
    username ? getBookmarks(username, testId) : new Set<string>(),
  );
  const [bookmarkOpen, setBookmarkOpen] = useState(true);

  function handleRemoveBookmark(questionId: string) {
    if (!username) return;
    toggleBookmark(username, testId, Number(questionId));
    setBookmarkIds(getBookmarks(username, testId));
  }

  const { data: reviewData, isLoading } = useQuery<ReviewData | null>({
    queryKey: ["testReview", testId, sessionId, username],
    queryFn: async () => {
      if (!backend || !username || !sessionId) return null;
      return backend.getTestReview(username, Number(testIdBig), sessionId);
    },
    enabled: !!backend && !!username && !!sessionId,
  });

  if (isLoading) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-12 space-y-4"
        data-ocid="review.loading_state"
      >
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!reviewData || reviewData.questions.length === 0) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-12 text-center"
        data-ocid="review.empty_state"
      >
        <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground mb-4">No review data available.</p>
        <Link to="/tests/$testId/result" params={{ testId }}>
          <Button
            variant="outline"
            data-ocid="review.exit_button"
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Results
          </Button>
        </Link>
      </div>
    );
  }

  const questions: ReviewQuestion[] = reviewData.questions;
  const total = questions.length;
  const safeIndex = Math.max(0, Math.min(currentIndex, total - 1));
  const current: ReviewQuestion = questions[safeIndex];
  const hasPrev = safeIndex > 0;
  const hasNext = safeIndex < total - 1;

  const score = reviewData.totalScore;
  const correctCount = questions.filter((q) => q.isCorrect).length;
  const hasSections = reviewData.sectionScores.length > 0;

  // Build bookmarked review questions from the review list
  const bookmarkedReviewQuestions = questions.filter((rq) =>
    bookmarkIds.has(String(rq.question.id)),
  );

  function goTo(index: number) {
    setCurrentIndex(Math.max(0, Math.min(index, total - 1)));
  }

  function jumpToBookmarked(rq: ReviewQuestion) {
    const idx = questions.findIndex(
      (q) => String(q.question.id) === String(rq.question.id),
    );
    if (idx !== -1) goTo(idx);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/tests/$testId/result" params={{ testId }}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              data-ocid="review.exit_button"
            >
              <ChevronLeft className="w-4 h-4" />
              Results
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="font-display text-lg font-semibold text-foreground">
            Review Answers
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Score:{" "}
          </span>
          <Badge
            variant="outline"
            className={
              score >= 75
                ? "text-accent border-accent/30 bg-accent/5"
                : score >= 60
                  ? "text-primary border-primary/30 bg-primary/5"
                  : "text-destructive border-destructive/30 bg-destructive/5"
            }
            data-ocid="review.score_badge"
          >
            {score}%
          </Badge>
        </div>
      </div>

      {/* Bookmarked Questions Panel */}
      {bookmarkedReviewQuestions.length > 0 && (
        <div className="mb-6" data-ocid="review.bookmarks.panel">
          <button
            type="button"
            onClick={() => setBookmarkOpen((v) => !v)}
            className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl border border-border bg-card shadow-subtle hover:bg-muted/30 transition-colors"
            aria-expanded={bookmarkOpen}
            data-ocid="review.bookmarks.toggle"
          >
            <div className="flex items-center gap-2.5">
              <BookmarkCheck className="w-4 h-4 text-accent" />
              <span className="font-display font-semibold text-foreground text-sm">
                Bookmarked Questions
              </span>
              <span className="question-count-badge">
                {bookmarkedReviewQuestions.length}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                bookmarkOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {bookmarkOpen && (
            <div className="mt-2 space-y-2" data-ocid="review.bookmarks.list">
              {bookmarkedReviewQuestions.map((rq, idx) => (
                <div
                  key={String(rq.question.id)}
                  className="flex items-start gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors"
                  data-ocid={`review.bookmarks.item.${idx + 1}`}
                >
                  <button
                    type="button"
                    onClick={() => jumpToBookmarked(rq)}
                    className="flex-1 text-left min-w-0"
                    data-ocid={`review.bookmarks.jump_button.${idx + 1}`}
                    aria-label={`Jump to bookmarked question ${idx + 1}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {rq.isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-destructive shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Q{questions.indexOf(rq) + 1}
                      </span>
                    </div>
                    <RichTextDisplay
                      html={rq.question.text}
                      className="text-sm text-foreground leading-snug line-clamp-2"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveBookmark(String(rq.question.id))}
                    className="bookmark-toggle bookmarked shrink-0"
                    aria-label="Remove bookmark"
                    data-ocid={`review.bookmarks.remove_button.${idx + 1}`}
                  >
                    <Bookmark className="w-4 h-4" fill="currentColor" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section scores */}
      {hasSections && (
        <div className="mb-6" data-ocid="review.sections.panel">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-display font-semibold text-foreground text-sm uppercase tracking-wide">
              Section Scores
            </h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {reviewData.sectionScores.map((sr, idx) => {
              const secPct =
                Number(sr.totalQuestions) > 0
                  ? Math.round(
                      (Number(sr.score) / Number(sr.totalQuestions)) * 100,
                    )
                  : 0;
              return (
                <div
                  key={String(sr.sectionId)}
                  className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-border bg-card"
                  data-ocid={`review.section.item.${idx + 1}`}
                >
                  <span className="text-sm font-medium text-foreground truncate min-w-0 mr-2">
                    {sr.sectionName}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {Number(sr.score)}/{Number(sr.totalQuestions)}
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
        </div>
      )}

      {/* Summary bar */}
      <div className="flex items-center justify-between mb-4 px-4 py-2.5 rounded-lg border border-border bg-card">
        <span className="text-sm text-muted-foreground">
          <strong className="text-foreground">{correctCount}</strong> / {total}{" "}
          correct
        </span>
        <span
          className="text-sm font-semibold text-foreground"
          data-ocid="review.question_counter"
        >
          {safeIndex + 1} / {total}
        </span>
      </div>

      {/* Quick-jump dots */}
      <div className="flex items-center justify-center gap-1.5 mb-5 flex-wrap">
        {questions.map((q, i) => (
          <button
            key={String(q.question.id)}
            type="button"
            onClick={() => goTo(i)}
            className={`w-6 h-6 rounded-full text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-ring ${
              i === safeIndex
                ? "bg-primary text-primary-foreground scale-125"
                : q.isCorrect
                  ? "bg-accent/20 text-accent hover:bg-accent/30"
                  : "bg-destructive/20 text-destructive hover:bg-destructive/30"
            }`}
            aria-label={`Go to question ${i + 1}`}
            data-ocid={`review.dot.${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Review card */}
      <Card
        className="shadow-subtle overflow-hidden mb-6"
        data-ocid="review.question.card"
      >
        <CardHeader
          className={`pb-3 border-b border-border px-5 pt-4 ${
            current.isCorrect ? "bg-accent/5" : "bg-destructive/5"
          }`}
        >
          <div className="flex items-start gap-3">
            {current.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Question {safeIndex + 1} of {total}
                </span>
                <Badge
                  variant="outline"
                  className={
                    current.isCorrect
                      ? "text-xs text-accent border-accent/30"
                      : "text-xs text-destructive border-destructive/30"
                  }
                  data-ocid="review.question.correctness_badge"
                >
                  {current.isCorrect ? "Correct" : "Incorrect"}
                </Badge>
              </div>
              <RichTextDisplay
                html={current.question.text}
                className="text-sm font-medium leading-relaxed"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pt-4 pb-4 space-y-3">
          {/* MC options with rich text */}
          {(current.question.questionType === QuestionType.mcSingle ||
            current.question.questionType === QuestionType.mcMulti) &&
            current.question.options.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Answer options
                </p>
                {current.question.options.map((opt, i) => {
                  const isCorrectOpt = current.correctAnswer
                    .split(", ")
                    .includes(opt);
                  const isUserOpt = current.userAnswer
                    .split(", ")
                    .includes(opt);
                  let rowClass =
                    "bg-muted/40 border-transparent text-muted-foreground";
                  if (isCorrectOpt)
                    rowClass =
                      "bg-accent/10 border-accent/30 text-accent font-medium";
                  else if (isUserOpt && !isCorrectOpt)
                    rowClass =
                      "bg-destructive/10 border-destructive/30 text-destructive";
                  return (
                    <div
                      key={`opt-${i}-${opt}`}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm border transition-colors ${rowClass}`}
                      data-ocid={`review.option.${i + 1}`}
                    >
                      {isCorrectOpt ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : isUserOpt ? (
                        <XCircle className="w-4 h-4 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 shrink-0 rounded-full border border-border flex items-center justify-center text-xs">
                          {i + 1}
                        </span>
                      )}
                      <RichTextDisplay html={opt} className="flex-1 min-w-0" />
                      {isCorrectOpt && (
                        <Badge className="ml-auto text-xs bg-accent/20 text-accent border-accent/30 shrink-0">
                          Correct
                        </Badge>
                      )}
                      {isUserOpt && !isCorrectOpt && (
                        <Badge className="ml-auto text-xs bg-destructive/20 text-destructive border-destructive/30 shrink-0">
                          Your answer
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          {/* Your answer (text/order types) */}
          {current.question.questionType !== QuestionType.mcSingle &&
            current.question.questionType !== QuestionType.mcMulti && (
              <div className="space-y-2">
                <div
                  className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border ${
                    current.isCorrect
                      ? "bg-accent/10 border-accent/30"
                      : "bg-destructive/10 border-destructive/30"
                  }`}
                  data-ocid="review.your_answer"
                >
                  {current.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-accent mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0 text-destructive mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide block mb-0.5 ${
                        current.isCorrect ? "text-accent" : "text-destructive"
                      }`}
                    >
                      Your answer
                    </span>
                    <RichTextDisplay
                      html={current.userAnswer || "<em>No answer given</em>"}
                      className="text-sm font-medium"
                    />
                  </div>
                </div>

                {!current.isCorrect && (
                  <div
                    className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-accent/10 border border-accent/30"
                    data-ocid="review.correct_answer"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-accent mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-0.5">
                        Correct answer
                      </span>
                      <RichTextDisplay
                        html={current.correctAnswer}
                        className="text-sm font-medium text-accent"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* Explanation */}
          {current.question.explanation && (
            <div
              className="explanation-card"
              data-ocid="review.explanation_card"
            >
              <div className="explanation-label">Explanation</div>
              <div className="explanation-text">
                <RichTextDisplay html={current.question.explanation} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div
        className="flex items-center justify-between gap-3"
        data-ocid="review.navigation"
      >
        <Button
          variant="outline"
          onClick={() => goTo(safeIndex - 1)}
          disabled={!hasPrev}
          className="gap-2 flex-1 sm:flex-none"
          data-ocid="review.prev_button"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        <span className="text-sm font-semibold text-muted-foreground">
          {safeIndex + 1} / {total}
        </span>

        <Button
          variant="outline"
          onClick={() => goTo(safeIndex + 1)}
          disabled={!hasNext}
          className="gap-2 flex-1 sm:flex-none"
          data-ocid="review.next_button"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {isAdmin && (
        <div className="mt-6 flex justify-center">
          <Link to="/admin">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              data-ocid="review.admin_dashboard_button"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Dashboard
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
