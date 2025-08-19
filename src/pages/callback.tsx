import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AdminCallback() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const isAdmin = session.user.user_metadata?.role === 'admin';
        if (isAdmin) {
          localStorage.setItem('admin_token', session.access_token);
          navigate('/admin/dashboard');
        } else {
          setError('You are not authorized.');
          await supabase.auth.signOut();
        }
      } else {
        setError('Login failed or cancelled.');
      }
    }
    checkAdmin();
  }, [navigate]);

  if (error) {
    return <div className="text-red-600 text-center mt-8">{error}</div>;
  }
  return <div className="text-center mt-8">Checking admin status...</div>;
} 