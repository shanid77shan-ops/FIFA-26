"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { DateNavigation } from "@/components/DateNavigation";
import { LiveMatchesSection } from "@/components/LiveMatchesSection";
import { MatchUpdatesProvider } from "@/components/MatchUpdatesProvider";
import { ScheduleMatchCard } from "@/components/ScheduleMatchCard";
import { SearchBar } from "@/components/SearchBar";
import type { Match } from "@/data/matches";
import {
  getAllLiveMatches,
  getAllPastMatches,
  getDefaultSelectedDay,
  getMatchDays,
  getMatchesGroupedByDay,
  getNextUpcomingMatch,
  groupPastMatchesByDay,
  getTournamentDateRange,
  getUpcomingMatchesForDay,
  searchMatchesByTeam,
} from "@/data/matches";
import { UpNextMatchSection } from "@/components/UpNextMatchSection";
import { isMatchLive } from "@/data/match-results";
import {
  formatMatchDate,
  formatSelectedDayHeading,
  getTodayIstDayKey,
} from "@/lib/match-utils";
import { getStoredProfile } from "@/lib/user-profile";
import type { UserProfile } from "@/data/qualified-countries";

export default function DashboardPage() {
  return (
    <MatchUpdatesProvider>
      <DashboardContent />
    </MatchUpdatesProvider>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [now, setNow] = useState<Date | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [showPastMatches, setShowPastMatches] = useState(false);

  const matchDays = useMemo(() => getMatchDays(), []);
  const matchesByDay = useMemo(() => getMatchesGroupedByDay(), []);
  const dateRange = useMemo(() => getTournamentDateRange(), []);

  useEffect(() => {
    const profile = getStoredProfile();
    if (!profile) {
      router.replace("/");
      return;
    }

    setProfile(profile);
    setNow(new Date());
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedDay && now) {
      setSelectedDay(
        getDefaultSelectedDay(now, matchesByDay, dateRange, matchDays)
      );
    }
  }, [selectedDay, now, matchDays, dateRange, matchesByDay]);

  useEffect(() => {
    if (!now || !selectedDay) return;

    const today = getTodayIstDayKey(now);
    if (selectedDay >= today) return;

    setSelectedDay(
      getDefaultSelectedDay(now, matchesByDay, dateRange, matchDays)
    );
  }, [now, selectedDay, matchesByDay, dateRange, matchDays]);

  const searchResults = useMemo(
    () => searchMatchesByTeam(teamSearch),
    [teamSearch]
  );

  const isSearching = teamSearch.trim().length > 0;

  if (!profile || !now || !selectedDay) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Loading...</p>
      </main>
    );
  }

  const todayKey = getTodayIstDayKey(now);
  const allLiveMatches = getAllLiveMatches(now);
  const allLiveIds = new Set(allLiveMatches.map((m) => m.id));
  const dayMatches = matchesByDay.get(selectedDay) ?? [];
  const upcomingMatches = getUpcomingMatchesForDay(dayMatches, now);
  const allPastMatches = getAllPastMatches(now);
  const pastMatchesByDay = groupPastMatchesByDay(allPastMatches);
  const nextMatchGlobal = getNextUpcomingMatch(now);
  const upNextMatch =
    upcomingMatches.find((m) => !allLiveIds.has(m.id)) ?? null;
  const moreUpcomingMatches = upcomingMatches.filter(
    (m) =>
      m.id !== nextMatchGlobal?.id &&
      m.id !== upNextMatch?.id &&
      !allLiveIds.has(m.id)
  );
  const showGlobalUpNext =
    nextMatchGlobal &&
    !isMatchLive(nextMatchGlobal.kickoff, now) &&
    !allLiveIds.has(nextMatchGlobal.id);
  const dayUpNextMatch =
    upNextMatch &&
    upNextMatch.id !== nextMatchGlobal?.id &&
    !showGlobalUpNext
      ? upNextMatch
      : null;
  const pastMatchCount = allPastMatches.length;
  const hasPastMatches = pastMatchCount > 0;

  const matchCardProps = (match: Match) => ({
    match,
    now,
    expanded: expandedMatchId === match.id,
    onExpandedChange: (id: string, open: boolean) =>
      setExpandedMatchId(open ? id : null),
  });

  return (
    <main className="min-h-screen px-4 py-8 pb-24 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6">
          <div className="text-center">
            <div className="mx-auto mb-3 flex justify-center">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-accent/40 shadow-[0_0_20px_rgba(139,26,26,0.35)]">
                <Image
                  src="/app-icon.png"
                  alt="FIFA World Cup 2026"
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
            </div>
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              FIFA World Cup 2026
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Hello, {profile.name}!
            </h1>
            <p className="mt-2 text-sm text-muted">
              Today is{" "}
              <span className="font-semibold text-foreground">
                {formatMatchDate(now.toISOString())}
              </span>
              . All times in IST.
            </p>
          </div>

          <div className="mt-5">
            <SearchBar value={teamSearch} onChange={setTeamSearch} />
          </div>
        </header>

        {!isSearching && (
          <LiveMatchesSection scheduleLive={allLiveMatches} />
        )}

        {!isSearching && showGlobalUpNext && nextMatchGlobal && (
          <UpNextMatchSection
            match={nextMatchGlobal}
            now={now}
            todayKey={todayKey}
            expanded={expandedMatchId === nextMatchGlobal.id}
            onExpandedChange={(id, open) =>
              setExpandedMatchId(open ? id : null)
            }
          />
        )}

        {!isSearching && hasPastMatches && !showPastMatches && (
          <button
            type="button"
            onClick={() => setShowPastMatches(true)}
            aria-label={`Show more, ${pastMatchCount} past ${
              pastMatchCount === 1 ? "match" : "matches"
            }`}
            className="mb-6 w-full rounded-xl border border-accent/40 bg-accent/10 px-4 py-3.5 text-center transition hover:border-accent/60 hover:bg-accent/15"
          >
            <span className="block text-sm font-semibold text-accent">
              Show more
            </span>
            <span className="mt-1 block text-xs text-muted">
              View {pastMatchCount} past match
              {pastMatchCount === 1 ? "" : "es"} &amp; results
            </span>
          </button>
        )}

        {!isSearching && showPastMatches && (
          <section aria-label="Past matches" className="mb-6">
            <h2 className="mb-4 text-lg font-semibold">
              Past matches ({pastMatchCount})
            </h2>
            <div className="space-y-8">
              {pastMatchesByDay.map(({ dayKey, matches }) => (
                <div key={dayKey}>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
                    {formatSelectedDayHeading(dayKey, todayKey)}
                  </p>
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <ScheduleMatchCard
                        key={match.id}
                        {...matchCardProps(match)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowPastMatches(false)}
              className="mt-6 w-full rounded-xl border border-card-border bg-card/80 px-4 py-3 text-sm font-semibold text-muted transition hover:border-accent/50 hover:bg-card hover:text-foreground"
            >
              Show less
            </button>
          </section>
        )}

        {!isSearching && (
          <div className="mb-6">
            <DateNavigation
                selectedDay={selectedDay}
                minDate={dateRange.min}
                maxDate={dateRange.max}
                todayKey={todayKey}
                matchDays={matchDays}
                onDayChange={setSelectedDay}
              />
          </div>
        )}

        {isSearching ? (
          <section aria-label="Search results">
            <h2 className="mb-4 text-lg font-semibold">
              Matches for &ldquo;{teamSearch.trim()}&rdquo;
            </h2>
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((match) => (
                  <div key={match.id}>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
                      {formatMatchDate(match.kickoff)}
                    </p>
                    <ScheduleMatchCard {...matchCardProps(match)} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-card-border bg-card/80 px-4 py-8 text-center text-muted">
                No matches found for that team.
              </p>
            )}
          </section>
        ) : (
          <>
            <section className="mb-6" aria-label="Matches for selected day">
              <h2 className="mb-4 text-lg font-semibold">
                {formatSelectedDayHeading(selectedDay, todayKey)}
              </h2>

              {dayUpNextMatch && (
                <div className="mb-6">
                  <h3 className="mb-3 text-base font-semibold">Up next</h3>
                  <ScheduleMatchCard {...matchCardProps(dayUpNextMatch)} />
                </div>
              )}

              {moreUpcomingMatches.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-base font-semibold">
                    Upcoming ({moreUpcomingMatches.length})
                  </h3>
                  <div className="space-y-4">
                    {moreUpcomingMatches.map((match) => (
                      <ScheduleMatchCard
                        key={match.id}
                        {...matchCardProps(match)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {dayMatches.length === 0 && (
                <p className="rounded-xl border border-card-border bg-card/80 px-4 py-8 text-center text-muted">
                  No World Cup matches on this date. Pick another day from the
                  calendar or use Next day.
                </p>
              )}
            </section>

          </>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/?edit=1"
            className="text-sm text-accent underline-offset-4 hover:underline"
          >
            Change name
          </Link>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
