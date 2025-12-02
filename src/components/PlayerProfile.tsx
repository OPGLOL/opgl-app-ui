// PlayerProfile component - displays summoner information (DPM.LOL style)

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="w-full max-w-2xl overflow-hidden border-0 bg-gradient-to-r from-card to-secondary/50">
      <CardContent className="flex items-center gap-6 p-6">
        {/* Profile Icon with border ring */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 blur-sm" />
          <Avatar className="relative h-20 w-20 border-2 border-primary/50">
            <AvatarImage
              src={`${PROFILE_ICON_URL}/${summoner.profileIconId}.png`}
              alt={`${gameName}'s profile icon`}
            />
            <AvatarFallback className="bg-secondary text-2xl font-bold">
              {gameName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Level badge overlay */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
            {summoner.summonerLevel}
          </div>
        </div>

        {/* Player Info */}
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{gameName}</h2>
            <span className="text-lg text-muted-foreground">#{tagLine}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Level {summoner.summonerLevel}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
