# Migration Guide

This guide helps you migrate from the localStorage-based version (v0.x) to the Supabase-based version (v1.0+).

## Overview

Version 1.0 introduces significant architectural changes:
- **Storage**: localStorage → Supabase PostgreSQL
- **Authentication**: None → Clerk
- **Multi-tenancy**: Single user → Organizations/Teams
- **Real-time**: Polling → WebSocket subscriptions

## Before You Begin

### Backup Your Data

Export your existing transactions before migrating:

```javascript
// Run in browser console on v0.x
const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'transactions-backup.json';
a.click();
```

### Prerequisites

- Node.js 18+ installed
- Accounts created for:
  - Supabase
  - Clerk
  - Resend (optional, for email)
  - Sentry (optional, for monitoring)
  - PostHog (optional, for analytics)

## Migration Steps

### Step 1: Update Dependencies

```bash
# Pull latest code
git pull origin master

# Install new dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Configure Environment Variables

#### Frontend (.env)

```bash
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx

# API Configuration
VITE_API_URL=http://localhost:3001/api

# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx

# Optional: Analytics
VITE_POSTHOG_KEY=phc_xxx
VITE_POSTHOG_HOST=https://app.posthog.com

# Optional: Error Tracking
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
VITE_SENTRY_ENVIRONMENT=development
```

#### Backend (server/.env)

```bash
# Server
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Clerk
CLERK_SECRET_KEY=sk_test_xxx
CLERK_PUBLISHABLE_KEY=pk_test_xxx

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres

# Email (Optional)
RESEND_API_KEY=re_xxx
FROM_EMAIL=noreply@your-domain.com

# Security
JWT_SECRET=your-dev-secret-key
CORS_ORIGIN=http://localhost:5173
```

### Step 3: Set Up Database

```bash
cd server

# Run migrations
npm run db:migrate

# Verify tables created
# Check Supabase dashboard → Table Editor
```

### Step 4: Import Your Data

Create a migration script to import your backed-up data:

**server/scripts/import-transactions.js:**

```javascript
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function importTransactions(userId, organizationId, filePath) {
  // Read backup file
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Transform and insert transactions
  const transactions = data.map(t => ({
    organization_id: organizationId,
    user_id: userId,
    type: t.type,
    category: t.category,
    amount: parseFloat(t.amount),
    currency: t.currency || 'USD',
    description: t.description,
    transaction_date: t.date,
    created_at: t.createdAt || new Date().toISOString(),
  }));
  
  const { data: inserted, error } = await supabase
    .from('transactions')
    .insert(transactions);
  
  if (error) {
    console.error('Import failed:', error);
    return;
  }
  
  console.log(`Successfully imported ${transactions.length} transactions`);
}

// Usage:
// node scripts/import-transactions.js <userId> <orgId> <backupFile>
const [userId, orgId, filePath] = process.argv.slice(2);
importTransactions(userId, orgId, filePath);
```

Run the import:

```bash
# First, sign up and get your user ID from Clerk dashboard
# Then create an organization via the API or UI
# Finally, run the import
node scripts/import-transactions.js <your-user-id> <your-org-id> transactions-backup.json
```

### Step 5: Start Development Servers

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server
npm run dev
```

### Step 6: Sign Up and Verify

1. Open http://localhost:5173
2. Sign up with Clerk
3. Verify your imported transactions appear
4. Test creating, editing, and deleting transactions

## Breaking Changes

### Authentication Required

**Before (v0.x):**
```javascript
// No authentication
const transactions = JSON.parse(localStorage.getItem('transactions'));
```

