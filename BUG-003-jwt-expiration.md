# Bug Report - JWT Token Expiration Issue

**Bug ID**: BUG-003  
**Title**: Organization not detected after JWT token expires  
**Severity**: High  
**Priority**: P2  
**Component**: Authentication  
**Found by**: QA Testing (TC-002)

---

## Description

After creating an organization successfully, refreshing the page shows "Create Organization" page again instead of Dashboard. The organization exists in the database but cannot be fetched.

## Root Cause

JWT tokens issued by Clerk expire after 1 hour. When the token expires:
1. Frontend calls `getUserOrganization(getToken)` 
2. Backend receives expired token
3. Backend returns "Authentication failed"
4. Frontend thinks no organization exists
5. User redirected to CreateOrganization page

## Evidence

**Backend Log:**
```
Auth middleware error: _TokenVerificationError: JWT is expired. 
Expiry date: Tue, 07 Apr 2026 13:17:45 GMT
Current date: Wed, 08 Apr 2026 09:47:59 GMT
```

**Database:**
```
Create organization error: {
  code: '23505',
  details: 'Key (slug)=(qa-test-raed-test-com-s-finances) already exists.'
}
```
This confirms organization exists but cannot be accessed with expired token.

## Impact

- **Users Affected**: All users after 1 hour of inactivity
- **Severity**: High - blocks access to app
- **Workaround**: Sign out and sign back in

## Steps to Reproduce

1. Sign up and create organization
2. Wait 1+ hours (or set system time forward)
3. Refresh page
4. Observe: Redirected to CreateOrganization instead of Dashboard

## Expected Behavior

- App should automatically refresh expired tokens
- Or show clear error message: "Session expired, please sign in again"
- Should not show CreateOrganization page when org exists

## Actual Behavior

- Silent authentication failure
- User redirected to CreateOrganization page
- Confusing UX - looks like org was lost

## Recommended Fix

**Option 1: Auto-refresh tokens (Best UX)**
```javascript
// In apiClient.js
const getValidToken = async (getToken) => {
  try {
    return await getToken({ skipCache: true });
  } catch (error) {
    // Token refresh failed, redirect to sign-in
    window.location.href = '/sign-in';
  }
};
```

**Option 2: Better error handling**
```javascript
// In useOrganization.js
catch (err) {
  if (err.message.includes('Authentication failed')) {
    // Clear session and redirect
    window.location.href = '/sign-in';
  }
}
```

**Option 3: Show clear error message**
- Detect authentication errors
- Show toast: "Your session has expired. Please sign in again."
- Provide "Sign In" button

## Temporary Workaround

User must:
1. Click user menu (top-right)
2. Click "Sign Out"
3. Sign in again
4. Dashboard will load correctly

## Related Issues

- Affects all API calls after token expiration
- May cause confusion during QA testing
- Should be fixed before production

---

**Status**: Open  
**Assigned To**: Development Team  
**Priority**: P2 (Fix before production)  
**Date Found**: 2026-04-08
