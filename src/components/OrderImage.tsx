import { X, ZoomIn } from "lucide-react";
import { useState } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import type { Order } from "@/types/order";

interface OrderImageProps {
  order: Order;
}

export function OrderImage({ order }: OrderImageProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  useBodyScrollLock(isExpanded);
  useEscapeKey(isExpanded, () => setIsExpanded(false));

  if (!order.imageUrl) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
        No reference image available
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className="group relative w-full overflow-hidden rounded-lg border border-border bg-muted/20"
        aria-label="View full-size order image"
      >
        <img
          src={order.imageUrl}
          alt={`Reference for ${order.productType ?? "order"}`}
          className="mx-auto max-h-72 w-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
          <ZoomIn className="size-3.5" aria-hidden="true" />
          View full size
        </span>
      </button>

      {isExpanded ? (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Order image preview"
          onClick={() => setIsExpanded(false)}
        >
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md transition-colors hover:bg-background"
            aria-label="Close image preview"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          <img
            src={order.imageUrl}
            alt={`Reference for ${order.productType ?? "order"}`}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
