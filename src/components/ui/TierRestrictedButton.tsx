import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Zap, 
  Award, 
  TrendingUp, 
  Crown, 
  Brain,
  Lock
} from 'lucide-react';

interface TierRestrictedButtonProps {
  children: React.ReactNode;
  userTier: string;
  requiredTier?: string;
  isDisabled?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showUpgradePrompt?: boolean;
  featureName?: string;
}

const TierRestrictedButton: React.FC<TierRestrictedButtonProps> = ({
  children,
  userTier,
  requiredTier = 'starter',
  isDisabled = false,
  onClick,
  variant = 'default',
  size = 'default',
  className = '',
  showUpgradePrompt = true,
  featureName = 'AI feature'
}) => {
  const tierOrder = ['free', 'starter', 'pro', 'career_pro', 'elite_exec'];
  const userTierIndex = tierOrder.indexOf(userTier);
  const requiredTierIndex = tierOrder.indexOf(requiredTier);
  const isTierRestricted = userTierIndex < requiredTierIndex;

  const getTierInfo = (tier: string) => {
    const tierInfo = {
      free: { name: 'Free', icon: <Star className="h-3 w-3" />, color: 'bg-gray-100 text-gray-800' },
      starter: { name: 'Starter', icon: <Zap className="h-3 w-3" />, color: 'bg-blue-100 text-blue-800' },
      pro: { name: 'Pro', icon: <Award className="h-3 w-3" />, color: 'bg-purple-100 text-purple-800' },
      career_pro: { name: 'Career Pro', icon: <TrendingUp className="h-3 w-3" />, color: 'bg-emerald-100 text-emerald-800' },
      elite_exec: { name: 'Elite', icon: <Crown className="h-3 w-3" />, color: 'bg-yellow-100 text-yellow-800' }
    };
    return tierInfo[tier as keyof typeof tierInfo] || tierInfo.free;
  };

  const handleClick = () => {
    if (isTierRestricted) {
      // Show upgrade prompt or navigate to pricing
      if (showUpgradePrompt) {
        // You can implement a toast or modal here
        console.log(`Upgrade to ${getTierInfo(requiredTier).name} tier to use ${featureName}`);
      }
      return;
    }
    onClick?.();
  };

  if (isTierRestricted) {
    return (
      <div className="relative group">
        <Button
          variant={variant}
          size={size}
          disabled={true}
          className={`${className} opacity-60 cursor-not-allowed`}
          title={`${featureName} requires ${getTierInfo(requiredTier).name} tier or higher`}
        >
          <Lock className="h-4 w-4 mr-2" />
          {children}
        </Button>
        
        {showUpgradePrompt && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            <div className="flex items-center space-x-2">
              <Badge className={getTierInfo(requiredTier).color}>
                {getTierInfo(requiredTier).icon}
                {getTierInfo(requiredTier).name}
              </Badge>
              <span>required</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isDisabled}
      onClick={handleClick}
      className={className}
    >
      {children}
    </Button>
  );
};

export default TierRestrictedButton; 
 
 