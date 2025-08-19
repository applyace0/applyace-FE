import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign,
  Search,
  Filter,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  status: 'applied' | 'interviewing' | 'rejected' | 'accepted' | 'pending';
  appliedDate: string;
  lastUpdated: string;
  jobUrl: string;
  coverLetter: string;
  cvUsed: string;
}

const mockApplications: Application[] = [
  {
    id: '1',
    jobTitle: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    status: 'applied',
    appliedDate: '2024-01-15',
    lastUpdated: '2024-01-15',
    jobUrl: 'https://linkedin.com/jobs/view/123456789',
    coverLetter: 'Generated cover letter for Tech Corp...',
    cvUsed: 'John Doe - Software Engineer CV'
  },
  {
    id: '2',
    jobTitle: 'Frontend Developer',
    company: 'Web Solutions',
    location: 'Remote',
    salary: '$90k - $110k',
    status: 'interviewing',
    appliedDate: '2024-01-10',
    lastUpdated: '2024-01-12',
    jobUrl: 'https://indeed.com/viewjob?jk=987654321',
    coverLetter: 'Generated cover letter for Web Solutions...',
    cvUsed: 'John Doe - Frontend Developer CV'
  },
  {
    id: '3',
    jobTitle: 'Full Stack Developer',
    company: 'StartupX',
    location: 'New York, NY',
    salary: '$100k - $130k',
    status: 'rejected',
    appliedDate: '2024-01-05',
    lastUpdated: '2024-01-08',
    jobUrl: 'https://glassdoor.co.uk/job/full-stack-123',
    coverLetter: 'Generated cover letter for StartupX...',
    cvUsed: 'John Doe - Full Stack Developer CV'
  }
];

const getStatusColor = (status: Application['status']) => {
  switch (status) {
    case 'applied':
      return 'bg-blue-100 text-blue-800';
    case 'interviewing':
      return 'bg-yellow-100 text-yellow-800';
    case 'accepted':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const Applications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                      My Applications
                    </h1>
                    <p className="text-gray-600 text-lg">
                      Track all your job applications, interview status, and responses
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="mt-6 flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search applications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Applications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApplications.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group cursor-pointer"
                  >
                    <Card className="h-full bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {app.jobTitle}
                            </h3>
                            <div className="flex items-center text-gray-600 mb-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mr-3">
                                <Building2 className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium">{app.company}</span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(app.status)}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-gray-600">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                              <MapPin className="w-3 h-3 text-gray-500" />
                            </div>
                            {app.location}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                              <DollarSign className="w-3 h-3 text-gray-500" />
                            </div>
                            {app.salary}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                              <Calendar className="w-3 h-3 text-gray-500" />
                            </div>
                            Applied: {new Date(app.appliedDate).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Cover Letter
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500">
                            Updated: {new Date(app.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {filteredApplications.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">No applications found</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    Start applying to jobs to see your applications here.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/job-opportunities'}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}; 