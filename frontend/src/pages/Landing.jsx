import React from 'react';
import { ArrowRight, BookOpen, Search, Users, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col gap-16 py-12 animate-[fadeIn_1s_ease-out]">
            {/* Hero Section */}
            <section className="text-center space-y-8 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary-600 to-secondary-500 tracking-tight leading-tight">
                    Exchange Skills.<br />Elevate Your Future.
                </h1>
                <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                    The ultimate platform for college students to trade knowledge. Teach what you know, learn what you don't. Connect with your peers today.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <button onClick={() => navigate('/register')} className="btn-primary flex items-center gap-2 text-lg px-8">
                        Get Started <ArrowRight className="w-5 h-5" />
                    </button>
                    <button onClick={() => navigate('/login')} className="btn-secondary text-lg px-8">
                        Member Login
                    </button>
                </div>
            </section>

            {/* Stats / Proof */}
            <section className="glass-card p-8 flex flex-col md:flex-row justify-around items-center gap-8 text-center mt-8">
                <div className="space-y-2">
                    <h3 className="text-4xl font-bold text-primary-600">500+</h3>
                    <p className="text-slate-500 font-medium">Students Joined</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-4xl font-bold text-secondary-500">120+</h3>
                    <p className="text-slate-500 font-medium">Skills Available</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-4xl font-bold text-primary-500">2k+</h3>
                    <p className="text-slate-500 font-medium">Matches Made</p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-6 pt-12">
                <div className="glass-card p-6 flex flex-col items-center text-center gap-4 hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 mb-2">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Learn Anything</h3>
                    <p className="text-slate-600">From Python and React to Marketing and Graphic Design, find students willing to teach.</p>
                </div>

                <div className="glass-card p-6 flex flex-col items-center text-center gap-4 hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-secondary-100 flex items-center justify-center text-secondary-600 mb-2">
                        <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Smart Matching</h3>
                    <p className="text-slate-600">Our algorithm automatically pairs you with students who want what you teach, and teach what you want.</p>
                </div>

                <div className="glass-card p-6 flex flex-col items-center text-center gap-4 hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Verified Peers</h3>
                    <p className="text-slate-600">Connect with real students from your college securely. Rate your peers and build reputation.</p>
                </div>
            </section>
        </div>
    );
};

export default Landing;
