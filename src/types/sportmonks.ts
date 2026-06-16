export type SportmonksParticipant = {
  id: number;
  name: string;
  short_code?: string | null;
  image_path?: string | null;
  meta?: {
    location?: "home" | "away";
    winner?: boolean | null;
    position?: number | null;
  };
};

export type SportmonksScore = {
  id: number;
  fixture_id: number;
  participant_id: number;
  description: string;
  score: {
    goals: number;
    participant: "home" | "away";
  };
};

export type SportmonksLeague = {
  id: number;
  name: string;
  image_path?: string | null;
};

export type SportmonksEvent = {
  id: number;
  type_id: number;
  fixture_id: number;
  participant_id?: number;
  player_name?: string;
  related_player_name?: string | null;
  minute?: number;
  extra_minute?: number | null;
  sort_order?: number;
  result?: string | null;
};

export type SportmonksFixture = {
  id: number;
  name: string;
  starting_at: string;
  state_id: number;
  league_id?: number;
  participants?: SportmonksParticipant[];
  scores?: SportmonksScore[];
  league?: SportmonksLeague;
  events?: SportmonksEvent[];
};

export type SportmonksLivescoresResponse = {
  data: SportmonksFixture[];
  message?: string;
};

/** Normalized match data consumed by MatchCard */
export type MatchData = {
  fixtureId: number;
  homeTeam: {
    name: string;
    abbreviation: string;
    logoUrl?: string;
    score: number;
  };
  awayTeam: {
    name: string;
    abbreviation: string;
    logoUrl?: string;
    score: number;
  };
  isLive: boolean;
  tournament: string;
  kickoff?: string;
  /** IST kickoff label for upcoming matches */
  kickoffLabel?: string;
  /** Local schedule id — used for scroll-to-match */
  matchId?: string;
  goals?: import("@/types/match-live").MatchGoalEvent[];
  minute?: number;
};
