import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Send, Loader2 } from 'lucide-react';

interface MassApplyBarProps {
  count: number;
  onApply: () => void;
  onCancel: () => void;
  isApplying?: boolean;
}

export function MassApplyBar({ count, onApply, onCancel, isApplying = false }: MassApplyBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {count} selected
              </Badge>
              <span className="text-sm text-muted-foreground">
                Ready to apply
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isApplying}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            
            <Button
              onClick={onApply}
              disabled={isApplying}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              {isApplying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Apply to {count} Job{count !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 