import { getStaticGoalsForMatch } from "@/data/match-goals";
import { MATCH_RESULTS } from "@/data/match-results";
import { ALL_MATCHES } from "@/data/matches";
import { findLocalMatchByTeams } from "@/lib/match-team-map";
import {
  mapFixtureToMatchData,
  type ParsedFixtureState,
  parseFixtureState,
} from "@/lib/sportmonks";
import type { MatchGoalEvent, MatchLiveState } from "@/types/match-live";
import type { MatchData, SportmonksFixture } from "@/types/sportmonks";

function buildStaticState(matchId: string, now: Date): MatchLiveState | null {
  const result = MATCH_RESULTS[matchId];
  if (!result) return null;

  return {
    matchId,
    homeScore: result.homeScore,
    awayScore: result.awayScore,
    goals: getStaticGoalsForMatch(matchId),
    isLive: false,
    isFinished: true,
    source: "static",
    updatedAt: now.toISOString(),
  };
}

function buildAllStaticStates(now: Date): Record<string, MatchLiveState> {
  const states: Record<string, MatchLiveState> = {};
  for (const matchId of Object.keys(MATCH_RESULTS)) {
    const state = buildStaticState(matchId, now);
    if (state) states[matchId] = state;
  }
  return states;
}

function fixtureToLiveState(
  fixture: SportmonksFixture,
  parsed: ParsedFixtureState,
  now: Date
): MatchLiveState | null {
  const matchData = mapFixtureToMatchData(fixture, parsed);
  const localMatch =
    (matchData.matchId
      ? ALL_MATCHES.find((m) => m.id === matchData.matchId)
      : undefined) ??
    findLocalMatchByTeams(matchData.homeTeam.name, matchData.awayTeam.name);

  if (!localMatch) return null;

  return {
    matchId: localMatch.id,
    homeScore: matchData.homeTeam.score,
    awayScore: matchData.awayTeam.score,
    goals: parsed.goals,
    isLive: parsed.isLive,
    isFinished: parsed.isFinished,
    minute: parsed.minute,
    source: "sportmonks",
    updatedAt: now.toISOString(),
  };
}

function mergeLiveStates(
  base: Record<string, MatchLiveState>,
  incoming: MatchLiveState[]
): Record<string, MatchLiveState> {
  const merged = { ...base };

  for (const state of incoming) {
    const existing = merged[state.matchId];
    if (!existing) {
      merged[state.matchId] = state;
      continue;
    }

    if (state.source === "sportmonks" && (state.isLive || state.isFinished)) {
      merged[state.matchId] = state;
    }
  }

  return merged;
}

export function buildMatchUpdatesFromFixtures(
  fixtures: SportmonksFixture[],
  now: Date = new Date()
): {
  byMatchId: Record<string, MatchLiveState>;
  liveMatches: MatchData[];
} {
  const staticStates = buildAllStaticStates(now);
  const sportmonksStates: MatchLiveState[] = [];
  const liveMatches: MatchData[] = [];

  for (const fixture of fixtures) {
    const parsed = parseFixtureState(fixture);
    const liveState = fixtureToLiveState(fixture, parsed, now);
    if (liveState) {
      sportmonksStates.push(liveState);
    }

    if (parsed.isLive || parsed.isFinished) {
      const matchData = mapFixtureToMatchData(fixture, parsed);
      const localMatch = findLocalMatchByTeams(
        matchData.homeTeam.name,
        matchData.awayTeam.name
      );
      liveMatches.push({
        ...matchData,
        matchId: localMatch?.id ?? matchData.matchId,
        goals: parsed.goals,
        minute: parsed.minute,
      });
    }
  }

  const byMatchId = mergeLiveStates(staticStates, sportmonksStates);

  const dedupedLive = dedupeLiveMatches(liveMatches);

  return { byMatchId, liveMatches: dedupedLive };
}

function dedupeLiveMatches(matches: MatchData[]): MatchData[] {
  const seen = new Set<string>();
  const result: MatchData[] = [];

  for (const match of matches) {
    const key =
      match.matchId ??
      `${match.homeTeam.name}-${match.awayTeam.name}-${match.fixtureId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(match);
  }

  return result;
}

export function getGoalsForDisplay(
  matchId: string,
  liveState: MatchLiveState | null | undefined
): MatchGoalEvent[] {
  if (liveState?.goals.length) {
    return liveState.goals;
  }
  return getStaticGoalsForMatch(matchId);
}
