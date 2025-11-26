// TypeScript interfaces matching opgl-data models

// Summoner represents a League of Legends player account
export interface Summoner {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  summonerLevel: number;
}

// Participant represents a player in a match
export interface Participant {
  puuid: string;
  summonerName: string;
  championId: number;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  goldEarned: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  visionScore: number;
  totalMinionsKilled: number;
  win: boolean;
  teamPosition: string;
}

// Match represents a completed game
export interface Match {
  matchId: string;
  gameCreation: string;
  gameDuration: number;
  gameMode: string;
  gameType: string;
  participants: Participant[];
}

// API request types
export interface SummonerRequest {
  region: string;
  gameName: string;
  tagLine: string;
}

export interface MatchesRequest {
  region: string;
  puuid?: string;
  gameName?: string;
  tagLine?: string;
  count?: number;
}

// API response types
export interface ApiError {
  error: string;
  status: number;
}

// Region options for dropdown
export const REGIONS = [
  { value: "na", label: "North America" },
  { value: "euw", label: "Europe West" },
  { value: "eune", label: "Europe Nordic & East" },
  { value: "kr", label: "Korea" },
  { value: "br", label: "Brazil" },
  { value: "jp", label: "Japan" },
  { value: "oce", label: "Oceania" },
  { value: "lan", label: "Latin America North" },
  { value: "las", label: "Latin America South" },
  { value: "tr", label: "Turkey" },
  { value: "ru", label: "Russia" },
] as const;

export type Region = (typeof REGIONS)[number]["value"];
