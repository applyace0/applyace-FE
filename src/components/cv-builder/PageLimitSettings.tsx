import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileText, Info } from 'lucide-react';
import { CVSettings } from '@/lib/cv/types';
import { isHarvardTemplate, getPageLimitWarning, isContentOverLimit, DEFAULT_CV_SETTINGS } from '@/lib/cv/pageLimit';

interface PageLimitSettingsProps {
  settings: CVSettings;
  onSettingsChange: (settings: CVSettings) => void;
  templateId: string;
  cvData: any;
}

const PageLimitSettings: React.FC<PageLimitSettingsProps> = ({
  settings,
  onSettingsChange,
  templateId,
  cvData,
}) => {
  const isHarvard = isHarvardTemplate(templateId);
  const warningMessage = getPageLimitWarning(cvData, templateId);
  const isOverLimit = isContentOverLimit(cvData, templateId);

  const handleAllowThreePagesChange = (checked: boolean) => {
    onSettingsChange({
      ...settings,
      allowThreePages: checked,
    });
  };

  const getMaxPagesText = () => {
    if (isHarvard) {
      return '1 page (Harvard standard)';
    }
    return settings.allowThreePages ? '3 pages' : '2 pages';
  };

  const getTrimmedItemsText = () => {
    const { trimmedItems } = settings;
    const items = [];
    
    if (trimmedItems.experiences > 0) {
      items.push(`${trimmedItems.experiences} experience${trimmedItems.experiences > 1 ? 's' : ''}`);
    }
    if (trimmedItems.education > 0) {
      items.push(`${trimmedItems.education} education entry${trimmedItems.education > 1 ? 'ies' : ''}`);
    }
    if (trimmedItems.certifications > 0) {
      items.push(`${trimmedItems.certifications} certification${trimmedItems.certifications > 1 ? 's' : ''}`);
    }
    if (trimmedItems.references > 0) {
      items.push(`${trimmedItems.references} reference${trimmedItems.references > 1 ? 's' : ''}`);
    }
    
    return items.length > 0 ? items.join(', ') : null;
  };

  const hasTrimmedContent = settings.trimmedItems && (
    settings.trimmedItems.experiences > 0 ||
    settings.trimmedItems.education > 0 ||
    settings.trimmedItems.certifications > 0 ||
    settings.trimmedItems.references > 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
            <FileText className="w-3 h-3" />
          </span>
          <span>Page Limit Settings</span>
          <Badge variant={isHarvard ? "destructive" : "secondary"} className="ml-2">
            {getMaxPagesText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Harvard Template Notice */}
        {isHarvard && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Harvard templates are limited to 1 page to maintain academic standards and ensure optimal readability.
            </AlertDescription>
          </Alert>
        )}

        {/* Three Pages Toggle */}
        {!isHarvard && (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Allow 3 pages</label>
              <p className="text-xs text-gray-500">
                Enable to allow up to 3 pages for comprehensive CVs
              </p>
            </div>
            <Switch
              checked={settings.allowThreePages}
              onCheckedChange={handleAllowThreePagesChange}
            />
          </div>
        )}

        {/* Warning Messages */}
        {warningMessage && (
          <Alert variant={isOverLimit ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {warningMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Trimmed Content Warning */}
        {hasTrimmedContent && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              ⚠️ Content was trimmed to fit the page limit: {getTrimmedItemsText()}
            </AlertDescription>
          </Alert>
        )}

        {/* Page Limit Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Default limit: 2 pages for optimal recruiter engagement</p>
          <p>• Harvard templates: 1 page for academic standards</p>
          <p>• Content is automatically trimmed if it exceeds the limit</p>
          <p>• Most recent and relevant items are prioritized</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PageLimitSettings; 