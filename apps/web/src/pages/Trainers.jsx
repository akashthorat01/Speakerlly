import React, { useState, useEffect } from 'react';
import { Search, Star, Filter, MessageSquare, Calendar, Play, Award, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTrainers } from '../api/trainerService';
import { useNavigate } from 'react-router-dom';
import StatsSection from '../components/StatsSection';

const Trainers = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainersData = async () => {
      try {
        const data = await getTrainers();
        setTrainers(data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrainersData();
  }, []);

  const handleBook = (trainerId) => {
    navigate(`/book/${trainerId}`);
  };

  // Divide trainers arbitrarily for layout aesthetics
  const featuredTrainers = trainers.slice(0, Math.ceil(trainers.length / 2));
  const trendingTrainers = trainers.slice(Math.ceil(trainers.length / 2));

  // The NFT Card Component isolated for neatness
  const NFTCard = ({ trainer, index }) => (
    <motion.div 
      key={trainer.trainerId}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-lg hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 group flex flex-col relative"
    >
      <div className="relative h-64 overflow-hidden">
        <motion.img 
          src={trainer.demoVideoUrl || 'https://i.pravatar.cc/150?u=' + trainer.trainerId} 
          alt={trainer.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        {trainer.availableToday && (
          <div className="absolute top-4 left-4 bg-[#a855f7]/80 backdrop-blur-md text-white text-xs tracking-widest font-bold px-4 py-2 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)] flex items-center gap-2 border border-purple-400/30">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_5px_#fff]"></div> LIVE NOW
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
      </div>

      <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-[#1a0b2e]/50 to-transparent">
        <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors flex items-center gap-2">
                {trainer.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 border border-white/10 bg-white/5 w-max px-3 py-1 rounded-lg">
                <Star size={14} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]" />
                <span className="font-bold text-white text-sm">{trainer.rating}</span>
                <span className="text-white/50 text-xs">({trainer.reviews})</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-purple-300/70 uppercase tracking-widest font-black mb-1">Session Rate</div>
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                ₹300
              </div>
            </div>
        </div>

        <div className="flex flex-wrap gap-2 my-4">
          <span className="px-3 py-1.5 bg-black/40 text-purple-300 text-xs font-bold tracking-wide rounded-lg border border-purple-500/20 shadow-[inset_0_1px_2px_rgba(168,85,247,0.3)]">
            {trainer.specialisation || 'General English'}
          </span>
        </div>

        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-6 font-light">
          {trainer.bio}
        </p>

        <div className="flex gap-3 mt-auto">
          <button className="h-12 w-12 flex-shrink-0 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/10 transition-colors cursor-pointer flex items-center justify-center backdrop-blur-md">
            <MessageSquare size={18} />
          </button>
          <button 
            onClick={() => handleBook(trainer.trainerId)} 
            className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-black tracking-wider transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] cursor-pointer flex items-center justify-center gap-2 text-sm relative overflow-hidden group/btn"
          >
             <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></span>
             <span className="relative flex items-center gap-2"><Calendar size={18} /> MINT SESSION</span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen text-white relative">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899] animate-pulse"></span>
            <span className="text-sm font-semibold tracking-widest text-purple-300 uppercase">Speakerlly V2 Mint</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight max-w-4xl"
          >
            Master English with <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              Elite Global Experts
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl font-light leading-relaxed mb-10"
          >
            Connect with top-tier native trainers. Book your 1-on-1 sessions and elevate your speaking confidence to new dimensions.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full max-w-xl relative group z-20"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative flex items-center bg-[#1a0b2e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
              <Search className="h-6 w-6 text-purple-400 ml-4 pointer-events-none" />
              <input 
                type="text" 
                className="block w-full px-4 py-4 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 outline-none font-medium" 
                placeholder="Search trainers, accents, drops..." 
              />
              <button className="px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-xl font-black tracking-wide transition-colors cursor-pointer uppercase text-sm">
                Explore
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Filters */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
           className="flex flex-col md:flex-row items-center justify-between gap-4 mb-16"
        >
          <div className="flex gap-3 overflow-x-auto w-full pb-4 md:pb-0 scrollbar-hide mask-gradient">
            {['All Drops', 'Live Now', 'US Accent', 'UK Accent', 'IELTS Masters'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all cursor-pointer border ${
                  activeTab === tab 
                    ? 'bg-purple-600/20 text-purple-300 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                    : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0 backdrop-blur-md">
            <Filter size={18} /> Advanced
          </button>
        </motion.div>

        {isLoading ? (
            <div className="w-full py-32 flex flex-col items-center justify-center text-purple-400">
                <Loader2 size={50} className="animate-spin mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                <p className="font-bold tracking-widest uppercase text-sm animate-pulse">Syncing Blockchain...</p>
            </div>
        ) : (
        <>
          {/* Featured Trainers Section */}
          <div className="mb-20">
            <div className="flex items-end justify-between mb-8">
               <div>
                 <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Featured Drops</h2>
                 <p className="text-purple-400/80 mt-2 font-medium">Top-rated native speakers available today.</p>
               </div>
               <button className="hidden md:flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold transition-colors">
                  View All <ArrowRight size={20} />
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {featuredTrainers.map((trainer, index) => (
                  <NFTCard key={trainer.id} trainer={trainer} index={index} />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <StatsSection />

          {/* Trending Section */}
          <div className="my-20">
            <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-8">Trending Ecosystem</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               <AnimatePresence>
                {trendingTrainers.map((trainer, index) => (
                  <NFTCard key={trainer.id} trainer={trainer} index={index} />
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          {/* CTA Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full rounded-[3rem] p-12 md:p-20 relative overflow-hidden bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 text-center shadow-[0_0_100px_rgba(168,85,247,0.15)] mb-32"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/20 blur-[150px] rounded-full point-events-none"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Ready to Elevate <br />Your Voice?</h2>
              <p className="text-xl text-purple-200 mb-10 font-light">Join the future of language learning. Book your first 1-on-1 session and enter the elite Speakerlly ecosystem.</p>
              <button className="px-10 py-5 bg-white text-black hover:bg-slate-200 hover:scale-105 active:scale-95 rounded-2xl font-black tracking-widest transition-all cursor-pointer uppercase text-sm shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                Connect Wallet (Just Kidding)
              </button>
            </div>
          </motion.div>
        </>
        )}
      </div>
    </div>
  );
};

export default Trainers;
