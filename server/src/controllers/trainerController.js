const Trainer = require('../models/Trainer');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getTrainers = async (req, res) => {
    try {
        let trainers = await Trainer.find().populate('user_id', 'name email');
        
        // Auto-seed if empty for demo purposes
        if (trainers.length === 0) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const user1 = await User.create({ name: "Sarah Jenkins", email: "sarah@example.com", password: hashedPassword, role: "trainer" });
            await Trainer.create({
                user_id: user1._id,
                bio: "Certified CELTA instructor with 5+ years of experience helping professionals excel in global business environments.",
                topics: ["Business English", "IELTS"],
                price_per_session: 500, rating: 4.9, total_reviews: 124
            });

            const user2 = await User.create({ name: "Michael Chang", email: "mike@example.com", password: hashedPassword, role: "trainer" });
            await Trainer.create({
                user_id: user2._id,
                bio: "Former Silicon Valley engineer. I specialize in helping you crack technical interviews and speak confidently.",
                topics: ["Conversational", "Tech Interviews"],
                price_per_session: 450, rating: 4.8, total_reviews: 89
            });

            trainers = await Trainer.find().populate('user_id', 'name email');
        }

        const formatted = trainers.map(t => ({
            id: t._id,
            name: t.user_id.name,
            image: "https://i.pravatar.cc/150?u=" + t.user_id.email,
            rating: t.rating,
            reviews: t.total_reviews,
            accent: "British/American", // Mocked for MVP
            specialties: t.topics,
            price: `₹${t.price_per_session} / session`,
            availableToday: true,
            bio: t.bio,
            rawPrice: t.price_per_session
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

const addTrainer = async (req, res) => {
    try {
        const { name, bio, price, email, topics } = req.body;
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await User.create({ name: name || 'New Trainer', email: email || `${Date.now()}@example.com`, password: hashedPassword, role: 'trainer' });
        
        const newTrainer = await Trainer.create({
            user_id: user._id,
            bio: bio || "No bio provided.",
            price_per_session: price || 500,
            topics: topics || ["General"]
        });

        res.status(201).json({ message: "Trainer added successfully", trainer: newTrainer });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getTrainers, addTrainer };
