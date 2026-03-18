import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';

const Ratings = () => {
    const [usersToRate, setUsersToRate] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');

    // Fetch recent matched users to rate
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('/matches');
                // Filter only accepted matches
                const acceptedMatches = res.data.filter(m => m.status === 'accepted');

                const peopleList = acceptedMatches.map(m => {
                    // get the other person
                    const isCurrentUser1 = typeof m.user1 === 'object' && m.user1._id; // Ensure populated
                    return m.user1._id ? m.user1 : m.user2; // Simplification, in real app need proper check against current user ID
                });

                // Use an alternate fetch to just get all users for MVP purposes
                const usersRes = await axios.get('/users');
                setUsersToRate(usersRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        try {
            await axios.post(`/reviews/${selectedUser}`, { rating, comment });
            setMessage('Review submitted successfully!');
            setComment('');
            setRating(5);
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to submit review');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <header>
                <h1 className="text-3xl font-bold text-slate-800">Leave a Rating</h1>
                <p className="text-slate-500 mt-1">Review students you've exchanged skills with.</p>
            </header>

            {message && (
                <div className="p-4 bg-emerald-100 text-emerald-700 rounded-xl font-medium text-center">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Student</label>
                    <select
                        className="glass-input"
                        value={selectedUser}
                        onChange={e => setSelectedUser(e.target.value)}
                        required
                    >
                        <option value="">Select a student...</option>
                        {usersToRate.map(u => (
                            <option key={u._id} value={u._id}>{u.name} - {u.college}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(num => (
                            <Star
                                key={num}
                                className={`w-8 h-8 cursor-pointer transition-colors ${num <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                                onClick={() => setRating(num)}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-500 mb-2">Feedback Comment</label>
                    <textarea
                        className="glass-input min-h-[120px]"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="How was the learning experience...?"
                        required
                    />
                </div>

                <button type="submit" className="btn-primary w-full">Submit Feedback</button>
            </form>
        </div>
    );
};

export default Ratings;
