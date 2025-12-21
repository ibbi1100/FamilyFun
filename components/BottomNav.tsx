
import React from 'react';
import { AppScreen } from '../types';

interface BottomNavProps {
  currentScreen: AppScreen;
  onScreenChange: (screen: AppScreen) => void;
  onAddClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onScreenChange, onAddClick }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 px-6 py-3 flex justify-between items-center z-50 rounded-t-[2rem] shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
      <button
        onClick={() => onScreenChange(AppScreen.Hub)}
        className={`flex flex-col items-center gap-1 p-2 transition-colors ${currentScreen === AppScreen.Hub ? 'text-primary' : 'text-gray-400'}`}
      >
        <span className={`material-symbols-outlined ${currentScreen === AppScreen.Hub ? 'filled' : ''}`}>home</span>
        <span className="text-[10px] font-bold">Portal</span>
      </button>

      <button
        onClick={() => onScreenChange(AppScreen.StoryStarter)}
        className={`flex flex-col items-center gap-1 p-2 transition-colors ${currentScreen === AppScreen.StoryStarter ? 'text-primary' : 'text-gray-400'}`}
      >
        <span className={`material-symbols-outlined ${currentScreen === AppScreen.StoryStarter ? 'filled' : ''}`}>auto_stories</span>
        <span className="text-[10px] font-bold">Stories</span>
      </button>

      <div className="relative -top-6">
        <button
          onClick={onAddClick}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#131811] text-primary shadow-lg hover:scale-105 transition-transform border-4 border-background-light dark:border-background-dark"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>
      </div>

      <button
        onClick={() => onScreenChange(AppScreen.DadJokeDuel)}
        className={`flex flex-col items-center gap-1 p-2 transition-colors ${currentScreen === AppScreen.DadJokeDuel ? 'text-primary' : 'text-gray-400'}`}
      >
        <span className={`material-symbols-outlined ${currentScreen === AppScreen.DadJokeDuel ? 'filled' : ''}`}>sentiment_very_dissatisfied</span>
        <span className="text-[10px] font-bold">Jokes</span>
      </button>

      <button
        onClick={() => onScreenChange(AppScreen.PlayerStats)}
        className={`flex flex-col items-center gap-1 p-2 transition-colors ${currentScreen === AppScreen.PlayerStats ? 'text-primary' : 'text-gray-400'}`}
      >
        <span className={`material-symbols-outlined ${currentScreen === AppScreen.PlayerStats ? 'filled' : ''}`}>person</span>
        <span className="text-[10px] font-bold">Profile</span>
      </button>
    </nav>
  );
};

export default BottomNav;
