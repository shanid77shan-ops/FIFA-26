"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MatchCalendar } from "@/components/MatchCalendar";
import {
  addDaysToDayKey,
  formatSelectedDayHeading,
} from "@/lib/match-utils";

function CalendarIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

type DateNavigationProps = {
  selectedDay: string;
  minDate: string;
  maxDate: string;
  todayKey: string;
  matchDays: string[];
  onDayChange: (day: string) => void;
};

type CalendarPosition = {
  top: number;
  left: number;
  width: number;
};

export function DateNavigation({
  selectedDay,
  minDate,
  maxDate,
  todayKey,
  matchDays,
  onDayChange,
}: DateNavigationProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<CalendarPosition>({
    top: 0,
    left: 0,
    width: 320,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const matchDaySet = useMemo(() => new Set(matchDays), [matchDays]);
  const canGoPrev = selectedDay > minDate;
  const canGoNext = selectedDay < maxDate;

  useEffect(() => {
    setMounted(true);
  }, []);

  function updateCalendarPosition() {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 32);
    const left = Math.min(
      Math.max(rect.left + rect.width / 2, 16 + width / 2),
      window.innerWidth - 16 - width / 2
    );

    setPosition({
      top: rect.bottom + 8,
      left,
      width,
    });
  }

  useEffect(() => {
    if (!calendarOpen) return;

    updateCalendarPosition();

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        containerRef.current?.contains(target) ||
        portalRef.current?.contains(target)
      ) {
        return;
      }
      setCalendarOpen(false);
    }

    function handleReposition() {
      updateCalendarPosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [calendarOpen]);

  function goToPreviousDay() {
    if (!canGoPrev) return;
    onDayChange(addDaysToDayKey(selectedDay, -1));
  }

  function goToNextDay() {
    if (!canGoNext) return;
    onDayChange(addDaysToDayKey(selectedDay, 1));
  }

  function handleCalendarSelect(day: string) {
    onDayChange(day);
    setCalendarOpen(false);
  }

  function toggleCalendar() {
    setCalendarOpen((open) => {
      if (!open) {
        updateCalendarPosition();
      }
      return !open;
    });
  }

  const calendarPortal =
    mounted && calendarOpen
      ? createPortal(
          <div
            ref={portalRef}
            className="fixed z-[9999]"
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
              transform: "translateX(-50%)",
            }}
          >
            <MatchCalendar
              selectedDay={selectedDay}
              minDate={minDate}
              maxDate={maxDate}
              todayKey={todayKey}
              matchDays={matchDaySet}
              onDayChange={handleCalendarSelect}
              compact
            />
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div
        ref={containerRef}
        className={`rounded-2xl border border-card-border bg-card/80 p-3 shadow-lg sm:p-4 ${
          calendarOpen ? "relative z-50" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPreviousDay}
            disabled={!canGoPrev}
            aria-label="Previous day"
            className="shrink-0 rounded-xl border border-card-border bg-background/60 px-3 py-2.5 text-sm font-semibold transition hover:border-accent/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ←
          </button>

          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={toggleCalendar}
              aria-expanded={calendarOpen}
              aria-label="Open calendar to pick a date"
              className="flex w-full items-center rounded-xl border border-card-border bg-background/60 px-3 py-2.5 text-left transition hover:border-accent/50"
            >
              <span className="min-w-0 truncate text-sm font-semibold text-foreground">
                {formatSelectedDayHeading(selectedDay, todayKey)}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={goToNextDay}
            disabled={!canGoNext}
            aria-label="Next day"
            className="shrink-0 rounded-xl bg-accent px-3 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </button>

          <button
            ref={triggerRef}
            type="button"
            onClick={toggleCalendar}
            aria-expanded={calendarOpen}
            aria-label="Open calendar"
            className="shrink-0 rounded-xl border border-card-border bg-background/60 p-2.5 text-foreground transition hover:border-accent/50"
          >
            <CalendarIcon className="h-5 w-5" />
          </button>
        </div>

        {selectedDay !== todayKey && (
          <button
            type="button"
            onClick={() => onDayChange(todayKey)}
            className="mt-2 w-full rounded-lg border border-accent/30 py-1.5 text-xs font-semibold text-muted transition hover:border-accent/50 hover:text-foreground"
          >
            Back to today
          </button>
        )}
      </div>

      {calendarPortal}
    </>
  );
}
