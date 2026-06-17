import { getIstDayKey } from "@/lib/match-utils";
import {
  isMatchAwaitingResult,
  isMatchFinished,
  isMatchLive,
} from "@/data/match-results";

export type MatchStage =
  | "Group Stage"
  | "Round of 32"
  | "Round of 16"
  | "Quarter-final"
  | "Semi-final"
  | "Third Place"
  | "Final";

export type Match = {
  id: string;
  stage: MatchStage;
  group?: string;
  homeTeam: string;
  awayTeam: string;
  /** ISO 8601 datetime in UTC */
  kickoff: string;
  venue: string;
  city: string;
};

/** Canonical team names used across match data */
export const TEAM_NAME_ALIASES: Record<string, string> = {
  "Korea Republic": "South Korea",
  "Côte d'Ivoire": "Ivory Coast",
  "IR Iran": "Iran",
  "Cabo Verde": "Cape Verde",
  "Congo DR": "DR Congo",
};

export function canonicalTeamName(name: string): string {
  return TEAM_NAME_ALIASES[name] ?? name;
}

/** FIFA World Cup 2026 group stage — all 72 fixtures */
export const GROUP_STAGE_MATCHES: Match[] = [
  // Group A
  { id: "A1", stage: "Group Stage", group: "A", homeTeam: "Mexico", awayTeam: "South Africa", kickoff: "2026-06-11T19:00:00Z", venue: "Mexico City Stadium", city: "Mexico City" },
  { id: "A2", stage: "Group Stage", group: "A", homeTeam: "South Korea", awayTeam: "Czechia", kickoff: "2026-06-12T02:00:00Z", venue: "Estadio Guadalajara", city: "Guadalajara" },
  { id: "A3", stage: "Group Stage", group: "A", homeTeam: "Czechia", awayTeam: "South Africa", kickoff: "2026-06-18T16:00:00Z", venue: "Atlanta Stadium", city: "Atlanta" },
  { id: "A4", stage: "Group Stage", group: "A", homeTeam: "Mexico", awayTeam: "South Korea", kickoff: "2026-06-19T01:00:00Z", venue: "Estadio Guadalajara", city: "Guadalajara" },
  { id: "A5", stage: "Group Stage", group: "A", homeTeam: "Czechia", awayTeam: "Mexico", kickoff: "2026-06-25T01:00:00Z", venue: "Mexico City Stadium", city: "Mexico City" },
  { id: "A6", stage: "Group Stage", group: "A", homeTeam: "South Africa", awayTeam: "South Korea", kickoff: "2026-06-25T01:00:00Z", venue: "Estadio Monterrey", city: "Monterrey" },
  // Group B
  { id: "B1", stage: "Group Stage", group: "B", homeTeam: "Canada", awayTeam: "Bosnia and Herzegovina", kickoff: "2026-06-12T19:00:00Z", venue: "Toronto Stadium", city: "Toronto" },
  { id: "B2", stage: "Group Stage", group: "B", homeTeam: "Qatar", awayTeam: "Switzerland", kickoff: "2026-06-13T19:00:00Z", venue: "San Francisco Bay Area Stadium", city: "San Francisco" },
  { id: "B3", stage: "Group Stage", group: "B", homeTeam: "Switzerland", awayTeam: "Bosnia and Herzegovina", kickoff: "2026-06-18T19:00:00Z", venue: "Los Angeles Stadium", city: "Los Angeles" },
  { id: "B4", stage: "Group Stage", group: "B", homeTeam: "Canada", awayTeam: "Qatar", kickoff: "2026-06-19T02:00:00Z", venue: "BC Place", city: "Vancouver" },
  { id: "B5", stage: "Group Stage", group: "B", homeTeam: "Switzerland", awayTeam: "Canada", kickoff: "2026-06-25T19:00:00Z", venue: "BC Place", city: "Vancouver" },
  { id: "B6", stage: "Group Stage", group: "B", homeTeam: "Bosnia and Herzegovina", awayTeam: "Qatar", kickoff: "2026-06-25T19:00:00Z", venue: "Lumen Field", city: "Seattle" },
  // Group C
  { id: "C1", stage: "Group Stage", group: "C", homeTeam: "Haiti", awayTeam: "Scotland", kickoff: "2026-06-14T01:00:00Z", venue: "Boston Stadium", city: "Boston" },
  { id: "C2", stage: "Group Stage", group: "C", homeTeam: "Brazil", awayTeam: "Morocco", kickoff: "2026-06-13T22:00:00Z", venue: "New York New Jersey Stadium", city: "East Rutherford" },
  { id: "C3", stage: "Group Stage", group: "C", homeTeam: "Brazil", awayTeam: "Haiti", kickoff: "2026-06-19T22:00:00Z", venue: "Philadelphia Stadium", city: "Philadelphia" },
  { id: "C4", stage: "Group Stage", group: "C", homeTeam: "Scotland", awayTeam: "Morocco", kickoff: "2026-06-19T22:00:00Z", venue: "Boston Stadium", city: "Boston" },
  { id: "C5", stage: "Group Stage", group: "C", homeTeam: "Scotland", awayTeam: "Brazil", kickoff: "2026-06-25T01:00:00Z", venue: "Miami Stadium", city: "Miami" },
  { id: "C6", stage: "Group Stage", group: "C", homeTeam: "Morocco", awayTeam: "Haiti", kickoff: "2026-06-25T01:00:00Z", venue: "Atlanta Stadium", city: "Atlanta" },
  // Group D
  { id: "D1", stage: "Group Stage", group: "D", homeTeam: "United States", awayTeam: "Paraguay", kickoff: "2026-06-13T01:00:00Z", venue: "Los Angeles Stadium", city: "Los Angeles" },
  { id: "D2", stage: "Group Stage", group: "D", homeTeam: "Australia", awayTeam: "Türkiye", kickoff: "2026-06-14T01:00:00Z", venue: "BC Place", city: "Vancouver" },
  { id: "D3", stage: "Group Stage", group: "D", homeTeam: "Türkiye", awayTeam: "Paraguay", kickoff: "2026-06-20T01:00:00Z", venue: "San Francisco Bay Area Stadium", city: "San Francisco" },
  { id: "D4", stage: "Group Stage", group: "D", homeTeam: "United States", awayTeam: "Australia", kickoff: "2026-06-20T01:00:00Z", venue: "Lumen Field", city: "Seattle" },
  { id: "D5", stage: "Group Stage", group: "D", homeTeam: "Türkiye", awayTeam: "United States", kickoff: "2026-06-26T01:00:00Z", venue: "Los Angeles Stadium", city: "Los Angeles" },
  { id: "D6", stage: "Group Stage", group: "D", homeTeam: "Paraguay", awayTeam: "Australia", kickoff: "2026-06-26T01:00:00Z", venue: "San Francisco Bay Area Stadium", city: "San Francisco" },
  // Group E
  { id: "E1", stage: "Group Stage", group: "E", homeTeam: "Ivory Coast", awayTeam: "Ecuador", kickoff: "2026-06-14T22:00:00Z", venue: "Philadelphia Stadium", city: "Philadelphia" },
  { id: "E2", stage: "Group Stage", group: "E", homeTeam: "Germany", awayTeam: "Curaçao", kickoff: "2026-06-14T17:00:00Z", venue: "Houston Stadium", city: "Houston" },
  { id: "E3", stage: "Group Stage", group: "E", homeTeam: "Germany", awayTeam: "Ivory Coast", kickoff: "2026-06-20T19:00:00Z", venue: "Toronto Stadium", city: "Toronto" },
  { id: "E4", stage: "Group Stage", group: "E", homeTeam: "Ecuador", awayTeam: "Curaçao", kickoff: "2026-06-20T22:00:00Z", venue: "Kansas City Stadium", city: "Kansas City" },
  { id: "E5", stage: "Group Stage", group: "E", homeTeam: "Curaçao", awayTeam: "Ivory Coast", kickoff: "2026-06-26T01:00:00Z", venue: "Philadelphia Stadium", city: "Philadelphia" },
  { id: "E6", stage: "Group Stage", group: "E", homeTeam: "Ecuador", awayTeam: "Germany", kickoff: "2026-06-26T01:00:00Z", venue: "New York New Jersey Stadium", city: "East Rutherford" },
  // Group F
  { id: "F1", stage: "Group Stage", group: "F", homeTeam: "Netherlands", awayTeam: "Japan", kickoff: "2026-06-14T20:00:00Z", venue: "Dallas Stadium", city: "Dallas" },
  { id: "F2", stage: "Group Stage", group: "F", homeTeam: "Sweden", awayTeam: "Tunisia", kickoff: "2026-06-15T02:00:00Z", venue: "Estadio Monterrey", city: "Monterrey" },
  { id: "F3", stage: "Group Stage", group: "F", homeTeam: "Netherlands", awayTeam: "Sweden", kickoff: "2026-06-21T01:00:00Z", venue: "Houston Stadium", city: "Houston" },
  { id: "F4", stage: "Group Stage", group: "F", homeTeam: "Tunisia", awayTeam: "Japan", kickoff: "2026-06-21T04:00:00Z", venue: "Estadio Monterrey", city: "Monterrey" },
  { id: "F5", stage: "Group Stage", group: "F", homeTeam: "Japan", awayTeam: "Sweden", kickoff: "2026-06-26T01:00:00Z", venue: "Dallas Stadium", city: "Dallas" },
  { id: "F6", stage: "Group Stage", group: "F", homeTeam: "Tunisia", awayTeam: "Netherlands", kickoff: "2026-06-26T01:00:00Z", venue: "Kansas City Stadium", city: "Kansas City" },
  // Group G
  { id: "G1", stage: "Group Stage", group: "G", homeTeam: "Belgium", awayTeam: "Egypt", kickoff: "2026-06-15T19:00:00Z", venue: "Lumen Field", city: "Seattle" },
  { id: "G2", stage: "Group Stage", group: "G", homeTeam: "Iran", awayTeam: "New Zealand", kickoff: "2026-06-15T22:00:00Z", venue: "Los Angeles Stadium", city: "Los Angeles" },
  { id: "G3", stage: "Group Stage", group: "G", homeTeam: "Belgium", awayTeam: "Iran", kickoff: "2026-06-22T01:00:00Z", venue: "Los Angeles Stadium", city: "Los Angeles" },
  { id: "G4", stage: "Group Stage", group: "G", homeTeam: "New Zealand", awayTeam: "Egypt", kickoff: "2026-06-22T01:00:00Z", venue: "BC Place", city: "Vancouver" },
  { id: "G5", stage: "Group Stage", group: "G", homeTeam: "Egypt", awayTeam: "Iran", kickoff: "2026-06-27T01:00:00Z", venue: "Lumen Field", city: "Seattle" },
  { id: "G6", stage: "Group Stage", group: "G", homeTeam: "New Zealand", awayTeam: "Belgium", kickoff: "2026-06-27T01:00:00Z", venue: "BC Place", city: "Vancouver" },
  // Group H
  { id: "H1", stage: "Group Stage", group: "H", homeTeam: "Saudi Arabia", awayTeam: "Uruguay", kickoff: "2026-06-15T22:00:00Z", venue: "Miami Stadium", city: "Miami" },
  { id: "H2", stage: "Group Stage", group: "H", homeTeam: "Spain", awayTeam: "Cape Verde", kickoff: "2026-06-15T16:00:00Z", venue: "Atlanta Stadium", city: "Atlanta" },
  { id: "H3", stage: "Group Stage", group: "H", homeTeam: "Uruguay", awayTeam: "Cape Verde", kickoff: "2026-06-22T01:00:00Z", venue: "Miami Stadium", city: "Miami" },
  { id: "H4", stage: "Group Stage", group: "H", homeTeam: "Spain", awayTeam: "Saudi Arabia", kickoff: "2026-06-22T01:00:00Z", venue: "Atlanta Stadium", city: "Atlanta" },
  { id: "H5", stage: "Group Stage", group: "H", homeTeam: "Cape Verde", awayTeam: "Saudi Arabia", kickoff: "2026-06-27T01:00:00Z", venue: "Houston Stadium", city: "Houston" },
  { id: "H6", stage: "Group Stage", group: "H", homeTeam: "Uruguay", awayTeam: "Spain", kickoff: "2026-06-27T01:00:00Z", venue: "Estadio Guadalajara", city: "Guadalajara" },
  // Group I
  { id: "I1", stage: "Group Stage", group: "I", homeTeam: "France", awayTeam: "Senegal", kickoff: "2026-06-16T19:00:00Z", venue: "New York New Jersey Stadium", city: "East Rutherford" },
  { id: "I2", stage: "Group Stage", group: "I", homeTeam: "Iraq", awayTeam: "Norway", kickoff: "2026-06-16T22:00:00Z", venue: "Boston Stadium", city: "Boston" },
  { id: "I3", stage: "Group Stage", group: "I", homeTeam: "Norway", awayTeam: "Senegal", kickoff: "2026-06-23T01:00:00Z", venue: "New York New Jersey Stadium", city: "East Rutherford" },
  { id: "I4", stage: "Group Stage", group: "I", homeTeam: "France", awayTeam: "Iraq", kickoff: "2026-06-23T01:00:00Z", venue: "Philadelphia Stadium", city: "Philadelphia" },
  { id: "I5", stage: "Group Stage", group: "I", homeTeam: "Norway", awayTeam: "France", kickoff: "2026-06-27T01:00:00Z", venue: "Boston Stadium", city: "Boston" },
  { id: "I6", stage: "Group Stage", group: "I", homeTeam: "Senegal", awayTeam: "Iraq", kickoff: "2026-06-27T01:00:00Z", venue: "Toronto Stadium", city: "Toronto" },
  // Group J
  { id: "J1", stage: "Group Stage", group: "J", homeTeam: "Argentina", awayTeam: "Algeria", kickoff: "2026-06-17T01:00:00Z", venue: "Kansas City Stadium", city: "Kansas City" },
  { id: "J2", stage: "Group Stage", group: "J", homeTeam: "Austria", awayTeam: "Jordan", kickoff: "2026-06-17T01:00:00Z", venue: "San Francisco Bay Area Stadium", city: "San Francisco" },
  { id: "J3", stage: "Group Stage", group: "J", homeTeam: "Argentina", awayTeam: "Austria", kickoff: "2026-06-23T01:00:00Z", venue: "Dallas Stadium", city: "Dallas" },
  { id: "J4", stage: "Group Stage", group: "J", homeTeam: "Jordan", awayTeam: "Algeria", kickoff: "2026-06-23T01:00:00Z", venue: "San Francisco Bay Area Stadium", city: "San Francisco" },
  { id: "J5", stage: "Group Stage", group: "J", homeTeam: "Algeria", awayTeam: "Austria", kickoff: "2026-06-28T01:00:00Z", venue: "Kansas City Stadium", city: "Kansas City" },
  { id: "J6", stage: "Group Stage", group: "J", homeTeam: "Jordan", awayTeam: "Argentina", kickoff: "2026-06-28T01:00:00Z", venue: "Dallas Stadium", city: "Dallas" },
  // Group K
  { id: "K1", stage: "Group Stage", group: "K", homeTeam: "Portugal", awayTeam: "DR Congo", kickoff: "2026-06-17T19:00:00Z", venue: "Houston Stadium", city: "Houston" },
  { id: "K2", stage: "Group Stage", group: "K", homeTeam: "Uzbekistan", awayTeam: "Colombia", kickoff: "2026-06-17T22:00:00Z", venue: "Mexico City Stadium", city: "Mexico City" },
  { id: "K3", stage: "Group Stage", group: "K", homeTeam: "Portugal", awayTeam: "Uzbekistan", kickoff: "2026-06-24T01:00:00Z", venue: "Houston Stadium", city: "Houston" },
  { id: "K4", stage: "Group Stage", group: "K", homeTeam: "Colombia", awayTeam: "DR Congo", kickoff: "2026-06-24T01:00:00Z", venue: "Estadio Guadalajara", city: "Guadalajara" },
  { id: "K5", stage: "Group Stage", group: "K", homeTeam: "Colombia", awayTeam: "Portugal", kickoff: "2026-06-28T01:00:00Z", venue: "Miami Stadium", city: "Miami" },
  { id: "K6", stage: "Group Stage", group: "K", homeTeam: "DR Congo", awayTeam: "Uzbekistan", kickoff: "2026-06-28T01:00:00Z", venue: "Atlanta Stadium", city: "Atlanta" },
  // Group L
  { id: "L1", stage: "Group Stage", group: "L", homeTeam: "Ghana", awayTeam: "Panama", kickoff: "2026-06-17T19:00:00Z", venue: "Toronto Stadium", city: "Toronto" },
  { id: "L2", stage: "Group Stage", group: "L", homeTeam: "England", awayTeam: "Croatia", kickoff: "2026-06-17T22:00:00Z", venue: "Dallas Stadium", city: "Dallas" },
  { id: "L3", stage: "Group Stage", group: "L", homeTeam: "England", awayTeam: "Ghana", kickoff: "2026-06-24T01:00:00Z", venue: "Boston Stadium", city: "Boston" },
  { id: "L4", stage: "Group Stage", group: "L", homeTeam: "Panama", awayTeam: "Croatia", kickoff: "2026-06-24T01:00:00Z", venue: "Toronto Stadium", city: "Toronto" },
  { id: "L5", stage: "Group Stage", group: "L", homeTeam: "Panama", awayTeam: "England", kickoff: "2026-06-28T01:00:00Z", venue: "New York New Jersey Stadium", city: "East Rutherford" },
  { id: "L6", stage: "Group Stage", group: "L", homeTeam: "Croatia", awayTeam: "Ghana", kickoff: "2026-06-28T01:00:00Z", venue: "Philadelphia Stadium", city: "Philadelphia" },
];

