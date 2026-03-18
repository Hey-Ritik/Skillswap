import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, GraduationCap } from 'lucide-react';

const Marketplace = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('/users');
                setUsers(res.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.teachSkills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Skill Marketplace</h1>
                    <p className="text-slate-500 mt-1">Discover students and their skills</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by skill or name..."
                        className="glass-input pl-12"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading students...</div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.length > 0 ? filteredUsers.map(user => (
                        <div key={user._id} className="glass-card overflow-hidden hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 transform hover:-translate-y-1 group">
                            <div className="h-24 bg-gradient-to-r from-primary-400 to-secondary-500"></div>
                            <div className="px-6 pb-6 relative">
                                <img
                                    src={user.profilePic || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                                    alt={user.name}
                                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg absolute -top-10 object-cover"
                                />
                                <div className="pt-12">
                                    <h3 className="text-xl font-bold text-slate-800">{user.name}</h3>
                                    <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                                        <GraduationCap className="w-4 h-4" /> {user.college}
                                    </div>

                                    <p className="mt-4 text-sm text-slate-600 line-clamp-2 min-h-[40px]">
                                        {user.bio || "No bio provided."}
                                    </p>

                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Can Teach:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {user.teachSkills?.slice(0, 3).map(skill => (
                                                <span key={skill} className="bg-primary-50 text-primary-700 border border-primary-200 px-2 py-0.5 text-xs font-medium rounded text-center">{skill}</span>
                                            ))}
                                            {user.teachSkills?.length > 3 && (
                                                <span className="text-xs text-slate-500 px-1 py-0.5">+{user.teachSkills.length - 3} more</span>
                                            )}
                                            {(!user.teachSkills || user.teachSkills.length === 0) && (
                                                <span className="text-xs text-slate-400 italic">No skills listed</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-3 text-center py-20 bg-white/40 rounded-2xl border border-white/50">
                            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-700">No students found</h3>
                            <p className="text-slate-500">Try adjusting your search terms.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Marketplace;
