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
  homeScore: number;
  awayScore: number;
  goals: MatchGoalEvent[];
  minute?: number;
  showScore: boolean;
};

function deriveScoresFromGoals(
  goals: MatchGoalEvent[]
): { homeScore: number; awayScore: number } {
  return goals.reduce(
    (acc, goal) => {
      if (goal.team === "home") acc.homeScore += 1;
      else acc.awayScore += 1;
      return acc;
    },
    { homeScore: 0, awayScore: 0 }
  );
}

export function resolveMatchDisplay(
  match: Match,
  now: Date,
  liveState: MatchLiveState | null | undefined
): MatchDisplayState {
  const staticResult = getMatchResult(match.id);
  const goals = getGoalsForDisplay(match.id, liveState);

  const live =
    liveState?.isLive || isMatchLive(match.kickoff, now);
  const finished =
    liveState?.isFinished ||
    isMatchFinished(match.kickoff, match.id, now);
  const awaitingResult =
    !finished && isMatchAwaitingResult(match.kickoff, match.id, now);

  const showScore = live || finished || awaitingResult;

  let homeScore = liveState?.homeScore;
  let awayScore = liveState?.awayScore;

  if (homeScore === undefined && staticResult) {
    homeScore = staticResult.homeScore;
    awayScore = staticResult.awayScore;
  }

  if (homeScore === undefined && goals.length > 0) {
    const derived = deriveScoresFromGoals(goals);
    homeScore = derived.homeScore;
    awayScore = derived.awayScore;
  }

  if (showScore) {
    homeScore = homeScore ?? 0;
    awayScore = awayScore ?? 0;
  } else {
    homeScore = 0;
    awayScore = 0;
  }

  return {
    finished,
    live: live && !finished,
    awaitingResult,
    homeScore,
    awayScore,
    goals,
    minute: liveState?.minute,
    showScore,
  };
}

export function hasVisibleScore(display: MatchDisplayState): boolean {
  return display.showScore;
}
