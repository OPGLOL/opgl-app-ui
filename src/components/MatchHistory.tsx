// MatchHistory component - displays list of matches

import { MatchCard } from "@/components/MatchCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Match } from "@/types";

interface MatchHistoryProps {
  matches: Match[];
  puuid: string;
  isLoading: boolean;
}

// Loading skeleton for match cards
function MatchSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

export function MatchHistory({ matches, puuid, isLoading }: MatchHistoryProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl space-y-4">
        <h3 className="text-lg font-semibold">Match History</h3>
        {[...Array(5)].map((_, i) => (
          <MatchSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="w-full max-w-4xl text-center text-muted-foreground">
        <p>No matches found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      <h3 className="text-lg font-semibold">Match History ({matches.length} games)</h3>
      <div className="space-y-3">
        {matches.map((match) => (
          <MatchCard key={match.matchId} match={match} puuid={puuid} />
        ))}
      </div>
    </div>
  );
}
