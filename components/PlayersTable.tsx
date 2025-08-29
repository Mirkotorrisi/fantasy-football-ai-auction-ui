"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { INITIAL_PLAYERS } from "@/lib/consts";
import { Player } from "@/types";
import { Role } from "@/types/enum";
import { Filter, Search } from "lucide-react";
import { useState } from "react";
import PlayerCard from "./PlayerCard";

interface PlayersTableProps {
  players: {
    goalkeepers: Player[];
    defenders: Player[];
    midfielders: Player[];
    forwards: Player[];
  };
  currentRole: Role;
  title?: string;
}

export default function PlayersTable({
  players = INITIAL_PLAYERS,
  currentRole,
  title = "Available Players",
}: PlayersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const rolePlayers =
    players[currentRole]?.filter((player) =>
      player.name?.toLowerCase()?.includes(searchTerm?.toLowerCase().trim())
    ) || [];

  return (
    <Card className="w-full max-w-1/2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {title}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {rolePlayers.length} players
          </span>
        </div>

        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent>
        {rolePlayers.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {rolePlayers.map((player) => (
              <PlayerCard key={player.name} player={player} showPrice />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No players found</p>
            <p className="text-sm">
              {searchTerm
                ? `No ${currentRole} match "${searchTerm}"`
                : `No ${currentRole} available`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
