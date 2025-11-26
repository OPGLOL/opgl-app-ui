// API service for communicating with opgl-gateway

import type { Summoner, Match, SummonerRequest, MatchesRequest } from "@/types";

// Base URL for opgl-gateway
const API_BASE_URL = "http://localhost:8080";

// Generic fetch wrapper with error handling
async function fetchApi<T>(endpoint: string, body: object): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API error: ${response.status}`);
  }

  return response.json();
}

// Get summoner by Riot ID (gameName#tagLine)
export async function getSummoner(request: SummonerRequest): Promise<Summoner> {
  return fetchApi<Summoner>("/api/v1/summoner", request);
}

// Get match history for a player
export async function getMatchHistory(request: MatchesRequest): Promise<Match[]> {
  const requestBody = {
    region: request.region,
    puuid: request.puuid,
    gameName: request.gameName,
    tagLine: request.tagLine,
    count: request.count || 20,
  };

  return fetchApi<Match[]>("/api/v1/matches", requestBody);
}

// Health check for gateway
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "POST",
    });
    return response.ok;
  } catch {
    return false;
  }
}
