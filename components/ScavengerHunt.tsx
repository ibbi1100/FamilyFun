import React, { useState } from 'react';
import { generateScavengerHunt } from '../services/aiService';

interface ScavengerHuntProps {
    onBack: () => void;
}

const ScavengerHunt: React.FC<ScavengerHuntProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'setup' | 'playing' | 'won'>('setup');
    const [location, setLocation] = useState('Living Room');
    const [items, setItems] = useState<string[]>([]);
    const [foundItems, setFoundItems] = useState<boolean[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const locations = ['Living Room', 'Kitchen', 'Backyard', 'Kids Bedroom', 'Whole House'];

    const startGame = async () => {
        setIsLoading(true);
        try {
            const list = await generateScavengerHunt(location);
            setItems(list);
            setFoundItems(new Array(list.length).fill(false));
            setGameState('playing');
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleItem = (index: number) => {
        const newFound = [...foundItems];
        newFound[index] = !newFound[index];
        setFoundItems(newFound);

        if (newFound.every(Boolean)) {
            setTimeout(() => setGameState('won'), 500);
        }
    };

    return (
        <div className="flex-1 flex flex-col pt-4 px-4 pb-32 animate-in fade-in max-w-md mx-auto h-full">
            <header className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-lg active:scale-95">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-2xl font-black italic uppercase tracking-wider">Scavenger Hunt 🕵️‍♀️</h1>
            </header>

            {gameState === 'setup' && (
                <div className="flex-1 flex flex-col justify-center gap-6">
                    <div className="bg-white dark:bg-white/5 p-8 rounded-[2rem] shadow-xl text-center">
                        <span className="text-6xl mb-4 block">🏡</span>
                        <h2 className="text-xl font-bold mb-2">Where are we looking?</h2>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {locations.map(loc => (
                                <button
                                    key={loc}
                                    onClick={() => setLocation(loc)}
                                    className={`p-3 rounded-xl font-bold text-sm transition-all ${location === loc ? 'bg-primary text-black scale-105 shadow-lg' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}
                                >
                                    {loc}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={startGame}
                        disabled={isLoading}
                        className="bg-black dark:bg-white text-white dark:text-black py-4 rounded-full font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <span className="material-symbols-outlined animate-spin">refresh</span> : <span className="material-symbols-outlined">search</span>}
                        {isLoading ? 'Generating List...' : 'Start Hunt!'}
                    </button>
                </div>
            )}

            {gameState === 'playing' && (
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="bg-yellow-100 dark:bg-yellow-900/20 border-2 border-yellow-400 p-6 rounded-[2rem] shadow-xl relative">
                        <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                            Find These!
                        </div>
                        <div className="space-y-4 mt-2">
                            {items.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => toggleItem(i)}
                                    className={`w-full text-left p-4 rounded-xl flex items-center gap-4 transition-all ${foundItems[i] ? 'bg-green-500 text-white shadow-inner scale-[0.98] opacity-50' : 'bg-white dark:bg-white/10 shadow-md hover:scale-[1.02]'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${foundItems[i] ? 'border-white bg-white/20' : 'border-gray-300 dark:border-white/30'}`}>
                                        {foundItems[i] && <span className="material-symbols-outlined text-lg font-black">check</span>}
                                    </div>
                                    <span className={`font-bold text-lg ${foundItems[i] ? 'line-through decoration-2' : ''}`}>{item}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {gameState === 'won' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                    <span className="text-8xl mb-6 animate-bounce">🏆</span>
                    <h2 className="text-4xl font-black text-primary mb-2">MISSION COMPLETE!</h2>
                    <p className="text-xl opacity-70 mb-8">You found everything!</p>
                    <button
                        onClick={() => setGameState('setup')}
                        className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-black shadow-xl hover:scale-105 active:scale-95"
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default ScavengerHunt;
