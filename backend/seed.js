import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const mockUsers = [
  {
    name: "Aarav Mehta",
    email: "aarav@rvu.edu.in",
    password: "password123",
    college: "Computer Science",
    teachSkills: ["Python", "Data Analysis"],
    learnSkills: ["UI/UX Design"],
    bio: "Computer science student passionate about data.",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav"
  },
  {
    name: "Priya Sharma",
    email: "priya@rvu.edu.in",
    password: "password123",
    college: "Design",
    teachSkills: ["Graphic Design", "Figma"],
    learnSkills: ["Web Development"],
    bio: "Design enthusiast who loves creating UI interfaces.",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
  },
  {
    name: "Rahul Verma",
    email: "rahul@rvu.edu.in",
    password: "password123",
    college: "Information Technology",
    teachSkills: ["JavaScript", "React"],
    learnSkills: ["Machine Learning"],
    bio: "Frontend developer exploring the world of AI.",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
  },
  {
    name: "Sneha Patel",
    email: "sneha@rvu.edu.in",
    password: "password123",
    college: "Media Studies",
    teachSkills: ["Photography", "Photoshop"],
    learnSkills: ["Video Editing"],
    bio: "Capturing moments and learning new digital art forms.",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha"
  },
  {
    name: "Arjun Nair",
    email: "arjun@rvu.edu.in",
    password: "password123",
    college: "Business Administration",
    teachSkills: ["Public Speaking", "Presentation Skills"],
    learnSkills: ["Python"],
    bio: "Business student looking to add technical skills to my portfolio.",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun"
  },
  {
    name: "Neha Gupta",
    email: "neha@rvu.edu.in",
    password: "password123",
    college: "Journalism",
    teachSkills: ["Content Writing", "Blogging"],
    learnSkills: ["SEO"],
    bio: "Storyteller focused on digital reach and optimization.",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha"
  },
  {
    name: "Karan Singh",
    email: "karan@rvu.edu.in",
    password: "password123",
    college: "Computer Science",
    teachSkills: ["Android Development"],
    learnSkills: ["UI Design"],
    bio: "Building mobile experiences and learning how to make them beautiful.",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karan"
  },
  {
    name: "Riya Kapoor",
    email: "riya@rvu.edu.in",
    password: "password123",
    college: "Marketing",
    teachSkills: ["Digital Marketing"],
    learnSkills: ["Web Development"],
    bio: "Marketing strategist diving into the technical side of the web.",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riya"
  },
  {
    name: "Aman Joshi",
    email: "aman@rvu.edu.in",
    password: "password123",
    college: "Computer Science",
    teachSkills: ["Node.js", "Backend Development"],
    learnSkills: ["Cloud Computing"],
    bio: "Server-side architect interested in scalable infrastructure.",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman"
  },
  {
    name: "Kavya Iyer",
    email: "kavya@rvu.edu.in",
    password: "password123",
    college: "Design",
    teachSkills: ["Illustration", "Procreate"],
    learnSkills: ["Animation"],
    bio: "Digital artist wanting to bring static illustrations to life.",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya"
  },
  {
    name: "Dev Malhotra",
    email: "dev@rvu.edu.in",
    password: "password123",
    college: "Information Technology",
    teachSkills: ["Cybersecurity Basics"],
    learnSkills: ["Ethical Hacking"],
    bio: "Security enthusiast securing the web one app at a time.",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev"
  },
  {
    name: "Tanvi Shah",
    email: "tanvi@rvu.edu.in",
    password: "password123",
    college: "Media Studies",
    teachSkills: ["Video Editing", "Premiere Pro"],
    learnSkills: ["Motion Graphics"],
    bio: "Video creator expanding into advanced animations.",
    profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvi"
  }
];

export const seedDatabase = async () => {
    try {
        const count = await User.countDocuments();
        if (count > 0) {
            console.log('Database already has users. Skipping initial seed.');
            return;
        }

        console.log('Database empty. Seeding mock user profiles...');
        
        // Hash passwords before inserting
        const salt = await bcrypt.genSalt(10);
        
        const usersToInsert = await Promise.all(mockUsers.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, salt);
            return {
                ...user,
                password: hashedPassword
            };
        }));

        await User.insertMany(usersToInsert);
        console.log(`Successfully seeded ${usersToInsert.length} mock users!`);
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};
