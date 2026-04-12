import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Trophy, Gift, Star, Award, Coffee, Shirt, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Rewards = () => {
    const { user, refreshUser } = useAuth();
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const response = await axios.get(`${API_URL}/rewards`);
                setRewards(response.data);
                await refreshUser();
                setLoading(false);
            } catch (err) {
                console.error('Error fetching rewards:', err);
                setLoading(false);
            }
        };

        fetchRewards();
    }, [API_URL]);

    const handleRedeem = async (rewardId) => {
        try {
            const response = await axios.post(`${API_URL}/rewards/redeem`, { rewardId });
            
            setMessage({ type: 'success', text: response.data.message });
            await refreshUser();
            
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.message || 'Failed to redeem reward' 
            });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <header className="relative bg-gradient-to-r from-primary-600 to-secondary-500 rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Trophy size={200} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-white text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Your Rewards Hub</h1>
                        <p className="text-primary-100 text-lg md:text-xl font-medium max-w-md">
                            Exchange your earned points for exclusive SkillSwap merchandise and digital perks.
                        </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 text-center min-w-[200px]">
                        <span className="block text-primary-100 text-sm font-bold uppercase tracking-widest mb-1">Total Points</span>
                        <div className="flex items-center justify-center gap-3">
                            <Star className="text-yellow-400 fill-yellow-400 w-8 h-8" />
                            <span className="text-5xl font-black text-white">{user?.points || 0}</span>
                        </div>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {message && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`p-4 rounded-xl flex items-center gap-3 shadow-sm ${
                            message.type === 'success' 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="font-medium">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {rewards.map((reward) => (
                    <motion.div 
                        key={reward.id}
                        whileHover={{ y: -5 }}
                        className="glass-card overflow-hidden flex flex-col group h-full"
                    >
                        <div className="p-8 flex justify-center items-center bg-slate-50 group-hover:bg-slate-100 transition-colors relative h-48">
                            <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                                {reward.icon === '👕' && <Shirt className="w-20 h-20 text-slate-400" />}
                                {reward.icon === '☕' && <Coffee className="w-20 h-20 text-slate-400" />}
                                {reward.icon === '👑' && <Award className="w-20 h-20 text-slate-400" />}
                                {reward.icon === '✨' && <Star className="w-20 h-20 text-slate-400" />}
                                {!['👕', '☕', '👑', '✨'].includes(reward.icon) && reward.icon}
                            </span>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{reward.name}</h3>
                            <div className="flex items-center gap-1.5 text-primary-600 font-bold mb-6">
                                <Star size={16} className="fill-current" />
                                <span>{reward.points} Points</span>
                            </div>
                            <div className="mt-auto">
                                <button 
                                    onClick={() => handleRedeem(reward.id)}
                                    disabled={(user?.points || 0) < reward.points}
                                    className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                                        (user?.points || 0) >= reward.points 
                                            ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg' 
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    {(user?.points || 0) >= reward.points ? 'Redeem Now' : 'Not Enough Points'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <section className="glass-card p-8 bg-slate-50/50">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <Award className="text-primary-600" /> How to Earn Points
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">+10</div>
                        <h4 className="font-bold text-lg mb-2 text-slate-800">New Skills</h4>
                        <p className="text-slate-500 text-sm">Add a new skill to teach or learn to your profile.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">+5</div>
                        <h4 className="font-bold text-lg mb-2 text-slate-800">Successful Match</h4>
                        <p className="text-slate-500 text-sm">Get matched with someone for a knowledge exchange.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">+20</div>
                        <h4 className="font-bold text-lg mb-2 text-slate-800">Start Conversation</h4>
                        <p className="text-slate-500 text-sm">Be the first to say hi after a successful match.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Rewards;
