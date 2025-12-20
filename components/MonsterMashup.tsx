
import React, { useState, useRef, useEffect } from 'react';
import { MONSTER_HEADS, MONSTER_BASE, SKIN_TONES } from '../constants';
import { MonsterCategory, MonsterPart, SavedMonster } from '../types';

interface MonsterMashupProps {
  onBack: () => void;
  onSave?: (monster: SavedMonster) => void;
}

const FUNNY_NAMES = ['Gigglepuff', 'Snargle', 'Bloop', 'Zazzle', 'Fuzzbutt', 'Goober', 'Wiggles'];

const MonsterMashup: React.FC<MonsterMashupProps> = ({ onBack, onSave }) => {
  const [selectedCategory, setSelectedCategory] = useState<MonsterCategory>('Heads');
  const [selectedSkin, setSelectedSkin] = useState(SKIN_TONES[0]);
  const [selectedHead, setSelectedHead] = useState<MonsterPart>(MONSTER_HEADS[0]);
  const [name, setName] = useState('Gigglepuff');
  
  // Spin & Reveal State
  const [isSpinning, setIsSpinning] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const categories: MonsterCategory[] = ['Heads', 'Torsos', 'Legs', 'Extras'];

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setIsRevealed(false);
    
    let spinCount = 0;
    
    // Start spinning
    intervalRef.current = window.setInterval(() => {
      const randomHead = MONSTER_HEADS[Math.floor(Math.random() * MONSTER_HEADS.length)];
      const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)];
      const randomName = FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)];
      
      setSelectedHead(randomHead);
      setSelectedSkin(randomSkin);
      
      // Only randomize name if user hasn't typed a custom one (simple check if it's in our list)
      if (FUNNY_NAMES.includes(name)) {
        setName(randomName);
      }
      
      spinCount++;
    }, 100);

    // Stop after 2s
    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsSpinning(false);
      setIsRevealed(true);
      // Ensure we end on a random name from the list if we were spinning names
      if (FUNNY_NAMES.includes(name)) {
        setName(FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)]);
      }
    }, 2000);
  };

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
      <header className="flex items-center justify-between p-6 pb-2 relative z-20">
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
            disabled={isSpinning}
            className={`bg-transparent border-none text-3xl font-black focus:ring-0 p-0 w-56 tracking-tight dark:text-white transition-opacity duration-300 ${isSpinning ? 'opacity-50' : 'opacity-100'}`}
          />
        </div>
        <button 
          onClick={handleSave}
          disabled={isSpinning}
          className="bg-primary text-black font-black px-8 py-3 rounded-full shadow-2xl active:scale-95 transition-transform uppercase tracking-widest text-sm italic disabled:opacity-50 disabled:grayscale"
        >
          BORN IT! 🧬
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative w-full px-6 py-4 overflow-hidden">
        <div className="relative w-full h-[80%] max-h-[500px] bg-white dark:bg-surface-dark rounded-[3rem] shadow-2xl border-2 border-black/5 dark:border-white/5 overflow-hidden flex items-center justify-center group">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          
          {/* Monster Render Container */}
          <div className={`relative w-64 h-64 flex items-center justify-center transition-all duration-500 ease-out ${isSpinning ? 'scale-75 blur-md grayscale contrast-125 opacity-60' : 'scale-100'}`}>
             <div 
               className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-all duration-700 ease-out"
               style={{ 
                 backgroundImage: `url("${MONSTER_BASE}")`,
                 filter: `drop-shadow(0 0 40px ${selectedSkin})`
               }}
             />
             <div 
               className={`absolute top-[-40px] w-full h-full bg-contain bg-center bg-no-repeat duration-300 ${isSpinning ? '' : 'animate-bounce'}`}
               style={{ 
                 backgroundImage: `url("${selectedHead.imageUrl}")`,
                 transform: 'scale(0.9)',
                 opacity: 0.95
               }}
             />
          </div>

          {/* Reveal Flash */}
          {isRevealed && (
            <div className="absolute inset-0 bg-white animate-out fade-out zoom-out duration-1000 pointer-events-none mix-blend-overlay"></div>
          )}

          {/* Silhouette / Mystery Overlay */}
          {isSpinning && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-9xl font-black text-black/10 dark:text-white/10 animate-pulse">?</span>
            </div>
          )}

          {/* Match Status Bubble */}
          {isRevealed && !isSpinning && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-full shadow-xl animate-in slide-in-from-bottom-4 fade-in zoom-in duration-500 z-20">
               <span className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary dark:text-primary-dark filled">check_circle</span>
                 Is it a match?
               </span>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-4">
            <button 
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-white/90 dark:bg-black/40 backdrop-blur-xl shadow-xl border-2 border-primary/20 hover:bg-primary transition-all active:scale-90 ${isSpinning ? 'animate-spin' : 'hover:scale-110'}`}
            >
              <span className="material-symbols-outlined text-3xl font-black filled">{isSpinning ? 'autorenew' : 'casino'}</span>
            </button>
          </div>
        </div>

        <div className="w-full mt-8 max-w-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Skin Tone Serum</p>
          <div className="flex justify-center gap-4">
            {SKIN_TONES.map(color => (
              <button 
                key={color}
                disabled={isSpinning}
                onClick={() => setSelectedSkin(color)}
                className={`w-10 h-10 rounded-full transition-all border-4 ${selectedSkin === color ? 'border-primary scale-125 shadow-xl shadow-primary/20' : 'border-white dark:border-white/10'} disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </main>

      <div className="bg-white dark:bg-surface-dark rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] pb-8 pt-8 px-6 relative z-30">
        <div className="flex overflow-x-auto no-scrollbar gap-4 mb-6">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              disabled={isSpinning}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all disabled:opacity-50 ${
                selectedCategory === cat 
                ? 'bg-black dark:bg-white text-primary dark:text-black shadow-2xl scale-105' 
                : 'bg-gray-100 dark:bg-white/5 text-gray-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-6 py-4 min-h-[140px]">
          {selectedCategory === 'Heads' ? MONSTER_HEADS.map(head => (
            <button 
              key={head.id}
              onClick={() => setSelectedHead(head)}
              disabled={isSpinning}
              className={`shrink-0 flex flex-col items-center gap-3 transition-all disabled:opacity-30 ${selectedHead.id === head.id ? 'scale-110' : 'opacity-60'}`}
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
