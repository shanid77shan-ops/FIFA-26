export type QualifiedCountry = {
  name: string;
  code: string;
  flag: string;
  confederation: string;
};

/** All 48 nations qualified for FIFA World Cup 2026 */
export const QUALIFIED_COUNTRIES: QualifiedCountry[] = [
  { name: "Argentina", code: "AR", flag: "🇦🇷", confederation: "CONMEBOL" },
  { name: "Australia", code: "AU", flag: "🇦🇺", confederation: "AFC" },
  { name: "Austria", code: "AT", flag: "🇦🇹", confederation: "UEFA" },
  { name: "Algeria", code: "DZ", flag: "🇩🇿", confederation: "CAF" },
  { name: "Belgium", code: "BE", flag: "🇧🇪", confederation: "UEFA" },
  { name: "Bosnia and Herzegovina", code: "BA", flag: "🇧🇦", confederation: "UEFA" },
  { name: "Brazil", code: "BR", flag: "🇧🇷", confederation: "CONMEBOL" },
  { name: "Canada", code: "CA", flag: "🇨🇦", confederation: "CONCACAF" },
  { name: "Cape Verde", code: "CV", flag: "🇨🇻", confederation: "CAF" },
  { name: "Colombia", code: "CO", flag: "🇨🇴", confederation: "CONMEBOL" },
  { name: "Croatia", code: "HR", flag: "🇭🇷", confederation: "UEFA" },
  { name: "Curaçao", code: "CW", flag: "🇨🇼", confederation: "CONCACAF" },
  { name: "Czechia", code: "CZ", flag: "🇨🇿", confederation: "UEFA" },
  { name: "DR Congo", code: "CD", flag: "🇨🇩", confederation: "CAF" },
  { name: "Ecuador", code: "EC", flag: "🇪🇨", confederation: "CONMEBOL" },
  { name: "Egypt", code: "EG", flag: "🇪🇬", confederation: "CAF" },
  { name: "England", code: "GB-ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", confederation: "UEFA" },
  { name: "France", code: "FR", flag: "🇫🇷", confederation: "UEFA" },
  { name: "Germany", code: "DE", flag: "🇩🇪", confederation: "UEFA" },
  { name: "Ghana", code: "GH", flag: "🇬🇭", confederation: "CAF" },
  { name: "Haiti", code: "HT", flag: "🇭🇹", confederation: "CONCACAF" },
  { name: "Iran", code: "IR", flag: "🇮🇷", confederation: "AFC" },
  { name: "Iraq", code: "IQ", flag: "🇮🇶", confederation: "AFC" },
  { name: "Ivory Coast", code: "CI", flag: "🇨🇮", confederation: "CAF" },
  { name: "Japan", code: "JP", flag: "🇯🇵", confederation: "AFC" },
  { name: "Jordan", code: "JO", flag: "🇯🇴", confederation: "AFC" },
  { name: "Mexico", code: "MX", flag: "🇲🇽", confederation: "CONCACAF" },
  { name: "Morocco", code: "MA", flag: "🇲🇦", confederation: "CAF" },
  { name: "Netherlands", code: "NL", flag: "🇳🇱", confederation: "UEFA" },
  { name: "New Zealand", code: "NZ", flag: "🇳🇿", confederation: "OFC" },
  { name: "Norway", code: "NO", flag: "🇳🇴", confederation: "UEFA" },
  { name: "Panama", code: "PA", flag: "🇵🇦", confederation: "CONCACAF" },
  { name: "Paraguay", code: "PY", flag: "🇵🇾", confederation: "CONMEBOL" },
  { name: "Portugal", code: "PT", flag: "🇵🇹", confederation: "UEFA" },
  { name: "Qatar", code: "QA", flag: "🇶🇦", confederation: "AFC" },
  { name: "Saudi Arabia", code: "SA", flag: "🇸🇦", confederation: "AFC" },
  { name: "Scotland", code: "GB-SCT", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", confederation: "UEFA" },
  { name: "Senegal", code: "SN", flag: "🇸🇳", confederation: "CAF" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦", confederation: "CAF" },
  { name: "South Korea", code: "KR", flag: "🇰🇷", confederation: "AFC" },
  { name: "Spain", code: "ES", flag: "🇪🇸", confederation: "UEFA" },
  { name: "Sweden", code: "SE", flag: "🇸🇪", confederation: "UEFA" },
  { name: "Switzerland", code: "CH", flag: "🇨🇭", confederation: "UEFA" },
  { name: "Tunisia", code: "TN", flag: "🇹🇳", confederation: "CAF" },
  { name: "Türkiye", code: "TR", flag: "🇹🇷", confederation: "UEFA" },
  { name: "United States", code: "US", flag: "🇺🇸", confederation: "CONCACAF" },
  { name: "Uruguay", code: "UY", flag: "🇺🇾", confederation: "CONMEBOL" },
  { name: "Uzbekistan", code: "UZ", flag: "🇺🇿", confederation: "AFC" },
];

/** Common country names that did NOT qualify — used for ineligible search detection */
export const INELIGIBLE_COUNTRY_ALIASES: Record<string, string> = {
  italy: "Italy",
  india: "India",
  china: "China",
  russia: "Russia",
  ukraine: "Ukraine",
  poland: "Poland",
  denmark: "Denmark",
  wales: "Wales",
  ireland: "Ireland",
  "republic of ireland": "Ireland",
  "northern ireland": "Northern Ireland",
  serbia: "Serbia",
  greece: "Greece",
  romania: "Romania",
  hungary: "Hungary",
  slovakia: "Slovakia",
  slovenia: "Slovenia",
  finland: "Finland",
  iceland: "Iceland",
  "costa rica": "Costa Rica",
  jamaica: "Jamaica",
  chile: "Chile",
  peru: "Peru",
  bolivia: "Bolivia",
  venezuela: "Venezuela",
  nigeria: "Nigeria",
  cameroon: "Cameroon",
  kenya: "Kenya",
  "united arab emirates": "United Arab Emirates",
  uae: "United Arab Emirates",
  thailand: "Thailand",
  vietnam: "Vietnam",
  indonesia: "Indonesia",
  pakistan: "Pakistan",
  bangladesh: "Bangladesh",
  "sri lanka": "Sri Lanka",
  "north korea": "North Korea",
  korea: "South Korea",
  "cote d'ivoire": "Ivory Coast",
  "côte d'ivoire": "Ivory Coast",
  "democratic republic of the congo": "DR Congo",
  congo: "DR Congo",
  zaire: "DR Congo",
  "czech republic": "Czechia",
  turkey: "Türkiye",
  usa: "United States",
  america: "United States",
  "united states of america": "United States",
  iran: "Iran",
  "ir iran": "Iran",
};

export function normalizeCountryQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function findQualifiedCountry(query: string): QualifiedCountry | null {
  const normalized = normalizeCountryQuery(query);
  if (!normalized) return null;

  return (
    QUALIFIED_COUNTRIES.find(
      (country) =>
        country.name.toLowerCase().includes(normalized) ||
        country.code.toLowerCase() === normalized
    ) ?? null
  );
}

export function findIneligibleCountryName(query: string): string | null {
  const normalized = normalizeCountryQuery(query);
  if (!normalized || normalized.length < 2) return null;

  if (findQualifiedCountry(query)) return null;

  const alias = INELIGIBLE_COUNTRY_ALIASES[normalized];
  if (alias && !findQualifiedCountry(alias)) return alias;

  for (const [key, displayName] of Object.entries(INELIGIBLE_COUNTRY_ALIASES)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      if (!findQualifiedCountry(displayName)) return displayName;
    }
  }

  return null;
}

export function filterQualifiedCountries(query: string): QualifiedCountry[] {
  const normalized = normalizeCountryQuery(query);
  if (!normalized) return QUALIFIED_COUNTRIES;

  return QUALIFIED_COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(normalized)
  );
}

export type UserProfile = {
  name: string;
};

export const USER_PROFILE_KEY = "fifa2026-user-profile";
