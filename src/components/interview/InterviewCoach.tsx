import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayCircle, 
  BookOpen, 
  BarChart3, 
  Target, 
  Clock, 
  Star,
  Mic,
  Video,
  Users,
  Trophy
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface InterviewCoachProps {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const InterviewCoach: React.FC<InterviewCoachProps> = ({ user }) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'mock-interview',
      title: 'AI Mock Interview',
      description: 'Practice with AI-powered interviews tailored to your industry',
      icon: PlayCircle,
      color: 'bg-gradient-to-br from-blue-500 to-purple-600',
      badge: 'Popular',
      stats: '15-30 min',
      mobile: true
    },
    {
      id: 'question-bank',
      title: 'Question Bank',
      description: 'Browse 10,000+ interview questions by category and difficulty',
      icon: BookOpen,
      color: 'bg-gradient-to-br from-green-500 to-teal-600',
      badge: 'New',
      stats: '1000+ questions',
      mobile: true
    },
    {
      id: 'analytics',
      title: 'Performance Analytics',
      description: 'Track your progress and identify areas for improvement',
      icon: BarChart3,
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      badge: 'Pro',
      stats: 'Real-time insights',
      mobile: true
    },
    {
      id: 'practice-sessions',
      title: 'Practice Sessions',
      description: 'Quick 5-minute practice rounds for specific skills',
      icon: Target,
      color: 'bg-gradient-to-br from-pink-500 to-rose-600',
      badge: null,
      stats: '5-15 min',
      mobile: true
    }
  ];

  const recentStats = {
    sessionsCompleted: 12,
    averageScore: 8.2,
    improvementRate: 25,
    timeSpent: 180 // minutes
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            🎤 Interview Coach
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Master your interview skills with AI-powered practice, feedback, and analytics
          </p>
        </motion.div>

        {/* Quick Stats Section - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{recentStats.sessionsCompleted}</div>
              <div className="text-sm text-gray-600">Sessions</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{recentStats.averageScore}/10</div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">+{recentStats.improvementRate}%</div>
              <div className="text-sm text-gray-600">Improved</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{Math.floor(recentStats.timeSpent / 60)}h</div>
              <div className="text-sm text-gray-600">Practice</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid - Mobile First Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                    selectedFeature === feature.id ? 'border-blue-500 shadow-lg' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedFeature(feature.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-3 rounded-xl ${feature.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {feature.badge && (
                          <Badge variant={feature.badge === 'Popular' ? 'default' : 'secondary'}>
                            {feature.badge}
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">{feature.stats}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      className="w-full" 
                      variant={selectedFeature === feature.id ? 'default' : 'outline'}
                    >
                      Start Practice
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Mic className="h-5 w-5 mb-2" />
              <span className="text-sm">Voice Practice</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Video className="h-5 w-5 mb-2" />
              <span className="text-sm">Video Mock</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Users className="h-5 w-5 mb-2" />
              <span className="text-sm">Group Session</span>
            </Button>
          </div>
        </motion.div>

        {/* Mobile Practice Mode Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Practice on the Go</h3>
              <p className="text-blue-100 text-sm">
                Access voice-only mode for practice during commutes
              </p>
            </div>
            <Button variant="secondary" size="sm">
              Try Now
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 