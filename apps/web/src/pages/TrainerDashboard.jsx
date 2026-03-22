import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Calendar, Wallet, CheckCircle2, XCircle, Clock, Loader2, Video, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TrainerDashboard = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [trainerData, setTrainerData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrainerData = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/v1/sessions/trainer-sessions?userId=${user._id || user.id}`);
                setSessions(data.sessions);
                setTrainerData(data.trainer);
            } catch (error) {
                console.error("Failed to load trainer data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrainerData();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    }

    const updateStatus = async (sessionId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/v1/sessions/${sessionId}/status`, { status: newStatus });
            setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, status: newStatus } : s));
        } catch (error) {
            alert("Failed to update status");
        }
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;
    }

    const pendingRequests = sessions.filter(s => s.status === 'scheduled');
    const acceptedSessions = sessions.filter(s => s.status === 'accepted');

    return (
        <div className="min-h-screen bg-slate-900 text-white pb-20">
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 p-8 shadow-lg">
                <div className="max-w-6xl mx-auto flex justify-between items-end">
                    <div>
                        <div className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div> Speakerlly For Trainers</div>
                        <h1 className="text-3xl font-black">Welcome back, {user.name.split(' ')[0]}</h1>
                    </div>
                    <button onClick={handleLogout} className="text-slate-400 hover:text-white flex items-center gap-2 font-bold cursor-pointer transition-colors">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Analytics Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
                                <Wallet size={24} />
                            </div>
                            <div>
                                <h3 className="text-slate-400 font-medium">Total Earnings</h3>
                                <p className="text-2xl font-black">₹{trainerData?.earnings || 0}</p>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-2xl mb-4 border border-slate-700">
                            <p className="text-sm font-bold text-slate-300 flex justify-between">
                                Sessions Completed <span className="text-white">{trainerData?.completed_sessions || 0}</span>
                            </p>
                        </div>
                        
                        <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
                            <p className="text-xs text-red-300 font-medium leading-relaxed">
                                <span className="font-bold text-red-400 uppercase tracking-widest block mb-1">Penalty Policy</span>
                                Missing a confirmed session results in a 3% deduction from your monthly payout.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Pending Requests */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Clock className="text-amber-500" /> Pending Requests
                        </h2>
                        {pendingRequests.length === 0 ? (
                            <div className="bg-slate-800/30 border border-slate-700 border-dashed rounded-3xl p-10 text-center text-slate-500">
                                No pending requests right now.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingRequests.map(session => (
                                    <div key={session._id} className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div>
                                            <p className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-1">New Request</p>
                                            <h3 className="text-lg font-bold">{session.user_id.name}</h3>
                                            <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                                                <Calendar size={14} /> {new Date(session.scheduled_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button onClick={() => updateStatus(session._id, 'rejected')} className="flex-1 sm:flex-none px-4 py-2 bg-slate-700 hover:bg-red-500/20 hover:text-red-400 text-slate-300 rounded-xl font-bold transition-colors cursor-pointer text-sm">
                                                Decline
                                            </button>
                                            <button onClick={() => updateStatus(session._id, 'accepted')} className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/20 cursor-pointer text-sm">
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upcoming Sessions */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 mt-10">
                            <CheckCircle2 className="text-emerald-500" /> Confirmed Sessions
                        </h2>
                        {acceptedSessions.length === 0 ? (
                            <div className="bg-slate-800/30 border border-slate-700 border-dashed rounded-3xl p-10 text-center text-slate-500">
                                Your upcoming schedule is clear.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {acceptedSessions.map(session => (
                                    <div key={session._id} className="bg-gradient-to-r from-blue-900/40 to-slate-800 p-6 rounded-3xl border border-blue-500/20 shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div>
                                            <h3 className="text-lg font-bold">{session.user_id.name}</h3>
                                            <p className="text-slate-300 text-sm mt-1 flex items-center gap-2 font-medium">
                                                <Calendar size={14} className="text-blue-400" /> {new Date(session.scheduled_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <Link to={`/session/${session.meeting_url}`} className="w-full sm:w-auto px-6 py-3 bg-white text-blue-900 rounded-xl font-bold transition-all shadow-lg hover:scale-105 cursor-pointer text-sm flex justify-center items-center gap-2">
                                            <Video size={16} /> Enter Room
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TrainerDashboard;
