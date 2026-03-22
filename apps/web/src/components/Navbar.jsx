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
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform duration-300">
              <Bot size={24} />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">Speakerlly</span>
            <span className="hidden sm:inline-block bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-3 ml-1">Beta</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  location.pathname === link.path 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all cursor-pointer">
              <Bell size={22} />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            {user ? (
               <Link to="/profile" className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                 <div className="w-9 h-9 flex-shrink-0 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                   {user.name.charAt(0).toUpperCase()}
                 </div>
                 <div className="text-left hidden sm:block">
                   <div className="text-sm font-bold text-slate-900 leading-none mb-1">{user.name.split(' ')[0]}</div>
                   <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{user.role || 'Member'}</div>
                 </div>
               </Link>
            ) : (
                <Link to="/auth" className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                  <div className="w-9 h-9 flex-shrink-0 rounded-full bg-slate-900 flex items-center justify-center text-white">
                    <User size={18} />
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-sm font-bold text-slate-900 leading-none mb-1">Sign In</div>
                    <div className="text-xs text-slate-500 font-medium">Join Angelina</div>
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
