
import React from 'react';
import { AppScreen } from '../types';

interface BottomNavProps {
  currentScreen: AppScreen;
  onScreenChange: (screen: AppScreen) => void;
  onAddClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onScreenChange, onAddClick }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full md:w-auto md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:rounded-full md:px-8 md:shadow-2xl bg-white/90 dark:bg-surface-dark/95 backdrop-blur-md border-t md:border border-gray-100 dark:border-gray-800 px-4 py-2 flex justify-between items-center z-50 rounded-t-[1.5rem] shadow-[0_-5px_20px_rgba(0,0,0,0.03)] max-w-md mx-auto">
      <button
        onClick={() => onScreenChange(AppScreen.Hub)}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${currentScreen === AppScreen.Hub ? 'text-primary scale-105' : 'text-gray-400'}`}
      >
        <span className={`material-symbols-outlined text-2xl ${currentScreen === AppScreen.Hub ? 'filled' : ''}`}>home</span>
        <span className="text-[9px] font-bold tracking-wide">Portal</span>
      </button>

      <button
        onClick={() => onScreenChange(AppScreen.StoryStarter)}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${currentScreen === AppScreen.StoryStarter ? 'text-primary scale-105' : 'text-gray-400'}`}
      >
        <span className={`material-symbols-outlined text-2xl ${currentScreen === AppScreen.StoryStarter ? 'filled' : ''}`}>auto_stories</span>
        <span className="text-[9px] font-bold tracking-wide">Stories</span>
      </button>

      <div className="relative -top-5">
        <button
          onClick={onAddClick}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#131811] text-primary shadow-xl hover:scale-105 active:scale-95 transition-all border-[3px] border-background-light dark:border-background-dark"
        >
          <span className="material-symbols-outlined text-2xl font-bold">add</span>
        </button>
      </div>

      <button
        onClick={() => onScreenChange(AppScreen.DadJokeDuel)}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${currentScreen === AppScreen.DadJokeDuel ? 'text-primary scale-105' : 'text-gray-400'}`}
      >
        <span className={`material-symbols-outlined text-2xl ${currentScreen === AppScreen.DadJokeDuel ? 'filled' : ''}`}>sentiment_very_dissatisfied</span>
        <span className="text-[9px] font-bold tracking-wide">Jokes</span>
      </button>

      <button
        onClick={() => onScreenChange(AppScreen.PlayerStats)}
        className={`flex flex-col items-center gap-0.5 p-1 transition-colors ${currentScreen === AppScreen.PlayerStats ? 'text-primary scale-105' : 'text-gray-400'}`}
      >
        <span className={`material-symbols-outlined text-2xl ${currentScreen === AppScreen.PlayerStats ? 'filled' : ''}`}>person</span>
        <span className="text-[9px] font-bold tracking-wide">Profile</span>
      </button>
    </nav>
  );
};

export default BottomNav;
