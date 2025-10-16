import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../LoginForm';
import AdminDashboard from './AdminDashboard';
import ErrorBoundary from '../ErrorBoundary';

const AdminPanel: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  console.log('AdminPanel - user:', user);
  console.log('AdminPanel - isLoading:', isLoading);
  console.log('AdminPanel - user role:', user?.role);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show loading initially - just check if user exists
  if (!user) {
    console.log('AdminPanel - No user, showing login form');
    return <LoginForm />;
  }

  if (user.role !== 'admin') {
    console.log('AdminPanel - User is not admin, role:', user.role);
    return <div>Access denied. Admin role required.</div>;
  }

  console.log('AdminPanel - User is admin, showing dashboard');
  return (
    <ErrorBoundary>
      <AdminDashboard />
    </ErrorBoundary>
  );
};

export default AdminPanel;