export const ALL_MATCHES: Match[] = GROUP_STAGE_MATCHES;

export function getMatchesGroupedByDay(): Map<string, Match[]> {
  const grouped = new Map<string, Match[]>();

  for (const match of ALL_MATCHES) {
    const dayKey = getIstDayKey(match.kickoff);
    const dayMatches = grouped.get(dayKey) ?? [];
    dayMatches.push(match);
    grouped.set(dayKey, dayMatches);
  }

  for (const [, matches] of grouped) {
    matches.sort(
      (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
    );
  }

  return grouped;
}

export function getMatchDays(): string[] {
  return [...getMatchesGroupedByDay().keys()].sort();
}

export function searchMatchesByTeam(query: string): Match[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return ALL_MATCHES.filter(
    (match) =>
      match.homeTeam.toLowerCase().includes(normalized) ||
      match.awayTeam.toLowerCase().includes(normalized)
  ).sort(
    (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
  );
}

export function getTournamentDateRange(): { min: string; max: string } {
  const days = getMatchDays();
  return { min: days[0], max: days[days.length - 1] };
}

/** Pick the calendar day that best matches what the user should see right now */
export function getDefaultSelectedDay(
  now: Date,
  matchesByDay: Map<string, Match[]>,
  dateRange: { min: string; max: string },
  matchDays: string[]
): string {
  const today = getIstDayKey(now.toISOString());

  if (today < dateRange.min) return matchDays[0];
  if (today > dateRange.max) return matchDays[matchDays.length - 1];

  const nextMatch = getNextUpcomingMatch(now);
  if (nextMatch) {
    return getIstDayKey(nextMatch.kickoff);
  }

  const liveToday = getLiveMatchesForDay(matchesByDay.get(today) ?? [], now);
  if (liveToday.length > 0) return today;

  const hasTodayMatches = (matchesByDay.get(today)?.length ?? 0) > 0;
  if (hasTodayMatches) return today;

  return matchDays.find((day) => day >= today) ?? matchDays[0];
}

export function getNextUpcomingMatch(now: Date = new Date()): Match | null {
  return getUpcomingMatches(1, now)[0] ?? null;
}

export function getUpcomingMatches(
  limit: number,
  now: Date = new Date()
): Match[] {
  return ALL_MATCHES.filter(
    (match) =>
      !isMatchFinished(match.kickoff, match.id, now) &&
      new Date(match.kickoff) >= now
  )
    .sort(
      (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
    )
    .slice(0, limit);
}

export function getUpcomingMatchesForDay(
  matches: Match[],
  now: Date = new Date()
): Match[] {
  return matches
    .filter(
      (match) =>
        !isMatchFinished(match.kickoff, match.id, now) &&
        new Date(match.kickoff) >= now
    )
    .sort(
      (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
    );
}

export function getLiveMatchesForDay(
  matches: Match[],
  now: Date = new Date()
): Match[] {
  return matches
    .filter(
      (match) =>
        isMatchLive(match.kickoff, now) &&
        !isMatchFinished(match.kickoff, match.id, now)
    )
    .sort(
      (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
    );
}

export function getAllLiveMatches(now: Date = new Date()): Match[] {
  return getLiveMatchesForDay(ALL_MATCHES, now);
}

export function getFinishedMatchesForDay(
  matches: Match[],
  now: Date = new Date()
): Match[] {
  return matches.filter((match) =>
    isMatchFinished(match.kickoff, match.id, now)
  );
}

export function getAwaitingResultMatchesForDay(
  matches: Match[],
  now: Date = new Date()
): Match[] {
  return matches
    .filter((match) =>
      isMatchAwaitingResult(match.kickoff, match.id, now)
    )
    .sort(
      (a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
    );
}
