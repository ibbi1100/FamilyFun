
import React from 'react';

interface GoalProgressProps {
  xp: number;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ xp }) => {
  const goalXp = 500;
  const progress = Math.min(100, Math.floor((xp % goalXp) / goalXp * 100));
  const remaining = goalXp - (xp % goalXp);

  return (
    <div className="px-4 py-6">
      <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex gap-2 justify-between items-end mb-3">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider font-bold text-text-sec-light dark:text-text-sec-dark mb-1">Current Goal</span>
            <p className="text-text-main-light dark:text-text-main-dark text-lg font-bold leading-none">Ice Cream Trip! 🍦</p>
          </div>
          <p className="text-primary-dark dark:text-primary text-sm font-bold bg-primary/10 px-2 py-1 rounded-lg">{progress}%</p>
        </div>
        <div className="relative w-full h-4 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <div className="absolute top-0 left-0 h-full rounded-full bg-primary shadow-[0_0_12px_rgba(87,249,6,0.5)] transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          <div className="absolute top-0 left-0 h-full w-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px)' }}></div>
        </div>
        <p className="text-text-sec-light dark:text-text-sec-dark text-xs font-medium mt-2 text-right">{remaining} pts to unlock</p>
      </div>
    </div>
  );
};

export default GoalProgress;
