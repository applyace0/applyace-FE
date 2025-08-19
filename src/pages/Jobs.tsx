import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ApplyButton } from '@/components/ApplyButton';
import { MassApplyBar } from '@/components/MassApplyBar';
import { JobsHubApi } from '@/lib/api-client';
import { supabase } from '@/lib/supabase';
import { Plus, Link as LinkIcon, FileText, Search, Filter, Briefcase, Users, MapPin, Calendar, Star, Loader2, Brain } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  matchScore: number;
  url?: string; // Added for manual pasting
  postedDate?: string; // Added for manual pasting
  requirements?: string[]; // Made optional for backward compatibility
  benefits?: string[]; // Made optional for backward compatibility
  isSelected: boolean; // Added for mass mode
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $150k',
    description: 'We are looking for a Senior Software Engineer to join our team...',
    matchScore: 95,
    requirements: ['React', 'Node.js', 'TypeScript'],
    benefits: ['Health insurance', 'Remote work', 'Stock options'],
    isSelected: false
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Web Solutions',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90k - $110k',
    description: 'Join our team as a Frontend Developer and help build amazing web applications...',
    matchScore: 88,
    requirements: ['React', 'Vue.js', 'CSS'],
    benefits: ['Flexible hours', 'Learning budget'],
    isSelected: false
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'StartupX',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$100k - $130k',
    description: 'Looking for a Full Stack Developer to work on exciting projects...',
    matchScore: 92,
    requirements: ['Python', 'JavaScript', 'AWS'],
    benefits: ['Competitive salary', 'Growth opportunities'],
    isSelected: false
  }
];

