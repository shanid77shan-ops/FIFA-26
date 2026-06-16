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
  getAwaitingResultMatchesForDay,
  getFinishedMatchesForDay,
  getMatchDays,
  getMatchesGroupedByDay,
  getNextUpcomingMatch,
  getTournamentDateRange,
  getUpcomingMatchesForDay,
  searchMatchesByTeam,
} from "@/data/matches";
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
      const today = getTodayIstDayKey(now);
      let initialDay: string;

      if (today >= dateRange.min && today <= dateRange.max) {
        const hasTodayMatches = (matchesByDay.get(today)?.length ?? 0) > 0;
        initialDay = hasTodayMatches
          ? today
          : matchDays.find((day) => day >= today) ?? matchDays[0];
      } else if (today < dateRange.min) {
        initialDay = matchDays[0];
      } else {
        initialDay = matchDays[matchDays.length - 1];
      }

      setSelectedDay(initialDay);
    }
  }, [selectedDay, now, matchDays, dateRange, matchesByDay]);

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
  const finishedMatches = getFinishedMatchesForDay(dayMatches, now);
  const awaitingResultMatches = getAwaitingResultMatchesForDay(
    dayMatches,
    now
  );
  const upNextMatch =
    upcomingMatches.find((m) => !allLiveIds.has(m.id)) ?? null;
  const moreUpcomingMatches = upcomingMatches.filter(
    (m) => m.id !== upNextMatch?.id && !allLiveIds.has(m.id)
  );
  const nextMatchGlobal = getNextUpcomingMatch(now);
  const nextFutureMatch =
    nextMatchGlobal &&
    !dayMatches.some((m) => m.id === nextMatchGlobal.id)
      ? nextMatchGlobal
      : null;

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

              {upNextMatch && allLiveMatches.length === 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-base font-semibold">Up next</h3>
                  <ScheduleMatchCard {...matchCardProps(upNextMatch)} />
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

              {awaitingResultMatches.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-base font-semibold">
                    Full time ({awaitingResultMatches.length})
                  </h3>
                  <div className="space-y-4">
                    {awaitingResultMatches.map((match) => (
                      <ScheduleMatchCard
                        key={match.id}
                        {...matchCardProps(match)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {finishedMatches.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-base font-semibold">
                    Completed ({finishedMatches.length})
                  </h3>
                  <div className="space-y-4">
                    {finishedMatches.map((match) => (
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

            {nextFutureMatch && (
              <section className="mb-6" aria-label="Next upcoming match">
                <h2 className="mb-3 text-lg font-semibold">Next match</h2>
                <p className="mb-3 text-xs text-muted">
                  {formatMatchDate(nextFutureMatch.kickoff)}
                </p>
                <ScheduleMatchCard {...matchCardProps(nextFutureMatch)} />
              </section>
            )}

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
