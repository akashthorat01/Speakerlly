import React from 'react';
import { Bot, Bell, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  
  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Find Trainers', path: '/trainers' },
    { name: 'My Sessions', path: '/history' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0a0a0f]/80 border-b border-purple-500/20 shadow-[0_4px_30px_rgba(168,85,247,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform duration-300 border border-white/10">
              <Bot size={24} />
            </div>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white tracking-tight drop-shadow-[0_0_10px_rgba(168,85,247,0.2)]">Speakerlly</span>
            <span className="hidden sm:inline-block bg-purple-500/20 text-pink-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-3 ml-1 border border-pink-500/30 shadow-[0_0_10px_purple]">Beta</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className={`px-5 py-2 rounded-full font-bold tracking-wide transition-all ${
                  location.pathname === link.path 
                    ? 'bg-purple-600/30 text-purple-200 shadow-[inset_0_0_10px_rgba(168,85,247,0.3)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="p-2.5 text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-full transition-all cursor-pointer">
              <Bell size={22} className="drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
            </button>
            <div className="w-px h-6 bg-white/10 mx-1"></div>
            {user ? (
               <Link to="/profile" className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-purple-500/30 transition-all cursor-pointer">
                 <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-black text-sm shadow-[0_0_15px_rgba(217,70,239,0.5)] border border-white/20">
                   {user.name.charAt(0).toUpperCase()}
                 </div>
                 <div className="text-left hidden sm:block">
                   <div className="text-sm font-bold text-white leading-none mb-1">{user.name.split(' ')[0]}</div>
                   <div className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">{user.role || 'Member'}</div>
                 </div>
               </Link>
            ) : (
                <Link to="/auth" className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-purple-500/30 transition-all cursor-pointer">
                  <div className="w-9 h-9 flex-shrink-0 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-slate-400">
                    <User size={18} />
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-bold text-white leading-none mb-1">Sign In</div>
                    <div className="text-xs text-purple-400 font-medium">Connect</div>
                  </div>
                </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
