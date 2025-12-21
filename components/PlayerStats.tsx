
import React, { useState } from 'react';
import { User } from '../types';

interface PlayerStatsProps {
  onBack: () => void;
  currentUser: User;
  otherUser: { name: string; avatar: string; role: string; email?: string };
  totalXP: number;
  level: number;
  streak: number;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ onBack, currentUser, otherUser, totalXP, level, streak }) => {
  const [activeTab, setActiveTab] = useState<'Me' | 'Them'>('Me');

  const profileData = {
    Me: {
      name: currentUser.name,
      role: currentUser.role,
      level: `Level ${level} - Rookie`,
      xp: totalXP.toLocaleString(),
      avatar: currentUser.avatar,
      comparison: `Starting the journey!`,
      completed: '0',
      email: currentUser.email
    },
    Them: {
      name: otherUser.name,
      role: otherUser.role,
      level: 'Level 1 - Buddy',
      xp: '0',
      avatar: otherUser.avatar,
      comparison: `Waiting for ${currentUser.name}...`,
      completed: '0',
      email: otherUser.email
    }
  };

  const currentData = profileData[activeTab];

  return (
    <div className="flex-1 animate-in fade-in slide-in-from-right-8 duration-500 no-scrollbar overflow-y-auto pb-32">
      <header className="flex items-center justify-between p-4 sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white dark:bg-white/10 shadow-sm active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="text-xl font-black tracking-tight">Family Stats</h2>
        <button className="p-2 rounded-full bg-white dark:bg-white/10 shadow-sm active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-2xl">settings</span>
        </button>
      </header>

      <div className="px-6 py-4">
        <div className="flex h-14 w-full items-center justify-center rounded-full bg-gray-200/50 dark:bg-white/5 p-1.5 shadow-inner border border-black/5 dark:border-white/5">
          <button
            onClick={() => setActiveTab('Me')}
            className={`flex h-full grow items-center justify-center rounded-full px-2 transition-all duration-300 font-black text-sm uppercase tracking-widest ${activeTab === 'Me' ? 'bg-primary shadow-lg text-black' : 'text-gray-500 dark:text-gray-400'}`}
          >
            Me
          </button>
          <button
            onClick={() => setActiveTab('Them')}
            className={`flex h-full grow items-center justify-center rounded-full px-2 transition-all duration-300 font-black text-sm uppercase tracking-widest ${activeTab === 'Them' ? 'bg-primary shadow-lg text-black' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {otherUser.role}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center pt-8 pb-4 px-4 relative">
        <div className="relative group">
          <div className="absolute -inset-2 bg-primary rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-500 animate-pulse"></div>
          <div className="relative w-40 h-40 rounded-full border-4 border-white dark:border-surface-dark bg-gray-200 overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-500">
            <img alt="Avatar" className="w-full h-full object-cover" src={currentData.avatar} />
          </div>
          <div className="absolute bottom-2 right-2 bg-primary p-2 rounded-full border-4 border-background-light dark:border-background-dark shadow-xl hover:rotate-12 transition-transform cursor-pointer">
            <span className="material-symbols-outlined text-black text-xl font-black">edit</span>
          </div>
        </div>
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-black leading-none mb-2">{currentData.name}</h1>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="bg-primary/20 text-primary-dark dark:text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{currentData.role}</span>
            <span className="text-text-sec-light dark:text-text-sec-dark text-sm font-bold opacity-80">{currentData.level}</span>
            {currentUser.family_name && (
              <span className="bg-purple-500/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">diversity_3</span>
                {currentUser.family_name}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="text-center py-6 relative">
        <div className="flex flex-col items-center">
          <span className="text-primary-dark dark:text-primary text-[64px] font-black leading-none tracking-tighter drop-shadow-sm animate-in zoom-in duration-500">
            ${(typeof currentData.xp === 'string' ? currentData.xp : (Number(currentData.xp)).toFixed(2))}
          </span>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 -mt-2">Net Worth</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 px-6 mb-12">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 flex flex-col justify-between h-40 group hover:-translate-y-1 transition-all">
          <span className="material-symbols-outlined text-3xl text-primary-dark dark:text-primary opacity-50 group-hover:opacity-100 transition-opacity">swords</span>
          <div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
            <p className="text-xs font-bold text-primary leading-tight">{currentData.comparison}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 flex flex-col justify-between h-40 group hover:-translate-y-1 transition-all">
          <span className="material-symbols-outlined text-3xl text-orange-500 opacity-50 group-hover:opacity-100 transition-opacity">emoji_events</span>
          <div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Missions</p>
            <p className="text-2xl font-black dark:text-white leading-tight">{currentData.completed}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completed</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark rounded-t-[3rem] p-8 shadow-2xl min-h-[400px]">
        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-yellow-500 filled">military_tech</span>
          Trophy Case
        </h3>

        <div className="grid grid-cols-3 gap-6">
          {[
            { id: 1, name: 'Sound Master', icon: 'graphic_eq', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
            { id: 2, name: 'Lab Expert', icon: 'smart_toy', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { id: 3, name: 'Spin Lord', icon: 'auto_stories', color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { id: 4, name: 'Locked', icon: 'lock', color: 'text-gray-400', bg: 'bg-gray-100', locked: true },
          ].map(badge => (
            <div key={badge.id} className={`flex flex-col items-center gap-3 transition-transform hover:scale-105 ${badge.locked ? 'opacity-40 grayscale' : ''}`}>
              <div className={`w-20 h-20 rounded-3xl ${badge.bg} flex items-center justify-center shadow-lg border-2 border-white/10`}>
                <span className={`material-symbols-outlined text-4xl ${badge.color}`}>{badge.icon}</span>
              </div>
              <p className="text-[10px] font-black uppercase text-center leading-tight tracking-wider">{badge.name}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            onClick={() => window.location.href = `mailto:${currentData.email || ''}?subject=Message form FamilyFun&body=Hi ${currentData.name}!`}
            className="py-4 rounded-2xl bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">mail</span>
            Send Email
          </button>
          <button
            onClick={() => onBack()}
            className="py-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold shadow-lg shadow-black/10 active:scale-95 transition-transform"
          >
            BACK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
