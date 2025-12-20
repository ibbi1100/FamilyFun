import React, { useState, useRef, useEffect } from 'react';
import { SOUND_FX } from '../constants';

const SillySoundboard: React.FC = () => {
  const [madness, setMadness] = useState(50);
  const [isRecording, setIsRecording] = useState(false);
  const [gameState, setGameState] = useState<'record' | 'hiding' | 'hunting' | 'won'>('record');
  const [hiddenIndex, setHiddenIndex] = useState<number | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Expanded sound grid for "smaller buttons" feel (4x4 = 16 buttons)
  // We'll repeat/mix SOUND_FX to fill the grid or use procedural generation colors
  const GRID_SIZE = 16;

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const startRecording = async () => {
    initAudio();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/ogg; codecs=opus' });
        const audioURL = window.URL.createObjectURL(blob);
        setRecordedAudio(audioURL);
        setGameState('hiding');
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic Error:", err);
      // Fallback for demo/no-mic
      setRecordedAudio("fallback");
      setGameState('hiding');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      // Fallback flow
      setRecordedAudio("fallback");
      setGameState('hiding');
    }
  };

  const hideSound = () => {
    // Randomly assign the sound to one of the grid slots
    const randomIdx = Math.floor(Math.random() * GRID_SIZE);
    setHiddenIndex(randomIdx);
    setGameState('hunting');
  };

  const playRecordedSound = () => {
    if (recordedAudio && recordedAudio !== "fallback") {
      const audio = new Audio(recordedAudio);
      audio.play();
    } else {
      // Fallback beep
      playSynthSound(800, 'triangle');
    }
  };

  const playSynthSound = (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle' = 'sine') => {
    initAudio();
    const ctx = audioCtxRef.current!;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    // Modulate freq based on madness
    const crazyFreq = freq + (Math.random() * madness * 10) - (madness * 5);
    osc.frequency.setValueAtTime(crazyFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  };

  const handleGridClick = (index: number) => {
    if (gameState !== 'hunting') return;

    if (index === hiddenIndex) {
      // Found it!
      playRecordedSound();
      setGameState('won');
    } else {
      // Decoy sound
      const baseFreq = 200 + (index * 50);
      const types: any[] = ['sine', 'square', 'sawtooth', 'triangle'];
      playSynthSound(baseFreq, types[index % 4]);
    }
  };

  const resetGame = () => {
    setGameState('record');
    setRecordedAudio(null);
    setHiddenIndex(null);
  };

  return (
    <div className="flex-1 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-500 no-scrollbar overflow-y-auto h-full px-4 pt-4">
      <header className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h2 className="text-3xl font-black leading-tight tracking-tight">Sound Hunt 🔊</h2>
          <p className="text-text-sec-light dark:text-text-sec-dark font-medium italic text-sm">Find the hidden voice!</p>
        </div>
        <button
          onClick={() => setShowHelp(true)}
          className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined">help</span>
        </button>
      </header>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white dark:bg-surface-dark p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-purple-500"></div>
            <span className="text-6xl mb-4 block">🤫</span>
            <h3 className="text-2xl font-black mb-2">How to Play</h3>
            <ol className="text-left space-y-3 mb-8 text-sm opacity-80 font-bold">
              <li className="flex gap-2"><span className="bg-primary/20 text-primary-dark rounded px-2">1</span> Record a silly sound or message.</li>
              <li className="flex gap-2"><span className="bg-primary/20 text-primary-dark rounded px-2">2</span> The game hides it behind a button.</li>
              <li className="flex gap-2"><span className="bg-primary/20 text-primary-dark rounded px-2">3</span> Pass phone to a friend to find it!</li>
            </ol>
            <button
              onClick={() => setShowHelp(false)}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Game State Flow */}
      {gameState === 'record' && (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-8">
          <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-red-500 scale-110 shadow-[0_0_50px_rgba(239,68,68,0.5)]' : 'bg-gray-100 dark:bg-white/5 shadow-inner'}`}>
            <span className={`material-symbols-outlined text-8xl ${isRecording ? 'text-white animate-pulse' : 'text-gray-300'}`}>mic</span>
          </div>

          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className="w-full max-w-xs bg-primary text-black py-6 rounded-[2rem] font-black text-2xl uppercase tracking-widest shadow-xl active:scale-95 transition-all select-none"
          >
            {isRecording ? 'Release to Stop' : 'Hold to Record'}
          </button>
          <p className="text-xs opacity-50 font-black uppercase tracking-[0.2em] animate-pulse">Record your secret sound...</p>
        </div>
      )}

      {gameState === 'hiding' && (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-6 animate-in zoom-in">
          <span className="text-8xl mb-4 animate-spin">🪄</span>
          <h3 className="text-2xl font-black">Shuffling Sounds...</h3>
          <button
            onClick={hideSound}
            className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-transform shadow-xl"
          >
            Hide My Sound!
          </button>
        </div>
      )}

      {(gameState === 'hunting' || gameState === 'won') && (
        <div className="animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex justify-between items-center mb-4 px-2">
            <p className={`font-black uppercase tracking-widest text-sm ${gameState === 'won' ? 'text-green-500' : 'opacity-50'}`}>
              {gameState === 'won' ? '🎉 FOUND IT! 🎉' : 'Find the sound...'}
            </p>
            {gameState === 'won' && (
              <button onClick={resetGame} className="text-xs font-bold underline">Play Again</button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: GRID_SIZE }).map((_, i) => (
              <button
                key={i}
                onClick={() => handleGridClick(i)}
                disabled={gameState === 'won' && i !== hiddenIndex}
                className={`aspect-square rounded-2xl flex items-center justify-center text-4xl shadow-lg transition-all active:scale-90 relative overflow-hidden group
                            ${gameState === 'won' && i === hiddenIndex
                    ? 'bg-green-500 text-white scale-110 ring-4 ring-green-300 z-10'
                    : 'bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20'
                  }
                        `}
              >
                {gameState === 'won' && i === hiddenIndex ? (
                  <span className="material-symbols-outlined animate-bounce">mic</span>
                ) : (
                  <span className="opacity-20 group-hover:opacity-40 transition-opacity">?</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
              </button>
            ))}
          </div>

          {/* Madness Slider remains for decoy sounds */}
          <div className="mt-12 bg-white dark:bg-white/5 p-6 rounded-3xl shadow-lg border border-black/5">
            <label className="text-xs font-black uppercase tracking-widest opacity-50 block mb-4">Decoy Madness Level</label>
            <input
              type="range"
              min="0"
              max="100"
              value={madness}
              onChange={(e) => setMadness(parseInt(e.target.value))}
              className="w-full accent-primary h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SillySoundboard;
