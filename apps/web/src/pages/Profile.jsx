import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Award, CheckCircle2, Activity, Edit2, Loader2, LogOut } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
                const { data } = await axios.get(`http://localhost:5000/api/v1/users/me?userId=${user._id || user.id}`);
                setStats(data.stats);
                setFormData({ name: data.user.name, email: data.user.email });
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
            await axios.put(`http://localhost:5000/api/v1/users/me?userId=${user._id || user.id}`, formData);
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

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 pb-24">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profile Settings</h1>
                    <button onClick={handleLogout} className="flex items-center gap-2 bg-red-100/50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer text-sm shadow-sm group">
                        <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Left Col: Personal Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                            
                            <div className="relative mt-4">
                                <div className="w-24 h-24 bg-white rounded-full p-1.5 shadow-xl mb-6">
                                    <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                        <User size={40} />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                                    <div className="w-full">
                                        {!isEditing ? (
                                            <>
                                                <h2 className="text-2xl font-bold text-slate-900 mb-1">{formData.name}</h2>
                                                <p className="text-slate-500 font-medium flex items-center gap-2">
                                                    <Mail size={16} className="text-slate-400" /> {formData.email}
                                                </p>
                                                <div className="mt-4 inline-block bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md">
                                                    {user.role === 'trainer' ? 'Speakerlly Trainer' : 'Plus Member'}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="space-y-5 w-full pr-0 sm:pr-8">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-b-2 border-slate-200 focus:border-blue-600 py-2 outline-none font-bold text-lg transition-colors bg-transparent" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                                                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-b-2 border-slate-200 focus:border-blue-600 py-2 outline-none font-medium text-slate-600 transition-colors bg-transparent" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <button 
                                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                        className="bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 px-5 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center w-full sm:w-auto gap-2 whitespace-nowrap cursor-pointer shadow-sm"
                                    >
                                        {isEditing ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Edit2 size={16} />}
                                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Plan Info */}
                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
                            <h3 className="text-indigo-300 font-bold uppercase tracking-widest text-xs mb-2">Current Plan</h3>
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-3xl font-black mb-1">Speakerlly Plus</h2>
                                    <p className="text-slate-400 text-sm font-medium">Valid until Dec 2026</p>
                                </div>
                                <button onClick={() => alert("Premium upgrades checkout opening soon!")} className="bg-white text-indigo-900 px-5 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform cursor-pointer shadow-lg">Upgrade</button>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Stats */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 shadow-inner">
                                <Award size={24} />
                            </div>
                            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Angelina Score</h3>
                            <p className="text-4xl font-black text-slate-900 mt-1 tracking-tight">{stats?.progress_score || 0}<span className="text-xl text-slate-400 font-bold">/100</span></p>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:border-emerald-200 transition-colors">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Total Sessions</h3>
                            <p className="text-4xl font-black text-slate-900 mt-1 tracking-tight">{stats?.completed_sessions || 0}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
