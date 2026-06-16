import { GROUP_STAGE_MATCHES } from "@/data/matches";
import { getMatchResult, isMatchFinished } from "@/data/match-results";

export type StandingRow = {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
};

function getTeamsInGroup(group: string): string[] {
  const teams = new Set<string>();
  for (const match of GROUP_STAGE_MATCHES) {
    if (match.group !== group) continue;
    teams.add(match.homeTeam);
    teams.add(match.awayTeam);
  }
  return Array.from(teams).sort();
}

function emptyStanding(team: string): StandingRow {
  return {
    team,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
    points: 0,
  };
}

export function getGroupStandings(
  group: string,
  now: Date = new Date()
): StandingRow[] {
  const table = new Map(
    getTeamsInGroup(group).map((team) => [team, emptyStanding(team)])
  );

  const groupMatches = GROUP_STAGE_MATCHES.filter((m) => m.group === group);

  for (const match of groupMatches) {
    if (!isMatchFinished(match.kickoff, match.id, now)) continue;
    const result = getMatchResult(match.id);
    if (!result) continue;

    const home = table.get(match.homeTeam);
    const away = table.get(match.awayTeam);
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;
    home.goalsFor += result.homeScore;
    home.goalsAgainst += result.awayScore;
    away.goalsFor += result.awayScore;
    away.goalsAgainst += result.homeScore;

    if (result.homeScore > result.awayScore) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (result.homeScore < result.awayScore) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  return Array.from(table.values())
    .map((row) => ({
      ...row,
      goalDiff: row.goalsFor - row.goalsAgainst,
    }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDiff - a.goalDiff ||
        b.goalsFor - a.goalsFor ||
        a.team.localeCompare(b.team)
    );
}
