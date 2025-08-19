import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export const AuthTest = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const testAuth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test 1: Check current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error(`User auth error: ${userError.message}`);
      }

      // Test 2: Try to insert a test CV
      const testCVData = {
        user_id: currentUser?.id,
        title: 'Test CV - ' + new Date().toISOString(),
        content: { test: true },
        is_public: false,
        template_id: 'test'
      };

      console.log('Test CV data:', testCVData);

      const { data: cvData, error: cvError } = await supabase
        .from('cvs')
        .insert([testCVData])
        .select()
        .single();

      if (cvError) {
        throw new Error(`CV insert error: ${cvError.message} (Code: ${cvError.code})`);
      }

      // Test 3: Try to read the CV back
      const { data: readData, error: readError } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', cvData.id)
        .single();

      if (readError) {
        throw new Error(`CV read error: ${readError.message}`);
      }

      // Test 4: Clean up - delete the test CV
      const { error: deleteError } = await supabase
        .from('cvs')
        .delete()
        .eq('id', cvData.id);

      setTestResult({
        user: currentUser,
        cvInsert: cvData,
        cvRead: readData,
        deleteSuccess: !deleteError,
        deleteError: deleteError?.message
      });

    } catch (err: any) {
      setError(err.message);
      console.error('Auth test error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Authentication & Database Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p><strong>Current User:</strong> {user?.email || 'Not authenticated'}</p>
          <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
          <p><strong>Authenticated:</strong> {user ? 'Yes' : 'No'}</p>
        </div>

        <Button 
          onClick={testAuth} 
          disabled={loading || !user}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Auth & Database Access'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 font-medium">Error:</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {testResult && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 font-medium">Test Results:</p>
            <pre className="text-green-700 text-xs mt-2 overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 