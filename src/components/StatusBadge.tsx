import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-sky-500/15 text-sky-800 ring-sky-500/30",
  LAYERED: "bg-amber-400/20 text-amber-900 ring-amber-500/30",
  FINISHED: "bg-teal-500/15 text-teal-900 ring-teal-500/30",
  FONDANT_FINISHED: "bg-rose-500/15 text-rose-900 ring-rose-500/30",
  DECORATED: "bg-orange-500/15 text-orange-900 ring-orange-500/30",
  UNAPPROVED: "bg-slate-500/15 text-slate-700 ring-slate-500/30",
  CANCELLED: "bg-slate-500/15 text-slate-700 ring-slate-500/30",
  READY: "bg-yellow-500/20 text-yellow-900 ring-yellow-500/30",
  COMPLETED: "bg-emerald-500/15 text-emerald-900 ring-emerald-500/30",
};

interface StatusBadgeProps {
  status?: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) {
    return null;
  }

  const label = status.replaceAll("_", " ").toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset",
        STATUS_STYLES[status] ?? "bg-muted text-muted-foreground ring-border",
      )}
    >
      {label}
    </span>
  );
}
