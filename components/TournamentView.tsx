import React, { useState } from 'react';
import { Tournament, MatchStatus } from '../types';
import MatchCard from './MatchCard';
import TeamCard from './TeamCard';
import StandingsTable from './StandingsTable';

interface TournamentViewProps {
  tournament: Tournament;
  isAdminMode?: boolean;
  setTournament?: React.Dispatch<React.SetStateAction<Tournament>>;
}

type ActiveTab = 'matches' | 'standings' | 'teams' | 'history';

const TournamentView: React.FC<TournamentViewProps> = ({ tournament, isAdminMode, setTournament }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('matches');

  const liveMatches = tournament.matches.filter(m => m.status === MatchStatus.LIVE);
  const upcomingMatches = tournament.matches.filter(m => m.status === MatchStatus.UPCOMING);

  const renderTabContent = () => {
    const matchCardProps = {
        isAdminMode,
        setTournament
    };

    switch (activeTab) {
      case 'matches':
        return (
          <div className="space-y-8">
            {liveMatches.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 border-l-4 border-red-500 pl-3">Live Matches</h2>
                <div className="space-y-4">
                  {liveMatches.map(match => <MatchCard key={match.id} match={match} {...matchCardProps} />)}
                </div>
              </div>
            )}
            {upcomingMatches.length > 0 && (
               <div>
                <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-400 pl-3">Upcoming Matches</h2>
                <div className="space-y-4">
                  {upcomingMatches.map(match => <MatchCard key={match.id} match={match} {...matchCardProps} />)}
                </div>
              </div>
            )}
          </div>
        );
      case 'standings':
        return <StandingsTable standings={tournament.standings} isAdminMode={isAdminMode} setTournament={setTournament} />;
      case 'teams':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tournament.teams.map(team => <TeamCard key={team.id} team={team} />)}
          </div>
        );
      case 'history':
        return (
            <div>
                <h2 className="text-2xl font-bold mb-4 border-l-4 border-gray-500 pl-3">Match History</h2>
                 <div className="space-y-4">
                  {tournament.matchHistory
                    .slice() // Create a copy to avoid mutating the original array
                    .sort((a, b) => (a.id > b.id ? -1 : 1)) // Sort to show newest first
                    .map(match => <MatchCard key={match.id} match={match} {...matchCardProps} isHistory={true}/>)}
                </div>
            </div>
        )
      default:
        return null;
    }
  };

  const TabButton: React.FC<{tabName: ActiveTab, label: string}> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-6 py-3 text-lg font-semibold uppercase tracking-wider transition-colors duration-200 ${
        activeTab === tabName 
          ? 'text-yellow-400 border-b-2 border-yellow-400' 
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-12">
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/dota2/1200/400')"}}>
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase">{tournament.name}</h1>
          <p className="text-lg md:text-xl text-gray-300 mt-2">{tournament.dates}</p>
        </div>
      </div>

      <div>
        <div className="border-b border-gray-700 mb-8">
          <nav className="flex justify-center -mb-px space-x-4 md:space-x-8">
            <TabButton tabName="matches" label="Matches" />
            <TabButton tabName="standings" label="Standings" />
            <TabButton tabName="history" label="History" />
            <TabButton tabName="teams" label="Teams" />
          </nav>
        </div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TournamentView;