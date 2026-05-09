import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getStreak } from "../utils/streakStorage";
import { ProfileModal } from "./ProfileModal";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { session, logout, isAdmin } = useAuth();
  const streakCount =
    session && !isAdmin ? getStreak(session.username).currentStreak : null;
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  // Only admin users see the Manage Tests (admin) and Users links; regular users only see Practice Tests
  const navLinks = session
    ? [
        ...(isAdmin
          ? [
              {
                to: "/admin/dashboard" as const,
                label: "Dashboard",
                icon: LayoutDashboard,
              },
              {
                to: "/admin" as const,
                label: "Manage Tests",
                icon: BookOpen,
              },
              {
                to: "/admin/users" as const,
                label: "Users",
                icon: Users,
              },
            ]
          : []),
        { to: "/tests" as const, label: "Practice Tests", icon: BookOpen },
        { to: "/tests/history" as const, label: "History", icon: History },
      ]
    : [];

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
              <div className="flex items-center gap-2 sm:gap-6">
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
                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-fast ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Streak badge — only for logged-in regular users */}
                {session && !isAdmin && (
                  <span
                    className="streak-badge hidden sm:inline-flex"
                    title={`${streakCount} day streak — keep it going!`}
                    data-ocid="nav.streak_badge"
                  >
                    🔥<span className="font-mono">{streakCount}</span>
                  </span>
                )}

                <Separator
                  orientation="vertical"
                  className="h-6 hidden sm:block"
                />

                <div className="flex items-center gap-1 sm:gap-3">
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
                        className="text-xs px-1.5 py-0 h-4 self-start capitalize"
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
                    <SheetContent side="right" className="w-72 sm:hidden">
                      <SheetHeader className="mb-4">
                        <SheetTitle className="font-display text-left">
                          Navigation
                        </SheetTitle>
                      </SheetHeader>

                      {/* User info */}
                      <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-muted/50 mb-4">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-foreground leading-tight truncate">
                            {session.displayName || session.username}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs px-1.5 py-0 h-4 self-start capitalize mt-0.5"
                          >
                            {session.role}
                          </Badge>
                        </div>
                      </div>

                      {/* Streak badge (mobile) */}
                      {session && !isAdmin && (
                        <div className="flex items-center gap-2 px-2 mb-3">
                          <span
                            className="streak-badge"
                            title={`${streakCount} day streak — keep it going!`}
                            data-ocid="nav.mobile.streak_badge"
                          >
                            🔥<span className="font-mono">{streakCount}</span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {streakCount === 1 ? "day streak" : "day streak"}
                          </span>
                        </div>
                      )}

                      {/* Nav links */}
                      <nav className="flex flex-col gap-1 mb-6">
                        {navLinks.map(({ to, label, icon: Icon }) => {
                          const isActive =
                            currentPath === to ||
                            currentPath.startsWith(`${to}/`);
                          return (
                            <Link
                              key={to}
                              to={to}
                              onClick={() => setMobileMenuOpen(false)}
                              data-ocid={`nav.mobile.${label.toLowerCase().replace(/\s+/g, "_")}.link`}
                              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-fast ${isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}
                            >
                              <Icon className="w-4 h-4 shrink-0" />
                              {label}
                            </Link>
                          );
                        })}
                      </nav>

                      <Separator className="mb-4" />

                      {/* Mobile profile + logout */}
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setProfileOpen(true);
                          }}
                          data-ocid="nav.mobile.profile_button"
                          className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-fast w-full text-left"
                        >
                          <User className="w-4 h-4 shrink-0 text-muted-foreground" />
                          Edit Profile
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            handleLogout();
                          }}
                          data-ocid="nav.mobile.logout_button"
                          className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-fast w-full text-left"
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
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
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
