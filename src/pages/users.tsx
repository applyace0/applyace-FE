import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoute';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

const MOCK_USERS = Array.from({ length: 32 }).map((_, i) => ({
  email: `user${i + 1}@applyace.com`,
  fullName: `User ${i + 1}`,
  tier: ['Free', 'Starter', 'Pro', 'Career Pro', 'Elite Exec'][i % 5],
  role: i % 10 === 0 ? 'admin' : 'user',
}));

const TIERS = ['All', 'Free', 'Starter', 'Pro', 'Career Pro', 'Elite Exec'];

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    document.title = 'Admin – Users | ApplyAce';
  }, []);

  if (loading || !user) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (user.user_metadata?.role !== 'admin') return <div className="flex items-center justify-center min-h-screen text-red-600 font-bold text-xl">403 Forbidden: Admins only</div>;

  let filtered = MOCK_USERS.filter(u =>
    (u.email.toLowerCase().includes(search.toLowerCase()) || u.fullName.toLowerCase().includes(search.toLowerCase())) &&
    (tier === 'All' || u.tier === tier)
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  filtered = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-blue-900">Users</h2>
          <div className="flex gap-2">
            <Input placeholder="Search by email or name" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-64" />
            <Select value={tier} onValueChange={v => { setTier(v); setPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                {TIERS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow border p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-gray-400">No users found</TableCell></TableRow>
              ) : (
                filtered.map((u, i) => (
                  <TableRow key={u.email} className={u.role === 'admin' ? 'bg-blue-50' : ''}>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell>{u.fullName}</TableCell>
                    <TableCell>{u.tier}</TableCell>
                    <TableCell className={u.role === 'admin' ? 'text-blue-700 font-semibold' : ''}>{u.role}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
} 