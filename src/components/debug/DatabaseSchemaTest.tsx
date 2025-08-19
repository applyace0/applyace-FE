import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export const DatabaseSchemaTest = () => {
  const [schemaInfo, setSchemaInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const checkSchema = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test 1: Check if we can query the cvs table
      const { data: cvData, error: cvError } = await supabase
        .from('cvs')
        .select('*')
        .limit(1);
      
      if (cvError) {
        throw new Error(`CV table error: ${cvError.message}`);
      }

      // Test 2: Try to get table schema info
      const { data: schemaData, error: schemaError } = await supabase
        .rpc('get_table_schema', { table_name: 'cvs' })
        .single();

      // Test 3: Try a simple insert to see what fields are required
      const testData = {
        user_id: user?.id || 'test-user',
        content: 'Test CV content',
        file_name: 'test-cv.txt',
        full_name: 'Test User',
        created_at: new Date().toISOString(),
      };

      const { data: insertData, error: insertError } = await supabase
        .from('cvs')
        .insert([testData])
        .select()
        .single();

      setSchemaInfo({
        cvData: cvData || [],
        schemaData: schemaData || 'No schema function available',
        insertData: insertData || null,
        insertError: insertError?.message || null,
        testData
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testSimpleInsert = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test with minimal fields
      const simpleData = {
        user_id: user?.id,
        content: 'Simple test CV',
        file_name: 'simple-test.txt'
      };

      const { data, error } = await supabase
        .from('cvs')
        .insert([simpleData])
        .select()
        .single();

      if (error) {
        setError(`Simple insert failed: ${error.message}`);
      } else {
        setSchemaInfo((prev: any) => ({
          ...prev,
          simpleInsert: { data, error: null }
        }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Database Schema Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={checkSchema} disabled={loading}>
            {loading ? 'Checking...' : 'Check Schema'}
          </Button>
          <Button onClick={testSimpleInsert} disabled={loading} variant="outline">
            Test Simple Insert
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-800">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {schemaInfo && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800">Schema Information:</h3>
              <pre className="text-sm text-blue-700 mt-2 overflow-auto">
                {JSON.stringify(schemaInfo, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 