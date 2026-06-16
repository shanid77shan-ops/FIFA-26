import type { Match } from "@/data/matches";
import {
  getMatchResult,
  isMatchAwaitingResult,
  isMatchFinished,
  isMatchLive,
} from "@/data/match-results";
import { getGoalsForDisplay } from "@/lib/match-live-state";
import type { MatchGoalEvent, MatchLiveState } from "@/types/match-live";

export type MatchDisplayState = {
  finished: boolean;
  live: boolean;
  awaitingResult: boolean;
  homeScore?: number;
  awayScore?: number;
  goals: MatchGoalEvent[];
  minute?: number;
};

export function resolveMatchDisplay(
  match: Match,
  now: Date,
  liveState: MatchLiveState | null | undefined
): MatchDisplayState {
  const staticResult = getMatchResult(match.id);
  const finished =
    liveState?.isFinished ||
    isMatchFinished(match.kickoff, match.id, now);
  const live =
    liveState?.isLive || (!finished && isMatchLive(match.kickoff, now));
  const awaitingResult =
    !finished && isMatchAwaitingResult(match.kickoff, match.id, now);

  const goals = getGoalsForDisplay(match.id, liveState);

  let homeScore = liveState?.homeScore;
  let awayScore = liveState?.awayScore;

  if (homeScore === undefined && staticResult) {
    homeScore = staticResult.homeScore;
    awayScore = staticResult.awayScore;
  }

  const hasScore =
    homeScore !== undefined &&
    awayScore !== undefined &&
    (finished || live || awaitingResult || goals.length > 0);

  return {
    finished,
    live,
    awaitingResult,
    homeScore: hasScore ? homeScore : undefined,
    awayScore: hasScore ? awayScore : undefined,
    goals,
    minute: liveState?.minute,
  };
}

export function hasVisibleScore(display: MatchDisplayState): boolean {
  return display.homeScore !== undefined && display.awayScore !== undefined;
}
