import React, { useState, useEffect } from 'react';
import { Play, Calendar, Video, Star, Award, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { getProgressSummary } from '../api/progressService';
import { getSessionHistory } from '../api/sessionService';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [nextSession, setNextSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchDashboardData = async () => {
      try {
        const [progressData, sessionsData] = await Promise.all([
            getProgressSummary(),
            getSessionHistory()
        ]);
        
        setStats({
          streak: 1, // Optional calculation
          progress_score: Math.min((progressData.totalMinutes / 600) * 100, 100).toFixed(0) // Sample calculation
        });
        
        const upcoming = sessionsData.find(s => s.status === 'COMPLETED' || s.status === 'PENDING' || s.status === 'RESCHEDULED');
        // Actually our session status has COMPLETED, MISSED, RESCHEDULED.
        // A pending session would be fetched from Booking instead.
        // For dashboard purposes, let's just use the latest session.
        setNextSession(sessionsData.length > 0 ? sessionsData[0] : null);
      } catch (error) {
         console.error(error);
      } finally {
          setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center relative z-10"><Loader2 className="animate-spin text-purple-600 w-12 h-12 drop-shadow-[0_0_15px_purple]" /></div>;

  return (
    <div className="min-h-screen pb-20 text-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-black text-white tracking-tighter"
            >
              Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_10px_purple]">{user?.name?.split(' ')[0] || 'Explorer'}</span> 🚀
            </motion.h1>
            <p className="text-purple-300 font-medium mt-3 text-lg">You're on a {stats?.streak || 0}-day ecosystem streak! Keep minting progress.</p>
          </div>
          <Link to="/trainers">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Play size={16} className="text-white fill-white ml-0.5" />
              </div>
              Explore Drops
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AI Progress Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden group hover:border-purple-500/50 transition-colors"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 blur-[100px] rounded-full pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <div className="flex items-center gap-2 text-purple-400 font-black uppercase tracking-widest text-xs mb-3 border border-purple-500/30 bg-purple-500/10 px-3 py-1 rounded-md w-max">
                    <Award size={16} /> Speakerly Algorithm
                  </div>
                  <h2 className="text-3xl font-black text-white">Fluency Rating</h2>
                  <p className="text-slate-400 mt-1 font-medium">Aggregated across recent blocks</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-black tracking-tighter drop-shadow-[0_0_10px_purple]">{stats?.progress_score || 0}<span className="text-purple-500/50 text-2xl font-bold">/100</span></div>
                  <div className="text-pink-400 font-bold text-sm mt-1">{stats?.progress_score > 70 ? 'Excellent' : 'Building'}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden mb-4 border border-white/5 relative z-10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats?.progress_score || 10}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative shadow-[0_0_10px_#d946ef]"
                >
                  <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-shimmer"></div>
                </motion.div>
              </div>
            </motion.div>

            {/* Upcoming Session */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
               <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="text-purple-400" /> Recent / Upcoming Session
                  </h2>
                  <Link to="/history" className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors cursor-pointer border border-purple-500/30 px-3 py-1 rounded-lg">View Ledger</Link>
               </div>
               
               {nextSession ? (
                 <div className="bg-[#1a0b2e]/60 backdrop-blur-xl rounded-[2rem] border border-purple-500/30 p-6 md:p-8 text-white shadow-[0_0_40px_rgba(168,85,247,0.15)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden transition-all hover:border-purple-400">
                   <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-purple-600/10 to-transparent pointer-events-none"></div>
                   
                   <div className="flex items-center gap-5 w-full md:w-auto relative z-10">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-3xl shadow-[0_0_15px_purple] border border-white/20">
                          {nextSession.trainer?.name?.charAt(0) || 'T'}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black">{nextSession.trainer?.name || 'Trainer'}</h3>
                        <p className="text-purple-300 mt-1 flex items-center gap-1.5 font-bold tracking-wide text-sm">
                          <Star size={16} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_5px_yellow]" />
                          Contract Active
                        </p>
                      </div>
                   </div>

                   <div className="flex items-center gap-6 md:gap-8 w-full md:w-auto bg-black/40 rounded-2xl px-6 py-4 backdrop-blur-md relative z-10 border border-white/5">
                      <div className="text-center">
                        <p className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-1">Time</p>
                        <p className="font-bold text-lg">{nextSession.startTime}</p>
                      </div>
                      <div className="w-px h-10 bg-white/10"></div>
                      <div className="text-center">
                        <p className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-1">Date</p>
                        <p className="font-bold text-lg">{new Date(nextSession.sessionDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                      </div>
                   </div>

                   <Link to={`/session/${nextSession.sessionId}`}>
                     <motion.button 
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_purple] hover:shadow-[0_0_30px_#d946ef] flex items-center justify-center gap-2 cursor-pointer z-10 group"
                     >
                        <Video size={18} className="group-hover:scale-110 transition-transform" /> Connect
                     </motion.button>
                   </Link>
                 </div>
               ) : (
                 <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-10 border border-white/10 text-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <Calendar size={40} className="mx-auto text-purple-500 mb-4 drop-shadow-[0_0_10px_purple]" />
                    <h4 className="font-black text-white mb-2 text-2xl tracking-tight">No Active Contracts</h4>
                    <p className="text-slate-400 mb-8 font-medium">Mint your first learning session to start gaining XP.</p>
                    <Link to="/trainers" className="bg-purple-600/20 text-purple-300 font-bold py-3.5 px-8 rounded-xl border border-purple-500/50 hover:bg-purple-500/40 transition-colors inline-block tracking-wide cursor-pointer">Explore Roster</Link>
                 </div>
               )}
            </motion.div>
          </div>

          {/* Right Column (Widgets) */}
          <div className="space-y-8">
            
            {/* Premium CTA */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#1a0b2e]/80 backdrop-blur-xl rounded-[2rem] p-8 text-white relative overflow-hidden border border-pink-500/30 shadow-[0_0_40px_rgba(217,70,239,0.2)]"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500 rounded-full blur-[80px] opacity-40"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/20 backdrop-blur-md">
                  <Zap size={24} className="text-pink-400 drop-shadow-[0_0_10px_pink]" />
                </div>
                <h3 className="text-2xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Platinum Tier</h3>
                <p className="text-purple-200 text-sm mb-6 leading-relaxed font-light">Unlimited access to Angelina AI matrix and elite global experts block space.</p>
                <div className="w-full bg-pink-500/20 text-pink-300 border border-pink-500/50 font-bold tracking-widest uppercase text-xs py-4 rounded-xl text-center shadow-[inset_0_0_10px_rgba(217,70,239,0.3)]">
                  Active Member
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
