// MatchHistory component - enhanced match list with animations

import { motion } from "framer-motion";
import { MatchCard } from "@/components/MatchCard";
import { Skeleton } from "@/components/ui/skeleton";
import { History, Gamepad2 } from "lucide-react";
import type { Match } from "@/types";

interface MatchHistoryProps {
  matches: Match[];
  puuid: string;
  isLoading: boolean;
}

// Enhanced loading skeleton for match cards
function MatchSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl glass-card p-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="flex items-center gap-4">
        {/* Champion icon skeleton */}
        <div className="relative flex-shrink-0">
          <Skeleton className="h-16 w-16 rounded-xl" />
          <Skeleton className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full" />
        </div>

        {/* Match info skeleton */}
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>

        {/* Stats skeleton */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <Skeleton className="h-5 w-20 mx-auto" />
            <Skeleton className="h-3 w-14 mx-auto mt-1" />
          </div>
          <div className="hidden sm:block text-center">
            <Skeleton className="h-5 w-12 mx-auto" />
            <Skeleton className="h-3 w-10 mx-auto mt-1" />
          </div>
          <div className="hidden md:block text-center">
            <Skeleton className="h-5 w-12 mx-auto" />
            <Skeleton className="h-3 w-14 mx-auto mt-1" />
          </div>
        </div>
      </div>

      {/* Shimmer overlay for loading effect */}
      <div className="absolute inset-0 shimmer" />
    </motion.div>
  );
}

export function MatchHistory({ matches, puuid, isLoading }: MatchHistoryProps) {
  // Show loading state with enhanced skeletons
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl">
        <motion.h3
          className="mb-4 text-lg font-semibold flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <History className="h-5 w-5 text-primary" />
          Match History
        </motion.h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <MatchSkeleton key={index} index={index} />
          ))}
        </div>
      </div>
    );
  }

  // Show empty state
  if (matches.length === 0) {
    return (
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Match History
        </h3>
        <div className="rounded-2xl glass-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Gamepad2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No matches found</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Play some games to see your match history here
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <motion.h3
        className="mb-4 text-lg font-semibold flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <History className="h-5 w-5 text-primary" />
        Match History
        <span className="text-sm font-normal text-muted-foreground">
          ({matches.length} games)
        </span>
      </motion.h3>
      <div className="space-y-3">
        {matches.map((match, index) => (
          <MatchCard
            key={match.matchId}
            match={match}
            puuid={puuid}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
