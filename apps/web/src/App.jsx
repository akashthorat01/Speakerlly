import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
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
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
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
            <div className="flex flex-col items-center justify-center h-[70vh]">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Coming Soon</h1>
              <p className="text-slate-500 font-medium">This page is under construction by Angelina.</p>
            </div>
          } />
        </Routes>
        <AngelinaBot />
      </div>
    </Router>
  );
}

export default App;
