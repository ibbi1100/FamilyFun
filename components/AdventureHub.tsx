
import React from 'react';
import { AppScreen } from '../types';

interface AdventureHubProps {
  onNavigate: (screen: AppScreen) => void;
  savedMonsterCount: number;
  otherUserName: string;
}

const AdventureHub: React.FC<AdventureHubProps> = ({ onNavigate, savedMonsterCount, otherUserName }) => {
  const portals = [
    {
      id: AppScreen.EmojiCharades,
      title: 'Emoji Charades',
      subtitle: `Guess the Movie!`,
      icon: 'sentiment_satisfied',
      color: 'bg-gradient-to-br from-indigo-500 to-violet-600',
      shadow: 'shadow-indigo-500/20'
    },
    {
      id: AppScreen.DadJokeDuel,
      title: 'Dad Joke Duel',
      subtitle: `Don't Laugh!`,
      icon: 'sentiment_very_dissatisfied',
      color: 'bg-gradient-to-br from-orange-500 to-amber-600',
      shadow: 'shadow-orange-500/20'
    },
    {
      id: AppScreen.FutureYourself,
      title: 'Future Mirror',
      subtitle: 'See your future self',
      icon: 'magic_button',
      color: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      shadow: 'shadow-cyan-500/20'
    },
    {
      id: AppScreen.TruthOrDareAI,
      title: 'Truth or Dare',
      subtitle: 'Extreme Family Edition',
      icon: 'local_fire_department',
      color: 'bg-gradient-to-br from-red-600 to-rose-700',
      shadow: 'shadow-red-500/20'
    },
    {
      id: AppScreen.StoryStarter,
      title: 'Story Spinner',
      subtitle: 'Spin a new tale!',
      icon: 'auto_stories',
      color: 'bg-gradient-to-br from-purple-600 to-fuchsia-700',
      shadow: 'shadow-purple-500/20'
    },
    {
      id: AppScreen.Main,
      title: 'Chaos Missions',
      subtitle: 'Earn Massive XP',
      icon: 'bolt',
      color: 'bg-gradient-to-br from-blue-600 to-cyan-600',
      shadow: 'shadow-blue-500/20'
    }
  ];

  return (
    <div className="flex-1 px-4 py-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-32">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-primary-dark to-primary bg-clip-text text-transparent">Family Fun🌀</h2>
        <p className="text-text-sec-light dark:text-text-sec-dark font-medium italic opacity-80">Ready to cause some trouble?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {portals.map((portal) => (
          <button
            key={portal.id}
            onClick={() => onNavigate(portal.id)}
            className={`relative flex flex-col items-start justify-end p-5 h-48 rounded-[2rem] ${portal.color} text-white ${portal.shadow} shadow-2xl hover:scale-[1.03] active:scale-95 transition-all group overflow-hidden border-2 border-white/10`}
          >
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="w-full flex justify-start mb-auto overflow-hidden">
              <span className="material-symbols-outlined text-5xl opacity-90 group-hover:scale-110 transition-transform duration-500 ease-out">
                {portal.icon}
              </span>
            </div>
            <div className="text-left relative z-10">
              <h3 className="text-xl font-black leading-none mb-2">{portal.title}</h3>
              <p className="text-[10px] font-black opacity-80 uppercase tracking-widest leading-tight">{portal.subtitle}</p>
            </div>
            <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
              <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-10 bg-white dark:bg-surface-dark p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 flex items-center justify-between shadow-xl shadow-black/5 active:scale-[0.98] transition-transform">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Family Activity</span>
          </div>
          <p className="font-bold text-lg dark:text-white leading-tight">{otherUserName} is active!</p>
          <p className="text-xs text-text-sec-light dark:text-text-sec-dark mt-1 italic">Join them in the chaos!</p>
        </div>
        <div className="flex -space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-white dark:border-surface-dark bg-primary flex items-center justify-center text-xs text-black font-black shadow-lg">You</div>
          <div className="w-10 h-10 rounded-full border-2 border-white dark:border-surface-dark bg-blue-500 flex items-center justify-center text-xs text-white font-black shadow-lg">{otherUserName[0]}</div>
        </div>
      </div>
    </div>
  );
};

export default AdventureHub;
