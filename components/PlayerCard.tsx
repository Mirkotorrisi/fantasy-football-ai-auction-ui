"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Role } from "@/types/enum";
import { DollarSign } from "lucide-react";

interface Player {
  id: string;
  name: string;
  role: Role;
  price?: number;
  team?: string;
}

interface PlayerCardProps {
  player?: Player;
  showPrice?: boolean;
  showTeam?: boolean;
  className?: string;
  role?: Role;
}

const roleColors = {
  goalkeepers: "bg-yellow-100 text-yellow-800 border-yellow-200",
  defenders: "bg-blue-100 text-blue-800 border-blue-200",
  midfielders: "bg-green-100 text-green-800 border-green-200",
  forwards: "bg-red-100 text-red-800 border-red-200",
};
const transparentRoleColors = {
  goalkeepers: "bg-yellow-100/30 border-yellow-200",
  defenders: "bg-blue-100/30 border-blue-200",
  midfielders: "bg-green-100/30 border-green-200",
  forwards: "bg-red-100/30 border-red-200",
};

export default function PlayerCard({
  player,
  showPrice = false,
  // showTeam = false,
  className = "",
  role,
}: PlayerCardProps) {
  if (!player)
    return (
      <Card
        className={`hover:shadow-md opacity-90 transition-shadow py-0 border-0 ${
          role ? transparentRoleColors[role] : ""
        } ${className}`}
      >
        <CardContent className="py-0">
          <span className="font-medium text-xs truncate text-transparent">
            -
          </span>
        </CardContent>
      </Card>
    );
  return (
    <Card
      className={`hover:shadow-md transition-shadow py-0 border-0 ${
        role ? roleColors[role] : ""
      } ${className}`}
    >
      <CardContent className="py-0 flex justify-between items-center gap-1">
        <span className="font-medium text-xs truncate">{player.name}</span>

        {showPrice && player.price && (
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span>{player.price}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
