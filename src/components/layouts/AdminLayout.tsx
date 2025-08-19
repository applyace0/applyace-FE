import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, signOut, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-4"></div>
        <span className="text-gray-600">Loading admin panel...</span>
      </div>
    );
  }

  if (!user?.user_metadata?.role || user.user_metadata.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-2 text-red-600">403 Forbidden</h2>
          <p className="text-gray-600 mb-4">You do not have permission to access the admin panel.</p>
          <Button onClick={() => navigate('/admin-login')}>Go to Admin Login</Button>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/api-usage', label: 'API Usage' },
    { href: '/admin/promote', label: 'Promote Admin' },
    { href: '/admin/tier', label: 'Tier Management' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col py-6 px-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-blue-700 tracking-tight">ApplyAce Admin Panel</h1>
        </div>
        <nav className="flex-1 space-y-2">
          {sidebarLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`block px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 transition font-medium ${location.pathname === link.href ? 'bg-blue-100 text-blue-700' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t pt-4">
          <div className="text-xs text-gray-400 mb-2">Logged in as</div>
          <div className="text-sm font-medium text-gray-700 mb-4 truncate">{user.email}</div>
          <Button variant="outline" className="w-full" onClick={signOut}>
            Logout
          </Button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold text-blue-700">Admin Dashboard</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>Logout</Button>
          </div>
        </header>
        <div className="flex-1 p-8 bg-gray-100">
          {children}
        </div>
      </main>
    </div>
  );
} 