import { Player } from "@/types";
import { Role } from "@/types/enum";
import PlayersTable from "./PlayersTable";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

type Props = {
  isLoading: boolean;
  availablePlayers: Record<Role, Player[]>;
  currentRole: Role;
  setIsPlayersModalOpen: (open: boolean) => void;
  handleDeletePlayer?: (player: Player, teamName: string) => void;
};

const PlayersModal = ({
  isLoading,
  availablePlayers,
  currentRole,
  setIsPlayersModalOpen,
  handleDeletePlayer,
}: Props) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onClick={() => setIsPlayersModalOpen(false)}
    >
      <Button
        variant="ghost"
        className="absolute top-2 right-2"
        onClick={() => setIsPlayersModalOpen(false)}
      >
        Close
      </Button>
      {isLoading ? (
        <Card>
          <CardHeader>
            <div className="h-6 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <PlayersTable
          players={availablePlayers}
          currentRole={currentRole}
          title={`Available ${
            currentRole.charAt(0).toUpperCase() + currentRole.slice(1)
          }`}
          handleDeletePlayer={handleDeletePlayer}
        />
      )}
    </div>
  );
};

export default PlayersModal;
