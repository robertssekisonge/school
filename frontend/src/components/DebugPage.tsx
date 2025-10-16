import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DebugPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Debug Page</h1>
      <h2>Auth Status:</h2>
      <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
      <p><strong>User:</strong> {user ? 'Logged in' : 'Not logged in'}</p>
      {user && (
        <div>
          <p><strong>Name:</strong> {user.full_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
      <h2>Actions:</h2>
      <a href="/" style={{ marginRight: '10px', padding: '10px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none' }}>Go to Home</a>
      <a href="/login" style={{ marginRight: '10px', padding: '10px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none' }}>Go to Login</a>
      <a href="/admin" style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', textDecoration: 'none' }}>Go to Admin</a>
    </div>
  );
};

export default DebugPage;


