import { Navigate } from "react-router";
import { useIsAuthenticated } from "@/stores/authStore";

export function RootRedirect() {
  const isAuthenticated = useIsAuthenticated();
  return <Navigate to={isAuthenticated ? "/orders" : "/login"} replace />;
}
