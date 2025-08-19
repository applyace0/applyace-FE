import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApiClient } from '@/lib/api-client';

interface JobsAddLinksModalProps {
  onSuccess?: () => void;
  children: React.ReactNode;
}

interface ParseResult {
  url: string;
  success: boolean;
  error?: string;
  jobId?: string;
}

export function JobsAddLinksModal({ onSuccess, children }: JobsAddLinksModalProps) {
  const [open, setOpen] = useState(false);
  const [urls, setUrls] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ParseResult[]>([]);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!urls.trim()) {
      toast({
        title: "No URLs provided",
        description: "Please enter at least one job URL.",
        variant: "destructive"
      });
      return;
    }

    const urlList = urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urlList.length === 0) {
      toast({
        title: "No valid URLs",
        description: "Please enter at least one valid job URL.",
        variant: "destructive"
      });
      return;
    }

    if (urlList.length > 50) {
      toast({
        title: "Too many URLs",
        description: "Please limit to 50 URLs at a time.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResults([]);

    try {
      const response = await ApiClient.post<{ successful: any[]; failed: any[] }>('/jobs/ingest-links', {
        urls: urlList
      });

      if (response.status === 'success') {
        const { successful, failed } = response.data;
        
        const allResults: ParseResult[] = [
          ...successful.map((s: any) => ({
            url: s.url,
            success: true,
            jobId: s.jobId
          })),
          ...failed.map((f: any) => ({
            url: f.url,
            success: false,
            error: f.error
          }))
        ];

        setResults(allResults);

        const successCount = successful.length;
        const failureCount = failed.length;

        toast({
          title: "Job links processed",
          description: `${successCount} jobs parsed successfully${failureCount > 0 ? `, ${failureCount} failed` : ''}.`,
          variant: successCount > 0 ? "default" : "destructive"
        });

        if (successCount > 0) {
          onSuccess?.();
          setOpen(false);
          setUrls('');
          setResults([]);
        }
      } else {
        throw new Error(response.message || 'Failed to process URLs');
      }
    } catch (error: any) {
      console.error('Failed to ingest job links:', error);
      toast({
        title: "Error processing URLs",
        description: error.message || "Failed to process job URLs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      setUrls(lines.join('\n'));
    };
    reader.readAsText(file);
  };

  const validateUrls = (urlList: string[]) => {
    const validUrls: string[] = [];
    const invalidUrls: string[] = [];

    urlList.forEach(url => {
      try {
        new URL(url);
        validUrls.push(url);
      } catch {
        invalidUrls.push(url);
      }
    });

    return { validUrls, invalidUrls };
  };

  const urlList = urls.split('\n').map(url => url.trim()).filter(url => url.length > 0);
  const { validUrls, invalidUrls } = validateUrls(urlList);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Job Links</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="urls">Job URLs (one per line)</Label>
            <Textarea
              id="urls"
              placeholder="https://linkedin.com/jobs/view/1234567890&#10;https://indeed.com/viewjob?jk=abcdef123&#10;https://glassdoor.com/job-listing/xyz..."
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              className="min-h-[120px]"
              disabled={isLoading}
            />
            <div className="flex items-center gap-2 mt-2">
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={isLoading}
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CSV/TXT
                  </span>
                </Button>
              </Label>
              {urlList.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {urlList.length} URL{urlList.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {invalidUrls.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  Invalid URLs ({invalidUrls.length})
                </span>
              </div>
              <div className="space-y-1">
                {invalidUrls.slice(0, 5).map((url, index) => (
                  <div key={index} className="text-xs text-red-700 font-mono">
                    {url}
                  </div>
                ))}
                {invalidUrls.length > 5 && (
                  <div className="text-xs text-red-700">
                    ...and {invalidUrls.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Processing Results</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm truncate flex-1">{result.url}</span>
                    {result.success ? (
                      <Badge variant="secondary" className="text-xs">
                        Success
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        {result.error}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {validUrls.length} valid URL{validUrls.length !== 1 ? 's' : ''} ready to process
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setUrls('');
                  setResults([]);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || validUrls.length === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Process ${validUrls.length} URL${validUrls.length !== 1 ? 's' : ''}`
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 