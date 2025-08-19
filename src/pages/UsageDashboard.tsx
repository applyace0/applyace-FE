import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  FileText, 
  Briefcase, 
  Award, 
  TrendingUp,
  Crown,
  Star,
  Zap,
  Users,
  Calendar,
  BarChart3,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { getJson } from '@/lib/api-client';

interface UsageStats {
  cv_parsed_count: number;
  jobs_saved_count: number;
  interviews_done: number;
  tier: 'free' | 'starter' | 'pro' | 'career_pro' | 'elite_exec';
}

interface TierInfo {
  name: string;
  limit: number;
  color: string;
  icon: React.ReactNode;
  features: string[];
}

const UsageDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Guard against duplicate API calls in development mode
  const didLoadUsageStats = useRef(false);

  // Tier information
  const tierInfo: Record<string, TierInfo> = {
    free: {
      name: 'Free',
      limit: 1,
      color: 'bg-gray-100 text-gray-800',
      icon: <Star className="h-4 w-4" />,
      features: ['1 CV parse', 'Basic templates', 'Community support']
    },
    starter: {
      name: 'Starter',
      limit: 3,
      color: 'bg-blue-100 text-blue-800',
      icon: <Zap className="h-4 w-4" />,
      features: ['3 CV parses/month', 'Premium templates', 'Email support']
    },
    pro: {
      name: 'Professional',
      limit: 10,
      color: 'bg-purple-100 text-purple-800',
      icon: <Award className="h-4 w-4" />,
      features: ['10 CV parses/month', 'AI cover letters', 'Priority support']
    },
    career_pro: {
      name: 'Career Pro',
      limit: 25,
      color: 'bg-emerald-100 text-emerald-800',
      icon: <TrendingUp className="h-4 w-4" />,
      features: ['25 CV parses/month', 'Interview coaching', 'Career guidance']
    },
    elite_exec: {
      name: 'Elite Executive',
      limit: 100,
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Crown className="h-4 w-4" />,
      features: ['100 CV parses/month', '1-on-1 coaching', 'Executive support']
    }
  };

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
      setIsLoading(true);
      setError(null);

      const stats = await getJson('/api/analytics/usage');
      setUsageStats(stats);
    } catch (err: any) {
      console.error('Error loading usage stats:', err);
      console.debug("Usage stats unavailable (dev):", err);
      setError('Failed to load usage statistics');
      toast.error('Failed to load usage statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTierUpgradeMessage = () => {
    if (!usageStats) return null;

    const currentTier = tierInfo[usageStats.tier];
    const usagePercentage = getUsagePercentage(usageStats.cv_parsed_count, currentTier.limit);

    if (usagePercentage >= 80) {
      const nextTier = usageStats.tier === 'free' ? 'starter' : 
                      usageStats.tier === 'starter' ? 'pro' : 
                      usageStats.tier === 'pro' ? 'career_pro' : 'elite_exec';
      
      if (nextTier && nextTier !== usageStats.tier) {
        return {
          message: `You're using ${usagePercentage.toFixed(0)}% of your ${currentTier.name} tier. Consider upgrading to ${tierInfo[nextTier].name} for more features.`,
          nextTier
        };
      }
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your usage statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadUsageStats}>
            <Loader2 className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!usageStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No usage data available</p>
        </div>
      </div>
    );
  }

  const currentTier = tierInfo[usageStats.tier];
  const upgradeMessage = getTierUpgradeMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Usage Dashboard</h1>
                <p className="text-sm text-gray-500">Track your ApplyAce activity and limits</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={currentTier.color}>
                {currentTier.icon}
                <span className="ml-1">{currentTier.name}</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upgrade Alert */}
        {upgradeMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Alert>
              <BarChart3 className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{upgradeMessage.message}</span>
                <Button
                  size="sm"
                  onClick={() => navigate('/pricing')}
                  className="ml-4"
                >
                  Upgrade Now
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CVs Parsed</p>
                  <p className="text-2xl font-bold text-gray-900">{usageStats.cv_parsed_count}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Usage</span>
                  <span className="text-gray-900">{usageStats.cv_parsed_count} / {currentTier.limit}</span>
                </div>
                <Progress 
                  value={getUsagePercentage(usageStats.cv_parsed_count, currentTier.limit)} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Jobs Saved</p>
                  <p className="text-2xl font-bold text-gray-900">{usageStats.jobs_saved_count}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Track your job applications</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">{usageStats.interviews_done}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Practice sessions completed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Tier</p>
                  <p className="text-2xl font-bold text-gray-900">{currentTier.name}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  {currentTier.icon}
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/pricing')}
                  className="w-full"
                >
                  View Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* CV Parsing Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                CV Parsing Usage
              </CardTitle>
              <CardDescription>
                Track your CV parsing activity and limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Monthly Usage</span>
                  <span className="text-sm text-gray-600">
                    {usageStats.cv_parsed_count} / {currentTier.limit} CVs
                  </span>
                </div>
                <Progress 
                  value={getUsagePercentage(usageStats.cv_parsed_count, currentTier.limit)} 
                  className="h-3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {currentTier.limit - usageStats.cv_parsed_count} CVs remaining this month
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Tier Features</h4>
                <ul className="space-y-2">
                  {currentTier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {usageStats.cv_parsed_count >= currentTier.limit * 0.8 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You're approaching your monthly limit. Consider upgrading for unlimited parsing.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Activity Summary
              </CardTitle>
              <CardDescription>
                Your recent activity and achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">CVs Created</p>
                      <p className="text-xs text-gray-500">Total CVs in your account</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold">{usageStats.cv_parsed_count}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Jobs Tracked</p>
                      <p className="text-xs text-gray-500">Saved job applications</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold">{usageStats.jobs_saved_count}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Award className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Interview Prep</p>
                      <p className="text-xs text-gray-500">Practice sessions completed</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold">{usageStats.interviews_done}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="w-full"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Full Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common actions to help you get the most out of ApplyAce
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/cv-builder')}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <FileText className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">Create CV</p>
                    <p className="text-xs text-gray-500">Build a new CV</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/jobs')}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Briefcase className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">Find Jobs</p>
                    <p className="text-xs text-gray-500">Browse opportunities</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/interview')}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Award className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">Practice Interview</p>
                    <p className="text-xs text-gray-500">Prepare for interviews</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UsageDashboard; 
 
 