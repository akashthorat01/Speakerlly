const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Booked', 'Completed', 'Cancelled'], default: 'Booked' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
