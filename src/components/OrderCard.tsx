import { StatusBadge } from "@/components/StatusBadge";
import type { Order } from "@/types/order";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const properties = order.properties;
  return (
    <article className="flex min-h-28 flex-col gap-2 rounded-lg border border-border bg-background p-3 shadow-xs transition-colors hover:border-primary/40 hover:bg-card">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">
          {order.productType ?? "Untitled order"}
        </p>
        {order.orderNo ? (
          <p className="text-xs text-muted-foreground">#{order.orderNo}</p>
        ) : null}
      </div>

      {properties.length > 0 ? (
        <ul className="space-y-1 text-[11px] text-muted-foreground">
          {properties
            .filter((property) =>
              [property.cake, property.filling, property.frosting].some(
                (value) => value && value.trim() && value !== "—",
              ),
            )
            .map((property, index) => (
              <li key={`${order.id}-${index}`} className="flex flex-wrap gap-2">
                {property.cake && (
                  <span className="truncate">{property.cake}</span>
                )}
                {property.filling && (
                  <span className="truncate">{property.filling}</span>
                )}
                {property.frosting && (
                  <span className="truncate">{property.frosting}</span>
                )}
              </li>
            ))}
        </ul>
      ) : null}

      <div className="mt-auto">
        <StatusBadge status={order.status} />
      </div>
    </article>
  );
}
