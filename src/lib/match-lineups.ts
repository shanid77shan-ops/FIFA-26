import { resolveKeyPlayer } from "@/data/team-key-players";
import { getTeamAbbreviation } from "@/lib/team-display";

export type LineupPlayer = {
  number: number;
  name: string;
  role: string;
  isStar?: boolean;
};

const FORMATION_433: { number: number; role: string; star?: boolean }[] = [
  { number: 1, role: "GK" },
  { number: 2, role: "RB" },
  { number: 3, role: "CB" },
  { number: 4, role: "CB" },
  { number: 5, role: "LB" },
  { number: 6, role: "CM" },
  { number: 8, role: "CM" },
  { number: 10, role: "CAM", star: true },
  { number: 7, role: "RW" },
  { number: 9, role: "ST" },
  { number: 11, role: "LW" },
];

export function getTeamLineup(teamName: string): LineupPlayer[] {
  const star = resolveKeyPlayer(teamName);
  const code = getTeamAbbreviation(teamName);

  return FORMATION_433.map((slot) => ({
    number: slot.number,
    role: slot.role,
    name: slot.star
      ? (star?.name ?? `${code} Captain`)
      : `${code} ${slot.role}`,
    isStar: slot.star,
  }));
}

export function getMatchLineups(homeTeam: string, awayTeam: string) {
  return {
    home: getTeamLineup(homeTeam),
    away: getTeamLineup(awayTeam),
    formation: "4-3-3",
  };
}
