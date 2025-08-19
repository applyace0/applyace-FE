import { HomeNavigation } from '@/components/navigation/HomeNavigation';
import { InterviewCoach } from '@/components/interview/InterviewCoach';
import { useAuth } from '@/hooks/useAuth';

export const Interviews = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden md:block w-64">
        <HomeNavigation />
      </div>
      
      <main className="flex-1 overflow-y-auto">
        <InterviewCoach 
          user={user ? {
            id: user.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || ''
          } : undefined} 
        />
      </main>
    </div>
  );
}; 