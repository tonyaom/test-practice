import { useActor as useCoreActor } from "@caffeineai/core-infrastructure";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { createElement } from "react";
import { flushSync } from "react-dom";
import { createActor } from "../backend";
import type { backendInterface } from "../backend";
import { appConfig } from "../config";
import type { BackendService } from "../services/backendService";
import { createBackendServiceIfRest } from "../services/backendServiceFactory";
import { createIcpBackendService } from "../services/icpBackendService";
import type { AuthSession } from "../types";

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

// --- Context ---

interface AuthContextValue {
  session: AuthSession | null;
  login: (s: AuthSession) => void;
  logout: () => void;
  updatePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ ok: true } | { err: string }>;
  updateProfile: (
    displayName: string,
  ) => Promise<{ ok: true } | { err: string }>;
  isAdmin: boolean;
  isUser: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(loadSession);
  // useActor must be called unconditionally (Rules of Hooks).
  const { actor: rawActor, isFetching } = useCoreActor(createActor);

  // When backendType is "rest", use the REST service singleton.
  // When backendType is "icp", use the actor once it has loaded.
  const restService =
    appConfig.backendType === "rest" ? createBackendServiceIfRest() : null;
  const service: BackendService | null =
    restService ??
    (!isFetching && rawActor
      ? createIcpBackendService(rawActor as unknown as backendInterface)
      : null);

  const login = useCallback((s: AuthSession) => {
    // Save to localStorage first so any component reading it directly gets
    // the latest value immediately (e.g. during the navigation flush).
    saveSession(s);
    // flushSync ensures the React state update is committed *before*
    // the caller's navigate() call, preventing a brief null-session render
    // on mobile right after login.
    flushSync(() => {
      setSession(s);
    });
  }, []);

  const logout = useCallback(() => {
    saveSession(null);
    setSession(null);
  }, []);

  const updatePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string,
    ): Promise<{ ok: true } | { err: string }> => {
      if (!service || !session) return { err: "Not logged in" };
      const result = await service.updatePassword(
        session.username,
        currentPassword,
        newPassword,
      );
      if (result.__kind__ === "ok") return { ok: true };
      return { err: result.err };
    },
    [service, session],
  );

  const updateProfile = useCallback(
    async (displayName: string): Promise<{ ok: true } | { err: string }> => {
      if (!service || !session) return { err: "Not logged in" };
      const result = await service.updateProfile(session.username, displayName);
      if (result.__kind__ === "ok") {
        const updated = { ...session, displayName };
        saveSession(updated);
        setSession(updated);
        return { ok: true };
      }
      return { err: result.err };
    },
    [service, session],
  );

  const value: AuthContextValue = {
    session,
    login,
    logout,
    updatePassword,
    updateProfile,
    isAdmin: session?.role === "admin",
    isUser: session?.role === "user",
    isLoggedIn: session !== null,
  };

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
