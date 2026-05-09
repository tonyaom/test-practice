import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  HardDrive,
  Loader2,
  RotateCcw,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";
import { clearAllCache, getCacheMeta } from "../utils/offlineCache";
import { TwoFactorSection } from "./TwoFactorSection";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

type SectionStatus = "idle" | "loading" | "success" | "error";

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { session, updatePassword, updateProfile } = useAuth();

  const backend = useBackend();

  // 2FA status — seeded from backend on open so existing-2FA users see correct state
  const [twoFAEnabled, setTwoFAEnabled] = useState<boolean>(false);
  const [twoFALoading, setTwoFALoading] = useState(false);

  // Cache management
  const [clearCacheConfirm, setClearCacheConfirm] = useState(false);
  const [resetAllMasteryConfirm, setResetAllMasteryConfirm] = useState(false);
  const [resetAllPending, setResetAllPending] = useState(false);

  // Display name state
  const [displayName, setDisplayName] = useState(session?.displayName ?? "");
  const [profileStatus, setProfileStatus] = useState<SectionStatus>("idle");
  const [profileError, setProfileError] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<SectionStatus>("idle");
  const [passwordError, setPasswordError] = useState("");

  // Fetch actual 2FA status whenever the modal opens
  useEffect(() => {
    if (!open || !backend || !session) return;
    let cancelled = false;
    setTwoFALoading(true);
    backend
      .getTwoFAStatus(session.username)
      .then((enabled) => {
        if (!cancelled) setTwoFAEnabled(enabled);
      })
      .catch(() => {
        /* keep default false on error */
      })
      .finally(() => {
        if (!cancelled) setTwoFALoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, backend, session]);

  if (!open) return null;

  async function handleResetAllMastery() {
    if (!backend || !session) return;
    setResetAllPending(true);
    try {
      const meta = getCacheMeta();
      const testIds = Object.keys(meta);
      if (testIds.length === 0) {
        // No cached tests — still try if we can get the list
        await backend.resetMyMastery(session.username, 0);
      } else {
        await Promise.all(
          testIds.map((id) =>
            backend
              .resetMyMastery(session.username, Number(id))
              .catch(() => null),
          ),
        );
      }
      toast.success("All mastery reset to 0 (streaks cleared).");
    } catch {
      toast.error("Failed to reset mastery.");
    } finally {
      setResetAllPending(false);
      setResetAllMasteryConfirm(false);
    }
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileStatus("loading");
    setProfileError("");
    const result = await updateProfile(displayName.trim());
    if ("ok" in result) {
      setProfileStatus("success");
      setTimeout(() => setProfileStatus("idle"), 3000);
    } else {
      setProfileError(result.err);
      setProfileStatus("error");
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      setPasswordStatus("error");
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      setPasswordStatus("error");
      return;
    }
    setPasswordStatus("loading");
    const result = await updatePassword(currentPassword, newPassword);
    if ("ok" in result) {
      setPasswordStatus("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordStatus("idle"), 3000);
    } else {
      setPasswordError(result.err);
      setPasswordStatus("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="profile.dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close profile modal"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-card border shadow-card overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground leading-tight">
                {session?.displayName || session?.username}
              </p>
              <p className="text-xs text-muted-foreground">
                @{session?.username}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-ocid="profile.close_button"
            className="text-muted-foreground hover:text-foreground -mr-1"
            aria-label="Close profile"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* ── Display Name Section ── */}
          <form onSubmit={handleProfileSave} className="space-y-4">
            <h3 className="text-sm font-display font-semibold text-foreground">
              Display Name
            </h3>
            <div className="space-y-1.5">
              <Label
                htmlFor="display-name"
                className="text-sm text-muted-foreground"
              >
                Name shown in the app
              </Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={session?.username}
                data-ocid="profile.display_name.input"
                className="bg-input/50"
              />
            </div>

            {profileStatus === "success" && (
              <div
                className="flex items-center gap-2 text-sm text-accent"
                data-ocid="profile.display_name.success_state"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Display name updated!
              </div>
            )}
            {profileStatus === "error" && (
              <p
                className="text-sm text-destructive"
                data-ocid="profile.display_name.error_state"
              >
                {profileError}
              </p>
            )}

            <Button
              type="submit"
              size="sm"
              disabled={profileStatus === "loading"}
              data-ocid="profile.display_name.save_button"
              className="transition-fast"
            >
              {profileStatus === "loading" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : null}
              Save Name
            </Button>
          </form>

          <Separator />

          {/* ── Change Password Section ── */}
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <h3 className="text-sm font-display font-semibold text-foreground">
              Change Password
            </h3>

            <div className="space-y-1.5">
              <Label
                htmlFor="current-password"
                className="text-sm text-muted-foreground"
              >
                Current password
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  data-ocid="profile.current_password.input"
                  className="bg-input/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-fast"
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                >
                  {showCurrent ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="new-password"
                className="text-sm text-muted-foreground"
              >
                New password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  data-ocid="profile.new_password.input"
                  className="bg-input/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-fast"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="confirm-password"
                className="text-sm text-muted-foreground"
              >
                Confirm new password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  data-ocid="profile.confirm_password.input"
                  className="bg-input/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-fast"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {passwordStatus === "success" && (
              <div
                className="flex items-center gap-2 text-sm text-accent"
                data-ocid="profile.password.success_state"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Password changed successfully!
              </div>
            )}
            {passwordStatus === "error" && (
              <p
                className="text-sm text-destructive"
                data-ocid="profile.password.error_state"
              >
                {passwordError}
              </p>
            )}

            <Button
              type="submit"
              size="sm"
              disabled={passwordStatus === "loading"}
              data-ocid="profile.password.save_button"
              className="transition-fast"
            >
              {passwordStatus === "loading" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : null}
              Update Password
            </Button>
          </form>

          <Separator />

          {/* ── 2FA Section ── */}
          {backend &&
            session &&
            (twoFALoading ? (
              <div className="space-y-3" data-ocid="profile.2fa.loading_state">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
            ) : (
              <TwoFactorSection
                username={session.username}
                enabled={twoFAEnabled}
                onStatusChange={setTwoFAEnabled}
                backend={backend}
              />
            ))}
          <Separator />

          {/* ── Cache Management Section ── */}
          <div className="space-y-4">
            <h3 className="text-sm font-display font-semibold text-foreground">
              Cache Management
            </h3>
            <p className="text-xs text-muted-foreground">
              Clear locally cached test data or reset your mastery streaks.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setClearCacheConfirm(true)}
                className="gap-2 text-muted-foreground justify-start"
                data-ocid="profile.cache.clear_button"
              >
                <HardDrive className="w-4 h-4" />
                Clear All Cache
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setResetAllMasteryConfirm(true)}
                className="gap-2 text-muted-foreground justify-start"
                data-ocid="profile.mastery.reset_all_button"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Master Question
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Clear cache confirm dialog */}
      <Dialog
        open={clearCacheConfirm}
        onOpenChange={(o) => !o && setClearCacheConfirm(false)}
      >
        <DialogContent
          className="max-w-sm"
          data-ocid="profile.cache.clear.dialog"
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
              data-ocid="profile.cache.clear.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                clearAllCache();
                toast.success("Cache cleared.");
                setClearCacheConfirm(false);
              }}
              data-ocid="profile.cache.clear.confirm_button"
            >
              Clear Cache
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset all mastery confirm dialog */}
      <Dialog
        open={resetAllMasteryConfirm}
        onOpenChange={(o) => !o && setResetAllMasteryConfirm(false)}
      >
        <DialogContent
          className="max-w-sm"
          data-ocid="profile.mastery.reset_all.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              Reset Master Question?
            </DialogTitle>
            <p className="text-sm text-muted-foreground pt-1">
              All your mastery streaks will be reset to 0. Questions you have
              mastered will need to be answered correctly again to regain
              mastery. This affects every test you have progress on.
            </p>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setResetAllMasteryConfirm(false)}
              data-ocid="profile.mastery.reset_all.cancel_button"
            >
              Cancel
            </Button>
            <Button
              disabled={resetAllPending}
              onClick={handleResetAllMastery}
              data-ocid="profile.mastery.reset_all.confirm_button"
            >
              {resetAllPending ? "Resetting…" : "Reset All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
