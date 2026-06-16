export {
  getTeamFlag,
  getTeamFlagImageUrl,
  getTeamAbbreviation,
} from "@/lib/team-display";

const IST_TIMEZONE = "Asia/Kolkata";

export function getIstDayKey(kickoff: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(kickoff));
}

export function getTodayIstDayKey(now: Date = new Date()): string {
  return getIstDayKey(now.toISOString());
}

export function addDaysToDayKey(dayKey: string, days: number): string {
  const [year, month, day] = dayKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function formatSelectedDayHeading(
  dayKey: string,
  todayKey: string
): string {
  const formatted = formatMatchDate(`${dayKey}T06:30:00Z`);
  if (dayKey === todayKey) return `Today · ${formatted}`;
  const tomorrowKey = addDaysToDayKey(todayKey, 1);
  if (dayKey === tomorrowKey) return `Tomorrow · ${formatted}`;
  return formatted;
}

export function isToday(dayKey: string, now: Date = new Date()): boolean {
  return dayKey === getTodayIstDayKey(now);
}

export function formatMatchDate(kickoff: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: IST_TIMEZONE,
  }).format(new Date(kickoff));
}

export function formatDayTabLabel(dayKey: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: IST_TIMEZONE,
  }).format(new Date(`${dayKey}T12:00:00Z`));
}

export function formatIndianTime(kickoff: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: IST_TIMEZONE,
    timeZoneName: "short",
  }).format(new Date(kickoff));
}

export function formatLocalTime(kickoff: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(kickoff));
}

/** @deprecated Use formatIndianTime or formatLocalTime */
export function formatMatchTime(kickoff: string): string {
  return formatIndianTime(kickoff);
}

export function getCountdownLabel(kickoff: string, now: Date = new Date()): string {
  const diffMs = new Date(kickoff).getTime() - now.getTime();
  if (diffMs <= 0) return "Starting soon";

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days >= 1) {
    const remainingHours = hours % 24;
    return remainingHours > 0
      ? `In ${days}d ${remainingHours}h`
      : `In ${days} day${days > 1 ? "s" : ""}`;
  }

  if (hours >= 1) {
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return minutes > 0 ? `In ${hours}h ${minutes}m` : `In ${hours}h`;
  }

  const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  return `In ${minutes}m`;
}
