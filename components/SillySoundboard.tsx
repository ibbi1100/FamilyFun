
import React, { useState, useRef } from 'react';
import { SOUND_FX } from '../constants';

const SillySoundboard: React.FC = () => {
  const [madness, setMadness] = useState(75);
  const [isRecording, setIsRecording] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playSynthSound = (freq: number) => {
    initAudio();
    const ctx = audioCtxRef.current!;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = madness > 80 ? 'sawtooth' : madness > 40 ? 'square' : 'sine';
    osc.frequency.setValueAtTime(freq * (madness / 50), ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  return (
    <div className="flex-1 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-500 no-scrollbar overflow-y-auto h-full px-4 pt-8">
      <div className="flex flex-col mb-10">
        <h2 className="text-4xl font-black leading-tight tracking-tight mb-2">Silly Sounds 🔊</h2>
        <p className="text-text-sec-light dark:text-text-sec-dark font-medium italic">Dial up the madness!</p>
      </div>

      <div className="relative mb-12">
        <div className="relative flex w-full flex-col items-start justify-between gap-4 p-8 bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-2xl border border-black/5 dark:border-white/5 overflow-hidden">
          <div className={`absolute inset-0 bg-primary/5 transition-opacity duration-1000 ${madness > 80 ? 'opacity-100' : 'opacity-0'}`} />
          
          <div className="flex w-full items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined text-primary text-3xl filled transition-transform duration-300 ${madness > 80 ? 'animate-bounce' : ''}`}>volume_up</span>
              <p className="text-xl font-black dark:text-white uppercase tracking-tighter">Madness Engine</p>
            </div>
            <p className="text-primary text-2xl font-black italic">{madness}%</p>
          </div>

          <div className="w-full mt-4 z-10">
            <div className="relative h-4 w-full rounded-full bg-gray-100 dark:bg-white/5 border border-black/5 dark:border-white/10 overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_20px_rgba(87,249,6,0.6)] transition-all duration-300"
                style={{ width: `${madness}%` }}
              />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={madness}
                onChange={(e) => setMadness(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <span>Cozy</span>
              <span>Chaos</span>
              <span className="text-primary-dark dark:text-primary">Insane</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-12">
        {SOUND_FX.map((fx, idx) => (
          <button 
            key={idx}
            onClick={() => playSynthSound(fx.freq)}
            className={`aspect-square rounded-[2rem] ${fx.color} text-white shadow-xl shadow-black/10 flex flex-col items-center justify-center gap-2 group relative overflow-hidden active:scale-90 transition-all border-4 border-white/20`}
          >
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
            <span className="material-symbols-outlined text-5xl drop-shadow-lg group-active:scale-125 transition-transform">{fx.icon}</span>
            <span className="font-black text-lg tracking-wide uppercase italic">{fx.name}</span>
          </button>
        ))}
      </div>

      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm flex justify-center pointer-events-none">
        <button 
          onClick={() => {
            initAudio();
            setIsRecording(!isRecording);
          }}
          className={`pointer-events-auto w-full h-20 bg-black dark:bg-white rounded-full shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all hover:-translate-y-1 ${isRecording ? 'ring-4 ring-red-500' : ''}`}
        >
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-primary animate-bounce'}`}>
            <span className={`material-symbols-outlined text-3xl filled ${isRecording ? 'text-white' : 'text-black'}`}>
              {isRecording ? 'stop' : 'mic'}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className={`${isRecording ? 'text-red-500' : 'text-primary dark:text-black'} font-black text-xl leading-none uppercase tracking-tighter`}>
              {isRecording ? 'STOP IT!' : 'RECORD PRANK'}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
              {isRecording ? 'Capturing silliness...' : 'Create New Audio FX'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SillySoundboard;
