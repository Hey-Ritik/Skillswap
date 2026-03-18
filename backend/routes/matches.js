import express from 'express';
import Match from '../models/Match.js';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get smart recommendations based on teach/learn skills
router.get('/recommendations', authMiddleware, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) return res.status(404).json({ message: 'User not found' });

        const { teachSkills, learnSkills } = currentUser;

        // Find users who can teach what I want to learn OR want to learn what I teach
        // Exclude myself
        const recommendations = await User.find({
            _id: { $ne: req.user.id },
            $or: [
                { teachSkills: { $in: learnSkills } },
                { learnSkills: { $in: teachSkills } }
            ]
        }).select('-password');

        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Request a match
router.post('/request/:userId', authMiddleware, async (req, res) => {
    try {
        const { skillOffered, skillRequested } = req.body;

        // Check if match already exists
        const existingMatch = await Match.findOne({
            $or: [
                { user1: req.user.id, user2: req.params.userId },
                { user1: req.params.userId, user2: req.user.id }
            ],
            status: { $in: ['pending', 'accepted'] }
        });

        if (existingMatch) {
            return res.status(400).json({ message: 'Match already requested or accepted' });
        }

        const match = new Match({
            user1: req.user.id,
            user2: req.params.userId,
            skillOffered,
            skillRequested
        });

        await match.save();
        console.log(`[MATCHES] User ${req.user.id} requested a match with User ${req.params.userId} resolving ${skillOffered} for ${skillRequested}`);
        res.status(201).json(match);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user's matches
router.get('/', authMiddleware, async (req, res) => {
    try {
        const matches = await Match.find({
            $or: [{ user1: req.user.id }, { user2: req.user.id }]
        })
            .populate('user1', 'name profilePic college')
            .populate('user2', 'name profilePic college');

        console.log(`[MATCHES] Fetched ${matches.length} total active or pending matches for user ${req.user.id}`);
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update match status
router.put('/:matchId', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const match = await Match.findById(req.params.matchId);

        if (!match) return res.status(404).json({ message: 'Match not found' });

        // Only user2 (receiver) can accept/reject
        if (match.user2.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this match' });
        }

        match.status = status;
        await match.save();

        if (status === 'accepted') {
            const existingConv = await Conversation.findOne({
                participants: { $all: [match.user1, match.user2] }
            });
            if (!existingConv) {
                const newConv = new Conversation({ participants: [match.user1, match.user2] });
                await newConv.save();
                console.log(`[CONVERSATION] Created conversation between ${match.user1} and ${match.user2}`);
            }
        }

        res.json(match);
    } catch (error) {
        console.error("Match Update Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
