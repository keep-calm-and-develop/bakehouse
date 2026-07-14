import {
  addDays,
  format,
  isSameDay,
  isTuesday,
  isWednesday,
  nextTuesday,
  previousWednesday,
} from "date-fns";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface WeekBarProps {
  selectedDay: Date;
  onChange: (date: Date) => void;
}

function getProductionWeekDays(anchor: Date) {
  const wednesday = isWednesday(anchor) ? anchor : previousWednesday(anchor);
  const days = [wednesday];

  for (let index = 1; index <= 5; index += 1) {
    days.push(addDays(wednesday, index));
  }

  const tuesday = isTuesday(anchor) ? anchor : nextTuesday(anchor);
  days.push(tuesday);

  return days;
}

export function WeekBar({ selectedDay, onChange }: WeekBarProps) {
  const weekDays = useMemo(() => getProductionWeekDays(new Date()), []);

  return (
    <section
      aria-label="Select production day"
      className="rounded-lg border border-border bg-card p-3 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <p className="text-sm font-medium text-foreground">Production week</p>
        <p className="text-xs text-muted-foreground">
          {format(weekDays[0], "d MMM")} – {format(weekDays[6], "d MMM yyyy")}
        </p>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {weekDays.map((date) => {
          const selected = isSameDay(date, selectedDay);
          const isToday = isSameDay(date, new Date());

          return (
            <button
              key={date.toISOString()}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(date)}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg border px-1 py-2 text-center transition-colors",
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
                  selected ? "text-primary-foreground/90" : "text-muted-foreground",
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
