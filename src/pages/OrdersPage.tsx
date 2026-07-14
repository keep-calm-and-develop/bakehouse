import {
  useCurrentEmployee,
  useSignOut,
} from "@/stores/authStore";

export function OrdersPage() {
  const currentEmployee = useCurrentEmployee();
  const signOut = useSignOut();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as {currentEmployee?.name ?? currentEmployee?.email}
          </p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Sign out
        </button>
      </header>

      <section className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Order board coming soon. Process buckets are ready in global state.
      </section>
    </div>
  );
}
