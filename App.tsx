import React, { useState } from 'react';
import { Tournament } from './types';
import { initialTournamentData } from './data/mockData';
import TournamentView from './components/TournamentView';
import AdminView from './components/AdminView';
import Header from './components/Header';

const App: React.FC = () => {
  const [tournamentData, setTournamentData] = useState<Tournament>(initialTournamentData);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      <main className="container mx-auto px-4 py-8">
        {/* Always render TournamentView and pass admin props to enable/disable inline editing */}
        <TournamentView tournament={tournamentData} isAdminMode={isAdminMode} setTournament={setTournamentData} />
        
        {/* Conditionally render the AdminView for additional controls when in admin mode */}
        {isAdminMode && (
          <div className="mt-12">
             <AdminView tournament={tournamentData} setTournament={setTournamentData} />
          </div>
        )}
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>adam_maks-tournament - Inspired by BLAST.tv</p>
      </footer>
    </div>
  );
};

export default App;