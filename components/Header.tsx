import React from 'react';
import { User, UserRole } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogin, onLogout }) => {
  const getRoleLabel = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Админ';
      case UserRole.MODERATOR:
        return 'Модератор';
      default:
        return 'Пользователь';
    }
  };

  const getRoleColor = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return 'text-red-400';
      case UserRole.MODERATOR:
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-700/50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-400">
                <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-2xl font-bold tracking-wider uppercase">adam_maks-tournament</h1>
        </div>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Пользователь:</span>
                <span className="text-sm font-semibold text-white">{currentUser.username}</span>
                <span className={`text-sm font-semibold ${getRoleColor(currentUser.role)}`}>
                  ({getRoleLabel(currentUser.role)})
                </span>
              </div>
              <button
                onClick={onLogout}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
              >
                Выйти
              </button>
            </>
          ) : (
            <button
              onClick={onLogin}
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;