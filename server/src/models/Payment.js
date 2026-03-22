const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    platform_cut: { type: Number, default: 0 }, // Engine automated calculation
    trainer_payout: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ['pending', 'escrow', 'released', 'refunded', 'failed'], 
        default: 'pending' 
    },
    payment_method: { type: String }, // "UPI", "Card", etc.
    transaction_id: { type: String } // Stripe/Razorpay string
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
