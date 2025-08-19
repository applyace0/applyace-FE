import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApplyButton } from '@/components/ApplyButton';
import { MassApplyModal } from '@/components/MassApplyModal';
import { SubscriptionStatusWidget } from '@/components/SubscriptionStatusWidget';
import { useAuth } from '@/hooks/useAuth';
import { ExternalLink, Building2, MapPin, Clock, Users } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url?: string;
  description?: string;
  salary?: string;
  postedDate?: string;
  applicants?: number;
}

interface JobListingProps {
  jobs: Job[];
  className?: string;
}

export function JobListing({ jobs, className }: JobListingProps) {
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [isMassApplyOpen, setIsMassApplyOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState<string>('');
  const { user } = useAuth();

  const handleJobSelection = (jobId: string, selected: boolean) => {
    const newSelection = new Set(selectedJobs);
    if (selected) {
      newSelection.add(jobId);
    } else {
      newSelection.delete(jobId);
    }
    setSelectedJobs(newSelection);
  };

  const handleSingleApply = (jobId: string, success: boolean) => {
    console.log(`Single apply to ${jobId}: ${success ? 'success' : 'failed'}`);
  };

  const handleBatchApply = (jobIds: string[], successCount: number) => {
    console.log(`Batch apply to ${jobIds.length} jobs: ${successCount} successful`);
    setSelectedJobs(new Set());
    setIsMassApplyOpen(false);
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please sign in to view job listings</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Subscription Status */}
      <div className="mb-6">
        <SubscriptionStatusWidget showExtrasButton={true} />
      </div>

      {/* CV Selection */}
      <div className="mb-6 p-4 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-medium mb-2">Select CV for Applications</h3>
        <div className="flex gap-2">
          <Button
            variant={selectedCV === 'cv-1' ? 'default' : 'outline'}
            onClick={() => setSelectedCV('cv-1')}
            size="sm"
          >
            CV 1 (Software Engineer)
          </Button>
          <Button
            variant={selectedCV === 'cv-2' ? 'default' : 'outline'}
            onClick={() => setSelectedCV('cv-2')}
            size="sm"
          >
            CV 2 (Product Manager)
          </Button>
          <Button
            variant={selectedCV === 'cv-3' ? 'default' : 'outline'}
            onClick={() => setSelectedCV('cv-3')}
            size="sm"
          >
            CV 3 (Data Scientist)
          </Button>
        </div>
      </div>

      {/* Mass Apply Controls */}
      {selectedJobs.size > 0 && (
        <div className="mb-6 p-4 border rounded-lg bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-blue-900">
                {selectedJobs.size} job{selectedJobs.size !== 1 ? 's' : ''} selected
              </h3>
              <p className="text-sm text-blue-700">
                Ready for batch application
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedJobs(new Set())}
                size="sm"
              >
                Clear Selection
              </Button>
              <Button
                onClick={() => setIsMassApplyOpen(true)}
                disabled={!selectedCV}
                size="sm"
              >
                Apply to {selectedJobs.size} Jobs
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Job Listings */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    {job.postedDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{job.postedDate}</span>
                      </div>
                    )}
                    {job.applicants && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{job.applicants} applicants</span>
                      </div>
                    )}
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Job Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedJobs.has(job.id)}
                    onChange={(e) => handleJobSelection(job.id, e.target.checked)}
                    className="rounded"
                  />
                  
                  {/* Apply Button */}
                  <ApplyButton
                    jobId={job.id}
                    jobTitle={job.title}
                    company={job.company}
                    jdContent={job.description || ''}
                    onApplied={handleSingleApply}
                    className="min-w-[100px]"
                  />
                  
                  {/* External Link */}
                  {job.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(job.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            {job.description && (
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {job.description}
                </p>
                {job.salary && (
                  <Badge variant="secondary" className="mt-2">
                    {job.salary}
                  </Badge>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Mass Apply Modal */}
      <MassApplyModal
        jobs={Array.from(selectedJobs).map(jobId => {
          const job = jobs.find(j => j.id === jobId);
          return {
            id: jobId,
            title: job?.title,
            company: job?.company,
            url: job?.url,
          };
        })}
        cvId={selectedCV}
        isOpen={isMassApplyOpen}
        onClose={() => setIsMassApplyOpen(false)}
        onApplied={handleBatchApply}
      />
    </div>
  );
} 