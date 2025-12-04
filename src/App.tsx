// OPGL Desktop - Main App with enhanced design

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerSearch } from "@/components/PlayerSearch";
import { PlayerProfile } from "@/components/PlayerProfile";
import { PlayerStats } from "@/components/PlayerStats";
import { MatchHistory } from "@/components/MatchHistory";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getSummoner, getMatchHistory, getRankedStats } from "@/services/api";
import { Search, AlertCircle, Sparkles } from "lucide-react";
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
      {/* Decorative background gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Logo with gradient and glow */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-accent opacity-50 blur-sm" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gradient-purple">OPGL</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">League Analytics</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-10">
          {/* Hero Section with Search */}
          <section className="w-full flex flex-col items-center gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Search <span className="text-gradient-purple">Player</span>
              </h2>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                Enter a Riot ID to view detailed stats, ranked progress, and match history
              </p>
            </motion.div>
            <PlayerSearch onSearch={handleSearch} isLoading={isSearching} />
          </section>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                className="w-full max-w-2xl rounded-2xl border border-red-500/30 bg-red-500/10 p-5 glass-card"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-red-400">Error</p>
                    <p className="text-sm text-red-300/80">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Player Results */}
          <AnimatePresence mode="wait">
            {summoner && (
              <motion.div
                className="w-full flex flex-col items-center gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Player Profile */}
                <section className="w-full flex flex-col items-center">
                  <PlayerProfile summoner={summoner} gameName={gameName} tagLine={tagLine} />
                </section>

                {/* Player Ranked Stats */}
                <section className="w-full flex flex-col items-center">
                  <PlayerStats rankedStats={rankedStats} isLoading={isLoadingRanked} />
                </section>

                {/* Match History */}
                <section className="w-full flex flex-col items-center">
                  <MatchHistory
                    matches={matches}
                    puuid={summoner.puuid}
                    isLoading={isLoadingMatches}
                  />
                </section>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          <AnimatePresence>
            {!summoner && !isSearching && !error && (
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="relative mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary/80 border border-border">
                    <Search className="h-9 w-9 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-xl font-medium">Ready to analyze</p>
                <p className="mt-2 text-muted-foreground max-w-xs mx-auto">
                  Search for a player using their Riot ID to get started
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground/70">
                  <span>Example:</span>
                  <code className="rounded-lg bg-secondary px-3 py-1.5 font-mono text-primary">
                    Newyenn#GGEZ
                  </code>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-5 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">OPGL Desktop</span>
            <span className="mx-2 text-border">•</span>
            v0.1.0
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Make sure opgl-gateway is running on localhost:8080
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
