import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/hooks/useSubscription';
import { getTierConfig, getExtrasPack, TIERS } from '@/config/pricing';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface ExtrasPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchased?: (packId: string, appliesAdded: number) => void;
}

export function ExtrasPurchaseModal({
  isOpen,
  onClose,
  onPurchased
}: ExtrasPurchaseModalProps) {
  const [purchasingPack, setPurchasingPack] = useState<string | null>(null);
  const { toast } = useToast();
  const { subscription, refreshStatus, purchaseExtras } = useSubscription();

  const handlePurchase = async (packId: string) => {
    if (!subscription) {
      toast({
        title: "Subscription Required",
        description: "Please upgrade to a paid plan to purchase extras",
        variant: "destructive"
      });
      return;
    }

    setPurchasingPack(packId);
    try {
      const result = await purchaseExtras(packId);
      
      if (result.success) {
        toast({
          title: "Extras Purchased",
          description: `Successfully purchased ${result.appliesAdded} additional applies`
        });
        
        await refreshStatus();
        onPurchased?.(packId, result.appliesAdded);
        onClose();
      } else {
        toast({
          title: "Purchase Failed",
          description: result.error || "Failed to purchase extras",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during purchase",
        variant: "destructive"
      });
    } finally {
      setPurchasingPack(null);
    }
  };

  const getExtrasPacksForTier = () => {
    if (!subscription?.tier) return [];
    
    const tierConfig = getTierConfig(subscription.tier);
    if (!tierConfig?.extrasPack) return [];
    
    return [{
      id: `${subscription.tier}_extras`,
      name: `+${tierConfig.extrasPack.applies} Applies`,
      applies: tierConfig.extrasPack.applies,
      price: tierConfig.extrasPack.price,
      description: `Add ${tierConfig.extrasPack.applies} more applies to your monthly quota`
    }];
  };

  const extrasPacks = getExtrasPacksForTier();

  if (!subscription) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Extras</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Subscription Required</h3>
            <p className="text-muted-foreground mb-4">
              You need to upgrade to a paid plan to purchase additional applies.
            </p>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Additional Applies</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current Plan</span>
              <Badge variant="secondary">
                {subscription.tier?.charAt(0).toUpperCase() + subscription.tier?.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Remaining Applies</span>
              <span className="font-medium">{subscription.remainingApplies}</span>
            </div>
            {subscription.nextResetDate && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Resets</span>
                <span>{new Date(subscription.nextResetDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Available Extras Packs */}
          {extrasPacks.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Available Extras</h3>
              {extrasPacks.map((pack) => (
                <Card key={pack.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{pack.name}</CardTitle>
                      <Badge variant="outline">£{pack.price}</Badge>
                    </div>
                    <CardDescription>{pack.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      onClick={() => handlePurchase(pack.id)}
                      disabled={purchasingPack === pack.id}
                      className="w-full"
                    >
                      {purchasingPack === pack.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Purchasing...
                    </>
                  ) : (
                    `Purchase for £${pack.price}`
                  )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-sm font-medium mb-1">No Extras Available</h3>
              <p className="text-sm text-muted-foreground">
                Your current plan doesn't support extras packs.
              </p>
            </div>
          )}

          {/* Upgrade Suggestion */}
          {extrasPacks.length === 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    Upgrade for More Applies
                  </h4>
                  <p className="text-sm text-blue-700">
                    Consider upgrading to a higher tier for more monthly applies and extras options.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 