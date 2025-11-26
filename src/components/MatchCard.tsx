// MatchCard component - displays a single match

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Match } from "@/types";

interface MatchCardProps {
  match: Match;
  puuid: string;
}

// Data Dragon CDN for champion icons
const DDRAGON_VERSION = "14.23.1";
const CHAMPION_ICON_URL = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion`;

// Format game duration from seconds to MM:SS
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Format date to relative time
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ago`;
  }
  if (diffHours > 0) {
    return `${diffHours}h ago`;
  }
  return "Just now";
}

// Calculate KDA ratio
function calculateKDA(kills: number, deaths: number, assists: number): string {
  if (deaths === 0) {
    return "Perfect";
  }
  const kda = (kills + assists) / deaths;
  return kda.toFixed(2);
}

export function MatchCard({ match, puuid }: MatchCardProps) {
  // Find the player in the match participants
  const player = match.participants.find((p) => p.puuid === puuid);

  if (!player) {
    return null;
  }

  const kdaRatio = calculateKDA(player.kills, player.deaths, player.assists);
  const csPerMin = ((player.totalMinionsKilled / match.gameDuration) * 60).toFixed(1);

  return (
    <Card className={`w-full ${player.win ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}`}>
      <CardContent className="flex items-center gap-4 p-4">
        {/* Champion Icon */}
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={`${CHAMPION_ICON_URL}/${player.championName}.png`}
            alt={player.championName}
          />
          <AvatarFallback>
            {player.championName.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {/* Match Info */}
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge variant={player.win ? "default" : "destructive"}>
              {player.win ? "Victory" : "Defeat"}
            </Badge>
            <span className="text-sm text-muted-foreground">{match.gameMode}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{formatDuration(match.gameDuration)}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold">{player.championName}</span>
            {player.teamPosition && (
              <span className="text-sm text-muted-foreground">{player.teamPosition}</span>
            )}
          </div>
        </div>

        {/* KDA */}
        <div className="text-center">
          <p className="font-bold">
            {player.kills}/{player.deaths}/{player.assists}
          </p>
          <p className="text-sm text-muted-foreground">{kdaRatio} KDA</p>
        </div>

        {/* Stats */}
        <div className="text-center">
          <p className="font-semibold">{player.totalMinionsKilled} CS</p>
          <p className="text-sm text-muted-foreground">{csPerMin}/min</p>
        </div>

        {/* Damage */}
        <div className="text-center">
          <p className="font-semibold">{(player.totalDamageDealtToChampions / 1000).toFixed(1)}k</p>
          <p className="text-sm text-muted-foreground">Damage</p>
        </div>

        {/* Time */}
        <div className="text-right">
          <p className="text-sm text-muted-foreground">{formatDate(match.gameCreation)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
