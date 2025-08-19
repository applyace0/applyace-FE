import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Home } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check for error parameters in URL
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (errorParam) {
          throw new Error(errorDescription || 'Authentication failed');
        }

        // Check if we have an OAuth code to exchange
        const code = searchParams.get('code');
        
        if (code) {
          // Exchange the code for a session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            throw exchangeError;
          }
          
          if (data.session) {
            setSuccess(true);
            toast.success('Successfully signed in!');
            
            // Wait a moment for the success state to show
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 1500);
            return;
          }
        }

        // Handle existing session
        const { data, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          throw authError;
        }

        if (data.session) {
          setSuccess(true);
          toast.success('Successfully signed in!');
          
          // Wait a moment for the success state to show
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1500);
        } else {
          // Check if this is a sign-up confirmation with direct tokens
          const accessToken = searchParams.get('access_token');
          const refreshToken = searchParams.get('refresh_token');
          const tokenType = searchParams.get('token_type');
          
          if (accessToken && refreshToken) {
            // Set the session manually for sign-up confirmation
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (sessionError) {
              throw sessionError;
            }
            
            setSuccess(true);
            toast.success('Email verified successfully!');
            
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 1500);
          } else {
            throw new Error('No valid session or authorization code found');
          }
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setError(error.message || 'Authentication failed');
        toast.error('Authentication failed: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    // Only run the callback handling if we're not already successful
    if (!success) {
      handleAuthCallback();
    }
  }, [navigate, searchParams, success]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Trigger re-auth by navigating to auth page
    navigate('/auth', { replace: true });
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              Authenticating...
            </CardTitle>
            <CardDescription>
              Please wait while we complete your sign-in
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-slate-600">
                This usually takes a few seconds...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Success!
            </CardTitle>
            <CardDescription>
              You have been successfully authenticated
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-sm text-slate-600">
                Redirecting to your dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-red-600">
              <XCircle className="h-6 w-6" />
              Authentication Failed
            </CardTitle>
            <CardDescription>
              We encountered an issue signing you in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={handleRetry} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGoHome} 
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-slate-500">
                If the problem persists, please contact support
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback - should not reach here
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>Please try again</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGoHome} className="w-full">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 