import { Navigate, Outlet } from "react-router";
import { useIsAuthenticated } from "@/stores/authStore";

export function PublicRoute() {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/orders" replace />;
  }

  return <Outlet />;
}
