import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Brain, CheckCircle, AlertCircle, TrendingUp, Target, FileText, Zap, Crown, Sparkles, ArrowRight, Star, Plus } from 'lucide-react';
import { CVAnalysisResponse, CVSuggestion } from '../../lib/ai/types';
import { useAuth } from '../../lib/auth';
import { toast } from '../../hooks/use-toast';

interface CVAnalysisProps {
  cvId: string;
  cvText: string;
  jobDescription?: string;
  onAnalysisComplete?: (analysis: CVAnalysisResponse) => void;
}

export function CVAnalysis({ cvId, cvText, jobDescription, onAnalysisComplete }: CVAnalysisProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CVAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleAnalyze = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to analyze your CV",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Remove or comment out: const result = await aiService.analyzeCV({
      // Remove or comment out:   cvText,
      // Remove or comment out:   jobDescription,
      // Remove or comment out:   analysisType: 'detailed', // Will be adjusted based on user tier
      // Remove or comment out:   userId: user.id,
      // Remove or comment out:   cvId
      // Remove or comment out: });

      clearInterval(progressInterval);
      setProgress(100);
      
      setAnalysis(null); // Placeholder for analysis data
      onAnalysisComplete?.(null); // Placeholder for analysis data
      
      toast({
        title: "Analysis Complete!",
        description: `Your CV scored 0/100 (Analysis not available)`,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to analyze CV');
      toast({
        title: "Analysis Failed",
        description: err.message || 'Please try again later',
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  if (!analysis && !isAnalyzing) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI CV Analysis
          </CardTitle>
          <CardDescription className="text-lg">
            Get instant feedback and improve your CV with AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">ATS Optimization</h3>
              <p className="text-sm text-blue-700">Ensure your CV passes applicant tracking systems</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">Improvement Tips</h3>
              <p className="text-sm text-green-700">Get specific suggestions to enhance your CV</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900">Instant Results</h3>
              <p className="text-sm text-purple-700">Powered by advanced AI for quick analysis</p>
            </div>
          </div>
          
          <Button 
            onClick={handleAnalyze} 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg"
            size="lg"
          >
            <Brain className="w-5 h-5 mr-2" />
            Analyze My CV
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card className="w-full">
        <CardContent className="py-12">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Analyzing Your CV...</h3>
              <p className="text-gray-600 mb-4">Our AI is reviewing your CV and generating insights</p>
              <Progress value={progress} className="w-full max-w-md mx-auto" />
              <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {error}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={handleAnalyze} 
            variant="outline" 
            className="w-full mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <div className="p-4 text-center text-gray-500">No analysis available.</div>
    );
  }

  // Show warning if not a CV
  if (
    analysis.weaknesses &&
    analysis.weaknesses.length === 1 &&
    analysis.weaknesses[0].includes('does not appear to be a CV')
  ) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-900 text-center">
        <h3 className="font-bold text-lg mb-2">⚠️ Not a CV Detected</h3>
        <p>{analysis.weaknesses[0]}</p>
        <p className="mt-2 text-sm text-gray-500">Please upload a valid CV or use the form to create one.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Overall Score Card */}
      <Card className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 border-slate-200 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            CV Analysis Results
          </CardTitle>
          <CardDescription className="text-slate-600">
            Powered by {analysis!.provider} • {analysis!.model}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScoreCard
              title="Overall Score"
              score={analysis!.overallScore}
              icon={<FileText className="w-6 h-6" />}
              color="blue"
            />
            <ScoreCard
              title="ATS Compatibility"
              score={analysis!.atsCompatibility}
              icon={<Target className="w-6 h-6" />}
              color="emerald"
            />
            <ScoreCard
              title="Readability"
              score={analysis!.readabilityScore}
              icon={<CheckCircle className="w-6 h-6" />}
              color="purple"
            />
          </div>
        </CardContent>
      </Card>

      {/* Free Tier - Professional Upgrade Promotion */}
      {analysis!.provider === 'local' && (
        <Card className="w-full bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 border-slate-200 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Your CV Has Untapped Potential
              <Sparkles className="w-5 h-5 text-purple-500" />
            </CardTitle>
            <CardDescription className="text-slate-600">
              This basic analysis reveals only surface-level insights. Professional candidates need deeper intelligence to stand out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Pain Point Highlight */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Why 89% of CVs Never Reach Human Eyes</h4>
                  <p className="text-sm text-red-700">
                    Your current CV may be invisible to ATS systems. Without professional optimization, you could be missing out on interviews for roles you're perfectly qualified for.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 flex items-center gap-3 mb-6 text-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Current Limitations Holding You Back:
                </h4>
                <ul className="space-y-4 text-red-700">
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Weak Keyword Strategy:</strong> Missing industry-specific terms that recruiters search for</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Generic Feedback:</strong> Basic suggestions that don't target your specific industry</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>No Salary Intelligence:</strong> Missing out on roles with higher compensation</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Limited Analysis Depth:</strong> Surface-level insights miss critical improvement areas</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 flex items-center gap-3 mb-6 text-lg">
                  <Star className="w-5 h-5 text-green-600" />
                  Professional Advantages You'll Gain:
                </h4>
                <ul className="space-y-4 text-green-700">
                  <li className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Advanced AI Analysis:</strong> OpenAI/Claude-powered insights that identify hidden opportunities</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Industry-Specific Optimization:</strong> Tailored for your exact field and career level</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Job Matching Intelligence:</strong> Direct insights into roles you qualify for</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Interview Preparation:</strong> Unlimited practice with AI feedback included</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Success Stories */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Professional Success Impact
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+32%</div>
                  <div className="text-gray-600">Interview Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">15-25</div>
                  <div className="text-gray-600">Point Score Improvement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">£8k+</div>
                  <div className="text-gray-600">Average Salary Increase</div>
                </div>
              </div>
            </div>

            {/* Urgent Call to Action */}
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="font-semibold text-gray-800">Your Career Can't Wait</h5>
                  <p className="text-sm text-gray-600">Every day without optimization is a missed opportunity</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">+{Math.min(25, 100 - analysis!.overallScore)}</div>
                  <div className="text-sm text-gray-500">points possible</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-600">Current Position</span>
                    <span>{analysis!.overallScore}/100</span>
                  </div>
                  <Progress value={analysis!.overallScore} className="h-2" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-600">Professional Target</span>
                    <span>{Math.min(analysis!.overallScore + 25, 100)}/100</span>
                  </div>
                  <Progress value={Math.min(analysis!.overallScore + 25, 100)} className="h-2" />
                </div>
              </div>
            </div>

            {/* Primary Call to Actions */}
            <div className="space-y-4">
              {/* Most Popular - Starter Plan */}
              <Button 
                onClick={() => {
                  navigate('/#pricing');
                  toast({
                    title: "⭐ Most Popular Choice",
                    description: "Get started with our Starter plan for just £11.99/month!"
                  });
                }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 text-lg"
                size="lg"
              >
                <Star className="w-5 h-5 mr-2" />
                Start with Starter Plan - £11.99/month
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              {/* Pay As You Go Option */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h6 className="font-semibold text-blue-800">Not Ready for Monthly Commitment?</h6>
                    <p className="text-sm text-blue-700">Try our pay-as-you-go option</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">£2.49</div>
                    <div className="text-xs text-blue-500">per analysis</div>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    navigate('/#pricing');
                    toast({
                      title: "💳 Pay Per Analysis",
                      description: "Perfect for testing - pay only when you need analysis!"
                    });
                  }}
                  variant="outline"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                  size="sm"
                >
                  Try Pay-As-You-Go
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  onClick={() => {
                    navigate('/#pricing');
                    toast({
                      title: "🚀 Professional Features",
                      description: "Unlimited analysis + advanced AI for £17.99/month"
                    });
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3"
                  size="lg"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Professional - £17.99/mo
                </Button>
                <Button 
                  onClick={() => {
                    navigate('/#pricing');
                    toast({
                      title: "💎 Career Pro Features",
                      description: "Advanced AI coaching + human review for £35.99/month"
                    });
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Career Pro - £35.99/mo
                </Button>
              </div>
              
              <Button 
                onClick={() => {
                  navigate('/#pricing');
                  toast({
                    title: "🔍 Compare All Plans",
                    description: "Find the perfect plan for your career goals"
                  });
                }}
                variant="outline"
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold py-2"
                size="lg"
              >
                Compare All Plans & Features
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                ⭐ Join 15,000+ professionals who accelerated their careers with our Professional AI • Start your free trial today
              </p>
            </div>

            {/* Navigation Back to CV Management */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
              <div className="text-center space-y-3">
                <h4 className="font-semibold text-purple-800">What's Next?</h4>
                <p className="text-sm text-purple-700">
                  Ready to optimize your CV or create more versions for different roles?
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button 
                    onClick={() => navigate('/cvs')}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Manage My CVs
                  </Button>
                  <Button 
                    onClick={() => navigate('/cv-builder')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Another CV
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="scores" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 border border-slate-200">
          <TabsTrigger value="scores" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">Detailed Scores</TabsTrigger>
          <TabsTrigger value="feedback" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">Feedback</TabsTrigger>
          <TabsTrigger value="keywords" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">Keywords</TabsTrigger>
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="scores" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Category Breakdown</CardTitle>
              <CardDescription className="text-slate-600">Detailed scoring across different CV aspects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analysis!.scores).map(([category, score]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium capitalize text-slate-700">{category}</span>
                      <span className="text-sm text-slate-600">{score}/100</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-emerald-200 bg-emerald-50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-emerald-800 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis!.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-emerald-800">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis!.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-red-800">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-emerald-600 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Present Keywords
                </CardTitle>
                <CardDescription className="text-slate-600">Keywords found in your CV</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis!.presentKeywords.length > 0 ? (
                    analysis!.presentKeywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                      No keywords detected. This usually indicates an issue with the analysis.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Missing Keywords
                </CardTitle>
                <CardDescription className="text-slate-600">Consider adding these relevant keywords</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis!.missingKeywords.length > 0 ? (
                    analysis!.missingKeywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                      No missing keywords detected - all relevant keywords found!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="space-y-4">
            {analysis!.suggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Analysis Metadata */}
      <Card className="bg-slate-50 border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
            <div>
              <span className="font-medium text-slate-700">Analysis Date:</span>
              <br />
              <span className="text-slate-600">{new Date(analysis!.analysisDate).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Processing Time:</span>
              <br />
              <span className="text-slate-600">{analysis!.processingTime}ms</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Tokens Used:</span>
              <br />
              <span className="text-slate-600">{analysis!.tokenUsage.input + analysis!.tokenUsage.output}</span>
            </div>
            <div>
              <span className="font-medium text-slate-700">Cost:</span>
              <br />
              <span className="text-slate-600">${analysis!.tokenUsage.cost.toFixed(4)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ScoreCardProps {
  title: string;
  score: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'emerald';
}

function ScoreCard({ title, score, icon, color }: ScoreCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg',
    green: 'text-emerald-600 bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg',
    purple: 'text-purple-600 bg-gradient-to-br from-purple-100 to-purple-200 shadow-lg',
    emerald: 'text-emerald-600 bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-lg'
  };

  return (
    <div className="text-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{score}</div>
      <div className="text-sm text-slate-600">{title}</div>
      <Progress value={score} className="mt-2 h-2" />
    </div>
  );
}

interface SuggestionCardProps {
  suggestion: CVSuggestion;
}

function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const priorityColors = {
    high: 'border-red-200 bg-red-50 shadow-sm',
    medium: 'border-purple-200 bg-purple-50 shadow-sm',
    low: 'border-blue-200 bg-blue-50 shadow-sm'
  };

  const priorityBadgeColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-purple-100 text-purple-800 border-purple-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const priorityTextColors = {
    high: 'text-red-800',
    medium: 'text-purple-800',
    low: 'text-blue-800'
  };

  return (
    <Card className={`${priorityColors[suggestion.priority]} hover:shadow-md transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg ${priorityTextColors[suggestion.priority]}`}>
            {suggestion.title}
          </CardTitle>
          <Badge className={priorityBadgeColors[suggestion.priority]}>
            {suggestion.priority} priority
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-700 mb-3">{suggestion.description}</p>
        {suggestion.example && (
          <div className="bg-white p-3 rounded-lg border border-slate-200 mb-3">
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-700">Example:</span> {suggestion.example}
            </p>
          </div>
        )}
        <p className="text-sm text-slate-600">
          <span className="font-medium text-slate-700">Impact:</span> {suggestion.impact}
        </p>
      </CardContent>
    </Card>
  );
} 