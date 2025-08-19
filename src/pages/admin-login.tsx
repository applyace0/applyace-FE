import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('admin_token')) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.token) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
      localStorage.setItem('admin_token', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'http://localhost:3000/auth/callback' } });
    if (error) {
      setError('Google SSO failed');
      setGoogleLoading(false);
      return;
    }
    // The user will be redirected to /auth/callback after Google login
  }

  // On mount, check if redirected from Google SSO and if user is admin
  useEffect(() => {
    async function checkAdminAfterSSO() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const user = session.user;
        const isAdmin = user.user_metadata?.role === 'admin';
        if (isAdmin) {
          // Optionally, get a backend-issued admin_token
          localStorage.setItem('admin_token', session.access_token);
          navigate('/admin/dashboard');
        } else {
          setError('Access denied. You do not have admin privileges.');
          await supabase.auth.signOut();
        }
      }
    }
    checkAdminAfterSSO();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition mb-4 flex items-center justify-center"
          disabled={googleLoading}
        >
          {googleLoading ? 'Signing in with Google...' : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="#fff" d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.23-1.4 3.6-5.27 3.6-3.17 0-5.76-2.62-5.76-5.85s2.59-5.85 5.76-5.85c1.81 0 3.03.77 3.73 1.43l2.55-2.47C16.13 3.36 14.29 2.5 12 2.5 6.76 2.5 2.5 6.76 2.5 12s4.26 9.5 9.5 9.5c5.47 0 9.09-3.85 9.09-9.27 0-.62-.07-1.1-.16-1.63z"/></svg>
              Sign in with Google
            </>
          )}
        </button>
        <div className="text-center text-gray-500 mb-4">or</div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
} 