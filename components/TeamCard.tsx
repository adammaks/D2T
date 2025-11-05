import React from 'react';
import { Team } from '../types';

interface TeamCardProps {
  team: Team;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center gap-3 transition-transform transform hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-400/10">
      <img src={team.logoUrl} alt={`${team.name} logo`} className="w-20 h-20 rounded-full bg-white p-2" />
      <h3 className="text-md font-semibold text-center text-gray-200">{team.name}</h3>
    </div>
  );
};

export default TeamCard;
