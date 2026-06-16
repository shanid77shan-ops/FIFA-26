import type { MatchGoalEvent } from "@/types/match-live";

type GoalScorersListProps = {
  goals: MatchGoalEvent[];
  homeTeam: string;
  awayTeam: string;
  compact?: boolean;
  className?: string;
};

function formatMinute(goal: MatchGoalEvent): string {
  return goal.extraMinute
    ? `${goal.minute}+${goal.extraMinute}'`
    : `${goal.minute}'`;
}

export function GoalScorersList({
  goals,
  homeTeam,
  awayTeam,
  compact = false,
  className = "",
}: GoalScorersListProps) {
  if (goals.length === 0) return null;

  const homeGoals = goals.filter((g) => g.team === "home");
  const awayGoals = goals.filter((g) => g.team === "away");

  if (compact) {
    return (
      <div className={`space-y-1 text-xs text-muted ${className}`}>
        {homeGoals.length > 0 && (
          <p>
            <span className="font-medium text-foreground">{homeTeam}:</span>{" "}
            {homeGoals
              .map((g) => `${g.player} ${formatMinute(g)}`)
              .join(", ")}
          </p>
        )}
        {awayGoals.length > 0 && (
          <p>
            <span className="font-medium text-foreground">{awayTeam}:</span>{" "}
            {awayGoals
              .map((g) => `${g.player} ${formatMinute(g)}`)
              .join(", ")}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      <GoalColumn team={homeTeam} goals={homeGoals} align="left" />
      <GoalColumn team={awayTeam} goals={awayGoals} align="right" />
    </div>
  );
}

function GoalColumn({
  team,
  goals,
  align,
}: {
  team: string;
  goals: MatchGoalEvent[];
  align: "left" | "right";
}) {
  if (goals.length === 0) {
    return (
      <div className={align === "right" ? "text-right" : ""}>
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
          {team}
        </p>
        <p className="mt-1 text-xs text-muted/70">—</p>
      </div>
    );
  }

  return (
    <div className={align === "right" ? "text-right" : ""}>
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
        {team}
      </p>
      <ul className="mt-1 space-y-0.5">
        {goals.map((goal, index) => (
          <li key={`${goal.player}-${goal.minute}-${index}`} className="text-xs">
            <span className="font-semibold text-white">{goal.player}</span>
            <span className="ml-1 text-muted">{formatMinute(goal)}</span>
            {goal.assist && (
              <span className="block text-[10px] text-muted/80">
                ({goal.assist})
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GoalEventsTimeline({
  goals,
  homeTeam,
  awayTeam,
}: {
  goals: MatchGoalEvent[];
  homeTeam: string;
  awayTeam: string;
}) {
  if (goals.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted">
        No goals yet. Updates refresh every 15 seconds.
      </p>
    );
  }

  const sorted = [...goals].sort((a, b) => a.minute - b.minute);

  return (
    <ul className="space-y-2 py-4">
      {sorted.map((goal, index) => (
        <li
          key={`${goal.player}-${goal.minute}-${index}`}
          className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm"
        >
          <span className="font-medium text-muted">{formatMinute(goal)}</span>
          <span className="text-right text-white">
            ⚽{" "}
            <span className="font-semibold">{goal.player}</span>
            <span className="ml-1 text-xs text-muted">
              ({goal.team === "home" ? homeTeam : awayTeam})
            </span>
            {goal.assist && (
              <span className="block text-xs text-muted">
                Assist: {goal.assist}
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
