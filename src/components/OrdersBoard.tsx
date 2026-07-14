import { Loader2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { OrderCard } from "@/components/OrderCard";
import { OrderDetailsModal } from "@/components/OrderDetailsModal";
import { StatusChangeModal } from "@/components/StatusChangeModal";
import { PROCESSES, PROCESSES_STATUS_MAP } from "@/constants";
import { getActiveOrdersForProcess } from "@/lib/orders";
import { canAdvanceStatus } from "@/lib/status";
import { cn } from "@/lib/utils";
import { useOrders } from "@/stores/ordersStore";
import type { Order, ProcessKey } from "@/types/order";

interface OrdersBoardProps {
  isLoading: boolean;
}

interface SelectedOrderState {
  order: Order | null;
  process: ProcessKey | null;
}

const EMPTY_SELECTION: SelectedOrderState = { order: null, process: null };

export function OrdersBoard({ isLoading }: OrdersBoardProps) {
  const orders = useOrders();
  const [selection, setSelection] =
    useState<SelectedOrderState>(EMPTY_SELECTION);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);

  const isInEmployeesHand = useMemo(
    () => canAdvanceStatus(selection.order?.status),
    [selection.order?.status],
  );

  const handleSelectOrder = useCallback((order: Order, process: ProcessKey) => {
    setSelection({ order, process });
    setDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsOpen(false);
  }, []);

  const handleMarkAsCompleted = useCallback(() => {
    setDetailsOpen(false);
    setStatusConfirmOpen(true);
  }, []);

  const handleStatusConfirmClose = useCallback((updated = false) => {
    setStatusConfirmOpen(false);
    if (updated) {
      setSelection(EMPTY_SELECTION);
    }
  }, []);

  return (
    <>
      <section className="space-y-4">
        {PROCESSES.map((process) => {
          const processOrders = orders[process.value];
          const activeOrders = getActiveOrdersForProcess(
            processOrders,
            PROCESSES_STATUS_MAP[process.value],
          );
          const hasContent = isLoading || activeOrders.length > 0;

          return (
            <div
              key={process.value}
              className="rounded-lg border border-border bg-card shadow-sm"
            >
              <header
                className={cn(
                  "px-4 py-3",
                  hasContent && "border-b border-border",
                )}
              >
                <h2 className="text-sm font-semibold text-foreground">
                  {process.label}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {activeOrders.length} active · {processOrders.length} assigned
                </p>
              </header>

              {hasContent ? (
                <div className="p-4">
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                      Loading orders...
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                      {activeOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onSelect={(selected) =>
                            handleSelectOrder(selected, process.value)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </section>

      <OrderDetailsModal
        open={detailsOpen}
        order={selection.order}
        isInEmployeesHand={isInEmployeesHand}
        onClose={handleCloseDetails}
        onMarkAsCompleted={handleMarkAsCompleted}
      />

      {isInEmployeesHand ? (
        <StatusChangeModal
          open={statusConfirmOpen}
          order={selection.order}
          onClose={handleStatusConfirmClose}
        />
      ) : null}
    </>
  );
}
