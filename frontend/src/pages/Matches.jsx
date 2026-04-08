import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Check, X, User } from 'lucide-react';

const Matches = () => {
    const { user } = useAuth();
    const [recommendations, setRecommendations] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recsRes, matchesRes] = await Promise.all([
                    axios.get('/matches/recommendations'),
                    axios.get('/matches')
                ]);
                setRecommendations(recsRes.data);
                setMatches(matchesRes.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const requestMatch = async (targetUserId, skillOffered, skillRequested) => {
        try {
            await axios.post(`/matches/request/${targetUserId}`, { skillOffered, skillRequested });
            // Refresh matches
            const matchesRes = await axios.get('/matches');
            setMatches(matchesRes.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Error requesting match');
        }
    };

    const updateMatchStatus = async (matchId, status) => {
        try {
            await axios.put(`/matches/${matchId}`, { status });
            // Refresh matches
            const matchesRes = await axios.get('/matches');
            setMatches(matchesRes.data);
        } catch (err) {
            alert('Error updating match status');
        }
    };

    const pendingRequests = matches.filter(m => m.user2._id === user._id && m.status === 'pending');
    const myRequests = matches.filter(m => m.user1._id === user._id && m.status === 'pending');
    const activeMatches = matches.filter(m => m.status === 'accepted');

    return (
        <div className="space-y-12 animate-[fadeIn_0.5s_ease-out]">
            <header>
                <h1 className="text-3xl font-bold text-slate-800">Smart Matches & Requests</h1>
                <p className="text-slate-500 mt-1">People looking for what you teach, or teaching what you want.</p>
            </header>

            {/* Actionable Requests */}
            {(pendingRequests.length > 0 || myRequests.length > 0) && (
                <section className="grid md:grid-cols-2 gap-8">
                    {pendingRequests.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Requests For You</h2>
                            <div className="space-y-4">
                                {pendingRequests.map(match => (
                                    <div key={match._id} className="glass-card p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img src={match.user1.profilePic} alt={match.user1.name} className="w-12 h-12 rounded-full object-cover" />
                                            <div>
                                                <p className="font-bold text-slate-800">{match.user1.name}</p>
                                                <p className="text-sm text-slate-500">Wants to learn {match.skillRequested} from you</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => updateMatchStatus(match._id, 'accepted')} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200">
                                                <Check className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => updateMatchStatus(match._id, 'rejected')} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {myRequests.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Your Pending Requests</h2>
                            <div className="space-y-4">
                                {myRequests.map(match => (
                                    <div key={match._id} className="glass-card p-4 flex items-center justify-between opacity-70">
                                        <div className="flex items-center gap-3">
                                            <img src={match.user2.profilePic} alt={match.user2.name} className="w-12 h-12 rounded-full object-cover" />
                                            <div>
                                                <p className="font-bold text-slate-800">{match.user2.name}</p>
                                                <p className="text-sm text-slate-500">Waiting for response...</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Active Matches */}
            {activeMatches.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Active Exchanges</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeMatches.map(match => {
                            const otherUser = match.user1._id === user._id ? match.user2 : match.user1;
                            return (
                                <div key={match._id} className="glass-card p-6 flex items-center gap-4 border-l-4 border-emerald-500">
                                    <img src={otherUser.profilePic} alt={otherUser.name} className="w-16 h-16 rounded-full object-cover" />
                                    <div>
                                        <h3 className="font-bold text-slate-800">{otherUser.name}</h3>
                                        <p className="text-sm text-slate-500">Exchanging {match.skillOffered && match.skillRequested ? `${match.skillOffered} & ${match.skillRequested}` : 'Skills'}</p>
                                        <a href="/chat" className="text-primary-600 text-sm font-medium mt-1 inline-block hover:underline">Message</a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Recommendations */}
            <section>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Recommended For You</h2>
                {loading ? (
                    <p className="text-slate-500">Finding best matches...</p>
                ) : recommendations.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {recommendations.map(rec => (
                            <div key={rec._id} className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                <img src={rec.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} className="w-24 h-24 rounded-full object-cover shadow-md" alt={rec.name} />
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-800">{rec.name}</h3>
                                    <p className="text-slate-500 text-sm mb-3">{rec.college}</p>

                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                                        {rec.teachSkills.map(s => <span key={s} className="bg-primary-50 text-primary-700 px-2 py-0.5 text-xs rounded border border-primary-200">{s}</span>)}
                                    </div>

                                    <button
                                        onClick={() => {
    const mySkill = user?.teachSkills?.[0];
    const theirSkill = rec?.teachSkills?.[0];

    if (!user) {
        alert("User not loaded yet");
        return;
    }

    if (!mySkill) {
        alert("Please add your skills in profile first");
        return;
    }

    if (!theirSkill) {
        alert("Selected user has no skills");
        return;
    }

    requestMatch(rec._id, mySkill, theirSkill);
}}
                                        className="btn-primary py-2 px-4 text-sm w-full md:w-auto"
                                    >
                                        Request Match
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/40 p-8 rounded-2xl text-center border border-white/50">
                        <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">No new recommendations available.</p>
                        <p className="text-sm text-slate-400 mt-1">Make sure you have added skills you want to learn and teach in your profile.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Matches;
