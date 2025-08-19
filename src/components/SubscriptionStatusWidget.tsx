import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSubscription } from '@/hooks/useSubscription';
import { ExtrasPurchaseModal } from './ExtrasPurchaseModal';
import { getTierConfig } from '@/config/pricing';
import { Calendar, Plus, Crown, Zap } from 'lucide-react';

interface SubscriptionStatusWidgetProps {
  className?: string;
  showExtrasButton?: boolean;
}

export function SubscriptionStatusWidget({
  className,
  showExtrasButton = true
}: SubscriptionStatusWidgetProps) {
  const [isExtrasModalOpen, setIsExtrasModalOpen] = useState(false);
  const { subscription, remainingApplies, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Subscription Status
          </CardTitle>
          <CardDescription>
            No active subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Upgrade to a paid plan to access more applies and features.
            </p>
            <Button size="sm">
              View Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const tierConfig = getTierConfig(subscription.tier);
  const totalApplies = tierConfig?.appliesPerMonth || 0;
  const usedApplies = totalApplies > 0 ? totalApplies - remainingApplies : 0;
  const usagePercentage = totalApplies > 0 ? (usedApplies / totalApplies) * 100 : 0;
  const isUnlimited = totalApplies === -1; // -1 indicates unlimited applies

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'elite_executive':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'career_pro':
      case 'professional':
        return <Zap className="h-4 w-4 text-blue-500" />;
      default:
        return <Crown className="h-4 w-4" />;
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getTierIcon(subscription.tier)}
            {subscription.tier?.charAt(0).toUpperCase() + subscription.tier?.slice(1)} Plan
          </CardTitle>
          <CardDescription>
            Your current subscription and usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Applies Used</span>
              <span className={`font-medium ${isUnlimited ? 'text-green-500' : getUsageColor(usagePercentage)}`}>
                {isUnlimited ? 'Unlimited' : `${usedApplies} / ${totalApplies}`}
              </span>
            </div>
            {!isUnlimited && (
              <>
                <Progress 
                  value={usagePercentage} 
                  className="h-2"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{remainingApplies} remaining</span>
                  <span>{Math.round(usagePercentage)}% used</span>
                </div>
              </>
            )}
                  {isUnlimited && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Unlimited applies available</span>
            <span className="text-green-500">∞</span>
          </div>
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
            <span className="font-medium">* Fair Usage Policy:</span> Subject to reasonable usage limits to prevent abuse.
          </div>
        </div>
      )}
          </div>

          {/* Reset Date */}
          {subscription.nextResetDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Resets {new Date(subscription.nextResetDate).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Extras Button */}
          {showExtrasButton && tierConfig?.extrasPack && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExtrasModalOpen(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buy More Applies
            </Button>
          )}
        </CardContent>
      </Card>

      <ExtrasPurchaseModal
        isOpen={isExtrasModalOpen}
        onClose={() => setIsExtrasModalOpen(false)}
        onPurchased={(packId, appliesAdded) => {
          // Handle successful purchase
          console.log(`Purchased ${appliesAdded} applies via pack ${packId}`);
        }}
      />
    </>
  );
} 