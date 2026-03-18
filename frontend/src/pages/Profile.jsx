import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Plus, X, Save } from 'lucide-react';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '', college: '', bio: '', profilePic: ''
    });
    const [teachSkills, setTeachSkills] = useState([]);
    const [learnSkills, setLearnSkills] = useState([]);
    const [teachInput, setTeachInput] = useState('');
    const [learnInput, setLearnInput] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                college: user.college || '',
                bio: user.bio || '',
                profilePic: user.profilePic || ''
            });
            setTeachSkills(user.teachSkills || []);
            setLearnSkills(user.learnSkills || []);
        }
    }, [user]);

    const addSkill = (type) => {
        if (type === 'teach' && teachInput.trim() && !teachSkills.includes(teachInput.trim())) {
            setTeachSkills([...teachSkills, teachInput.trim()]);
            setTeachInput('');
        } else if (type === 'learn' && learnInput.trim() && !learnSkills.includes(learnInput.trim())) {
            setLearnSkills([...learnSkills, learnInput.trim()]);
            setLearnInput('');
        }
    };

    const removeSkill = (type, skill) => {
        if (type === 'teach') setTeachSkills(teachSkills.filter(s => s !== skill));
        else setLearnSkills(learnSkills.filter(s => s !== skill));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('/users/profile', {
                ...formData,
                teachSkills,
                learnSkills
            });
            setUser(res.data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Edit Profile</h1>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl text-sm font-medium text-center ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="glass-card p-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Personal Details</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-500 mb-2">Full Name</label>
                            <input type="text" className="glass-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-500 mb-2">College / Dept</label>
                            <input type="text" className="glass-input" value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-500 mb-2">Bio</label>
                            <textarea className="glass-input min-h-[100px]" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Tell others about yourself..."></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-500 mb-2">Profile Picture URL</label>
                            <input type="url" className="glass-input" value={formData.profilePic} onChange={(e) => setFormData({ ...formData, profilePic: e.target.value })} placeholder="https://..." />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-card p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Skills to Teach</h2>
                        <p className="text-sm text-slate-500 mb-4">What can you offer others?</p>
                        <div className="flex gap-2 mb-4">
                            <input type="text" className="glass-input" placeholder="e.g. Python" value={teachInput} onChange={e => setTeachInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill('teach'))} />
                            <button type="button" onClick={() => addSkill('teach')} className="bg-primary-100 text-primary-600 p-3 rounded-xl hover:bg-primary-200 transition-colors">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {teachSkills.map(skill => (
                                <span key={skill} className="bg-slate-100 text-slate-700 px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1">
                                    {skill} <X className="w-4 h-4 cursor-pointer hover:text-red-500" onClick={() => removeSkill('teach', skill)} />
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Skills to Learn</h2>
                        <p className="text-sm text-slate-500 mb-4">What do you want to learn?</p>
                        <div className="flex gap-2 mb-4">
                            <input type="text" className="glass-input pointer-events-auto" placeholder="e.g. React" value={learnInput} onChange={e => setLearnInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill('learn'))} />
                            <button type="button" onClick={() => addSkill('learn')} className="bg-secondary-100 text-secondary-600 p-3 rounded-xl hover:bg-secondary-200 transition-colors">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {learnSkills.map(skill => (
                                <span key={skill} className="bg-primary-50 text-primary-700 border border-primary-200 px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1">
                                    {skill} <X className="w-4 h-4 cursor-pointer hover:text-red-500" onClick={() => removeSkill('learn', skill)} />
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="btn-primary flex items-center gap-2">
                        <Save className="w-5 h-5" /> Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
