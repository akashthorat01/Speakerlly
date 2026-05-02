import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CountUp = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}</span>;
}

const StatsSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.1)] relative overflow-hidden">
        
        {/* Subtle glow inside the exact glass panel */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-indigo-500/10 opacity-50"></div>

        <div className="flex flex-col items-center justify-center text-center p-4">
          <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] to-[#d946ef] mb-2 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <CountUp end={24} />K+
          </div>
          <div className="text-slate-300 font-semibold tracking-wide text-sm uppercase">Active Students</div>
        </div>

        <div className="flex flex-col items-center justify-center text-center p-4">
          <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] to-[#d946ef] mb-2 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <CountUp end={100} />%
          </div>
          <div className="text-slate-300 font-semibold tracking-wide text-sm uppercase">Confidence Boost</div>
        </div>

        <div className="flex flex-col items-center justify-center text-center p-4">
          <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] to-[#d946ef] mb-2 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <CountUp end={500} />+
          </div>
          <div className="text-slate-300 font-semibold tracking-wide text-sm uppercase">Elite Trainers</div>
        </div>

        <div className="flex flex-col items-center justify-center text-center p-4">
          <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] to-[#d946ef] mb-2 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <CountUp end={50} />+
          </div>
          <div className="text-slate-300 font-semibold tracking-wide text-sm uppercase">Countries</div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
