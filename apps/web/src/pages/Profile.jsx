import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Award, CheckCircle2, Activity, Edit2, Loader2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateCurrentUser } from '../api/userService';
import { getProgressSummary } from '../api/progressService';
import { getSessionHistory } from '../api/sessionService';

const Profile = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    useEffect(() => {
        if(!user) return;
        const fetchProfile = async () => {
            try {
                const [userData, progressData, sessionsData] = await Promise.all([
                    getCurrentUser(),
                    getProgressSummary(),
                    getSessionHistory()
                ]);
                
                setStats({
                    progress_score: Math.min((progressData.totalMinutes / 600) * 100, 100).toFixed(0),
                    completed_sessions: sessionsData.filter(s => s.status === 'COMPLETED').length
                });
                setFormData({ name: userData.name, email: userData.email });
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    const handleSave = async () => {
        try {
            await updateCurrentUser(formData);
            setIsEditing(false);
            // Updating local storage state to reflect UI changes across the app immediately
            const safeUser = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...safeUser, name: formData.name, email: formData.email }));
            window.location.reload(); 
        } catch (error) {
            alert("Failed to update profile");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center relative z-10"><Loader2 className="animate-spin text-purple-500 w-12 h-12 drop-shadow-[0_0_15px_purple]" /></div>;

    return (
        <div className="min-h-screen py-12 px-6 pb-24 text-white relative z-10">
            <div className="max-w-4xl mx-auto mt-4">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white tracking-tighter">Avatar Hub</h1>
                    <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-5 py-2.5 rounded-full font-bold transition-all cursor-pointer text-sm border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)] group">
                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Disconnect Wallet
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Left Col: Personal Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-[#1a0b2e]/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-[0_0_40px_rgba(168,85,247,0.1)] relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-b border-white/5 opacity-50"></div>
                            
                            <div className="relative mt-4">
                                <div className="w-28 h-28 bg-black/50 backdrop-blur-md rounded-2xl p-2 shadow-[0_0_30px_rgba(168,85,247,0.3)] mb-6 border border-purple-500/50">
                                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white">
                                        <User size={48} />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                                    <div className="w-full">
                                        {!isEditing ? (
                                            <>
                                                <h2 className="text-3xl font-black text-white mb-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{formData.name}</h2>
                                                <p className="text-slate-400 font-medium flex items-center gap-2 tracking-wide">
                                                    <Mail size={16} className="text-purple-500" /> {formData.email}
                                                </p>
                                                <div className="mt-4 inline-block bg-purple-500/20 border border-purple-500/30 text-pink-300 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                                    {user.role === 'trainer' ? 'Certified Explorer' : 'Elite Member'}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="space-y-5 w-full pr-0 sm:pr-8">
                                                <div>
                                                    <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Digital ID</label>
                                                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-b-2 border-white/10 focus:border-purple-500 py-3 outline-none font-bold text-xl transition-colors bg-white/5 backdrop-blur-md px-3 rounded-t-lg text-white mt-1" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Comms Node</label>
                                                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-b-2 border-white/10 focus:border-purple-500 py-3 outline-none font-medium text-slate-300 transition-colors bg-white/5 backdrop-blur-md px-3 rounded-t-lg mt-1" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <button 
                                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                        className={`px-6 py-3 rounded-xl font-black transition-all flex items-center justify-center w-full sm:w-auto gap-2 whitespace-nowrap cursor-pointer shadow-sm border ${
                                            isEditing 
                                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                                            : 'bg-white/5 text-purple-300 border-purple-500/30 hover:bg-white/10 hover:border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                                        }`}
                                    >
                                        {isEditing ? <CheckCircle2 size={16} /> : <Edit2 size={16} />}
                                        {isEditing ? 'Confirm State' : 'Modify Code'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Plan Info */}
                        <div className="bg-[#1a0b2e]/80 backdrop-blur-xl p-8 rounded-[2rem] text-white shadow-[0_0_40px_rgba(217,70,239,0.15)] relative overflow-hidden border border-pink-500/30 group">
                            <div className="absolute -right-10 -top-10 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px] group-hover:bg-pink-500/30 transition-colors"></div>
                            <h3 className="text-pink-400 font-black uppercase tracking-widest text-xs mb-3">Clearance Level</h3>
                            <div className="flex justify-between items-end relative z-10">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-white">Speakerly Genesis</h2>
                                    <p className="text-purple-300/70 text-sm font-medium tracking-wide">Valid across the ecosystem</p>
                                </div>
                                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white px-6 py-2 rounded-xl font-bold text-sm border border-purple-400/30 shadow-[0_0_15px_rgba(217,70,239,0.4)]">Synced</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Stats */}
                    <div className="space-y-6">
                        <div className="bg-[#0f0a1a]/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 shadow-xl hover:border-purple-500/40 transition-colors group">
                            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-6 border border-purple-500/30 shadow-[0_0_15px_purple] group-hover:scale-110 transition-transform">
                                <Award size={28} />
                            </div>
                            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Grid Rating</h3>
                            <p className="text-5xl font-black text-white mt-1 tracking-tighter drop-shadow-[0_0_10px_purple]">{stats?.progress_score || 0}<span className="text-2xl text-purple-500/50 font-bold">/100</span></p>
                        </div>

                        <div className="bg-[#0f0a1a]/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/5 shadow-xl hover:border-pink-500/40 transition-colors group">
                            <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-400 mb-6 border border-pink-500/30 shadow-[0_0_15px_pink] group-hover:scale-110 transition-transform">
                                <Activity size={28} />
                            </div>
                            <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Blocks Mined</h3>
                            <p className="text-5xl font-black text-white mt-1 tracking-tighter drop-shadow-[0_0_10px_pink]">{stats?.completed_sessions || 0}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
