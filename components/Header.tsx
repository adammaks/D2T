import React from 'react';

interface HeaderProps {
  isAdminMode: boolean;
  setIsAdminMode: (isAdmin: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isAdminMode, setIsAdminMode }) => {
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
            <span className="text-sm text-gray-400">Admin Panel</span>
            <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                <span
                    className={`${
                    isAdminMode ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;