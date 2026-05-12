import { Toaster } from "@/components/ui/sonner";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy, useEffect } from "react";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { applyTheme, getStoredTheme } from "./utils/darkModeStorage";

import { DataSyncProvider } from "./context/DataSyncContext";
// Eagerly-loaded pages (no rich text editor, safe for login flow)
import { AdminDashboardPage } from "./features/admin/AdminDashboardPage";
import { AdminTestsPage } from "./features/admin/AdminTestsPage";
import { LoginPage } from "./features/auth/LoginPage";
import { RegisterPage } from "./features/auth/RegisterPage";
import { UserTestsPage } from "./features/user-tests/UserTestsPage";

// Lazily-loaded pages that pull in react-quill-new / katex — only loaded after login
const AdminTestDetailPage = lazy(() =>
  import("./features/admin/AdminTestDetailPage").then((m) => ({
    default: m.AdminTestDetailPage,
  })),
);
const AdminUsersPage = lazy(() =>
  import("./features/admin/AdminUsersPage").then((m) => ({
    default: m.AdminUsersPage,
  })),
);
const TakeTestPage = lazy(() =>
  import("./features/test-taking/TakeTestPage").then((m) => ({
    default: m.TakeTestPage,
  })),
);
const TestResultPage = lazy(() =>
  import("./features/results/TestResultPage").then((m) => ({
    default: m.TestResultPage,
  })),
);
const ReviewModePage = lazy(() =>
  import("./features/results/ReviewModePage").then((m) => ({
    default: m.ReviewModePage,
  })),
);
const TestHistoryPage = lazy(() =>
  import("./features/test-history/TestHistoryPage").then((m) => ({
    default: m.TestHistoryPage,
  })),
);

function RootComponent() {
  // Apply stored theme on mount to prevent FOUC
  useEffect(() => {
    const stored = getStoredTheme();
    if (stored) applyTheme(stored);
  }, []);

  return (
    <AuthProvider>
      <DataSyncProvider>
        <Layout>
          <Outlet />
        </Layout>
      </DataSyncProvider>
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}

function IndexRedirect() {
  const { session, isAdmin } = useAuth();
  if (!session) return <Navigate to="/login" />;
  if (isAdmin) return <Navigate to="/admin" />;
  return <Navigate to="/tests" />;
}

const rootRoute = createRootRoute({ component: RootComponent });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexRedirect,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <ProtectedRoute requireAdmin>
      <AdminTestsPage />
    </ProtectedRoute>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: () => (
    <ProtectedRoute requireAdmin>
      <AdminDashboardPage />
    </ProtectedRoute>
  ),
});

const adminTestDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/tests/$testId",
  component: () => (
    <ProtectedRoute requireAdmin>
      <Suspense
        fallback={
          <div className="p-8 text-center text-muted-foreground">Loading…</div>
        }
      >
        <AdminTestDetailPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/users",
  component: () => (
    <ProtectedRoute requireAdmin>
      <Suspense
        fallback={
          <div className="p-8 text-center text-muted-foreground">Loading…</div>
        }
      >
        <AdminUsersPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const testsHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tests/history",
  component: () => (
    <ProtectedRoute requireUser>
      <Suspense
        fallback={
          <div className="p-8 text-center text-muted-foreground">Loading…</div>
        }
      >
        <TestHistoryPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const testsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tests",
  component: () => (
    <ProtectedRoute requireUser>
      <UserTestsPage />
    </ProtectedRoute>
  ),
});

const takeTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tests/$testId",
  component: () => (
    <ProtectedRoute requireUser>
      <Suspense
        fallback={
          <div className="p-8 text-center text-muted-foreground">Loading…</div>
        }
      >
        <TakeTestPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const testResultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tests/$testId/result",
  component: () => (
    <ProtectedRoute requireUser>
      <Suspense
        fallback={
          <div className="p-8 text-center text-muted-foreground">Loading…</div>
        }
      >
        <TestResultPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const testReviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tests/$testId/review",
  component: () => (
    <ProtectedRoute requireUser>
      <Suspense
        fallback={
          <div className="p-8 text-center text-muted-foreground">Loading…</div>
        }
      >
        <ReviewModePage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  adminRoute,
  adminDashboardRoute,
  adminTestDetailRoute,
  adminUsersRoute,
  testsRoute,
  testsHistoryRoute,
  takeTestRoute,
  testResultRoute,
  testReviewRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
