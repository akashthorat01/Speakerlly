const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String, required: true },
    topics: [{ type: String }], // e.g. ["Business English", "IELTS", "Casual"]
    intro_video_url: { type: String },
    rating: { type: Number, default: 5.0 }, 
    total_reviews: { type: Number, default: 0 },
    price_per_session: { type: Number, default: 500 }, // In INR
    earnings: { type: Number, default: 0 },
    completed_sessions: { type: Number, default: 0 },
    missed_sessions: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
