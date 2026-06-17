/** Final scores for completed group-stage matches */
export const MATCH_RESULTS: Record<
  string,
  { homeScore: number; awayScore: number }
> = {
  A1: { homeScore: 2, awayScore: 0 },
  A2: { homeScore: 2, awayScore: 1 },
  B1: { homeScore: 1, awayScore: 1 },
  B2: { homeScore: 1, awayScore: 1 },
  C1: { homeScore: 0, awayScore: 1 },
  C2: { homeScore: 1, awayScore: 1 },
  D1: { homeScore: 4, awayScore: 1 },
  D2: { homeScore: 2, awayScore: 0 },
  E1: { homeScore: 1, awayScore: 0 },
  E2: { homeScore: 7, awayScore: 1 },
  F1: { homeScore: 2, awayScore: 2 },
  F2: { homeScore: 5, awayScore: 1 },
  G1: { homeScore: 1, awayScore: 1 },
  H1: { homeScore: 1, awayScore: 0 },
  H2: { homeScore: 0, awayScore: 0 },
  I2: { homeScore: 1, awayScore: 4 },
};

export const MATCH_DURATION_MS = 105 * 60 * 1000;

export function getMatchResult(matchId: string) {
  return MATCH_RESULTS[matchId] ?? null;
}

export function isMatchFinished(
  kickoff: string,
  matchId: string,
  now: Date = new Date()
): boolean {
  const kickoffTime = new Date(kickoff).getTime();
  const pastEnd = now.getTime() >= kickoffTime + MATCH_DURATION_MS;
  return pastEnd && matchId in MATCH_RESULTS;
}

/** Match has kicked off and is within the regulation window */
export function isMatchLive(
  kickoff: string,
  now: Date = new Date()
): boolean {
  const kickoffTime = new Date(kickoff).getTime();
  const elapsed = now.getTime() - kickoffTime;
  return elapsed >= 0 && elapsed < MATCH_DURATION_MS;
}

/** Full time has passed but no final score is recorded yet */
export function isMatchAwaitingResult(
  kickoff: string,
  matchId: string,
  now: Date = new Date()
): boolean {
  const kickoffTime = new Date(kickoff).getTime();
  const pastEnd = now.getTime() >= kickoffTime + MATCH_DURATION_MS;
  return pastEnd && !(matchId in MATCH_RESULTS);
}
