// OPGL Desktop - Main App (DPM.LOL inspired design)

import { useState } from "react";
import { PlayerSearch } from "@/components/PlayerSearch";
import { PlayerProfile } from "@/components/PlayerProfile";
import { PlayerStats } from "@/components/PlayerStats";
import { MatchHistory } from "@/components/MatchHistory";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getSummoner, getMatchHistory, getRankedStats } from "@/services/api";
import type { Summoner, Match, RankedStats, Region } from "@/types";

function App() {
  // State for player data
  const [summoner, setSummoner] = useState<Summoner | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [rankedStats, setRankedStats] = useState<RankedStats[]>([]);
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");

  // Loading states
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [isLoadingRanked, setIsLoadingRanked] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Handle player search
  const handleSearch = async (searchRegion: Region, searchGameName: string, searchTagLine: string) => {
    setIsSearching(true);
    setError(null);
    setSummoner(null);
    setMatches([]);
    setRankedStats([]);

    try {
      // Get summoner data
      const summonerData = await getSummoner({
        region: searchRegion,
        gameName: searchGameName,
        tagLine: searchTagLine,
      });

      setSummoner(summonerData);
      setGameName(searchGameName);
      setTagLine(searchTagLine);

      // Load match history and ranked stats in parallel
      setIsLoadingMatches(true);
      setIsLoadingRanked(true);

      const [matchData, rankedData] = await Promise.all([
        getMatchHistory({
          region: searchRegion,
          gameName: searchGameName,
          tagLine: searchTagLine,
          count: 20,
        }),
        getRankedStats({
          region: searchRegion,
          gameName: searchGameName,
          tagLine: searchTagLine,
        }),
      ]);

      setMatches(matchData);
      setRankedStats(rankedData.rankedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch player data");
    } finally {
      setIsSearching(false);
      setIsLoadingMatches(false);
      setIsLoadingRanked(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <span className="text-lg font-bold text-primary-foreground">O</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">OPGL</h1>
              <p className="text-xs text-muted-foreground">League Analytics</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          {/* Search Section */}
          <section className="w-full flex flex-col items-center gap-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">Search Player</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter a Riot ID to view stats and match history
              </p>
            </div>
            <PlayerSearch onSearch={handleSearch} isLoading={isSearching} />
          </section>

          {/* Error Message */}
          {error && (
            <div className="w-full max-w-2xl rounded-lg border border-red-500/50 bg-red-500/10 p-4">
              <p className="font-semibold text-red-400">Error</p>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Player Profile */}
          {summoner && (
            <section className="w-full flex flex-col items-center gap-4">
              <PlayerProfile summoner={summoner} gameName={gameName} tagLine={tagLine} />
            </section>
          )}

          {/* Player Ranked Stats */}
          {summoner && (
            <section className="w-full flex flex-col items-center gap-4">
              <PlayerStats rankedStats={rankedStats} isLoading={isLoadingRanked} />
            </section>
          )}

          {/* Match History */}
          {summoner && (
            <section className="w-full flex flex-col items-center gap-4">
              <MatchHistory
                matches={matches}
                puuid={summoner.puuid}
                isLoading={isLoadingMatches}
              />
            </section>
          )}

          {/* Empty State */}
          {!summoner && !isSearching && !error && (
            <div className="mt-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <svg
                  className="h-8 w-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium">Search for a player</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Example: <span className="font-mono text-primary">Newyenn#GGEZ</span>
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50">
        <div className="container mx-auto px-4 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            OPGL Desktop v0.1.0 • Make sure opgl-gateway is running on localhost:8080
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
