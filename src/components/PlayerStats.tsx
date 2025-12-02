// PlayerStats component - displays ranked statistics

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { RankedStats } from "@/types";

interface PlayerStatsProps {
  rankedStats: RankedStats[];
  isLoading: boolean;
}

// Map queue types to display names
const QUEUE_TYPE_LABELS: Record<string, string> = {
  RANKED_SOLO_5x5: "Ranked Solo/Duo",
  RANKED_FLEX_SR: "Ranked Flex",
  RANKED_TFT_DOUBLE_UP: "TFT Double Up",
};

// Map tier names to colors for styling
const TIER_COLORS: Record<string, string> = {
  IRON: "bg-gray-600",
  BRONZE: "bg-amber-700",
  SILVER: "bg-gray-400",
  GOLD: "bg-yellow-500",
  PLATINUM: "bg-cyan-500",
  EMERALD: "bg-emerald-500",
  DIAMOND: "bg-blue-500",
  MASTER: "bg-purple-500",
  GRANDMASTER: "bg-red-500",
  CHALLENGER: "bg-amber-400",
};

// Format tier name for display (capitalize first letter)
function formatTier(tier: string): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
}

// Calculate winrate percentage
function calculateWinrate(wins: number, losses: number): number {
  const totalGames = wins + losses;
  if (totalGames === 0) {
    return 0;
  }
  return Math.round((wins / totalGames) * 100);
}

// Get queue type display label
function getQueueLabel(queueType: string): string {
  return QUEUE_TYPE_LABELS[queueType] ?? queueType;
}

// Get tier color class
function getTierColorClass(tier: string): string {
  return TIER_COLORS[tier.toUpperCase()] ?? "bg-gray-500";
}

// Single ranked queue card
function RankedQueueCard({ stats }: { stats: RankedStats }) {
  const winrate = calculateWinrate(stats.wins, stats.losses);
  const totalGames = stats.wins + stats.losses;
  const tierColorClass = getTierColorClass(stats.tier);

  return (
    <Card className="flex-1 min-w-[280px] border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {getQueueLabel(stats.queueType)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Tier and Rank Display */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${tierColorClass}`}
          >
            <span className="text-lg font-bold text-white">
              {stats.tier.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">
                {formatTier(stats.tier)}
              </span>
              <span className="text-lg text-muted-foreground">
                {stats.rank}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {stats.leaguePoints} LP
            </div>
          </div>
        </div>

        {/* Win/Loss Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-400">{stats.wins}W</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-red-400">{stats.losses}L</span>
            <span className="text-muted-foreground">
              ({totalGames} games)
            </span>
          </div>
          <Badge
            variant={winrate >= 50 ? "default" : "secondary"}
            className={winrate >= 50 ? "bg-green-600" : "bg-red-600"}
          >
            {winrate}% WR
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading skeleton for ranked stats
function RankedStatsSkeleton() {
  return (
    <Card className="flex-1 min-w-[280px] border-border/50 bg-card/50">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function PlayerStats({ rankedStats, isLoading }: PlayerStatsProps) {
  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-2xl">
        <h3 className="mb-4 text-lg font-semibold">Ranked Stats</h3>
        <div className="flex flex-wrap gap-4">
          <RankedStatsSkeleton />
          <RankedStatsSkeleton />
        </div>
      </div>
    );
  }

  // Show empty state if no ranked data
  if (rankedStats.length === 0) {
    return (
      <div className="w-full max-w-2xl">
        <h3 className="mb-4 text-lg font-semibold">Ranked Stats</h3>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No ranked data available for this player
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <h3 className="mb-4 text-lg font-semibold">Ranked Stats</h3>
      <div className="flex flex-wrap gap-4">
        {rankedStats.map((stats) => (
          <RankedQueueCard key={stats.queueType} stats={stats} />
        ))}
      </div>
    </div>
  );
}
