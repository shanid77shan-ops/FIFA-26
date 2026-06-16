import { ALL_MATCHES, type Match } from "@/data/matches";

function normalizeTeamName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function findLocalMatchByTeams(
  homeName: string,
  awayName: string
): Match | undefined {
  const home = normalizeTeamName(homeName);
  const away = normalizeTeamName(awayName);

  return ALL_MATCHES.find(
    (match) =>
      normalizeTeamName(match.homeTeam) === home &&
      normalizeTeamName(match.awayTeam) === away
  );
}
