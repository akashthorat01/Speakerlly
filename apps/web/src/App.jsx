import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import NeonBackground from './components/NeonBackground';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import Trainers from './pages/Trainers';
import Auth from './pages/Auth';
import LiveSession from './pages/LiveSession';
import AngelinaBot from './components/AngelinaBot';
import Booking from './pages/Booking';
import History from './pages/History';
import TrainerDashboard from './pages/TrainerDashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { Navigate } from 'react-router-dom';

function App() {
  const { user } = useAuthStore();
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-purple-500/30 relative overflow-x-hidden">
        <NeonBackground />
        <Navbar />
        <Routes>
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={user?.role === 'trainer' ? <Navigate to="/trainer-dashboard" /> : <Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/session/:roomId" element={<LiveSession />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/book/:trainerId" element={<Booking />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin', 'trainer']} />}>
            <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
          </Route>
          {/* Default fallback for unbuilt pages */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-[70vh] relative z-10">
              <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-[0_0_10px_purple]">Coming Soon</h1>
              <p className="text-purple-300 font-medium">This page is under construction by Angelina.</p>
            </div>
          } />
        </Routes>
        <AngelinaBot />
      </div>
    </Router>
  );
}

export default App;
