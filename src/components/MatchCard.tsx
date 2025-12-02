// MatchCard component - displays a single match (DPM.LOL style)

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
  const isVictory = player.win;

  return (
    <div
      className={`flex items-center gap-4 rounded-lg border p-3 transition-all hover:scale-[1.01] ${
        isVictory
          ? "border-l-4 border-l-green-500 bg-green-500/5 hover:bg-green-500/10"
          : "border-l-4 border-l-red-500 bg-red-500/5 hover:bg-red-500/10"
      }`}
    >
      {/* Champion Icon */}
      <Avatar className="h-14 w-14 rounded-lg">
        <AvatarImage
          src={`${CHAMPION_ICON_URL}/${player.championName}.png`}
          alt={player.championName}
          className="rounded-lg"
        />
        <AvatarFallback className="rounded-lg bg-secondary">
          {player.championName.charAt(0)}
        </AvatarFallback>
      </Avatar>

      {/* Match Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          {/* Victory/Defeat Badge */}
          <span
            className={`rounded px-2 py-0.5 text-xs font-semibold ${
              isVictory
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {isVictory ? "Victory" : "Defeat"}
          </span>
          <span className="text-sm text-muted-foreground">{match.gameMode}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{formatDuration(match.gameDuration)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold">{player.championName}</span>
          {player.teamPosition && (
            <span className="text-xs text-muted-foreground uppercase">{player.teamPosition}</span>
          )}
        </div>
      </div>

      {/* KDA */}
      <div className="text-center min-w-[70px]">
        <p className="font-bold text-sm">
          <span className="text-foreground">{player.kills}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-red-400">{player.deaths}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">{player.assists}</span>
        </p>
        <p className="text-xs text-muted-foreground">{kdaRatio} KDA</p>
      </div>

      {/* CS */}
      <div className="text-center min-w-[60px]">
        <p className="font-semibold text-sm">{player.totalMinionsKilled} CS</p>
        <p className="text-xs text-muted-foreground">{csPerMin}/min</p>
      </div>

      {/* Damage */}
      <div className="text-center min-w-[55px]">
        <p className="font-semibold text-sm">{(player.totalDamageDealtToChampions / 1000).toFixed(1)}k</p>
        <p className="text-xs text-muted-foreground">Damage</p>
      </div>

      {/* Time */}
      <div className="text-right min-w-[50px]">
        <p className="text-xs text-muted-foreground">{formatDate(match.gameCreation)}</p>
      </div>
    </div>
  );
}
