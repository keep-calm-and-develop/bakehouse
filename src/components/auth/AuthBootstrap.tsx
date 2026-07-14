import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/stores/authStore";

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  if (isAuthLoading) {
    return (
      <main className="flex min-h-svh items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </main>
    );
  }

  return children;
}
