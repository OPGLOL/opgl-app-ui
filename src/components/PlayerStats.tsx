// PlayerStats component - enhanced ranked statistics display

import { motion } from "framer-motion";
import { Trophy, TrendingUp, Target, Swords } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { RankedStats } from "@/types";

interface PlayerStatsProps {
  rankedStats: RankedStats[];
  isLoading: boolean;
}

// Map queue types to display names and icons
const QUEUE_CONFIG: Record<string, { label: string; icon: typeof Trophy }> = {
  RANKED_SOLO_5x5: { label: "Ranked Solo/Duo", icon: Trophy },
  RANKED_FLEX_SR: { label: "Ranked Flex", icon: Swords },
  RANKED_TFT_DOUBLE_UP: { label: "TFT Double Up", icon: Target },
};

// Tier configuration with colors and gradients
const TIER_CONFIG: Record<string, { gradient: string; textColor: string; glowColor: string }> = {
  IRON: {
    gradient: "from-gray-600 to-gray-400",
    textColor: "text-gray-300",
    glowColor: "shadow-gray-500/30",
  },
  BRONZE: {
    gradient: "from-amber-800 to-amber-600",
    textColor: "text-amber-400",
    glowColor: "shadow-amber-500/30",
  },
  SILVER: {
    gradient: "from-gray-400 to-gray-200",
    textColor: "text-gray-200",
    glowColor: "shadow-gray-400/30",
  },
  GOLD: {
    gradient: "from-yellow-600 to-yellow-400",
    textColor: "text-yellow-400",
    glowColor: "shadow-yellow-500/30",
  },
  PLATINUM: {
    gradient: "from-cyan-600 to-cyan-400",
    textColor: "text-cyan-400",
    glowColor: "shadow-cyan-500/30",
  },
  EMERALD: {
    gradient: "from-emerald-600 to-emerald-400",
    textColor: "text-emerald-400",
    glowColor: "shadow-emerald-500/30",
  },
  DIAMOND: {
    gradient: "from-blue-600 to-blue-400",
    textColor: "text-blue-400",
    glowColor: "shadow-blue-500/30",
  },
  MASTER: {
    gradient: "from-purple-600 to-purple-400",
    textColor: "text-purple-400",
    glowColor: "shadow-purple-500/30",
  },
  GRANDMASTER: {
    gradient: "from-red-600 to-red-400",
    textColor: "text-red-400",
    glowColor: "shadow-red-500/30",
  },
  CHALLENGER: {
    gradient: "from-amber-500 via-yellow-300 to-amber-500",
    textColor: "text-yellow-300",
    glowColor: "shadow-yellow-400/40",
  },
};

// Format tier name for display
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

// Get queue configuration
function getQueueConfig(queueType: string) {
  return QUEUE_CONFIG[queueType] ?? { label: queueType, icon: Trophy };
}

// Get tier configuration
function getTierConfig(tier: string) {
  return TIER_CONFIG[tier.toUpperCase()] ?? TIER_CONFIG.IRON;
}

// Single ranked queue card with enhanced design
function RankedQueueCard({ stats, index }: { stats: RankedStats; index: number }) {
  const winrate = calculateWinrate(stats.wins, stats.losses);
  const totalGames = stats.wins + stats.losses;
  const queueConfig = getQueueConfig(stats.queueType);
  const tierConfig = getTierConfig(stats.tier);
  const QueueIcon = queueConfig.icon;

  return (
    <motion.div
      className="flex-1 min-w-[320px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className={`
        relative overflow-hidden rounded-2xl
        glass-card card-hover
        shadow-lg ${tierConfig.glowColor}
      `}>
        {/* Subtle tier-colored accent at top */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${tierConfig.gradient}`} />

        <div className="p-5">
          {/* Header with queue type */}
          <div className="flex items-center gap-2 mb-4">
            <div className={`
              flex h-8 w-8 items-center justify-center rounded-lg
              bg-gradient-to-br ${tierConfig.gradient}
            `}>
              <QueueIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {queueConfig.label}
            </span>
          </div>

          {/* Tier and Rank Display */}
          <div className="flex items-center gap-4 mb-5">
            {/* Rank emblem - large tier icon */}
            <motion.div
              className={`
                flex h-16 w-16 items-center justify-center rounded-xl
                bg-gradient-to-br ${tierConfig.gradient}
                shadow-lg ${tierConfig.glowColor}
              `}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-2xl font-bold text-white drop-shadow-lg">
                {stats.tier.charAt(0)}
                {stats.rank !== "I" && <span className="text-lg">{stats.rank}</span>}
              </span>
            </motion.div>

            {/* Tier text and LP */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${tierConfig.textColor}`}>
                  {formatTier(stats.tier)}
                </span>
                <span className="text-lg text-muted-foreground font-medium">
                  {stats.rank}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-lg font-semibold text-primary">
                  {stats.leaguePoints} LP
                </span>
              </div>
            </div>
          </div>

          {/* Win Rate Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Win Rate</span>
              <span className={`font-bold ${winrate >= 50 ? "text-green-400" : "text-red-400"}`}>
                {winrate}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="relative h-2.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className={`
                  absolute inset-y-0 left-0 rounded-full
                  ${winrate >= 50
                    ? "bg-gradient-to-r from-green-500 to-green-400"
                    : "bg-gradient-to-r from-red-500 to-red-400"
                  }
                `}
                initial={{ width: 0 }}
                animate={{ width: `${winrate}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              />
              {/* 50% marker */}
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-border/50" />
            </div>

            {/* Win/Loss Stats */}
            <div className="flex items-center justify-between text-sm pt-1">
              <div className="flex items-center gap-3">
                <span className="text-green-400 font-semibold">{stats.wins}W</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-red-400 font-semibold">{stats.losses}L</span>
              </div>
              <span className="text-muted-foreground">
                {totalGames} games
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Loading skeleton for ranked stats
function RankedStatsSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      className="flex-1 min-w-[320px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="rounded-2xl glass-card p-5">
        {/* Header skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Tier display skeleton */}
        <div className="flex items-center gap-4 mb-5">
          <Skeleton className="h-16 w-16 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>

        {/* Progress bar skeleton */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2.5 w-full rounded-full" />
          <div className="flex justify-between pt-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PlayerStats({ rankedStats, isLoading }: PlayerStatsProps) {
  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-3xl">
        <motion.h3
          className="mb-4 text-lg font-semibold flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Trophy className="h-5 w-5 text-primary" />
          Ranked Stats
        </motion.h3>
        <div className="flex flex-wrap gap-4">
          <RankedStatsSkeleton index={0} />
          <RankedStatsSkeleton index={1} />
        </div>
      </div>
    );
  }

  // Show empty state if no ranked data
  if (rankedStats.length === 0) {
    return (
      <motion.div
        className="w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Ranked Stats
        </h3>
        <div className="rounded-2xl glass-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Trophy className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            No ranked data available for this player
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Play some ranked games to see your stats here
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <motion.h3
        className="mb-4 text-lg font-semibold flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Trophy className="h-5 w-5 text-primary" />
        Ranked Stats
      </motion.h3>
      <div className="flex flex-wrap gap-4">
        {rankedStats.map((stats, index) => (
          <RankedQueueCard key={stats.queueType} stats={stats} index={index} />
        ))}
      </div>
    </div>
  );
}
