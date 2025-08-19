import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function AdminGuard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (user.user_metadata?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-red-600">Access Denied</h2>
            <p className="text-gray-600 mb-4">You do not have permission to access the admin panel.</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return <Outlet />;
} 