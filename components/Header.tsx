
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  onOpenMashup?: () => void;
  onLogout: () => void;
  totalXP: number;
  streak: number;
  level: number;
  user: User;
  otherUserAvatar: string;
}

const Header: React.FC<HeaderProps> = ({ onOpenMashup, onLogout, totalXP, streak, level, user, otherUserAvatar }) => {
  return (
    <header className="sticky top-0 z-30 flex flex-col gap-2 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md px-4 pt-4 pb-2 border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
      <div className="flex items-center h-14 justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {/* Logged in identity: Primary position */}
            <div className="relative z-10 rounded-full border-4 border-primary dark:border-primary shadow-[0_0_15px_rgba(87,249,6,0.3)] bg-white dark:bg-gray-800 transition-transform hover:scale-105">
              <img className="w-10 h-10 rounded-full object-cover" alt="My Avatar" src={user.avatar} />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-white dark:border-surface-dark flex items-center justify-center">
                <span className="material-symbols-outlined text-[10px] text-black font-black">check</span>
              </div>
            </div>
            {/* Partner identity: Offset position */}
            <div className="relative -ml-3 z-0 rounded-full border-2 border-white dark:border-background-dark opacity-50 scale-90 grayscale-[0.5]">
              <img className="w-10 h-10 rounded-full object-cover" alt="Partner Avatar" src={otherUserAvatar} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-primary-dark dark:text-primary uppercase tracking-tighter">Level {level}</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-orange-500 text-sm filled">local_fire_department</span>
              <span className="text-xs font-bold">{streak} Day Streak</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLogout}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/40 transition-all mr-2"
            title="Logout"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
          <button
            onClick={onOpenMashup}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-white/10 shadow-sm text-text-main-light dark:text-text-main-dark hover:bg-gray-100 dark:hover:bg-white/20 transition-all border border-primary/20 active:scale-90 overflow-hidden"
          >
            <span className="material-symbols-outlined text-primary text-xl">rocket_launch</span>
          </button>
          <div className="bg-black dark:bg-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 border border-primary/20 shadow-lg shadow-primary/5 overflow-hidden">
            <span className="material-symbols-outlined text-primary text-base filled">emoji_events</span>
            <p className="text-white font-black text-sm leading-none">{totalXP}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
