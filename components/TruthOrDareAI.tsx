import React, { useState } from 'react';
import { generateTruthOrDare } from '../services/aiService';
import { Role } from '../types';

const TruthOrDareAI: React.FC<{ onBack: () => void; onWin: (amount: number) => void }> = ({ onBack, onWin }) => {
    const [data, setData] = useState<{ type: 'Truth' | 'Dare'; content: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role>('Dad');

    const spin = async () => {
        setLoading(true);
        setData(null);
        const result = await generateTruthOrDare(selectedRole);
        setLoading(false);
        setData(result);
    };

    const handleComplete = () => {
        alert("Brave Soul! +$2.00");
        onWin(2.00);
        setData(null);
    };

    return (
        <div className="flex flex-col h-full bg-red-900 text-white p-6 overflow-hidden relative">
            <button onClick={onBack} className="absolute top-6 left-6 z-10 p-2 bg-white/10 rounded-full">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>

            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
                <h2 className="text-4xl font-black mb-8 tracking-tighter text-red-500 bg-white px-2 transform -skew-x-12">TRUTH OR DARE</h2>

                {/* Role Selector */}
                <div className="flex gap-2 mb-8 bg-black/20 p-2 rounded-2xl">
                    {(['Dad', 'Mum', 'Son', 'Daughter'] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => setSelectedRole(r)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${selectedRole === r ? 'bg-red-600 text-white shadow-lg' : 'text-white/40 hover:bg-white/5'}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                {!data && !loading && (
                    <button
                        onClick={spin}
                        className="w-48 h-48 rounded-full border-8 border-white/10 flex items-center justify-center bg-red-600 hover:bg-red-500 active:scale-95 transition-all shadow-[0_0_50px_rgba(220,38,38,0.4)] group"
                    >
                        <span className="text-2xl font-black uppercase tracking-widest group-hover:rotate-180 transition-transform duration-700">SPIN 🔥</span>
                    </button>
                )}

                {loading && (
                    <div className="w-48 h-48 rounded-full border-8 border-t-red-500 border-white/10 animate-spin"></div>
                )}

                {data && !loading && (
                    <div className={`w-full p-8 rounded-[2.5rem] animate-in zoom-in duration-300 border-4 ${data.type === 'Truth' ? 'bg-blue-600 border-blue-400' : 'bg-red-600 border-red-400'}`}>
                        <div className="text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-2">{data.type} ($2.00)</div>
                        <h3 className="text-2xl font-bold leading-snug mb-8">"{data.content}"</h3>

                        <div className="flex gap-4 flex-col">
                            <button
                                onClick={handleComplete}
                                className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-wider hover:bg-gray-100 transition-all shadow-lg"
                            >
                                I Did It! 💀
                            </button>
                            <button
                                onClick={() => setData(null)}
                                className="w-full py-3 bg-black/20 text-white rounded-xl font-bold text-sm hover:bg-black/30 transition-colors"
                            >
                                Skip (Coward)
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TruthOrDareAI;
