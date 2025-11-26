// PlayerProfile component - displays summoner information

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
    <Card className="w-full max-w-2xl">
      <CardContent className="flex items-center gap-6 p-6">
        {/* Profile Icon */}
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={`${PROFILE_ICON_URL}/${summoner.profileIconId}.png`}
            alt={`${gameName}'s profile icon`}
          />
          <AvatarFallback className="text-2xl">
            {gameName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Player Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{gameName}</h2>
            <span className="text-muted-foreground">#{tagLine}</span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              Level {summoner.summonerLevel}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            PUUID: {summoner.puuid.slice(0, 20)}...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
