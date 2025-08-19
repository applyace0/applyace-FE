import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoute';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import React from 'react';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, info: any) { console.error(error, info); }
  render() {
    if (this.state.hasError) return <div>Something went wrong rendering the analytics dashboard.</div>;
    return this.props.children;
  }
}

export default function ApiUsageAdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  }, []);

  useEffect(() => {
    const fetchUsageStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          console.error('No session token available');
          return;
        }
        const response = await fetch('/api/admin/usage', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
        });
        if (response.status === 403) {
          console.error('Access denied to usage stats');
          return;
        }
        if (!response.ok) {
          console.error('Failed to fetch usage stats:', response.statusText);
          return;
        }
        const stats = await response.json();
        setData(Array.isArray(stats) ? stats : []);
      } catch (error) {
        console.error('Error fetching usage stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsageStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading usage stats...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">🔍 API Usage Stats</h2>
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Parsing Count</th>
                  <th>AI Call Count</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.map((log: any, idx: number) => (
                  <tr key={log.email || idx}>
                    <td>{log.email || '-'}</td>
                    <td>{typeof log.parsingCount === 'number' ? log.parsingCount : '-'}</td>
                    <td>{typeof log.aiCallCount === 'number' ? log.aiCallCount : '-'}</td>
                    <td>{typeof log.totalCost === 'number' ? `£${log.totalCost.toFixed(2)}` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </AdminLayout>
    </AdminProtectedRoute>
  );
} 