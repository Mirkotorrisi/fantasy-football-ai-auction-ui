import { INITIAL_PLAYERS } from "@/lib/consts";
import {
  fetchAvailablePlayers,
  fetchRosters,
  WS_BASE_URL,
} from "@/services/api";
import { Player, Rosters } from "@/types";
import { Role } from "@/types/enum";
import { useCallback, useEffect, useRef, useState } from "react";

// this hook handles the websocket and holds the state needed for the guest page (rosters and players list)
export function useGuestPage(sessionId: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [rosters, setRosters] = useState<Rosters | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<Record<
    Role,
    Player[]
  > | null>(INITIAL_PLAYERS);
  const [isConnected, setIsConnected] = useState(false);

  const setUpPlayers = useCallback(async () => {
    const players = await fetchAvailablePlayers(sessionId);
    setAvailablePlayers(players);
  }, [sessionId]);

  const getInitialSetup = useCallback(async () => {
    const rosters = await fetchRosters(sessionId);
    setRosters(rosters);
    setUpPlayers();
  }, [sessionId, setUpPlayers]);

  // Load players and rosters on first render
  useEffect(() => {
    if (!rosters) getInitialSetup();
  }, [getInitialSetup, rosters]);

  // Connection and listeners
  useEffect(() => {
    if (!sessionId) return;
    const url = `${WS_BASE_URL}/ws?session_id=${sessionId}`;
    console.log("🚀 ~ useGuestPage ~ url:", url);

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Connection opened");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      console.log("📩 Message received:", event.data);
      const payload = JSON.parse(event.data);
      setRosters(payload.data as Rosters);
      setUpPlayers();
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("🔌 Connection closed");
      setIsConnected(false);
    };

    // cleanup on disconnection / URL change
    return () => {
      socket.close();
    };
  }, [sessionId, setUpPlayers]);

  // Function to send messages
  const sendMessage = useCallback((message: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.warn("⚠️ Unable to send: socket not open");
    }
  }, []);

  return { rosters, sendMessage, availablePlayers, isConnected };
}
