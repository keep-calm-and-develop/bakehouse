import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { formatStatusLabel, getNextStatus, canAdvanceStatus } from "@/lib/status";
import { advanceOrderStatus } from "@/services/orders";
import { useCurrentEmployee } from "@/stores/authStore";
import type { Order } from "@/types/order";

interface StatusChangeModalProps {
  open: boolean;
  order: Order | null;
  onClose: (updated?: boolean) => void;
}

export function StatusChangeModal({
  open,
  order,
  onClose,
}: StatusChangeModalProps) {
  const currentEmployee = useCurrentEmployee();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useBodyScrollLock(open);
  useEscapeKey(open && !updating, () => onClose(false));

  if (!open || !order?.status || !canAdvanceStatus(order.status)) {
    return null;
  }

  const currentStatus = order.status;
  const nextStatus = getNextStatus(currentStatus);
  const nextStatusLabel = formatStatusLabel(nextStatus);

  const handleConfirm = async () => {
    if (updating) {
      return;
    }

    setUpdating(true);
    setError(null);

    try {
      await advanceOrderStatus(
        order.id,
        currentStatus,
        currentEmployee?.email,
      );
      onClose(true);
    } catch (confirmError) {
      console.error(confirmError);
      setError("Failed to update order status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-change-title"
      onClick={() => !updating && onClose(false)}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="status-change-title"
          className="text-lg font-semibold text-foreground"
        >
          Confirm status change
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Has this order been{" "}
          <span className="font-semibold text-foreground">{nextStatusLabel}</span>
          ? This will move it to the next stage in production.
        </p>

        {error ? (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onClose(false)}
            disabled={updating}
            className="h-10 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={updating}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {updating ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Updating...
              </>
            ) : (
              "Yes, confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
