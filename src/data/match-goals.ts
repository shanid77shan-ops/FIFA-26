import { ALL_MATCHES } from "@/data/matches";
import { MATCH_RESULTS } from "@/data/match-results";
import { resolveKeyPlayer } from "@/data/team-key-players";
import type { MatchGoalEvent } from "@/types/match-live";

const HOME_MINUTES = [12, 34, 56, 78, 88];
const AWAY_MINUTES = [19, 41, 63, 85, 90];

function scorerName(teamName: string, index: number): string {
  const star = resolveKeyPlayer(teamName);
  if (star && index === 0) return star.name;
  const code = teamName.slice(0, 3).toUpperCase();
  return `${code} Player ${index + 1}`;
}

export function getStaticGoalsForMatch(matchId: string): MatchGoalEvent[] {
  const result = MATCH_RESULTS[matchId];
  const match = ALL_MATCHES.find((m) => m.id === matchId);
  if (!result || !match) return [];

  const goals: MatchGoalEvent[] = [];

  for (let i = 0; i < result.homeScore; i++) {
    goals.push({
      minute: HOME_MINUTES[i] ?? 45 + i * 5,
      player: scorerName(match.homeTeam, i),
      team: "home",
    });
  }

  for (let i = 0; i < result.awayScore; i++) {
    goals.push({
      minute: AWAY_MINUTES[i] ?? 50 + i * 5,
      player: scorerName(match.awayTeam, i),
      team: "away",
    });
  }

  return goals.sort((a, b) => a.minute - b.minute);
}
