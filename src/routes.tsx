import { Routes, Route } from "react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";
import { RootRedirect } from "@/components/auth/RootRedirect";
import { LoginPage } from "@/pages/LoginPage";
import { OrdersPage } from "@/pages/OrdersPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route
          path="/login"
          element={
            <main className="flex min-h-svh items-center justify-center p-4">
              <LoginPage />
            </main>
          }
        />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route
          path="/orders"
          element={
            <main className="min-h-svh p-4">
              <OrdersPage />
            </main>
          }
        />
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
