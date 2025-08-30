"use client";

import ControlPanel from "@/components/ControlPanel";
import Header from "@/components/Header";
import PlayersModal from "@/components/PlayersModal";
import RostersComponent from "@/components/Rosters";
import { useSession } from "@/context/SessionContext";
import { useState } from "react";

export default function HomePage() {
  const { sessionId, availablePlayers, rosters, currentRole, isLoading } =
    useSession();
  const [isPlayersModalOpen, setIsPlayersModalOpen] = useState(false);

  if (!sessionId) {
    return null; // This shouldn't happen due to routing logic
  }

  return (
    <div className="max-h-screen overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
      <Header />

      {/* Control Panel */}
      <ControlPanel setIsPlayersModalOpen={setIsPlayersModalOpen} />

      {/* Main Content */}
      <main className="w-full flex-1 h-[calc(100vh-113px-65px)] mx-auto px-2 py-6 overflow-y-auto pb-8">
        {/* Team Rosters */}
        <RostersComponent isLoading={isLoading} rosters={rosters} />

        {/* Modal for Players Table */}
        {isPlayersModalOpen && (
          <PlayersModal
            isLoading={isLoading}
            availablePlayers={availablePlayers}
            currentRole={currentRole}
            setIsPlayersModalOpen={setIsPlayersModalOpen}
          />
        )}
      </main>
    </div>
  );
}
