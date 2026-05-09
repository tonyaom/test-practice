import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ClipboardCheck,
  ClipboardList,
  Clock,
  Star,
  Trophy,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useBackend } from "../../hooks/useBackend";
import type { TestResult } from "../../types";
import { formatElapsed } from "../../utils/timerStorage";

/** Compute total lifetime time from all sessionIds in localStorage */
function getLifetimeSeconds(): number {
  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("timer:")) {
        const val = Number(localStorage.getItem(key));
        if (Number.isFinite(val) && val > 0) total += val;
      }
    }
    return total;
  } catch {
    return 0;
  }
}

export function TestHistoryPage() {
  const backend = useBackend();
  const { session } = useAuth();
  const username = session?.username ?? "";

  const { data: results = [], isLoading } = useQuery<TestResult[]>({
    queryKey: ["test-history", username],
    queryFn: async () => {
      if (!backend || !username) return [];
      try {
        const raw = await backend.listMyTestResults(username);
        return raw as TestResult[];
      } catch {
        return [];
      }
    },
    enabled: !!backend && !!username,
  });

  const lifetimeSeconds = getLifetimeSeconds();

  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      data-ocid="history.page"
    >
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardCheck className="w-6 h-6 text-primary" />
          Test History
        </h1>
        <p className="text-muted-foreground mt-1">
          Your completed tests and scores
        </p>
      </div>

      {/* Lifetime stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">
              Tests Completed
            </span>
          </div>
          <div className="font-display text-2xl font-bold text-foreground">
            {results.length}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground font-medium">
              Best Score
            </span>
          </div>
          <div className="font-display text-2xl font-bold text-foreground">
            {Math.max(
              ...results.map((r) =>
                Number(r.totalQuestions) > 0
                  ? Math.round(
                      (Number(r.score) / Number(r.totalQuestions)) * 100,
                    )
                  : 0,
              ),
            )}
            %
          </div>
        </div>
        <div
          className="rounded-xl border border-border bg-card px-4 py-3 col-span-2 sm:col-span-1"
          data-ocid="history.lifetime_time"
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">
              Total Time (this device)
            </span>
          </div>
          <div className="font-display text-2xl font-bold text-foreground">
            {lifetimeSeconds > 0 ? formatElapsed(lifetimeSeconds) : "—"}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="history.loading_state">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-4 flex items-center gap-4"
            >
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="history.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-lg text-foreground mb-2">
            No completed tests yet
          </h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Complete a test to see your results here. Your scores and progress
            are tracked automatically.
          </p>
          <Link to="/tests">
            <Button className="gap-2" data-ocid="history.go_practice_button">
              Start Practicing
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2" data-ocid="history.results.list">
          {results.map((result, idx) => {
            const score = Number(result.score);
            const total = Number(result.totalQuestions);
            const pct = total > 0 ? Math.round((score / total) * 100) : 0;
            const passed = pct >= 70;
            const isPerfect = pct === 100;
            const hasSections =
              Array.isArray(result.sectionResults) &&
              result.sectionResults.length > 0;
            return (
              <div
                key={result.sessionId}
                className={`rounded-xl border bg-card px-4 py-3 hover:shadow-subtle transition-all duration-200 ${
                  isPerfect
                    ? "border-accent/30"
                    : passed
                      ? "border-border"
                      : "border-border"
                }`}
                data-ocid={`history.results.item.${idx + 1}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isPerfect
                        ? "bg-accent/15 text-accent"
                        : passed
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isPerfect ? (
                      <Star className="w-5 h-5" />
                    ) : (
                      <Trophy className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {result.testId
                        ? `Test #${String(result.testId)}`
                        : "Unknown Test"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(
                        Number(result.completedAt) / 1_000_000,
                      ).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {/* Section scores row */}
                    {hasSections && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {result.sectionResults.map((sr) => {
                          const secPct =
                            Number(sr.totalQuestions) > 0
                              ? Math.round(
                                  (Number(sr.score) /
                                    Number(sr.totalQuestions)) *
                                    100,
                                )
                              : 0;
                          return (
                            <Badge
                              key={String(sr.sectionId)}
                              variant="outline"
                              className="text-xs px-1.5 py-0"
                            >
                              {sr.sectionName}: {secPct}%
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-mono text-sm font-bold tabular-nums ${
                        isPerfect
                          ? "text-accent"
                          : passed
                            ? "text-primary"
                            : "text-muted-foreground"
                      }`}
                      data-ocid={`history.results.score.${idx + 1}`}
                    >
                      {score}/{total}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isPerfect
                          ? "bg-accent/15 text-accent"
                          : passed
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {pct}%
                    </span>
                    <Link
                      to="/tests/$testId/result"
                      params={{ testId: String(result.testId) }}
                      search={{ sessionId: result.sessionId }}
                      data-ocid={`history.results.view_button.${idx + 1}`}
                    >
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
