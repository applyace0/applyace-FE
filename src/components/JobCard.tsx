import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Bookmark, BookmarkCheck, ExternalLink, MapPin, Building2 } from 'lucide-react';
import { getMatchColor } from '@/lib/utils';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    description: string;
    source_url: string;
    matchPct: number;
    isSaved: boolean;
    keywords?: string[];
  };
  selectable?: boolean;
  selected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  onApply?: () => void;
  onSave?: () => void;
  onUnsave?: () => void;
  isApplying?: boolean;
  isSaving?: boolean;
}

export function JobCard({
  job,
  selectable = false,
  selected = false,
  onSelectChange,
  onApply,
  onSave,
  onUnsave,
  isApplying = false,
  isSaving = false
}: JobCardProps) {
  const matchColor = getMatchColor(job.matchPct);
  const matchStatus = job.matchPct >= 80 ? 'excellent' : 
                     job.matchPct >= 60 ? 'good' : 
                     job.matchPct >= 40 ? 'fair' : 'poor';

  return (
    <Card className="relative hover:shadow-md transition-shadow">
      {selectable && (
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onSelectChange?.(checked as boolean)}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate" title={job.title}>
                {job.title}
              </h3>
              <Badge variant="secondary" className={matchColor}>
                {job.matchPct}% match
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span className="truncate">{job.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{job.location}</span>
              </div>
            </div>
            
            {job.salary && (
              <div className="text-sm text-green-600 font-medium mt-1">
                {job.salary}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={job.isSaved ? onUnsave : onSave}
              disabled={isSaving}
              className="h-8 w-8 p-0"
            >
              {job.isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(job.source_url, '_blank')}
              className="h-8 w-8 p-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {job.description}
        </p>
        
        {job.keywords && job.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {job.keywords.slice(0, 5).map((keyword, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {job.keywords.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{job.keywords.length - 5} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Match quality: <span className="capitalize">{matchStatus}</span>
          </div>
          
          <Button
            onClick={onApply}
            disabled={isApplying || job.matchPct < 40}
            size="sm"
            className="ml-auto"
          >
            {isApplying ? 'Applying...' : 'Apply Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 