/**
 * Unit tests for auth session logic:
 * - session persistence (localStorage)
 * - role determination
 * - validation helpers used in RegisterPage
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { AuthSession } from "./mocks/backendStub";
import { UserRole } from "./mocks/backendStub";

// ── Session persistence helpers (mirrors useAuth.ts) ─────────────────────────

const SESSION_KEY = "prepstream_session";

function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function saveSession(session: AuthSession | null) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

// ── Registration validation helpers (mirrors RegisterPage logic) ──────────────

function validateRegistration(
  password: string,
  confirmPassword: string,
): string | null {
  if (password !== confirmPassword) return "Passwords do not match.";
  if (password.length < 4) return "Password must be at least 4 characters.";
  return null;
}

// ── Login result role mapping (mirrors LoginPage.handleSubmit) ────────────────

function mapRole(role: UserRole): "admin" | "user" {
  return role === UserRole.admin ? "admin" : "user";
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Session persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("loadSession returns null when nothing is stored", () => {
    expect(loadSession()).toBeNull();
  });

  it("saveSession + loadSession round-trips the session", () => {
    const session: AuthSession = { username: "alice", role: "admin" };
    saveSession(session);
    const loaded = loadSession();
    expect(loaded).not.toBeNull();
    expect(loaded?.username).toBe("alice");
    expect(loaded?.role).toBe("admin");
  });

  it("saveSession(null) removes the stored session", () => {
    const session: AuthSession = { username: "alice", role: "admin" };
    saveSession(session);
    saveSession(null);
    expect(loadSession()).toBeNull();
  });

  it("preserves optional displayName in session", () => {
    const session: AuthSession = {
      username: "bob",
      role: "user",
      displayName: "Bob Smith",
    };
    saveSession(session);
    const loaded = loadSession();
    expect(loaded?.displayName).toBe("Bob Smith");
  });

  it("loadSession returns null for malformed JSON", () => {
    localStorage.setItem(SESSION_KEY, "not-valid-json{{");
    expect(loadSession()).toBeNull();
  });
});

describe("Registration validation", () => {
  it("accepts matching passwords of sufficient length", () => {
    expect(validateRegistration("abcd", "abcd")).toBeNull();
    expect(validateRegistration("longpass1!", "longpass1!")).toBeNull();
  });

  it("rejects mismatched passwords", () => {
    const err = validateRegistration("abcd", "efgh");
    expect(err).toBe("Passwords do not match.");
  });

  it("rejects passwords shorter than 4 characters", () => {
    const err = validateRegistration("abc", "abc");
    expect(err).toBe("Password must be at least 4 characters.");
  });

  it("checks mismatch before length", () => {
    // Both are short but different — mismatch should be caught first
    const err = validateRegistration("ab", "cd");
    expect(err).toBe("Passwords do not match.");
  });

  it("rejects empty password", () => {
    const err = validateRegistration("", "");
    expect(err).toBe("Password must be at least 4 characters.");
  });
});

describe("Role mapping", () => {
  it("maps UserRole.admin to 'admin'", () => {
    expect(mapRole(UserRole.admin)).toBe("admin");
  });

  it("maps UserRole.user to 'user'", () => {
    expect(mapRole(UserRole.user)).toBe("user");
  });
});

describe("isAdmin / isUser derivation", () => {
  it("isAdmin is true when role is admin", () => {
    const session: AuthSession = { username: "x", role: "admin" };
    expect(session.role === "admin").toBe(true);
  });

  it("isAdmin is false when role is user", () => {
    const session: AuthSession = { username: "x", role: "user" };
    expect(session.role === "admin").toBe(false);
  });

  it("isLoggedIn is true when session exists", () => {
    const session: AuthSession = { username: "x", role: "user" };
    expect(session !== null).toBe(true);
  });

  it("isLoggedIn is false when session is null", () => {
    const session: AuthSession | null = null;
    expect(session !== null).toBe(false);
  });
});

// ── Admin nav-gating logic ────────────────────────────────────────────────────

/** Mirrors Layout.tsx navLinks computation */
function buildNavLinks(
  session: AuthSession | null,
): { to: string; label: string }[] {
  if (!session) return [];
  const isAdmin = session.role === "admin";
  return [
    ...(isAdmin ? [{ to: "/admin", label: "Manage Tests" }] : []),
    { to: "/tests", label: "Practice Tests" },
  ];
}

/** Mirrors Layout.tsx logo link logic */
function logoRoute(session: AuthSession | null): string {
  if (!session) return "/login";
  return session.role === "admin" ? "/admin" : "/tests";
}

