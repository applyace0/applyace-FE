# Apply Flow Module - Frontend Implementation

## Overview

This document describes the frontend implementation of ApplyAce's Apply Flow module, which provides one-click and mass-apply functionality for job applications with tier-based quotas and fair usage policies.

## Architecture

### Components

#### 1. ApplyButton (`components/ApplyButton.tsx`)
- **Purpose**: Single job application button with quota checking and cooldown management
- **Props**: `jobId`, `cvId`, `affiliateCode?`, `onApplied?`, `className?`
- **Features**:
  - Real-time quota display
  - Cooldown timer with visual feedback
  - CV selection validation
  - Error handling with toast notifications
  - Affiliate code support

#### 2. MassApplyModal (`components/MassApplyModal.tsx`)
- **Purpose**: Batch job application modal with progress tracking
- **Props**: `jobs`, `cvId`, `affiliateCode?`, `isOpen`, `onClose`, `onApplied?`
- **Features**:
  - Job selection with checkboxes
  - Progress bar during batch operations
  - Per-job status tracking
  - Quota validation for batch operations
  - Error handling and retry logic

#### 3. ExtrasPurchaseModal (`components/ExtrasPurchaseModal.tsx`)
- **Purpose**: Purchase additional apply quotas based on user tier
- **Props**: `isOpen`, `onClose`, `onPurchased?`
- **Features**:
  - Tier-based extras pack display
  - Purchase flow with Stripe integration
  - Real-time quota refresh
  - Upgrade suggestions for incompatible tiers

#### 4. SubscriptionStatusWidget (`components/SubscriptionStatusWidget.tsx`)
- **Purpose**: Display current subscription status and usage
- **Props**: `className?`, `showExtrasButton?`
- **Features**:
  - Usage progress bar
  - Tier-specific icons and styling
  - Fair usage policy display for Elite Executive
  - Quick access to extras purchase

### Hooks

#### 1. useApply (`hooks/useApply.ts`)
- **Purpose**: Manage apply operations and cooldown state
- **Returns**:
  - `applySingle(jobId, cvId, affiliateCode?)`: Single job application
  - `applyBatch(jobIds, cvId, affiliateCode?)`: Batch job application
  - `buyExtras(packId)`: Purchase additional quotas
  - `cooldownEnd`: Current cooldown end timestamp
  - `isInCooldown`: Whether user is in cooldown period

#### 2. useSubscription (`hooks/useSubscription.ts`)
- **Purpose**: Manage subscription status and pricing
- **Returns**:
  - `subscription`: Current subscription data
  - `remainingApplies`: Number of applies remaining
  - `nextResetDate`: When quota resets
  - `refreshStatus()`: Refresh subscription data
  - `purchaseExtras(packId)`: Purchase extras

### Context

#### ApplyContext (`context/ApplyContext.tsx`)
- **Purpose**: Global state management for apply operations
- **Provider**: `ApplyProvider` wraps the app
- **Hook**: `useApplyContext()` for accessing global state
- **State**:
  - Subscription status
  - Apply cooldowns
  - Extras purchases
  - Loading states

## API Integration

### Endpoints

1. **POST /api/apply**
   ```typescript
   Request: {
     jobId: string;
     cvId: string;
     affiliateCode?: string;
   }
   Response: {
     status: 'success' | 'error';
     application_id?: string;
     cooldown?: number;
     error?: string;
   }
   ```

2. **POST /api/apply/batch**
   ```typescript
   Request: {
     jobIds: string[];
     cvId: string;
     affiliateCode?: string;
   }
   Response: {
     status: 'queued' | 'error';
     batch_id?: string;
     applications?: Array<{
       jobId: string;
       status: 'success' | 'failed' | 'rate_limited' | 'quota_exceeded';
       error?: string;
     }>;
     error?: string;
   }
   ```

3. **GET /api/subscription/status**
   ```typescript
   Response: {
     tier: string;
     remainingApplies: number;
     nextResetDate?: string;
     extrasPurchased?: number;
   }
   ```

4. **POST /api/subscription/purchase-extras**
   ```typescript
   Request: {
     packId: string;
   }
   Response: {
     success: boolean;
     appliesAdded?: number;
     error?: string;
   }
   ```

## Pricing Integration

