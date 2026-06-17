import Image from "next/image";
import { GoalScorersList } from "@/components/GoalScorersList";
import type { MatchGoalEvent } from "@/types/match-live";
import {
  getTeamAbbreviation,
  getTeamFlagImageUrl,
} from "@/lib/team-display";

type TeamBannerSideProps = {
  teamName: string;
  align: "left" | "right";
  score?: number;
};

function TeamBannerSide({ teamName, align, score }: TeamBannerSideProps) {
  const code = getTeamAbbreviation(teamName);
  const flagUrl = getTeamFlagImageUrl(teamName);

  const glowClass =
    align === "left"
      ? "rounded-l-2xl border-l-orange-500/80 shadow-[-4px_0_20px_rgba(249,115,22,0.35)]"
      : "rounded-r-2xl border-r-lime-400/80 shadow-[4px_0_20px_rgba(163,230,53,0.35)]";

  return (
    <div
      className={`relative flex flex-1 flex-col items-center justify-center border border-white/10 bg-[#1a1a1a]/95 px-3 py-5 sm:px-4 ${glowClass}`}
    >
      <span className="text-2xl font-black tracking-wider text-white sm:text-3xl">
        {code}
      </span>
      <div className="relative mt-2 h-10 w-14 overflow-hidden rounded-sm border border-white/20 shadow-md sm:h-11 sm:w-16">
        <Image
          src={flagUrl}
          alt={`${teamName} flag`}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      {score !== undefined && (
        <span className="mt-2 text-xl font-black text-white">{score}</span>
      )}
    </div>
  );
}

function FifaCenterBadge({
  homeScore,
  awayScore,
}: {
  homeScore?: number;
  awayScore?: number;
}) {
  const showScore = homeScore !== undefined && awayScore !== undefined;

  return (
    <div className="relative z-10 flex w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-xl border border-white/15 bg-black px-2 py-3 shadow-xl sm:w-20">
      {showScore ? (
        <>
          <p className="text-lg font-black leading-none text-white sm:text-xl">
            {homeScore}
            <span className="mx-0.5 text-white/50">-</span>
            {awayScore}
          </p>
          <span className="mt-1 text-[6px] font-semibold uppercase tracking-wide text-white/60">
            Score
          </span>
        </>
      ) : (
        <>
          <span className="text-2xl" aria-hidden="true">
            🏆
          </span>
          <span className="mt-1 text-[7px] font-bold leading-tight tracking-wide text-white sm:text-[8px]">
            FIFA
          </span>
          <span className="text-[6px] font-semibold leading-tight text-white/80 sm:text-[7px]">
            WORLD CUP
          </span>
          <span className="mt-0.5 text-xl font-black leading-none text-white/90 sm:text-2xl">
            26
          </span>
        </>
      )}
    </div>
  );
}

type MatchBannerProps = {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  goals?: MatchGoalEvent[];
  showScorers?: boolean;
};

export function MatchBanner({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  goals = [],
  showScorers = true,
}: MatchBannerProps) {
  const showScores = homeScore !== undefined && awayScore !== undefined;

  return (
    <div>
      <div className="relative flex items-stretch justify-center">
        <TeamBannerSide
          teamName={homeTeam}
          align="left"
          score={showScores ? homeScore : undefined}
        />
        <div className="-mx-3 flex shrink-0 items-center self-center sm:-mx-4">
          <FifaCenterBadge
            homeScore={showScores ? homeScore : undefined}
            awayScore={showScores ? awayScore : undefined}
          />
        </div>
        <TeamBannerSide
          teamName={awayTeam}
          align="right"
          score={showScores ? awayScore : undefined}
        />
      </div>

      <p className="mt-3 text-center text-base font-bold tracking-wide text-white sm:text-lg">
        {homeTeam}{" "}
        <span className="font-normal text-muted">Vs</span> {awayTeam}
      </p>

      {showScorers && goals.length > 0 && (
        <GoalScorersList
          goals={goals}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          compact
          className="mt-3 px-2"
        />
      )}
    </div>
  );
}
