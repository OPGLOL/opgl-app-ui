// Test fixtures for OPGL App UI tests
import type { Summoner, Match, Participant } from "@/types";

// Mock summoner data
export const mockSummoner: Summoner = {
  id: "test-summoner-id",
  accountId: "test-account-id",
  puuid: "test-puuid-12345678901234567890123456789012345678901234567890",
  name: "TestPlayer",
  profileIconId: 4567,
  summonerLevel: 350,
};

// Mock participant data
export const mockParticipant: Participant = {
  puuid: "test-puuid-12345678901234567890123456789012345678901234567890",
  summonerName: "TestPlayer",
  championId: 157,
  championName: "Yasuo",
  kills: 10,
  deaths: 3,
  assists: 7,
  goldEarned: 15000,
  totalDamageDealtToChampions: 25000,
  totalDamageTaken: 18000,
  visionScore: 25,
  totalMinionsKilled: 180,
  win: true,
  teamPosition: "MIDDLE",
};

// Mock participant who lost the match
export const mockLosingParticipant: Participant = {
  puuid: "losing-puuid-12345678901234567890123456789012345678901234567890",
  summonerName: "LosingPlayer",
  championId: 238,
  championName: "Zed",
  kills: 2,
  deaths: 8,
  assists: 3,
  goldEarned: 8000,
  totalDamageDealtToChampions: 12000,
  totalDamageTaken: 22000,
  visionScore: 10,
  totalMinionsKilled: 120,
  win: false,
  teamPosition: "MIDDLE",
};

// Mock participant with zero deaths (perfect KDA)
export const mockPerfectParticipant: Participant = {
  puuid: "perfect-puuid-12345678901234567890123456789012345678901234567890",
  summonerName: "PerfectPlayer",
  championId: 64,
  championName: "LeeSin",
  kills: 15,
  deaths: 0,
  assists: 10,
  goldEarned: 20000,
  totalDamageDealtToChampions: 30000,
  totalDamageTaken: 15000,
  visionScore: 50,
  totalMinionsKilled: 50,
  win: true,
  teamPosition: "JUNGLE",
};

// Mock match data - victory
export const mockMatch: Match = {
  matchId: "NA1_4567890123",
  gameCreation: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  gameDuration: 1800, // 30 minutes
  gameMode: "CLASSIC",
  gameType: "MATCHED_GAME",
  participants: [mockParticipant, mockLosingParticipant],
};

// Mock match data - defeat
export const mockDefeatMatch: Match = {
  matchId: "NA1_9876543210",
  gameCreation: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  gameDuration: 2100, // 35 minutes
  gameMode: "CLASSIC",
  gameType: "MATCHED_GAME",
  participants: [
    {
      ...mockParticipant,
      win: false,
      kills: 5,
      deaths: 7,
      assists: 4,
    },
    {
      ...mockLosingParticipant,
      win: true,
    },
  ],
};

// Mock match with perfect KDA player
export const mockPerfectKDAMatch: Match = {
  matchId: "NA1_1111111111",
  gameCreation: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  gameDuration: 1500, // 25 minutes
  gameMode: "CLASSIC",
  gameType: "MATCHED_GAME",
  participants: [mockPerfectParticipant],
};

// Mock match list for match history
export const mockMatchList: Match[] = [
  mockMatch,
  mockDefeatMatch,
  mockPerfectKDAMatch,
];

// Empty match list
export const emptyMatchList: Match[] = [];

// Mock API error response
export const mockApiError = {
  error: "Player not found",
  status: 404,
};
