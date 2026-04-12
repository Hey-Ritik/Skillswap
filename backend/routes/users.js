import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, college, bio, profilePic, teachSkills, learnSkills } = req.body;

        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Calculate points for new skills
        const oldSkillsCount = (user.teachSkills?.length || 0) + (user.learnSkills?.length || 0);
        
        user.name = name || user.name;
        user.college = college || user.college;
        user.bio = bio !== undefined ? bio : user.bio;
        user.profilePic = profilePic || user.profilePic;
        user.teachSkills = teachSkills || user.teachSkills;
        user.learnSkills = learnSkills || user.learnSkills;

        const newSkillsCount = (user.teachSkills?.length || 0) + (user.learnSkills?.length || 0);
        
        if (newSkillsCount > oldSkillsCount) {
            const addedSkills = newSkillsCount - oldSkillsCount;
            user.points = (user.points || 0) + (addedSkills * 10);
            console.log(`[POINTS] Awarded ${addedSkills * 10} points to user ${user._id} for adding skills`);
        }

        await user.save();

        // Return updated user without password
        const updatedUser = await User.findById(req.user.id).select('-password');
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all users for marketplace
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Exclude current user from marketplace
        const users = await User.find({ _id: { $ne: req.user.id } }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get specific user by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Seed Demo Data Manually
import { seedDatabase } from '../seed.js';
router.post('/seed', async (req, res) => {
    try {
        await seedDatabase();
        res.status(200).json({ message: 'Demo data seeded successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error seeding data', error: error.message });
    }
});

export default router;
