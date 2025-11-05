import { Tournament, Team, Match, Standing, MatchStatus } from '../types';

const TEAMS: Team[] = [
  { id: 't1', name: 'Team Liquid', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=liquid' },
  { id: 't2', name: 'Gaimin Gladiators', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=gaimin' },
  { id: 't3', name: 'Tundra Esports', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=tundra' },
  { id: 't4', name: 'OG', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=og' },
  { id: 't5', name: 'Team Spirit', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=spirit' },
  { id: 't6', name: 'BetBoom Team', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=betboom' },
  { id: 't7', name: 'Falcons', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=falcons' },
  { id: 't8', name: 'Xtreme Gaming', logoUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=xtreme' },
];

const MATCHES: Match[] = [
  {
    id: 'm1',
    teamA: TEAMS[0],
    teamB: TEAMS[1],
    scoreA: 0,
    scoreB: 0,
    status: MatchStatus.LIVE,
    time: 'Live Now',
  },
  {
    id: 'm2',
    teamA: TEAMS[2],
    teamB: TEAMS[3],
    scoreA: 0,
    scoreB: 0,
    status: MatchStatus.UPCOMING,
    time: '16:00 UTC',
  },
];

const MATCH_HISTORY: Match[] = [
    {
    id: 'm3',
    teamA: TEAMS[4],
    teamB: TEAMS[5],
    scoreA: 2,
    scoreB: 1,
    status: MatchStatus.FINISHED,
    time: 'Finished',
  },
    {
    id: 'm4',
    teamA: TEAMS[6],
    teamB: TEAMS[7],
    scoreA: 0,
    scoreB: 2,
    status: MatchStatus.FINISHED,
    time: 'Finished',
  },
  {
    id: 'm5',
    teamA: TEAMS[0],
    teamB: TEAMS[3],
    scoreA: 1,
    scoreB: 2,
    status: MatchStatus.FINISHED,
    time: 'Finished',
  },
];


const STANDINGS: Standing[] = [
  { team: TEAMS[4], wins: 1, losses: 0 },
  { team: TEAMS[7], wins: 1, losses: 0 },
  { team: TEAMS[3], wins: 1, losses: 1 },
  { team: TEAMS[0], wins: 0, losses: 1 },
  { team: TEAMS[5], wins: 0, losses: 1 },
  { team: TEAMS[6], wins: 0, losses: 1 },
  { team: TEAMS[1], wins: 0, losses: 0 },
  { team: TEAMS[2], wins: 0, losses: 0 },
].sort((a, b) => b.wins - a.wins || a.losses - b.losses);


export const initialTournamentData: Tournament = {
  name: 'adam_maks-tournament',
  dates: 'October 26 - November 03, 2024',
  teams: TEAMS,
  matches: MATCHES,
  standings: STANDINGS,
  matchHistory: MATCH_HISTORY,
};