# Monitoring Setup Guide

This guide covers setting up Sentry (error tracking) and PostHog (product analytics) for the Expense Tracker application.

## Sentry Setup (Error Tracking)

### Step 1: Create Sentry Account

1. Go to [sentry.io](https://sentry.io)
2. Sign up for a free account (5K errors/month free)
3. Create a new project
   - Platform: **React**
   - Alert frequency: Choose your preference

### Step 2: Get Your DSN

1. After creating the project, copy your **DSN** (Data Source Name)
   - It looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`

2. Add to `.env.local`:
```bash
VITE_SENTRY_DSN=your_sentry_dsn_here
```

### Step 3: Configure Alerts

1. Go to **Alerts** in Sentry dashboard
2. Set up alert rules:
   - New issue created
   - Issue frequency increases
   - Error rate threshold exceeded

### Step 4: Test Integration

Add this to any component to test:
```javascript
import { captureException } from './lib/sentry';

// Trigger a test error
try {
  throw new Error('Test error from Expense Tracker');
} catch (error) {
  captureException(error, { context: 'testing' });
}
```

Check Sentry dashboard to see the error appear.

---

## PostHog Setup (Product Analytics)

### Step 1: Create PostHog Account

1. Go to [posthog.com](https://posthog.com)
2. Sign up for free (1M events/month free)
3. Create a new project
   - Name: "Expense Tracker"

### Step 2: Get Your API Key

1. Go to **Project Settings** → **Project API Key**
2. Copy your **Project API Key**

3. Add to `.env.local`:
```bash
VITE_POSTHOG_API_KEY=your_posthog_api_key
VITE_POSTHOG_HOST=https://app.posthog.com
```

### Step 3: Configure Features

1. **Session Recording** (optional)
   - Go to Settings → Session Recording
   - Enable session recording
   - Configure privacy settings (mask sensitive data)

2. **Feature Flags** (for A/B testing)
   - Go to Feature Flags
   - Create flags for features you want to test

### Step 4: Test Integration

Add this to any component:
```javascript
import { trackEvent } from './lib/posthog';

// Track a custom event
trackEvent('button_clicked', {
  button_name: 'Add Transaction',
  page: 'Dashboard'
});
```

Check PostHog dashboard to see the event.

---

## Usage Examples

### Tracking User Actions

```javascript
import { trackEvent } from './lib/posthog';

// Track transaction creation
trackEvent('transaction_created', {
  type: 'expense',
  amount: 50.00,
  currency: 'USD'
});

// Track feature usage
trackEvent('feature_used', {
  feature: 'multi_currency',
  action: 'currency_changed'
});
```

### Error Handling

```javascript
import { captureException, addBreadcrumb } from './lib/sentry';

try {
  // Add context before potential error
  addBreadcrumb('Fetching exchange rates', {
    currency: 'USD'
  });
  
  const rates = await fetchExchangeRates();
} catch (error) {
  captureException(error, {
    context: 'exchange_rates',
    currency: 'USD'
  });
}
```

### User Identification

```javascript
import { identifyUser } from './lib/posthog';
import { setUser } from './lib/sentry';

// After user logs in
const user = {
  id: 'user_123',
  email: 'user@example.com',
  plan: 'pro'
};

// Identify in PostHog
identifyUser(user.id, {
  email: user.email,
  plan: user.plan
});

// Set user in Sentry
setUser(user);
```

### Logout

```javascript
import { resetUser } from './lib/posthog';
import { setUser } from './lib/sentry';

// On logout
resetUser(); // PostHog
setUser(null); // Sentry
```

---

## Key Metrics to Track

### User Engagement
- `page_viewed` - Track page navigation
- `feature_used` - Track feature usage
- `button_clicked` - Track button interactions

### Transactions
- `transaction_created` - New transaction added
- `transaction_edited` - Transaction modified
- `transaction_deleted` - Transaction removed
- `bulk_action_performed` - Bulk operations

### Business Metrics
- `subscription_started` - User subscribed
- `subscription_upgraded` - Plan upgraded
- `subscription_cancelled` - Subscription cancelled
- `trial_started` - Trial period started

### Errors to Monitor
- API failures
- Payment processing errors
- Authentication failures
- Data sync issues

---

## Privacy & Compliance

### Data Masking

Both Sentry and PostHog are configured to mask sensitive data:

**Sentry:**
- Cookies are removed from error reports
- Custom `beforeSend` hook filters sensitive data

**PostHog:**
- All input fields are masked by default
- Elements with `data-private` attribute are masked
- Session recordings mask sensitive information

### GDPR Compliance

1. **User Consent**
   - Add cookie consent banner
   - Allow users to opt-out of analytics

2. **Data Deletion**
   - Users can request data deletion
   - Both platforms support GDPR data deletion requests

3. **Privacy Policy**
   - Update privacy policy to mention Sentry and PostHog
   - Explain what data is collected and why

---

## Monitoring Best Practices

### 1. Set Up Alerts
- Configure Slack/email notifications for critical errors
- Set thresholds for error rates
- Monitor performance degradation

### 2. Create Dashboards
- User engagement metrics
- Error rates by feature
- Conversion funnels
- Performance metrics

### 3. Regular Reviews
- Weekly: Review error trends
- Monthly: Analyze user behavior patterns
- Quarterly: Assess feature adoption

### 4. Performance Monitoring
- Track page load times
- Monitor API response times
- Identify slow queries

---

## Troubleshooting

### Sentry Not Capturing Errors

1. Check DSN is correct in `.env.local`
2. Verify environment is not 'development' (errors are captured in all envs)
3. Check browser console for Sentry initialization errors
4. Ensure `initSentry()` is called before app renders

### PostHog Not Tracking Events

1. Verify API key is correct
2. Check browser console for PostHog errors
3. Ensure `initPostHog()` is called before app renders
4. In development, PostHog is opted-out by default (check console)

### High Event Volume

If you're hitting free tier limits:
1. Reduce sample rates in configuration
2. Filter out noisy events
3. Implement event throttling
4. Consider upgrading to paid tier

---

## Cost Management

### Sentry Free Tier
- 5,000 errors/month
- 1 project
- 30-day retention

**Tips to stay within limits:**
- Filter out known/expected errors
- Use `beforeSend` to sample errors
- Group similar errors together

### PostHog Free Tier
- 1M events/month
- Unlimited projects
- 1 year retention

**Tips to stay within limits:**
- Disable autocapture if too noisy
- Sample session recordings (10% default)
- Track only critical events

---

## Resources

- [Sentry React Documentation](https://docs.sentry.io/platforms/javascript/guides/react/)
- [PostHog React Documentation](https://posthog.com/docs/libraries/react)
- [Sentry Performance Monitoring](https://docs.sentry.io/product/performance/)
- [PostHog Session Recording](https://posthog.com/docs/session-replay)
