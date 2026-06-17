"use client";

import { useState } from "react";
import type { Match } from "@/data/matches";
import { GoalScorersList } from "@/components/GoalScorersList";
import { useMatchUpdates } from "@/components/MatchUpdatesProvider";
import { MatchBanner } from "@/components/MatchBanner";
import { MatchDetailPanel } from "@/components/MatchDetailPanel";
import {
  resolveMatchDisplay,
} from "@/lib/match-display";
import {
  formatIndianTime,
  formatLocalTime,
  formatMatchDate,
} from "@/lib/match-utils";

type ScheduleMatchCardProps = {
  match: Match;
  compact?: boolean;
  now?: Date;
  expanded?: boolean;
  onExpandedChange?: (matchId: string, expanded: boolean) => void;
};

export function ScheduleMatchCard({
  match,
  compact = false,
  now = new Date(),
  expanded: expandedProp,
  onExpandedChange,
}: ScheduleMatchCardProps) {
  const [expandedInternal, setExpandedInternal] = useState(false);
  const expanded = expandedProp ?? expandedInternal;
  const { getState } = useMatchUpdates();
  const liveState = getState(match.id);
  const display = resolveMatchDisplay(match, now, liveState);

  const setExpanded = (next: boolean) => {
    if (expandedProp === undefined) {
      setExpandedInternal(next);
    }
    onExpandedChange?.(match.id, next);
  };

  return (
    <article
      id={`match-${match.id}`}
      className="overflow-hidden rounded-2xl border border-card-border bg-gradient-to-br from-[#2a1040]/90 via-card/95 to-card/90 shadow-lg scroll-mt-24"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full text-left transition hover:bg-white/[0.02]"
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-black/30 px-4 py-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            {match.stage}
            {match.group ? ` · Group ${match.group}` : ""}
          </span>
          <div className="flex items-center gap-2">
            {display.live ? (
              <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold uppercase text-white">
                <span
                  className="h-2 w-2 animate-pulse rounded-full bg-white"
                  aria-hidden="true"
                />
                Live{display.minute ? ` · ${display.minute}'` : ""}
              </span>
            ) : display.finished ? (
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold uppercase text-muted">
                Full Time
              </span>
            ) : display.awaitingResult ? (
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold uppercase text-muted">
                Full Time
              </span>
            ) : (
              <time
                dateTime={match.kickoff}
                className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-black"
              >
                <span
                  className="h-2 w-2 rounded-full bg-red-600"
                  aria-hidden="true"
                />
                {formatIndianTime(match.kickoff)}
              </time>
            )}
            <span className="text-muted" aria-hidden="true">
              {expanded ? "▲" : "▼"}
            </span>
          </div>
        </div>

        <div className="px-3 py-4 sm:px-4">
          <MatchBanner
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            homeScore={display.showScore ? display.homeScore : undefined}
            awayScore={display.showScore ? display.awayScore : undefined}
            goals={display.goals}
          />

          {display.showScore && (
            <p className="mt-2 text-center text-sm font-semibold text-accent">
              {display.finished || display.awaitingResult ? "Final" : "Live"}:{" "}
              {display.homeScore} – {display.awayScore}
            </p>
          )}

          {display.goals.length > 0 && !display.showScore && (
            <GoalScorersList
              goals={display.goals}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              compact
              className="mt-2"
            />
          )}

          <p className="mt-2 text-center text-xs text-muted">
            {expanded ? "Tap to collapse" : "Tap for scorers, line-up & stats"}
          </p>
        </div>
      </button>

      {expanded && (
        <MatchDetailPanel match={match} now={now} display={display} />
      )}

      {!compact && !expanded && (
        <div className="space-y-1.5 border-t border-white/10 bg-black/20 px-4 py-3 text-sm text-muted">
          <p>
            <span className="font-medium text-foreground">Date:</span>{" "}
            {formatMatchDate(match.kickoff)}
          </p>
          <p>
            <span className="font-medium text-foreground">India time (IST):</span>{" "}
            {formatIndianTime(match.kickoff)}
          </p>
          <p>
            <span className="font-medium text-foreground">Local time:</span>{" "}
            {formatLocalTime(match.kickoff)}
          </p>
          <p>
            <span className="font-medium text-foreground">Venue:</span>{" "}
            {match.venue}, {match.city}
          </p>
        </div>
      )}
    </article>
  );
}
