import React, { useState, useEffect } from 'react';
import { Play, TrendingUp, Calendar, Video, Star, Award, ChevronRight, Zap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [nextSession, setNextSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchDashboardData = async () => {
      try {
        const [profileRes, sessionsRes] = await Promise.all([
            axios.get(`http://localhost:5000/api/v1/users/me?userId=${user._id || user.id}`),
            axios.get(`http://localhost:5000/api/v1/sessions/my-sessions?userId=${user._id || user.id}`)
        ]);
        
        setStats(profileRes.data.stats);
        
        const upcoming = sessionsRes.data.sessions.find(s => s.status === 'scheduled');
        setNextSession(upcoming || null);
      } catch (error) {
         console.error(error);
      } finally {
          setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-black text-slate-900 tracking-tight"
            >
              Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{user?.name?.split(' ')[0] || 'Student'}</span> 👋
            </motion.h1>
            <p className="text-slate-500 font-medium mt-2 text-lg">You're on a {stats?.streak || 0}-day learning streak! Keep it up.</p>
          </div>
          <Link to="/trainers">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-slate-900/20 flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Play size={16} className="text-white fill-white ml-0.5" />
              </div>
              Practice Now
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
              className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-colors"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full pointer-events-none opacity-50"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider text-xs mb-2">
                    <Award size={16} /> Angelina AI Analysis
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Current Confidence</h2>
                  <p className="text-slate-500 mt-1">Based on your past sessions</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black tracking-tight">{stats?.progress_score || 0}<span className="text-slate-300 text-xl font-bold">/100</span></div>
                  <div className="text-blue-600 font-bold text-sm mt-1">{stats?.progress_score > 70 ? 'Excellent Fluency' : 'Building Confidence'}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-8">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats?.progress_score || 10}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full relative"
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
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="text-blue-600" /> Upcoming Session
                  </h2>
                  <Link to="/history" className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors cursor-pointer">View All</Link>
               </div>
               
               {nextSession ? (
                 <div className="bg-slate-900 rounded-[2rem] p-6 md:p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-transparent pointer-events-none"></div>
                   
                   <div className="flex items-center gap-5 w-full md:w-auto relative z-10">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-3xl uppercase shadow-sm border-2 border-slate-700">
                          {nextSession.trainer_id?.user_id?.name?.charAt(0) || 'T'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{nextSession.trainer_id?.user_id?.name || 'Trainer'}</h3>
                        <p className="text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                          <Star size={16} className="text-yellow-500 fill-yellow-500" />
                          Session Confirmed
                        </p>
                      </div>
                   </div>

                   <div className="flex items-center gap-6 md:gap-8 w-full md:w-auto bg-white/5 rounded-2xl px-6 py-4 backdrop-blur-md relative z-10 border border-white/10">
                      <div className="text-center">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Time</p>
                        <p className="font-semibold text-lg">{new Date(nextSession.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="w-px h-10 bg-white/10"></div>
                      <div className="text-center">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Date</p>
                        <p className="font-semibold text-lg">{new Date(nextSession.scheduled_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                      </div>
                   </div>

                   <Link to={`/session/${nextSession.meeting_url}`}>
                     <motion.button 
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       className="w-full md:w-auto bg-white text-slate-900 px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-white/20 flex items-center justify-center gap-2 cursor-pointer z-10 relative group"
                     >
                        <Video size={18} className="text-blue-600 group-hover:scale-110 transition-transform" /> Join Room
                     </motion.button>
                   </Link>
                 </div>
               ) : (
                 <div className="bg-white rounded-[2rem] p-10 border border-slate-200 text-center shadow-sm">
                    <Calendar size={40} className="mx-auto text-slate-300 mb-4" />
                    <h4 className="font-bold text-slate-900 mb-2 text-xl">No Upcoming Classes</h4>
                    <p className="text-slate-500 mb-6 font-medium">You don't have any classes scheduled yet.</p>
                    <Link to="/trainers" className="bg-blue-50 text-blue-700 font-bold py-3 px-6 rounded-xl hover:bg-blue-100 transition-colors inline-block tracking-wide cursor-pointer">Find an Expert Trainer</Link>
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
              className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-30"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/20">
                  <Zap size={24} className="text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Speakerlly Premium</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">Get unlimited AI mock interviews & 24/7 priority booking.</p>
                <button onClick={() => alert("Premium Tier checkout opening soon!")} className="w-full bg-white text-slate-900 font-bold py-3.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg cursor-pointer">
                  Upgrade Now
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
