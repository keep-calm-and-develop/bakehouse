import { addDays, format, isSameDay, startOfDay } from "date-fns";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface WeekBarProps {
  selectedDay: Date;
  onChange: (date: Date) => void;
}

const DAYS_BEFORE_TODAY = 1;
const DAYS_AFTER_TODAY = 13;

function getDayRangeFromToday(anchor: Date) {
  const today = startOfDay(anchor);
  const days: Date[] = [];

  for (
    let offset = -DAYS_BEFORE_TODAY;
    offset <= DAYS_AFTER_TODAY;
    offset += 1
  ) {
    days.push(addDays(today, offset));
  }

  return days;
}

export function WeekBar({ selectedDay, onChange }: WeekBarProps) {
  const dayRange = useMemo(() => getDayRangeFromToday(new Date()), []);

  return (
    <section
      aria-label="Select production day"
      className="rounded-lg border border-border bg-card p-3 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <p className="text-sm font-medium text-foreground">Upcoming days</p>
        <p className="text-xs text-muted-foreground">
          {format(dayRange[0], "d MMM")} –{" "}
          {format(dayRange[dayRange.length - 1], "d MMM yyyy")}
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1 sm:gap-2">
        {dayRange.map((date) => {
          const selected = isSameDay(date, selectedDay);
          const isToday = isSameDay(date, new Date());

          return (
            <button
              key={date.toISOString()}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(date)}
              className={cn(
                "flex min-h-16 min-w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2 text-center transition-colors sm:min-w-16",
                selected
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-transparent bg-muted/40 text-foreground hover:bg-muted",
              )}
            >
              <span className="text-lg font-semibold leading-none">
                {format(date, "d")}
              </span>
              <span
                className={cn(
                  "text-xs font-medium uppercase tracking-wide",
                  selected
                    ? "text-primary-foreground/90"
                    : "text-muted-foreground",
                )}
              >
                {format(date, "EEE")}
              </span>
              {isToday ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                    selected
                      ? "bg-primary-foreground/15 text-primary-foreground"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  Today
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
