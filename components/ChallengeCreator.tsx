
import React, { useState } from 'react';
import { Activity } from '../types';
import { generateCrazyChallenge } from '../services/geminiService';

interface ChallengeCreatorProps {
  onCreate: (activity: Activity) => void;
}

const ChallengeCreator: React.FC<ChallengeCreatorProps> = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [xp, setXp] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  const xpOptions = [10, 30, 50, 100];

  const handleCreate = () => {
    if (!title.trim()) return;
    
    const newChallenge: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      title: title,
      description: "A custom madness challenge from the squad.",
      duration: "5 min",
      xp: xp,
      owner: 'Shared',
      emoji: '⚡️'
    };

    onCreate(newChallenge);
    setTitle('');
  };

  const handleAIMagic = async () => {
    setIsLoading(true);
    try {
      const aiChallenge = await generateCrazyChallenge();
      onCreate(aiChallenge);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-surface-dark p-6 shadow-2xl border-2 border-dashed border-primary/40 mb-6 animate-in slide-in-from-top-8 duration-700">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full"></div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-xl font-black flex items-center gap-3 italic">
          <span className="material-symbols-outlined text-primary-dark dark:text-primary text-3xl filled">bolt</span>
          Summon Chaos
        </h3>
        <button 
          onClick={handleAIMagic}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-sm ${isLoading ? 'animate-spin' : ''}`}>auto_fix_high</span>
          {isLoading ? 'Summoning...' : 'AI Magic'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-2xl px-6 py-4 text-lg font-black placeholder-gray-400 focus:ring-4 focus:ring-primary/20 transition-all shadow-inner" 
            placeholder="Challenge Name..." 
            type="text"
          />
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Reward Points</p>
          <div className="grid grid-cols-4 gap-3">
            {xpOptions.map(opt => (
              <button 
                key={opt}
                onClick={() => setXp(opt)}
                className={`py-3 rounded-xl font-black text-sm transition-all border-2 ${
                  xp === opt 
                    ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20 scale-105' 
                    : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-400'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleCreate}
          disabled={!title.trim()}
          className="w-full bg-primary text-black py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3 uppercase italic tracking-tighter"
        >
          <span className="material-symbols-outlined font-black">add_circle</span>
          Launch Challenge
        </button>
      </div>
    </div>
  );
};

export default ChallengeCreator;
