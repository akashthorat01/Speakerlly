const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'trainer', 'admin'], default: 'user' },
    plan_type: { type: String, enum: ['free', 'basic', 'premium'], default: 'free' },
    balance: { type: Number, default: 0 },
    progress_score: { type: Number, default: 0 }, // 0-100 AI score
    streak: { type: Number, default: 0 } // Days of continuous learning
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
