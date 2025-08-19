import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, ExternalLink, CheckCircle, AlertTriangle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const StripeSetup = () => {
  const [testKeys, setTestKeys] = useState({
    publishableKey: '',
    secretKey: ''
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const envFileContent = `# STRIPE TEST KEYS (Safe for testing)
VITE_STRIPE_PUBLISHABLE_KEY=${testKeys.publishableKey || 'pk_test_YOUR_TEST_PUBLISHABLE_KEY_HERE'}
STRIPE_SECRET_KEY=${testKeys.secretKey || 'sk_test_YOUR_TEST_SECRET_KEY_HERE'}

# Disable mock mode to use real Stripe
VITE_MOCK_PAYMENTS=false

# App configuration
VITE_APP_URL=http://localhost:3000`;

  const stripeConfigContent = `export const STRIPE_PRICES = {
  free: null,
  
  payAsYouGo: {
    priceId: 'price_YOUR_PAYG_PRICE_ID', // £1.99 one-time
    amount: 199,
    currency: 'gbp',
    type: 'one_time'
  },
  
  starter: {
    monthly: 'price_YOUR_STARTER_MONTHLY_ID',     // £9.99/month
    sixMonth: 'price_YOUR_STARTER_6MONTH_ID',     // £41.96/6 months
    annual: 'price_YOUR_STARTER_ANNUAL_ID',       // £59.94/year
  },
  
  professional: {
    monthly: 'price_YOUR_PRO_MONTHLY_ID',         // £14.99/month
    sixMonth: 'price_YOUR_PRO_6MONTH_ID',         // £62.96/6 months
    annual: 'price_YOUR_PRO_ANNUAL_ID',           // £89.94/year
  },
  
  careerPro: {
    monthly: 'price_YOUR_CAREER_MONTHLY_ID',      // £29.99/month
    sixMonth: 'price_YOUR_CAREER_6MONTH_ID',      // £125.96/6 months
    annual: 'price_YOUR_CAREER_ANNUAL_ID',        // £179.94/year
  },
  
  eliteExecutive: {
    monthly: 'price_YOUR_ELITE_MONTHLY_ID',       // £59.99/month
    sixMonth: 'price_YOUR_ELITE_6MONTH_ID',       // £251.96/6 months
    annual: 'price_YOUR_ELITE_ANNUAL_ID',         // £359.94/year
  }
};`;

  const productsToCreate = [
    {
      name: 'ApplyAce Starter',
      description: 'Perfect for students & early career professionals',
      prices: [
        { amount: '£9.99', interval: 'month' },
        { amount: '£41.96', interval: '6 months' },
        { amount: '£59.94', interval: 'year' }
      ]
    },
    {
      name: 'ApplyAce Professional',
      description: 'For active job seekers with unlimited analyses',
      prices: [
        { amount: '£14.99', interval: 'month' },
        { amount: '£62.96', interval: '6 months' },
        { amount: '£89.94', interval: 'year' }
      ]
    },
    {
      name: 'ApplyAce Career Pro',
      description: 'Premium features with human review',
      prices: [
        { amount: '£29.99', interval: 'month' },
        { amount: '£125.96', interval: '6 months' },
        { amount: '£179.94', interval: 'year' }
      ]
    },
    {
      name: 'ApplyAce Elite Executive',
      description: 'AI-backed 1-on-1 coaching for executives',
      prices: [
        { amount: '£59.99', interval: 'month' },
        { amount: '£251.96', interval: '6 months' },
        { amount: '£359.94', interval: 'year' }
      ]
    },
    {
      name: 'ApplyAce Pay-as-you-go',
      description: 'Single CV analysis',
      prices: [
        { amount: '£1.99', interval: 'one-time' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <CreditCard className="h-4 w-4" />
            <span>Stripe Setup Assistant</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Connect Stripe Test Payments
          </h1>
          <p className="text-slate-600">
            Set up Stripe test mode for safe payment testing
          </p>
        </div>

        {/* Step 1: Get API Keys */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Get Your Stripe Test API Keys</span>
            </CardTitle>
            <CardDescription>
              First, get your test API keys from Stripe dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Make sure you're in <strong>TEST MODE</strong> in Stripe dashboard (orange banner at top)
                </AlertDescription>
              </Alert>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => window.open('https://dashboard.stripe.com/test/apikeys', '_blank')}
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Stripe API Keys</span>
                </Button>
                <Badge variant="secondary">Test Mode</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="publishable-key">Publishable Key (pk_test_...)</Label>
                  <Input
                    id="publishable-key"
                    placeholder="pk_test_51..."
                    value={testKeys.publishableKey}
                    onChange={(e) => setTestKeys({...testKeys, publishableKey: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="secret-key">Secret Key (sk_test_...)</Label>
                  <Input
                    id="secret-key"
                    placeholder="sk_test_51..."
                    type="password"
                    value={testKeys.secretKey}
                    onChange={(e) => setTestKeys({...testKeys, secretKey: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Create .env.local */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Create .env.local File</span>
            </CardTitle>
            <CardDescription>
              Create this file in your project root directory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{envFileContent}</pre>
              </div>
              <Button
                onClick={() => copyToClipboard(envFileContent, '.env.local content')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>Copy .env.local Content</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Create Products */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>Create Products in Stripe</span>
            </CardTitle>
            <CardDescription>
              Create these products in your Stripe dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => window.open('https://dashboard.stripe.com/test/products', '_blank')}
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Stripe Products</span>
                </Button>
                <Badge variant="secondary">Test Mode</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productsToCreate.map((product, index) => (
                  <Card key={index} className="border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{product.name}</CardTitle>
                      <CardDescription className="text-xs">{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {product.prices.map((price, priceIndex) => (
                          <div key={priceIndex} className="flex justify-between items-center text-sm">
                            <span>{price.amount}</span>
                            <Badge variant="outline" className="text-xs">
                              {price.interval}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Update Config */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>Update Stripe Configuration</span>
            </CardTitle>
            <CardDescription>
              Replace the price IDs in your configuration file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{stripeConfigContent}</pre>
              </div>
              <Button
                onClick={() => copyToClipboard(stripeConfigContent, 'Stripe config')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Configuration</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step 5: Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">5</span>
              <span>Test Your Setup</span>
            </CardTitle>
            <CardDescription>
              Verify everything is working correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Use test card <strong>4242 4242 4242 4242</strong> with any future expiry date and any CVC
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => window.open('/debug/payment', '_blank')}
                  className="flex items-center space-x-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Test Payment Flow</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://dashboard.stripe.com/test/payments', '_blank')}
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Test Payments</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StripeSetup; 