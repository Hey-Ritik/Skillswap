import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center flex-col items-center min-h-[75vh]">
            <div className="glass-card p-10 w-full max-w-md animate-[slideUp_0.5s_ease-out]">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                    <p className="text-slate-500 font-medium">Enter your credentials to access your account.</p>
                </div>

                {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                        <input
                            type="email"
                            placeholder="College Email"
                            className="glass-input pl-12"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="glass-input pl-12"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full text-lg mt-2">
                        Sign In
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-600 font-medium">
                    Don't have an account? <Link to="/register" className="text-primary-600 hover:text-primary-700 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
