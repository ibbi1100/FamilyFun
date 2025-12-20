
import React from 'react';
import { Activity } from '../types';

interface MissionCardProps {
  mission: Activity;
  onComplete: (id: string) => void;
  isHistory?: boolean;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onComplete, isHistory = false }) => {
  const getOwnerStyles = () => {
    switch (mission.owner) {
      case 'Dad':
        return {
          bar: 'bg-blue-600',
          badge: 'bg-blue-100 text-blue-700',
          label: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-500/5',
          border: 'border-blue-500/10',
          xpText: 'text-blue-600 dark:text-blue-300',
          title: "Dad's Task",
          initial: 'D'
        };
      case 'Son':
        return {
          bar: 'bg-orange-500',
          badge: 'bg-orange-100 text-orange-700',
          label: 'text-orange-500 dark:text-orange-400',
          bg: 'bg-orange-500/5',
          border: 'border-orange-500/10',
          xpText: 'text-orange-600 dark:text-orange-300',
          title: "Son's Task",
          initial: 'S'
        };
      case 'Mum':
        return {
          bar: 'bg-teal-500',
          badge: 'bg-teal-100 text-teal-700',
          label: 'text-teal-500 dark:text-teal-400',
          bg: 'bg-teal-500/5',
          border: 'border-teal-500/10',
          xpText: 'text-teal-600 dark:text-teal-300',
          title: "Mum's Task",
          initial: 'M'
        };
      case 'Daughter':
        return {
          bar: 'bg-pink-500',
          badge: 'bg-pink-100 text-pink-700',
          label: 'text-pink-500 dark:text-pink-400',
          bg: 'bg-pink-500/5',
          border: 'border-pink-500/10',
          xpText: 'text-pink-600 dark:text-pink-300',
          title: "Daughter's Task",
          initial: 'D'
        };
      default:
        return {
          bar: 'bg-purple-600',
          badge: 'bg-purple-100 text-purple-700',
          label: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-500/5',
          border: 'border-purple-500/10',
          xpText: 'text-purple-600 dark:text-purple-300',
          title: "Team Face Off",
          initial: 'VS'
        };
    }
  };

  const styles = getOwnerStyles();

  if (isHistory) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] bg-gray-50 dark:bg-white/5 p-6 border border-black/5 dark:border-white/5 opacity-80 group grayscale hover:grayscale-0 transition-all duration-500">
        <div className="absolute top-0 left-0 w-2 h-full bg-primary-dark/50"></div>
        <div className="flex gap-6 items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] font-black">check</span> VICTORY
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Just Completed</span>
            </div>
            <h3 className="text-gray-400 dark:text-gray-500 text-xl font-black leading-tight line-through">
              {mission.title}
            </h3>
          </div>
          <div className="shrink-0 text-center">
            <p className="text-2xl font-black text-primary-dark dark:text-primary">+{mission.xp}</p>
            <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">XP Earned</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-surface-dark p-6 shadow-xl border-2 border-transparent hover:border-primary/30 transition-all duration-500 hover:-translate-y-1">
      <div className={`absolute top-0 left-0 w-2 h-full ${styles.bar} rounded-l-[2.5rem]`}></div>
      <div className="flex gap-6">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${styles.badge}`}>
                {styles.initial}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.label}`}>
                {styles.title}
              </span>
            </div>
            <h3 className="text-text-main-light dark:text-white text-2xl font-black leading-tight mb-2 tracking-tight">
              {mission.title}
            </h3>
            <p className="text-text-sec-light dark:text-text-sec-dark text-sm leading-relaxed font-medium">
              {mission.description}
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={() => onComplete(mission.id)}
              className="w-full bg-gray-100 hover:bg-primary dark:bg-white/5 dark:hover:bg-primary text-black dark:text-white dark:hover:text-black transition-all py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest active:scale-95 border border-black/5 dark:border-white/5"
            >
              <span className="material-symbols-outlined text-2xl font-black">
                {mission.owner === 'Shared' ? 'swords' : 'check_circle'}
              </span>
              {mission.owner === 'Shared' ? 'Start Battle' : 'Complete!'}
            </button>
          </div>
        </div>
        <div className="w-24 shrink-0 flex flex-col items-center">
          <div className={`aspect-square w-full rounded-3xl ${styles.bg} ${styles.border} border flex items-center justify-center mb-3 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
            <span className="text-5xl drop-shadow-md">{mission.emoji}</span>
          </div>
          <div className={`w-full text-center ${styles.bg} rounded-xl py-2 px-1 border-2 ${styles.border}`}>
            <p className="text-[8px] font-black uppercase opacity-60 mb-0.5 tracking-widest">Reward</p>
            <p className={`font-black text-xl leading-none italic ${styles.xpText}`}>
              {mission.xp} <span className="text-[10px] uppercase">XP</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionCard;
