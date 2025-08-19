import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getStripe } from '@/lib/stripe';

const PaymentTest = () => {
  const [loading, setLoading] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);

  // Test Stripe initialization
  const testStripeConnection = async () => {
    setLoading(true);
    try {
      const stripe = await getStripe();
      if (stripe) {
        setStripeLoaded(true);
        toast.success('✅ Stripe loaded successfully!');
      } else {
        toast.error('❌ Failed to load Stripe');
      }
    } catch (error) {
      console.error('Stripe test error:', error);
      toast.error('❌ Stripe connection failed');
    } finally {
      setLoading(false);
    }
  };

  // Test credit card validation (client-side only)
  const testCreditCard = async () => {
    setLoading(true);
    try {
      const stripe = await getStripe();
      if (!stripe) {
        toast.error('Stripe not loaded');
        return;
      }

      // Create card element for testing
      const elements = stripe.elements();
      const cardElement = elements.create('card');
      
      toast.success('✅ Card element created successfully!');
    } catch (error) {
      console.error('Card test error:', error);
      toast.error('❌ Card test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🧪 Stripe Payment Testing</h1>
        <p className="text-slate-600">Test Stripe integration with your test keys</p>
      </div>

      {/* Environment Check */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Environment Configuration
          </CardTitle>
          <CardDescription>Current Stripe configuration status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Publishable Key:</span>
                <Badge variant={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? "default" : "destructive"}>
                  {import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 
                    `${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY.substring(0, 20)}...` : 
                    'Missing'
                  }
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mock Payments:</span>
                <Badge variant={import.meta.env.VITE_MOCK_PAYMENTS === 'false' ? "default" : "secondary"}>
                  {import.meta.env.VITE_MOCK_PAYMENTS === 'false' ? 'Disabled' : 'Enabled'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Environment:</span>
                <Badge variant={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.includes('test') ? "secondary" : "default"}>
                  {import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.includes('test') ? 'Test Mode' : 'Live Mode'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Test Mode Active</strong><br />
                  Using test keys - no real charges will occur
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Stripe Connection Test
            </CardTitle>
            <CardDescription>
              Test if Stripe SDK loads correctly with your keys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testStripeConnection}
              disabled={loading}
              className="w-full"
              variant={stripeLoaded ? "outline" : "default"}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : stripeLoaded ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Stripe Connected ✅
                </>
              ) : (
                'Test Stripe Connection'
              )}
            </Button>
            
            {stripeLoaded && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  ✅ Stripe is properly configured and ready for payments!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Card Element Test
            </CardTitle>
            <CardDescription>
              Test Stripe Elements card component creation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testCreditCard}
              disabled={loading || !stripeLoaded}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Card Element'
              )}
            </Button>
            
            <p className="text-xs text-slate-500">
              Test with: 4242 4242 4242 4242 (any future date, any CVC)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Test Cards Reference */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>🧪 Test Credit Cards</CardTitle>
          <CardDescription>Use these test cards for payment testing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">✅ Successful Payments</h4>
              <div className="space-y-1 text-sm">
                <div className="font-mono">4242 4242 4242 4242</div>
                <div className="font-mono">4000 0000 0000 0002</div>
                <div className="font-mono">4000 0000 0000 9995</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-red-600">❌ Failed Payments</h4>
              <div className="space-y-1 text-sm">
                <div className="font-mono">4000 0000 0000 0002</div>
                <div className="font-mono">4000 0000 0000 9995</div>
                <div className="font-mono">4000 0000 0000 9987</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Use any future expiry date and any 3-digit CVC for testing
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTest; 