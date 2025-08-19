import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  FileText, 
  Mail,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface JobApplication {
  id: string;
  job_title: string;
  company: string;
  location: string;
  job_url: string;
  match_score: number;
  status: 'draft' | 'applied' | 'interview' | 'rejected' | 'offer';
  applied_at: string | null;
  created_at: string;
  tailored_cv?: {
    id: string;
    title: string;
    content: string;
  } | null;
  cover_letter?: {
    id: string;
    content: string;
  } | null;
}

export const JobApplications: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    try {
      // Use the new view for better performance and data consistency
      const { data, error } = await supabase
        .from('job_applications_with_content')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our interface
      const transformedData = data?.map(app => ({
        id: app.id,
        job_title: app.job_title,
        company: app.company,
        location: app.location,
        job_url: app.job_url,
        match_score: app.match_score,
        status: app.status,
        applied_at: app.applied_at,
        created_at: app.created_at,
        tailored_cv: app.cv_id && app.cv_title && app.cv_content ? {
          id: app.cv_id,
          title: app.cv_title,
          content: app.cv_content
        } : null,
        cover_letter: app.cover_letter_id && app.cover_letter_content ? {
          id: app.cover_letter_id,
          content: app.cover_letter_content
        } : null
      })) || [];

      setApplications(transformedData);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load job applications');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-green-100 text-green-800';
      case 'interview':
        return 'bg-blue-100 text-blue-800';
      case 'offer':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied':
        return <CheckCircle className="h-4 w-4" />;
      case 'interview':
        return <Calendar className="h-4 w-4" />;
      case 'offer':
        return <TrendingUp className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Recent Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Recent Applications
            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
              One Button Apply
            </Badge>
          </CardTitle>
          <CardDescription>
            Applications generated through AI-powered automation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-500 mb-4">
                Use the One Button Apply feature to automatically generate and submit job applications
              </p>
              <Button onClick={() => window.location.href = '/one-button-apply'}>
                Try One Button Apply
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 5).map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedApplication(application)}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {application.job_title}
                        </h3>
                        <Badge className={`text-xs ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{application.company}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {application.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(application.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {application.match_score}% Match
                        </div>
                        <Progress 
                          value={application.match_score} 
                          className="w-20 h-2 mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {applications.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline" onClick={() => window.location.href = '/jobs'}>
                    View All Applications ({applications.length})
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Details Modal */}
      {selectedApplication && (
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {selectedApplication.job_title} at {selectedApplication.company}
                <Badge className={`text-xs ${getStatusColor(selectedApplication.status)}`}>
                  {getStatusIcon(selectedApplication.status)}
                  <span className="ml-1 capitalize">{selectedApplication.status}</span>
                </Badge>
              </DialogTitle>
              <DialogDescription>
                View detailed information about your application for {selectedApplication.job_title} at {selectedApplication.company}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Job Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{selectedApplication.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Applied {selectedApplication.applied_at ? formatDate(selectedApplication.applied_at) : 'Not yet applied'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-gray-500" />
                      <a 
                        href={selectedApplication.job_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Original Job Posting
                      </a>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">AI Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Match Score</span>
                      <span className="font-medium">{selectedApplication.match_score}%</span>
                    </div>
                    <Progress value={selectedApplication.match_score} className="w-full" />
                  </div>
                </div>
              </div>

              {/* Generated Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedApplication.tailored_cv && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Tailored CV
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        GPT-4o Mini
                      </Badge>
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">
                        {selectedApplication.tailored_cv.title}
                      </p>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (!selectedApplication.tailored_cv) return;
                            try {
                              const cvContent = JSON.parse(selectedApplication.tailored_cv.content);
                              const cvText = `
${cvContent.full_name || 'Your Name'}
${cvContent.email || 'email@example.com'}
${cvContent.phone || 'Phone'}

PROFESSIONAL SUMMARY
${cvContent.summary || 'Professional summary'}

SKILLS
${cvContent.skills?.map((skill: string) => `• ${skill}`).join('\n') || 'Skills'}

EXPERIENCE
${cvContent.experience?.map((exp: any) => `
${exp.title} at ${exp.company}
${exp.duration}
${exp.description}`).join('\n\n') || 'Experience'}

EDUCATION
${cvContent.education?.map((edu: any) => `
${edu.degree} from ${edu.institution}
${edu.year}`).join('\n\n') || 'Education'}
                              `.trim();
                              navigator.clipboard.writeText(cvText);
                              toast.success('CV copied to clipboard!');
                            } catch (error) {
                              toast.error('Failed to copy CV');
                            }
                          }}
                        >
                          Copy CV Text
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (!selectedApplication.tailored_cv) return;
                            try {
                              const cvContent = JSON.parse(selectedApplication.tailored_cv.content);
                              // Open in new window for better viewing
                              const cvWindow = window.open('', '_blank');
                              if (cvWindow) {
                                cvWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>${cvContent.full_name || 'CV'} - ${selectedApplication.job_title}</title>
                                      <style>
                                        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
                                        h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
                                        h2 { color: #374151; margin-top: 30px; }
                                        .section { margin-bottom: 25px; }
                                        .skill { display: inline-block; background: #f3f4f6; padding: 4px 8px; margin: 2px; border-radius: 4px; }
                                        .experience-item { margin-bottom: 20px; }
                                        .experience-title { font-weight: bold; color: #1f2937; }
                                        .experience-company { color: #6b7280; }
                                        .experience-duration { color: #9ca3af; font-size: 0.9em; }
                                      </style>
                                    </head>
                                    <body>
                                      <h1>${cvContent.full_name || 'Your Name'}</h1>
                                      <p>${cvContent.email || 'email@example.com'} | ${cvContent.phone || 'Phone'}</p>
                                      
                                      <div class="section">
                                        <h2>Professional Summary</h2>
                                        <p>${cvContent.summary || 'Professional summary'}</p>
                                      </div>
                                      
                                      <div class="section">
                                        <h2>Skills</h2>
                                        <p>${cvContent.skills?.map((skill: string) => `<span class="skill">${skill}</span>`).join(' ') || 'Skills'}</p>
                                      </div>
                                      
                                      <div class="section">
                                        <h2>Experience</h2>
                                        ${cvContent.experience?.map((exp: any) => `
                                          <div class="experience-item">
                                            <div class="experience-title">${exp.title}</div>
                                            <div class="experience-company">${exp.company}</div>
                                            <div class="experience-duration">${exp.duration}</div>
                                            <p>${exp.description}</p>
                                          </div>
                                        `).join('') || 'Experience'}
                                      </div>
                                      
                                      <div class="section">
                                        <h2>Education</h2>
                                        ${cvContent.education?.map((edu: any) => `
                                          <div class="experience-item">
                                            <div class="experience-title">${edu.degree}</div>
                                            <div class="experience-company">${edu.institution}</div>
                                            <div class="experience-duration">${edu.year}</div>
                                          </div>
                                        `).join('') || 'Education'}
                                      </div>
                                    </body>
                                  </html>
                                `);
                                cvWindow.document.close();
                              }
                            } catch (error) {
                              toast.error('Failed to open CV');
                            }
                          }}
                        >
                          View Full CV
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedApplication.cover_letter && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Cover Letter
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        GPT-4o Mini
                      </Badge>
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 line-clamp-4 mb-3">
                        {selectedApplication.cover_letter.content.substring(0, 200)}...
                      </p>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (!selectedApplication.cover_letter) return;
                            navigator.clipboard.writeText(selectedApplication.cover_letter.content);
                            toast.success('Cover letter copied to clipboard!');
                          }}
                        >
                          Copy to Clipboard
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (!selectedApplication.cover_letter) return;
                            const letterWindow = window.open('', '_blank');
                            if (letterWindow) {
                              letterWindow.document.write(`
                                <html>
                                  <head>
                                    <title>Cover Letter - ${selectedApplication.job_title}</title>
                                    <style>
                                      body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; line-height: 1.8; }
                                      h1 { color: #2563eb; text-align: center; margin-bottom: 30px; }
                                      .content { white-space: pre-wrap; }
                                    </style>
                                  </head>
                                  <body>
                                    <h1>Cover Letter</h1>
                                    <div class="content">${selectedApplication.cover_letter.content}</div>
                                  </body>
                                </html>
                              `);
                              letterWindow.document.close();
                            }
                          }}
                        >
                          View Full Letter
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default JobApplications; 