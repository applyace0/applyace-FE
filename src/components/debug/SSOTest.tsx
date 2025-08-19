import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome, Linkedin, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SSOTest() {
  const { signInWithProvider, user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState<'google' | 'linkedin_oidc' | null>(null);
  const [testResults, setTestResults] = useState<{
    google: 'pending' | 'success' | 'error' | null;
    linkedin: 'pending' | 'success' | 'error' | null;
  }>({ google: null, linkedin: null });

  const testSSO = async (provider: 'google' | 'linkedin_oidc') => {
    try {
      setLoading(provider);
      setTestResults(prev => ({ ...prev, [provider]: 'pending' }));
      
      console.log(`🔗 Testing ${provider} OAuth...`);
      
      const { url, provider: returnedProvider } = await signInWithProvider(provider);
      
      if (url) {
        console.log(`✅ ${provider} OAuth URL generated:`, url);
        setTestResults(prev => ({ ...prev, [provider]: 'success' }));
        toast.success(`${provider} OAuth URL generated successfully!`);
        
        // Don't redirect automatically - let user see the URL
        console.log('OAuth URL:', url);
        return url;
      } else {
        throw new Error('No redirect URL returned from OAuth provider');
      }
    } catch (error: any) {
      console.error(`${provider} OAuth error:`, error);
      setTestResults(prev => ({ ...prev, [provider]: 'error' }));
      toast.error(`${provider} OAuth failed: ${error.message}`);
      throw error;
    } finally {
      setLoading(null);
    }
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error' | null) => {
    if (status === 'pending') return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
    if (status === 'success') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status === 'error') return <XCircle className="h-4 w-4 text-red-600" />;
    return null;
  };

  const getStatusText = (status: 'pending' | 'success' | 'error' | null) => {
    if (status === 'pending') return 'Testing...';
    if (status === 'success') return 'Success';
    if (status === 'error') return 'Failed';
    return 'Not tested';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">
              SSO (Single Sign-On) Test
            </CardTitle>
            <CardDescription>
              Test LinkedIn and Google OAuth integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Current User Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Current Authentication Status</h3>
                <div className="space-y-2">
                  <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
                  {user && (
                    <>
                      <p><strong>User ID:</strong> {user.id}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Provider:</strong> {user.app_metadata?.provider || 'email'}</p>
                    </>
                  )}
                </div>
              </div>

              {/* SSO Test Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Google SSO Test */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Chrome className="h-5 w-5 text-blue-600" />
                      Google OAuth Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span>Status:</span>
                      {getStatusIcon(testResults.google)}
                      <span className={`
                        ${testResults.google === 'success' ? 'text-green-600' : ''}
                        ${testResults.google === 'error' ? 'text-red-600' : ''}
                        ${testResults.google === 'pending' ? 'text-blue-600' : ''}
                      `}>
                        {getStatusText(testResults.google)}
                      </span>
                    </div>
                    <Button
                      onClick={() => testSSO('google')}
                      disabled={loading === 'google'}
                      className="w-full"
                    >
                      {loading === 'google' ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Chrome className="h-4 w-4 mr-2" />
                      )}
                      Test Google OAuth
                    </Button>
                  </CardContent>
                </Card>

                {/* LinkedIn SSO Test */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Linkedin className="h-5 w-5 text-blue-600" />
                      LinkedIn OAuth Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span>Status:</span>
                      {getStatusIcon(testResults.linkedin)}
                      <span className={`
                        ${testResults.linkedin === 'success' ? 'text-green-600' : ''}
                        ${testResults.linkedin === 'error' ? 'text-red-600' : ''}
                        ${testResults.linkedin === 'pending' ? 'text-blue-600' : ''}
                      `}>
                        {getStatusText(testResults.linkedin)}
                      </span>
                    </div>
                    <Button
                      onClick={() => testSSO('linkedin_oidc')}
                      disabled={loading === 'linkedin_oidc'}
                      className="w-full"
                    >
                      {loading === 'linkedin_oidc' ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Linkedin className="h-4 w-4 mr-2" />
                      )}
                      Test LinkedIn OAuth
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>How to Test SSO</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p><strong>1.</strong> Click "Test Google OAuth" or "Test LinkedIn OAuth"</p>
                    <p><strong>2.</strong> Check the browser console for the OAuth URL</p>
                    <p><strong>3.</strong> If successful, you'll see a URL that starts with the OAuth provider</p>
                    <p><strong>4.</strong> If failed, check the error message for configuration issues</p>
                    <p><strong>Note:</strong> This test only generates the OAuth URL. To complete the flow, you need to configure the OAuth providers in your Supabase dashboard.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Configuration Check */}
              <Card>
                <CardHeader>
                  <CardTitle>Configuration Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Supabase project configured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>OAuth providers enabled in Supabase</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Redirect URL: http://localhost:3000/auth/callback</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Client IDs and secrets configured</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 