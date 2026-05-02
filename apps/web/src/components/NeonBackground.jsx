import React, { useEffect, useState } from 'react';

const NeonBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#0a0a0f]">
      {/* Base Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      ></div>

      {/* Mouse Gradient Follower */}
      <div
        className="absolute hidden sm:block w-[600px] h-[600px] rounded-full blur-[100px] opacity-40 transition-transform duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(217,70,239,0.1) 40%, rgba(99,102,241,0) 70%)',
          transform: `translate(${mousePosition.x - 300}px, ${mousePosition.y - 300}px)`
        }}
      />

      {/* Floating Orbs Top Left */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] bg-purple-600/30 animate-[float_10s_ease-in-out_infinite]"></div>
      
      {/* Floating Orbs Bottom Right */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-indigo-600/20 animate-[float_15s_ease-in-out_infinite_reverse]"></div>
    </div>
  );
};

export default NeonBackground;
