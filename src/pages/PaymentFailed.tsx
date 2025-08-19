import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errorReason, setErrorReason] = useState<string | null>(null);

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    const errorParam = searchParams.get('error');
    
    setSessionId(sessionIdParam);
    setErrorReason(errorParam);
  }, [searchParams]);

  const handleRetryPayment = () => {
    // Redirect back to pricing page to retry
    navigate('/pricing');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const getErrorMessage = () => {
    switch (errorReason) {
      case 'card_declined':
        return 'Your card was declined. Please try a different payment method or contact your bank.';
      case 'insufficient_funds':
        return 'Insufficient funds. Please check your account balance or try a different card.';
      case 'expired_card':
        return 'Your card has expired. Please use a different payment method.';
      case 'processing_error':
        return 'There was a processing error. Please try again in a few minutes.';
      default:
        return 'Your payment could not be processed. This can happen for various reasons including card issues, network problems, or temporary service interruptions.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white shadow-2xl border-0 rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-6 pt-12 bg-gradient-to-br from-red-50 to-orange-50">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            
            <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
              Payment Failed
            </CardTitle>
            
            <CardDescription className="text-slate-600 text-base">
              Don't worry - no charges were made to your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Error Details */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <XCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">
                      What happened?
                    </h3>
                    <p className="text-amber-700 text-sm">
                      {getErrorMessage()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Common Solutions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Common Solutions:
                </h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Check your card details and try again</li>
                  <li>• Ensure you have sufficient funds</li>
                  <li>• Try a different payment method</li>
                  <li>• Contact your bank if the issue persists</li>
                </ul>
              </div>

              {/* Session Info (for debugging) */}
              {sessionId && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-xs text-slate-500 font-mono">
                    Session: {sessionId.substring(0, 20)}...
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleRetryPayment}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>

                <Button
                  onClick={handleBackToDashboard}
                  variant="outline"
                  className="w-full py-3 rounded-xl font-medium border-slate-200 hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>

              {/* Support Link */}
              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Still having issues? {' '}
                  <a 
                    href="mailto:support@applyace.ai" 
                    className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                  >
                    <Mail className="w-3 h-3 mr-1" />
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

export default PaymentFailed; 