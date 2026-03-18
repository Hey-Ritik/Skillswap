import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpen, Search, User, MessageSquare } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <header className="mb-10 flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Welcome to SkillSwap, {user.name.split(' ')[0]}!</h1>
                    <p className="text-slate-500 text-lg">Your knowledge exchange hub. What will you learn today?</p>
                </div>
                <button 
                    onClick={async () => {
                        try {
                            await useAuth().seedDemoData();
                            alert("Demo data seeded! Check Marketplace and Matches to see the new active users.");
                            window.location.reload();
                        } catch (e) {
                            alert("Failed to seed demo data. Maybe you already have some?");
                        }
                    }}
                    className="btn-secondary flex items-center gap-2"
                >
                    <User className="w-4 h-4" /> Load Demo Data
                </button>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/marketplace" className="glass-card p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform group">
                    <div className="bg-primary-100 p-4 rounded-xl text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        <Search className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Marketplace</h3>
                        <p className="text-sm text-slate-500 mt-1">Browse all skills</p>
                    </div>
                </Link>

                <Link to="/matches" className="glass-card p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform group">
                    <div className="bg-secondary-100 p-4 rounded-xl text-secondary-600 group-hover:bg-secondary-600 group-hover:text-white transition-colors">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Smart Matches</h3>
                        <p className="text-sm text-slate-500 mt-1">See who needs you</p>
                    </div>
                </Link>

                <Link to="/chat" className="glass-card p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform group">
                    <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Messages</h3>
                        <p className="text-sm text-slate-500 mt-1">Coordinate sessions</p>
                    </div>
                </Link>

                <Link to="/profile" className="glass-card p-6 flex items-start gap-4 hover:-translate-y-1 transition-transform group">
                    <div className="bg-orange-100 p-4 rounded-xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">My Profile</h3>
                        <p className="text-sm text-slate-500 mt-1">Update your skills</p>
                    </div>
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="glass-card p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Skills to Teach</h2>
                    {user.teachSkills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {user.teachSkills.map(skill => (
                                <span key={skill} className="bg-slate-100 text-slate-700 px-3 py-1 text-sm font-medium rounded-full">{skill}</span>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-500 mb-4">You haven't added any skills to teach yet.</p>
                            <Link to="/profile" className="btn-secondary text-sm">Add Skills</Link>
                        </div>
                    )}
                </div>

                <div className="glass-card p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Skills You Want</h2>
                    {user.learnSkills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {user.learnSkills.map(skill => (
                                <span key={skill} className="bg-primary-50 text-primary-700 border border-primary-200 px-3 py-1 text-sm font-medium rounded-full">{skill}</span>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-500 mb-4">What do you want to learn next?</p>
                            <Link to="/profile" className="btn-primary text-sm px-4 py-2">Find Skills</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
