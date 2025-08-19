import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (only use publishable key on frontend)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export const getStripe = () => stripePromise;

// Pricing configuration that matches our pricing structure
export const STRIPE_PRICES = {
  // Free tier - no Stripe price needed
  free: null,
  
  // Pay-as-you-go - one-time payment
  payAsYouGo: {
    priceId: 'price_1RezXMHO6B9cGpZ7nX82Srib', // ✅ AUTOMATED - £2.49
    amount: 249, // £2.49 in pence
    currency: 'gbp',
    type: 'one_time'
  },
  
  // Monthly subscriptions with 6-month and annual options
  starter: {
    monthly: 'price_1RezXMHO6B9cGpZ7TpRdpKJJ', // ✅ AUTOMATED - £14.99/month (UPDATED)
    sixMonth: 'price_1RezXNHO6B9cGpZ74PzmgHUa', // ✅ AUTOMATED - £52.46 every 6 months (30% off)
    annual: 'price_1RezXNHO6B9cGpZ7LEd5MlmC', // ✅ AUTOMATED - £74.94/year (50% off)
  },
  
  professional: {
    monthly: 'price_1RezXNHO6B9cGpZ7vtNCzvEZ', // ✅ AUTOMATED - £29.99/month (UPDATED)
    sixMonth: 'price_1RezXOHO6B9cGpZ7WgkVs8Yu', // ✅ AUTOMATED - £104.96 every 6 months (30% off)
    annual: 'price_1RezXOHO6B9cGpZ7AV6p7geH', // ✅ AUTOMATED - £149.94/year (50% off)
  },
  
  enterprise: {
    monthly: 'price_1RezXOHO6B9cGpZ7YBnDIXRe', // ✅ AUTOMATED - £99/month (UPDATED)
    sixMonth: 'price_1RezXPHO6B9cGpZ7tkIz0dvR', // ✅ AUTOMATED - £349.96 every 6 months (30% off)
    annual: 'price_1RezXPHO6B9cGpZ7onGY5QtS', // ✅ AUTOMATED - £499.94/year (50% off)
  }
};

// User subscription tiers
export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'career_pro' | 'elite_executive';

// Subscription status
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete';

// Subscription interface
export interface UserSubscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to create checkout session with Price ID
// This should be moved to backend API endpoint
export async function createCheckoutSession(priceId: string, userId: string) {
  try {
    // Call your backend API endpoint instead of using secret key on frontend
    const response = await fetch(`/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/payment-failed`,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create checkout session error:', error);
    throw error;
  }
}

// Get user's current subscription
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const response = await fetch(`/api/stripe/subscription/${userId}`);
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error('Get user subscription error:', error);
    return null;
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    const response = await fetch(`/api/stripe/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Cancel subscription error:', error);
    throw error;
  }
}

// Update subscription tier
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string,
  tier: SubscriptionTier
) {
  try {
    const response = await fetch(`/api/stripe/update-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
        newPriceId,
        tier,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Update subscription error:', error);
    throw error;
  }
}

// Get usage for tier limits
export interface UsageStats {
  analysesThisMonth: number;
  analysesAllTime: number;
  currentTier: SubscriptionTier;
  monthlyLimit: number; // -1 for unlimited
  isLimitReached: boolean;
}

export async function getUserUsage(userId: string): Promise<UsageStats> {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/api/usage/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to get usage stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get user usage error:', error);
    // Return safe defaults
    return {
      analysesThisMonth: 0,
      analysesAllTime: 0,
      currentTier: 'free',
      monthlyLimit: 1,
      isLimitReached: false,
    };
  }
}

// Tier limits configuration
export const TIER_LIMITS = {
  free: { monthlyLimit: 1, features: ['basic_analysis', 'smart_applications', 'interview_practice'] },
  starter: { monthlyLimit: 50, features: ['unlimited_cvs', 'smart_applications', 'interview_coaching', 'uk_insights'] },
  professional: { monthlyLimit: -1, features: ['unlimited_applications', 'advanced_coaching', 'uk_recruiter_network', 'success_guarantee'] },
  enterprise: { monthlyLimit: -1, features: ['team_analytics', 'uk_industry_specialization', 'custom_branding', 'dedicated_support'] }
} as const; 