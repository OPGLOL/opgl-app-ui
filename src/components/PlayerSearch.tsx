// PlayerSearch component - modern unified search bar design

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
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
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (gameName.trim() && tagLine.trim()) {
      onSearch(region, gameName.trim(), tagLine.trim());
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Unified search bar container */}
      <motion.div
        className={`
          relative flex items-center gap-0 rounded-2xl
          bg-card/80 backdrop-blur-xl
          border-2 transition-all duration-300
          ${isFocused
            ? "border-primary/50 shadow-lg shadow-primary/10"
            : "border-border/50 hover:border-border"
          }
        `}
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Region selector - integrated into the bar */}
        <div className="flex-shrink-0 border-r border-border/50">
          <Select value={region} onValueChange={(value) => setRegion(value as Region)}>
            <SelectTrigger
              className="
                h-14 w-28 border-0 bg-transparent
                rounded-l-2xl rounded-r-none
                text-sm font-medium
                focus:ring-0 focus:ring-offset-0
                hover:bg-secondary/50 transition-colors
              "
            >
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((regionOption) => (
                <SelectItem key={regionOption.value} value={regionOption.value}>
                  <span className="font-medium">{regionOption.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Game Name input */}
        <div className="flex-1 min-w-0">
          <Input
            type="text"
            placeholder="Game Name"
            value={gameName}
            onChange={(event) => setGameName(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="
              h-14 border-0 bg-transparent
              text-base placeholder:text-muted-foreground/60
              focus-visible:ring-0 focus-visible:ring-offset-0
              px-4
            "
          />
        </div>

        {/* Separator and Tag */}
        <div className="flex items-center gap-1 px-2 text-muted-foreground/60">
          <span className="text-lg font-light">#</span>
        </div>

        {/* Tag Line input */}
        <div className="w-24 flex-shrink-0">
          <Input
            type="text"
            placeholder="TAG"
            value={tagLine}
            onChange={(event) => setTagLine(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="
              h-14 border-0 bg-transparent
              text-base placeholder:text-muted-foreground/60
              focus-visible:ring-0 focus-visible:ring-offset-0
              px-2 uppercase
            "
            maxLength={5}
          />
        </div>

        {/* Search button - integrated into the bar */}
        <div className="flex-shrink-0 p-2">
          <Button
            type="submit"
            disabled={isLoading || !gameName || !tagLine}
            className="
              h-10 w-10 rounded-xl p-0
              bg-primary hover:bg-primary/90
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              hover:scale-105 active:scale-95
            "
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>
        </div>
      </motion.div>

      {/* Helper text */}
      <motion.p
        className="mt-3 text-center text-sm text-muted-foreground/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Search by Riot ID (e.g., <span className="font-mono text-primary/80">Newyenn#GGEZ</span>)
      </motion.p>
    </motion.form>
  );
}
