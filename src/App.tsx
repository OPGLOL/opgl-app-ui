// OPGL Desktop - Main App

import { useState } from "react";
import { PlayerSearch } from "@/components/PlayerSearch";
import { PlayerProfile } from "@/components/PlayerProfile";
import { MatchHistory } from "@/components/MatchHistory";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getSummoner, getMatchHistory } from "@/services/api";
import type { Summoner, Match, Region } from "@/types";

function App() {
  // State for player data
  const [summoner, setSummoner] = useState<Summoner | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");

  // Loading states
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Handle player search
  const handleSearch = async (searchRegion: Region, searchGameName: string, searchTagLine: string) => {
    setIsSearching(true);
    setError(null);
    setSummoner(null);
    setMatches([]);

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

      // Load match history
      setIsLoadingMatches(true);
      const matchData = await getMatchHistory({
        region: searchRegion,
        puuid: summonerData.puuid,
        count: 20,
      });

      setMatches(matchData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch player data");
    } finally {
      setIsSearching(false);
      setIsLoadingMatches(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">OPGL</h1>
            <p className="text-sm text-muted-foreground">League of Legends Performance Analytics</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          {/* Search Section */}
          <section className="w-full flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">Search Player</h2>
            <PlayerSearch onSearch={handleSearch} isLoading={isSearching} />
          </section>

          {/* Error Message */}
          {error && (
            <div className="w-full max-w-2xl rounded-lg border border-red-500 bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Player Profile */}
          {summoner && (
            <section className="w-full flex flex-col items-center gap-4">
              <PlayerProfile summoner={summoner} gameName={gameName} tagLine={tagLine} />
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
            <div className="text-center text-muted-foreground">
              <p className="text-lg">Enter a Riot ID to get started</p>
              <p className="text-sm">Example: Newyenn#GGEZ</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>OPGL Desktop v0.1.0</p>
          <p>Make sure opgl-gateway is running on localhost:8080</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
