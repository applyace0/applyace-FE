import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  FileText, 
  Brain, 
  Loader2, 
  Download, 
  Copy, 
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface CoverLetterData {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  cvContent: string;
  customMessage?: string;
}

interface GeneratedCoverLetter {
  content: string;
  wordCount: number;
  generatedAt: string;
  method: 'ai' | 'template';
}

const CoverLetterPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId?: string }>();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<CoverLetterData>({
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    cvContent: '',
    customMessage: ''
  });
  
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<GeneratedCoverLetter | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userCVs, setUserCVs] = useState<any[]>([]);
  const [selectedCV, setSelectedCV] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Load user CVs on component mount
  useEffect(() => {
    if (user) {
      loadUserCVs();
    }
  }, [user]);

  // Load job data if jobId is provided
  useEffect(() => {
    if (jobId) {
      loadJobData(jobId);
    }
  }, [jobId]);

  const loadUserCVs = async () => {
    try {
      const response = await fetch('/api/cv/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const cvs = await response.json();
        setUserCVs(cvs);
        if (cvs.length > 0) {
          setSelectedCV(cvs[0]);
          loadCVContent(cvs[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading CVs:', error);
      toast.error('Failed to load your CVs');
    }
  };

  const loadJobData = async (jobId: string) => {
    try {
      const response = await fetch(`/api/job/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const job = await response.json();
        setFormData(prev => ({
          ...prev,
          jobTitle: job.jobTitle || '',
          companyName: job.companyName || '',
          jobDescription: job.rawJD || ''
        }));
      }
    } catch (error) {
      console.error('Error loading job data:', error);
    }
  };

  const loadCVContent = async (cvId: string) => {
    try {
      const response = await fetch(`/api/cv/${cvId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const cv = await response.json();
        setFormData(prev => ({
          ...prev,
          cvContent: cv.parsed_text || ''
        }));
      }
    } catch (error) {
      console.error('Error loading CV content:', error);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!selectedCV || !formData.jobTitle || !formData.companyName) {
      toast.error('Please select a CV and fill in job details');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/cv/cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          cvId: selectedCV.id,
          jobTitle: formData.jobTitle,
          companyName: formData.companyName,
          jobDescription: formData.jobDescription,
          customMessage: formData.customMessage
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate cover letter' }));
        throw new Error(errorData.message || 'Failed to generate cover letter');
      }

      const result = await response.json();
      
      setGeneratedCoverLetter({
        content: result.coverLetter,
        wordCount: result.coverLetter.split(' ').length,
        generatedAt: new Date().toISOString(),
        method: 'ai'
      });

      toast.success('Cover letter generated successfully!');
    } catch (err: any) {
      console.error('Error generating cover letter:', err);
      setError(err.message || 'Failed to generate cover letter');
      toast.error(err.message || 'Failed to generate cover letter');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCoverLetter = async () => {
    if (!generatedCoverLetter) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/interview/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          jobId: jobId || 'manual',
          questions: [generatedCoverLetter.content],
          answers: [generatedCoverLetter.content]
        }),
      });

      if (response.ok) {
        toast.success('Cover letter saved successfully!');
      } else {
        throw new Error('Failed to save cover letter');
      }
    } catch (error) {
      console.error('Error saving cover letter:', error);
      toast.error('Failed to save cover letter');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedCoverLetter) {
      navigator.clipboard.writeText(generatedCoverLetter.content);
      toast.success('Cover letter copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (generatedCoverLetter) {
      const blob = new Blob([generatedCoverLetter.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cover-letter-${formData.companyName}-${formData.jobTitle}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Cover letter downloaded!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Cover Letter Generator</h1>
                <p className="text-sm text-gray-500">AI-powered cover letter creation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Job & CV Details
                </CardTitle>
                <CardDescription>
                  Provide job details and select your CV to generate a personalized cover letter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* CV Selection */}
                <div className="space-y-2">
                  <Label>Select CV</Label>
                  <select
                    value={selectedCV?.id || ''}
                    onChange={(e) => {
                      const cv = userCVs.find(c => c.id === e.target.value);
                      setSelectedCV(cv);
                      if (cv) loadCVContent(cv.id);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a CV...</option>
                    {userCVs.map((cv) => (
                      <option key={cv.id} value={cv.id}>
                        {cv.title || cv.full_name || 'Untitled CV'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Details */}
                <div className="space-y-2">
                  <Label>Job Title *</Label>
                  <Input
                    value={formData.jobTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="e.g., Google"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Job Description</Label>
                  <Textarea
                    value={formData.jobDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                    placeholder="Paste the job description here..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Custom Message (Optional)</Label>
                  <Textarea
                    value={formData.customMessage}
                    onChange={(e) => setFormData(prev => ({ ...prev, customMessage: e.target.value }))}
                    placeholder="Any specific points you'd like to emphasize..."
                    rows={3}
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateCoverLetter}
                  disabled={isGenerating || !selectedCV || !formData.jobTitle || !formData.companyName}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Generated Cover Letter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Generated Cover Letter
                </CardTitle>
                <CardDescription>
                  {generatedCoverLetter ? (
                    <div className="flex items-center gap-4">
                      <span>{generatedCoverLetter.wordCount} words</span>
                      <Badge variant="outline" className="text-xs">
                        Generated via {generatedCoverLetter.method === 'ai' ? 'AI' : 'Template'}
                      </Badge>
                    </div>
                  ) : (
                    'Your cover letter will appear here after generation'
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedCoverLetter ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {generatedCoverLetter.content}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCopyToClipboard}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={handleSaveCoverLetter}
                        disabled={isSaving}
                        size="sm"
                        className="flex-1"
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Fill in the job details and select your CV to generate a cover letter</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPage; 
 
 