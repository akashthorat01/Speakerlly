import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, Star, Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

const History = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        navigate('/auth');
        return;
    }

    const fetchSessions = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/v1/sessions/my-sessions?userId=${user.user?.id || user._id || user.id}`);
        setSessions(data.sessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, [user, navigate]);

  return (
    <div className="min-h-screen pb-20 bg-slate-50 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-6">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Sessions</h1>
                <p className="text-slate-500 font-medium mt-2">Manage your upcoming training classes and past history.</p>
            </div>
            <Link to="/trainers" className="bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm">
                Book New
            </Link>
        </div>

        {isLoading ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 size={40} className="animate-spin mb-4 text-blue-500" />
                <p className="font-semibold text-lg">Loading your schedule...</p>
            </div>
        ) : sessions?.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center mt-10">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6 border-8 border-white shadow-xl">
                    <Calendar size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">No Sessions Booked</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8 text-[15px] font-medium leading-relaxed">You haven't scheduled any speaking sessions yet. Ready to start your journey to fluency?</p>
                <Link to="/trainers" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-transform hover:scale-105 shadow-xl shadow-blue-600/30">
                    Find a Trainer
                </Link>
            </div>
        ) : (
            <div className="space-y-4">
                <AnimatePresence>
                    {sessions?.map((session, idx) => (
                        <motion.div 
                            key={session._id || idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-center group hover:border-blue-200 transition-colors"
                        >
                            <div className="flex gap-5 w-full sm:w-auto">
                                <div className="hidden sm:flex w-16 h-16 bg-blue-50 rounded-full items-center justify-center text-blue-600 flex-shrink-0">
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                                            {session.status}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mt-2">
                                        Meeting with {session.trainer_id?.user_id?.name || "Trainer"}
                                    </h3>
                                    <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                                        <Calendar size={16} /> 
                                        {new Date(session.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(session.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="w-full sm:w-auto mt-4 sm:mt-0">
                                {session.status === 'scheduled' ? (
                                    <Link to={`/session/${session.meeting_url}`} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group-hover:scale-105">
                                        <Video size={18} /> Join Room
                                    </Link>
                                ) : (
                                    <button className="w-full sm:w-auto bg-slate-100 text-slate-500 px-6 py-3 rounded-xl font-bold border border-slate-200 cursor-not-allowed">
                                        Completed
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
