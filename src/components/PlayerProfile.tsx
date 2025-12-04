// PlayerProfile component - enhanced summoner profile display

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";
import type { Summoner } from "@/types";

interface PlayerProfileProps {
  summoner: Summoner;
  gameName: string;
  tagLine: string;
}

// Data Dragon CDN for profile icons
const DDRAGON_VERSION = "14.23.1";
const PROFILE_ICON_URL = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/profileicon`;

export function PlayerProfile({ summoner, gameName, tagLine }: PlayerProfileProps) {
  return (
    <motion.div
      className="w-full max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Profile Card with glassmorphism */}
      <div className="relative overflow-hidden rounded-2xl glass-card">
        {/* Background gradient decorations */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative flex items-center gap-6 p-6 sm:p-8">
          {/* Profile Icon with animated ring */}
          <motion.div
            className="relative flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Animated gradient ring */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-75 blur-sm animate-pulse" />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent" />

            <Avatar className="relative h-24 w-24 sm:h-28 sm:w-28 border-4 border-background">
              <AvatarImage
                src={`${PROFILE_ICON_URL}/${summoner.profileIconId}.png`}
                alt={`${gameName}'s profile icon`}
                className="object-cover"
              />
              <AvatarFallback className="bg-secondary text-3xl font-bold">
                {gameName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Level badge - positioned at bottom */}
            <motion.div
              className="
                absolute -bottom-2 left-1/2 -translate-x-1/2
                flex items-center gap-1
                rounded-full bg-primary px-3 py-1
                text-sm font-bold text-primary-foreground
                shadow-lg shadow-primary/30
              "
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <Sparkles className="h-3 w-3" />
              {summoner.summonerLevel}
            </motion.div>
          </motion.div>

          {/* Player Info */}
          <div className="flex flex-col gap-2 min-w-0">
            {/* Riot ID */}
            <div className="flex flex-wrap items-baseline gap-2">
              <motion.h2
                className="text-3xl sm:text-4xl font-bold tracking-tight truncate"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {gameName}
              </motion.h2>
              <motion.span
                className="text-xl sm:text-2xl text-muted-foreground font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                #{tagLine}
              </motion.span>
            </div>

            {/* Secondary info */}
            <motion.div
              className="flex items-center gap-4 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span>Level {summoner.summonerLevel}</span>
              </div>
              <span className="text-border">|</span>
              <span className="font-mono text-xs text-muted-foreground/70 truncate max-w-[120px] sm:max-w-none">
                {summoner.puuid.slice(0, 8)}...
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
