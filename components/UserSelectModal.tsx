import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, UserProfile } from '../types';

interface UserSelectModalProps {
    currentUser: User;
    onSelect: (user: UserProfile) => void;
    onClose: () => void;
}

const UserSelectModal: React.FC<UserSelectModalProps> = ({ currentUser, onSelect, onClose }) => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            // Fetch all profiles except current user
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .neq('id', currentUser.id);

            if (data) {
                setUsers(data as any);
            }
            setLoading(false);
        };
        fetchUsers();
    }, [currentUser.id]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-surface-light dark:bg-surface-dark w-full max-w-sm rounded-[2rem] p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black uppercase tracking-tight">Pick Opponent</h3>
                    <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8 opacity-50">Loading fighters...</div>
                ) : (
                    <div className="grid gap-3">
                        {users.map(u => (
                            <button
                                key={u.name} // Ideally use ID, but type might need update
                                onClick={() => onSelect(u)}
                                className="flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-white/5 border-2 border-transparent hover:border-primary hover:scale-[1.02] transition-all group shadow-sm"
                            >
                                <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700" />
                                <div className="text-left flex-1">
                                    <p className="font-black text-lg leading-none">{u.name}</p>
                                    <p className="text-xs uppercase font-bold text-gray-400">Level {u.level}</p>
                                </div>
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary">swords</span>
                            </button>
                        ))}
                        {users.length === 0 && (
                            <p className="text-center text-gray-500 py-4">No other players found yet!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSelectModal;
