import { toast } from 'sonner';

// Mock mode flag - set this to true for testing without real Stripe
export const MOCK_MODE = import.meta.env.VITE_MOCK_PAYMENTS === 'true';

// Mock successful payment with delay
export const mockCreateCheckoutSession = async (
  priceId: string,
  userId: string,
  tier: string,
  billingPeriod: string
) => {
  console.log('🧪 MOCK CHECKOUT SESSION:', { 
    priceId, 
    userId, 
    tier, 
    billingPeriod,
    timestamp: new Date().toISOString()
  });
  
  // Show loading toast
  toast.loading('Processing mock payment...', { id: 'mock-payment' });
  
  // Simulate API delay (1-3 seconds)
  const delay = Math.random() * 2000 + 1000;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simulate 90% success rate
  const isSuccess = Math.random() > 0.1;
  
  if (isSuccess) {
    toast.success('Mock payment successful!', { id: 'mock-payment' });
    
    // Simulate successful payment redirect
    setTimeout(() => {
      window.location.href = `/payment/success?session_id=mock_cs_${Date.now()}&payment=subscription&tier=${tier}&billing=${billingPeriod}`;
    }, 500);
  } else {
    toast.error('Mock payment failed - testing error handling', { id: 'mock-payment' });
    throw new Error('Mock payment declined');
  }
};

// ... (rest of file continues) 