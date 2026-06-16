"use client";

import { useState } from "react";
import type { Match } from "@/data/matches";
import { GoalEventsTimeline, GoalScorersList } from "@/components/GoalScorersList";
import { getGroupStandings } from "@/lib/group-standings";
import type { MatchDisplayState } from "@/lib/match-display";
import { hasVisibleScore } from "@/lib/match-display";
import { getMatchLineups } from "@/lib/match-lineups";
import { getTeamAbbreviation, getTeamFlag } from "@/lib/team-display";
import { formatIndianTime } from "@/lib/match-utils";

type DetailTab = "ticker" | "lineup" | "stats" | "points";

const TABS: { id: DetailTab; label: string }[] = [
  { id: "ticker", label: "Live Ticker" },
  { id: "lineup", label: "Line-up" },
  { id: "stats", label: "Stats" },
  { id: "points", label: "Points Table" },
];

type MatchDetailPanelProps = {
  match: Match;
  now: Date;
  display: MatchDisplayState;
};

function TabBar({
  active,
  onChange,
}: {
  active: DetailTab;
  onChange: (tab: DetailTab) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 border-t border-white/10 bg-black/40 px-3 py-3 sm:px-4">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange(tab.id);
          }}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
            active === tab.id
              ? "bg-white text-black"
              : "border border-white/30 bg-transparent text-white hover:border-white/60"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div
        className="mb-4 h-16 w-16 rounded-full bg-white/5"
        aria-hidden="true"
      />
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}

function LiveTickerTab({
  match,
  display,
}: {
  match: Match;
  display: MatchDisplayState;
}) {
  const hasActivity =
    display.live ||
    display.finished ||
    display.awaitingResult ||
    display.goals.length > 0;

  if (!hasActivity) {
    return (
      <EmptyState message="Live ticker updates once the match kicks off. Data refreshes every 15 seconds." />
    );
  }

  return (
    <div className="space-y-3 py-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">
        Goal scorers
      </p>
      <GoalScorersList
        goals={display.goals}
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
      />
      <p className="pt-2 text-xs font-medium uppercase tracking-wider text-muted">
        Match timeline
      </p>
      <GoalEventsTimeline
        goals={display.goals}
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
      />
      {hasVisibleScore(display) && (
        <ul className="space-y-2 border-t border-white/10 pt-3 text-sm">
          {(display.finished || display.awaitingResult) && (
            <li className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
              <span className="text-muted">FT</span>
              <span className="font-semibold text-white">
                Full Time · {display.homeScore} – {display.awayScore}
              </span>
            </li>
          )}
          <li className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
            <span className="text-muted">0&apos;</span>
            <span className="text-white">
              Kick-off · {formatIndianTime(match.kickoff)} IST
            </span>
          </li>
        </ul>
      )}
    </div>
  );
}

function LineUpTab({ homeTeam, awayTeam }: { homeTeam: string; awayTeam: string }) {
  const { home, away, formation } = getMatchLineups(homeTeam, awayTeam);

  return (
    <div className="py-4">
      <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-muted">
        Formation {formation}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <LineupColumn team={homeTeam} players={home} />
        <LineupColumn team={awayTeam} players={away} align="right" />
      </div>
      <p className="mt-4 text-center text-xs text-muted">
        Star players confirmed · full squads announced closer to kick-off
      </p>
    </div>
  );
}

