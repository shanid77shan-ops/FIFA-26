export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  category: "Tournament" | "Teams" | "Hosts" | "Format" | "Fans";
  publishedAt: string;
  emoji: string;
};

export const WC2026_QUICK_FACTS = [
  { label: "Teams", value: "48 nations" },
  { label: "Hosts", value: "USA · Canada · Mexico" },
  { label: "Matches", value: "104 fixtures" },
  { label: "Runs", value: "11 Jun – 19 Jul 2026" },
];

export const WC2026_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "First 48-team World Cup kicks off in North America",
    summary:
      "FIFA World Cup 2026 is the biggest edition yet — 48 qualified nations, 12 groups of four, and 104 matches across three host countries.",
    category: "Tournament",
    publishedAt: "2026-06-01",
    emoji: "🏆",
  },
  {
    id: "2",
    title: "Mexico, USA & Canada share hosting duties",
    summary:
      "Matches span 16 cities from Mexico City and Toronto to Los Angeles and New York. The final will be held at MetLife Stadium in New Jersey.",
    category: "Hosts",
    publishedAt: "2026-05-28",
    emoji: "🌎",
  },
  {
    id: "3",
    title: "Expanded knockout round debuts",
    summary:
      "The top two from each group plus the eight best third-place teams advance to a new Round of 32 — more drama, more knockout football.",
    category: "Format",
    publishedAt: "2026-05-25",
    emoji: "⚽",
  },
  {
    id: "4",
    title: "Group stage favourites to watch",
    summary:
      "Argentina defend their title alongside France, Brazil, England, and Spain. Dark horses include Morocco, Japan, and the USA on home soil.",
    category: "Teams",
    publishedAt: "2026-06-10",
    emoji: "⭐",
  },
  {
    id: "5",
    title: "India-friendly kick-off times",
    summary:
      "Most evening matches in the Americas translate to late-night or early-morning IST. Use this app to track every fixture in Indian Standard Time.",
    category: "Fans",
    publishedAt: "2026-06-08",
    emoji: "🇮🇳",
  },
  {
    id: "6",
    title: "Opening match: Mexico vs South Africa",
    summary:
      "The tournament opens at Mexico City Stadium on 11 June 2026 — a historic start for the first World Cup with three host nations.",
    category: "Tournament",
    publishedAt: "2026-06-11",
    emoji: "🎉",
  },
  {
    id: "7",
    title: "New generation stars step up",
    summary:
      "From Mbappé and Bellingham to Yamal and Musiala, WC 2026 is set to showcase football's next era of global superstars.",
    category: "Teams",
    publishedAt: "2026-06-12",
    emoji: "✨",
  },
  {
    id: "8",
    title: "Sustainability & fan zones across hosts",
    summary:
      "Host cities are rolling out fan festivals, transit upgrades, and viewing zones so supporters worldwide can experience the World Cup atmosphere.",
    category: "Hosts",
    publishedAt: "2026-06-05",
    emoji: "🎊",
  },
];

export function formatNewsDate(dateKey: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateKey}T12:00:00Z`));
}
