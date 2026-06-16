"use client";

import { useEffect, useMemo, useState } from "react";

type MatchCalendarProps = {
  selectedDay: string;
  minDate: string;
  maxDate: string;
  todayKey: string;
  matchDays: Set<string>;
  onDayChange: (day: string) => void;
  compact?: boolean;
};

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function parseDayKey(dayKey: string) {
  const [year, month, day] = dayKey.split("-").map(Number);
  return { year, month, day };
}

function toDayKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function MatchCalendar({
  selectedDay,
  minDate,
  maxDate,
  todayKey,
  matchDays,
  onDayChange,
  compact = false,
}: MatchCalendarProps) {
  const selected = parseDayKey(selectedDay);
  const [viewYear, setViewYear] = useState(selected.year);
  const [viewMonth, setViewMonth] = useState(selected.month);

  useEffect(() => {
    const parts = parseDayKey(selectedDay);
    setViewYear(parts.year);
    setViewMonth(parts.month);
  }, [selectedDay]);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(Date.UTC(viewYear, viewMonth - 1, 1))),
    [viewYear, viewMonth]
  );

  const minParts = parseDayKey(minDate);
  const maxParts = parseDayKey(maxDate);

  const canPrevMonth =
    viewYear > minParts.year ||
    (viewYear === minParts.year && viewMonth > minParts.month);
  const canNextMonth =
    viewYear < maxParts.year ||
    (viewYear === maxParts.year && viewMonth < maxParts.month);

  function goPrevMonth() {
    if (!canPrevMonth) return;
    if (viewMonth === 1) {
      setViewYear(viewYear - 1);
      setViewMonth(12);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function goNextMonth() {
    if (!canNextMonth) return;
    if (viewMonth === 12) {
      setViewYear(viewYear + 1);
      setViewMonth(1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  const calendarCells = useMemo(() => {
    const firstDay = new Date(Date.UTC(viewYear, viewMonth - 1, 1));
    const startOffset = firstDay.getUTCDay();
    const daysInMonth = new Date(Date.UTC(viewYear, viewMonth, 0)).getUTCDate();

    const cells: Array<{ dayKey: string; day: number } | null> = [];

    for (let i = 0; i < startOffset; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ dayKey: toDayKey(viewYear, viewMonth, day), day });
    }

    return cells;
  }, [viewYear, viewMonth]);

  function isInRange(dayKey: string) {
    return dayKey >= minDate && dayKey <= maxDate;
  }

  const cellSize = compact ? "h-8 text-xs" : "h-9 text-sm";

  return (
    <div
      className={`rounded-xl border border-card-border bg-card shadow-2xl ring-1 ring-card-border ${
        compact ? "p-2.5" : "p-3"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{monthLabel}</span>
        <div className="flex gap-0.5">
          <button
            type="button"
            onClick={goPrevMonth}
            disabled={!canPrevMonth}
            aria-label="Previous month"
            className="rounded-md border border-card-border px-2 py-0.5 text-xs transition hover:border-accent/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNextMonth}
            disabled={!canNextMonth}
            aria-label="Next month"
            className="rounded-md border border-card-border px-2 py-0.5 text-xs transition hover:border-accent/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium text-muted">
        {WEEKDAYS.map((label, index) => (
          <div key={`${label}-${index}`} className="py-0.5">
            {label}
          </div>
        ))}
      </div>

      <div className="mt-0.5 grid grid-cols-7 gap-0.5">
        {calendarCells.map((cell, index) => {
          if (!cell) {
            return <div key={`empty-${index}`} />;
          }

          const { dayKey, day } = cell;
          const inRange = isInRange(dayKey);
          const hasMatches = matchDays.has(dayKey);
          const isSelected = dayKey === selectedDay;
          const isToday = dayKey === todayKey;

          return (
            <button
              key={dayKey}
              type="button"
              disabled={!inRange}
              onClick={() => onDayChange(dayKey)}
              className={`relative flex ${cellSize} items-center justify-center rounded-md font-medium transition ${
                !inRange
                  ? "cursor-not-allowed text-muted/30"
                  : isSelected
                    ? "bg-accent text-foreground"
                    : isToday
                      ? "border border-accent/60 bg-accent/20 text-foreground"
                      : hasMatches
                        ? "bg-card-border/40 text-foreground hover:bg-accent/30"
                        : "text-muted hover:bg-card-border/30 hover:text-foreground"
              }`}
            >
              {day}
              {hasMatches && !isSelected && inRange && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
