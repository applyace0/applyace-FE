import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Loader2, 
  Brain, 
  MessageSquare, 
  Clock, 
  Target,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTier } from '@/hooks/useTier';
import { supabase } from '@/lib/supabase';

interface InterviewSession {
  id: string;
  jobId?: string;
  status: 'preparing' | 'active' | 'paused' | 'completed';
  startTime: Date;
  duration: number;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  voiceEnabled: boolean;
  aiCoaching: boolean;
}

interface InterviewQuestion {
  id: string;
  question: string;
  category: 'behavioral' | 'technical' | 'situational' | 'strengths';
  userAnswer?: string;
  aiFeedback?: string;
  score?: number;
  tips?: string[];
}

interface CoachingTip {
  id: string;
  tip: string;
  category: 'delivery' | 'content' | 'structure' | 'confidence';
  priority: 'high' | 'medium' | 'low';
}

export default function InterviewCoachPage() {
  const { user } = useAuth();
  const { tierInfo, canPerformAction } = useTier();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [coachingTips, setCoachingTips] = useState<CoachingTip[]>([]);
  const [sessionSummary, setSessionSummary] = useState<any>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Check tier permissions
  const canStartSession = canPerformAction('interview_practice');
  const sessionLimit = tierInfo?.limits?.interview_sessions_per_month || 0;
  const sessionsUsed = tierInfo?.usage?.interview_sessions || 0;

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // Speech recognition setup
    }
  }, []);

  const startInterviewSession = async () => {
    if (!canStartSession) {
      setError('Upgrade your tier to access interview practice sessions');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get the session token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobDescription,
          tier: tierInfo?.currentTier
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start interview session');
      }

      const sessionData = await response.json();
      setSession(sessionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
    } finally {
      setIsLoading(false);
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    if (!session) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get the session token
      const { data: { session: authSession } } = await supabase.auth.getSession();
      const token = authSession?.access_token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('sessionId', session.id);
      formData.append('questionIndex', session.currentQuestionIndex.toString());

      const response = await fetch('/api/interview/voice', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to process voice input');
      }

      const result = await response.json();
      setTranscript(result.transcript);
      
      // Update session with AI feedback
      if (result.feedback) {
        setSession(prev => prev ? {
          ...prev,
          questions: prev.questions.map((q, idx) => 
            idx === prev.currentQuestionIndex 
              ? { ...q, aiFeedback: result.feedback, score: result.score }
              : q
          )
        } : null);
      }

      // Update coaching tips
      if (result.coachingTips) {
        setCoachingTips(result.coachingTips);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process voice input');
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processVoiceInput(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const nextQuestion = () => {
    if (!session) return;

    setSession(prev => prev ? {
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1)
    } : null);
  };

  const previousQuestion = () => {
    if (!session) return;

    setSession(prev => prev ? {
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0)
    } : null);
  };

  const completeSession = async () => {
    if (!session) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get the session token
      const { data: { session: authSession } } = await supabase.auth.getSession();
      const token = authSession?.access_token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/interview/summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId: session.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate session summary');
      }

      const summary = await response.json();
      setSessionSummary(summary);
      setSession(prev => prev ? { ...prev, status: 'completed' } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete session');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSession = async () => {
    if (!session) return;

    try {
      // Get the session token
      const { data: { session: authSession } } = await supabase.auth.getSession();
      const token = authSession?.access_token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/interview/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId: session.id,
          jobId: session.jobId,
          summary: sessionSummary
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save session');
      }

      // Show success message
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save session');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">
              Please sign in to access the interview coach.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Interview Coach</h1>
          <p className="text-muted-foreground text-lg">
            Practice interviews with AI-powered coaching and real-time feedback
          </p>
        </div>

        {/* Tier Status */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant={tierInfo?.currentTier === 'pro' ? 'default' : 'secondary'}>
                  {tierInfo?.currentTier?.toUpperCase()} TIER
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {sessionsUsed} / {sessionLimit} sessions used this month
                </span>
              </div>
              <Progress 
                value={(sessionsUsed / sessionLimit) * 100} 
                className="w-32"
              />
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {!session ? (
          /* Session Setup */
          <Card>
            <CardHeader>
              <CardTitle>Start Interview Session</CardTitle>
              <CardDescription>
                Enter a job description or paste a job posting URL to get personalized interview questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  placeholder="Paste job description or requirements here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center space-x-4">
                <Button 
                  onClick={startInterviewSession}
                  disabled={!jobDescription.trim() || isLoading || !canStartSession}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Preparing Session...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start Interview
                    </>
                  )}
                </Button>
              </div>

              {!canStartSession && (
                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    Upgrade to Pro tier to access unlimited interview practice sessions with AI coaching.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Active Session */
          <div className="space-y-6">
            {/* Session Header */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                      {session.status.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Question {session.currentQuestionIndex + 1} of {session.questions.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Interview Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Current Question */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>Current Question</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {session.questions[session.currentQuestionIndex] && (
                      <>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-lg font-medium">
                            {session.questions[session.currentQuestionIndex].question}
                          </p>
                          <Badge variant="outline" className="mt-2">
                            {session.questions[session.currentQuestionIndex].category}
                          </Badge>
                        </div>

                        {/* Voice Recording Controls */}
                        <div className="flex items-center justify-center space-x-4">
                          <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            variant={isRecording ? "destructive" : "default"}
                            size="lg"
                            disabled={isLoading}
                          >
                            {isRecording ? (
                              <>
                                <MicOff className="mr-2 h-5 w-5" />
                                Stop Recording
                              </>
                            ) : (
                              <>
                                <Mic className="mr-2 h-5 w-5" />
                                Start Recording
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Transcript */}
                        {transcript && (
                          <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-medium mb-2">Your Response:</h4>
                            <p className="text-sm">{transcript}</p>
                          </div>
                        )}

                        {/* AI Feedback */}
                        {session.questions[session.currentQuestionIndex].aiFeedback && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium mb-2 text-blue-900">AI Feedback:</h4>
                            <p className="text-sm text-blue-800">
                              {session.questions[session.currentQuestionIndex].aiFeedback}
                            </p>
                            {session.questions[session.currentQuestionIndex].score && (
                              <div className="mt-2">
                                <span className="text-sm font-medium text-blue-900">Score: </span>
                                <span className="text-sm text-blue-800">
                                  {session.questions[session.currentQuestionIndex].score}/10
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                      <Button
                        onClick={previousQuestion}
                        disabled={session.currentQuestionIndex === 0}
                        variant="outline"
                      >
                        Previous
                      </Button>
                      
                      {session.currentQuestionIndex === session.questions.length - 1 ? (
                        <Button
                          onClick={completeSession}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating Summary...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Complete Session
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={nextQuestion}
                          disabled={session.currentQuestionIndex === session.questions.length - 1}
                        >
                          Next Question
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Coaching Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5" />
                      <span>Coaching Tips</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {coachingTips.length > 0 ? (
                      <div className="space-y-3">
                        {coachingTips.map((tip) => (
                          <div
                            key={tip.id}
                            className={`p-3 rounded-lg border ${
                              tip.priority === 'high' 
                                ? 'bg-red-50 border-red-200' 
                                : tip.priority === 'medium'
                                ? 'bg-yellow-50 border-yellow-200'
                                : 'bg-green-50 border-green-200'
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              <Badge 
                                variant={tip.priority === 'high' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {tip.priority}
                              </Badge>
                              <p className="text-sm">{tip.tip}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Start answering questions to receive personalized coaching tips.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Session Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Questions Completed</span>
                          <span>{session.currentQuestionIndex + 1}/{session.questions.length}</span>
                        </div>
                        <Progress value={((session.currentQuestionIndex + 1) / session.questions.length) * 100} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <div className="font-medium">
                            {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status:</span>
                          <div className="font-medium capitalize">{session.status}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Session Summary Modal */}
        {sessionSummary && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Session Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Overall Score</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {sessionSummary.overallScore}/10
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Questions Answered</h4>
                  <p className="text-2xl font-bold">{sessionSummary.questionsAnswered}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Session Duration</h4>
                  <p className="text-2xl font-bold">{Math.floor(sessionSummary.duration / 60)}m</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Key Strengths</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {sessionSummary.strengths?.map((strength: string, index: number) => (
                    <li key={index} className="text-green-700">{strength}</li>
                  ))}
                </ul>

                <h4 className="font-medium">Areas for Improvement</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {sessionSummary.improvements?.map((improvement: string, index: number) => (
                    <li key={index} className="text-orange-700">{improvement}</li>
                  ))}
                </ul>

                <h4 className="font-medium">Recommendations</h4>
                <p className="text-sm text-muted-foreground">{sessionSummary.recommendations}</p>
              </div>

              <div className="flex space-x-4">
                <Button onClick={saveSession} className="flex-1">
                  Save Session
                </Button>
                <Button 
                  onClick={() => {
                    setSession(null);
                    setSessionSummary(null);
                    setTranscript('');
                    setCoachingTips([]);
                  }} 
                  variant="outline"
                >
                  Start New Session
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}