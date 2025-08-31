"use client";

import PlayersModal from "@/components/PlayersModal";
import RostersComponent from "@/components/Rosters";
import { useGuestPage } from "@/hooks/useGuestPage";
import { roles } from "@/lib/consts";
import { Role } from "@/types/enum";
import { useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type Props = {
  sessionId: string;
};

export default function GuestPage({ sessionId }: Props) {
  const { rosters, availablePlayers } = useGuestPage(sessionId);
  const [isPlayersModalOpen, setIsPlayersModalOpen] = useState(false);

  const selectedRole = useMemo(
    () => roles.find((role) => role.value === rosters?.current_role),
    [rosters]
  );

  if (!sessionId) {
    return null; // This shouldn't happen due to routing logic
  }

  return (
    <div className="max-h-screen overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col items-start gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-green-700">
                Fantasy Football Auction
              </h1>
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                Session: {sessionId}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Current Role:
            </span>
            <Badge
              variant="outline"
              className={`${selectedRole?.color} border-0`}
            >
              {selectedRole?.label}
            </Badge>
            {/* Button to open Players Table modal */}
            <Button
              variant="outline"
              onClick={() => setIsPlayersModalOpen(true)}
            >
              Show Available Players
            </Button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="w-full flex-1 h-[calc(100vh-113px-65px)] mx-auto px-2 py-6 overflow-y-auto pb-8">
        {/* Team Rosters */}
        {rosters && <RostersComponent isLoading={false} rosters={rosters} />}

        {/* Modal for Players Table */}
        {isPlayersModalOpen && rosters && availablePlayers && (
          <PlayersModal
            isLoading={false}
            availablePlayers={availablePlayers}
            currentRole={rosters.current_role as Role}
            setIsPlayersModalOpen={setIsPlayersModalOpen}
          />
        )}
      </main>
    </div>
  );
}