function LineupColumn({
  team,
  players,
  align = "left",
}: {
  team: string;
  players: ReturnType<typeof getMatchLineups>["home"];
  align?: "left" | "right";
}) {
  return (
    <div>
      <p
        className={`mb-2 flex items-center gap-1.5 text-sm font-bold text-white ${
          align === "right" ? "justify-end" : ""
        }`}
      >
        <span aria-hidden="true">{getTeamFlag(team)}</span>
        {getTeamAbbreviation(team)}
      </p>
      <ul className="space-y-1.5">
        {players.map((player) => (
          <li
            key={`${team}-${player.number}`}
            className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs sm:text-sm ${
              player.isStar
                ? "bg-accent/30 font-semibold text-white"
                : "bg-white/5 text-white/90"
            } ${align === "right" ? "flex-row-reverse text-right" : ""}`}
          >
            <span className="w-5 shrink-0 text-muted">{player.number}</span>
            <span className="min-w-0 flex-1 truncate">{player.name}</span>
            <span className="shrink-0 text-[10px] uppercase text-muted">
              {player.role}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatsTab({
  match,
  display,
  now,
}: {
  match: Match;
  display: MatchDisplayState;
  now: Date;
}) {
  const standings = match.group ? getGroupStandings(match.group, now) : [];
  const homeRow = standings.find((r) => r.team === match.homeTeam);
  const awayRow = standings.find((r) => r.team === match.awayTeam);

  if (!hasVisibleScore(display)) {
    return (
      <div className="py-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
          Group form so far
        </p>
        <div className="grid grid-cols-2 gap-3">
          <TeamFormCard team={match.homeTeam} row={homeRow} />
          <TeamFormCard team={match.awayTeam} row={awayRow} />
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          Full match stats available after kick-off
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <StatCell label={match.homeTeam} value={String(display.homeScore)} />
        <StatCell label="Goals" value="⚽" muted />
        <StatCell label={match.awayTeam} value={String(display.awayScore)} />
      </div>
      {display.goals.length > 0 && (
        <GoalScorersList
          goals={display.goals}
          homeTeam={match.homeTeam}
          awayTeam={match.awayTeam}
          compact
        />
      )}
      <div className="grid grid-cols-2 gap-3">
        <TeamFormCard team={match.homeTeam} row={homeRow} />
        <TeamFormCard team={match.awayTeam} row={awayRow} />
      </div>
    </div>
  );
}

function StatCell({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="rounded-lg bg-white/5 px-2 py-3">
      <p className="truncate text-[10px] uppercase text-muted">{label}</p>
      <p className={`mt-1 text-lg font-bold ${muted ? "text-muted" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function TeamFormCard({
  team,
  row,
}: {
  team: string;
  row?: ReturnType<typeof getGroupStandings>[number];
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-white">
        <span aria-hidden="true">{getTeamFlag(team)}</span>
        {team}
      </p>
      {row ? (
        <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted">
          <dt>Played</dt>
          <dd className="text-right text-white">{row.played}</dd>
          <dt>W-D-L</dt>
          <dd className="text-right text-white">
            {row.won}-{row.drawn}-{row.lost}
          </dd>
          <dt>Goals</dt>
          <dd className="text-right text-white">
            {row.goalsFor}:{row.goalsAgainst}
          </dd>
          <dt>Points</dt>
          <dd className="text-right font-bold text-accent">{row.points}</dd>
        </dl>
      ) : (
        <p className="text-xs text-muted">No group games played yet</p>
      )}
    </div>
  );
}

function PointsTableTab({
  group,
  homeTeam,
  awayTeam,
  now,
}: {
  group?: string;
  homeTeam: string;
  awayTeam: string;
  now: Date;
}) {
  if (!group) {
    return (
      <EmptyState message="Points table is only available for group-stage matches." />
    );
  }

  const standings = getGroupStandings(group, now);

  return (
    <div className="overflow-x-auto py-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
        Group {group} standings
      </p>
      <table className="w-full min-w-[320px] text-left text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-white/10 text-muted">
            <th className="pb-2 pr-2 font-medium">#</th>
            <th className="pb-2 pr-2 font-medium">Team</th>
            <th className="pb-2 px-1 text-center font-medium">P</th>
            <th className="pb-2 px-1 text-center font-medium">W</th>
            <th className="pb-2 px-1 text-center font-medium">D</th>
            <th className="pb-2 px-1 text-center font-medium">L</th>
            <th className="pb-2 px-1 text-center font-medium">GD</th>
            <th className="pb-2 pl-1 text-center font-medium">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, index) => {
            const isMatchTeam =
              row.team === homeTeam || row.team === awayTeam;
            return (
              <tr
                key={row.team}
                className={`border-b border-white/5 ${
                  isMatchTeam ? "bg-accent/15" : ""
                }`}
              >
                <td className="py-2 pr-2 text-muted">{index + 1}</td>
                <td className="py-2 pr-2 font-medium text-white">
                  <span className="mr-1" aria-hidden="true">
                    {getTeamFlag(row.team)}
                  </span>
                  {row.team}
                </td>
                <td className="py-2 px-1 text-center text-white">{row.played}</td>
                <td className="py-2 px-1 text-center text-white">{row.won}</td>
                <td className="py-2 px-1 text-center text-white">{row.drawn}</td>
                <td className="py-2 px-1 text-center text-white">{row.lost}</td>
                <td className="py-2 px-1 text-center text-white">
                  {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                </td>
                <td className="py-2 pl-1 text-center font-bold text-white">
                  {row.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-muted">
        Top 2 teams advance from each group
      </p>
    </div>
  );
}

export function MatchDetailPanel({ match, now, display }: MatchDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("ticker");

  return (
    <div className="border-t border-white/10">
      <TabBar active={activeTab} onChange={setActiveTab} />
      <div className="px-3 sm:px-4">
        {activeTab === "ticker" && (
          <LiveTickerTab match={match} display={display} />
        )}
        {activeTab === "lineup" && (
          <LineUpTab homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
        )}
        {activeTab === "stats" && (
          <StatsTab match={match} display={display} now={now} />
        )}
        {activeTab === "points" && (
          <PointsTableTab
            group={match.group}
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            now={now}
          />
        )}
      </div>
    </div>
  );
}
