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

export const roles = [
  {
    value: Role.Goalkeeper,
    label: "Goalkeepers",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: Role.Defender,
    label: "Defenders",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: Role.Midfielder,
    label: "Midfielders",
    color: "bg-green-100 text-green-800",
  },
  {
    value: Role.Forward,
    label: "Forwards",
    color: "bg-red-100 text-red-800",
  },
];

export const MIN_TEAMS_LENGTH = 6;
export const MAX_TEAMS_LENGTH = 12;
export const VALID_TEAMS_LENGTH = [MIN_TEAMS_LENGTH, 8, 10, MAX_TEAMS_LENGTH];
