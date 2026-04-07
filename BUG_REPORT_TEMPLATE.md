# Bug Report Template

**Report Date**: ___________  
**Reporter**: ___________  
**Environment**: ⬜ Development ⬜ Staging ⬜ Production

---

## Bug Information

**Bug ID**: BUG-___________  
**Title**: ___________

**Severity**: 
- ⬜ Critical (System crash, data loss, security issue)
- ⬜ High (Major feature broken, no workaround)
- ⬜ Medium (Feature partially broken, workaround exists)
- ⬜ Low (Minor issue, cosmetic)

**Priority**: 
- ⬜ P1 (Fix immediately)
- ⬜ P2 (Fix in current sprint)
- ⬜ P3 (Fix in next sprint)
- ⬜ P4 (Fix when possible)

**Component**: 
- ⬜ Authentication
- ⬜ Transactions
- ⬜ Recurring Transactions
- ⬜ Budgets
- ⬜ Reports
- ⬜ Team Management
- ⬜ Settings
- ⬜ UI/UX
- ⬜ Performance
- ⬜ Other: ___________

---

## Environment Details

**Browser**: ___________  
**Browser Version**: ___________  
**Operating System**: ___________  
**Screen Resolution**: ___________  
**Device**: ⬜ Desktop ⬜ Tablet ⬜ Mobile

**Backend URL**: ___________  
**Frontend URL**: ___________  
**Build Version**: ___________

---

## Description

**Summary**: 
_____________________________________________
_____________________________________________

**Expected Behavior**: 
_____________________________________________
_____________________________________________

**Actual Behavior**: 
_____________________________________________
_____________________________________________

---

## Steps to Reproduce

1. 
2. 
3. 
4. 
5. 

**Reproducibility**: 
- ⬜ Always (100%)
- ⬜ Often (75%)
- ⬜ Sometimes (50%)
- ⬜ Rarely (25%)
- ⬜ Once (Unable to reproduce)

---

## Test Data

**User Account**: ___________  
**Organization ID**: ___________  
**Transaction ID** (if applicable): ___________  
**Other IDs**: ___________

**Test Data Used**:
```
(Paste relevant test data here)
```

---

## Evidence

**Screenshots**: 
- [ ] Attached: screenshot-1.png
- [ ] Attached: screenshot-2.png

**Screen Recording**: 
- [ ] Attached: recording.mp4

**Console Errors**:
```
(Paste console errors here)
```

**Network Errors**:
```
(Paste network tab errors here)
```

**Error Stack Trace**:
```
(Paste full error stack trace here)
```

---

## Impact

**Users Affected**: 
- ⬜ All users
- ⬜ Specific role: ___________
- ⬜ Specific browser: ___________
- ⬜ Specific scenario: ___________

**Business Impact**:
- ⬜ Blocks critical workflow
- ⬜ Causes data loss
- ⬜ Security vulnerability
- ⬜ Poor user experience
- ⬜ Minor inconvenience

**Workaround Available**: ⬜ Yes ⬜ No

**Workaround Description**:
_____________________________________________
_____________________________________________

---

## Additional Information

**Related Bugs**: 
- BUG-___________
- BUG-___________

**Related Test Cases**: 
- TC-___________
- TC-___________

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________

---

## Developer Section (To be filled by dev team)

**Assigned To**: ___________  
**Status**: ⬜ New ⬜ In Progress ⬜ Fixed ⬜ Verified ⬜ Closed ⬜ Won't Fix

**Root Cause**:
_____________________________________________
_____________________________________________

**Fix Description**:
_____________________________________________
_____________________________________________

**Files Changed**:
- 
- 
- 

**Commit Hash**: ___________

**Fixed in Version**: ___________

**Verification Date**: ___________  
**Verified By**: ___________

---

## Example Bug Report

**Bug ID**: BUG-001  
**Title**: Transaction amount not updating in summary after edit

**Severity**: High  
**Priority**: P1  
**Component**: Transactions

**Browser**: Chrome 120.0  
**OS**: Windows 11  
**Device**: Desktop

**Summary**: 
When editing a transaction amount, the transaction list updates correctly but the summary cards (Income/Expenses/Balance) do not recalculate.

**Expected Behavior**: 
After editing a transaction amount, the summary should immediately recalculate and show the updated totals.

**Actual Behavior**: 
The transaction list shows the new amount, but the summary still shows the old totals. Refreshing the page fixes it.

**Steps to Reproduce**:
1. Create a transaction: "Test", $100, Income
2. Verify summary shows Income: $100
3. Edit transaction amount to $200
4. Click save
5. Observe summary still shows Income: $100 (should be $200)
6. Refresh page
7. Summary now correctly shows Income: $200

**Reproducibility**: Always (100%)

**Console Errors**: None

**Impact**: High - Users see incorrect financial data

**Workaround**: Refresh the page after editing

**Root Cause**: Summary component not re-rendering when transactions state updates

**Fix**: Add transactions as dependency to useMemo in Summary component
