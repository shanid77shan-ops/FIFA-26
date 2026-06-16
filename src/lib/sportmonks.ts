import type {
  MatchData,
  SportmonksEvent,
  SportmonksFixture,
  SportmonksLivescoresResponse,
} from "@/types/sportmonks";
import type { MatchGoalEvent } from "@/types/match-live";
import { getTeamAbbreviation } from "@/lib/team-display";
import { findLocalMatchByTeams } from "@/lib/match-team-map";

const SPORTMONKS_CDN = "https://cdn.sportmonks.com";

/** Sportmonks in-play state ids */
const LIVE_STATE_IDS = new Set([2, 3, 4, 6, 9, 21, 22, 25]);
const FINISHED_STATE_IDS = new Set([5, 7, 8, 11, 14, 17, 18]);

const GOAL_TYPE_IDS = new Set([14, 15, 16, 23]);

const FIXTURE_INCLUDES = "scores;participants;league;events";

export type ParsedFixtureState = {
  goals: MatchGoalEvent[];
  isLive: boolean;
  isFinished: boolean;
  minute?: number;
};

export function getParticipantLogoUrl(
  participant?: { image_path?: string | null }
): string | undefined {
  if (!participant?.image_path) return undefined;
  if (participant.image_path.startsWith("http")) return participant.image_path;
  return `${SPORTMONKS_CDN}${participant.image_path.startsWith("/") ? "" : "/"}${participant.image_path}`;
}

function getCurrentScore(
  fixture: SportmonksFixture,
  location: "home" | "away"
): number {
  const current =
    fixture.scores?.filter((s) => s.description === "CURRENT") ?? [];
  const entry = current.find((s) => s.score.participant === location);
  return entry?.score.goals ?? 0;
}

function resolveAbbreviation(
  participant: { short_code?: string | null; name?: string } | undefined,
  fallbackName: string
): string {
  if (participant?.short_code) return participant.short_code.toUpperCase();
  return getTeamAbbreviation(fallbackName);
}

function mapParticipant(
  participant:
    | { name?: string; short_code?: string | null; image_path?: string | null }
    | undefined,
  fallbackName: string,
  score: number
) {
  const name = participant?.name ?? fallbackName;
  return {
    name,
    abbreviation: resolveAbbreviation(participant, name),
    logoUrl: getParticipantLogoUrl(participant),
    score,
  };
}

