"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MatchLiveState, MatchUpdatesResponse } from "@/types/match-live";
import type { MatchData } from "@/types/sportmonks";

const POLL_INTERVAL_MS = 15_000;

type MatchUpdatesContextValue = {
  getState: (matchId: string) => MatchLiveState | null;
  liveMatches: MatchData[];
  loading: boolean;
  error: string | null;
  fetchedAt: string | null;
  refresh: () => void;
};

const MatchUpdatesContext = createContext<MatchUpdatesContextValue | null>(null);

export function MatchUpdatesProvider({ children }: { children: ReactNode }) {
  const [byMatchId, setByMatchId] = useState<Record<string, MatchLiveState>>(
    {}
  );
  const [liveMatches, setLiveMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const fetchUpdates = useCallback(async () => {
    try {
      const res = await fetch("/api/match-updates", { cache: "no-store" });
      const json = (await res.json()) as MatchUpdatesResponse & {
        error?: string;
      };

      setByMatchId(json.byMatchId ?? {});
      setLiveMatches(json.liveMatches ?? []);
      setFetchedAt(json.fetchedAt ?? null);
      setError(json.error ?? null);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load match updates"
      );
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUpdates();
    const interval = setInterval(fetchUpdates, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchUpdates]);

  const value = useMemo<MatchUpdatesContextValue>(
    () => ({
      getState: (matchId: string) => byMatchId[matchId] ?? null,
      liveMatches,
      loading,
      error,
      fetchedAt,
      refresh: fetchUpdates,
    }),
    [byMatchId, liveMatches, loading, error, fetchedAt, fetchUpdates]
  );

  return (
    <MatchUpdatesContext.Provider value={value}>
      {children}
    </MatchUpdatesContext.Provider>
  );
}

export function useMatchUpdates() {
  const context = useContext(MatchUpdatesContext);
  if (!context) {
    throw new Error("useMatchUpdates must be used within MatchUpdatesProvider");
  }
  return context;
}
