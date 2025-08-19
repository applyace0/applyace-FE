import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useApply } from '@/hooks/useApply';
import { useSubscription } from '@/hooks/useSubscription';
import { Clock, CheckCircle, XCircle, Link, Edit3, AlertTriangle, ExternalLink } from 'lucide-react';

interface Job {
  id: string;
  title?: string;
  company?: string;
  url?: string;
  parsed?: boolean;
  parsing?: boolean;
  error?: string;
}

interface MassApplyModalProps {
  jobs: Job[];
  cvId?: string;
  affiliateCode?: string;
  isOpen: boolean;
  onClose: () => void;
  onApplied?: (jobIds: string[], successCount: number) => void;
}

export function MassApplyModal({
  jobs,
  cvId,
  affiliateCode,
  isOpen,
  onClose,
  onApplied
}: MassApplyModalProps) {
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [isApplying, setIsApplying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [jobStatuses, setJobStatuses] = useState<Record<string, 'pending' | 'success' | 'error'>>({});
  const [parsedJobs, setParsedJobs] = useState<Record<string, any>>({});
  const [keywordMatches, setKeywordMatches] = useState<Record<string, number>>({});
  const [showTailorOptions, setShowTailorOptions] = useState(false);
  const [tailorCV, setTailorCV] = useState(false);
  const [generateCoverLetter, setGenerateCoverLetter] = useState(false);
  
  const { toast } = useToast();
  const { applyBatch } = useApply();
  const { subscription, remainingApplies, isLoading: isLoadingSubscription, isUnlimited, tier } = useSubscription();

  // Check if user has access to CV tailoring and cover letter features
  const canTailorCV = tier === 'professional' || tier === 'career_pro' || tier === 'elite_executive';
  const canGenerateCoverLetter = tier === 'career_pro' || tier === 'elite_executive';

  useEffect(() => {
    if (isOpen) {
      // Auto-select all jobs that have URLs or are already parsed
      const autoSelectJobs = jobs.filter(job => job.url || job.parsed).map(job => job.id);
      setSelectedJobs(new Set(autoSelectJobs));
    }
  }, [isOpen, jobs]);

  const handleJobSelection = (jobId: string, selected: boolean) => {
    const newSelection = new Set(selectedJobs);
    if (selected) {
      newSelection.add(jobId);
    } else {
      newSelection.delete(jobId);
    }
    setSelectedJobs(newSelection);
  };

  const parseJobUrl = async (job: Job) => {
    if (!job.url) return;

    setJobStatuses(prev => ({ ...prev, [job.id]: 'pending' }));
    
    try {
      const response = await fetch('/api/jobs/parse-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: job.url,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setParsedJobs(prev => ({ ...prev, [job.id]: data.job }));
        
        // Simulate keyword matching
        const mockKeywordMatch = Math.floor(Math.random() * 40) + 60; // 60-100%
        setKeywordMatches(prev => ({ ...prev, [job.id]: mockKeywordMatch }));
        
        toast({
          title: "Job Parsed",
          description: `Parsed "${data.job.title}" at ${data.job.company}`,
        });
      } else {
        setJobStatuses(prev => ({ ...prev, [job.id]: 'error' }));
        toast({
          title: "Parsing Failed",
          description: data.message || "Failed to parse job link",
          variant: "destructive",
        });
      }
    } catch (error) {
      setJobStatuses(prev => ({ ...prev, [job.id]: 'error' }));
      toast({
        title: "Error",
        description: "Failed to parse job URL",
        variant: "destructive"
      });
    }
  };

  const parseAllUnparsedJobs = async () => {
    const unparsedJobs = jobs.filter(job => job.url && !parsedJobs[job.id]);
    
    for (const job of unparsedJobs) {
      await parseJobUrl(job);
    }
  };

  const handleBatchApply = async () => {
    if (!cvId) {
      toast({
        title: "CV Required",
        description: "Please select a CV before applying",
        variant: "destructive"
      });
      return;
    }

    const selectedJobList = Array.from(selectedJobs);
    if (selectedJobList.length === 0) {
      toast({
        title: "No Jobs Selected",
        description: "Please select at least one job to apply to",
        variant: "destructive"
      });
      return;
    }

    // Check if we have enough applies
    if (remainingApplies < selectedJobList.length && !isUnlimited) {
      toast({
        title: "Insufficient Applies",
        description: `You need ${selectedJobList.length} applies but only have ${remainingApplies} remaining`,
        variant: "destructive"
      });
      return;
    }

    setIsApplying(true);
    setProgress(0);
    
    // Initialize all selected jobs as pending
    const initialStatuses: Record<string, 'pending' | 'success' | 'error'> = {};
    selectedJobList.forEach(jobId => {
      initialStatuses[jobId] = 'pending';
    });
    setJobStatuses(initialStatuses);

    try {
      const result = await applyBatch(selectedJobList, cvId, affiliateCode, {
        tailorCV,
        generateCoverLetter,
        parsedJobsData: parsedJobs
      });

      if (result.success) {
        const successCount = result.results?.filter(r => r.success).length || 0;
        toast({
          title: "Batch Application Complete",
          description: `Successfully applied to ${successCount} of ${selectedJobList.length} jobs`,
        });
        onApplied?.(selectedJobList, successCount);
        
        // Update job statuses based on results
        const newStatuses: Record<string, 'pending' | 'success' | 'error'> = {};
        result.results?.forEach(r => {
          newStatuses[r.jobId] = r.success ? 'success' : 'error';
        });
        setJobStatuses(newStatuses);
      } else {
        toast({
          title: "Batch Application Failed",
          description: result.error || "Failed to submit batch application",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
      setProgress(100);
    }
  };

  const getJobStatusIcon = (jobId: string) => {
    const status = jobStatuses[jobId];
    if (status === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'error') return <XCircle className="h-4 w-4 text-red-500" />;
    if (status === 'pending') return <Clock className="h-4 w-4 animate-pulse" />;
    return null;
  };

  const getKeywordMatchColor = (match: number) => {
    if (match >= 80) return 'text-green-600';
    if (match >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Mass Apply to Jobs
          </DialogTitle>
          <DialogDescription>
            Select jobs to apply to and customize your applications based on your subscription tier.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Select Jobs</h3>
              <Badge variant="secondary">
                {selectedJobs.size} of {jobs.length} selected
              </Badge>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {jobs.map((job) => (
                <div key={job.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={selectedJobs.has(job.id)}
                    onCheckedChange={(checked) => handleJobSelection(job.id, checked as boolean)}
                    disabled={isApplying}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">
                        {job.title || `Job ${job.id}`}
                      </h4>
                      {getJobStatusIcon(job.id)}
                    </div>
                    
                    {job.company && (
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    )}
                    
                    {/* Keyword Match for Parsed Jobs */}
                    {parsedJobs[job.id] && keywordMatches[job.id] !== undefined && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs">CV Match:</span>
                        <span className={`text-xs font-medium ${getKeywordMatchColor(keywordMatches[job.id])}`}>
                          {keywordMatches[job.id]}%
                        </span>
                        {keywordMatches[job.id] < 60 && (
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Job URL Actions */}
                  <div className="flex items-center gap-2">
                    {job.url && !parsedJobs[job.id] && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => parseJobUrl(job)}
                        disabled={isApplying}
                      >
                        <Link className="h-3 w-3 mr-1" />
                        Parse
                      </Button>
                    )}
                    
                    {job.url && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(job.url, '_blank')}
                        disabled={isApplying}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Parse All Button */}
            {jobs.some(job => job.url && !parsedJobs[job.id]) && (
              <Button
                variant="outline"
                onClick={parseAllUnparsedJobs}
                disabled={isApplying}
                className="w-full"
              >
                <Link className="h-4 w-4 mr-2" />
                Parse All Job URLs
              </Button>
            )}
          </div>

          {/* Quota Check */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Required vs Available</span>
              <span className={`text-sm font-medium ${selectedJobs.size > remainingApplies && !isUnlimited ? 'text-red-600' : 'text-green-600'}`}>
                {selectedJobs.size} needed • {isUnlimited ? 'Unlimited' : `${remainingApplies} available`}
              </span>
            </div>
            
            {selectedJobs.size > remainingApplies && !isUnlimited && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You need {selectedJobs.size} applies but only have {remainingApplies} remaining. Purchase extras to continue.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* CV Tailoring & Cover Letter Options */}
          {(canTailorCV || canGenerateCoverLetter) && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Application Enhancements</h4>
              
              {canTailorCV && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tailor-cv-batch"
                    checked={tailorCV}
                    onCheckedChange={(checked) => setTailorCV(checked as boolean)}
                    disabled={isApplying}
                  />
                  <Label htmlFor="tailor-cv-batch" className="text-sm">
                    Tailor CV to each job (Professional+)
                  </Label>
                </div>
              )}

              {canGenerateCoverLetter && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cover-letter-batch"
                    checked={generateCoverLetter}
                    onCheckedChange={(checked) => setGenerateCoverLetter(checked as boolean)}
                    disabled={isApplying}
                  />
                  <Label htmlFor="cover-letter-batch" className="text-sm">
                    Generate cover letters (Career Pro+)
                  </Label>
                </div>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {isApplying && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Applying to jobs...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleBatchApply}
              disabled={isApplying || selectedJobs.size === 0 || (selectedJobs.size > remainingApplies && !isUnlimited) || !cvId}
              className="flex-1"
            >
              {isApplying ? (
                <>
                  <Clock className="h-4 w-4 animate-spin mr-2" />
                  Applying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Apply to {selectedJobs.size} Jobs
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isApplying}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 