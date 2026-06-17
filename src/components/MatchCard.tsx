"use client";

import Image from "next/image";
import { useState } from "react";
import { GoalScorersList } from "@/components/GoalScorersList";
import { resolveKeyPlayer } from "@/data/team-key-players";
import { getTeamFlag, getTeamFlagImageUrl } from "@/lib/team-display";
import type { MatchData } from "@/types/sportmonks";

type MatchCardProps = {
  matchData: MatchData;
  onWatch?: (matchId?: string) => void;
};

function LiveBadge() {
  return (
    <div className="relative z-20 flex justify-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-black uppercase tracking-wide text-black shadow-lg">
        <span
          className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-600"
          aria-hidden="true"
        />
        Live
      </span>
    </div>
  );
}

type PlayerPortraitProps = {
  teamName: string;
  align: "left" | "right";
};

function PlayerPortrait({ teamName, align }: PlayerPortraitProps) {
  const keyPlayer = resolveKeyPlayer(teamName);
  const [imgError, setImgError] = useState(false);
  const flagUrl = getTeamFlagImageUrl(teamName);
  const showPlayer = keyPlayer && !imgError;

  return (
    <div
      className={`absolute bottom-0 z-0 h-[88%] w-[44%] overflow-hidden ${
        align === "left" ? "left-0" : "right-0"
      }`}
    >
      {showPlayer ? (
        <Image
          src={keyPlayer.imageUrl}
          alt={keyPlayer.name}
          fill
          className="object-cover object-top"
          sizes="240px"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-end pb-20">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white/20 bg-white/10 shadow-lg">
            <Image
              src={flagUrl}
              alt={`${teamName} flag`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <span className="mt-2 text-4xl" aria-hidden="true">
            {getTeamFlag(teamName)}
          </span>
        </div>
      )}

      <div
        className={`pointer-events-none absolute inset-y-0 ${
          align === "left"
            ? "right-0 w-20 bg-gradient-to-l from-[#1a0828] to-transparent"
            : "left-0 w-20 bg-gradient-to-r from-[#1a0828] to-transparent"
        }`}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1a0828] via-[#1a0828]/95 to-transparent" />
    </div>
  );
}

type TeamSideProps = {
  abbreviation: string;
  logoUrl?: string;
  teamName: string;
  align: "left" | "right";
  score?: number;
  showScore?: boolean;
};

function TeamSide({
  abbreviation,
  logoUrl,
  teamName,
  align,
  score,
  showScore,
}: TeamSideProps) {
  const roundedClass = align === "left" ? "rounded-l-full" : "rounded-r-full";
  const bgClass =
    align === "left"
      ? "bg-[#E44D26] shadow-[-6px_0_24px_rgba(228,77,22,0.5)]"
      : "bg-[#A4C639] shadow-[6px_0_24px_rgba(164,198,57,0.5)]";

  return (
    <div
      className={`relative flex flex-1 flex-col items-center justify-center px-2 py-3.5 sm:px-3 sm:py-4 ${roundedClass} ${bgClass}`}
    >
      <div className="relative mb-1 h-8 w-11 overflow-hidden rounded-sm border border-black/20 shadow-md sm:h-9 sm:w-12">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${teamName} logo`}
            fill
            className="object-contain bg-white/90 p-0.5"
            sizes="48px"
          />
        ) : (
          <Image
            src={getTeamFlagImageUrl(teamName)}
            alt={`${teamName} flag`}
            fill
            className="object-cover"
            sizes="48px"
          />
        )}
      </div>
      <span className="text-lg font-black tracking-wider text-black sm:text-xl">
        {abbreviation}
      </span>
      {showScore && score !== undefined && (
        <span className="mt-0.5 text-2xl font-black leading-none text-black sm:text-3xl">
          {score}
        </span>
      )}
    </div>
  );
}

function ScoreCenter({
  homeScore,
  awayScore,
  tournament,
  isLive,
  kickoffLabel,
  minute,
}: {
  homeScore: number;
  awayScore: number;
  tournament: string;
  isLive: boolean;
  kickoffLabel?: string;
  minute?: number;
}) {
  return (
    <div className="relative z-10 flex w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-xl border border-white/15 bg-black px-2 py-2 shadow-2xl sm:w-20">
      <span className="text-lg sm:text-xl" aria-hidden="true">
        🏆
      </span>
      {isLive ? (
        <>
          <p className="mt-1 text-base font-black leading-none text-white sm:text-lg">
            {homeScore}
            <span className="mx-0.5 text-white/60">-</span>
            {awayScore}
          </p>
          {minute !== undefined && (
            <p className="mt-0.5 text-[10px] font-bold text-red-400">
              {minute}&apos;
            </p>
          )}
        </>
      ) : (
        <p className="mt-1 text-[10px] font-bold leading-tight text-white sm:text-xs">
          {kickoffLabel ?? "Upcoming"}
        </p>
      )}
      <p className="mt-1.5 text-center text-[5px] font-bold uppercase leading-tight tracking-wide text-white/75 sm:text-[6px]">
        {tournament}
      </p>
    </div>
  );
}

export function MatchCard({ matchData, onWatch }: MatchCardProps) {
  const {
    homeTeam,
    awayTeam,
    isLive,
    tournament,
    kickoffLabel,
    matchId,
    goals = [],
    minute,
  } = matchData;

  return (
    <article className="relative h-full min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#2a1040] via-[#1a0828] to-[#0d0514] shadow-xl sm:min-h-[360px]">
      <div
        className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMyYTEwNDAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNhKSIgb3BhY2l0eT0iMC40Ii8+PC9zdmc+')] bg-cover opacity-40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-8 top-0 h-full w-1/3 bg-gradient-to-r from-red-700/50 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-8 top-0 h-full w-1/3 bg-gradient-to-l from-lime-600/40 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-8 left-1/2 h-16 w-[120%] -translate-x-1/2 rounded-full bg-gradient-to-r from-red-700 via-orange-500 to-red-600 opacity-60 blur-[2px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4">
        {isLive && (
          <div className="mb-2">
            <LiveBadge />
          </div>
        )}

        <div className="relative mx-auto w-full flex-1">
          <div className="relative mx-auto h-44 max-w-md sm:h-48">
            <PlayerPortrait teamName={homeTeam.name} align="left" />
            <PlayerPortrait teamName={awayTeam.name} align="right" />

            <div className="absolute bottom-2 left-0 right-0 z-10 px-1">
              <div className="flex items-stretch justify-center">
                <TeamSide
                  abbreviation={homeTeam.abbreviation}
                  logoUrl={homeTeam.logoUrl}
                  teamName={homeTeam.name}
                  align="left"
                  score={homeTeam.score}
                  showScore={isLive}
                />
                <div className="-mx-2 flex shrink-0 items-center self-center sm:-mx-2.5">
                  <ScoreCenter
                    homeScore={homeTeam.score ?? 0}
                    awayScore={awayTeam.score ?? 0}
                    tournament={tournament}
                    isLive={isLive}
                    kickoffLabel={kickoffLabel}
                    minute={minute}
                  />
                </div>
                <TeamSide
                  abbreviation={awayTeam.abbreviation}
                  logoUrl={awayTeam.logoUrl}
                  teamName={awayTeam.name}
                  align="right"
                  score={awayTeam.score}
                  showScore={isLive}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 mt-auto pt-2">
          {isLive && (
            <span className="mb-1.5 inline-block rounded bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
              Live
            </span>
          )}
          <p className="text-xl font-bold leading-tight text-white sm:text-2xl">
            {homeTeam.name}{" "}
            <span className="font-normal text-white/70">Vs</span> {awayTeam.name}
          </p>
          {isLive && (
            <p className="mt-1 text-lg font-black text-white">
              {homeTeam.score ?? 0}
              <span className="mx-2 text-white/50">–</span>
              {awayTeam.score ?? 0}
            </p>
          )}
          {goals.length > 0 && (
            <GoalScorersList
              goals={goals}
              homeTeam={homeTeam.name}
              awayTeam={awayTeam.name}
              compact
              className="mt-2 text-left"
            />
          )}
          <button
            type="button"
            onClick={() => onWatch?.(matchId)}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
          >
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full border border-white/80"
              aria-hidden="true"
            >
              ▶
            </span>
            Watch
          </button>
        </div>
      </div>
    </article>
  );
}
