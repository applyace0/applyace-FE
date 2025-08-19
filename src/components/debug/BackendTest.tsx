import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { Database, FileText, Upload, Linkedin, TestTube } from 'lucide-react';
import LinkedInTest from './LinkedInTest';

export default function BackendTest() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFunction();
      setResults(prev => ({ ...prev, [testName]: { success: true, data: result } }));
    } catch (error: any) {
      setResults(prev => ({ ...prev, [testName]: { success: false, error: error.message } }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const testBasicConnection = () => runTest('database', async () => {
    // Simple connection test without importing testConnection
    const { data, error } = await supabase
      .from('cvs')
      .select('count', { count: 'exact', head: true });
    
    if (error) throw error;
    return { message: 'Database connection successful', count: data };
  });
  
  const testAuth = () => runTest('auth', async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return { user: user?.email || 'No user logged in', authenticated: !!user };
  });

  const renderTestResult = (testName: string) => {
    const result = results[testName];
    const isLoading = loading[testName];

    if (isLoading) {
      return <div className="text-yellow-600">Testing...</div>;
    }

    if (!result) {
      return <div className="text-gray-400">Not tested</div>;
    }

    if (result.success) {
      return (
        <div className="text-green-600">
          ✅ Success
          <details className="mt-2 text-sm">
            <summary className="cursor-pointer">View Details</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </details>
        </div>
      );
    } else {
      return (
        <div className="text-red-600">
          ❌ Error: {result.error}
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <TestTube className="h-8 w-8 text-blue-600" />
          Backend & Authentication Testing
        </h1>
        <p className="text-gray-600">Test basic backend services and authentication</p>
      </div>

      <Tabs defaultValue="backend" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="backend">Backend Services</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
        </TabsList>

        <TabsContent value="backend" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {/* Database Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Connection
                </CardTitle>
                <CardDescription>Test Supabase database connectivity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={testBasicConnection}
                  disabled={loading.database}
                  className="w-full"
                >
                  Test Database
                </Button>
                {renderTestResult('database')}
              </CardContent>
            </Card>

            {/* Auth Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Authentication
                </CardTitle>
                <CardDescription>Test authentication status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={testAuth}
                  disabled={loading.auth}
                  className="w-full"
                >
                  Test Auth
                </Button>
                {renderTestResult('auth')}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="auth" className="space-y-6">
          <LinkedInTest />
        </TabsContent>
      </Tabs>
    </div>
  );
} 