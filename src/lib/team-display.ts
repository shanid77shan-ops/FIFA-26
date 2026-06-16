import { QUALIFIED_COUNTRIES } from "@/data/qualified-countries";

const FLAG_CODE_OVERRIDES: Record<string, string> = {
  "GB-ENG": "gb-eng",
  "GB-SCT": "gb-sct",
  CW: "cw",
};

export function getTeamFlag(teamName: string): string {
  const country = QUALIFIED_COUNTRIES.find((c) => c.name === teamName);
  return country?.flag ?? "🏳️";
}

export function getTeamFlagImageCode(teamName: string): string {
  const country = QUALIFIED_COUNTRIES.find((c) => c.name === teamName);
  if (!country) return "un";

  const code = FLAG_CODE_OVERRIDES[country.code] ?? country.code.slice(0, 2);
  return code.toLowerCase();
}

export function getTeamFlagImageUrl(teamName: string): string {
  return `https://flagcdn.com/w80/${getTeamFlagImageCode(teamName)}.png`;
}

/** FIFA-style 3-letter team codes for match banners */
export const TEAM_ABBREVIATIONS: Record<string, string> = {
  Argentina: "ARG",
  Australia: "AUS",
  Austria: "AUT",
  Algeria: "ALG",
  Belgium: "BEL",
  "Bosnia and Herzegovina": "BIH",
  Brazil: "BRA",
  Canada: "CAN",
  "Cape Verde": "CPV",
  Colombia: "COL",
  Croatia: "CRO",
  Curaçao: "CUW",
  Czechia: "CZE",
  "DR Congo": "COD",
  Ecuador: "ECU",
  Egypt: "EGY",
  England: "ENG",
  France: "FRA",
  Germany: "GER",
  Ghana: "GHA",
  Haiti: "HAI",
  Iran: "IRN",
  Iraq: "IRQ",
  "Ivory Coast": "CIV",
  Japan: "JPN",
  Jordan: "JOR",
  Mexico: "MEX",
  Morocco: "MAR",
  Netherlands: "NED",
  "New Zealand": "NZL",
  Norway: "NOR",
  Panama: "PAN",
  Paraguay: "PAR",
  Portugal: "POR",
  Qatar: "QAT",
  "Saudi Arabia": "KSA",
  Scotland: "SCO",
  Senegal: "SEN",
  "South Africa": "RSA",
  "South Korea": "KOR",
  Spain: "ESP",
  Sweden: "SWE",
  Switzerland: "SUI",
  Tunisia: "TUN",
  Türkiye: "TUR",
  "United States": "USA",
  Uruguay: "URU",
  Uzbekistan: "UZB",
};

export function getTeamAbbreviation(teamName: string): string {
  return TEAM_ABBREVIATIONS[teamName] ?? teamName.slice(0, 3).toUpperCase();
}
