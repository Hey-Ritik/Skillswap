import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import matchRoutes from './routes/matches.js';
import messageRoutes from './routes/messages.js';
import reviewRoutes from './routes/reviews.js';
import rewardsRoutes from './routes/rewards.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://skillswap-orpin-three.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));

app.options('*', cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://skillswap-orpin-three.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/rewards', rewardsRoutes);

// Routes will go here
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'SkillSwap API is running' });
});

// MongoDB Connection
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGODB_URI;
        const dbPath = path.join(__dirname, 'data');

        // Prioritize Atlas connection if MONGODB_URI is provided and not local
        const isAtlas = mongoUri && !mongoUri.includes('localhost') && !mongoUri.includes('127.0.0.1');

        if (isAtlas) {
            console.log('Connecting to [REMOTE] MongoDB Atlas...');
        } else {
            console.log('Initializing [LOCAL] Persistent Database...');
            if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath);

            // Handle stale mongod.lock file aggressively
            const lockFile = path.join(dbPath, 'mongod.lock');
            if (fs.existsSync(lockFile)) {
                try {
                    console.log('Stale mongod.lock detected. Attempting to release...');
                    // Try to delete it
                    fs.unlinkSync(lockFile);
                    console.log('Lock file removed successfully.');
                } catch (lockError) {
                    if (lockError.code === 'EBUSY' || lockError.code === 'EPERM') {
                        console.warn('Lock file is busy. Attempting to kill zombie mongod processes...');
                        try {
                            // Kill any existing mongod processes (Windows specific)
                            await execPromise('taskkill /F /IM mongod.exe');
                            console.log('Zombie mongod processes killed. Waiting for file handles to release...');
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            if (fs.existsSync(lockFile)) fs.unlinkSync(lockFile);
                        } catch (killError) {
                            console.error('Could not kill mongod process automatically:', killError.message);
                        }
                    } else {
                        console.warn('Non-critical lock file error:', lockError.message);
                    }
                }
            }

            const mongoServer = await MongoMemoryServer.create({
                instance: { dbPath, storageEngine: 'wiredTiger' }
            });
            mongoUri = mongoServer.getUri();
            console.log('Started Persistent MongoDB Server at:', mongoUri);
        }

        await mongoose.connect(mongoUri);
        console.log(`Connected to MongoDB [${isAtlas ? 'ATLAS' : 'LOCAL'}] successfully`);

        // Auto-seed mock data on startup if database is empty
        const { seedDatabase } = await import('./seed.js');
        await seedDatabase();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('DATABASE STARTUP ERROR:', err.message);
        if (err.message.includes('DBPathInUse') || err.name === 'SyntaxError') {
            console.error('CRITICAL: Database instance failed to start cleanly.');
            console.error('ACTION REQUIRED: Try running "taskkill /F /IM mongod.exe" in a terminal or manually delete backend/data/mongod.lock and restart.');
        }
        process.exit(1);
    }
};

connectDB();
