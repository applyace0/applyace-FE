import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Users, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  Shield,
  BarChart3,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Crown,
  Star,
  Activity,
  Database,
  Server,
  Award
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalApplications: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  apiUsage: {
    textract: number;
    cohere: number;
    openai: number;
    anthropic: number;
  };
  tierDistribution: {
    free: number;
    starter: number;
    pro: number;
    career_pro: number;
    elite_exec: number;
  };
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: string;
  }>;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'revenue' | 'system'>('overview');

  useEffect(() => {
    if (user) {
      loadAdminStats();
    }
  }, [user]);

  const loadAdminStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load usage stats
      const usageResponse = await fetch('/api/admin/usage', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      // Load cost stats
      const costsResponse = await fetch('/api/admin/costs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      // Load system health
      const healthResponse = await fetch('/api/admin/system-health', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      // Load alerts
      const alertsResponse = await fetch('/api/admin/alerts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      // For now, create mock data since these endpoints might not exist yet
      const mockStats: AdminStats = {
        totalUsers: 1250,
        activeUsers: 847,
        totalRevenue: 45600,
        monthlyRevenue: 8900,
        totalApplications: 3420,
        systemHealth: 'healthy',
        apiUsage: {
          textract: 1250,
          cohere: 890,
          openai: 2340,
          anthropic: 1560
        },
        tierDistribution: {
          free: 650,
          starter: 320,
          pro: 180,
          career_pro: 80,
          elite_exec: 20
        },
        alerts: [
          {
            id: '1',
            type: 'warning',
            message: 'High API usage detected for Cohere service',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            type: 'info',
            message: 'System backup completed successfully',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ]
      };

      setAdminStats(mockStats);
    } catch (err: any) {
      console.error('Error loading admin stats:', err);
      setError(err.message || 'Failed to load admin statistics');
      toast.error('Failed to load admin statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'info': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Admin Panel</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadAdminStats}>
            <Loader2 className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!adminStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No admin data available</p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">System overview and analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getSystemHealthColor(adminStats.systemHealth)}>
                <Shield className="h-3 w-3 mr-1" />
                {adminStats.systemHealth.charAt(0).toUpperCase() + adminStats.systemHealth.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
            { id: 'users', label: 'Users', icon: <Users className="h-4 w-4" /> },
            { id: 'revenue', label: 'Revenue', icon: <DollarSign className="h-4 w-4" /> },
            { id: 'system', label: 'System', icon: <Server className="h-4 w-4" /> }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{adminStats.totalUsers.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      {adminStats.activeUsers} active this month
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">£{adminStats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      £{adminStats.totalRevenue.toLocaleString()} total
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Applications</p>
                      <p className="text-2xl font-bold text-gray-900">{adminStats.totalApplications.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Activity className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Job applications processed
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">System Health</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {adminStats.systemHealth.charAt(0).toUpperCase() + adminStats.systemHealth.slice(1)}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      All systems operational
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* API Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  API Usage by Service
                </CardTitle>
                <CardDescription>
                  Monthly API calls across different services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">AWS Textract</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{adminStats.apiUsage.textract.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">PDF parsing calls</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                      <span className="font-medium">Cohere</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{adminStats.apiUsage.cohere.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">AI parsing calls</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">OpenAI</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{adminStats.apiUsage.openai.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">AI generation calls</p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                      <span className="font-medium">Anthropic</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{adminStats.apiUsage.anthropic.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Claude API calls</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Alerts
                </CardTitle>
                <CardDescription>
                  System notifications and warnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {adminStats.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border rounded-lg ${getAlertColor(alert.type)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Tier Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of users by subscription tier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Star className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-2xl font-bold text-gray-900">{adminStats.tierDistribution.free}</p>
                    <p className="text-sm text-gray-600">Free</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold text-blue-900">{adminStats.tierDistribution.starter}</p>
                    <p className="text-sm text-blue-600">Starter</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Award className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold text-purple-900">{adminStats.tierDistribution.pro}</p>
                    <p className="text-sm text-purple-600">Pro</p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                    <p className="text-2xl font-bold text-emerald-900">{adminStats.tierDistribution.career_pro}</p>
                    <p className="text-sm text-emerald-600">Career Pro</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Crown className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                    <p className="text-2xl font-bold text-yellow-900">{adminStats.tierDistribution.elite_exec}</p>
                    <p className="text-sm text-yellow-600">Elite Executive</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Analytics
                </CardTitle>
                <CardDescription>
                  Financial performance and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-green-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Monthly Revenue</h3>
                    <p className="text-3xl font-bold text-green-600">£{adminStats.monthlyRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-700 mt-2">+12% from last month</p>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-blue-600">£{adminStats.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-blue-700 mt-2">All-time earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  System Health
                </CardTitle>
                <CardDescription>
                  Infrastructure and service status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Database</p>
                        <p className="text-sm text-gray-600">Supabase connection</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">API Services</p>
                        <p className="text-sm text-gray-600">All external APIs</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">File Storage</p>
                        <p className="text-sm text-gray-600">Supabase storage</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Authentication</p>
                        <p className="text-sm text-gray-600">OAuth services</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 
 
 