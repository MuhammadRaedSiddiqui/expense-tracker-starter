# Bug Report - Transaction List Not Updating After Create

**Bug ID**: BUG-004  
**Title**: Transaction list doesn't update immediately after creating transaction  
**Severity**: Medium  
**Priority**: P2  
**Component**: Real-time Updates / Dashboard  
**Found by**: QA Testing (TC-003)

---

## Description

After creating a new transaction, the transaction list on the Dashboard doesn't update automatically. User must manually refresh the page to see the new transaction.

## Root Cause

The `handleAddTransaction` function calls `refetch()` from `useOrganization` hook, but this doesn't trigger the `useRealtimeTransactions` hook to re-fetch data. The useRealtimeTransactions hook only updates when:
1. Component mounts (initial fetch)
2. Real-time event received from Supabase (WebSocket)
3. Polling interval fires (every 30 seconds)

Since the transaction is created via API (not directly in Supabase), the real-time subscription doesn't detect the change immediately.

## Code Analysis

**Dashboard.jsx (lines 95-121):**
```javascript
const handleAddTransaction = async (newTransaction) => {
  // ... create transaction via API
  
  // Real-time will update the list automatically
  if (refetch) {
    refetch(); // ❌ This refetches organization, not transactions
  }
};
```

**useRealtimeTransactions hook:**
- No exposed `refetch` method
- Only updates on real-time events or polling
- Polling is 30 seconds, too slow for immediate feedback

## Impact

- **User Experience**: Poor - users don't see their changes immediately
- **Severity**: Medium - functionality works but UX is degraded
- **Workaround**: Manual page refresh

## Steps to Reproduce

1. Go to Dashboard
2. Click "Add Transaction"
3. Fill form and submit
4. Observe: Transaction list doesn't update
5. Refresh page manually
6. Observe: Transaction now appears

## Expected Behavior

After creating a transaction:
- Transaction appears in list immediately
- Summary cards update immediately
- No manual refresh required

## Actual Behavior

- Transaction created successfully (API call succeeds)
- Transaction list remains unchanged
- Must refresh page to see new transaction

## Recommended Fix

**Option 1: Add refetch method to useRealtimeTransactions (Best)**
```javascript
// In useRealtime.js
export function useRealtimeTransactions(organizationId, fetchFunction, enabled = true) {
  // ... existing code
  
  const refetch = useCallback(() => {
    fetchFunction().then((result) => {
      setData(result);
    });
  }, [fetchFunction]);
  
  return { data, isRealtime, refetch };
}

// In Dashboard.jsx
const { data: transactions, isRealtime, refetch: refetchTransactions } = useRealtimeTransactions(...);

const handleAddTransaction = async (newTransaction) => {
  // ... create transaction
  
  // Immediately refetch transactions
  if (refetchTransactions) {
    refetchTransactions();
  }
};
```

**Option 2: Optimistic UI update**
```javascript
const handleAddTransaction = async (newTransaction) => {
  // Optimistically add to UI
  setTransactions(prev => [...prev, { ...newTransaction, id: 'temp' }]);
  
  // Create via API
  const { data, error } = await createTransaction(...);
  
  if (error) {
    // Rollback on error
    setTransactions(prev => prev.filter(t => t.id !== 'temp'));
  } else {
    // Replace temp with real data
    setTransactions(prev => prev.map(t => t.id === 'temp' ? data : t));
  }
};
```

**Option 3: Force re-mount of useRealtimeTransactions**
- Less elegant, causes unnecessary re-subscriptions

## Testing Notes

- Check browser console for "[Realtime] Transactions subscription active"
- If not present, real-time is not working (WebSocket failed)
- Polling fallback is 30 seconds, explains the delay

---

**Status**: Open  
**Assigned To**: Development Team  
**Priority**: P2 (Fix before production)  
**Date Found**: 2026-04-08
