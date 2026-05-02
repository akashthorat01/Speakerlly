const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_speakerlly',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'speakerlly_secret',
});

exports.createOrder = async (req, res) => {
    try {
        const { amount, session_id } = req.body;
        // User pays 300 or 500
        const options = {
            amount: amount * 100, // min amount in paise
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        
        // Save pending payment
        const payment = new Payment({
            user_id: req.user._id,
            session_id: session_id,
            amount: amount,
            status: 'pending',
            transaction_id: order.id
        });
        await payment.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'speakerlly_secret')
                                   .update(sign.toString())
                                   .digest("hex");

        if (razorpay_signature === expectedSign) {
            await Payment.findOneAndUpdate(
                { transaction_id: razorpay_order_id },
                { status: 'escrow', payment_method: 'Razorpay' },
                { new: true }
            );

            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature sent' });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
