import { Player, Rosters } from "@/types";
import { Role } from "@/types/enum";

const SERVER_DOMAIN = "fantacalcio-ai-assistant.vercel.app";
export const BASE_URL = `https://${SERVER_DOMAIN}`;
export const WS_BASE_URL = `ws://${SERVER_DOMAIN}`;

export interface CreateSessionRequest {
  team_names: string[];
  budget: number;
}

export interface CreateSessionResponse {
  session_id: string;
}

export interface UpdateAuctionRequest {
  input_text: string;
  session_id: string;
  current_role: Role;
}

async function makeRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      return response.text() as T;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out. Please try again.");
      }
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}

// Create a new session
export async function createSession(
  data: CreateSessionRequest
): Promise<CreateSessionResponse> {
  // Validate input
  if (!data.team_names || data.team_names.length === 0) {
    throw new Error("Team names are required");
  }

  if (![6, 8, 10, 12].includes(data.team_names.length)) {
    throw new Error("Must have exactly 6, 8, 10, or 12 teams");
  }

  if (data.budget <= 0) {
    throw new Error("Budget must be greater than 0");
  }

  return makeRequest<CreateSessionResponse>(`${BASE_URL}/init-session`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Update auction with voice/text input
export async function updateAuctionByText(
  data: UpdateAuctionRequest
): Promise<void> {
  // Validate input
  if (!data.input_text?.trim()) {
    throw new Error("Input text is required");
  }

  if (!data.session_id?.trim()) {
    throw new Error("Session ID is required");
  }

  if (!Object.values(Role).includes(data.current_role)) {
    throw new Error("Invalid role specified");
  }

  await makeRequest<void>(`${BASE_URL}/update-auction`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
// Update auction with voice/text input
export async function updateAuctionByAudio(
  session_id: string,
  current: Role,
  wavBlob: Blob
): Promise<void> {
  const formData = new FormData();
  formData.append("file", wavBlob, "audio.wav");
  formData.append("session_id", session_id);
  formData.append("current_role", current);
  // Validate input
  if (!current) {
    throw new Error("Current role is required");
  }

  if (!session_id?.trim()) {
    throw new Error("Session ID is required");
  }

  if (!Object.values(Role).includes(current)) {
    throw new Error("Invalid role specified");
  }

  const response = await fetch(`${BASE_URL}/update-auction-transcription`, {
    method: "POST",
    body: formData,
  });
  return response.json();
}

// Fetch team rosters
export async function fetchRosters(sessionId: string): Promise<Rosters> {
  if (!sessionId?.trim()) {
    throw new Error("Session ID is required");
  }

  return makeRequest<Rosters>(
    `${BASE_URL}/rosters?session_id=${encodeURIComponent(sessionId)}`
  );
}

// Fetch available players
export async function fetchAvailablePlayers(
  sessionId: string
): Promise<Record<Role, Player[]>> {
  if (!sessionId?.trim()) {
    throw new Error("Session ID is required");
  }

  return makeRequest<Record<Role, Player[]>>(
    `${BASE_URL}/players-list?session_id=${encodeURIComponent(sessionId)}`
  );
}

// Delete a player from a roster
export async function deletePlayerFromRoster(
  sessionId: string,
  player: Player,
  teamName: string,
  currentRole: Role
): Promise<Rosters> {
  if (!sessionId?.trim()) {
    throw new Error("Session ID is required");
  }

  return makeRequest<Rosters>(`${BASE_URL}/delete-player`, {
    method: "POST",
    body: JSON.stringify({
      player_name: player.name,
      team_name: teamName,
      current_role: currentRole,
      session_id: sessionId,
    }),
  });
}
