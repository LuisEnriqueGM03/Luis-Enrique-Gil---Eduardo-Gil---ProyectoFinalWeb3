import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AccessDenied from './AccessDenied';

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const token = localStorage.getItem('auth_token');
    if (!isAuthenticated && !token) {
        return <Navigate to="/" replace />;
    }

    if (user?.rol !== 'SuperAdministrador') {
        return <AccessDenied />;
    }

    return <Outlet />;
};

export default ProtectedRoute; 