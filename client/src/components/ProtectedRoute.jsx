// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
    const { user, ready } = useContext(UserContext);
    if (!ready) {
        return null; 
    }
    if (!user) {
        return <Navigate to="/login" />;
    }
    if (user.role !== 'admin' && user.role !== 'villa owner') {
        return <Navigate to="/" />;
    }
    return children;
};

export default ProtectedRoute;
