import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { JobsHubApi } from '@/lib/api-client';
import { supabase } from '@/lib/supabase';
import { Clock, CheckCircle, XCircle, Link, FileText, Edit3, AlertTriangle, Lock, Plus, Loader2 } from 'lucide-react';

interface ApplyButtonProps {
  jobId: string;
  jobTitle: string;
  company: string;
  jdContent: string;
  onApplied?: (jobId: string, success: boolean) => void;
  className?: string;
}

interface CV {
  id: string;
  title: string;
  filename: string;
  created_at: string;
}

export function ApplyButton({
  jobId,
  jobTitle,
  company,
  jdContent,
  onApplied,
  className
}: ApplyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedCVId, setSelectedCVId] = useState<string>('');
  const [userCVs, setUserCVs] = useState<CV[]>([]);
  const [isLoadingCVs, setIsLoadingCVs] = useState(false);
  
  // Tailor Preview state
  const [previewData, setPreviewData] = useState<{
    match: number;
    keywords: string[];
    summary: string[];
    suggested_name: string;
  } | null>(null);
  
  // Apply options
  const [generateCoverLetter, setGenerateCoverLetter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { subscription, remainingApplies, nextResetDate, isLoading: isLoadingSubscription, isUnlimited, tier } = useSubscription();

  // Check feature access based on tier
  const canGenerateCoverLetter = tier === 'professional' || tier === 'career_pro' || tier === 'elite_executive';

  // Load user CVs when modal opens
  useEffect(() => {
    if (isApplyModalOpen && userCVs.length === 0) {
      loadUserCVs();
    }
  }, [isApplyModalOpen]);

  const loadUserCVs = async () => {
    setIsLoadingCVs(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await JobsHubApi.getUserCVs();
      if (response.status === 'success' && response.data) {
        setUserCVs(response.data);
        if (response.data.length > 0) {
          setSelectedCVId(response.data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load CVs:', error);
      toast({
        title: "Error",
        description: "Failed to load your CVs",
        variant: "destructive"
      });
    } finally {
      setIsLoadingCVs(false);
    }
  };

  const handleTailorPreview = async () => {
    if (!selectedCVId) {
      toast({
        title: "CV Required",
        description: "Please select a CV first",
        variant: "destructive"
      });
      return;
    }

    setIsPreviewLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await JobsHubApi.tailorPreview({
        user_id: user.id,
        cv_id: selectedCVId,
        jd_content: jdContent
      });

      if (response.status === 'success' && response.data) {
        setPreviewData(response.data);
        toast({
          title: "Preview Generated",
          description: `Match: ${response.data.match}% - ${response.data.keywords.length} keywords found`,
        });
      } else {
        toast({
          title: "Preview Failed",
          description: response.message || "Failed to generate preview",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast({
        title: "Error",
        description: "Failed to generate preview",
        variant: "destructive"
      });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!selectedCVId) {
      toast({
        title: "CV Required",
        description: "Please select a CV first",
        variant: "destructive"
      });
      return;
    }

    if (remainingApplies <= 0 && !isUnlimited) {
      toast({
        title: "Quota Exceeded",
        description: "You've reached your monthly apply limit. Purchase extras to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await JobsHubApi.applySingle({
        user_id: user.id,
        cv_id: selectedCVId,
        job_id: jobId,
        jd_content: jdContent,
        generate_cover_letter: generateCoverLetter
      });

      if (response.status === 'success' && response.data) {
        toast({
          title: "Application Submitted",
          description: `Successfully applied to ${jobTitle} at ${company}`,
        });
        onApplied?.(jobId, true);
        setIsApplyModalOpen(false);
      } else {
        toast({
          title: "Application Failed",
          description: response.message || "Failed to submit application",
          variant: "destructive"
        });
        onApplied?.(jobId, false);
      }
    } catch (error) {
      console.error('Apply error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      onApplied?.(jobId, false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isLoading || isLoadingSubscription || (remainingApplies <= 0 && !isUnlimited);

  const getButtonText = () => {
    if (isLoading) return "Loading...";
    if (remainingApplies <= 0 && !isUnlimited) return "Quota Exceeded";
    return "Apply";
  };

  const getTooltipText = () => {
    if (remainingApplies <= 0 && !isUnlimited) return "Purchase extras to continue applying";
    return "Apply to this job";
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsApplyModalOpen(true)}
                disabled={isDisabled}
                className={`${className} min-w-[120px]`}
                aria-disabled={isDisabled}
              >
                {getButtonText()}
              </Button>
              
              {!isLoadingSubscription && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="text-xs cursor-help">
                          {isUnlimited ? 'Unlimited*' : `${remainingApplies} left`}
                        </Badge>
                      </TooltipTrigger>
                      {isUnlimited && (
                        <TooltipContent>
                          <p className="text-xs">Fair Usage Policy: Subject to reasonable usage limits to prevent abuse.</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTooltipText()}</p>
            {nextResetDate && (
              <p className="text-xs text-muted-foreground mt-1">
                Resets {new Date(nextResetDate).toLocaleDateString()}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Apply Modal */}
      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Apply to {jobTitle}
            </DialogTitle>
            <DialogDescription>
              Select your CV and customize your application. Preview how your CV matches this job before applying.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Job Summary */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium text-lg mb-2">{jobTitle}</h4>
              <p className="text-muted-foreground">{company}</p>
            </div>

            {/* CV Selection */}
            <div className="space-y-3">
              <Label htmlFor="cv-select">Select Base CV</Label>
              <div className="flex gap-2">
                <Select value={selectedCVId} onValueChange={setSelectedCVId} disabled={isLoadingCVs}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={isLoadingCVs ? "Loading CVs..." : "Choose a CV"} />
                  </SelectTrigger>
                  <SelectContent>
                    {userCVs.map((cv) => (
                      <SelectItem key={cv.id} value={cv.id}>
                        {cv.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="px-3">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tailor Preview Section */}
            {selectedCVId && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Tailor Preview</h4>
                  <Button
                    onClick={handleTailorPreview}
                    disabled={isPreviewLoading}
                    variant="outline"
                    size="sm"
                  >
                    {isPreviewLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Edit3 className="h-4 w-4 mr-2" />
                    )}
                    {isPreviewLoading ? "Generating..." : "Preview Changes"}
                  </Button>
                </div>

                {previewData && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    {/* Match Score */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">CV-Job Match</span>
                        <span className={`text-lg font-bold ${previewData.match >= 80 ? 'text-green-600' : previewData.match >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {previewData.match}%
                        </span>
                      </div>
                      <Progress value={previewData.match} className="h-2" />
                    </div>

                    {/* Keywords */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Keywords Found</span>
                      <div className="flex flex-wrap gap-1">
                        {previewData.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Changes Summary */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium">What Will Change</span>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {previewData.summary.map((change, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggested Filename */}
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Suggested Filename</span>
                      <p className="text-sm text-muted-foreground font-mono bg-background p-2 rounded border">
                        {previewData.suggested_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cover Letter Option */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="cover-letter"
                  checked={generateCoverLetter}
                  onChange={(e) => setGenerateCoverLetter(e.target.checked)}
                  disabled={!canGenerateCoverLetter}
                  className="rounded"
                />
                <Label htmlFor="cover-letter" className="text-sm flex items-center gap-2">
                  Generate Cover Letter
                  {!canGenerateCoverLetter && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Lock className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Upgrade to Professional+ tier to generate cover letters</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Label>
              </div>
              {!canGenerateCoverLetter && (
                <p className="text-xs text-muted-foreground">
                  Upgrade to Professional+ tier to automatically generate tailored cover letters for each application.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmitApplication}
                disabled={!selectedCVId || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsApplyModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 