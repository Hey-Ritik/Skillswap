import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Define available rewards
const REWARDS = [
    { id: '1', name: 'SkillSwap T-Shirt', points: 200, icon: '👕' },
    { id: '2', name: 'SkillSwap Mug', points: 100, icon: '☕' },
    { id: '3', name: 'Pro Badge (1 Month)', points: 500, icon: '👑' },
    { id: '4', name: 'SkillSwap Sticker Pack', points: 50, icon: '✨' },
];

// Get all rewards
router.get('/', authMiddleware, (req, res) => {
    res.json(REWARDS);
});

// Redeem a reward
router.post('/redeem', authMiddleware, async (req, res) => {
try {
        const { rewardId } = req.body;
        const reward = REWARDS.find(r => r.id === rewardId);

        if (!reward) {
            return res.status(404).json({ message: 'Reward not found' });
        }

        const user = await User.findById(req.user.id);
        if (user.points < reward.points) {
            return res.status(400).json({ message: 'Insufficient points' });
        }

        user.points -= reward.points;
        await user.save();

        res.json({ 
            message: `Successfully redeemed ${reward.name}!`,
            remainingPoints: user.points 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
