import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<string | null>(null);

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    const paymentParam = searchParams.get('payment');
    
    setSessionId(sessionIdParam);
    setPaymentType(paymentParam);

    // Optional: Verify the session with your backend
    if (sessionIdParam) {
      verifyPayment(sessionIdParam);
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      // Optional: Call your backend to verify the payment
      const response = await fetch(`/api/stripe/verify-session/${sessionId}`);
      if (response.ok) {
        console.log('Payment verified successfully');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
    }
  };

  const handleContinue = () => {
    if (paymentType === 'one_time') {
      // Redirect to CV analysis page for pay-as-you-go
      navigate('/dashboard');
    } else {
      // Redirect to dashboard for subscription users
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white shadow-2xl border-0 rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-6 pt-12 bg-gradient-to-br from-green-50 to-emerald-50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            
            <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
              Payment Successful! 🎉
            </CardTitle>
            
            <CardDescription className="text-slate-600 text-base">
              {paymentType === 'one_time' 
                ? 'Your CV analysis credit has been added to your account'
                : 'Welcome to ApplyAce! Your subscription is now active'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Success Details */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">
                      What's Next?
                    </h3>
                    <p className="text-green-700 text-sm">
                      {paymentType === 'one_time' 
                        ? 'Start analyzing your CV with our AI-powered insights and get personalized recommendations.'
                        : 'Access all your premium features including unlimited analyses, advanced AI models, and priority support.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Session Info (for debugging) */}
              {sessionId && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-xs text-slate-500 font-mono">
                    Session: {sessionId.substring(0, 20)}...
                  </p>
                </div>
              )}

              {/* Continue Button */}
              <Button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Continue to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {/* Support Link */}
              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Need help? {' '}
                  <a 
                    href="mailto:support@applyace.ai" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess; 