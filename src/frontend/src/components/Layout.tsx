import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDataSyncContext } from "../context/DataSyncContext";
import { useAuth } from "../hooks/useAuth";
import { getActiveTheme, toggleTheme } from "../utils/darkModeStorage";
import { getStreak } from "../utils/streakStorage";
import { ProfileModal } from "./ProfileModal";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { session, logout, isAdmin } = useAuth();
  const streak = session && !isAdmin ? getStreak(session.username) : null;
  const streakCount = streak?.currentStreak ?? 0;
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSyncing } = useDataSyncContext();

  // ── Dark mode ──────────────────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(() => getActiveTheme() === "dark");

  function handleToggleTheme() {
    const next = toggleTheme();
    setIsDark(next === "dark");
  }

  // ── Sync status indicator ──────────────────────────────────────────────────
  const [syncVisible, setSyncVisible] = useState(false);
  const syncFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isSyncing) {
      setSyncVisible(true);
      if (syncFadeTimerRef.current) clearTimeout(syncFadeTimerRef.current);
    } else if (syncVisible) {
      syncFadeTimerRef.current = setTimeout(() => setSyncVisible(false), 3000);
    }
    return () => {
      if (syncFadeTimerRef.current) clearTimeout(syncFadeTimerRef.current);
    };
  }, [isSyncing, syncVisible]);

  // ── Online status ──────────────────────────────────────────────────────────
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  // Grouped nav links for mobile menu
  const practiceLinks =
    session && !isAdmin
      ? [
          { to: "/tests" as const, label: "Practice Tests", icon: BookOpen },
          { to: "/tests/history" as const, label: "History", icon: History },
        ]
      : [];

  const adminLinks =
    session && isAdmin
      ? [
          {
            to: "/admin/dashboard" as const,
            label: "Dashboard",
            icon: LayoutDashboard,
          },
          { to: "/admin" as const, label: "Manage Tests", icon: BookOpen },
          { to: "/admin/users" as const, label: "Users", icon: Users },
        ]
      : [];

  // Flat nav for desktop
  const navLinks = session ? [...adminLinks, ...practiceLinks] : [];

  // Streak badge color: gold at 7+, normal otherwise
  const streakGold = streakCount >= 7;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-subtle sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to={session ? (isAdmin ? "/admin" : "/tests") : "/login"}
              className="flex items-center gap-2.5 group"
              data-ocid="nav.logo.link"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-xs group-hover:shadow-card transition-smooth">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-foreground tracking-tight">
                PrepStream
              </span>
            </Link>

            {/* Nav + User */}
            {session && (
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Desktop nav */}
                <nav className="hidden sm:flex items-center gap-1">
                  {navLinks.map(({ to, label, icon: Icon }) => {
                    const isActive =
                      currentPath === to || currentPath.startsWith(`${to}/`);
                    return (
                      <Link
                        key={to}
                        to={to}
                        data-ocid={`nav.${label.toLowerCase().replace(/\s+/g, "_")}.link`}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-fast ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Streak badge — only for logged-in regular users, only when streak > 0 */}
                {session && !isAdmin && streakCount > 0 && (
                  <div className="relative group hidden sm:block">
                    <span
                      className={`streak-badge ${
                        streakGold ? "streak-badge-gold" : ""
                      }`}
                      data-ocid="nav.streak_badge"
                    >
                      🔥<span className="font-mono">{streakCount}</span>
                    </span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-popover border border-border rounded-lg shadow-md text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {streakCount}-day study streak — practice today to keep it
                      going!
                    </div>
                  </div>
                )}

                {/* Sync status indicator */}
                {syncVisible && (
                  <div
                    className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground"
                    data-ocid="nav.sync_status"
                  >
                    {!isOnline ? (
                      <>
                        <span className="text-yellow-500">⚠</span>
                        <span>Offline</span>
                      </>
                    ) : isSyncing ? (
                      <>
                        <svg
                          className="animate-spin w-3 h-3 text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        <span>Syncing…</span>
                      </>
                    ) : (
                      <>
                        <span className="text-accent">✓</span>
                        <span>Up to date</span>
                      </>
                    )}
                  </div>
                )}

                <Separator
                  orientation="vertical"
                  className="h-6 hidden sm:block"
                />

                {/* Dark mode toggle */}
                <button
                  type="button"
                  onClick={handleToggleTheme}
                  aria-label={
                    isDark ? "Switch to light mode" : "Switch to dark mode"
                  }
                  data-ocid="nav.theme_toggle"
                  className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-fast"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </button>

                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Clickable profile area */}
                  <button
                    type="button"
                    onClick={() => setProfileOpen(true)}
                    data-ocid="nav.profile_button"
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-fast cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Open profile settings"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-sm font-medium text-foreground leading-tight">
                        {session.displayName || session.username}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0 h-4 self-start capitalize mt-0.5"
                        data-ocid="nav.role_badge"
                      >
                        {session.role}
                      </Badge>
                    </div>
                  </button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    data-ocid="nav.logout_button"
                    className="text-muted-foreground hover:text-foreground gap-1.5 hidden sm:flex"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>

                  {/* Mobile hamburger menu */}
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="sm:hidden"
                        aria-label="Open navigation menu"
                        data-ocid="nav.mobile_menu_button"
                      >
                        <Menu className="w-5 h-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-72 sm:hidden flex flex-col p-0"
                    >
                      {/* Profile card */}
                      <div className="p-4 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-semibold text-foreground truncate block">
                              {session.displayName || session.username}
                            </span>
                            <Badge
                              className={`text-xs px-1.5 py-0 h-4 self-start capitalize mt-0.5 ${
                                isAdmin
                                  ? "bg-amber-100 text-amber-700 border-amber-300"
                                  : "bg-primary/10 text-primary border-primary/20"
                              }`}
                              data-ocid="nav.mobile.role_badge"
                            >
                              {session.role}
                            </Badge>
                          </div>
                          {streakCount > 0 && !isAdmin && (
                            <span
                              className={`streak-badge ${
                                streakGold ? "streak-badge-gold" : ""
                              }`}
                              title={`${streakCount}-day study streak`}
                              data-ocid="nav.mobile.streak_badge"
                            >
                              🔥
                              <span className="font-mono text-xs">
                                {streakCount}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Scrollable nav area */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Practice section */}
                        {practiceLinks.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                              Practice
                            </p>
                            <nav className="flex flex-col gap-1">
                              {practiceLinks.map(
                                ({ to, label, icon: Icon }) => {
                                  const isActive =
                                    currentPath === to ||
                                    currentPath.startsWith(`${to}/`);
                                  return (
                                    <Link
                                      key={to}
                                      to={to}
                                      onClick={() => setMobileMenuOpen(false)}
                                      data-ocid={`nav.mobile.${label.toLowerCase().replace(/\s+/g, "_")}.link`}
                                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-fast ${
                                        isActive
                                          ? "bg-primary/10 text-primary"
                                          : "text-foreground hover:bg-muted"
                                      }`}
                                    >
                                      <Icon className="w-4 h-4 shrink-0" />
                                      {label}
                                    </Link>
                                  );
                                },
                              )}
                            </nav>
                          </div>
                        )}

                        {/* Admin section */}
                        {adminLinks.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                              Admin
                            </p>
                            <nav className="flex flex-col gap-1">
                              {adminLinks.map(({ to, label, icon: Icon }) => {
                                const isActive =
                                  currentPath === to ||
                                  currentPath.startsWith(`${to}/`);
                                return (
                                  <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    data-ocid={`nav.mobile.${label.toLowerCase().replace(/\s+/g, "_")}.link`}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-fast ${
                                      isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-foreground hover:bg-muted"
                                    }`}
                                  >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    {label}
                                  </Link>
                                );
                              })}
                            </nav>
                          </div>
                        )}

                        {/* Account section */}
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                            Account
                          </p>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setProfileOpen(true);
                              }}
                              data-ocid="nav.mobile.profile_button"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-fast w-full text-left"
                            >
                              <User className="w-4 h-4 shrink-0 text-muted-foreground" />
                              Edit Profile
                            </button>
                            <button
                              type="button"
                              onClick={handleToggleTheme}
                              data-ocid="nav.mobile.theme_toggle"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-fast w-full text-left"
                            >
                              {isDark ? (
                                <Sun className="w-4 h-4 shrink-0 text-muted-foreground" />
                              ) : (
                                <Moon className="w-4 h-4 shrink-0 text-muted-foreground" />
                              )}
                              {isDark ? "Light Mode" : "Dark Mode"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Logout — always at bottom */}
                      <div className="p-4 border-t border-border">
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            handleLogout();
                          }}
                          data-ocid="nav.mobile.logout_button"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-fast w-full text-left"
                        >
                          <LogOut className="w-4 h-4 shrink-0" />
                          Logout
                        </button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Profile Modal */}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
