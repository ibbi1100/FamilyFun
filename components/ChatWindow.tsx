import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { User, Message } from '../types';
import { SON_AVATAR, DAD_AVATAR, MUM_AVATAR, DAUGHTER_AVATAR } from '../constants';

interface ChatWindowProps {
    currentUser: User;
    onClose: () => void;
    onRead?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentUser, onClose, onRead }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [onlineUsers, setOnlineUsers] = useState<Record<string, any>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mock users list (In real app, fetch from profiles)
    const allUsers = [
        { id: 'dad-id', name: 'Captain Dad', role: 'Dad', avatar: DAD_AVATAR }, // Replace with real IDs
        { id: 'son-id', name: 'Super Son', role: 'Son', avatar: SON_AVATAR },
        // Add others if needed
    ];

    // Realtime Chat & Presence
    useEffect(() => {
        // 1. Fetch recent messages
        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: true })
                .limit(50);
            if (data) setMessages(data as any);
        };
        fetchMessages();

        // 2. Subscribe to Messages
        const msgChannel = supabase.channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
                setMessages(prev => [...prev, payload.new as any]);
            })
            .subscribe();

        // 3. Subscribe to Presence (Online Status)
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
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                console.log('User joined:', key, newPresences);
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                console.log('User left:', key, leftPresences);
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
            await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('receiver_id', currentUser.id)
                .eq('is_read', false);

            if (onRead) onRead();
        };
        markRead();

        return () => {
            supabase.removeChannel(msgChannel);
            supabase.removeChannel(presenceChannel);
        };
    }, [currentUser.id]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Optimistic UI could go here, but realtime is fast enough usually
        const { error } = await supabase.from('messages').insert([{
            sender_id: currentUser.id,
            receiver_id: currentUser.id === 'dad-id' ? 'son-id' : 'dad-id', // Simple 1:1 fallback for now
            content: newMessage,
            is_read: false
        }]);

        if (!error) setNewMessage('');
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
