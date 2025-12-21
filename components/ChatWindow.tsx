import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { User, Message } from '../types';
import { SON_AVATAR, DAD_AVATAR, MUM_AVATAR, DAUGHTER_AVATAR } from '../constants';

interface ChatWindowProps {
    currentUser: User;
    opponent: { id: string; name: string; };
    onClose: () => void;
    onRead?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, opponent, onClose, onRead }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [onlineUsers, setOnlineUsers] = useState<Record<string, any>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Realtime Chat & Presence
    useEffect(() => {
        // 1. Fetch recent messages (Between Me AND Them)
        const fetchMessages = async () => {
            // Logic to fetch conversation specifically with this opponent would be better
            // But for current simple Global Family Chat (or broadcast), we might just show all?
            // v2.0 requirement said "Chat Interface".
            // If we want 1:1, we filter by (sender=me & receiver=them) OR (sender=them & receiver=me).
            // Given the previous code just grabbed *all* messages limit 50 (ignoring filter), let's stick to simple
            // broadcast or try to make it 1:1 if possible. 
            // The previous code: .select('*').order... limit 50. It didn't filter by participants! 
            // So it was a global chat room.
            // To fix the "dad-id" UUID error, we just need to ensure we insert VALID UUIDs.
            // We will continue to use it as a "Family Room" or "1:1" depending on preference.
            // Let's implement 1:1 filtering for a cleaner experience, OR just fix the insert.
            // Fixing insert is safest first step.

            const { data } = await supabase
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${opponent.id}),and(sender_id.eq.${opponent.id},receiver_id.eq.${currentUser.id})`)
                .order('created_at', { ascending: true })
                .limit(50);
            if (data) setMessages(data as any);
        };
        if (opponent.id !== 'placeholder') fetchMessages();

        // 2. Subscribe
        const msgChannel = supabase.channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
                const newMsg = payload.new as any;
                // Only add if it belongs to this conversation
                if (
                    (newMsg.sender_id === currentUser.id && newMsg.receiver_id === opponent.id) ||
                    (newMsg.sender_id === opponent.id && newMsg.receiver_id === currentUser.id)
                ) {
                    setMessages(prev => [...prev, newMsg]);
                }
            })
            .subscribe();

        // ... Presence logic stays same ...
        const presenceChannel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: currentUser.id,
                },
            },
        });

        presenceChannel
            .on('presence', { event: 'sync' }, () => {
                const newState = presenceChannel.presenceState();
                setOnlineUsers(newState);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await presenceChannel.track({
                        user_id: currentUser.id,
                        name: currentUser.name,
                        online_at: new Date().toISOString(),
                    });
                }
            });

        // 4. Mark messages as read
        const markRead = async () => {
            if (opponent.id === 'placeholder') return;
            await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('receiver_id', currentUser.id)
                .eq('sender_id', opponent.id) // Mark messages FROM them as read
                .eq('is_read', false);

            if (onRead) onRead();
        };
        markRead();

        return () => {
            supabase.removeChannel(msgChannel);
            supabase.removeChannel(presenceChannel);
        };
    }, [currentUser.id, opponent.id]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        if (opponent.id === 'placeholder') {
            alert("No family member selected to chat with!");
            return;
        }

        const { error } = await supabase.from('messages').insert([{
            sender_id: currentUser.id,
            receiver_id: opponent.id,
            content: newMessage,
            is_read: false
        }]);

        if (error) {
            console.error("Chat Send Error:", error);
        } else {
            setNewMessage('');
        }
    };

    const isOnline = (role: string) => {
        // This is simple mock logic. Real logic needs to check inside 'onlineUsers' object values
        // Iterate keys and check if data.role matches or data.user_id matches
        return Object.values(onlineUsers).some((presences: any) =>
            presences.some((p: any) => p.user_id !== currentUser.id) // Just showing if ANYONE else is online for now
        );
        // Ideally we map user IDs to presence keys
    };

    return (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex justify-between items-center text-black">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined font-black">forum</span>
                    <h3 className="font-black text-sm uppercase tracking-wider">Family Chat</h3>
                </div>
                <button onClick={onClose} className="hover:bg-black/10 p-1 rounded-full">
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-black/50">
                {messages.length === 0 && (
                    <div className="text-center opacity-50 text-xs mt-10">
                        <p>No messages yet.</p>
                        <p>Say hello! 👋</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} `}>
                            <div className={`max - w - [80 %] rounded - 2xl px - 3 py - 2 text - sm ${isMe
                                ? 'bg-primary text-black rounded-tr-none'
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none'
                                } `}>
                                <p>{msg.content}</p>
                                <p className="text-[9px] opacity-50 text-right mt-1">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Online Status Bar */}
            <div className="px-4 py-1 bg-gray-100 dark:bg-gray-800 text-[10px] flex items-center gap-2 border-t border-gray-200 dark:border-gray-700">
                <div className={`w - 2 h - 2 rounded - full ${Object.keys(onlineUsers).length > 1 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} `}></div>
                <span>{Object.keys(onlineUsers).length > 1 ? 'Family Online' : 'Waiting for others...'}</span>
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-sm font-bold">send</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;
