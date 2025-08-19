import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Star, StarOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ApiClient from '@/lib/api-client';

interface CV {
  id: string;
  title: string;
  is_primary: boolean;
  matchPct?: number;
}

interface BaseCVSelectorProps {
  jobId?: string;
  onCVSelected: (cvId: string) => void;
  onCancel: () => void;
  showSetAsDefault?: boolean;
}

export function BaseCVSelector({ 
  jobId, 
  onCVSelected, 
  onCancel, 
  showSetAsDefault = true 
}: BaseCVSelectorProps) {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [selectedCV, setSelectedCV] = useState<string | null>(null);
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settingPrimary, setSettingPrimary] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCVs();
  }, [jobId]);

  const fetchCVs = async () => {
    try {
      setLoading(true);
      const url = jobId 
        ? `/api/cvs?matchForJobId=${jobId}`
        : '/api/cvs';
      
      const response = await ApiClient.get<{ cvs: CV[] }>(url);
      setCvs(response.cvs || []);
      
      // Auto-select primary CV if available
      const primaryCV = response.cvs?.find((cv: CV) => cv.is_primary);
      if (primaryCV) {
        setSelectedCV(primaryCV.id);
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
      toast({
        title: "Error",
        description: "Failed to load your CVs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetAsPrimary = async () => {
    if (!selectedCV) return;
    
    try {
      setSettingPrimary(true);
      await ApiClient.post(`/api/cv/${selectedCV}/set-primary`, {});
      
      // Update local state
      setCvs(prev => prev.map(cv => ({
        ...cv,
        is_primary: cv.id === selectedCV
      })));
      
      toast({
        title: "Success",
        description: "CV set as default successfully"
      });
    } catch (error) {
      console.error('Error setting primary CV:', error);
      toast({
        title: "Error",
        description: "Failed to set CV as default",
        variant: "destructive"
      });
    } finally {
      setSettingPrimary(false);
    }
  };

  const handleConfirm = () => {
    if (selectedCV) {
      onCVSelected(selectedCV);
    }
  };

  const getMatchColor = (matchPct: number) => {
    if (matchPct >= 80) return 'text-green-600 bg-green-100';
    if (matchPct >= 60) return 'text-blue-600 bg-blue-100';
    if (matchPct >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading your CVs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Select CV for Application</h3>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {cvs.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 mb-4">No CVs found</p>
            <Button onClick={onCancel}>Create a CV first</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {cvs.map((cv) => (
            <Card 
              key={cv.id} 
              className={`cursor-pointer transition-colors ${
                selectedCV === cv.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedCV(cv.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={selectedCV === cv.id}
                      onCheckedChange={() => setSelectedCV(cv.id)}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{cv.title}</h4>
                        {cv.is_primary && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      {cv.matchPct !== undefined && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getMatchColor(cv.matchPct)}`}
                        >
                          {cv.matchPct}% match
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {!cv.is_primary && showSetAsDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCV(cv.id);
                        setSetAsDefault(true);
                      }}
                    >
                      <StarOff className="h-4 w-4 mr-1" />
                      Set as default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showSetAsDefault && selectedCV && setAsDefault && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Set as default CV?
                </p>
                <p className="text-xs text-blue-700">
                  This CV will be used automatically for future applications
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleSetAsPrimary}
                disabled={settingPrimary}
              >
                {settingPrimary ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Star className="h-4 w-4 mr-1" />
                )}
                Set Default
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm}
          disabled={!selectedCV}
        >
          Use Selected CV
        </Button>
      </div>
    </div>
  );
} 