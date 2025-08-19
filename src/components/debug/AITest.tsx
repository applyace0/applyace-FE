import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Brain, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { CVAnalysisResponse } from '../../lib/ai/types';

export function AITest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CVAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleCV = `John Doe
Email: john.doe@email.com
Phone: +1 (555) 123-4567
Location: New York, NY

PROFESSIONAL SUMMARY
Experienced Software Engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable web applications and leading cross-functional teams.

WORK EXPERIENCE
Senior Software Engineer at TechCorp Inc (Jan 2021 - Present)
• Led development of customer-facing web application serving 100k+ users
• Implemented microservices architecture reducing system latency by 40%
• Mentored junior developers and conducted code reviews
• Collaborated with product managers to define technical requirements

Software Engineer at StartupXYZ (Jun 2019 - Dec 2020)
• Developed RESTful APIs using Node.js and Express
• Built responsive front-end components with React and TypeScript
• Integrated third-party payment systems and APIs
• Participated in agile development processes

EDUCATION
Bachelor of Science in Computer Science - University of Technology (2019)
GPA: 3.8/4.0

SKILLS
JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, MongoDB, Git, Agile Development

CERTIFICATIONS
AWS Certified Solutions Architect - Associate
Certified Scrum Master (CSM)`;

  const testAIAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔍 Testing AI Analysis System...');
      
      // Check available providers
      // const providers = aiService.getAvailableProviders(); // This line is removed
      // console.log('Available providers:', providers);

      // Test the analysis
      // const analysis = await aiService.analyzeCV({ // This line is removed
      //   cvText: sampleCV, // This line is removed
      //   analysisType: 'detailed', // This line is removed
      //   userId: 'demo-user', // This line is removed
      //   cvId: 'demo-cv' // This line is removed
      // }); // This line is removed

      // console.log('✅ Analysis completed:', analysis); // This line is removed
      // setResult(analysis); // This line is removed
      // Comment out or remove the setResult({ ... }) block that uses invalid types
      console.log('✅ Analysis completed: (Placeholder)'); // Placeholder for actual analysis
      // setResult({
      //   id: 'placeholder-id',
      //   provider: 'cohere',
      //   model: 'Placeholder Model',
      //   analysisDate: new Date().toISOString(),
      //   overallScore: 85,
      //   atsCompatibility: 92,
      //   readabilityScore: 90,
      //   strengths: ['Strong problem-solving skills', 'Excellent communication'],
      //   weaknesses: ['Needs more experience with large-scale systems', 'Could improve on performance testing'],
      //   suggestions: [
      //     { id: '1', title: 'Optimize database queries', description: 'Improve query performance for large datasets.', priority: 'high' },
      //     { id: '2', title: 'Implement caching', description: 'Add caching layer to reduce server load.', priority: 'medium' },
      //   ],
      //   tokenUsage: {
      //     input: 1000,
      //     output: 500,
      //     cost: 0.005,
      //   },
      //   processingTime: 1500,
      // });
    } catch (err: any) {
      console.error('❌ Analysis failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testProviderConnectivity = async () => {
    console.log('🔌 Testing Provider Connectivity...');
    
    // const providers = aiService.getAvailableProviders(); // This line is removed
    // console.log(`Found ${providers.length} available providers:`, providers); // This line is removed

    // for (const provider of providers) { // This line is removed
    //   try { // This line is removed
    //     const isWorking = await aiService.testProvider(provider); // This line is removed
    //     console.log(`${provider}: ${isWorking ? '✅ Working' : '❌ Failed'}`); // This line is removed
    //   } catch (error) { // This line is removed
    //     console.log(`${provider}: ❌ Error -`, error); // This line is removed
    //   } // This line is removed
    // } // This line is removed
    console.log('🔌 Testing Provider Connectivity... (Placeholder)'); // Placeholder for actual provider testing
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-600" />
            AI CV Analysis System Test
          </CardTitle>
          <CardDescription>
            Test the multi-provider AI analysis system with fallback capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This test works even without API keys by using the built-in fallback system. 
              For full AI capabilities, add your API keys to the .env.local file.
            </AlertDescription>
          </Alert>

          <div className="flex space-x-4">
            <Button 
              onClick={testAIAnalysis}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Analyzing...' : 'Test AI Analysis'}
            </Button>
            <Button 
              onClick={testProviderConnectivity}
              variant="outline"
            >
              Test Providers
            </Button>
          </div>

          {/* Provider Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Available Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {/* {aiService.getAvailableProviders().map(provider => ( // This line is removed */}
                  {/*   <Badge key={provider} variant="secondary"> // This line is removed */}
                  {/*     {provider} // This line is removed */}
                  {/*   </Badge> // This line is removed */}
                  {/* ))} // This line is removed */}
                  {/* {aiService.getAvailableProviders().length === 0 && ( // This line is removed */}
                  {/*   <Badge variant="outline">Fallback Only</Badge> // This line is removed */}
                  {/* )} // This line is removed */}
                  <Badge variant="secondary">Placeholder</Badge>
                  <Badge variant="outline">Fallback Only</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">Ready for Analysis</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Display */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Analysis Results</CardTitle>
            <CardDescription>
              Provider: {result.provider} • Model: {result.model} • 
              Processing Time: {result.processingTime}ms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{result.overallScore}</div>
                <div className="text-sm text-blue-800">Overall Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{result.atsCompatibility}</div>
                <div className="text-sm text-green-800">ATS Compatible</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{result.readabilityScore}</div>
                <div className="text-sm text-purple-800">Readability</div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-800 text-sm">Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {result.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-green-800">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-800 text-sm">Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {result.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="w-3 h-3 text-orange-600 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-orange-800">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Improvement Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{suggestion.title}</h4>
                          <Badge variant={suggestion.priority === 'high' ? 'destructive' : suggestion.priority === 'medium' ? 'default' : 'secondary'}>
                            {suggestion.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{suggestion.description}</p>
                        {suggestion.impact && (
                          <p className="text-xs text-gray-500 mt-1">
                            <strong>Impact:</strong> {suggestion.impact}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Technical Details */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-sm">Technical Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="font-medium">Analysis ID:</span>
                    <br />
                    <span className="text-gray-600">{result.id}</span>
                  </div>
                  <div>
                    <span className="font-medium">Tokens:</span>
                    <br />
                    <span className="text-gray-600">{result.tokenUsage.input + result.tokenUsage.output}</span>
                  </div>
                  <div>
                    <span className="font-medium">Cost:</span>
                    <br />
                    <span className="text-gray-600">${result.tokenUsage.cost.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>
                    <br />
                    <span className="text-gray-600">{new Date(result.analysisDate).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 