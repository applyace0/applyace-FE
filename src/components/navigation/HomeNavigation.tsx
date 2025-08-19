import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Upload, 
  MessageSquare, 
  Settings, 
  LogOut,
  Briefcase,
  User
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My CVs', href: '/cvs', icon: FileText },
      { name: 'CV Manager', href: '/cvs', icon: FileText },
  { name: 'Upload CV', href: '/upload', icon: Upload },
  { name: 'Interviews', href: '/interviews', icon: MessageSquare },
  { name: 'Job Matches', href: '/jobs', icon: Briefcase },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const HomeNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any stored tokens or user data
      localStorage.clear();
      sessionStorage.clear();
      
      toast.success('Signed out successfully');
      navigate('/', { replace: true });
    } catch (error: any) {
      toast.error('Error signing out: ' + error.message);
      // Even if there's an error, try to navigate away
      navigate('/', { replace: true });
    }
  };

  return (
    <nav className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="w-5 h-5 mr-3 text-gray-400" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </nav>
  );
}; 