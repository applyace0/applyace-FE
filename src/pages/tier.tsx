import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoute';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

const MOCK_TIERS = [
  { name: 'Free', price: 0, limits: { CVs: 2, AICalls: 5 } },
  { name: 'Starter', price: 14.99, limits: { CVs: 10, AICalls: 50 } },
  { name: 'Pro', price: 29.99, limits: { CVs: 50, AICalls: 200 } },
  { name: 'Career Pro', price: 59.99, limits: { CVs: 200, AICalls: 1000 } },
  { name: 'Elite Exec', price: 99.99, limits: { CVs: 1000, AICalls: 5000 } },
];

export default function AdminTierPage() {
  const { user, loading } = useAuth();
  useEffect(() => { document.title = 'Admin – Tiers | ApplyAce'; }, []);

  if (loading || !user) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (user.user_metadata?.role !== 'admin') return <div className="flex items-center justify-center min-h-screen text-red-600 font-bold text-xl">403 Forbidden: Admins only</div>;

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_TIERS.map(tier => (
            <Card key={tier.name} className="p-6 flex flex-col gap-4 bg-white border shadow rounded-xl">
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-blue-900">{tier.name}</div>
                <Button variant="outline" size="sm" disabled>Edit</Button>
              </div>
              <div className="text-2xl font-bold text-gray-900">£{tier.price.toFixed(2)}/mo</div>
              <div className="text-gray-600 text-sm">Limits:</div>
              <ul className="text-gray-700 text-sm ml-4 list-disc">
                <li>CVs: {tier.limits.CVs}</li>
                <li>AI Calls: {tier.limits.AICalls}</li>
              </ul>
            </Card>
          ))}
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
} 