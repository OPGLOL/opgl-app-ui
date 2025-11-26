// PlayerSearch component - search for players by Riot ID

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REGIONS, type Region } from "@/types";

interface PlayerSearchProps {
  onSearch: (region: Region, gameName: string, tagLine: string) => void;
  isLoading: boolean;
}

export function PlayerSearch({ onSearch, isLoading }: PlayerSearchProps) {
  const [region, setRegion] = useState<Region>("na");
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameName.trim() && tagLine.trim()) {
      onSearch(region, gameName.trim(), tagLine.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Region selector */}
        <Select value={region} onValueChange={(value) => setRegion(value as Region)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {REGIONS.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Game Name input */}
        <Input
          type="text"
          placeholder="Game Name"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          className="flex-1"
        />

        {/* Tag Line input */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">#</span>
          <Input
            type="text"
            placeholder="Tag"
            value={tagLine}
            onChange={(e) => setTagLine(e.target.value)}
            className="w-24"
          />
        </div>

        {/* Search button */}
        <Button type="submit" disabled={isLoading || !gameName || !tagLine}>
          {isLoading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="ml-2">Search</span>
        </Button>
      </div>
    </form>
  );
}
