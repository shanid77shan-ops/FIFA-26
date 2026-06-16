"use client";

import { useMemo } from "react";
import { MatchCard } from "@/components/MatchCard";
import { useMatchUpdates } from "@/components/MatchUpdatesProvider";
import type { Match } from "@/data/matches";
import { scheduleMatchToMatchData } from "@/lib/match-carousel";
import type { MatchData } from "@/types/sportmonks";

type LiveMatchesSectionProps = {
  scheduleLive?: Match[];
};

export function LiveMatchesSection({
  scheduleLive = [],
}: LiveMatchesSectionProps) {
  const { liveMatches, loading, error, getState } = useMatchUpdates();

  const displayMatches = useMemo(() => {
    if (liveMatches.length > 0) {
      return liveMatches.filter((m) => m.isLive);
    }

    return scheduleLive.map((match) => {
      const state = getState(match.id);
      return scheduleMatchToMatchData(match, {
        isLive: true,
        homeScore: state?.homeScore ?? 0,
        awayScore: state?.awayScore ?? 0,
        goals: state?.goals,
        minute: state?.minute,
      });
    });
  }, [liveMatches, scheduleLive, getState]);

  if (!loading && displayMatches.length === 0) {
    return null;
  }

  if (loading && displayMatches.length === 0) {
    return (
      <section aria-label="Live matches" className="mb-6">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
          Live now
        </h2>
        <div className="animate-pulse rounded-2xl border border-white/10 bg-[#2a1040]/50 p-8">
          <div className="mx-auto mb-4 h-8 w-24 rounded-full bg-white/10" />
          <div className="flex gap-2">
            <div className="h-24 flex-1 rounded-l-full bg-white/10" />
            <div className="h-24 w-20 rounded-xl bg-white/10" />
            <div className="h-24 flex-1 rounded-r-full bg-white/10" />
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            Loading live scores…
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Live matches" className="mb-6">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
        Live now ({displayMatches.length})
      </h2>
      {error && (
        <p className="mb-3 text-xs text-muted">
          Live feed limited — showing best available data. Refreshes every 15s.
        </p>
      )}
      <div className="space-y-4">
        {displayMatches.map((matchData: MatchData) => (
          <MatchCard key={matchData.fixtureId} matchData={matchData} />
        ))}
      </div>
    </section>
  );
}
