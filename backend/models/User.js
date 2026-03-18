import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    college: { type: String, required: true },
    bio: { type: String, default: '' },
    profilePic: { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    teachSkills: [{ type: String }],
    learnSkills: [{ type: String }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
