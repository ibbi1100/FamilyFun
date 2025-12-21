import React, { useState } from 'react';
import { generateEmojiCharades } from '../services/aiService';

const EmojiCharades: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [data, setData] = useState<{ title: string; emojis: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [revealed, setRevealed] = useState(false);

    const startGame = async () => {
        setLoading(true);
        setRevealed(false);
        const result = await generateEmojiCharades();
        setData(result);
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-indigo-900 text-white p-6 overflow-hidden relative">
            <button onClick={onBack} className="absolute top-6 left-6 z-10 p-2 bg-white/10 rounded-full">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>

            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl font-black mb-2 tracking-tight">Emoji Charades 🕵️</h2>
                <p className="text-white/60 mb-8 font-medium">Guess the movie or phrase!</p>

                {!data && !loading && (
                    <button
                        onClick={startGame}
                        className="px-8 py-6 bg-white text-indigo-900 rounded-2xl font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                        Start Game
                    </button>
                )}

                {loading && (
                    <div className="animate-pulse flex flex-col items-center gap-4">
                        <span className="text-4xl">🎲</span>
                        <p className="font-bold text-lg">Thinking of a puzzle...</p>
                    </div>
                )}

                {data && !loading && (
                    <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 animate-in zoom-in duration-300">
                        <div className="text-6xl mb-8 animate-bounce">{data.emojis}</div>

                        {!revealed ? (
                            <button
                                onClick={() => setRevealed(true)}
                                className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-wider shadow-lg hover:bg-emerald-400 active:scale-95 transition-all"
                            >
                                Reveal Answer
                            </button>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <p className="text-sm text-white/50 font-bold uppercase tracking-widest mb-2">The Answer Is</p>
                                <h3 className="text-3xl font-black text-yellow-300 mb-8">{data.title}</h3>
                                <button
                                    onClick={startGame}
                                    className="w-full py-4 bg-white text-indigo-900 rounded-xl font-bold uppercase tracking-wider shadow-lg hover:bg-gray-100 active:scale-95 transition-all"
                                >
                                    Next Puzzle
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmojiCharades;
