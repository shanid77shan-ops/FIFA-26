export type KeyPlayer = {
  name: string;
  imageUrl: string;
};

/** Star player per nation — shown on live match cards */
export const TEAM_KEY_PLAYERS: Record<string, KeyPlayer> = {
  Argentina: {
    name: "Lionel Messi",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/440px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg",
  },
  Australia: {
    name: "Mathew Ryan",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mat_Ryan_2018.jpg/440px-Mat_Ryan_2018.jpg",
  },
  Austria: {
    name: "David Alaba",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/David_Alaba_2019.jpg/440px-David_Alaba_2019.jpg",
  },
  Algeria: {
    name: "Riyad Mahrez",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Riyad_Mahrez_2018.jpg/440px-Riyad_Mahrez_2018.jpg",
  },
  Belgium: {
    name: "Kevin De Bruyne",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/De_Bruyne_%28cropped%29.jpg/440px-De_Bruyne_%28cropped%29.jpg",
  },
  "Bosnia and Herzegovina": {
    name: "Edin Džeko",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Edin_D%C5%BEeko_2018.jpg/440px-Edin_D%C5%BEeko_2018.jpg",
  },
  Brazil: {
    name: "Vinícius Júnior",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Vin%C3%ADcius_J%C3%BAnior_2022_%28cropped%29.jpg/440px-Vin%C3%ADcius_J%C3%BAnior_2022_%28cropped%29.jpg",
  },
  Canada: {
    name: "Alphonso Davies",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Alphonso_Davies_2019.jpg/440px-Alphonso_Davies_2019.jpg",
  },
  Colombia: {
    name: "Luis Díaz",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Luis_D%C3%ADaz_2022.jpg/440px-Luis_D%C3%ADaz_2022.jpg",
  },
  Croatia: {
    name: "Luka Modrić",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Luka_Modri%C4%87_2018.jpg/440px-Luka_Modri%C4%87_2018.jpg",
  },
  Ecuador: {
    name: "Enner Valencia",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Enner_Valencia_2014.jpg/440px-Enner_Valencia_2014.jpg",
  },
  Egypt: {
    name: "Mohamed Salah",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mohamed_Salah_2018.jpg/440px-Mohamed_Salah_2018.jpg",
  },
  England: {
    name: "Harry Kane",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Harry_Kane_2018.jpg/440px-Harry_Kane_2018.jpg",
  },
  France: {
    name: "Kylian Mbappé",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Kylian_Mbapp%C3%A9_2018.jpg/440px-Kylian_Mbapp%C3%A9_2018.jpg",
  },
  Germany: {
    name: "Jamal Musiala",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Jamal_Musiala_2022.jpg/440px-Jamal_Musiala_2022.jpg",
  },
  Ghana: {
    name: "Mohammed Kudus",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Mohammed_Kudus_2022.jpg/440px-Mohammed_Kudus_2022.jpg",
  },
  Iran: {
    name: "Mehdi Taremi",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Mehdi_Taremi_2018.jpg/440px-Mehdi_Taremi_2018.jpg",
  },
  "Ivory Coast": {
    name: "Nicolas Pépé",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Nicolas_P%C3%A9p%C3%A9_2019.jpg/440px-Nicolas_P%C3%A9p%C3%A9_2019.jpg",
  },
  Japan: {
    name: "Takefusa Kubo",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Takefusa_Kubo_2019.jpg/440px-Takefusa_Kubo_2019.jpg",
  },
  Mexico: {
    name: "Raúl Jiménez",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Ra%C3%BAl_Jim%C3%A9nez_2018_World_Cup.jpg/440px-Ra%C3%BAl_Jim%C3%A9nez_2018_World_Cup.jpg",
  },
  Morocco: {
    name: "Achraf Hakimi",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Achraf_Hakimi_2018.jpg/440px-Achraf_Hakimi_2018.jpg",
  },
  Netherlands: {
    name: "Virgil van Dijk",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Virgil_van_Dijk_2018.jpg/440px-Virgil_van_Dijk_2018.jpg",
  },
  Norway: {
    name: "Erling Haaland",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Erling_Haaland_2023.jpg/440px-Erling_Haaland_2023.jpg",
  },
  Portugal: {
    name: "Cristiano Ronaldo",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/440px-Cristiano_Ronaldo_2018.jpg",
  },
  Scotland: {
    name: "Andrew Robertson",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Andrew_Robertson_2018.jpg/440px-Andrew_Robertson_2018.jpg",
  },
  Senegal: {
    name: "Sadio Mané",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Sadio_Man%C3%A9_2018.jpg/440px-Sadio_Man%C3%A9_2018.jpg",
  },
  "South Korea": {
    name: "Son Heung-min",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Son_Heung-min_2018.jpg/440px-Son_Heung-min_2018.jpg",
  },
  Spain: {
    name: "Pedri",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Pedri_2021.jpg/440px-Pedri_2021.jpg",
  },
  Sweden: {
    name: "Alexander Isak",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Alexander_Isak_2019.jpg/440px-Alexander_Isak_2019.jpg",
  },
  Switzerland: {
    name: "Granit Xhaka",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Granit_Xhaka_2018.jpg/440px-Granit_Xhaka_2018.jpg",
  },
  Türkiye: {
    name: "Arda Güler",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Arda_G%C3%BCler_2023.jpg/440px-Arda_G%C3%BCler_2023.jpg",
  },
  "United States": {
    name: "Christian Pulisic",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Christian_Pulisic_2019.jpg/440px-Christian_Pulisic_2019.jpg",
  },
  Uruguay: {
    name: "Federico Valverde",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Federico_Valverde_2019.jpg/440px-Federico_Valverde_2019.jpg",
  },
};

export function getKeyPlayer(teamName: string): KeyPlayer | undefined {
  return TEAM_KEY_PLAYERS[teamName];
}

/** Fuzzy match for Sportmonks team names that differ slightly from our data */
export function resolveKeyPlayer(teamName: string): KeyPlayer | undefined {
  const direct = TEAM_KEY_PLAYERS[teamName];
  if (direct) return direct;

  const normalized = teamName.toLowerCase();
  const entry = Object.entries(TEAM_KEY_PLAYERS).find(([name]) =>
    normalized.includes(name.toLowerCase()) ||
    name.toLowerCase().includes(normalized)
  );
  return entry?.[1];
}
