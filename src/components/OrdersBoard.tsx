import { Loader2 } from "lucide-react";
import { OrderCard } from "@/components/OrderCard";
import { PROCESSES, PROCESSES_STATUS_MAP } from "@/constants";
import { getActiveOrdersForProcess } from "@/lib/orders";
import { useOrders } from "@/stores/ordersStore";

interface OrdersBoardProps {
  isLoading: boolean;
}

export function OrdersBoard({ isLoading }: OrdersBoardProps) {
  const orders = useOrders();

  return (
    <section className="space-y-4">
      {PROCESSES.map((process) => {
        const processOrders = orders[process.value];
        const activeOrders = getActiveOrdersForProcess(
          processOrders,
          PROCESSES_STATUS_MAP[process.value],
        );

        return (
          <div
            key={process.value}
            className="rounded-lg border border-border bg-card shadow-sm"
          >
            <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  {process.label}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {activeOrders.length} active · {processOrders.length} assigned
                </p>
              </div>
            </header>

            <div className="p-4">
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Loading orders...
                </div>
              ) : activeOrders.length === 0 ? (
                <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                  No orders in this stage for the selected day.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {activeOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
