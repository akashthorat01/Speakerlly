import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Clock, CheckCircle2, Star, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

const Booking = () => {
    const { user } = useAuthStore();
    const { trainerId } = useParams();
    const navigate = useNavigate();
    
    // Mock Trainer Data
    const trainer = {
        name: "Sarah Jenkins",
        image: "https://i.pravatar.cc/150?img=32",
        rating: 4.9,
        reviews: 124,
        price: 500,
        accent: "British"
    };

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [step, setStep] = useState(1); // 1: DateTime, 2: Payment, 3: Success
    const [isBooking, setIsBooking] = useState(false);

    const dates = ["Today, Oct 24", "Tomorrow, Oct 25", "Wed, Oct 26", "Thu, Oct 27"];
    const times = ["09:00 AM", "10:30 AM", "02:00 PM", "04:00 PM", "06:00 PM", "08:30 PM"];

    const handleConfirm = async () => {
        if(step === 1) setStep(2);
        else if(step === 2) {
            if (!user) {
                alert("Please log in to book a session.");
                navigate('/auth');
                return;
            }

            setIsBooking(true);
            try {
                // Razorpay Payment Simulation Gateway
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                await axios.post('http://localhost:5000/api/v1/sessions/book', {
                    trainerId: trainerId,
                    date: selectedDate,
                    time: selectedTime,
                    price: trainer.price,
                    userId: user.user?.id || user._id || user.id
                });
                
                setStep(3);
                setTimeout(() => navigate('/history'), 3000); 
            } catch (error) {
                console.error("Failed to book:", error);
                alert("Failed to confirm booking. Please try again.");
            } finally {
                setIsBooking(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                
                <Link to="/trainers" className="inline-flex items-center text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Back to Trainers
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32">
                    
                    {/* Left Column: Booking Flow */}
                    <div className="lg:col-span-2 space-y-6">
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
                                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 tracking-tight">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><CalendarIcon size={24} /></div> Select Date & Time
                               </h2>
                               
                               <div className="mb-8">
                                   <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Date</label>
                                   <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                                       {dates.map((date) => (
                                           <button 
                                                key={date}
                                                onClick={() => setSelectedDate(date)}
                                                className={`flex-shrink-0 px-6 py-4 rounded-2xl border-2 font-bold transition-all cursor-pointer shadow-sm ${
                                                    selectedDate === date ? 'border-blue-600 bg-blue-600 text-white shadow-blue-600/20 shadow-lg' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300'
                                                }`}
                                           >
                                               {date}
                                           </button>
                                       ))}
                                   </div>
                               </div>

                               <div>
                                   <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Available Times</label>
                                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                       {times.map((time) => (
                                           <button 
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                disabled={!selectedDate}
                                                className={`px-4 py-4 rounded-2xl border-2 font-bold transition-all text-center ${
                                                    !selectedDate ? 'opacity-40 cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400' :
                                                    selectedTime === time ? 'border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-600/20 cursor-pointer scale-105' : 'border-slate-100 bg-white text-slate-700 hover:border-slate-300 cursor-pointer shadow-sm'
                                                }`}
                                           >
                                               {time}
                                           </button>
                                       ))}
                                   </div>
                               </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
                                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 tracking-tight">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><ShieldCheck size={24} /></div> Secure Payment
                               </h2>
                               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6">
                                   <div className="flex justify-between items-center mb-4">
                                       <span className="text-slate-600 font-medium">Session Fee</span>
                                       <span className="text-slate-900 font-bold">₹{trainer.price}</span>
                                   </div>
                                   <div className="flex justify-between items-center mb-4">
                                       <span className="text-slate-600 font-medium flex items-center gap-1">Taxes & Fees</span>
                                       <span className="text-emerald-600 font-bold">Inclusive</span>
                                   </div>
                                   <div className="w-full h-px bg-slate-200 my-5"></div>
                                   <div className="flex justify-between items-center text-xl">
                                       <span className="text-slate-900 font-black">Total to Pay</span>
                                       <span className="text-blue-600 font-black tracking-tight">₹{trainer.price}</span>
                                   </div>
                               </div>

                               <p className="text-sm font-medium text-slate-500 mb-6 flex items-center justify-center gap-2 text-center bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                                   <ShieldCheck size={18} className="text-blue-500" /> Payments are held securely in platform escrow until session completion.
                               </p>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] p-12 border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
                                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-6 shadow-2xl shadow-emerald-500/20">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Booking Confirmed!</h2>
                                <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed text-lg">Your session with <strong>{trainer.name}</strong> is confirmed for <br/><span className="text-slate-800">{selectedDate} at {selectedTime}</span>.</p>
                                <div className="animate-pulse flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-6 py-3 rounded-xl">
                                    <Clock size={20} /> Redirecting to your sessions...
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-6 text-white sticky top-28 shadow-2xl shadow-slate-900/10 border border-slate-700">
                            <h3 className="font-bold text-xl mb-6 tracking-tight">Session Summary</h3>
                            
                            <div className="flex items-center gap-4 mb-8">
                                <img src={trainer.image} alt={trainer.name} className="w-16 h-16 rounded-full border-2 border-slate-600 object-cover" />
                                <div>
                                    <h4 className="font-bold text-lg">{trainer.name}</h4>
                                    <p className="text-slate-400 text-sm flex items-center gap-1 font-medium mt-0.5">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" /> {trainer.rating} • {trainer.accent}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Date</p>
                                    <p className="font-semibold text-lg">{selectedDate || 'Select a date'}</p>
                                </div>
                                <div className="w-full h-px bg-white/10 my-1"></div>
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">Time</p>
                                    <p className="font-semibold text-lg flex items-center gap-2">
                                        <Clock size={16} className="text-blue-400" /> {selectedTime || 'Select a time'}
                                    </p>
                                </div>
                            </div>

                            {step < 3 && (
                                <button 
                                    onClick={handleConfirm}
                                    disabled={isBooking || (step === 1 && (!selectedDate || !selectedTime))}
                                    className={`w-full py-4 rounded-xl font-bold transition-all shadow-xl text-center cursor-pointer flex items-center justify-center gap-2 ${
                                        (step === 1 && (!selectedDate || !selectedTime)) 
                                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed shadow-none border border-slate-600' 
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                                >
                                    {isBooking ? <Loader2 className="animate-spin text-white" /> : (
                                        step === 1 ? 'Proceed to Payment' : `Pay ₹${trainer.price} via Razorpay`
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Booking;
