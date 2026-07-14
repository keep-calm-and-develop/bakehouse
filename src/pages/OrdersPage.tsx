import { format } from "date-fns";
import { LogOut } from "lucide-react";
import { useCallback, useState } from "react";
import { OrdersBoard } from "@/components/OrdersBoard";
import { WeekBar } from "@/components/WeekBar";
import { useOrdersSubscription } from "@/hooks/useOrdersSubscription";
import { useCurrentEmployee, useSignOut } from "@/stores/authStore";

export function OrdersPage() {
  const currentEmployee = useCurrentEmployee();
  const signOut = useSignOut();
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const { isLoading, error } = useOrdersSubscription(
    currentEmployee?.id,
    selectedDay,
  );

  const handleDayChange = useCallback((date: Date) => {
    setSelectedDay(date);
  }, []);

  return (
    <div className="mx-auto flex min-h-[calc(100svh-2rem)] w-full max-w-7xl flex-col gap-4">
      <header className="sticky top-0 z-10 -mx-1 rounded-lg border border-border bg-background/95 px-4 py-3 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Bitter Sweet Symphony
            </p>
            <h1 className="truncate text-xl font-semibold text-foreground">
              {currentEmployee?.name ?? "Employee"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Orders for {format(selectedDay, "EEEE, d MMMM yyyy")}
            </p>
          </div>

          <button
            type="button"
            onClick={signOut}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pb-4">
        <WeekBar selectedDay={selectedDay} onChange={handleDayChange} />

        {error ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        ) : null}

        <OrdersBoard isLoading={isLoading} />
      </div>
    </div>
  );
}
