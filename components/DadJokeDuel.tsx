import React, { useState } from 'react';
import { generateDadJoke } from '../services/aiService';
import UserSelectModal from './UserSelectModal';
import { User, UserProfile } from '../types';
import { supabase } from '../lib/supabase';

const DadJokeDuel: React.FC<{ onBack: () => void; currentUser: User; onWin: (amount: number) => void }> = ({ onBack, currentUser, onWin }) => {
    const [joke, setJoke] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPunchline, setShowPunchline] = useState(false);

    // Multiplayer State
    const [showUserSelect, setShowUserSelect] = useState(true); // Show immediately on load?
    const [opponent, setOpponent] = useState<UserProfile | null>(null);

    // Simple score tracking for the session
    const [p1Score, setP1Score] = useState(0); // Start at 0, race to 3
    const [p2Score, setP2Score] = useState(0);

    const WINNING_SCORE = 3;

    const handlePoint = (player: 'p1' | 'p2') => {
        if (player === 'p1') {
            const newScore = p1Score + 1;
            setP1Score(newScore);
            if (newScore >= WINNING_SCORE) {
                // Victory!
                setTimeout(() => {
                    alert("🏆 You Won! +$2.00");
                    onWin(2.00);
                    setP1Score(0);
                    setP2Score(0);
                }, 500);
            }
        } else {
            setP2Score(s => s + 1);
        }
    };

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
            {showUserSelect && (
                <UserSelectModal
                    currentUser={currentUser}
                    onClose={() => {
                        if (!opponent) onBack(); // If cancelled without picking, go back
                        else setShowUserSelect(false);
                    }}
                    onSelect={(user) => {
                        setOpponent(user);
                        setShowUserSelect(false);
                    }}
                />
            )}

            <button onClick={onBack} className="absolute top-6 left-6 z-10 p-2 bg-white/10 rounded-full">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button
                onClick={() => setShowUserSelect(true)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/10 rounded-full flex items-center gap-2 px-3"
            >
                <span className="text-xs font-bold uppercase">{opponent ? opponent.name : 'Pick Opponent'}</span>
                <span className="material-symbols-outlined text-sm">group</span>
            </button>

            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
                <div className="mb-8 flex gap-8 items-center justify-center w-full">
                    <div className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-110">
                        <img src={currentUser.avatar} alt="You" className="w-16 h-16 rounded-full border-4 border-white mb-2 shadow-lg" />
                        <div className="flex gap-1 justify-center">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className={`w-3 h-3 rounded-full ${i < p1Score ? 'bg-yellow-400' : 'bg-white/30'} shadow-sm`}></div>
                            ))}
                        </div>
                        <button onClick={() => handlePoint('p1')} className="text-[10px] mt-2 bg-black/20 px-3 py-1 rounded-full hover:bg-black/30 transition-colors uppercase font-bold">I Laughed (+0)</button>
                        <button onClick={() => handlePoint('p2')} className="text-[10px] mt-1 bg-white text-orange-600 px-3 py-1 rounded-full hover:bg-white/90 transition-colors uppercase font-bold">They Laughed (+1)</button>
                    </div>

                    <div className="text-3xl font-black opacity-30 italic">VS</div>

                    <div className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-110">
                        {opponent ? (
                            <img src={opponent.avatar} alt={opponent.name} className="w-16 h-16 rounded-full border-4 border-white mb-2 shadow-lg" />
                        ) : (
                            <div className="w-16 h-16 rounded-full border-4 border-white/30 bg-white/10 flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-3xl opacity-50">question_mark</span>
                            </div>
                        )}
                        <div className="flex gap-1 justify-center">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className={`w-3 h-3 rounded-full ${i < p2Score ? 'bg-yellow-400' : 'bg-white/30'} shadow-sm`}></div>
                            ))}
                        </div>
                        <button onClick={() => handlePoint('p2')} className="text-[10px] mt-2 bg-black/20 px-3 py-1 rounded-full hover:bg-black/30 transition-colors uppercase font-bold">They Laughed (+0)</button>
                        <button onClick={() => handlePoint('p1')} className="text-[10px] mt-1 bg-white text-orange-600 px-3 py-1 rounded-full hover:bg-white/90 transition-colors uppercase font-bold">I Laughed (+1)</button>
                    </div>
                </div>

                <h2 className="text-3xl font-black mb-8 tracking-tight transform -rotate-2 drop-shadow-md">Dad Joke Duel</h2>
                <p className="text-white/60 text-xs mb-4 font-bold uppercase tracking-widest">First to 3 laughs wins $2.00</p>

                {!joke && !loading && (
                    <button
                        onClick={fetchJoke}
                        className="w-full py-6 bg-yellow-400 text-orange-900 rounded-3xl font-black text-2xl shadow-[0_10px_0_rgb(180,83,9)] hover:translate-y-1 hover:shadow-[0_5px_0_rgb(180,83,9)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3"
                    >
                        Load Ammo 📢
                    </button>
                )}

                {loading && (
                    <div className="animate-spin text-5xl opacity-50">🌀</div>
                )}

                {joke && !loading && (
                    <div className="bg-white text-black p-8 rounded-[2rem] shadow-2xl relative w-full animate-in zoom-in duration-300">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                            Read This
                        </div>

                        <p className="text-xl font-bold leading-relaxed mb-6 text-gray-800">
                            {joke}
                        </p>

                        <button
                            onClick={fetchJoke}
                            className="w-full py-4 bg-orange-500 text-white rounded-xl font-black uppercase tracking-wider hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-500/30"
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
