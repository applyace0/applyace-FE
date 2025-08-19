import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export function AuthGuard() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading ApplyAce...</p>
        </div>
      </div>
    );
  }
  
  return user ? <Outlet /> : <Navigate to="/auth" replace />;
}
