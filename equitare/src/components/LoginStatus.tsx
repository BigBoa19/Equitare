import React from 'react';
import { useAuth } from '../context/AuthContext';

const LoginStatus: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 rounded-md shadow-sm">
        <p className="text-gray-600">Checking authentication status...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
      
      {isAuthenticated ? (
        <div className="space-y-2">
          <p className="text-green-600">✅ You are currently logged in</p>
          <div className="bg-white p-3 rounded-md">
            <h3 className="font-medium">User Information:</h3>
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
            <p>University: {user?.university}</p>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-red-600">❌ You are not logged in</p>
          <p className="mt-2">Please log in to access all features</p>
        </div>
      )}
    </div>
  );
};

export default LoginStatus; 