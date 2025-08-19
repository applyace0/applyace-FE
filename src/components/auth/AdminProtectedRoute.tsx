import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'ok' | 'forbidden'>('checking');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    // Optionally validate token with backend
    fetch('/api/admin/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.role === 'admin') {
          setStatus('ok');
        } else {
          setStatus('forbidden');
        }
      })
      .catch(() => setStatus('forbidden'));
  }, [navigate]);

  if (status === 'checking') {
    return <div className="flex items-center justify-center min-h-screen">Checking admin access...</div>;
  }
  if (status === 'forbidden') {
    return <div className="flex items-center justify-center min-h-screen text-red-600 text-xl">403 – Forbidden (Admin Only)</div>;
  }
  return <>{children}</>;
} 