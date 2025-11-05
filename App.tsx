import React, { useState, useEffect } from 'react';
import { Tournament, User } from './types';
import { initialTournamentData } from './data/mockData';
import TournamentView from './components/TournamentView';
import AdminView from './components/AdminView';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import { loadUsers, loadCurrentUser, saveCurrentUser, isModeratorOrAdmin } from './utils/auth';

const App: React.FC = () => {
  const [tournamentData, setTournamentData] = useState<Tournament>(initialTournamentData);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Загружаем пользователей и текущего пользователя при загрузке
    const loadedUsers = loadUsers();
    const loadedUser = loadCurrentUser();
    setUsers(loadedUsers);
    
    if (loadedUser) {
      // Проверяем, что пользователь все еще существует в списке
      const userExists = loadedUsers.find(u => u.id === loadedUser.id);
      if (userExists) {
        setCurrentUser(loadedUser);
        setShowLogin(false);
      } else {
        saveCurrentUser(null);
        setShowLogin(true);
      }
    } else {
      setShowLogin(true);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    saveCurrentUser(user);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveCurrentUser(null);
    setShowLogin(true);
  };

  const handleUsersUpdate = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    // Если текущий пользователь был обновлен, обновляем его
    if (currentUser) {
      const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
        saveCurrentUser(updatedUser);
      }
    }
  };

  const isAdminMode = isModeratorOrAdmin(currentUser);

  return (
    <div className="min-h-screen bg-gray-900 font-sans">
      <Header 
        currentUser={currentUser} 
        onLogin={() => setShowLogin(true)} 
        onLogout={handleLogout} 
      />
      {showLogin && users.length > 0 && (
        <LoginModal onLogin={handleLogin} users={users} />
      )}
      {showLogin && users.length === 0 && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Загрузка...</h2>
            <p className="text-gray-300 text-center">Инициализация системы...</p>
          </div>
        </div>
      )}
      <main className="container mx-auto px-4 py-8">
        {/* Always render TournamentView and pass admin props to enable/disable inline editing */}
        <TournamentView tournament={tournamentData} isAdminMode={isAdminMode} setTournament={setTournamentData} />
        
        {/* Conditionally render the AdminView for additional controls when in admin mode */}
        {isAdminMode && (
          <div className="mt-12">
             <AdminView 
               tournament={tournamentData} 
               setTournament={setTournamentData} 
               currentUser={currentUser}
               users={users}
               onUsersUpdate={handleUsersUpdate}
             />
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