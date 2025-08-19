import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Linkedin, CheckCircle, XCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function LinkedInDebug() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const checkConfiguration = async () => {
    setTesting(true);
    const checks = {
      supabaseConnection: false,
      providerEnabled: false,
      redirectUrl: '',
      currentUrl: window.location.origin,
      expectedCallback: `${window.location.origin}/auth/callback`,
      supabaseCallback: 'https://iqikeltdqmpdsczakril.supabase.co/auth/v1/callback',
      linkedinAppStatus: 'unknown',
      errors: [] as string[]
    };

    try {
      // Test Supabase connection
      const { data: { user } } = await supabase.auth.getUser();
      checks.supabaseConnection = true;

      // Test LinkedIn OAuth provider
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'linkedin_oidc',
          options: {
            redirectTo: checks.expectedCallback,
            skipBrowserRedirect: true
          }
        });

        if (data && data.url) {
          checks.providerEnabled = true;
          checks.redirectUrl = data.url;
          
          // Check if URL contains correct parameters
          const url = new URL(data.url);
          const clientId = url.searchParams.get('client_id');
          const redirectUri = url.searchParams.get('redirect_uri');
          
          if (!clientId) {
            checks.errors.push('No client_id found in OAuth URL - LinkedIn app not configured');
          }
          
          if (redirectUri !== checks.supabaseCallback) {
            checks.errors.push(`Redirect URI mismatch: Expected ${checks.supabaseCallback}, got ${redirectUri}`);
          }
          
        } else if (error) {
          checks.errors.push(`OAuth Error: ${error.message}`);
          if (error.message.includes('linkedin_oidc')) {
            checks.errors.push('Provider "linkedin_oidc" not found - check if LinkedIn (OIDC) is enabled in Supabase');
          }
        }
      } catch (error: any) {
        checks.errors.push(`OAuth Test Failed: ${error.message}`);
      }

    } catch (error: any) {
      checks.errors.push(`Supabase Connection Failed: ${error.message}`);
    }

    setResults(checks);
    setTesting(false);
  };

  const testActualFlow = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        toast.error(`OAuth Error: ${error.message}`);
      } else if (data.url) {
        toast.success('Redirecting to LinkedIn...');
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast.error(`Failed to initiate OAuth: ${error.message}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getStatusBadge = (condition: boolean, trueText: string, falseText: string) => {
    return condition ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        {trueText}
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        {falseText}
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Linkedin className="h-6 w-6 text-blue-600" />
            LinkedIn OAuth Debug Tool
          </CardTitle>
          <CardDescription>
            Comprehensive debugging for LinkedIn OAuth integration
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Test Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={checkConfiguration}
              disabled={testing}
              className="flex items-center gap-2"
            >
              {testing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Checking...
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  Check Configuration
                </>
              )}
            </Button>
            
            <Button
              onClick={testActualFlow}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Linkedin className="h-4 w-4" />
              Test Live OAuth Flow
            </Button>
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configuration Status</h3>
              
              {/* Status Checks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Supabase Connection</span>
                    {getStatusBadge(results.supabaseConnection, 'Connected', 'Failed')}
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">LinkedIn Provider</span>
                    {getStatusBadge(results.providerEnabled, 'Enabled', 'Disabled')}
                  </div>
                </div>
              </div>

              {/* URL Configuration */}
              <div className="space-y-3">
                <h4 className="font-medium">URL Configuration</h4>
                
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Current App URL:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-white px-2 py-1 rounded text-sm border flex-1">
                        {results.currentUrl}
                      </code>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(results.currentUrl)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Expected Callback URL:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-white px-2 py-1 rounded text-sm border flex-1">
                        {results.expectedCallback}
                      </code>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(results.expectedCallback)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Supabase Callback URL:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-white px-2 py-1 rounded text-sm border flex-1">
                        {results.supabaseCallback}
                      </code>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(results.supabaseCallback)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* OAuth URL Analysis */}
              {results.redirectUrl && (
                <div className="space-y-3">
                  <h4 className="font-medium">OAuth URL Analysis</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="text-sm font-medium text-blue-800">Generated OAuth URL:</label>
                    <div className="mt-2">
                      <code className="bg-white px-2 py-1 rounded text-xs border block break-all">
                        {results.redirectUrl}
                      </code>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="mt-2"
                      onClick={() => window.open(results.redirectUrl, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open in New Tab
                    </Button>
                  </div>
                </div>
              )}

              {/* Errors */}
              {results.errors.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-red-600">Issues Found</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <ul className="space-y-2">
                      {results.errors.map((error: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-red-700 text-sm">
                          <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Configuration Steps */}
              <div className="space-y-3">
                <h4 className="font-medium">Required Configuration Steps</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>
                      <strong>LinkedIn App:</strong> Ensure your LinkedIn app is approved and has "Sign In with LinkedIn using OpenID Connect" enabled
                    </li>
                    <li>
                      <strong>Redirect URLs:</strong> Add these URLs to your LinkedIn app:
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                        <li><code>https://iqikeltdqmpdsczakril.supabase.co/auth/v1/callback</code></li>
                        <li><code>http://localhost:8000/auth/callback</code></li>
                      </ul>
                    </li>
                    <li>
                      <strong>Supabase:</strong> Enable "LinkedIn (OIDC)" provider with your Client ID and Secret
                    </li>
                    <li>
                      <strong>Provider Name:</strong> Use "linkedin_oidc" in your code (not "linkedin")
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 