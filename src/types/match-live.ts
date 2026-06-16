export type MatchGoalEvent = {
  minute: number;
  extraMinute?: number;
  player: string;
  assist?: string;
  team: "home" | "away";
};

export type MatchLiveState = {
  matchId: string;
  homeScore: number;
  awayScore: number;
  goals: MatchGoalEvent[];
  isLive: boolean;
  isFinished: boolean;
  minute?: number;
  source: "sportmonks" | "static";
  updatedAt: string;
};

export type MatchUpdatesResponse = {
  fetchedAt: string;
  byMatchId: Record<string, MatchLiveState>;
  liveMatches: import("@/types/sportmonks").MatchData[];
};
