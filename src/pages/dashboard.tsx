import AdminLayout from '@/components/layouts/AdminLayout';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const AdminDashboard: React.FC = () => {
  useEffect(() => {
    console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  }, []);
  
  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Admin – Dashboard | ApplyAce</h1>
        <p className="mb-6">Welcome to the executive admin panel. Use the links below to manage ApplyAce.</p>
        <ul className="space-y-2">
          <li><Link to="/admin/users" className="text-blue-600 hover:underline">Users</Link></li>
          <li><Link to="/admin/promote" className="text-blue-600 hover:underline">Promote</Link></li>
          <li><Link to="/admin/tier" className="text-blue-600 hover:underline">Tiers</Link></li>
          <li><Link to="/admin/api-usage" className="text-blue-600 hover:underline">API Usage</Link></li>
        </ul>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 