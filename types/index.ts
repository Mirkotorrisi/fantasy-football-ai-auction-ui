import { Role } from "./enum";

export interface Player {
  id: string;
  name: string;
  role: Role;
  price?: number;
  team?: string;
}

export interface Rosters {
  id: number;
  lastUpdate: string;
  current: Role;
  teams: TeamRoster[];
  initialBudget: number;
}

export interface TeamRoster {
  id: number;
  name: string;
  budget: number;
  players: Record<Role, Player[]>;
}
