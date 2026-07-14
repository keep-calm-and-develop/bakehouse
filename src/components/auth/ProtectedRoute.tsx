import { Navigate, Outlet, useLocation } from "react-router";
import { useIsAuthenticated } from "@/stores/authStore";

export function ProtectedRoute() {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
