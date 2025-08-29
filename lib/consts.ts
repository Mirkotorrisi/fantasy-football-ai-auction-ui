import { Role } from "@/types/enum";

export const INITIAL_PLAYERS = {
  goalkeepers: [],
  defenders: [],
  midfielders: [],
  forwards: [],
};

export const ROLE_SLOTS = {
  [Role.Goalkeeper]: 3,
  [Role.Defender]: 8,
  [Role.Midfielder]: 8,
  [Role.Forward]: 6,
};

export const MIN_TEAMS_LENGTH = 6;
export const MAX_TEAMS_LENGTH = 12;
export const VALID_TEAMS_LENGTH = [MIN_TEAMS_LENGTH, 8, 10, MAX_TEAMS_LENGTH];
