"use client";

import type { Match } from "@/data/matches";
import { ScheduleMatchCard } from "@/components/ScheduleMatchCard";
import {
  formatIndianTime,
  formatMatchDate,
  getCountdownLabel,
  getIstDayKey,
} from "@/lib/match-utils";

type UpNextMatchSectionProps = {
  match: Match;
  now: Date;
  todayKey: string;
  expanded: boolean;
  onExpandedChange: (matchId: string, open: boolean) => void;
};

export function UpNextMatchSection({
  match,
  now,
  todayKey,
  expanded,
  onExpandedChange,
}: UpNextMatchSectionProps) {
  const matchDay = getIstDayKey(match.kickoff);
  const countdown = getCountdownLabel(match.kickoff, now);

  return (
    <section className="mb-6" aria-label="Up next match">
      <h2 className="mb-1 text-lg font-semibold">Up next</h2>
      <p className="mb-3 text-xs text-muted">
        {formatMatchDate(match.kickoff)} · {formatIndianTime(match.kickoff)} ·{" "}
        <span className="font-medium text-accent">{countdown}</span>
        {matchDay !== todayKey && (
          <span> · {matchDay > todayKey ? "Upcoming day" : "Earlier today"}</span>
        )}
      </p>
      <ScheduleMatchCard
        match={match}
        now={now}
        expanded={expanded}
        onExpandedChange={onExpandedChange}
      />
    </section>
  );
}
