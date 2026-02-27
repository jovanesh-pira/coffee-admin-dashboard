import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/context/useAuth";
import type { ProtectedRouteProps } from "@/features/auth/models/Auth.types";

export default function ProtectedRoute({
  redirectTo = "/login",
  requiredRole,
  laodingEffect,
}: ProtectedRouteProps) {
  const { user, loading, error } = useAuth();
  const location = useLocation();

  if (loading) return laodingEffect ?? <div>Loading...</div>;
  if (error) return <Navigate to={redirectTo} replace />;

  if (!user) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (requiredRole) {
    
    if (!user.role) return laodingEffect ?? <div>Loading...</div>;

    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowed.includes(user.role)) {
      return <Navigate to="/not-authorized" replace />;
    }
  }

  return <Outlet />;
}