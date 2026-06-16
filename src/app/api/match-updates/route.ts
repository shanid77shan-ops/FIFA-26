import { NextResponse } from "next/server";
import { getAllLiveMatches } from "@/data/matches";
import { buildMatchUpdatesFromFixtures } from "@/lib/match-live-state";
import { scheduleMatchToMatchData } from "@/lib/match-carousel";
import { getTodayIstDayKey, addDaysToDayKey } from "@/lib/match-utils";
import { fetchAllLiveFixtures } from "@/lib/sportmonks";
import type { MatchLiveState, MatchUpdatesResponse } from "@/types/match-live";
import type { MatchData } from "@/types/sportmonks";

export const dynamic = "force-dynamic";

function enrichWithScheduleLive(
  byMatchId: Record<string, MatchLiveState>,
  liveMatches: MatchData[],
  now: Date
) {
  const scheduleLive = getAllLiveMatches(now);
  const liveKeys = new Set(
    liveMatches.map(
      (m) => m.matchId ?? `${m.homeTeam.name}-${m.awayTeam.name}`
    )
  );

  for (const match of scheduleLive) {
    const existing = byMatchId[match.id];
    if (!existing?.isLive && !existing?.isFinished) {
      byMatchId[match.id] = {
        matchId: match.id,
        homeScore: existing?.homeScore ?? 0,
        awayScore: existing?.awayScore ?? 0,
        goals: existing?.goals ?? [],
        isLive: true,
        isFinished: false,
        minute: existing?.minute,
        source: existing?.source ?? "static",
        updatedAt: now.toISOString(),
      };
    }

    const key = match.id;
    if (!liveKeys.has(key)) {
      const state = byMatchId[match.id];
      liveMatches.push(
        scheduleMatchToMatchData(match, {
          isLive: true,
          homeScore: state?.homeScore ?? 0,
          awayScore: state?.awayScore ?? 0,
          goals: state?.goals,
          minute: state?.minute,
        })
      );
      liveKeys.add(key);
    }
  }

  return { byMatchId, liveMatches };
}

export async function GET() {
  const now = new Date();
  const today = getTodayIstDayKey(now);
  const dates = [addDaysToDayKey(today, -1), today, addDaysToDayKey(today, 1)];

  let byMatchId: Record<string, MatchLiveState> = {};
  let liveMatches: MatchData[] = [];
  let error: string | undefined;

  try {
    const fixtures = await fetchAllLiveFixtures(dates);
    const built = buildMatchUpdatesFromFixtures(fixtures, now);
    byMatchId = built.byMatchId;
    liveMatches = built.liveMatches;
  } catch (err) {
    error =
      err instanceof Error ? err.message : "Failed to fetch live scores";
    const built = buildMatchUpdatesFromFixtures([], now);
    byMatchId = built.byMatchId;
    liveMatches = built.liveMatches;
  }

  const enriched = enrichWithScheduleLive(byMatchId, liveMatches, now);

  const body: MatchUpdatesResponse & { error?: string } = {
    fetchedAt: now.toISOString(),
    byMatchId: enriched.byMatchId,
    liveMatches: enriched.liveMatches,
    ...(error ? { error } : {}),
  };

  return NextResponse.json(body);
}
