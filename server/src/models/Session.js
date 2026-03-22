const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    scheduled_at: { type: Date, required: true },
    duration_minutes: { type: Number, default: 30 },
    status: { 
        type: String, 
        enum: ['scheduled', 'completed', 'user_missed', 'trainer_missed', 'rescheduled'], 
        default: 'scheduled' 
    },
    meeting_url: { type: String }, // Generated WebRTC or Socket link
    ai_feedback: { type: String }, // Angelina's post-session notes
    confidence_score: { type: Number } // 0-100 calculated by AI
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
