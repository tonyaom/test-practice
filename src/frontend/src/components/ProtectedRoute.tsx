import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireUser?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin,
}: ProtectedRouteProps) {
  const { session, isAdmin } = useAuth();

  if (!session) {
    return <Navigate to="/login" />;
  }

  // For admin routes: non-admin users are redirected to /tests
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/tests" />;
  }

  // requireUser only requires authentication — both admins and regular users pass
  return <>{children}</>;
}