function parseGoalsFromEvents(fixture: SportmonksFixture): MatchGoalEvent[] {
  const homeParticipant = fixture.participants?.find(
    (p) => p.meta?.location === "home"
  );
  const awayParticipant = fixture.participants?.find(
    (p) => p.meta?.location === "away"
  );

  const events = [...(fixture.events ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  return events
    .filter((event) => GOAL_TYPE_IDS.has(event.type_id))
    .map((event) => eventToGoal(event, homeParticipant?.id, awayParticipant?.id))
    .filter((goal): goal is MatchGoalEvent => goal !== null);
}

function eventToGoal(
  event: SportmonksEvent,
  homeParticipantId?: number,
  awayParticipantId?: number
): MatchGoalEvent | null {
  if (!event.player_name || event.minute === undefined) return null;

  let team: "home" | "away" = "home";
  if (event.participant_id === awayParticipantId) {
    team = "away";
  } else if (event.participant_id === homeParticipantId) {
    team = "home";
  }

  return {
    minute: event.minute,
    extraMinute: event.extra_minute ?? undefined,
    player: event.player_name,
    assist: event.related_player_name ?? undefined,
    team,
  };
}

function getLatestMinute(goals: MatchGoalEvent[], events?: SportmonksEvent[]) {
  const fromGoals = goals.reduce(
    (max, goal) => Math.max(max, goal.minute + (goal.extraMinute ?? 0)),
    0
  );
  const fromEvents =
    events?.reduce(
      (max, event) =>
        Math.max(max, (event.minute ?? 0) + (event.extra_minute ?? 0)),
      0
    ) ?? 0;
  const minute = Math.max(fromGoals, fromEvents);
  return minute > 0 ? minute : undefined;
}

export function parseFixtureState(fixture: SportmonksFixture): ParsedFixtureState {
  const goals = parseGoalsFromEvents(fixture);
  const isLive = LIVE_STATE_IDS.has(fixture.state_id) && !FINISHED_STATE_IDS.has(fixture.state_id);
  const isFinished = FINISHED_STATE_IDS.has(fixture.state_id);

  return {
    goals,
    isLive,
    isFinished,
    minute: getLatestMinute(goals, fixture.events),
  };
}

export function mapFixtureToMatchData(
  fixture: SportmonksFixture,
  parsed?: ParsedFixtureState
): MatchData {
  const state = parsed ?? parseFixtureState(fixture);

  const [fallbackHome = "Home", fallbackAway = "Away"] = fixture.name
    .split(/\s+vs\.?\s+/i)
    .map((part) => part.trim());

  const homeParticipant = fixture.participants?.find(
    (p) => p.meta?.location === "home"
  );
  const awayParticipant = fixture.participants?.find(
    (p) => p.meta?.location === "away"
  );

  const homeName = homeParticipant?.name ?? fallbackHome;
  const awayName = awayParticipant?.name ?? fallbackAway;
  const localMatch = findLocalMatchByTeams(homeName, awayName);

  return {
    fixtureId: fixture.id,
    homeTeam: mapParticipant(
      homeParticipant,
      fallbackHome,
      getCurrentScore(fixture, "home")
    ),
    awayTeam: mapParticipant(
      awayParticipant,
      fallbackAway,
      getCurrentScore(fixture, "away")
    ),
    isLive: state.isLive,
    tournament: fixture.league?.name ?? "FIFA World Cup 2026",
    kickoff: fixture.starting_at,
    matchId: localMatch?.id,
    goals: state.goals,
    minute: state.minute,
  };
}

export function mapLivescoresResponse(
  response: SportmonksLivescoresResponse
): MatchData[] {
  return (response.data ?? []).map((fixture) => mapFixtureToMatchData(fixture));
}

async function sportmonksFetch(path: string): Promise<SportmonksFixture[]> {
  const token = process.env.SPORTMONKS_API_TOKEN;
  if (!token) {
    throw new Error("SPORTMONKS_API_TOKEN is not configured");
  }

  const url = new URL(`https://api.sportmonks.com/v3/football/${path}`);
  url.searchParams.set("api_token", token);
  url.searchParams.set("include", FIXTURE_INCLUDES);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Sportmonks API error (${res.status})`);
  }

  const json = (await res.json()) as SportmonksLivescoresResponse;
  return json.data ?? [];
}

export async function fetchInplayLivescores(): Promise<MatchData[]> {
  const fixtures = await sportmonksFetch("livescores/inplay");
  return fixtures.map((fixture) => mapFixtureToMatchData(fixture));
}

export async function fetchLatestLivescores(): Promise<SportmonksFixture[]> {
  return sportmonksFetch("livescores/latest");
}

export async function fetchFixturesForDate(date: string): Promise<SportmonksFixture[]> {
  return sportmonksFetch(`fixtures/date/${date}`);
}

export async function fetchAllLiveFixtures(
  dates: string[]
): Promise<SportmonksFixture[]> {
  const results = await Promise.allSettled([
    sportmonksFetch("livescores/inplay"),
    sportmonksFetch("livescores/latest"),
    ...dates.map((date) => sportmonksFetch(`fixtures/date/${date}`)),
  ]);

  const fixtures: SportmonksFixture[] = [];
  const seen = new Set<number>();

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const fixture of result.value) {
      if (seen.has(fixture.id)) continue;
      seen.add(fixture.id);
      fixtures.push(fixture);
    }
  }

  return fixtures;
}
