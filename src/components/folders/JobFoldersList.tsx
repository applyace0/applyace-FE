
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Briefcase, FileText, Calendar, ExternalLink, Edit, Trash2, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import JobTailorModal from './JobTailorModal';

const JobFoldersList = () => {
  const [showJobTailor, setShowJobTailor] = useState(false);

  // Mock data for demonstration
  const jobFolders = [
    {
      id: 1,
      jobTitle: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      status: 'Interview Scheduled',
      appliedDate: '2024-06-15',
      cvTailored: true,
      interviewPrep: true,
      jobDescription: 'Full-stack development role...',
      salary: '$120k - $150k',
      location: 'San Francisco, CA'
    },
    {
      id: 2,
      jobTitle: 'Product Manager',
      company: 'StartupXYZ',
      status: 'Applied',
      appliedDate: '2024-06-10',
      cvTailored: true,
      interviewPrep: false,
      jobDescription: 'Lead product strategy and roadmap...',
      salary: '$130k - $160k',
      location: 'Remote'
    },
    {
      id: 3,
      jobTitle: 'Frontend Developer',
      company: 'Design Studio',
      status: 'In Review',
      appliedDate: '2024-06-08',
      cvTailored: true,
      interviewPrep: true,
      jobDescription: 'React and TypeScript development...',
      salary: '$100k - $130k',
      location: 'New York, NY'
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Applied': 
        return { 
          color: 'bg-blue-50 text-blue-700 border-blue-200', 
          icon: Clock,
          iconColor: 'text-blue-600'
        };
      case 'Interview Scheduled': 
        return { 
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
          icon: CheckCircle,
          iconColor: 'text-emerald-600'
        };
      case 'In Review': 
        return { 
          color: 'bg-amber-50 text-amber-700 border-amber-200', 
          icon: TrendingUp,
          iconColor: 'text-amber-600'
        };
      case 'Rejected': 
        return { 
          color: 'bg-red-50 text-red-700 border-red-200', 
          icon: Clock,
          iconColor: 'text-red-600'
        };
      default: 
        return { 
          color: 'bg-slate-50 text-slate-700 border-slate-200', 
          icon: Clock,
          iconColor: 'text-slate-600'
        };
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Job Applications</h3>
          <p className="text-slate-600 mt-1">Track and manage your tailored applications</p>
        </div>
        <Button 
          onClick={() => setShowJobTailor(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      <div className="grid gap-6">
        {jobFolders.map((job) => {
          const statusConfig = getStatusConfig(job.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <Card key={job.id} className="hover-lift border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div>
                      <CardTitle className="text-xl text-slate-900 mb-1">{job.jobTitle}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-slate-600">
                        <Briefcase className="h-4 w-4" />
                        {job.company} • {job.location}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="font-medium">{job.salary}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Applied {new Date(job.appliedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${statusConfig.color} border font-medium px-3 py-1`}>
                      <StatusIcon className={`h-3 w-3 mr-1 ${statusConfig.iconColor}`} />
                      {job.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {/* Progress Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border border-slate-200 bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900 text-sm mb-1">CV Status</h4>
                            <div className="flex items-center gap-2">
                              {job.cvTailored ? (
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-slate-400" />
                              )}
                              <span className={`text-xs font-medium ${
                                job.cvTailored ? 'text-emerald-700' : 'text-slate-600'
                              }`}>
                                {job.cvTailored ? 'Optimized' : 'Pending'}
                              </span>
                            </div>
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-slate-200 bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900 text-sm mb-1">Interview Prep</h4>
                            <div className="flex items-center gap-2">
                              {job.interviewPrep ? (
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-slate-400" />
                              )}
                              <span className={`text-xs font-medium ${
                                job.interviewPrep ? 'text-emerald-700' : 'text-slate-600'
                              }`}>
                                {job.interviewPrep ? 'Ready' : 'Not started'}
                              </span>
                            </div>
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border border-slate-200 bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900 text-sm mb-1">Overall Progress</h4>
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300"
                                  style={{ 
                                    width: `${job.cvTailored && job.interviewPrep ? 100 : job.cvTailored ? 60 : 30}%` 
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-slate-600">
                                {job.cvTailored && job.interviewPrep ? '100%' : job.cvTailored ? '60%' : '30%'}
                              </span>
                            </div>
                          </div>
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Application
                      </Button>
                      <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50">
                        <FileText className="h-4 w-4 mr-2" />
                        View CV
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {jobFolders.length === 0 && (
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No applications yet</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Start your job search journey by creating your first tailored application with our AI-powered tools.
              </p>
              <Button 
                onClick={() => setShowJobTailor(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Application
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {showJobTailor && (
        <JobTailorModal onClose={() => setShowJobTailor(false)} />
      )}
    </div>
  );
};

export default JobFoldersList;
