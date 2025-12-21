import React, { useState, useEffect } from 'react';
import { generateEmojiCharades } from '../services/aiService';
import { User, UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import UserSelectModal from './UserSelectModal';

interface GameState {
    phase: 'generating' | 'guessing' | 'reviewing' | 'completed';
    secret_phrase?: string;
    emojis?: string;
    current_guess?: string;
    turn_count: number;
}

const EmojiCharades: React.FC<{ onBack: () => void; onWin: (amount: number) => void; currentUser: User }> = ({ onBack, onWin, currentUser }) => {
    const [view, setView] = useState<'lobby' | 'game'>('lobby');
    const [opponent, setOpponent] = useState<UserProfile | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Game State
    const [gameState, setGameState] = useState<GameState>({ phase: 'generating', turn_count: 0 });
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [inputGuess, setInputGuess] = useState('');

    // Lobby: Pick Opponent
    const handleSelectOpponent = async (user: UserProfile) => {
        setLoading(true);
        setOpponent(user);

        // Check for existing active session or create new
        const { data: existing } = await supabase
            .from('game_sessions')
            .select('*')
            .eq('game_type', 'emoji_charades')
            .or(`player_1_id.eq.${currentUser.id},player_2_id.eq.${currentUser.id}`)
            .or(`player_1_id.eq.${user.id},player_2_id.eq.${user.id}`)
            .order('updated_at', { ascending: false })
            .limit(1);

        if (existing && existing.length > 0) {
            // Resume/Join
            const session = existing[0];
            setSessionId(session.id);
            syncState(session);
        } else {
            // Create New
            const { data: newSession, error } = await supabase
                .from('game_sessions')
                .insert([{
                    game_type: 'emoji_charades',
                    player_1_id: currentUser.id,
                    player_2_id: user.id,
                    turn_player_id: currentUser.id, // Current user starts
                    state: { phase: 'generating', turn_count: 0 }
                }])
                .select()
                .single();

            if (newSession) {
                setSessionId(newSession.id);
                syncState(newSession);
            } else if (error) {
                console.error("Session Create Error:", error);
            }
        }
        setLoading(false);
        setView('game');
    };

    const syncState = (session: any) => {
        setGameState(session.state);
        setIsMyTurn(session.turn_player_id === currentUser.id);

        // Identify opponent object correctly
        if (!opponent) {
            // In a real app we'd fetch the profile, for now assuming the passed one or waiting for refetch
            // This simplification assumes we just joined via lobby. 
            // If resuming, we might need to fetch opponent name.
        }
    };

    // Real-time Subscription
    useEffect(() => {
        if (!sessionId) return;

        const channel = supabase
            .channel(`game:${sessionId}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `id=eq.${sessionId}` }, (payload) => {
                const session = payload.new;
                setGameState(session.state);
                setIsMyTurn(session.turn_player_id === currentUser.id);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [sessionId, currentUser.id]);

    // Actions
    const generateClue = async () => {
        setLoading(true);
        const result = await generateEmojiCharades(); // {title, emojis}

        const newState = {
            ...gameState,
            secret_phrase: result.title,
            emojis: result.emojis,
            phase: 'guessing'
        };

        // Update DB: Switch turn to opponent so they can guess
        await supabase.from('game_sessions').update({
            state: newState,
            turn_player_id: opponent?.id // Switch turn
        }).eq('id', sessionId);

        setLoading(false);
    };

    const submitGuess = async () => {
        if (!inputGuess.trim()) return;

        const newState = {
            ...gameState,
            current_guess: inputGuess,
            phase: 'reviewing'
        };

        // Update DB: Switch turn back to Giver (original turn player) to verify
        // The original giver is NOT currentUser right now (since we are guessing), so we switch back to opponent
        await supabase.from('game_sessions').update({
            state: newState,
            turn_player_id: opponent?.id // Switch back to giver
        }).eq('id', sessionId);

        setInputGuess('');
    };

    const verifyGuess = async (correct: boolean) => {
        if (correct) {
            // Reward Opponent (The Guesser)
            // Note: In secure app, this should be server-side. Client-side implies trust.
            // We need to call onWin but context is tricky: "I" am verifying "Them".
            // We can't call onWin for them locally. We must update DB/Score remotely?
            // OR: We just utilize the 'handleGameReward' callback if I was determining my OWN reward, 
            // but here I verify THEIR reward.
            // Solution: Update their balance directly via Supabase for v4 MVP.
            if (opponent) {
                const { data } = await supabase.from('profiles').select('balance').eq('id', opponent.id).single();
                const newBal = (data?.balance || 0) + 1.00;
                await supabase.from('profiles').update({ balance: newBal }).eq('id', opponent.id);
            }
        }

        // Reset for next round
        // Swap Roles: The previous Guesser becomes the Giver.
        // Current state: I am Giver (Reviewing). Opponent was Guesser.
        // Next Turn: Opponent (who guessed) becomes User (who generates).
        const newState = {
            phase: 'generating',
            secret_phrase: undefined,
            emojis: undefined,
            current_guess: undefined,
            turn_count: gameState.turn_count + 1
        };

        await supabase.from('game_sessions').update({
            state: newState,
            turn_player_id: opponent?.id // Pass control to them to Generate
        }).eq('id', sessionId);
    };

    const passTurn = async () => {
        // Just reset round without reward, swap turns
        const newState = {
            phase: 'generating',
            secret_phrase: undefined,
            emojis: undefined,
            current_guess: undefined,
            turn_count: gameState.turn_count + 1
        };

        await supabase.from('game_sessions').update({
            state: newState,
            turn_player_id: opponent?.id
        }).eq('id', sessionId);
    };

    // Render Logic
    if (view === 'lobby') {
        return (
            <div className="flex flex-col h-full bg-indigo-900 text-white p-6 justify-center">
                <button onClick={onBack} className="absolute top-6 left-6 z-10 p-2 bg-white/10 rounded-full">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-black mb-2">Emoji Charades 🎭</h2>
                    <p className="opacity-70">2-Player • Turn-Based • Real Rewards</p>
                </div>
                <UserSelectModal
                    currentUser={currentUser}
                    onClose={onBack}
                    onSelect={handleSelectOpponent}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-indigo-900 text-white p-6 overflow-hidden relative">
            <header className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="p-2 bg-white/10 rounded-full">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full">
                    <img src={currentUser.avatar} className="w-6 h-6 rounded-full" />
                    <span className="text-xs font-bold opacity-50">VS</span>
                    <img src={opponent?.avatar || ''} className="w-6 h-6 rounded-full" />
                </div>
                <div className="w-10"></div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">

                {/* STATUS HEADER */}
                <div className="mb-8">
                    {gameState.phase === 'generating' && isMyTurn && (
                        <h2 className="text-2xl font-black text-yellow-300 animate-pulse">Your Turn to Create! 🎨</h2>
                    )}
                    {gameState.phase === 'generating' && !isMyTurn && (
                        <h2 className="text-2xl font-black opacity-50">Waiting for Clue... ⏳</h2>
                    )}

                    {gameState.phase === 'guessing' && isMyTurn && (
                        <h2 className="text-2xl font-black text-green-300 animate-bounce">Your Turn to Guess! 🤔</h2>
                    )}
                    {gameState.phase === 'guessing' && !isMyTurn && (
                        <h2 className="text-2xl font-black opacity-50">They are guessing... 💭</h2>
                    )}

                    {gameState.phase === 'reviewing' && isMyTurn && (
                        <h2 className="text-2xl font-black text-orange-300">Review their Guess! 👀</h2>
                    )}
                    {gameState.phase === 'reviewing' && !isMyTurn && (
                        <h2 className="text-2xl font-black opacity-50">Waiting for verdict... 🤞</h2>
                    )}
                </div>

                {/* GAME BOARD */}
                <div className="w-full bg-white/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/20 shadow-2xl min-h-[300px] flex flex-col items-center justify-center">

                    {/* 1. Generator View */}
                    {gameState.phase === 'generating' && isMyTurn && (
                        <div className="space-y-6 w-full">
                            <span className="text-6xl">🎭</span>
                            <p className="font-bold">Generate a secret phrase and emoji sequence for {opponent?.name || 'Partner'}.</p>
                            <button
                                onClick={generateClue}
                                disabled={loading}
                                className="w-full py-4 bg-white text-indigo-900 rounded-xl font-black text-xl shadow-lg active:scale-95 transition-all"
                            >
                                {loading ? 'Cooking...' : 'Generate Magic Clue ✨'}
                            </button>
                        </div>
                    )}

                    {/* 2. Guessing View */}
                    {gameState.phase === 'guessing' && (
                        <div className="space-y-8 w-full">
                            <div className="text-6xl animate-bounce">{gameState.emojis}</div>

                            {isMyTurn ? (
                                <div className="w-full">
                                    <input
                                        type="text"
                                        value={inputGuess}
                                        onChange={(e) => setInputGuess(e.target.value)}
                                        placeholder="Type your guess..."
                                        className="w-full bg-black/20 border-2 border-white/20 rounded-xl px-4 py-3 text-center text-white placeholder-white/30 font-bold mb-4 focus:outline-none focus:border-white"
                                    />
                                    <button
                                        onClick={submitGuess}
                                        className="w-full py-3 bg-green-500 text-white rounded-xl font-black shadow-lg active:scale-95 transition-all"
                                    >
                                        Submit Guess 🚀
                                    </button>
                                    <button onClick={passTurn} className="text-xs text-white/40 mt-4 font-bold uppercase hover:text-white">Give Up (Pass)</button>
                                </div>
                            ) : (
                                <div className="w-full flex justify-center">
                                    <div className="animate-spin text-3xl opacity-50">⏳</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. Review View */}
                    {gameState.phase === 'reviewing' && (
                        <div className="space-y-6 w-full">
                            <div className="bg-black/20 p-4 rounded-2xl w-full">
                                <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-1">Secret Phrase</p>
                                <p className="text-xl font-bold text-yellow-300">{gameState.secret_phrase}</p>
                            </div>

                            <div className="text-4xl">{gameState.emojis}</div>

                            <div className="bg-white/20 p-6 rounded-2xl w-full border-2 border-white/30">
                                <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-1">They Guessed</p>
                                <p className="text-2xl font-black">{gameState.current_guess}</p>
                            </div>

                            {isMyTurn ? (
                                <div className="grid grid-cols-2 gap-4 w-full pt-4">
                                    <button
                                        onClick={() => verifyGuess(false)}
                                        className="py-4 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white rounded-xl font-black transition-all"
                                    >
                                        Wrong ❌
                                    </button>
                                    <button
                                        onClick={() => verifyGuess(true)}
                                        className="py-4 bg-green-500 text-white rounded-xl font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Correct! ✅
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm font-bold opacity-50 animate-pulse">Checking answer...</p>
                            )}
                        </div>
                    )}

                    {/* Waiting States (General) */}
                    {gameState.phase === 'generating' && !isMyTurn && (
                        <div className="space-y-4">
                            <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-white animate-spin mx-auto"></div>
                            <p className="font-bold opacity-60">Waiting for {opponent?.name} to create a clue...</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default EmojiCharades;
