import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, Award, Users, Calendar, Target, Zap, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/counter';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, LineChart, PieChart, Bar, Line, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  // Demo data for charts
  const cvData = [
    { month: 'Jan', cvs: 2 },
    { month: 'Feb', cvs: 4 },
    { month: 'Mar', cvs: 3 },
    { month: 'Apr', cvs: 6 },
    { month: 'May', cvs: 8 },
    { month: 'Jun', cvs: 12 },
    { month: 'Jul', cvs: 15 },
  ];

  const applicationStatusData = [
    { name: 'Applied', value: 45, color: '#3B82F6' },
    { name: 'Interview', value: 25, color: '#10B981' },
    { name: 'Offer', value: 8, color: '#8B5CF6' },
    { name: 'Rejected', value: 22, color: '#EF4444' },
  ];

  const interviewPrepData = [
    { session: 'Mock Interview', sessions: 12 },
    { session: 'AI Practice', sessions: 18 },
    { session: 'Question Prep', sessions: 8 },
    { session: 'Feedback Review', sessions: 15 },
  ];

  const chartConfig = {
    cvs: {
      label: "CVs Created",
      color: "#3B82F6",
    },
    applications: {
      label: "Applications",
      color: "#10B981",
    },
    interviews: {
      label: "Interviews",
      color: "#8B5CF6",
    },
    offers: {
      label: "Offers",
      color: "#F59E0B",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 drop-shadow">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Track your career progress with detailed insights and performance metrics
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          <StatCard
            title="Total CVs"
            value={15}
            icon={<FileText className="h-6 w-6 text-blue-500" />}
            gradient="from-blue-100 to-blue-200"
            delay={0.1}
          />
          <StatCard
            title="Applications Sent"
            value={45}
            icon={<TrendingUp className="h-6 w-6 text-green-500" />}
            gradient="from-green-100 to-green-200"
            delay={0.2}
          />
          <StatCard
            title="Interview Prep"
            value={25}
            icon={<Award className="h-6 w-6 text-purple-500" />}
            gradient="from-purple-100 to-purple-200"
            delay={0.3}
          />
          <StatCard
            title="Job Matches"
            value={8}
            icon={<Users className="h-6 w-6 text-pink-500" />}
            gradient="from-pink-100 to-pink-200"
            delay={0.4}
          />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* CVs Over Time - Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  CVs Created Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <LineChart data={cvData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="cvs" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Application Status - Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <Target className="h-5 w-5 text-green-500" />
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <PieChart>
                    <Pie
                      data={applicationStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {applicationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {applicationStatusData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Interview Prep Sessions - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Interview Prep Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={interviewPrepData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="session" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="sessions" 
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <InsightCard
            title="Response Rate"
            value="55%"
            description="Applications that received responses"
            icon={<Zap className="h-6 w-6 text-yellow-500" />}
            gradient="from-yellow-100 to-orange-200"
          />
          <InsightCard
            title="Interview Success"
            value="78%"
            description="Interviews that led to next rounds"
            icon={<Award className="h-6 w-6 text-emerald-500" />}
            gradient="from-emerald-100 to-green-200"
          />
          <InsightCard
            title="Time to Offer"
            value="23 days"
            description="Average time from application to offer"
            icon={<Calendar className="h-6 w-6 text-blue-500" />}
            gradient="from-blue-100 to-indigo-200"
          />
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient, delay }: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  gradient: string; 
  delay: number 
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className={`bg-gradient-to-br ${gradient} shadow-xl border-0 rounded-2xl glassmorphism`}> 
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
          <div>{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            <AnimatedCounter value={value} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InsightCard({ 
  title, 
  value, 
  description, 
  icon, 
  gradient 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode; 
  gradient: string; 
}) {
  return (
    <Card className={`bg-gradient-to-br ${gradient} shadow-xl border-0 rounded-2xl glassmorphism`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <p className="text-xs text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
} 