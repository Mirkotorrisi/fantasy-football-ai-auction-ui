"use client";

import { toast } from "@/hooks/use-toast";
import { INITIAL_PLAYERS } from "@/lib/consts";
import {
  BASE_URL,
  deletePlayerFromRoster,
  fetchAvailablePlayers,
  fetchRosters,
  updateAuctionByText,
} from "@/services/api";
import { Player, Rosters } from "@/types";
import { Role } from "@/types/enum";
import { redirect } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface SessionContextType {
  sessionId: string | null;
  availablePlayers: Record<Role, Player[]>;
  rosters: Rosters | undefined;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  isLoading: boolean;
  isSubmitting: boolean;
  setIsLoading: (loading: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
  loadData: (sessionId: string) => Promise<void>;
  submitQuery: (inputText: string) => Promise<void>;
  handleLogout: () => void;
  downloadLink: string;
  handleDeletePlayer: (player: Player, teamName: string) => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({
  sessionId,
  children,
}: {
  sessionId: string;
  children: ReactNode;
}) {
  const [availablePlayers, setAvailablePlayers] = useState<
    Record<Role, Player[]>
  >({
    goalkeepers: [],
    defenders: [],
    midfielders: [],
    forwards: [],
  });
  const [rosters, setRosters] = useState<Rosters>();
  const [currentRole, setCurrentRole] = useState<Role>(Role.Goalkeeper);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const downloadLink = useMemo(
    () => `${BASE_URL}/export-rosters?session_id=${sessionId}`,
    [sessionId]
  );
  const loadData = useCallback(async (sessionId: string) => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const [rosters, players] = await Promise.all([
        fetchRosters(sessionId),
        fetchAvailablePlayers(sessionId),
      ]);
      setRosters(rosters);
      setAvailablePlayers(players);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    loadData(sessionId);
  }, [sessionId, loadData]);

  const submitQuery = async (inputText: string) => {
    setIsSubmitting(true);
    try {
      await updateAuctionByText({
        input_text: inputText,
        session_id: sessionId!,
        current_role: currentRole,
      });

      // Refresh data after successful update
      await loadData(sessionId);

      toast({
        title: "Success",
        description: "Auction updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update auction",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setRosters(undefined);
    localStorage.removeItem("sessionId");
    setAvailablePlayers(INITIAL_PLAYERS);
    redirect("/");
  };

  const handleDeletePlayer = async (player: Player, teamName: string) => {
    if (!player) return;

    try {
      const updatedRosters = await deletePlayerFromRoster(
        sessionId,
        player,
        teamName,
        currentRole
      );
      setRosters(updatedRosters);
      const updatedAvailablePlayers = await fetchAvailablePlayers(sessionId);
      setAvailablePlayers(updatedAvailablePlayers);
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        sessionId,
        availablePlayers,
        rosters,
        currentRole,
        setCurrentRole,
        isLoading,
        setIsLoading,
        isSubmitting,
        setIsSubmitting,
        loadData,
        submitQuery,
        handleLogout,
        downloadLink,
        handleDeletePlayer,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
