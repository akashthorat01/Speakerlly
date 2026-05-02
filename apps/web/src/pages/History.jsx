import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, Star, Loader2, ArrowRight, Zap, Target } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getMyBookings } from '../api/bookingService';

const History = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        navigate('/auth');
        return;
    }

    const fetchBookings = async () => {
      try {
        const data = await getMyBookings();
        setBookings(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [user, navigate]);

  return (
    <div className="min-h-screen pb-20 text-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 mt-4">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-8 relative">
           <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full point-events-none"></div>
            <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white tracking-tighter">My Ledger</h1>
                <p className="text-purple-300/80 font-medium mt-3 text-lg">Your chronological ecosystem of speaking sessions & drops.</p>
            </div>
            <Link to="/trainers" className="relative z-10 bg-white/5 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-white/10 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                Mint New Session
            </Link>
        </div>

        {isLoading ? (
            <div className="w-full py-32 flex flex-col items-center justify-center text-purple-500">
                <Loader2 size={50} className="animate-spin mb-6 drop-shadow-[0_0_15px_purple]" />
                <p className="font-bold uppercase tracking-widest text-sm animate-pulse">Syncing Blockchain History...</p>
            </div>
        ) : bookings?.length === 0 ? (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-[#1a0b2e]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] p-16 text-center shadow-[0_0_40px_rgba(168,85,247,0.1)] flex flex-col items-center mt-10 relative overflow-hidden group hover:border-purple-500/30 transition-colors"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 pointer-events-none"></div>
                <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20 shadow-[0_0_20px_purple] group-hover:scale-110 transition-transform duration-500">
                    <Target size={40} />
                </div>
                <h2 className="text-3xl font-black text-white mb-3 tracking-tighter">No Ledger History</h2>
                <p className="text-purple-300/70 max-w-lg mx-auto mb-10 text-[16px] font-medium leading-relaxed">You haven't scheduled any speaking sessions or processed any contracts yet. Dive into the ecosystem now.</p>
                <Link to="/trainers" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-xl font-black tracking-widest uppercase transition-all shadow-[0_0_20px_purple] hover:shadow-[0_0_30px_#d946ef] cursor-pointer">
                    Explore Roster
                </Link>
            </motion.div>
        ) : (
            <div className="space-y-6">
                <AnimatePresence>
                    {bookings?.map((booking, idx) => (
                        <motion.div 
                            key={booking.id || idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.01 }}
                            className="bg-[#0f0a1a]/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-[0_0_30px_rgb(0,0,0)] flex flex-col md:flex-row gap-6 justify-between items-center group hover:border-purple-500/50 transition-all"
                        >
                            <div className="flex gap-6 w-full md:w-auto items-center">
                                <div className="hidden sm:flex w-16 h-16 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl items-center justify-center text-white flex-shrink-0 shadow-[0_0_15px_purple] border border-white/20 group-hover:rotate-6 transition-transform">
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-purple-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-[0_0_10px_purple]">
                                            Contract {booking.status}
                                        </div>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-white mt-2">
                                        Session Block with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{booking.trainer?.name || "Trainer"}</span>
                                    </h3>
                                    <p className="text-purple-300/70 font-medium flex items-center gap-2 mt-2">
                                        <Calendar size={16} className="text-purple-500" /> 
                                        {new Date(booking.slotDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {booking.slotTime}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="w-full md:w-auto mt-4 md:mt-0 flex-shrink-0">
                                {booking.status === 'CONFIRMED' ? (
                                    <Link to={`/session/${booking.id}`} className="w-full md:w-auto bg-white/10 hover:bg-white/20 border border-purple-500/50 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-center gap-3 group/btn">
                                        <Video size={18} className="text-purple-400 group-hover/btn:scale-110 transition-transform" /> Connect to Grid
                                    </Link>
                                ) : (
                                    <button className="w-full md:w-auto bg-black/40 text-slate-500 px-8 py-4 rounded-xl font-bold border border-white/5 cursor-not-allowed">
                                        {booking.status === 'PENDING' ? 'Awaiting Trainer' : 'Block Finalized'}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        )}
      </div>
    </div>
  );
};

export default History;
