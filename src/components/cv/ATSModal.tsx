import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ATSModalProps {
  open: boolean;
  onClose: () => void;
  results: {
    score: number;
    grammarSuggestions: string[];
    keywordMatch: number;
    missingKeywords: string[];
    overallFeedback: string;
  } | null;
  onBuildNewCV?: () => void;
  onSaveCV?: () => void;
}

const ATSModal: React.FC<ATSModalProps> = ({ open, onClose, results, onBuildNewCV, onSaveCV }) => {
  if (!results) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-orange-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">ATS</span>
            </div>
            ATS Analysis Results
          </DialogTitle>
          <DialogDescription>
            Your CV has been analyzed for ATS optimization
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* ATS Score */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h4 className="font-semibold mb-4">ATS Score</h4>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={results.score >= 80 ? "#10b981" : results.score >= 60 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="3"
                      strokeDasharray={`${results.score}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{results.score}%</span>
                  </div>
                </div>
                <p className={`text-sm font-medium ${getScoreColor(results.score)}`}>
                  {getScoreLabel(results.score)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Keyword Match */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4">Keyword Match</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Match Rate</span>
                  <span className="font-semibold">{results.keywordMatch}%</span>
                </div>
                <Progress value={results.keywordMatch} className="h-2" />
                {results.missingKeywords.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Missing Keywords:</p>
                    <div className="flex flex-wrap gap-1">
                      {results.missingKeywords.slice(0, 5).map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Grammar Suggestions */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4">Grammar & Style Suggestions</h4>
              <div className="space-y-3">
                {results.grammarSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Feedback */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4">Overall Feedback</h4>
              <p className="text-gray-700">{results.overallFeedback}</p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <div className="space-x-2">
              {onBuildNewCV && (
                <Button 
                  variant="outline" 
                  onClick={onBuildNewCV}
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  Build New CV
                </Button>
              )}
              {onSaveCV && (
                <Button 
                  onClick={onSaveCV}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  Save CV
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ATSModal; 