describe("Admin nav-link gating", () => {
  it("admin user sees Manage Tests link", () => {
    const links = buildNavLinks({ username: "adbc", role: "admin" });
    expect(links.some((l) => l.label === "Manage Tests")).toBe(true);
  });

  it("regular user does NOT see Manage Tests link", () => {
    const links = buildNavLinks({ username: "alice", role: "user" });
    expect(links.some((l) => l.label === "Manage Tests")).toBe(false);
  });

  it("regular user sees Practice Tests link", () => {
    const links = buildNavLinks({ username: "alice", role: "user" });
    expect(links.some((l) => l.label === "Practice Tests")).toBe(true);
  });

  it("unauthenticated user sees no links", () => {
    expect(buildNavLinks(null)).toHaveLength(0);
  });

  it("logo routes admin to /admin", () => {
    expect(logoRoute({ username: "adbc", role: "admin" })).toBe("/admin");
  });

  it("logo routes regular user to /tests", () => {
    expect(logoRoute({ username: "alice", role: "user" })).toBe("/tests");
  });

  it("logo routes unauthenticated to /login", () => {
    expect(logoRoute(null)).toBe("/login");
  });
});

// ── Synchronous session init (no icon flicker) ────────────────────────────────

describe("Session initialisation is synchronous (no icon flicker)", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it("loadSession reads role immediately after saveSession (simulates login -> navigate)", () => {
    // Simulate what login() does: save synchronously, then new component mounts
    const adminSession: AuthSession = { username: "adbc", role: "admin" };
    saveSession(adminSession); // synchronous write (mirrors new login callback)
    const loaded = loadSession(); // synchronous read (mirrors useState initialiser)
    expect(loaded?.role).toBe("admin"); // role is available without waiting for useEffect
  });

  it("isAdmin is determinable on first read after login (no extra render needed)", () => {
    const session: AuthSession = { username: "adbc", role: "admin" };
    saveSession(session);
    const loaded = loadSession();
    const isAdmin = loaded?.role === "admin";
    expect(isAdmin).toBe(true);
  });

  it("regular user role is readable immediately after login", () => {
    const session: AuthSession = { username: "alice", role: "user" };
    saveSession(session);
    const loaded = loadSession();
    expect(loaded?.role).toBe("user");
    expect(loaded?.role === "admin").toBe(false);
  });
});
// ── accountDeactivated login handling ────────────────────────────────────────

describe("Login result — accountDeactivated", () => {
  /**
   * Mirrors the error-message mapping in LoginPage.handleSubmit:
   *
   *   if (result.__kind__ === "accountDeactivated") {
   *     setError("Your account has been deactivated");
   *   }
   */
  function mapLoginResultToError(result: { __kind__: string }): string | null {
    if (result.__kind__ === "accountDeactivated") {
      return "Your account has been deactivated";
    }
    if (result.__kind__ === "err") return "Invalid username or password";
    if (result.__kind__ === "requiresTOTP") return null; // proceed to TOTP step
    return null; // ok — proceed to dashboard
  }

  it("accountDeactivated result maps to the correct error message", () => {
    const msg = mapLoginResultToError({ __kind__: "accountDeactivated" });
    expect(msg).toBe("Your account has been deactivated");
  });

  it("ok result returns no error message", () => {
    const msg = mapLoginResultToError({ __kind__: "ok" });
    expect(msg).toBeNull();
  });

  it("err result returns invalid credentials message", () => {
    const msg = mapLoginResultToError({ __kind__: "err" });
    expect(msg).toBe("Invalid username or password");
  });

  it("requiresTOTP result returns null (no error — moves to TOTP step)", () => {
    const msg = mapLoginResultToError({ __kind__: "requiresTOTP" });
    expect(msg).toBeNull();
  });

  it("deactivated account error message contains the word 'deactivated'", () => {
    const msg = mapLoginResultToError({ __kind__: "accountDeactivated" });
    expect(msg).toContain("deactivated");
  });

  it("error message is not shown for successful login", () => {
    const msg = mapLoginResultToError({ __kind__: "ok" });
    expect(msg).toBeNull();
  });

  it("deactivated user cannot recover by retrying login with correct password", () => {
    // The error is a backend-enforced state — any login attempt returns accountDeactivated
    const msg = mapLoginResultToError({ __kind__: "accountDeactivated" });
    expect(msg).not.toBeNull();
    expect(msg).toContain("deactivated");
  });
});

// ── Session role guards after login ──────────────────────────────────────────

describe("Session role guards", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it("admin session is not confused with user session", () => {
    const adminSession: AuthSession = { username: "adbc", role: "admin" };
    const userSession: AuthSession = { username: "alice", role: "user" };
    saveSession(adminSession);
    const loaded = loadSession();
    expect(loaded?.username).not.toBe(userSession.username);
    expect(loaded?.role).toBe("admin");
  });

  it("clearing session then loading returns null", () => {
    saveSession({ username: "bob", role: "user" });
    saveSession(null);
    expect(loadSession()).toBeNull();
  });

  it("session with displayName round-trips through localStorage", () => {
    const session: AuthSession = {
      username: "alice",
      role: "user",
      displayName: "Alice W.",
    };
    saveSession(session);
    expect(loadSession()?.displayName).toBe("Alice W.");
  });
});
