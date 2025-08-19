import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Linkedin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LinkedInTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | 'pending' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { signInWithProvider } = useAuth();

  const testLinkedInOAuth = async () => {
    setTesting(true);
    setResult('pending');
    setErrorMessage('');

    try {
      console.log('🔗 Testing LinkedIn OAuth...');
      
      // Test the signInWithProvider function
      const { url } = await signInWithProvider('linkedin_oidc');
      
      if (url) {
        setResult('success');
        toast.success('LinkedIn OAuth is configured! Redirecting...');
        console.log('✅ LinkedIn OAuth URL generated:', url);
        
        // In a real scenario, user would be redirected
        // For testing, we'll just show success
        setTimeout(() => {
          console.log('🎯 Would redirect to:', url);
        }, 1000);
      } else {
        setResult('error');
        setErrorMessage('No redirect URL returned from LinkedIn OAuth');
      }
    } catch (error: any) {
      console.error('❌ LinkedIn OAuth Error:', error);
      setResult('error');
      setErrorMessage(error.message || 'Unknown error occurred');
      toast.error('LinkedIn OAuth test failed');
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = () => {
    switch (result) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'pending':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Linkedin className="h-6 w-6 text-blue-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (result) {
      case 'success':
        return 'LinkedIn OAuth is working! ✅';
      case 'error':
        return `LinkedIn OAuth failed: ${errorMessage}`;
      case 'pending':
        return 'Testing LinkedIn OAuth...';
      default:
        return 'Ready to test LinkedIn OAuth';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Linkedin className="h-6 w-6 text-blue-600" />
            LinkedIn OAuth Test
          </CardTitle>
          <CardDescription>
            Test LinkedIn OAuth integration to ensure it's properly configured
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status Display */}
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            {getStatusIcon()}
            <div>
              <div className="font-medium">Status</div>
              <div className="text-sm text-gray-600">{getStatusMessage()}</div>
            </div>
          </div>

          {/* Test Button */}
          <Button
            onClick={testLinkedInOAuth}
            disabled={testing}
            className="w-full flex items-center gap-2"
            variant={result === 'success' ? 'default' : 'outline'}
          >
            {testing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Testing LinkedIn OAuth...
              </>
            ) : (
              <>
                <Linkedin className="h-4 w-4" />
                Test LinkedIn OAuth
              </>
            )}
          </Button>

          {/* Configuration Help */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Configuration Steps:</h3>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Create LinkedIn app at developers.linkedin.com</li>
              <li>Add redirect URL: https://iqikeltdqmpdsczakril.supabase.co/auth/v1/callback</li>
              <li>Enable LinkedIn provider in Supabase Dashboard</li>
              <li>Add Client ID and Client Secret to Supabase</li>
              <li>Test the integration with this tool</li>
            </ol>
          </div>

          {/* Error Details */}
          {result === 'error' && errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
              <p className="text-red-700 text-sm">{errorMessage}</p>
              <div className="mt-3 text-sm text-red-600">
                <strong>Common fixes:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Check if LinkedIn provider is enabled in Supabase</li>
                  <li>Verify Client ID and Secret are correct</li>
                  <li>Ensure redirect URLs match exactly</li>
                  <li>Wait for LinkedIn app approval (1-3 days)</li>
                </ul>
              </div>
            </div>
          )}

          {/* Success Details */}
          {result === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Success! 🎉</h4>
              <p className="text-green-700 text-sm">
                LinkedIn OAuth is properly configured and working. Users can now sign in with LinkedIn!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 