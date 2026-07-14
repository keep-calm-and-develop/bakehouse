import type { OrderProperty } from "@/types/order";

interface PropertiesTableProps {
  properties?: OrderProperty[];
}

export function PropertiesTable({ properties = [] }: PropertiesTableProps) {
  if (properties.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
        No properties listed for this order.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[320px] text-left text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="px-4 py-3 font-semibold text-foreground">Cake</th>
            <th className="px-4 py-3 font-semibold text-foreground">Filling</th>
            <th className="px-4 py-3 font-semibold text-foreground">Frosting</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property, index) => (
            <tr
              key={`${property.cake ?? ""}-${property.filling ?? ""}-${property.frosting ?? ""}-${index}`}
              className="border-b border-border last:border-b-0"
            >
              <td className="px-4 py-3 text-foreground">
                {property.cake?.trim() || "—"}
              </td>
              <td className="px-4 py-3 text-foreground">
                {property.filling?.trim() || "—"}
              </td>
              <td className="px-4 py-3 text-foreground">
                {property.frosting?.trim() || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
