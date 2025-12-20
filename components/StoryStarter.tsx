
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

const CHARACTERS = [
  { name: 'Sneezing Dragon', icon: 'face_6', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' },
  { name: 'Grumpy Alien', icon: 'smart_toy', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300' },
  { name: 'Dancing Robot', icon: 'precision_manufacturing', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' },
  { name: 'Tiny Knight', icon: 'shield', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300' },
  { name: 'Sleepy Ninja', icon: 'bedtime', color: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-300' }
];

const SETTINGS = [
  { name: 'Giant Mushroom', icon: 'castle', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' },
  { name: 'Candy Factory', icon: 'cookie', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300' },
  { name: 'Planet Mars', icon: 'rocket_launch', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300' },
  { name: 'Inside a Fridge', icon: 'kitchen', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' },
  { name: 'Underwater Cave', icon: 'waves', color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300' }
];

const EVENTS = [
  { name: 'Lost pants', icon: 'apparel', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300' },
  { name: 'Found gold', icon: 'savings', color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { name: 'Ate a bug', icon: 'bug_report', color: 'bg-lime-100 text-lime-600 dark:bg-lime-900/30 dark:text-lime-300' },
  { name: 'Became a bird', icon: 'flutter_dash', color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300' },
  { name: 'Forgot everything', icon: 'question_mark', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' }
];

const StoryStarter: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [indices, setIndices] = useState([0, 0, 0]);
  const [fullStory, setFullStory] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<'Classic' | 'Chaos'>('Classic');

  const spinInterval = useRef<number | null>(null);

  const spin = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setIsGenerating(false);
    setFullStory([]);

    let count = 0;
    const maxCycles = 20;

    spinInterval.current = window.setInterval(() => {
      setIndices([
        Math.floor(Math.random() * CHARACTERS.length),
        Math.floor(Math.random() * SETTINGS.length),
        Math.floor(Math.random() * EVENTS.length)
      ]);
      count++;
      if (count >= maxCycles) {
        if (spinInterval.current) clearInterval(spinInterval.current);
        setIsSpinning(false);
        generateStoryPrompt();
      }
    }, 100);
  };

  const generateStoryPrompt = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const char = CHARACTERS[indices[0]].name;
      const set = SETTINGS[indices[1]].name;
      const evt = EVENTS[indices[2]].name;

      const prompt = mode === 'Chaos' 
        ? `Create a 1-sentence incredibly wacky and bizarre story starter about a ${char} in a ${set} who ${evt}.`
        : `Create a 1-sentence funny story starter for kids about a ${char} in a ${set} who ${evt}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setFullStory([response.text || "Once upon a time..."]);
    } catch (error) {
      setFullStory(["A story began in a mysterious way!"]);
    } finally {
      setIsGenerating(false);
    }
  };

  const continueStory = async () => {
    if (isGenerating || fullStory.length === 0) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentStory = fullStory.join(" ");
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given this story start: "${currentStory}", add ONE crazy and unexpected sentence that continues the plot. Keep it family friendly but wild.`
      });
      
      setFullStory(prev => [...prev, response.text || "And then it got even weirder!"]);
    } catch (error) {
      setFullStory(prev => [...prev, "Something else happened!"]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center pt-2 pb-32 px-4 animate-in fade-in duration-500 max-w-md mx-auto no-scrollbar overflow-y-auto">
      <header className="w-full flex items-center justify-between py-4 border-b border-gray-100 dark:border-white/10 mb-2">
        <div className="bg-background-light dark:bg-white/10 rounded-full p-2 text-[#131811] dark:text-white flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">sports_esports</span>
        </div>
        <h1 className="text-[#131811] dark:text-white text-xl font-black flex-1 text-center">Story Spinner</h1>
        <button className="flex items-center gap-1 text-primary-dark font-black text-sm bg-primary/10 py-2 px-3 rounded-full">
          <span className="material-symbols-outlined text-[20px] filled">book_2</span>
          <span>Library</span>
        </button>
      </header>

      <div className="w-full text-center py-4">
        <h2 className="text-[#131811] dark:text-white tracking-tight text-3xl font-black leading-tight">Adventure Awaits!</h2>
      </div>

      <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-full mb-6 w-full max-w-[280px]">
        {(['Classic', 'Chaos'] as const).map(m => (
          <button 
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 px-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' : 'text-gray-500'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="w-full mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-[70px] -translate-y-1/2 bg-primary/20 border-y-4 border-primary z-0 rounded-2xl"></div>
        
        <div className="flex justify-between items-center relative z-0 py-8 gap-2">
          {[
            { label: 'Who?', items: CHARACTERS, idx: 0 },
            { label: 'Where?', items: SETTINGS, idx: 1 },
            { label: 'What?', items: EVENTS, idx: 2 }
          ].map((col, i) => (
            <div key={i} className="flex-1 flex flex-col gap-4 text-center items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{col.label}</span>
              <div className="flex flex-col gap-1 w-full overflow-hidden">
                <div className={`${col.items[indices[col.idx]].color} rounded-2xl h-[70px] flex flex-col items-center justify-center px-1 shadow-lg transform scale-110 transition-all duration-300 border-2 border-white/50`}>
                  <span className="material-symbols-outlined text-2xl mb-1">{col.items[indices[col.idx]].icon}</span>
                  <p className="text-[8px] font-black uppercase tracking-tighter w-full text-center leading-none">{col.items[indices[col.idx]].name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full px-2 mb-8">
        <button 
          onClick={spin}
          disabled={isSpinning}
          className="group relative w-full overflow-hidden rounded-3xl bg-primary text-black h-16 shadow-xl active:translate-y-1 transition-all disabled:opacity-50"
        >
          <div className="relative flex items-center justify-center gap-3">
            <span className={`material-symbols-outlined text-3xl ${isSpinning ? 'animate-spin' : ''}`}>autorenew</span>
            <span className="text-xl font-black tracking-widest italic">SPIN TO WIN!</span>
          </div>
        </button>
      </div>

      {fullStory.length > 0 && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="rounded-[2.5rem] bg-white dark:bg-white/5 p-6 shadow-2xl border-2 border-primary/20 relative">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary text-black p-1.5 rounded-full material-symbols-outlined text-sm filled">menu_book</span>
              <p className="text-xs font-black uppercase tracking-widest text-primary">Your Crazy Tale</p>
            </div>
            <div className="space-y-3">
              {fullStory.map((sentence, i) => (
                <p key={i} className="text-text-main-light dark:text-white text-lg font-bold leading-snug animate-in fade-in slide-in-from-left duration-300">
                  {sentence}
                </p>
              ))}
            </div>
            
            <div className="mt-8 flex flex-col gap-3">
              <button 
                onClick={continueStory}
                disabled={isGenerating}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined">auto_fix_high</span>
                {isGenerating ? "Gemini is Writing..." : "Add More Crazy!"}
              </button>
              <button className="w-full bg-primary/10 text-primary-dark font-black text-xs py-3 rounded-xl">
                Save to Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryStarter;
