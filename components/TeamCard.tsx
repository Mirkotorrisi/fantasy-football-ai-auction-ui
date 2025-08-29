"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ROLE_SLOTS } from "@/lib/consts";
import { TeamRoster } from "@/types";
import { Role } from "@/types/enum";
import { DollarSign, TrendingUp, Users } from "lucide-react";
import PlayerCard from "./PlayerCard";

interface TeamCardProps {
  roster: TeamRoster;
  initialBudget: number;
  className?: string;
}

export default function TeamCard({
  roster,
  className = "",
  initialBudget,
}: TeamCardProps) {
  const spent = initialBudget - roster.budget;
  const spentPercentage = (spent / initialBudget) * 100;

  const allPlayersNumber = Object.values(roster.players).flat().length;
  return (
    <Card className={`${className} p-1 border-0 divide-y-2 divide-accent`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-nowrap overflow-hidden">
            {roster.name}
          </CardTitle>
        </div>

        <div className="space-y-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {allPlayersNumber}
          </Badge>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="w-3 h-3" />
              <span>Budget</span>
            </div>
            <span className="font-medium">{roster.budget}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              <span>Spent</span>
            </div>
            <span className="font-medium text-red-600">{spent}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <span className="font-medium text-green-600">{roster.budget}</span>
          </div>

          <Progress value={spentPercentage} className="h-2" />
        </div>
      </CardHeader>
      {Object.values(Role).map((role) => (
        <CardContent
          key={role + roster.name + roster.id}
          className="pt-0 border-0"
        >
          <div className="space-y-2">
            {roster.players[role].map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                showPrice
                role={role}
              />
            ))}
            {Array.from(
              Array(ROLE_SLOTS[role] - roster.players[role].length)
            ).map((_, index) => (
              <PlayerCard key={index} role={role} />
            ))}
          </div>
        </CardContent>
      ))}{" "}
    </Card>
  );
}
