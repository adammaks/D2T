import React from 'react';
import { Match, MatchStatus, Tournament, Team, Standing } from '../types';

interface MatchCardProps {
  match: Match;
  isAdminMode?: boolean;
  setTournament?: React.Dispatch<React.SetStateAction<Tournament>>;
  isHistory?: boolean;
}

const recalculateStandings = (teams: Team[], finishedMatches: Match[]): Standing[] => {
    const standingsMap = new Map<string, { wins: number; losses: number }>();
    teams.forEach(t => standingsMap.set(t.id, { wins: 0, losses: 0 }));

    finishedMatches.forEach(match => {
        if (match.status !== MatchStatus.FINISHED) return;
        
        const teamAStats = standingsMap.get(match.teamA.id)!;
        const teamBStats = standingsMap.get(match.teamB.id)!;

        if (match.scoreA > match.scoreB) {
            teamAStats.wins++;
            teamBStats.losses++;
        } else if (match.scoreB > match.scoreA) {
            teamBStats.wins++;
            teamAStats.losses++;
        }
    });
    
    const newStandings: Standing[] = teams.map(team => ({
        team,
        wins: standingsMap.get(team.id)!.wins,
        losses: standingsMap.get(team.id)!.losses,
    }));

    return newStandings.sort((a, b) => b.wins - a.wins || a.losses - b.losses);
}


const TeamDisplay: React.FC<{ team: { name: string, logoUrl: string }, score: number, isWinner: boolean, reverse?: boolean }> = ({ team, score, isWinner, reverse = false }) => (
  <div className={`flex items-center gap-4 ${reverse ? 'flex-row-reverse' : ''}`}>
    <span className={`text-2xl font-bold ${isWinner ? 'text-white' : 'text-gray-400'}`}>{score}</span>
    <div className={`flex items-center gap-3 ${reverse ? 'flex-row-reverse text-right' : 'text-left'}`}>
      <img src={team.logoUrl} alt={team.name} className="w-12 h-12 rounded-full bg-gray-700 p-1 object-contain" />
      <span className={`text-lg font-semibold ${isWinner ? 'text-white' : 'text-gray-400'}`}>{team.name}</span>
    </div>
  </div>
);

const EditableTeamDisplay: React.FC<{ team: Team, score: number, isWinner: boolean, onScoreChange: (score: number) => void, reverse?: boolean }> = ({ team, score, isWinner, onScoreChange, reverse = false }) => (
    <div className={`flex items-center gap-4 ${reverse ? 'flex-row-reverse' : ''}`}>
        <input 
            type="number"
            value={score}
            onChange={(e) => onScoreChange(Math.max(0, parseInt(e.target.value, 10)))}
            className="w-16 bg-gray-900 text-center py-1 rounded text-2xl font-bold"
            aria-label={`${team.name} score`}
        />
        <div className={`flex items-center gap-3 ${reverse ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <img src={team.logoUrl} alt={team.name} className="w-12 h-12 rounded-full bg-gray-700 p-1 object-contain" />
            <span className={`text-lg font-semibold ${isWinner ? 'text-white' : 'text-gray-400'}`}>{team.name}</span>
        </div>
  </div>
);


const MatchCard: React.FC<MatchCardProps> = ({ match, isAdminMode, setTournament, isHistory = false }) => {
  const isFinished = match.status === MatchStatus.FINISHED;
  const teamAWins = isFinished && match.scoreA > match.scoreB;
  const teamBWins = isFinished && match.scoreB > match.scoreA;

  const handleMatchChange = (field: keyof Match, value: any) => {
    if (!setTournament) return;

    setTournament(prev => {
        const oldMatch = (isHistory ? prev.matchHistory : prev.matches).find(m => m.id === match.id);
        if (!oldMatch) return prev;
        
        const updatedMatch = { ...oldMatch, [field]: value };

        let newMatches = [...prev.matches];
        let newHistory = [...prev.matchHistory];

        const statusChanged = field === 'status';
        const movedToHistory = statusChanged && value === MatchStatus.FINISHED && !isHistory;
        const movedFromHistory = statusChanged && value !== MatchStatus.FINISHED && isHistory;

        if (movedToHistory) {
            newMatches = newMatches.filter(m => m.id !== match.id);
            newHistory = [...newHistory, updatedMatch];
        } else if (movedFromHistory) {
            newHistory = newHistory.filter(m => m.id !== match.id);
            newMatches = [...newMatches, updatedMatch];
        } else if (isHistory) {
            newHistory = newHistory.map(m => m.id === match.id ? updatedMatch : m);
        } else {
            newMatches = newMatches.map(m => m.id === match.id ? updatedMatch : m);
        }

        const newStandings = recalculateStandings(prev.teams, newHistory);

        return {
            ...prev,
            matches: newMatches,
            matchHistory: newHistory,
            standings: newStandings
        };
    });
  };

  if (isAdminMode) {
    return (
        <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between shadow-md ring-2 ring-yellow-500/50">
            <EditableTeamDisplay team={match.teamA} score={match.scoreA} isWinner={teamAWins} onScoreChange={(score) => handleMatchChange('scoreA', score)} />
            <div className="text-center">
                 <select value={match.status} onChange={e => handleMatchChange('status', e.target.value as MatchStatus)} className="w-full bg-gray-900 border-gray-600 rounded-md py-1 px-2 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500">
                  {Object.values(MatchStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
            </div>
            <EditableTeamDisplay team={match.teamB} score={match.scoreB} isWinner={teamBWins} onScoreChange={(score) => handleMatchChange('scoreB', score)} reverse />
        </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between shadow-md hover:bg-gray-700/50 transition-colors duration-200">
      <TeamDisplay team={match.teamA} score={match.scoreA} isWinner={teamAWins} />
      
      <div className="text-center">
        {match.status === MatchStatus.LIVE && (
          <div className="flex items-center gap-2 text-red-500 font-bold animate-pulse">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            LIVE
          </div>
        )}
        {match.status === MatchStatus.UPCOMING && (
          <div className="text-yellow-400 font-bold">{match.time}</div>
        )}
        {match.status === MatchStatus.FINISHED && (
          <div className="text-gray-400 font-semibold">Finished</div>
        )}
      </div>

      <TeamDisplay team={match.teamB} score={match.scoreB} isWinner={teamBWins} reverse />
    </div>
  );
};

export default MatchCard;