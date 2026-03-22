const User = require('../models/User');
const Session = require('../models/Session');

const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: "User ID missing" });

        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });

        const completedSessions = await Session.countDocuments({ user_id: userId, status: 'completed' });
        
        res.json({
            user,
            stats: {
                completed_sessions: completedSessions,
                progress_score: user.progress_score || 0,
                streak: user.streak || 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { userId } = req.query;
        const updates = req.body;

        // Ensure we don't accidentally update password here without hashing
        if (updates.password) delete updates.password;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
}

module.exports = { getUserProfile, updateProfile };
