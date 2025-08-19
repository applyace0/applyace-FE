"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  DollarSign, 
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  RefreshCw,
  Settings,
  Bell,
  Target,
  Zap,
  Brain,
  FileText
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface UsageStats {
  totalUsers: number;
  activeUsers: number;
  totalCvParses: number;
  totalAiRewrites: number;
  totalJobApplications: number;
  totalInterviewSessions: number;
  totalCost: number;
  monthlyGrowth: number;
}

interface AlertItem {
  id: string;
  type: 'tier_breach' | 'cost_spike' | 'system_error' | 'usage_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  userId?: string;
  metadata?: any;
}

interface ParsingStats {
  totalParses: number;
  successRate: number;
  averageDuration: number;
  methodBreakdown: {
    textract: number;
    cohere: number;
    fallback: number;
  };
  errorRate: number;
  costPerParse: number;
}

interface CostBreakdown {
  cvParsing: number;
  aiRewrites: number;
  jobApplications: number;
  interviewSessions: number;
  total: number;
  monthlyTrend: number[];
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [parsingStats, setParsingStats] = useState<ParsingStats | null>(null);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get the session token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      // Fetch all dashboard data in parallel
      const [usageResponse, alertsResponse, parsingResponse, costResponse] = await Promise.all([
        fetch('/api/admin/usage', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/alerts', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/parsing-stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/costs', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!usageResponse.ok || !alertsResponse.ok || !parsingResponse.ok || !costResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [usageData, alertsData, parsingData, costData] = await Promise.all([
        usageResponse.json(),
        alertsResponse.json(),
        parsingResponse.json(),
        costResponse.json()
      ]);

      setUsageStats(usageData);
      setAlerts(alertsData.alerts || []);
      setParsingStats(parsingData);
      setCostBreakdown(costData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/admin/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to resolve alert');
      }

      // Update local state
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve alert');
    }
  };

  const exportData = async (type: 'usage' | 'costs' | 'alerts') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/admin/export/${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'tier_breach': return <Target className="h-4 w-4" />;
      case 'cost_spike': return <DollarSign className="h-4 w-4" />;
      case 'system_error': return <XCircle className="h-4 w-4" />;
      case 'usage_anomaly': return <Activity className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">
              Please sign in to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Monitor system performance, usage analytics, and cost tracking
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={fetchDashboardData}
                disabled={isLoading}
                variant="outline"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => exportData('usage')} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        {usageStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold">{usageStats.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {usageStats.activeUsers} active this month
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CV Parses</p>
                    <p className="text-3xl font-bold">{usageStats.totalCvParses.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <TrendingUp className="inline h-3 w-3 text-green-600" />
                      +{usageStats.monthlyGrowth}% this month
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Rewrites</p>
                    <p className="text-3xl font-bold">{usageStats.totalAiRewrites.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <Brain className="inline h-3 w-3 text-purple-600" />
                      AI-powered enhancements
                    </p>
                  </div>
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                    <p className="text-3xl font-bold">${usageStats.totalCost.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <DollarSign className="inline h-3 w-3 text-green-600" />
                      This month
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usage Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Feature Usage</span>
                  </CardTitle>
                  <CardDescription>
                    Monthly usage breakdown by feature
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {usageStats && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">CV Parsing</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(usageStats.totalCvParses / 1000) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{usageStats.totalCvParses}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI Rewrites</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${(usageStats.totalAiRewrites / 500) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{usageStats.totalAiRewrites}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Job Applications</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(usageStats.totalJobApplications / 200) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{usageStats.totalJobApplications}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Interview Sessions</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-orange-600 h-2 rounded-full" 
                              style={{ width: `${(usageStats.totalInterviewSessions / 100) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{usageStats.totalInterviewSessions}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>
                    Latest system events and user actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registration</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">CV parsing completed</p>
                        <p className="text-xs text-muted-foreground">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">AI rewrite requested</p>
                        <p className="text-xs text-muted-foreground">8 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Interview session started</p>
                        <p className="text-xs text-muted-foreground">12 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>System Alerts</span>
                </CardTitle>
                <CardDescription>
                  Monitor system health and user activity alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
                    <p className="text-lg font-medium text-green-600">All Clear</p>
                    <p className="text-muted-foreground">No active alerts at the moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.filter(alert => !alert.resolved).map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getAlertIcon(alert.type)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium">{alert.title}</h4>
                                <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                                  {alert.severity}
                                </Badge>
                              </div>
                              <p className="text-sm">{alert.description}</p>
                              <p className="text-xs mt-2 opacity-75">
                                {new Date(alert.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => resolveAlert(alert.id)}
                            size="sm"
                            variant="outline"
                          >
                            Resolve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            {parsingStats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Parsing Performance</span>
                    </CardTitle>
                    <CardDescription>
                      CV parsing success rates and performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {parsingStats.successRate}%
                        </p>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {parsingStats.averageDuration}ms
                        </p>
                        <p className="text-sm text-muted-foreground">Avg Duration</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Parse Method Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">AWS Textract</span>
                          <span className="text-sm font-medium">{parsingStats.methodBreakdown.textract}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Cohere</span>
                          <span className="text-sm font-medium">{parsingStats.methodBreakdown.cohere}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Fallback</span>
                          <span className="text-sm font-medium">{parsingStats.methodBreakdown.fallback}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>System Health</span>
                    </CardTitle>
                    <CardDescription>
                      Real-time system performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Error Rate</span>
                        <Badge variant={parsingStats.errorRate > 5 ? 'destructive' : 'secondary'}>
                          {parsingStats.errorRate}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cost per Parse</span>
                        <span className="text-sm font-medium">${parsingStats.costPerParse.toFixed(4)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Parses</span>
                        <span className="text-sm font-medium">{parsingStats.totalParses.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Costs Tab */}
          <TabsContent value="costs" className="space-y-6">
            {costBreakdown && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Cost Breakdown</span>
                    </CardTitle>
                    <CardDescription>
                      Monthly cost analysis by feature
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">CV Parsing</span>
                        <span className="text-sm font-medium">${costBreakdown.cvParsing.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI Rewrites</span>
                        <span className="text-sm font-medium">${costBreakdown.aiRewrites.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Job Applications</span>
                        <span className="text-sm font-medium">${costBreakdown.jobApplications.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Interview Sessions</span>
                        <span className="text-sm font-medium">${costBreakdown.interviewSessions.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Total</span>
                          <span className="font-bold text-lg">${costBreakdown.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Cost Trends</span>
                    </CardTitle>
                    <CardDescription>
                      Monthly cost progression
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Monthly Trend</span>
                        <Badge variant={costBreakdown.monthlyTrend[costBreakdown.monthlyTrend.length - 1] > costBreakdown.monthlyTrend[0] ? 'destructive' : 'secondary'}>
                          {costBreakdown.monthlyTrend[costBreakdown.monthlyTrend.length - 1] > costBreakdown.monthlyTrend[0] ? 'Increasing' : 'Decreasing'}
                        </Badge>
                      </div>
                      <div className="h-32 bg-gray-100 rounded-lg flex items-end justify-between p-4">
                        {costBreakdown.monthlyTrend.map((cost, index) => (
                          <div
                            key={index}
                            className="bg-blue-600 rounded-t"
                            style={{
                              width: '8px',
                              height: `${(cost / Math.max(...costBreakdown.monthlyTrend)) * 100}%`
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Last 6 months cost progression
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
} 
 
 