
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, Target, FileText, Wand2, Check } from 'lucide-react';

interface JobTailorModalProps {
  onClose: () => void;
}

const JobTailorModal = ({ onClose }: JobTailorModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    jobUrl: '',
    jobDescription: '',
    baseCv: '',
    notes: ''
  });

  const steps = [
    { number: 1, title: 'Job Details', icon: Target },
    { number: 2, title: 'Job Description', icon: FileText },
    { number: 3, title: 'CV Selection', icon: FileText },
    { number: 4, title: 'Tailoring', icon: Wand2 }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyzeAndTailor = async () => {
    setIsAnalyzing(true);
    // TODO: Implement AI analysis and CV tailoring
    console.log('Analyzing job description and tailoring CV...');
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 4000);
  };

  const handleSave = () => {
    // TODO: Save tailored CV and job application
    console.log('Saving job application:', formData);
    onClose();
  };

  const progress = (currentStep / steps.length) * 100;

  if (analysisComplete) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              CV Tailoring Complete
            </DialogTitle>
            <DialogDescription>
              Your CV has been optimized for the {formData.jobTitle} position
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-gray-600">ATS Match Score</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">15</div>
                  <div className="text-sm text-gray-600">Keywords Added</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">8</div>
                  <div className="text-sm text-gray-600">Sections Enhanced</div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Improvements Made</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Added relevant keywords: "React", "Node.js", "Agile methodology"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Emphasized experience with cloud platforms and DevOps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Reworded achievements to match company culture and values</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Optimized summary section for senior-level responsibilities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Review tailored CV</h4>
                      <p className="text-sm text-gray-600">Make any final adjustments before applying</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Target className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Prepare for interviews</h4>
                      <p className="text-sm text-gray-600">Generate practice questions based on the job description</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Review Later
              </Button>
              <Button onClick={handleSave}>
                Save Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Tailor CV for Job Application</DialogTitle>
          <DialogDescription>
            Let's optimize your CV for this specific job opportunity
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {/* Step 1: Job Details */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Job Details
                  </CardTitle>
                  <CardDescription>
                    Enter the basic information about the job you're applying for
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        placeholder="Senior Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="TechCorp Inc."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobUrl">Job Posting URL (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-gray-400" />
                      <Input
                        id="jobUrl"
                        value={formData.jobUrl}
                        onChange={(e) => handleInputChange('jobUrl', e.target.value)}
                        placeholder="https://company.com/careers/job-posting"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 2: Job Description */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Job Description
                  </CardTitle>
                  <CardDescription>
                    Paste the complete job description for AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea
                      id="jobDescription"
                      value={formData.jobDescription}
                      onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                      placeholder="Paste the full job description here..."
                      className="min-h-[300px]"
                    />
                    <p className="text-sm text-gray-600">
                      Include requirements, responsibilities, and any specific keywords mentioned
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 3: CV Selection */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Select Base CV
                  </CardTitle>
                  <CardDescription>
                    Choose which CV to use as the foundation for tailoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseCv">Base CV</Label>
                    <Select onValueChange={(value) => handleInputChange('baseCv', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a CV to tailor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="base-cv-1">Software Engineer CV (Primary)</SelectItem>
                        <SelectItem value="base-cv-2">Full Stack Developer CV</SelectItem>
                        <SelectItem value="base-cv-3">Technical Lead CV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any specific aspects you want to emphasize or company insights..."
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 4: Tailoring */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    AI CV Tailoring
                  </CardTitle>
                  <CardDescription>
                    Our AI will analyze the job description and optimize your CV
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">What our AI will do:</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Extract key requirements and preferred skills</li>
                      <li>• Match relevant keywords from your experience</li>
                      <li>• Optimize section order and emphasis</li>
                      <li>• Enhance descriptions for ATS compatibility</li>
                      <li>• Adjust tone to match company culture</li>
                    </ul>
                  </div>
                  
                  {isAnalyzing && (
                    <div className="text-center space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <div>
                        <p className="font-medium">Analyzing job requirements...</p>
                        <p className="text-sm text-gray-600">This may take a few moments</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Job Summary:</h4>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Position:</span> {formData.jobTitle || 'Not specified'}<br />
                        <span className="font-medium">Company:</span> {formData.company || 'Not specified'}<br />
                        <span className="font-medium">Base CV:</span> {formData.baseCv ? 'Selected' : 'Not selected'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious} 
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {currentStep === steps.length ? (
                <Button 
                  onClick={handleAnalyzeAndTailor} 
                  disabled={isAnalyzing || !formData.jobDescription || !formData.baseCv}
                >
                  {isAnalyzing ? 'Tailoring...' : 'Tailor CV'}
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobTailorModal;
