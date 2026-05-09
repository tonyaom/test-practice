import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  ShieldOff,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { useBackend } from "../../hooks/useBackend";
import type { AdminUserInfo, UserProgressInfo } from "../../types";

interface UserProgressModalProps {
  user: AdminUserInfo;
  adminUsername: string;
  onClose: () => void;
}

function UserProgressModal({
  user,
  adminUsername,
  onClose,
}: UserProgressModalProps) {
  const backend = useBackend();

  const { data: tests = [], isLoading: testsLoading } = useQuery({
    queryKey: ["tests"],
    queryFn: async () => {
      if (!backend) return [];
      return backend.listTests();
    },
    enabled: !!backend,
  });

  const { data: progressList = [], isLoading: progressLoading } = useQuery({
    queryKey: ["adminUserProgress", user.username],
    queryFn: async () => {
      if (!backend || tests.length === 0) return [];
      const results = await Promise.all(
        tests.map((t) =>
          backend
            .adminGetUserProgress(adminUsername, user.username, Number(t.id))
            .then((p) => p)
            .catch(() => null),
        ),
      );
      return results.filter((r): r is UserProgressInfo => r !== null);
    },
    enabled: !!backend && tests.length > 0,
  });

  const isLoading = testsLoading || progressLoading;

  const totalMastered = progressList.reduce(
    (sum, p) => sum + Number(p.masteredCount),
    0,
  );
  const totalQuestions = progressList.reduce(
    (sum, p) => sum + Number(p.totalQuestions),
    0,
  );
  const totalInProgress = progressList.reduce(
    (sum, p) => sum + Number(p.inProgressCount),
    0,
  );
  const masteredTests = progressList.filter(
    (p) =>
      Number(p.totalQuestions) > 0 &&
      Number(p.masteredCount) === Number(p.totalQuestions),
  ).length;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[85vh] overflow-y-auto"
        data-ocid="admin.users.progress.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            Progress: {user.displayName || user.username}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            @{user.username} — test mastery overview
          </p>
        </DialogHeader>

        <div className="flex justify-end mt-1 mb-2">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="admin.users.progress.close_button"
          >
            Close
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3 py-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : progressList.length === 0 ? (
          <div
            className="py-10 text-center text-muted-foreground"
            data-ocid="admin.users.progress.empty_state"
          >
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No test progress recorded yet.</p>
          </div>
        ) : (
          <>
            {/* Summary strip */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                {
                  label: "Tests Mastered",
                  value: masteredTests,
                  total: progressList.length,
                  accent: masteredTests > 0,
                },
                {
                  label: "Questions Mastered",
                  value: totalMastered,
                  total: totalQuestions,
                  accent: totalMastered > 0,
                },
                {
                  label: "In Progress",
                  value: totalInProgress,
                  total: totalQuestions,
                  accent: false,
                },
              ].map(({ label, value, total, accent }) => (
                <div
                  key={label}
                  className={`rounded-lg border p-3 text-center ${
                    accent
                      ? "border-accent/20 bg-accent/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div
                    className={`font-display text-xl font-bold ${
                      accent ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {value}
                    {total > 0 && (
                      <span className="text-xs font-normal text-muted-foreground">
                        /{total}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Per-test breakdown */}
            <div className="space-y-3">
              {progressList.map((p, idx) => {
                const total = Number(p.totalQuestions);
                const mastered = Number(p.masteredCount);
                const inProgress = Number(p.inProgressCount);
                const notStarted = total - mastered - inProgress;
                const pct =
                  total > 0 ? Math.round((mastered / total) * 100) : 0;
                const isTestMastered = total > 0 && mastered === total;
                const test = tests.find(
                  (t) => Number(t.id) === Number(p.testId),
                );
                return (
                  <div
                    key={String(p.testId)}
                    className={`rounded-lg border p-4 ${
                      isTestMastered
                        ? "border-accent/30 bg-accent/5"
                        : "border-border bg-card"
                    }`}
                    data-ocid={`admin.user_progress.item.${idx + 1}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0 mr-2">
                        {isTestMastered && (
                          <Star className="w-3.5 h-3.5 text-accent shrink-0" />
                        )}
                        <span className="text-sm font-medium text-foreground truncate">
                          {test?.name ?? `Test ${String(p.testId)}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isTestMastered && (
                          <Badge className="text-xs bg-accent/15 text-accent border-accent/30 gap-1">
                            <Star className="w-2.5 h-2.5" />
                            Mastered
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={
                            pct >= 75
                              ? "text-accent border-accent/30 bg-accent/5"
                              : "text-muted-foreground border-border"
                          }
                        >
                          {pct}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={pct} className="h-1.5 mb-3" />
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-accent" />
                        {mastered} mastered
                      </span>
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-primary" />
                        {inProgress} in progress
                      </span>
                      {notStarted > 0 && (
                        <span className="flex items-center gap-1">
                          <Circle className="w-3 h-3 text-muted-foreground" />
                          {notStarted} not started
                        </span>
                      )}
                      <span>{total} total</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function AdminUsersPage() {
  const { session } = useAuth();
  const backend = useBackend();
  const queryClient = useQueryClient();
  const adminUsername = session?.username ?? "";
  const [selectedUser, setSelectedUser] = useState<AdminUserInfo | null>(null);

  const { data: users = [], isLoading } = useQuery<AdminUserInfo[]>({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      if (!backend) return [];
      return backend.adminListUsers(adminUsername);
    },
    enabled: !!backend && !!adminUsername,
  });

  const activateMutation = useMutation({
    mutationFn: async (targetUsername: string) => {
      if (!backend) throw new Error("Not connected");
      return backend.adminActivateUser(adminUsername, targetUsername);
    },
    onSuccess: (_, targetUsername) => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success(`User "${targetUsername}" has been activated.`);
    },
    onError: () => toast.error("Failed to activate user"),
  });

  const deactivateMutation = useMutation({
    mutationFn: async (targetUsername: string) => {
      if (!backend) throw new Error("Not connected");
      return backend.adminDeactivateUser(adminUsername, targetUsername);
    },
    onSuccess: (_, targetUsername) => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success(`User "${targetUsername}" has been deactivated.`);
    },
    onError: () => toast.error("Failed to deactivate user"),
  });

  const isMutating = activateMutation.isPending || deactivateMutation.isPending;

  function canToggle(user: AdminUserInfo): boolean {
    // Cannot deactivate self or other admins
    return user.username !== adminUsername && user.role !== "admin";
  }

  return (
    <div
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      data-ocid="admin.users.page"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Manage Users
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View user accounts, activate or deactivate access, and review test
            progress.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          <Users className="w-4 h-4 mr-1.5" />
          {users.length} users
        </Badge>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="admin.users.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-lg text-foreground mb-2">
            No users yet
          </h3>
          <p className="text-muted-foreground max-w-sm text-sm">
            Users will appear here once they register.
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-ocid="admin.users.list">
          {users.map((user, idx) => {
            const isCurrentUser = user.username === adminUsername;
            const isUserAdmin = user.role === "admin";
            const active = user.isActive;

            return (
              <Card
                key={user.username}
                className={`shadow-subtle transition-all duration-200 ${
                  !active ? "opacity-60 bg-muted/30" : ""
                }`}
                data-ocid={`admin.users.item.${idx + 1}`}
              >
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          active ? "bg-primary/10" : "bg-muted"
                        }`}
                      >
                        {active ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : (
                          <XCircle className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="font-display text-sm">
                            {user.displayName || user.username}
                          </CardTitle>
                          {isUserAdmin && (
                            <Badge
                              variant="default"
                              className="text-xs h-5 px-1.5"
                            >
                              Admin
                            </Badge>
                          )}
                          {isCurrentUser && (
                            <Badge
                              variant="outline"
                              className="text-xs h-5 px-1.5 text-muted-foreground"
                            >
                              You
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={`text-xs h-5 px-1.5 ${
                              active
                                ? "text-accent border-accent/30 bg-accent/5"
                                : "text-destructive border-destructive/30 bg-destructive/5"
                            }`}
                          >
                            {active ? "Active" : "Deactivated"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          @{user.username}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                        data-ocid={`admin.users.progress_button.${idx + 1}`}
                      >
                        View Progress
                      </Button>

                      {canToggle(user) ? (
                        active ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                            disabled={isMutating}
                            onClick={() =>
                              deactivateMutation.mutate(user.username)
                            }
                            data-ocid={`admin.users.deactivate_button.${idx + 1}`}
                          >
                            <ShieldOff className="w-3.5 h-3.5" />
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-accent border-accent/30 hover:bg-accent/10 hover:text-accent"
                            disabled={isMutating}
                            onClick={() =>
                              activateMutation.mutate(user.username)
                            }
                            data-ocid={`admin.users.activate_button.${idx + 1}`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Activate
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                          className="text-muted-foreground"
                          title={
                            isCurrentUser
                              ? "Cannot modify your own account"
                              : "Cannot modify admin accounts"
                          }
                        >
                          Protected
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}

      {selectedUser && (
        <UserProgressModal
          user={selectedUser}
          adminUsername={adminUsername}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
