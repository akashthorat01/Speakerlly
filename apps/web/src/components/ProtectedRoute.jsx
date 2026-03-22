import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (allowedRoles && (!user.role || !allowedRoles.includes(user.role.toLowerCase()))) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-xl font-bold text-slate-700">Unauthorized Access</p></div>;
    }

    return <Outlet />;
};

export default ProtectedRoute;
