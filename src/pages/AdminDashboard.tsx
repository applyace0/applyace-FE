"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  Database,
  Activity,
  Shield,
  Settings,
  RefreshCw,
  Eye,
  EyeOff,
  Download,
  Filter,
  Search,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UsageStats {
  totalUsers: number;
  activeUsers: number;
  totalCVParses: number;
  totalAIRequests: number;
  totalCost: number;
  monthlyCost: number;
  dailyCost: number;
  tierDistribution: {
    free: number;
    pro: number;
    enterprise: number;
  };
  apiUsage: {
    textract: number;
    cohere: number;
    claude: number;
  };
}

interface AlertItem {
  id: string;
  type: 'cost' | 'usage' | 'error' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
}

interface CostBreakdown {
  date: string;
  textract: number;
  cohere: number;
  claude: number;
  total: number;
}

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [costData, setCostData] = useState<CostBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  
  // Guard against duplicate API calls in development mode
  const didInitialLoad = useRef(false);

  useEffect(() => {
    // Prevent duplicate API calls in development mode
    if (didInitialLoad.current) return;
    didInitialLoad.current = true;
    
    loadAdminData();
    const interval = setInterval(loadAdminData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Load usage statistics
      const statsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/usage`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setUsageStats(statsData);
      }

      // Load alerts
      const alertsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/alerts`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        setAlerts(alertsData.alerts || []);
      }

      // Load cost breakdown
      const costResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/costs?timeframe=${selectedTimeframe}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (costResponse.ok) {
        const costData = await costResponse.json();
        setCostData(costData.costs || []);
      }

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin dashboard data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId ? { ...alert, resolved: true } : alert
        ));
        toast({
          title: "Alert resolved",
          description: "Alert has been marked as resolved",
        });
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const exportData = async (type: 'usage' | 'costs' | 'alerts') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/export/${type}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Export successful",
          description: `${type} data exported successfully`,
        });
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export failed",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getAlertTypeIcon = (type: string) => {
    const icons = {
      cost: <DollarSign className="w-4 h-4" />,
      usage: <Activity className="w-4 h-4" />,
      error: <AlertTriangle className="w-4 h-4" />,
      security: <Shield className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || <AlertTriangle className="w-4 h-4" />;
  };

  // Mock data for demonstration
  const mockUsageStats: UsageStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalCVParses: 3456,
    totalAIRequests: 12345,
    totalCost: 2345.67,
    monthlyCost: 456.78,
    dailyCost: 15.23,
    tierDistribution: {
      free: 856,
      pro: 324,
      enterprise: 67
    },
    apiUsage: {
      textract: 2345,
      cohere: 6789,
      claude: 3211
    }
  };

  const mockAlerts: AlertItem[] = [
    {
      id: '1',
      type: 'cost',
      severity: 'high',
      title: 'Daily cost limit approaching',
      description: 'Daily API costs have reached 85% of the budget limit',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      resolved: false
    },
    {
      id: '2',
      type: 'usage',
      severity: 'medium',
      title: 'High Textract usage detected',
      description: 'Textract API calls increased by 40% in the last 24 hours',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      resolved: false
    },
    {
      id: '3',
      type: 'error',
      severity: 'low',
      title: 'Cohere API timeout',
      description: 'Multiple timeout errors from Cohere API in the last hour',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      resolved: true
    }
  ];

  const mockCostData: CostBreakdown[] = [
    { date: '2024-01-15', textract: 45.23, cohere: 123.45, claude: 67.89, total: 236.57 },
    { date: '2024-01-16', textract: 52.11, cohere: 145.67, claude: 78.92, total: 276.70 },
    { date: '2024-01-17', textract: 38.45, cohere: 98.76, claude: 54.32, total: 191.53 },
    { date: '2024-01-18', textract: 61.23, cohere: 167.89, claude: 89.45, total: 318.57 },
    { date: '2024-01-19', textract: 49.87, cohere: 134.56, claude: 72.34, total: 256.77 },
    { date: '2024-01-20', textract: 55.43, cohere: 156.78, claude: 83.21, total: 295.42 },
    { date: '2024-01-21', textract: 42.19, cohere: 112.34, claude: 61.78, total: 216.31 }
  ];

  const stats = usageStats || mockUsageStats;
  const currentAlerts = alerts.length > 0 ? alerts : mockAlerts;
  const currentCostData = costData.length > 0 ? costData : mockCostData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">System monitoring and administrative controls</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={loadAdminData}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                Refresh
              </Button>
              <Button
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                variant="outline"
                size="sm"
              >
                {showSensitiveData ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showSensitiveData ? 'Hide' : 'Show'} Sensitive Data
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeUsers} active today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                ${stats.dailyCost.toFixed(2)} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CV Parses</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCVParses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.apiUsage.textract} via Textract
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Requests</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAIRequests.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.apiUsage.cohere + stats.apiUsage.claude} total
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tier Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>User Tier Distribution</CardTitle>
                  <CardDescription>Current user subscription breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Free Tier</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{stats.tierDistribution.free}</span>
                        <span className="text-sm text-muted-foreground">
                          ({((stats.tierDistribution.free / stats.totalUsers) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Pro Tier</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{stats.tierDistribution.pro}</span>
                        <span className="text-sm text-muted-foreground">
                          ({((stats.tierDistribution.pro / stats.totalUsers) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span>Enterprise</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{stats.tierDistribution.enterprise}</span>
                        <span className="text-sm text-muted-foreground">
                          ({((stats.tierDistribution.enterprise / stats.totalUsers) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>API Usage Breakdown</CardTitle>
                  <CardDescription>Requests by service provider</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-500" />
                        <span>AWS Textract</span>
                      </div>
                      <span className="font-semibold">{stats.apiUsage.textract.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-green-500" />
                        <span>Cohere</span>
                      </div>
                      <span className="font-semibold">{stats.apiUsage.cohere.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-500" />
                        <span>Claude</span>
                      </div>
                      <span className="font-semibold">{stats.apiUsage.claude.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
                <CardDescription>Latest events and operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="font-medium">Database backup completed</p>
                        <p className="text-sm text-muted-foreground">2 minutes ago</p>
                      </div>
                    </div>
                    <Badge variant="secondary">System</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="font-medium">New user registration spike</p>
                        <p className="text-sm text-muted-foreground">15 minutes ago</p>
                      </div>
                    </div>
                    <Badge variant="secondary">User</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <div>
                        <p className="font-medium">Cohere API rate limit warning</p>
                        <p className="text-sm text-muted-foreground">1 hour ago</p>
                      </div>
                    </div>
                    <Badge variant="secondary">API</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Costs Tab */}
          <TabsContent value="costs" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Cost Analysis</h3>
                <p className="text-muted-foreground">Track API costs and usage patterns</p>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
                <Button onClick={() => exportData('costs')} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Cost</CardTitle>
                  <CardDescription>Period total</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${currentCostData.reduce((sum, day) => sum + day.total, 0).toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Average: ${(currentCostData.reduce((sum, day) => sum + day.total, 0) / currentCostData.length).toFixed(2)}/day
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Trend</CardTitle>
                  <CardDescription>Daily cost movement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {currentCostData.length > 1 && (
                      <>
                        {currentCostData[currentCostData.length - 1].total > currentCostData[currentCostData.length - 2].total ? (
                          <TrendingUp className="w-4 h-4 text-red-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-sm">
                          {Math.abs(
                            ((currentCostData[currentCostData.length - 1].total - currentCostData[currentCostData.length - 2].total) / 
                             currentCostData[currentCostData.length - 2].total) * 100
                          ).toFixed(1)}%
                        </span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Breakdown</CardTitle>
                  <CardDescription>Cost by provider</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Textract:</span>
                      <span>${currentCostData.reduce((sum, day) => sum + day.textract, 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cohere:</span>
                      <span>${currentCostData.reduce((sum, day) => sum + day.cohere, 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Claude:</span>
                      <span>${currentCostData.reduce((sum, day) => sum + day.claude, 0).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cost Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Cost Trend</CardTitle>
                <CardDescription>Cost breakdown over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {currentCostData.map((day, index) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-muted rounded-t-sm" style={{ 
                        height: `${(day.total / Math.max(...currentCostData.map(d => d.total))) * 200}px` 
                      }}></div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs font-medium">${day.total.toFixed(0)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">System Alerts</h3>
                <p className="text-muted-foreground">Monitor system health and issues</p>
              </div>
              <Button onClick={() => exportData('alerts')} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Alerts
              </Button>
            </div>

            <div className="space-y-4">
              {currentAlerts.map((alert) => (
                <Alert key={alert.id} className={cn(alert.resolved && "opacity-60")}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertTypeIcon(alert.type)}
                      <div className="flex-1">
                        <AlertTitle className="flex items-center gap-2">
                          {alert.title}
                          <Badge className={getAlertSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          {alert.resolved && (
                            <Badge variant="secondary">Resolved</Badge>
                          )}
                        </AlertTitle>
                        <AlertDescription className="mt-1">
                          {alert.description}
                        </AlertDescription>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {!alert.resolved && (
                      <Button
                        onClick={() => resolveAlert(alert.id)}
                        variant="outline"
                        size="sm"
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </Alert>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">User Management</h3>
                <p className="text-muted-foreground">Monitor user activity and manage accounts</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search Users
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button onClick={() => exportData('usage')} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Activity Summary</CardTitle>
                <CardDescription>Key user engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.activeUsers}</div>
                    <div className="text-sm text-muted-foreground">Active Users (24h)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Engagement Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(stats.totalAIRequests / stats.totalUsers)}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg AI Requests/User</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent User Activity</CardTitle>
                <CardDescription>Latest user actions and registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="font-medium">New user registered</p>
                        <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">2 minutes ago</div>
                      <Badge variant="secondary">Free Tier</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="font-medium">User upgraded to Pro</p>
                        <p className="text-sm text-muted-foreground">jane.smith@company.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">15 minutes ago</div>
                      <Badge variant="default">Pro Tier</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="font-medium">High usage detected</p>
                        <p className="text-sm text-muted-foreground">admin@enterprise.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">1 hour ago</div>
                      <Badge variant="destructive">Enterprise</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard; 