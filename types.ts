export enum MatchStatus {
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED',
}

export interface Team {
  id: string;
  name: string;
  logoUrl: string;
}

export interface Match {
  id: string;
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  status: MatchStatus;
  time: string; // e.g., "14:00 UTC" or "Today"
}

export interface Standing {
  team: Team;
  wins: number;
  losses: number;
}

export interface Tournament {
  name: string;
  dates: string;
  teams: Team[];
  matches: Match[];
  standings: Standing[];
  matchHistory: Match[];
}