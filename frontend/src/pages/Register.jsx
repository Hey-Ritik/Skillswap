import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', college: '', password: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex justify-center flex-col items-center min-h-[75vh]">
            <div className="glass-card p-10 w-full max-w-lg animate-[slideUp_0.5s_ease-out]">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
                    <p className="text-slate-500 font-medium">Join SkillSwap and start exchanging knowledge.</p>
                </div>

                {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                        <input type="text" placeholder="Full Name" className="glass-input pl-12"
                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="relative">
                        <GraduationCap className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                        <input type="text" placeholder="College or Department" className="glass-input pl-12"
                            value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} required />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                        <input type="email" placeholder="College Email Address" className="glass-input pl-12"
                            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                        <input type="password" placeholder="Password (min 6 chars)" className="glass-input pl-12"
                            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength="6" />
                    </div>
                    <button type="submit" className="btn-primary w-full text-lg mt-4">
                        Create Account
                    </button>
                </form>

                <p className="text-center mt-6 text-slate-600 font-medium">
                    Already a member? <Link to="/login" className="text-primary-600 hover:text-primary-700 hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
