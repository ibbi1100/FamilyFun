import React, { useState } from 'react';
import { generateMysteryActivity } from '../services/aiService';

interface MysteryJarProps {
    onBack: () => void;
}

const MysteryJar: React.FC<MysteryJarProps> = ({ onBack }) => {
    const [duration, setDuration] = useState('15 mins');
    const [energy, setEnergy] = useState('Active');
    const [activity, setActivity] = useState<{ title: string; description: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const durations = ['5 mins', '15 mins', '1 hour'];
    const energies = ['Chill', 'Active', 'Crazy'];

    const handlePull = async () => {
        setIsLoading(true);
        setActivity(null);
        try {
            const result = await generateMysteryActivity(duration, energy);
            setActivity(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col pt-4 px-4 pb-32 animate-in fade-in max-w-md mx-auto h-full overflow-y-auto no-scrollbar">
            <header className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-lg active:scale-95">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-2xl font-black italic uppercase tracking-wider">Mystery Jar 🏺</h1>
            </header>

            {!activity ? (
                <div className="flex-1 flex flex-col justify-center gap-8">
                    <div className="text-center space-y-2">
                        <span className="text-8xl animate-bounce inline-block">🏺</span>
                        <h2 className="text-2xl font-black">I'm Bored!</h2>
                        <p className="opacity-70">Tell me what you have, and I'll give you something to do.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl shadow-lg">
                            <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-3 block">Time Available</label>
                            <div className="flex gap-2">
                                {durations.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDuration(d)}
                                        className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${duration === d ? 'bg-indigo-500 text-white shadow-lg scale-105' : 'bg-gray-100 dark:bg-white/5 opacity-70'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-white/5 p-6 rounded-3xl shadow-lg">
                            <label className="text-xs font-black uppercase tracking-widest opacity-50 mb-3 block">Energy Level</label>
                            <div className="flex gap-2">
                                {energies.map(e => (
                                    <button
                                        key={e}
                                        onClick={() => setEnergy(e)}
                                        className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${energy === e ? 'bg-pink-500 text-white shadow-lg scale-105' : 'bg-gray-100 dark:bg-white/5 opacity-70'}`}
                                    >
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePull}
                        disabled={isLoading}
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                        {isLoading ? (
                            <span className="material-symbols-outlined animate-spin text-3xl">autorenew</span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">auto_awesome</span>
                                Pull Activity
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in duration-500">
                    <div className="w-full bg-white dark:bg-surface-dark border-4 border-black/5 dark:border-white/10 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden text-center">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-indigo-500/10 to-transparent"></div>

                        <span className="material-symbols-outlined text-6xl text-indigo-500 mb-6 bg-indigo-50 p-4 rounded-full dark:bg-indigo-900/20">lightbulb</span>

                        <h2 className="text-3xl font-black mb-4 leading-tight">{activity.title}</h2>
                        <p className="text-lg opacity-80 leading-relaxed dark:text-gray-300">{activity.description}</p>

                        <div className="mt-8 flex gap-2 justify-center">
                            <span className="bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full text-xs font-bold">{duration}</span>
                            <span className="bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full text-xs font-bold">{energy}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setActivity(null)}
                        className="mt-8 text-sm font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                        Try Another
                    </button>
                </div>
            )}
        </div>
    );
};

export default MysteryJar;
