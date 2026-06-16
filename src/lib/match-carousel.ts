import type { Match } from "@/data/matches";
import { getTeamAbbreviation } from "@/lib/team-display";
import { formatIndianTime } from "@/lib/match-utils";
import type { MatchData } from "@/types/sportmonks";

function hashMatchId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) || 1;
}

export function scheduleMatchToMatchData(
  match: Match,
  options: {
    isLive?: boolean;
    homeScore?: number;
    awayScore?: number;
    goals?: import("@/types/match-live").MatchGoalEvent[];
    minute?: number;
  } = {}
): MatchData {
  const {
    isLive = false,
    homeScore = 0,
    awayScore = 0,
    goals,
    minute,
  } = options;

  return {
    fixtureId: hashMatchId(match.id),
    homeTeam: {
      name: match.homeTeam,
      abbreviation: getTeamAbbreviation(match.homeTeam),
      score: homeScore,
    },
    awayTeam: {
      name: match.awayTeam,
      abbreviation: getTeamAbbreviation(match.awayTeam),
      score: awayScore,
    },
    isLive,
    tournament: match.group
      ? `Group ${match.group} · FIFA World Cup 2026`
      : `${match.stage} · FIFA World Cup 2026`,
    kickoff: match.kickoff,
    kickoffLabel: formatIndianTime(match.kickoff),
    matchId: match.id,
    goals,
    minute,
  };
}

export function mergeCarouselMatches(
  live: MatchData[],
  upcoming: MatchData[]
): MatchData[] {
  const seen = new Set<string>();
  const merged: MatchData[] = [];

  for (const match of live) {
    const key = `${match.homeTeam.name}-${match.awayTeam.name}`;
    seen.add(key);
    merged.push(match);
  }

  for (const match of upcoming) {
    const key = `${match.homeTeam.name}-${match.awayTeam.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(match);
  }

  return merged;
}