export const JobOpportunities = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'single';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobsForMassApply, setSelectedJobsForMassApply] = useState<Set<string>>(new Set());
  const [isParsingJob, setIsParsingJob] = useState(false);
  const [showPasteJDModal, setShowPasteJDModal] = useState(false);
  const [pastedJD, setPastedJD] = useState('');
  const [jobUrlInput, setJobUrlInput] = useState('');
  const { toast } = useToast();

  // mode from query string determines whether mass selection is highlighted by default
  const defaultMass = useMemo(() => new URLSearchParams(window.location.search).get('mode') === 'mass', []);
  const [massMode] = useState<boolean>(defaultMass);
  // Enable Apply Flow UI by default (can be feature-flagged later)
  const isApplyFlowEnabled = true;

  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);

  useEffect(() => {
    const currentMode = searchParams.get('mode') || 'single';
    setSearchParams({ mode: currentMode });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const filterJobs = () => {
      let currentJobs = jobs;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        currentJobs = currentJobs.filter(job =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
        );
      }
      setFilteredJobs(currentJobs);
    };
    filterJobs();
  }, [searchQuery, jobs]);

  const handleJobSelection = (jobId: string, isSelected: boolean) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, isSelected: isSelected } : job
    ));
    setSelectedJobsForMassApply(prev => {
      const newSelection = new Set(prev);
      if (isSelected) {
        newSelection.add(jobId);
      } else {
        newSelection.delete(jobId);
      }
      return newSelection;
    });
  };

  const handleViewJob = (job: Job) => {
    // In the unified flow, viewing a job opens the job details
    // The ApplyButton component handles its own modal
    console.log('Viewing job:', job);
  };

  const handleJobApplied = (jobId: string) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, isSelected: false } : job
    ));
    setSelectedJobsForMassApply(prev => {
      const newSelection = new Set(prev);
      newSelection.delete(jobId);
      return newSelection;
    });
    toast({
      title: "Job Applied",
      description: `Job "${jobId}" applied successfully!`,
    });
  };

  const handleParseJobURL = async () => {
    if (!jobUrlInput.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a job URL",
        variant: "destructive"
      });
      return;
    }

    setIsParsingJob(true);
    try {
      const response = await JobsHubApi.parseJob({ url: jobUrlInput });
      
      if (response.status === 'success' && response.data) {
        const newJob: Job = {
          id: `job-${Date.now()}`,
          title: response.data.title,
          company: response.data.company,
          location: response.data.location || 'Remote',
          type: 'Full-time',
          salary: 'Competitive',
          description: response.data.jd_content,
          matchScore: 0, // Will be calculated when CV is tailored
          url: jobUrlInput,
          postedDate: new Date().toISOString(),
          requirements: [],
          benefits: [],
          isSelected: false
        };
        
        setJobs(prev => [newJob, ...prev]);
        setJobUrlInput('');
        
        toast({
          title: "Job Parsed Successfully",
          description: `Added "${response.data.title}" at ${response.data.company}`,
        });
      } else {
        toast({
          title: "Parsing Failed",
          description: response.message || "Failed to parse job URL. Try pasting the job description manually.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Job parsing error:', error);
      toast({
        title: "Error",
        description: "Failed to parse job URL. Try pasting the job description manually.",
        variant: "destructive"
      });
    } finally {
      setIsParsingJob(false);
    }
  };

  const handlePasteJD = () => {
    if (!pastedJD.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please paste the job description",
        variant: "destructive"
      });
      return;
    }

    // Extract basic info from pasted JD (simple parsing)
    const lines = pastedJD.split('\n').filter(line => line.trim());
    const title = lines[0] || 'Job Title';
    const company = lines[1] || 'Company Name';
    
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: title.substring(0, 100), // Limit length
      company: company.substring(0, 100),
      location: 'Remote',
      type: 'Full-time',
      salary: 'Competitive',
      description: pastedJD,
      matchScore: 0, // Will be calculated when CV is tailored
      url: undefined,
      postedDate: new Date().toISOString(),
      requirements: [],
      benefits: [],
      isSelected: false
    };
    
    setJobs(prev => [newJob, ...prev]);
    setPastedJD('');
    setShowPasteJDModal(false);
    
    toast({
      title: "Job Added",
      description: `Added "${title}" at ${company}`,
    });
  };

  // Legacy function removed - ApplyButton component now handles all apply logic

  // Legacy function removed - ApplyButton component now handles cover letter generation

  // Legacy function removed - ApplyButton component now handles application submission

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Job Opportunities
            </h1>
            <p className="text-gray-600 text-lg">
              {mode === 'single'
                ? 'Discover and apply to individual jobs with AI assistance'
                : 'Select multiple jobs for batch application processing'
              }
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center mt-6">
            <div className="bg-gray-100 rounded-lg p-1">
              <Button
                variant={mode === 'single' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSearchParams({ mode: 'single' })}
                className="rounded-md"
              >
                Single Apply
              </Button>
              <Button
                variant={mode === 'mass' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSearchParams({ mode: 'mass' })}
                className="rounded-md"
              >
                Mass Apply
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Input Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Jobs</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Parse Job URL */}
            <div className="space-y-3">
              <Label htmlFor="job-url" className="text-sm font-medium">
                Parse Job URL
              </Label>
              <div className="flex gap-2">
                <Input
                  id="job-url"
                  type="url"
                  placeholder="https://linkedin.com/jobs/view/..."
                  value={jobUrlInput}
                  onChange={(e) => setJobUrlInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isParsingJob && handleParseJobURL()}
                />
                <Button
                  onClick={handleParseJobURL}
                  disabled={isParsingJob || !jobUrlInput.trim()}
                  size="sm"
                >
                  {isParsingJob ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <LinkIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Paste a job URL from LinkedIn, Indeed, or other platforms
              </p>
            </div>

            {/* Paste Job Description */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Paste Job Description
              </Label>
              <Button
                onClick={() => setShowPasteJDModal(true)}
                variant="outline"
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Paste JD Manually
              </Button>
              <p className="text-xs text-muted-foreground">
                For jobs that can't be parsed automatically
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for jobs, companies, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
          />
        </div>



        {/* Selected Jobs Action Bar */}
        {isApplyFlowEnabled && selectedJobsForMassApply.size > 0 && (
          <div
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="text-lg font-medium text-green-900">
                    {selectedJobsForMassApply.size} job{selectedJobsForMassApply.size !== 1 ? 's' : ''} selected
                  </h3>
                  <p className="text-sm text-green-700">
                    Ready for batch application
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedJobsForMassApply(new Set())}
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  Clear Selection
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Implement unified mass apply modal
                    toast({
                      title: "Mass Apply",
                      description: "Mass apply functionality coming soon!",
                    });
                  }}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Apply to {selectedJobsForMassApply.size} Jobs
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      {job.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {job.company} • {job.location}
                    </CardDescription>
                  </div>
                  
                  {/* Checkbox for mass mode */}
                  {mode === 'mass' && (
                    <Checkbox
                      checked={job.isSelected}
                      onCheckedChange={(checked) => handleJobSelection(job.id, checked as boolean)}
                      className="ml-2"
                    />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Company, Location, Date details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {(() => {
                      const postedDate = job?.postedDate ? new Date(job.postedDate) : null;
                      const postedLabel = postedDate && !isNaN(postedDate.getTime())
                        ? postedDate.toLocaleDateString()
                        : '—';
                      return postedLabel;
                    })()}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {job.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {job.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {job.salary}
                    </Badge>
                  </div>
                  
                  {/* Action buttons based on mode */}
                  {mode === 'single' ? (
                    <ApplyButton
                      jobId={job.id}
                      jobTitle={job.title}
                      company={job.company}
                      jdContent={job.description}
                      onApplied={handleJobApplied}
                      className="text-sm"
                    />
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewJob(job)}
                    >
                      View
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No jobs found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
            <Button 
              onClick={() => setSearchParams({ mode: 'single' })}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Brain className="h-4 w-4 mr-2" />
              One-Click Apply
            </Button>
          </div>
        )}
      </div>

      {/* Mass Apply Modal - TODO: Implement unified mass apply modal */}

      {/* Paste JD Modal */}
      <Dialog open={showPasteJDModal} onOpenChange={setShowPasteJDModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Paste Job Description
            </DialogTitle>
            <DialogDescription>
              Paste the job description text. We'll extract the key information and add it to your job list.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the complete job description here..."
                value={pastedJD}
                onChange={(e) => setPastedJD(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handlePasteJD}
                disabled={!pastedJD.trim()}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Job
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPasteJDModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 