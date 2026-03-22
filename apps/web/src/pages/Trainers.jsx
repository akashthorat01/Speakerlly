import React, { useState, useEffect } from 'react';
import { Search, Star, Filter, MessageSquare, Video, Calendar, StarHalf, Play, Award, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Trainers = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/v1/trainers');
        setTrainers(data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrainers();
  }, []);



  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.3),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="md:w-1/2">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            >
              Find Your Perfect <span className="text-blue-400">English Expert</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-300 max-w-lg leading-relaxed"
            >
              Connect with certified native speakers and experienced trainers. Book a session and start improving today.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full md:w-auto flex-1 max-w-md relative"
          >
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-11 pr-4 py-4 md:py-5 border-none rounded-2xl bg-white/10 backdrop-blur-md text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white/20 transition-all shadow-xl shadow-black/10 outline-none" 
                placeholder="Search by name, accent, or specialty..." 
              />
              <button className="absolute inset-y-2 right-2 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors cursor-pointer">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide">
            {['All', 'Available Today', 'American Accent', 'British Accent', 'IELTS Prep'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-slate-600 font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors w-full md:w-auto justify-center cursor-pointer flex-shrink-0">
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Trainers Grid */}
        {isLoading ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 size={40} className="animate-spin mb-4 text-blue-500" />
                <p className="font-semibold text-lg">Loading expert trainers...</p>
            </div>
        ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnimatePresence>
            {trainers.map((trainer, index) => (
              <motion.div 
                key={trainer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col sm:flex-row"
              >
                {/* Left side: Image & Quick actions */}
                <div className="sm:w-2/5 relative">
                  <img 
                    src={trainer.image} 
                    alt={trainer.name} 
                    className="w-full h-56 sm:h-full object-cover"
                  />
                  {trainer.availableToday && (
                    <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> Available Today
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                     <button className="bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-blue-600 p-4 rounded-full transition-all shadow-lg cursor-pointer transform hover:scale-110">
                       <Play size={20} className="fill-current" />
                     </button>
                  </div>
                </div>

                {/* Right side: Content */}
                <div className="p-6 sm:w-3/5 flex flex-col justify-between bg-white relative">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                           {trainer.name}
                           {trainer.rating === 5.0 && <Award size={18} className="text-blue-500" />}
                         </h3>
                         <div className="flex items-center gap-1.5 mt-1">
                           <Star size={16} className="text-yellow-400 fill-yellow-400" />
                           <span className="font-bold text-slate-700">{trainer.rating}</span>
                           <span className="text-slate-400 text-sm">({trainer.reviews} reviews)</span>
                         </div>
                       </div>
                       <div className="text-right">
                         <div className="text-xl font-black text-blue-600">{trainer.price}</div>
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-2 my-4 relative z-10">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                        {trainer.accent} Accent
                      </span>
                      {trainer.specialties.map(spec => (
                        <span key={spec} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                          {spec}
                        </span>
                      ))}
                    </div>

                    <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed mb-6">
                      {trainer.bio}
                    </p>
                  </div>

                  <div className="flex gap-3 relative z-10 pt-4 border-t border-slate-100 mt-auto">
                    <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-3 rounded-xl font-bold border border-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm">
                      <MessageSquare size={16} /> Message
                    </button>
                    <Link to={`/book/${trainer.id}`} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-600/30 cursor-pointer flex items-center justify-center gap-2 text-sm">
                      <Calendar size={16} /> Book Session
                    </Link>
                  </div>
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

export default Trainers;