**After (v1.0+):**
```javascript
// Clerk authentication required
import { useAuth } from '@clerk/clerk-react';

const { getToken } = useAuth();
const token = await getToken();

const response = await fetch('/api/transactions', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Data Structure Changes

**Before (v0.x):**
```javascript
{
  id: '1',
  type: 'expense',
  category: 'Food',
  amount: 50.00,
  description: 'Groceries',
  date: '2026-04-29'
}
```

**After (v1.0+):**
```javascript
{
  id: 'uuid',
  organizationId: 'uuid',
  userId: 'uuid',
  type: 'expense',
  category: 'Food',
  amount: 50.00,
  currency: 'USD',
  description: 'Groceries',
  transactionDate: '2026-04-29',
  createdAt: '2026-04-29T10:30:00Z',
  updatedAt: '2026-04-29T10:30:00Z'
}
```

### API Changes

**Before (v0.x):**
```javascript
// Direct localStorage access
localStorage.setItem('transactions', JSON.stringify(transactions));
```

**After (v1.0+):**
```javascript
// REST API calls
const response = await fetch('/api/organizations/123/transactions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(transaction)
});
```

### State Management Changes

**Before (v0.x):**
```javascript
const [transactions, setTransactions] = useState([]);

useEffect(() => {
  const stored = localStorage.getItem('transactions');
  if (stored) {
    setTransactions(JSON.parse(stored));
  }
}, []);
```

**After (v1.0+):**
```javascript
import { useQuery } from '@tanstack/react-query';

const { data: transactions } = useQuery({
  queryKey: ['transactions', organizationId],
  queryFn: () => fetchTransactions(organizationId)
});
```

## Feature Mapping

| v0.x Feature | v1.0+ Equivalent | Notes |
|--------------|------------------|-------|
| localStorage | Supabase | Data now persisted in cloud database |
| No auth | Clerk | Authentication required |
| Single user | Organizations | Multi-tenancy support |
| Manual refresh | Real-time | WebSocket subscriptions for live updates |
| Local currency | Multi-currency | Support for 10+ currencies |
| No collaboration | Team features | Invite members, role-based access |
| No budgets | Budget tracking | Set and monitor budgets |
| No recurring | Recurring transactions | Automate recurring income/expenses |

## Rollback Plan

If you need to rollback to v0.x:

```bash
# Checkout previous version
git checkout v0.9.0

# Reinstall dependencies
npm install

# Restore localStorage data
# Import your backup JSON in browser console:
localStorage.setItem('transactions', JSON.stringify(backupData));

# Start dev server
npm run dev
```

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
- Verify `DATABASE_URL` in `server/.env`
- Check Supabase project is active
- Ensure IP is whitelisted in Supabase (or disable IP restrictions for development)

### Issue: "Authentication failed"

**Solution:**
- Verify Clerk keys in `.env` files
- Check Clerk dashboard for API status
- Ensure webhook URL is configured correctly

### Issue: "Transactions not appearing"

**Solution:**
- Check browser console for errors
- Verify organization ID is correct
- Check RLS policies in Supabase
- Ensure user is a member of the organization

### Issue: "Import script fails"

**Solution:**
- Verify user ID and organization ID are correct
- Check backup JSON format matches expected structure
- Ensure Supabase service role key has proper permissions
- Check for duplicate transaction IDs

## Getting Help

- **Documentation**: See [docs/](docs/) folder
- **Issues**: Create a GitHub issue
- **Community**: Join our Discord/Slack (if available)

## Post-Migration Checklist

- [ ] Data successfully imported
- [ ] Can sign in with Clerk
- [ ] Can create new transactions
- [ ] Can edit existing transactions
- [ ] Can delete transactions
- [ ] Filters working correctly
- [ ] Search working correctly
- [ ] Real-time updates working
- [ ] Multi-currency conversion working
- [ ] Dark mode preference preserved
- [ ] No console errors
- [ ] Performance acceptable

## Next Steps

After successful migration:

1. **Invite team members** - Share your organization
2. **Set up budgets** - Create monthly budget limits
3. **Configure recurring transactions** - Automate regular income/expenses
4. **Enable notifications** - Get alerts for budget limits
5. **Explore analytics** - View spending trends and insights

---

Last updated: 2026-04-29
