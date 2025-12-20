
import React, { useState } from 'react';
import { MONSTER_HEADS, MONSTER_BASE, SKIN_TONES } from '../constants';
import { MonsterCategory, MonsterPart, SavedMonster } from '../types';

interface MonsterMashupProps {
  onBack: () => void;
  onSave?: (monster: SavedMonster) => void;
}

const MonsterMashup: React.FC<MonsterMashupProps> = ({ onBack, onSave }) => {
  const [selectedCategory, setSelectedCategory] = useState<MonsterCategory>('Heads');
  const [selectedSkin, setSelectedSkin] = useState(SKIN_TONES[0]);
  const [selectedHead, setSelectedHead] = useState<MonsterPart>(MONSTER_HEADS[0]);
  const [name, setName] = useState('Gigglepuff');

  const categories: MonsterCategory[] = ['Heads', 'Torsos', 'Legs', 'Extras'];

  const handleSave = () => {
    if (onSave) {
      onSave({
        id: Math.random().toString(),
        head: selectedHead,
        skin: selectedSkin,
        name: name
      });
      onBack();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
      <header className="flex items-center justify-between p-6 pb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-white/10 shadow-lg active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-3xl">arrow_back</span>
          </button>
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent border-none text-3xl font-black focus:ring-0 p-0 w-56 tracking-tight dark:text-white"
          />
        </div>
        <button 
          onClick={handleSave}
          className="bg-primary text-black font-black px-8 py-3 rounded-full shadow-2xl active:scale-95 transition-transform uppercase tracking-widest text-sm italic"
        >
          BORN IT! 🧬
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative w-full px-6 py-4 overflow-hidden">
        <div className="relative w-full h-[80%] max-h-[500px] bg-white dark:bg-surface-dark rounded-[3rem] shadow-2xl border-2 border-black/5 dark:border-white/5 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          
          <div className="relative w-64 h-64 flex items-center justify-center">
             <div 
               className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-all duration-700 ease-out"
               style={{ 
                 backgroundImage: `url("${MONSTER_BASE}")`,
                 filter: `drop-shadow(0 0 40px ${selectedSkin})`
               }}
             />
             <div 
               className="absolute top-[-40px] w-full h-full bg-contain bg-center bg-no-repeat animate-bounce duration-[2000ms]"
               style={{ 
                 backgroundImage: `url("${selectedHead.imageUrl}")`,
                 transform: 'scale(0.9)',
                 opacity: 0.95
               }}
             />
          </div>

          <div className="absolute top-6 right-6 flex flex-col gap-4">
            <button 
              onClick={() => {
                const randomHead = MONSTER_HEADS[Math.floor(Math.random() * MONSTER_HEADS.length)];
                setSelectedHead(randomHead);
                setSelectedSkin(SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)]);
              }}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/90 dark:bg-black/40 backdrop-blur-xl shadow-xl hover:bg-primary transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-2xl font-black">casino</span>
            </button>
          </div>
        </div>

        <div className="w-full mt-8 max-w-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Skin Tone Serum</p>
          <div className="flex justify-center gap-4">
            {SKIN_TONES.map(color => (
              <button 
                key={color}
                onClick={() => setSelectedSkin(color)}
                className={`w-10 h-10 rounded-full transition-all border-4 ${selectedSkin === color ? 'border-primary scale-125 shadow-xl shadow-primary/20' : 'border-white dark:border-white/10'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </main>

      <div className="bg-white dark:bg-surface-dark rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] pb-8 pt-8 px-6">
        <div className="flex overflow-x-auto no-scrollbar gap-4 mb-6">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedCategory === cat 
                ? 'bg-black dark:bg-white text-primary dark:text-black shadow-2xl scale-105' 
                : 'bg-gray-100 dark:bg-white/5 text-gray-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-6 py-4">
          {selectedCategory === 'Heads' ? MONSTER_HEADS.map(head => (
            <button 
              key={head.id}
              onClick={() => setSelectedHead(head)}
              className={`shrink-0 flex flex-col items-center gap-3 transition-all ${selectedHead.id === head.id ? 'scale-110' : 'opacity-60'}`}
            >
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center border-4 transition-all ${
                selectedHead.id === head.id ? 'bg-primary/10 border-primary shadow-xl' : 'bg-gray-50 dark:bg-white/5 border-transparent'
              }`}>
                <div className="w-16 h-16 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url("${head.imageUrl}")` }} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{head.name}</span>
            </button>
          )) : (
            <div className="w-full py-12 text-center opacity-30 font-black uppercase tracking-widest text-sm">
              More parts coming soon...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonsterMashup;
