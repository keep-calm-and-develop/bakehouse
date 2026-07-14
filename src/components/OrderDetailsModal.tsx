import { format } from "date-fns";
import { CheckCircle2, X } from "lucide-react";
import { OrderImage } from "@/components/OrderImage";
import { PropertiesTable } from "@/components/PropertiesTable";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import type { Order } from "@/types/order";

interface OrderDetailsModalProps {
  open: boolean;
  order: Order | null;
  isInEmployeesHand: boolean;
  onClose: () => void;
  onMarkAsCompleted: () => void;
}

export function OrderDetailsModal({
  open,
  order,
  isInEmployeesHand,
  onClose,
  onMarkAsCompleted,
}: OrderDetailsModalProps) {
  useBodyScrollLock(open);
  useEscapeKey(open, onClose);

  if (!open || !order) {
    return null;
  }

  const deliveryDate = order.deliveryDate
    ? format(new Date(order.deliveryDate), "dd MMM, hh:mm a")
    : "—";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-details-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-xl sm:rounded-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2
              id="order-details-title"
              className="text-lg font-semibold text-foreground"
            >
              Order details
            </h2>
            {order.orderNo ? (
              <p className="text-sm text-muted-foreground">#{order.orderNo}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-muted"
            aria-label="Close order details"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </header>

        <div className="space-y-5 overflow-y-auto px-5 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Product
              </p>
              <p className="text-lg font-semibold text-foreground">
                {order.productType ?? "Untitled order"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-foreground">{deliveryDate}</p>
              {order.deliveryType ? (
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {order.deliveryType}
                </span>
              ) : null}
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Special instructions
            </p>
            <p className="mt-1 text-sm text-foreground">
              {order.specialInstructions?.trim() || "None"}
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-foreground">
              {order.properties?.length ?? 0}{" "}
              {(order.properties?.length ?? 0) === 1 ? "property" : "properties"}
            </p>
            <PropertiesTable properties={order.properties} />
          </div>

          {isInEmployeesHand ? (
            <div className="flex flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Customer
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {order.customer?.name ?? "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={onMarkAsCompleted}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Mark as completed
              </button>
            </div>
          ) : null}

          <OrderImage order={order} />
        </div>
      </div>
    </div>
  );
}
