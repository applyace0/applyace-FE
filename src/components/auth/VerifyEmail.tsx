import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function VerifyEmail() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { verifyEmail } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('No verification token found');
        setLoading(false);
        return;
      }

      try {
        await verifyEmail(token);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {loading
              ? 'Verifying your email...'
              : error
              ? 'Verification failed'
              : 'Email verified successfully!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
          {!loading && !error && (
            <div className="text-center">
              <p className="text-green-600 mb-4">Your email has been verified successfully!</p>
              <Button
                onClick={() => window.location.href = '/'}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Go to Homepage
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 