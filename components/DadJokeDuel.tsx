import React, { useState } from 'react';
import { generateDadJoke } from '../services/aiService';

const DadJokeDuel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [joke, setJoke] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPunchline, setShowPunchline] = useState(false);

    // Simple score tracking for the session
    const [p1Score, setP1Score] = useState(5);
    const [p2Score, setP2Score] = useState(5);

    const fetchJoke = async () => {
        setLoading(true);
        setShowPunchline(false);
        // Wait a tiny bit for effect
        const result = await generateDadJoke();
        setJoke(result);
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-orange-600 text-white p-6 overflow-hidden relative">
            <button onClick={onBack} className="absolute top-6 left-6 z-10 p-2 bg-white/10 rounded-full">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>

            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
                <div className="mb-8 flex gap-8 items-center justify-center w-full">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl mb-2">😐</span>
                        <div className="flex gap-1">
                            {Array.from({ length: p1Score }).map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-white"></div>)}
                        </div>
                        <button onClick={() => setP1Score(s => Math.max(0, s - 1))} className="text-[10px] mt-2 bg-black/20 px-2 py-1 rounded">Laugh (-1)</button>
                    </div>
                    <div className="text-2xl font-black opacity-50">VS</div>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl mb-2">🤭</span>
                        <div className="flex gap-1">
                            {Array.from({ length: p2Score }).map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-white"></div>)}
                        </div>
                        <button onClick={() => setP2Score(s => Math.max(0, s - 1))} className="text-[10px] mt-2 bg-black/20 px-2 py-1 rounded">Laugh (-1)</button>
                    </div>
                </div>

                <h2 className="text-3xl font-black mb-8 tracking-tight transform -rotate-2">Dad Joke Duel</h2>

                {!joke && !loading && (
                    <button
                        onClick={fetchJoke}
                        className="w-full py-6 bg-yellow-400 text-orange-900 rounded-3xl font-black text-2xl shadow-[0_10px_0_rgb(180,83,9)] hover:translate-y-1 hover:shadow-[0_5px_0_rgb(180,83,9)] active:translate-y-2 active:shadow-none transition-all"
                    >
                        Load Ammo 📢
                    </button>
                )}

                {loading && (
                    <div className="animate-spin text-5xl opacity-50">🌀</div>
                )}

                {joke && !loading && (
                    <div className="bg-white text-black p-8 rounded-[2rem] shadow-2xl relative w-full">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                            Read This
                        </div>

                        {/* Split joke if it has a question mark, otherwise just show it all but maybe hide the end? 
                Simple logic: Show full joke but user controls delivery. 
            */}
                        <p className="text-xl font-bold leading-relaxed mb-6">
                            {joke}
                        </p>

                        <button
                            onClick={fetchJoke}
                            className="w-full py-4 bg-orange-500 text-white rounded-xl font-black uppercase tracking-wider hover:bg-orange-600 active:scale-95 transition-all"
                        >
                            Next Joke
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DadJokeDuel;
