import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get conversation with a specific user
router.get('/conversation/:userId', authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 });

        // Mark received messages as read
        await Message.updateMany(
            { sender: req.params.userId, receiver: req.user.id, read: false },
            { $set: { read: true } }
        );

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Send a message
router.post('/send/:userId', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [req.user.id, req.params.userId] }
        });

        if (!conversation) {
            conversation = new Conversation({ participants: [req.user.id, req.params.userId] });
            await conversation.save();
        }

        const message = new Message({
            conversationId: conversation._id,
            sender: req.user.id,
            receiver: req.params.userId,
            content
        });

        await message.save();
        res.status(201).json(message);
    } catch (error) {
        console.error("Send Message Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get recent chats (users we talked to)
router.get('/recent', authMiddleware, async (req, res) => {
    try {
        const conversations = await Conversation.find({ participants: req.user.id })
            .populate('participants', 'name profilePic college')
            .sort({ updatedAt: -1, createdAt: -1 });

        // Map to return the other User profile so the Chat Sidebar stays compatible with older UI logic
        const recentUsers = conversations.map(conv => {
            return conv.participants.find(p => p._id.toString() !== req.user.id);
        }).filter(Boolean);

        res.json(recentUsers);
    } catch (error) {
        console.error("Fetch Recent Chats Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
