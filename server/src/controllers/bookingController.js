const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
    try {
        const { userId, trainerId, date, status } = req.body;
        
        if (!userId || !trainerId || !date) {
            return res.status(400).json({ message: "userId, trainerId, and date are required" });
        }

        const newBooking = await Booking.create({
            userId,
            trainerId,
            date,
            status: status || 'Booked'
        });

        res.status(201).json({ message: "Booking Successful", booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

const getBookings = async (req, res) => {
    try {
        const { userId } = req.query;
        let query = {};
        if (userId) query.userId = userId;

        const bookings = await Booking.find(query).populate({
            path: 'trainerId',
            populate: { path: 'user_id', select: 'name email' }
        }).sort({ date: -1 });

        res.json({ bookings });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

module.exports = { createBooking, getBookings };
