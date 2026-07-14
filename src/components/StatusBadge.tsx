import { cn } from "@/lib/utils";
import { formatStatusLabel } from "@/lib/status";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-sky-100 text-sky-900 ring-sky-300",
  LAYERED: "bg-amber-100 text-amber-950 ring-amber-300",
  FINISHED: "bg-teal-100 text-teal-950 ring-teal-300",
  FONDANT_FINISHED: "bg-rose-100 text-rose-950 ring-rose-300",
  DECORATED: "bg-orange-100 text-orange-950 ring-orange-300",
  UNAPPROVED: "bg-slate-200 text-slate-800 ring-slate-300",
  CANCELLED: "bg-slate-200 text-slate-700 ring-slate-300",
  READY: "bg-yellow-100 text-yellow-950 ring-yellow-300",
  COMPLETED: "bg-emerald-100 text-emerald-950 ring-emerald-300",
};

interface StatusBadgeProps {
  status?: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset",
        STATUS_STYLES[status] ?? "bg-muted text-muted-foreground ring-border",
      )}
    >
      {formatStatusLabel(status)}
    </span>
  );
}
