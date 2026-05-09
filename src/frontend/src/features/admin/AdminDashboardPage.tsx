import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Award,
  BookOpen,
  ChevronRight,
  HelpCircle,
  RefreshCw,
  Shield,
  TrendingUp,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useBackend } from "../../hooks/useBackend";
import type { AdminDashboardStats } from "../../types";

// ── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: bigint | number | string | undefined;
  icon: ReactNode;
  accent?: boolean;
  subtext?: string;
  loading?: boolean;
  dataOcid?: string;
}

function StatCard({
  label,
  value,
  icon,
  accent = false,
  subtext,
  loading = false,
  dataOcid,
}: StatCardProps) {
  return (
    <div className={`stat-card${accent ? " accent" : ""}`} data-ocid={dataOcid}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="stat-label">{label}</span>
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            accent ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
          }`}
        >
          {icon}
        </div>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-24 mt-2" />
      ) : (
        <div className="stat-value">
          {value !== undefined ? String(value) : "—"}
        </div>
      )}
      {subtext && <div className="stat-subtext">{subtext}</div>}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export function AdminDashboardPage() {
  const { session } = useAuth();
  const backend = useBackend();
  const username = session?.username ?? "";

  const {
    data: stats,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<AdminDashboardStats>({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      if (!backend) throw new Error("Not connected");
      return backend.getAdminDashboardStats(username);
    },
    enabled: !!backend && !!username,
    staleTime: 30_000,
  });

  return (
    <div
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      data-ocid="admin.dashboard.page"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Platform-wide statistics and activity at a glance
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-1.5 text-muted-foreground"
          data-ocid="admin.dashboard.refresh_button"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Error State */}
      {isError && (
        <div
          className="flex flex-col items-center justify-center py-16 text-center"
          data-ocid="admin.dashboard.error_state"
        >
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>
          <h3 className="font-display font-semibold text-lg text-foreground mb-2">
            Failed to load statistics
          </h3>
          <p className="text-muted-foreground text-sm mb-5 max-w-sm">
            There was a problem fetching dashboard data. Check your connection
            and try again.
          </p>
          <Button onClick={() => refetch()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      {!isError && (
        <>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
            data-ocid="admin.dashboard.stats.section"
          >
            <StatCard
              label="Total Tests"
              value={stats?.totalTests}
              icon={<BookOpen className="w-4 h-4" />}
              loading={isLoading}
              dataOcid="admin.dashboard.stat.total_tests"
            />
            <StatCard
              label="Total Questions"
              value={stats?.totalQuestions}
              icon={<HelpCircle className="w-4 h-4" />}
              loading={isLoading}
              dataOcid="admin.dashboard.stat.total_questions"
            />
            <StatCard
              label="Total Users"
              value={stats?.totalUsers}
              icon={<Users className="w-4 h-4" />}
              loading={isLoading}
              dataOcid="admin.dashboard.stat.total_users"
            />
            <StatCard
              label="Active Users"
              value={stats?.totalActiveUsers}
              icon={<UserCheck className="w-4 h-4" />}
              accent
              loading={isLoading}
              dataOcid="admin.dashboard.stat.active_users"
            />
            <StatCard
              label="Deactivated Users"
              value={stats?.totalDeactivatedUsers}
              icon={<UserMinus className="w-4 h-4" />}
              loading={isLoading}
              subtext="Blocked from login"
            />
            <StatCard
              label="Mastered Questions"
              value={stats?.totalMasteredQuestions}
              icon={<Award className="w-4 h-4" />}
              accent
              loading={isLoading}
              subtext="Answered correctly ×5"
            />
            <StatCard
              label="Mastery Rate"
              value={
                stats?.totalMasteryRecords &&
                stats?.totalMasteredQuestions !== undefined
                  ? `${Number(stats.totalMasteryRecords) > 0 ? Math.round((Number(stats.totalMasteredQuestions) / Number(stats.totalMasteryRecords)) * 100) : 0}%`
                  : undefined
              }
              icon={<TrendingUp className="w-4 h-4" />}
              loading={isLoading}
              subtext="Of tracked questions mastered"
            />
            <StatCard
              label="Mastery Records"
              value={stats?.totalMasteryRecords}
              icon={<TrendingUp className="w-4 h-4" />}
              loading={isLoading}
              subtext="Total mastery entries"
            />
            <StatCard
              label="Admins"
              value={BigInt(1)}
              icon={<Shield className="w-4 h-4" />}
              loading={isLoading}
              subtext="Platform administrators"
            />
          </div>

          {/* Top Tests Table */}
          <Card
            className="shadow-subtle"
            data-ocid="admin.dashboard.top_tests.card"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Most Practiced Tests
                </CardTitle>
                <Link to="/admin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-muted-foreground text-xs"
                    data-ocid="admin.dashboard.manage_tests.link"
                  >
                    Manage Tests
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <div
                  className="space-y-3"
                  data-ocid="admin.dashboard.top_tests.loading_state"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : stats?.topTests && stats.topTests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-0">Test Name</TableHead>
                      <TableHead className="text-right pr-0">
                        Sessions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.topTests.map((t, idx) => (
                      <TableRow
                        key={String(t.testId)}
                        data-ocid={`admin.dashboard.top_tests.item.${idx + 1}`}
                      >
                        <TableCell className="pl-0 font-medium">
                          <Link
                            to="/admin/tests/$testId"
                            params={{ testId: String(t.testId) }}
                            className="hover:text-primary transition-fast"
                          >
                            {t.testName}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right pr-0">
                          <Badge variant="secondary" className="font-mono">
                            {String(t.sessionCount)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div
                  className="text-center py-8 text-muted-foreground text-sm"
                  data-ocid="admin.dashboard.top_tests.empty_state"
                >
                  No practice sessions recorded yet.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <Link to="/admin">
              <Card className="shadow-subtle hover:shadow-md transition-smooth cursor-pointer group border-border">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-fast">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm">
                      Manage Tests
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Create, edit and delete practice tests
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
                </CardContent>
              </Card>
            </Link>
            <Link to="/admin/users">
              <Card className="shadow-subtle hover:shadow-md transition-smooth cursor-pointer group border-border">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-fast">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm">
                      Manage Users
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Activate, deactivate and monitor users
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