The Apply Flow integrates with the pricing configuration from `@/config/pricing.ts`:

```typescript
// Tier limits from pricing config
Free: 1 apply/month
Pay-As-You-Go: £2.49 per apply
Starter: 5 applies/month
Professional: 150 applies/month (Most Popular)
Career Pro: 300 applies/month
Elite Executive: 450 applies/month (fair usage cap)
```

## Feature Flags

The Apply Flow is controlled by the `VITE_FEATURE_APPLY_FLOW` environment variable:

```bash
# Enable Apply Flow
VITE_FEATURE_APPLY_FLOW=true

# Disable Apply Flow
VITE_FEATURE_APPLY_FLOW=false
```

## Usage Examples

### Basic Single Apply
```tsx
import { ApplyButton } from '@/components/ApplyButton';

<ApplyButton
  jobId="job-123"
  cvId="cv-456"
  onApplied={(jobId, success) => {
    console.log(`Applied to ${jobId}: ${success}`);
  }}
/>
```

### Mass Apply with Modal
```tsx
import { MassApplyModal } from '@/components/MassApplyModal';

const [isModalOpen, setIsModalOpen] = useState(false);
const jobs = [
  { id: 'job-1', title: 'Developer', company: 'Tech Corp' },
  { id: 'job-2', title: 'Engineer', company: 'Startup Inc' },
];

<MassApplyModal
  jobs={jobs}
  cvId="cv-456"
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onApplied={(jobIds, successCount) => {
    console.log(`Applied to ${successCount} of ${jobIds.length} jobs`);
  }}
/>
```

### Subscription Status Widget
```tsx
import { SubscriptionStatusWidget } from '@/components/SubscriptionStatusWidget';

<SubscriptionStatusWidget showExtrasButton={true} />
```

### With Context Provider
```tsx
import { ApplyProvider } from '@/context/ApplyContext';

function App() {
  return (
    <ApplyProvider>
      {/* Your app components */}
    </ApplyProvider>
  );
}
```

## Testing

### Unit Tests
- **Components**: Test individual component behavior
- **Hooks**: Test hook logic and state management
- **Context**: Test context provider and consumer

### E2E Tests (Playwright)
- **Single Apply Flow**: Complete single job application
- **Batch Apply Flow**: Mass application with multiple jobs
- **Extras Purchase Flow**: Purchase additional quotas
- **Error Handling**: Quota exceeded, rate limiting, etc.

## Accessibility

All components follow WCAG 2.1 AA guidelines:

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Modal focus trapping and restoration
- **Error Announcements**: Toast notifications for screen readers
- **Loading States**: Clear loading indicators

## Performance Considerations

1. **Debounced API Calls**: Prevent rapid-fire requests
2. **Optimistic Updates**: Immediate UI feedback
3. **Lazy Loading**: Load components on demand
4. **Memoization**: Prevent unnecessary re-renders
5. **Error Boundaries**: Graceful error handling

## Security

1. **Input Validation**: Zod schemas for all user inputs
2. **CSRF Protection**: Token-based request validation
3. **Rate Limiting**: Client-side cooldown enforcement
4. **Quota Enforcement**: Server-side validation
5. **Audit Logging**: All actions logged for compliance

## Deployment

### Environment Variables
```bash
# Required
VITE_FEATURE_APPLY_FLOW=true

# Optional
VITE_API_BASE_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Build Process
```bash
# Install dependencies
npm install

# Run tests
npm test
npm run test:e2e

# Build for production
npm run build
```

## Troubleshooting

### Common Issues

1. **Apply Button Disabled**
   - Check CV selection
   - Verify quota availability
   - Check cooldown status

2. **API Errors**
   - Verify backend server is running
   - Check network connectivity
   - Validate request payload

3. **Subscription Issues**
   - Refresh subscription status
   - Check user authentication
   - Verify tier configuration

### Debug Mode
Enable debug logging by setting `VITE_DEBUG=true` in your environment.

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live quota updates
2. **Offline Support**: Queue applications when offline
3. **Advanced Analytics**: Detailed application tracking
4. **AI Integration**: Smart job matching and recommendations
5. **Mobile Optimization**: Enhanced mobile experience

## Contributing

1. Follow the existing code style and patterns
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Ensure accessibility compliance
5. Test across different browsers and devices 