import React from 'react';
import { testConnection } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function SimpleTest() {
  const handleTest = async () => {
    try {
      console.log('Testing connection...');
      const result = await testConnection();
      console.log('Connection test result:', result);
      alert('✅ Success! Module imports are working. Check console for details.');
    } catch (error) {
      console.error('Test failed:', error);
      alert('❌ Test failed: ' + (error as Error).message);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Simple Import Test</h1>
      <p className="text-gray-600 mb-4">
        This tests if our module import fixes are working properly.
      </p>
      <Button onClick={handleTest} className="w-full">
        Test Module Imports
      </Button>
    </div>
  );
} 