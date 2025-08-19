import React from 'react';
import { useAuth } from '@/lib/auth';

export const AuthDebug: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();

  return (
    <div className="fixed top-20 right-4 bg-white p-4 rounded-lg shadow-lg border z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">🔍 Auth Debug</h3>
      <div className="text-xs space-y-1">
        <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
        <div><strong>isAuthenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
        <div><strong>User:</strong> {user ? 'Present' : 'None'}</div>
        {user && (
          <>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>ID:</strong> {user.id}</div>
            <div><strong>Name:</strong> {user.user_metadata?.full_name || 'N/A'}</div>
          </>
        )}
      </div>
    </div>
  );
}; 