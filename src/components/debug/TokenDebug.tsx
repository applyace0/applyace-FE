import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TokenDebug() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setToken(session.access_token);
      } else {
        setToken(null);
      }
    } catch (error) {
      console.error('Error getting session:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      alert('Token copied to clipboard!');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>JWT Token Debug</CardTitle>
      </CardHeader>
      <CardContent>
        {token ? (
          <div className="space-y-4">
            <p className="text-sm text-green-600">✅ Active session found</p>
            <div className="bg-gray-100 p-3 rounded text-xs font-mono break-all">
              {token}
            </div>
            <Button onClick={copyToken} className="w-full">
              Copy Token to Clipboard
            </Button>
            <p className="text-xs text-gray-600">
              Copy this token and paste it in your backend/.env file as: TOKEN=your_token_here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-red-600">❌ No active session</p>
            <p className="text-sm">Please log in first to get a JWT token.</p>
            <Button onClick={getToken} variant="outline">
              Refresh Session
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 