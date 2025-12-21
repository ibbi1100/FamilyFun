import React, { useState } from 'react';
import { generateFutureSelfDescription } from '../services/aiService';

const FutureYourself: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [data, setData] = useState<{ title: string; description: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeFuture = async () => {
        if (!imagePreview) return;
        setLoading(true);
        // Simulate "analyzing" time
        await new Promise(r => setTimeout(r, 1500));
        const result = await generateFutureSelfDescription();
        setData(result);
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white p-6 overflow-hidden relative">
            <button onClick={onBack} className="absolute top-6 left-6 z-10 p-2 bg-white/10 rounded-full">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>

            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
                <h2 className="text-3xl font-black mb-2 tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Future Mirror 🔮</h2>
                <p className="text-white/60 mb-8 font-medium">See yourself in 20 years!</p>

                <div className="relative w-64 h-64 bg-white/5 rounded-[2rem] border-2 border-dashed border-white/20 flex items-center justify-center mb-8 overflow-hidden group">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center text-white/40">
                            <span className="material-symbols-outlined text-4xl mb-2">add_a_photo</span>
                            <span className="text-xs font-bold uppercase tracking-widest">Upload Selfie</span>
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>

                {imagePreview && !data && !loading && (
                    <button
                        onClick={analyzeFuture}
                        className="w-full py-4 bg-cyan-500 text-black rounded-xl font-black uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:bg-cyan-400 active:scale-95 transition-all"
                    >
                        Travel to 2045 🚀
                    </button>
                )}

                {loading && (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-2 w-48 bg-cyan-500/50 rounded-full"></div>
                        <div className="h-2 w-32 bg-purple-500/50 rounded-full mx-auto"></div>
                        <p className="text-xs font-mono text-cyan-400 mt-2">ANALYZING TIMELINE...</p>
                    </div>
                )}

                {data && !loading && (
                    <div className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 animate-in zoom-in duration-500">
                        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2">Your Future Career</p>
                        <h3 className="text-2xl font-black text-white mb-4 leading-tight">{data.title}</h3>
                        <p className="text-white/80 font-medium leading-relaxed italic">
                            "{data.description}"
                        </p>
                        <button
                            onClick={() => { setData(null); setImagePreview(null); }}
                            className="mt-6 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                        >
                            Check Another Timeline
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FutureYourself;
