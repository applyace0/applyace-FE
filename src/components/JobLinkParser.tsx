import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Link, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface ParsedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  keywords: string[];
  description: string;
  url: string;
  parsed_at: string;
}

interface JobLinkParserProps {
  onJobParsed?: (job: ParsedJob) => void;
  className?: string;
}

export function JobLinkParser({ onJobParsed, className }: JobLinkParserProps) {
  const [jobUrl, setJobUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedJob, setParsedJob] = useState<ParsedJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const supportedDomains = [
        'linkedin.com',
        'indeed.com',
        'glassdoor.com',
        'monster.com',
        'reed.co.uk',
        'totaljobs.com',
        'cv-library.co.uk'
      ];
      
      return supportedDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  const parseJobLink = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to parse job links.',
        variant: 'destructive',
      });
      return;
    }

    if (!jobUrl.trim()) {
      setError('Please enter a job URL');
      return;
    }

    if (!validateUrl(jobUrl)) {
      setError('Please enter a valid job URL from a supported platform');
      return;
    }

    setIsParsing(true);
    setError(null);

    try {
      const response = await fetch('/api/jobs/parse-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'Authorization': `Bearer ${(await import('@/lib/supabase')).supabase.auth.getSession().then(({ data: { session } }) => session?.access_token)}`,
        },
        body: JSON.stringify({
          url: jobUrl,
          user_id: user.id,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        const job: ParsedJob = {
          id: data.job.id,
          title: data.job.title,
          company: data.job.company,
          location: data.job.location,
          skills: data.job.skills || [],
          keywords: data.job.keywords || [],
          description: data.job.description,
          url: jobUrl,
          parsed_at: new Date().toISOString(),
        };

        setParsedJob(job);
        onJobParsed?.(job);
        
        toast({
          title: 'Job Parsed Successfully',
          description: `Parsed "${job.title}" at ${job.company}`,
        });
      } else {
        const errorMessage = data.message || 'Failed to parse job link';
        setError(errorMessage);
        toast({
          title: 'Parsing Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Job parsing error:', error);
      const errorMessage = 'Network error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isParsing) {
      parseJobLink();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Job Link Parser
        </CardTitle>
        <CardDescription>
          Paste a job URL from LinkedIn, Indeed, or other supported platforms to automatically parse the job details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* URL Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Job URL</label>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://linkedin.com/jobs/view/..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isParsing}
              className="flex-1"
            />
            <Button
              onClick={parseJobLink}
              disabled={isParsing || !jobUrl.trim()}
              className="min-w-[100px]"
            >
              {isParsing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Parsing...
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 mr-2" />
                  Parse
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Parsed Job Display */}
        {parsedJob && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{parsedJob.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {parsedJob.company} • {parsedJob.location}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  Parsed
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(parsedJob.url, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </div>

            {/* Skills & Keywords */}
            {(parsedJob.skills.length > 0 || parsedJob.keywords.length > 0) && (
              <div className="space-y-2">
                {parsedJob.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Skills:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {parsedJob.skills.slice(0, 5).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {parsedJob.skills.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{parsedJob.skills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {parsedJob.keywords.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Keywords:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {parsedJob.keywords.slice(0, 5).map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {parsedJob.keywords.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{parsedJob.keywords.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Success Message */}
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                Job successfully parsed! You can now apply using the Apply Flow module.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Supported Platforms */}
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Supported Platforms:</p>
          <div className="flex flex-wrap gap-1">
            {['LinkedIn', 'Indeed', 'Glassdoor', 'Monster', 'Reed', 'TotalJobs', 'CV-Library'].map((platform) => (
              <Badge key={platform} variant="outline" className="text-xs">
                {platform}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 