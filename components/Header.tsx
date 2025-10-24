
import React from 'react';

interface HeaderProps {
  userId: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userId, onLogout }) => {
  return (
    <header className="sticky top-0 z-10 p-4 bg-white shadow-md">
      <div className="container flex items-center justify-between mx-auto">
        <h1 className="text-xl font-bold text-brand-dark md:text-2xl">
          Capacity Tracker
        </h1>
        <div className="flex items-center space-x-4">
          <span className="hidden text-sm text-slate-500 sm:block">User: {userId}</span>
          <button
            onClick={onLogout}
            className="px-3 py-2 text-sm font-medium text-white transition-colors duration-200 rounded-md bg-brand-secondary hover:bg-brand-primary"
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
