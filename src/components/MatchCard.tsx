// MatchCard component - enhanced match display with champion splash

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Sword, Target, Zap } from "lucide-react";
import type { Match } from "@/types";

interface MatchCardProps {
  match: Match;
  puuid: string;
  index?: number;
}

// Data Dragon CDN for champion assets
const DDRAGON_VERSION = "14.23.1";
const CHAMPION_ICON_URL = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion`;

// Format game duration from seconds to MM:SS
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Format date to relative time
function formatRelativeTime(dateString: string): string {
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
  const kdaRatio = (kills + assists) / deaths;
  return kdaRatio.toFixed(2);
}

// Get KDA color based on ratio
function getKDAColor(kills: number, deaths: number, assists: number): string {
  if (deaths === 0) {
    return "text-yellow-400";
  }
  const kdaRatio = (kills + assists) / deaths;
  if (kdaRatio >= 5) {
    return "text-yellow-400";
  }
  if (kdaRatio >= 3) {
    return "text-green-400";
  }
  if (kdaRatio >= 2) {
    return "text-blue-400";
  }
  return "text-muted-foreground";
}

export function MatchCard({ match, puuid, index = 0 }: MatchCardProps) {
  // Find the player in the match participants
  const player = match.participants.find((participant) => participant.puuid === puuid);

  if (!player) {
    return null;
  }

  const kdaRatioText = calculateKDA(player.kills, player.deaths, player.assists);
  const kdaColor = getKDAColor(player.kills, player.deaths, player.assists);
  const csPerMin = ((player.totalMinionsKilled / match.gameDuration) * 60).toFixed(1);
  const isVictory = player.win;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      className={`
        relative overflow-hidden rounded-xl
        ${isVictory ? "match-victory" : "match-defeat"}
        transition-all duration-300 cursor-pointer
      `}
    >
      <div className="relative flex items-center gap-4 p-4">
        {/* Champion Icon with glow effect */}
        <div className="relative flex-shrink-0">
          <div className={`
            absolute -inset-1 rounded-xl blur-sm
            ${isVictory ? "bg-green-500/30" : "bg-red-500/30"}
          `} />
          <Avatar className="relative h-16 w-16 rounded-xl border-2 border-background">
            <AvatarImage
              src={`${CHAMPION_ICON_URL}/${player.championName}.png`}
              alt={player.championName}
              className="object-cover"
            />
            <AvatarFallback className="rounded-xl bg-secondary text-lg font-bold">
              {player.championName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Champion level badge */}
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background text-[10px] font-bold border border-border">
            {player.champLevel ?? 18}
          </div>
        </div>

        {/* Match Info - Left Section */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* Victory/Defeat Badge and Game Mode */}
          <div className="flex items-center gap-2">
            <span
              className={`
                rounded-md px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide
                ${isVictory
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                }
              `}
            >
              {isVictory ? "Victory" : "Defeat"}
            </span>
            <span className="text-sm text-muted-foreground">{match.gameMode}</span>
          </div>

          {/* Champion Name and Position */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base">{player.championName}</span>
            {player.teamPosition && (
              <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase">
                {player.teamPosition}
              </span>
            )}
          </div>

          {/* Game Duration and Time */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(match.gameDuration)}</span>
            </div>
            <span className="text-border">|</span>
            <span>{formatRelativeTime(match.gameCreation)}</span>
          </div>
        </div>

        {/* Stats Section - Right Side */}
        <div className="flex items-center gap-6">
          {/* KDA */}
          <div className="text-center min-w-[80px]">
            <div className="flex items-center justify-center gap-1 font-bold text-base">
              <span className="text-foreground">{player.kills}</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="text-red-400">{player.deaths}</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="text-foreground">{player.assists}</span>
            </div>
            <div className={`text-xs font-medium ${kdaColor}`}>
              {kdaRatioText} KDA
            </div>
          </div>

          {/* CS */}
          <div className="text-center min-w-[60px] hidden sm:block">
            <div className="flex items-center justify-center gap-1">
              <Sword className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-semibold text-sm">{player.totalMinionsKilled}</span>
            </div>
            <div className="text-xs text-muted-foreground">{csPerMin}/min</div>
          </div>

          {/* Damage */}
          <div className="text-center min-w-[60px] hidden md:block">
            <div className="flex items-center justify-center gap-1">
              <Zap className="h-3.5 w-3.5 text-orange-400" />
              <span className="font-semibold text-sm">
                {(player.totalDamageDealtToChampions / 1000).toFixed(1)}k
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Damage</div>
          </div>

          {/* Kill Participation - visual indicator */}
          <div className="hidden lg:flex flex-col items-center min-w-[50px]">
            <div className="flex items-center gap-1">
              <Target className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold text-sm text-primary">
                {Math.round(((player.kills + player.assists) / Math.max(1, player.kills + player.deaths + player.assists)) * 100)}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground">KP</div>
          </div>
        </div>
      </div>

      {/* Subtle victory/defeat indicator line at the bottom */}
      <div className={`
        absolute bottom-0 left-0 right-0 h-0.5
        ${isVictory
          ? "bg-gradient-to-r from-green-500/50 via-green-500 to-green-500/50"
          : "bg-gradient-to-r from-red-500/50 via-red-500 to-red-500/50"
        }
      `} />
    </motion.div>
  );
}
