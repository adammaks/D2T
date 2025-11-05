import React from 'react';
import { Standing, Tournament } from '../types';

interface StandingsTableProps {
  standings: Standing[];
  isAdminMode?: boolean;
  setTournament?: React.Dispatch<React.SetStateAction<Tournament>>;
}

const StandingsTable: React.FC<StandingsTableProps> = ({ standings, isAdminMode, setTournament }) => {

  const handleStandingChange = (teamId: string, field: 'wins' | 'losses', value: number) => {
    if(!setTournament) return;
    setTournament(prev => ({
       ...prev,
       standings: prev.standings.map(s => s.team.id === teamId ? {...s, [field]: Math.max(0, value)} : s)
    }));
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <table className="w-full text-left">
        <thead className="bg-gray-700/50 text-xs text-gray-300 uppercase tracking-wider">
          <tr>
            <th scope="col" className="px-6 py-3 w-12">Rank</th>
            <th scope="col" className="px-6 py-3">Team</th>
            <th scope="col" className="px-6 py-3 text-center">Wins</th>
            <th scope="col" className="px-6 py-3 text-center">Losses</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, index) => (
            <tr key={standing.team.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700/50">
              <td className="px-6 py-4 font-bold text-lg text-gray-400 text-center">{index + 1}</td>
              <td className="px-6 py-4 font-medium text-white">
                <div className="flex items-center gap-4">
                  <img src={standing.team.logoUrl} alt={standing.team.name} className="w-10 h-10 rounded-full bg-white p-1" />
                  <span>{standing.team.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center font-semibold text-green-400 text-lg">
                {isAdminMode ? (
                    <input 
                        type="number"
                        value={standing.wins}
                        onChange={(e) => handleStandingChange(standing.team.id, 'wins', parseInt(e.target.value, 10))}
                        className="w-16 bg-gray-900 text-center py-1 rounded"
                        aria-label={`${standing.team.name} wins`}
                    />
                ) : standing.wins}
              </td>
              <td className="px-6 py-4 text-center font-semibold text-red-400 text-lg">
                {isAdminMode ? (
                     <input 
                        type="number"
                        value={standing.losses}
                        onChange={(e) => handleStandingChange(standing.team.id, 'losses', parseInt(e.target.value, 10))}
                        className="w-16 bg-gray-900 text-center py-1 rounded"
                        aria-label={`${standing.team.name} losses`}
                    />
                ) : standing.losses}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsTable;