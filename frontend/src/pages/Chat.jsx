import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send } from 'lucide-react';

const Chat = () => {
    const { user } = useAuth();
    const [recentUsers, setRecentUsers] = useState([]);
    const [activeUser, setActiveUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await axios.get('/messages/recent');
                setRecentUsers(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRecent();
    }, []);

    useEffect(() => {
        if (activeUser) {
            const fetchMessages = async () => {
                try {
                    const res = await axios.get(`/messages/conversation/${activeUser._id}`);
                    setMessages(res.data);
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                } catch (err) {
                    console.error(err);
                }
            };
            fetchMessages();
            // Optional: Polling to get new messages every 5s
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [activeUser]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !activeUser) return;

        try {
            const res = await axios.post(`/messages/send/${activeUser._id}`, { content: input });
            setMessages([...messages, res.data]);
            setInput('');
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-[80vh] gap-6 animate-[fadeIn_0.5s_ease-out]">
            {/* Sidebar */}
            <div className="glass-card md:w-1/3 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/40 bg-white/20">
                    <h2 className="text-xl font-bold text-slate-800">Conversations</h2>
                </div>
                <div className="overflow-y-auto flex-1 p-2">
                    {recentUsers.length > 0 ? (
                        recentUsers.map(u => (
                            <div
                                key={u._id}
                                onClick={() => setActiveUser(u)}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${activeUser?._id === u._id ? 'bg-primary-100' : 'hover:bg-white/40'}`}
                            >
                                <img src={u.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} className="w-12 h-12 rounded-full object-cover" alt={u.name} />
                                <div>
                                    <h4 className="font-bold text-slate-800">{u.name}</h4>
                                    <p className="text-xs text-slate-500 truncate w-32">{u.college}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-slate-500">No active conversations yet. Match with someone to start chatting!</div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="glass-card flex-1 flex flex-col overflow-hidden">
                {activeUser ? (
                    <>
                        <div className="p-4 border-b border-white/40 bg-white/20 flex items-center gap-3">
                            <img src={activeUser.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} className="w-10 h-10 rounded-full object-cover" alt="" />
                            <h3 className="font-bold text-slate-800">{activeUser.name}</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
                            {messages.map(msg => {
                                const isMe = msg.sender === user._id;
                                return (
                                    <div key={msg._id} className={`max-w-[70%] ${isMe ? 'self-end' : 'self-start'}`}>
                                        <div className={`p-3 rounded-2xl ${isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-100'}`}>
                                            {msg.content}
                                        </div>
                                        <div className={`text-[10px] text-slate-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendMessage} className="p-4 bg-white/40 border-t border-white/50 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="glass-input flex-1 py-3"
                            />
                            <button type="submit" className="bg-primary-600 hover:bg-primary-500 text-white p-3 rounded-xl transition-colors shadow-md">
                                <Send className="w-6 h-6" />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center flex-col text-slate-400">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-lg">Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Just added because of icon mismatch
import { MessageSquare } from 'lucide-react';

export default Chat;
