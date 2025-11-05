import React from 'react';
import { Tournament, Match, MatchStatus, Team, Standing } from '../types';

interface AdminViewProps {
  tournament: Tournament;
  setTournament: React.Dispatch<React.SetStateAction<Tournament>>;
}

const AdminView: React.FC<AdminViewProps> = ({ tournament, setTournament }) => {
  const handleTournamentDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTournament(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMatchChange = (matchId: string, field: keyof Match, value: any) => {
    setTournament(prev => ({
      ...prev,
      matches: prev.matches.map(m => (m.id === matchId ? { ...m, [field]: value } : m)),
    }));
  };

  const handleStandingChange = (teamId: string, field: 'wins' | 'losses', value: number) => {
     setTournament(prev => ({
        ...prev,
        standings: prev.standings.map(s => s.team.id === teamId ? {...s, [field]: Math.max(0, value)} : s)
     }))
  }

  const handleAddTeam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const teamNameInput = form.elements.namedItem('teamName') as HTMLInputElement;
    const teamName = teamNameInput.value.trim();

    if (teamName && !tournament.teams.some(t => t.name.toLowerCase() === teamName.toLowerCase())) {
      const newTeam: Team = {
        id: `t${Date.now()}`,
        name: teamName,
        logoUrl: `https://api.dicebear.com/8.x/bottts/svg?seed=${encodeURIComponent(teamName)}`,
      };
      const newStanding: Standing = {
        team: newTeam,
        wins: 0,
        losses: 0,
      }
      setTournament(prev => ({ ...prev, teams: [...prev.teams, newTeam], standings: [...prev.standings, newStanding] }));
      form.reset();
    }
  }

  const handleRemoveTeam = (teamId: string) => {
    setTournament(prev => ({
      ...prev,
      teams: prev.teams.filter(t => t.id !== teamId),
      matches: prev.matches.filter(m => m.teamA.id !== teamId && m.teamB.id !== teamId),
      standings: prev.standings.filter(s => s.team.id !== teamId)
    }));
  }


  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl space-y-8">
      <h2 className="text-3xl font-bold text-yellow-400">Admin Panel</h2>

      {/* Tournament Details */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold border-b border-gray-600 pb-2">Tournament Details</h3>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
          <input type="text" name="name" id="name" value={tournament.name} onChange={handleTournamentDetailsChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="dates" className="block text-sm font-medium text-gray-300">Dates</label>
          <input type="text" name="dates" id="dates" value={tournament.dates} onChange={handleTournamentDetailsChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" />
        </div>
      </div>

      {/* Teams Management */}
       <div className="space-y-4">
        <h3 className="text-xl font-semibold border-b border-gray-600 pb-2">Teams</h3>
        <form onSubmit={handleAddTeam} className="flex gap-4">
            <input type="text" name="teamName" placeholder="New team name" className="flex-grow bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" required/>
            <button type="submit" className="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors">Add Team</button>
        </form>
        <ul className="space-y-2">
            {tournament.teams.map(team => (
                <li key={team.id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                    <div className="flex items-center gap-3">
                        <img src={team.logoUrl} alt={team.name} className="w-8 h-8 rounded-full bg-white p-1" />
                        <span>{team.name}</span>
                    </div>
                    <button onClick={() => handleRemoveTeam(team.id)} className="text-red-500 hover:text-red-400 font-semibold">Remove</button>
                </li>
            ))}
        </ul>
      </div>

      {/* Matches Management */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold border-b border-gray-600 pb-2">Matches</h3>
        <div className="space-y-2">
          {tournament.matches.map(match => (
            <div key={match.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-gray-700 p-3 rounded-md">
              <div className="md:col-span-2 font-semibold">{match.teamA.name} vs {match.teamB.name}</div>
              <div className="flex gap-2 items-center">
                <input type="number" value={match.scoreA} onChange={e => handleMatchChange(match.id, 'scoreA', parseInt(e.target.value, 10))} className="w-16 bg-gray-900 text-center py-1 rounded" />
                <span>-</span>
                <input type="number" value={match.scoreB} onChange={e => handleMatchChange(match.id, 'scoreB', parseInt(e.target.value, 10))} className="w-16 bg-gray-900 text-center py-1 rounded" />
              </div>
              <div>
                <select value={match.status} onChange={e => handleMatchChange(match.id, 'status', e.target.value)} className="w-full bg-gray-900 border-gray-600 rounded-md py-1 px-2 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500">
                  {Object.values(MatchStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
      
       {/* Standings Management */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold border-b border-gray-600 pb-2">Standings</h3>
        <div className="space-y-2">
            {tournament.standings.map(standing => (
                 <div key={standing.team.id} className="grid grid-cols-3 gap-4 items-center bg-gray-700 p-3 rounded-md">
                    <div className="font-semibold flex items-center gap-2">
                         <img src={standing.team.logoUrl} alt={standing.team.name} className="w-6 h-6 rounded-full bg-white p-0.5" />
                         {standing.team.name}
                    </div>
                     <div className="flex gap-2 items-center">
                        <label htmlFor={`wins-${standing.team.id}`} className="text-sm">W:</label>
                        <input id={`wins-${standing.team.id}`} type="number" value={standing.wins} onChange={e => handleStandingChange(standing.team.id, 'wins', parseInt(e.target.value, 10))} className="w-16 bg-gray-900 text-center py-1 rounded" />
                    </div>
                    <div className="flex gap-2 items-center">
                        <label htmlFor={`losses-${standing.team.id}`} className="text-sm">L:</label>
                        <input id={`losses-${standing.team.id}`} type="number" value={standing.losses} onChange={e => handleStandingChange(standing.team.id, 'losses', parseInt(e.target.value, 10))} className="w-16 bg-gray-900 text-center py-1 rounded" />
                    </div>
                 </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default AdminView;
