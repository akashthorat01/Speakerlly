const Session = require('../models/Session');
const Trainer = require('../models/Trainer');
const Payment = require('../models/Payment');
const User = require('../models/User');
const crypto = require('crypto');

// Book a new Session
const bookSession = async (req, res) => {
    try {
        const { trainerId, date, time, price, userId } = req.body;

        if (!userId || !trainerId || !date || !time) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Generate a random room ID for WebRTC
        const roomId = Math.random().toString(36).substring(2, 10) + "-" + Math.random().toString(36).substring(2, 10);

        const platformCut = price * 0.16;
        const trainerPayout = price - platformCut;

        const session = await Session.create({
            user_id: userId,
            trainer_id: trainerId,
            scheduled_at: new Date(`${date} ${time}`),
            status: 'scheduled',
            meeting_url: roomId
        });

        await Payment.create({
            user_id: userId,
            session_id: session._id,
            amount: price,
            platform_cut: platformCut,
            trainer_payout: trainerPayout,
            status: 'escrow', // Held until session completion
            payment_method: 'razorpay'
        });

        res.status(201).json({ message: "Session booked successfully!", session: session, roomId });
    } catch (error) {
        res.status(500).json({ message: "Failed to book session", error: error.message });
    }
};

// Get User's Sessions
const getUserSessions = async (req, res) => {
    try {
         const { userId } = req.query; 
         if (!userId) {
             return res.status(400).json({ message: "User ID required" });
         }

         const sessions = await Session.find({ user_id: userId })
            .populate({
                path: 'trainer_id',
                populate: { path: 'user_id', select: 'name email' }
            })
            .sort({ scheduled_at: 1 });

         res.json({ sessions });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch sessions", error: error.message });
    }
}

// Get Trainer's Sessions
const getTrainerSessions = async (req, res) => {
    try {
        const { userId } = req.query;
        const trainer = await Trainer.findOne({ user_id: userId });
        if (!trainer) return res.status(404).json({ message: "Trainer profile not found" });

        const sessions = await Session.find({ trainer_id: trainer._id })
            .populate('user_id', 'name email')
            .sort({ scheduled_at: 1 });

        res.json({ sessions, trainer });
    } catch (error) {
        res.status(500).json({ message: "Failed API", error: error.message });
    }
}

// Update Session Status (Accept/Reject/Complete/Missed)
const updateSessionStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { status } = req.body; 
        
        const session = await Session.findByIdAndUpdate(sessionId, { status }, { new: true });
        
        // Handle post-session financial and score routing
        const payment = await Payment.findOne({ session_id: sessionId });
        if (payment && payment.status === 'escrow') {
            if (status === 'completed') {
                payment.status = 'completed';
                await payment.save();
                
                // Add payout to trainer
                await Trainer.findByIdAndUpdate(session.trainer_id, {
                    $inc: { earnings: payment.trainer_payout, completed_sessions: 1 }
                });

                // Boost user's score for completing session
                await User.findByIdAndUpdate(session.user_id, {
                    $inc: { progress_score: 5, streak: 1 }
                });
            } else if (status === 'missed') {
                payment.status = 'refunded';
                await payment.save();
                
                // 3% penalty deduction from trainer's existing total earnings as requested
                const penalty = (payment.amount * 0.03);
                await Trainer.findByIdAndUpdate(session.trainer_id, {
                    $inc: { earnings: -penalty }
                });
            } else if (status === 'rejected') {
                payment.status = 'refunded';
                await payment.save();
            }
        }

        res.json({ session });
    } catch (error) {
        res.status(500).json({ message: "Failed", error: error.message });
    }
}

module.exports = { bookSession, getUserSessions, getTrainerSessions, updateSessionStatus };
