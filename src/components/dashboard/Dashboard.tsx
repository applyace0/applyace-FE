import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Briefcase, Users, BarChart3, Settings, LogOut, Search, Bell, User, Crown, Sparkles, TrendingUp, Award, Zap, Target, Send } from 'lucide-react';
import JobFoldersList from '../folders/JobFoldersList';
import UsageTrackingCard from './UsageTrackingCard';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { getJson } from '@/lib/api-client';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCVUpload, setShowCVUpload] = useState(false);
  const [usageStats, setUsageStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [userTier, setUserTier] = useState<string>('Free Plan');
  
  // Guard against duplicate API calls in development mode
  const didLoadUserTier = useRef(false);
  const didLoadUsageStats = useRef(false);

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    // Try to get name from user metadata first (for OAuth providers)
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    // Try to get name from user metadata (for OAuth providers)
    if (user.user_metadata?.name) {
      return user.user_metadata.name;
    }
    
    // Try to get first name from user metadata
    if (user.user_metadata?.first_name) {
      const firstName = user.user_metadata.first_name;
      const lastName = user.user_metadata.last_name || '';
      return `${firstName} ${lastName}`.trim();
    }
    
    // Fallback to email display name
    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return 'User';
  };

  // Get user's first name for welcome message
  const getUserFirstName = () => {
    const fullName = getUserDisplayName();
    return fullName.split(' ')[0];
  };

  // Load user tier information
  useEffect(() => {
    // Prevent duplicate API calls in development mode
    if (didLoadUserTier.current) return;
    didLoadUserTier.current = true;
    
    if (user) {
      loadUserTier();
    }
  }, [user]);

  const loadUserTier = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        setUserTier('Free Plan');
        return;
      }

      try {
        const tierData = await getJson('/api/tier/info');
        const raw = tierData?.currentTier;
        const safe = typeof raw === 'string' && raw.length > 0 ? raw : 'free';
        const label = safe.charAt(0).toUpperCase() + safe.slice(1).replace(/_/g, ' ');
        setUserTier(`${label} Plan`);
      } catch (error) {
        console.debug("Tier info unavailable (dev):", error);
        setUserTier('Free Plan');
      }
    } catch (error) {
      console.error('Error loading user tier:', error);
      setUserTier('Free Plan');
    }
  };

  const stats = [
    { 
      label: 'CVs Created', 
      value: '12', 
      icon: FileText, 
      gradient: 'from-blue-100 to-blue-200',
      iconColor: 'text-blue-500',
      change: '+3 this month',
      trend: 'up',
      action: () => navigate('/cvs')
    },
    { 
      label: 'Applications Sent', 
      value: '28', 
      icon: Briefcase, 
      gradient: 'from-green-100 to-green-200',
      iconColor: 'text-green-500',
      change: '+8 this week',
      trend: 'up',
      action: () => navigate('/jobs')
    },
    { 
      label: 'One-Click Apply', 
      value: '15', 
      icon: Send, 
      gradient: 'from-purple-100 to-purple-200',
      iconColor: 'text-purple-500',
      change: '+5 this week',
      trend: 'up',
      action: () => navigate('/apply')
    },
    { 
      label: 'Success Rate', 
      value: '89%', 
      icon: BarChart3, 
      gradient: 'from-orange-100 to-orange-200',
      iconColor: 'text-orange-500',
      change: '+12% vs avg',
      trend: 'up',
      action: () => navigate('/analytics')
    },
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
    { id: 'cvs', label: 'CV Library', icon: FileText, href: '/cvs' },
    { id: 'jobs', label: 'Applications', icon: Briefcase, href: '/jobs' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ];

  const handleLogout = () => {
    // TODO: Implement logout
    console.log('Logging out...');
  };

  const handleCreateCV = () => {
    navigate('/cv-builder');
  };

  const handleOneClickApply = () => {
    navigate('/apply');
  };

  // Load user usage stats
  useEffect(() => {
    // Prevent duplicate API calls in development mode
    if (didLoadUsageStats.current) return;
    didLoadUsageStats.current = true;
    
    if (user) {
      loadUsageStats();
    }
  }, [user]);

  const loadUsageStats = async () => {
    try {
      setIsLoadingStats(true);
      const stats = await getJson('/api/analytics/usage');
      setUsageStats(stats);
    } catch (error) {
      console.error('Error loading usage stats:', error);
      // Non-blocking UI: ignore in dev
      console.debug("Usage stats unavailable (dev):", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleNavigateToSection = (section: string) => {
    if (section === 'cvs') {
      navigate('/cvs');
    } else if (section === 'jobs') {
      navigate('/jobs');
    } else {
      setActiveTab(section);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Modern Sidebar */}
      <motion.div 
        className="w-80 bg-white/90 backdrop-blur-md shadow-xl border-r border-gray-200/60 flex flex-col"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                ApplyAce
              </h1>
              <p className="text-xs text-gray-500">Career Platform</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200/60">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">Welcome back, {getUserFirstName()}!</h2>
              <p className="text-sm text-gray-500">{userTier}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigateToSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200/60">
          <div className="space-y-3">
            <Button
              onClick={handleCreateCV}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create CV
            </Button>
            <Button
              onClick={handleOneClickApply}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Send className="h-4 w-4 mr-2" />
              One-Click Apply
            </Button>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200/60">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Track your career progress and manage your job search
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
                onClick={stat.action}
              >
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                      </div>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                      <p className="text-gray-600 mb-2">{stat.label}</p>
                      <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Usage Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8"
          >
            <UsageTrackingCard 
              usageStats={{
                cv_parsed_count: usageStats?.cv_parsed_count || 0,
                jobs_saved_count: usageStats?.jobs_saved_count || 0,
                interviews_done: usageStats?.interviews_done || 0,
                tier: usageStats?.tier || 'free'
              }}
            />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* CV Management */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>CV Management</span>
                </CardTitle>
                <CardDescription>
                  Create, edit, and manage your professional CVs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setShowCVUpload(true)}
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Existing CV
                </Button>
                <Button
                  onClick={handleCreateCV}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create New CV
                </Button>
              </CardContent>
            </Card>

            {/* Job Applications */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-green-600" />
                  <span>Job Applications</span>
                </CardTitle>
                <CardDescription>
                  Apply to jobs with AI-powered tailoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleOneClickApply}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  One-Click Apply
                </Button>
                <Button
                  onClick={() => navigate('/jobs')}
                  variant="outline"
                  className="w-full border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* CV Upload Modal */}
      {/* {showCVUpload && (
        <CVUploadModal
          onClose={() => setShowCVUpload(false)}
          onSuccess={() => {
            setShowCVUpload(false);
            // Refresh stats or navigate to CVs
            navigate('/cvs');
          }}
        />
      )} */}
    </div>
    </>
  );
};

export default Dashboard;
