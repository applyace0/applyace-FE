import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Crown, 
  Star, 
  Zap, 
  Award, 
  Brain,
  FileText,
  Briefcase,
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface UsageStats {
  cv_parsed_count: number;
  jobs_saved_count: number;
  interviews_done: number;
  tier: 'free' | 'starter' | 'pro' | 'career_pro' | 'elite_exec';
}

interface UsageTrackingCardProps {
  usageStats: UsageStats;
  className?: string;
}

const UsageTrackingCard: React.FC<UsageTrackingCardProps> = ({ usageStats, className = '' }) => {
  const getTierInfo = (tier: string) => {
    const tierInfo = {
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
    return tierInfo[tier as keyof typeof tierInfo] || tierInfo.free;
  };

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const currentTier = getTierInfo(usageStats.tier);
  const cvUsagePercentage = getUsagePercentage(usageStats.cv_parsed_count, currentTier.limit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Usage Tracking
              </CardTitle>
              <CardDescription className="text-gray-600">
                Monitor your usage and tier limits
              </CardDescription>
            </div>
            <Badge className={currentTier.color}>
              {currentTier.icon}
              {currentTier.name}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Usage Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{usageStats.cv_parsed_count}</div>
              <div className="text-sm text-gray-600">CV Parses</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{usageStats.jobs_saved_count}</div>
              <div className="text-sm text-gray-600">Jobs Saved</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{usageStats.interviews_done}</div>
              <div className="text-sm text-gray-600">Interviews</div>
            </div>
          </div>

          {/* CV Parsing Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">CV Parsing Limit</span>
              <span className="text-sm text-gray-600">
                {usageStats.cv_parsed_count} / {currentTier.limit}
              </span>
            </div>
            <Progress 
              value={cvUsagePercentage} 
              className="h-2"
              style={{
                '--progress-background': getProgressColor(cvUsagePercentage)
              } as React.CSSProperties}
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{cvUsagePercentage.toFixed(0)}% used</span>
              {cvUsagePercentage >= 80 && (
                <span className="text-orange-600 font-medium">
                  Consider upgrading
                </span>
              )}
            </div>
          </div>

          {/* AI Features Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">AI Features</span>
              <Badge variant="outline" className={
                usageStats.tier === 'free' 
                  ? 'border-red-200 text-red-700 bg-red-50' 
                  : 'border-green-200 text-green-700 bg-green-50'
              }>
                {usageStats.tier === 'free' ? 'Not Available' : 'Available'}
              </Badge>
            </div>
            <div className="text-xs text-gray-600">
              {usageStats.tier === 'free' 
                ? 'Upgrade to Starter tier or higher to access AI-powered features'
                : 'You have access to AI cover letters, CV optimization, and more'
              }
            </div>
          </div>

          {/* Upgrade Prompt */}
          {cvUsagePercentage >= 80 && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-orange-800">
                    Approaching Usage Limit
                  </h4>
                  <p className="text-sm text-orange-700 mt-1">
                    You're using {cvUsagePercentage.toFixed(0)}% of your {currentTier.name} tier limit. 
                    Consider upgrading for more features and higher limits.
                  </p>
                  <Button 
                    size="sm" 
                    className="mt-3 bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => window.location.href = '/cv-builder'}>
              <FileText className="h-4 w-4 mr-2" />
              Create CV
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => window.location.href = '/jobs'}>
              <Briefcase className="h-4 w-4 mr-2" />
              Find Jobs
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => window.location.href = '/interviews'}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Practice
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UsageTrackingCard; 
 
 