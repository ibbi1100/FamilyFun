import React from 'react';
import { User, UserProfile } from '../types';

interface UserSelectModalProps {
    currentUser: User;
    users: UserProfile[];
    onSelect: (user: UserProfile) => void;
    onClose: () => void;
    actionIcon?: string;
    title?: string;
}

const UserSelectModal: React.FC<UserSelectModalProps> = ({ currentUser, users, onSelect, onClose, actionIcon = 'swords', title = 'Pick Opponent' }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-surface-light dark:bg-surface-dark w-full max-w-sm rounded-[2rem] p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                    <span className="material-symbols-outlined text-gray-400">close</span>
                </button>

                <h3 className="text-xl font-black uppercase tracking-tight mb-6 text-center">{title}</h3>

                <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                    {users.map(u => (
                        <button
                            key={u.id}
                            onClick={() => onSelect(u)}
                            className="flex items-center gap-4 p-3 rounded-full bg-white dark:bg-white/10 border-2 border-transparent hover:border-primary hover:scale-[1.02] transition-all group shadow-sm w-full"
                        >
                            <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full border-2 border-gray-100 dark:border-gray-700 bg-gray-100 object-cover" />
                            <div className="text-left flex-1 min-w-0">
                                <p className="font-black text-lg leading-none truncate text-gray-800 dark:text-gray-100">{u.name}</p>
                                <p className="text-[10px] uppercase font-bold text-gray-400">Level {u.level}</p>
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-white/5 group-hover:bg-primary/10 transition-colors">
                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">{actionIcon}</span>
                            </div>
                        </button>
                    ))}
                    {users.length === 0 && (
                        <div className="text-center py-8 opacity-50 flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-4xl">person_off</span>
                            <p>No opponents found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserSelectModal;
