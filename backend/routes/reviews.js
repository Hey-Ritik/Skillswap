import express from 'express';
import Review from '../models/Review.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Leave a review for a user
router.post('/:userId', authMiddleware, async (req, res) => {
    try {
        const { rating, comment } = req.body;

        // Check if review already exists
        const existingReview = await Review.findOne({
            reviewer: req.user.id,
            reviewee: req.params.userId
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this user' });
        }

        const review = new Review({
            reviewer: req.user.id,
            reviewee: req.params.userId,
            rating,
            comment
        });

        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get reviews for a specific user
router.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const reviews = await Review.find({ reviewee: req.params.userId })
            .populate('reviewer', 'name profilePic college')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
