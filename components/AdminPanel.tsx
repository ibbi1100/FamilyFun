import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { refillGameContent } from '../services/aiService';

interface AdminPanelProps {
    onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRefill = async () => {
        setLoading(true);
        setStatus('Asking AI to write fresh content... (This takes ~10s)');
        const result = await refillGameContent(5); // Start small
        setStatus(result);
        setLoading(false);
    };

    const handleResetScores = async () => {
        if (!confirm('Are you SURE? This will wipe everyone XP to 0!')) return;
        setLoading(true);
        setStatus('Wiping scores...');

        // In a real app, use an RPC. Here we do client-side loop (inefficient but works for 4 users)
        const { error } = await supabase.from('profiles').update({ xp: 0, level: 1, streak: 0 }).neq('id', '000000'); // update all

        if (error) setStatus('Error resetting scores: ' + error.message);
        else setStatus('All scores reset to 0!');
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 border-2 border-red-500 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-red-500 uppercase tracking-widest">⚠️ Admin Control</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
                        <span className="material-symbols-outlined text-black">close</span>
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-xl border border-dashed border-gray-300">
                        <h3 className="font-bold mb-2">Content Warehouse</h3>
                        <p className="text-xs opacity-70 mb-4">Refill the database with fresh AI jokes, dares, and challenges.</p>
                        <button
                            onClick={handleRefill}
                            disabled={loading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">inventory_2</span>
                            {loading ? 'Working...' : 'Refill Content (AI)'}
                        </button>
                    </div>

                    <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30">
                        <h3 className="font-bold text-purple-600 mb-2">System Diagnostics</h3>
                        <p className="text-xs opacity-70 mb-4">Verify that the Groq AI service is reachable.</p>
                        <button
                            onClick={async () => {
                                setLoading(true);
                                setStatus('Ping Groq API...');
                                try {
                                    // Direct import here to avoid circular dependencies if any, or just use the lib function
                                    const { getGroqCompletion } = await import('../lib/groq');
                                    const res = await getGroqCompletion('Say "OK"', 10);
                                    setStatus('✅ Success! AI responded: ' + res);
                                } catch (e: any) {
                                    setStatus('❌ Error: ' + e.message);
                                }
                                setLoading(false);
                            }}
                            disabled={loading}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">network_check</span>
                            Test AI Connection
                        </button>
                    </div>

                    <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                        <h3 className="font-bold text-red-500 mb-2">Danger Zone</h3>
                        <p className="text-xs opacity-70 mb-4">Reset everyone's progress. Cannot be undone.</p>
                        <button
                            onClick={handleResetScores}
                            disabled={loading}
                            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">delete_forever</span>
                            Reset All XP
                        </button>
                    </div>

                    {status && (
                        <div className="p-3 bg-black text-green-400 font-mono text-xs rounded-lg mt-4 break-words">
                            {'>'} {status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
