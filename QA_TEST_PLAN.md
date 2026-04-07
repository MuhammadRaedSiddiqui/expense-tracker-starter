# Finance Tracker - QA Manual Test Plan

**Version**: 1.0.0  
**Date**: 2026-04-07  
**Environment**: Development (http://localhost:5174)  
**Backend**: http://localhost:3001

---

## Test Execution Instructions

### Prerequisites
1. ✅ Dev server running on http://localhost:5174
2. ✅ Backend server running on http://localhost:3001
3. ✅ Supabase database accessible
4. ✅ Clerk authentication configured
5. ✅ Clean browser profile (no cached data)

### Test Data Setup
- Use test email: `qa-tester@example.com` (or your test account)
- Organization name: "QA Test Organization"
- Test with multiple browsers: Chrome, Firefox, Safari, Edge

### Reporting Issues
- Document: Browser, OS, steps to reproduce, expected vs actual result
- Screenshots for UI issues
- Console errors for technical issues
- Network tab for API issues

---

## Priority 1: Critical Path Tests (Must Pass)

### TC-001: User Sign Up
**Priority**: P1 - Critical  
**Estimated Time**: 5 minutes

**Preconditions**: 
- Not signed in
- Clean browser session

**Steps**:
1. Navigate to http://localhost:5174/
2. Click "Sign Up" button
3. Enter email: `qa-test-{timestamp}@example.com`
4. Enter password: `TestPass123!`
5. Complete sign-up flow

**Expected Results**:
- ✅ Sign-up form appears
- ✅ Email validation works (shows error for invalid email)
- ✅ Password validation works (shows requirements)
- ✅ Success message appears after sign-up
- ✅ Redirected to organization creation page
- ✅ No console errors

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

**Notes**: _____________

---

### TC-002: Organization Creation
**Priority**: P1 - Critical  
**Estimated Time**: 3 minutes

**Preconditions**: 
- User signed up but no organization created

**Steps**:
1. On "Create Organization" page
2. Enter organization name: "QA Test Organization"
3. Click "Create Organization" button

**Expected Results**:
- ✅ Form accepts organization name
- ✅ Success toast appears: "Organization created successfully"
- ✅ Redirected to Dashboard
- ✅ Organization name appears in header/navigation
- ✅ Dashboard shows empty state (no transactions)
- ✅ Summary shows $0.00 for all values

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

**Notes**: _____________

---

### TC-003: Create First Transaction
**Priority**: P1 - Critical  
**Estimated Time**: 5 minutes

**Preconditions**: 
- User signed in with organization created
- On Dashboard or Transactions page

**Steps**:
1. Click "Add Transaction" button
2. Fill form:
   - Description: "Test Salary"
   - Amount: 5000
   - Type: Income
   - Category: Salary
   - Date: Today
   - Currency: USD
3. Click "Add Transaction"

**Expected Results**:
- ✅ Modal opens with smooth animation
- ✅ All form fields are present and functional
- ✅ Form validation works (try submitting empty form first)
- ✅ Success toast appears: "Transaction added successfully"
- ✅ Modal closes with animation
- ✅ Transaction appears in list immediately
- ✅ Summary updates: Income = $5,000.00, Balance = $5,000.00
- ✅ No page refresh required

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

**Notes**: _____________

---

### TC-004: Edit Transaction
**Priority**: P1 - Critical  
**Estimated Time**: 3 minutes

**Preconditions**: 
- At least one transaction exists

**Steps**:
1. Find "Test Salary" transaction in list
2. Click edit icon (pencil)
3. Change amount to 5500
4. Click save (checkmark icon)

**Expected Results**:
- ✅ Inline edit form appears
- ✅ Current values pre-filled
- ✅ Can modify values
- ✅ Success toast appears: "Transaction updated successfully"
- ✅ Transaction updates in list
- ✅ Summary recalculates: Income = $5,500.00, Balance = $5,500.00
- ✅ No page refresh required

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

**Notes**: _____________

---

### TC-005: Delete Transaction
**Priority**: P1 - Critical  
**Estimated Time**: 3 minutes

**Preconditions**: 
- At least one transaction exists

**Steps**:
1. Find transaction in list
2. Click delete icon (trash)
3. Confirm deletion in dialog

**Expected Results**:
- ✅ Confirmation dialog appears
- ✅ Dialog has "Cancel" and "Delete" buttons
- ✅ Clicking "Cancel" closes dialog without deleting
- ✅ Clicking "Delete" removes transaction
- ✅ Success toast appears: "Transaction deleted successfully"
- ✅ Transaction removed from list
- ✅ Summary recalculates correctly
- ✅ No page refresh required

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

**Notes**: _____________

---

### TC-006: Sign Out and Sign In
**Priority**: P1 - Critical  
**Estimated Time**: 3 minutes

**Preconditions**: 
- User signed in

**Steps**:
1. Click user menu (top right)
2. Click "Sign Out"
3. Verify redirected to sign-in page
4. Sign in with same credentials
5. Verify data persists

**Expected Results**:
- ✅ Sign out successful
- ✅ Redirected to sign-in page
- ✅ Can sign in with same credentials
- ✅ Redirected to Dashboard
- ✅ All previous data still present (transactions, organization)
- ✅ Summary shows correct values

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

**Notes**: _____________

---

## Priority 2: Core Features (Should Pass)

### TC-007: Transaction Filtering by Type
**Priority**: P2 - High  
**Estimated Time**: 5 minutes

**Preconditions**: 
- Multiple transactions exist (both income and expense)

**Test Data**:
- Create 2 income transactions
- Create 3 expense transactions

**Steps**:
1. Go to Transactions page
2. Filter by "Income"
3. Verify only income transactions show
4. Filter by "Expense"
5. Verify only expense transactions show
6. Filter by "All"
7. Verify all transactions show

**Expected Results**:
- ✅ Filter dropdown works
- ✅ Filtering is instant (no page reload)
- ✅ Correct transactions displayed for each filter
- ✅ Transaction count updates
- ✅ Summary recalculates based on filter

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-008: Transaction Search
**Priority**: P2 - High  
**Estimated Time**: 3 minutes

**Preconditions**: 
- Multiple transactions with different descriptions

**Steps**:
1. Go to Transactions page
2. Enter "salary" in search box
3. Verify only matching transactions show
4. Clear search
5. Verify all transactions show again

**Expected Results**:
- ✅ Search is case-insensitive
- ✅ Search filters in real-time (as you type)
- ✅ Correct transactions displayed
- ✅ Clear search button works
- ✅ No console errors

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-009: Transaction Sorting
**Priority**: P2 - High  
**Estimated Time**: 5 minutes

**Preconditions**: 
- Multiple transactions with different dates and amounts

**Steps**:
1. Sort by Date (newest first)
2. Verify order is correct
3. Sort by Date (oldest first)
4. Verify order is correct
5. Sort by Amount (highest first)
6. Verify order is correct
7. Sort by Amount (lowest first)
8. Verify order is correct

**Expected Results**:
- ✅ Sort dropdown works
- ✅ Sorting is instant
- ✅ Correct order for each sort option
- ✅ Sort direction toggle works
- ✅ Visual indicator shows current sort

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-010: Create Recurring Transaction
**Priority**: P2 - High  
**Estimated Time**: 5 minutes

**Preconditions**: 
- User signed in with organization

**Steps**:
1. Navigate to Recurring Transactions page
2. Click "Add Recurring Transaction"
3. Fill form:
   - Description: "Monthly Rent"
   - Amount: 1500
   - Type: Expense
   - Category: Housing
   - Frequency: Monthly
   - Interval: 1
   - Start Date: Today
4. Click "Add Recurring Transaction"

**Expected Results**:
- ✅ Modal opens
- ✅ All fields present and functional
- ✅ Frequency dropdown has options: Daily, Weekly, Monthly, Yearly
- ✅ Success toast appears
- ✅ Recurring transaction appears in list
- ✅ Shows "Active" badge
- ✅ Shows next execution date (1 month from today)
- ✅ Shows frequency and interval

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-011: Toggle Recurring Transaction Active/Inactive
**Priority**: P2 - High  
**Estimated Time**: 3 minutes

**Preconditions**: 
- At least one recurring transaction exists

**Steps**:
1. Find recurring transaction in list
2. Click toggle switch to deactivate
3. Verify status changes to "Inactive"
4. Click toggle switch to activate
5. Verify status changes to "Active"

**Expected Results**:
- ✅ Toggle switch works smoothly
- ✅ Status badge updates immediately
- ✅ Toast notification appears for each toggle
- ✅ Inactive transactions show gray/dimmed
- ✅ Active transactions show normal colors

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-012: Create Budget
**Priority**: P2 - High  
**Estimated Time**: 5 minutes

**Preconditions**: 
- User signed in with organization
- Some expense transactions exist in "Food" category

**Steps**:
1. Navigate to Budgets page
2. Click "Add Budget"
3. Fill form:
   - Category: Food
   - Amount: 500
   - Period: Monthly
   - Currency: USD
   - Start Date: First of current month
4. Click "Add Budget"

**Expected Results**:
- ✅ Modal opens
- ✅ Category dropdown shows all expense categories
- ✅ Period dropdown has Monthly and Yearly options
- ✅ Success toast appears
- ✅ Budget card appears on page
- ✅ Shows progress bar with current spending
- ✅ Shows percentage and remaining amount
- ✅ Shows status indicator (green/amber/red)

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-013: Budget Status Indicators
**Priority**: P2 - High  
**Estimated Time**: 10 minutes

**Preconditions**: 
- Budget created for Food category with $500 limit

**Steps**:
1. Add Food expense for $300 (60% of budget)
2. Verify budget shows green status "On Track"
3. Add Food expense for $150 (90% of budget)
4. Verify budget shows amber status "Warning"
5. Add Food expense for $100 (110% of budget)
6. Verify budget shows red status "Exceeded"

**Expected Results**:
- ✅ Progress bar updates in real-time
- ✅ Green when < 80%
- ✅ Amber when 80-99%
- ✅ Red when ≥ 100%
- ✅ Percentage calculated correctly
- ✅ Remaining amount calculated correctly (can be negative)
- ✅ Visual indicators clear and intuitive

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-014: View Reports and Charts
**Priority**: P2 - High  
**Estimated Time**: 5 minutes

**Preconditions**: 
- Multiple transactions exist across different dates and categories

**Steps**:
1. Navigate to Reports page
2. Verify summary statistics display
3. Verify Spending Trends chart displays
4. Verify Category Breakdown chart displays
5. Hover over chart elements

**Expected Results**:
- ✅ Page loads with skeleton loaders first
- ✅ Summary cards show correct totals
- ✅ Line chart displays with income and expense lines
- ✅ Pie chart displays with category breakdown
- ✅ Tooltips appear on hover
- ✅ Charts are interactive
- ✅ Legend shows correct labels and colors
- ✅ No console errors

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-015: Export Report as PDF
**Priority**: P2 - High  
**Estimated Time**: 3 minutes

**Preconditions**: 
- On Reports page with data

**Steps**:
1. Click "Export PDF" button
2. Wait for PDF generation
3. Open downloaded PDF

**Expected Results**:
- ✅ Button shows loading state during generation
- ✅ PDF downloads automatically
- ✅ PDF contains:
  - Report title and date range
  - Summary statistics
  - Charts (rendered as images)
  - Transaction list
- ✅ PDF is properly formatted
- ✅ Success toast appears

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-016: Invite Team Member
**Priority**: P2 - High  
**Estimated Time**: 5 minutes

**Preconditions**: 
- User is organization owner

**Steps**:
1. Navigate to Team page
2. Click "Invite Member"
3. Fill form:
   - Email: `qa-member@example.com`
   - Role: Member
4. Click "Send Invitation"

**Expected Results**:
- ✅ Modal opens
- ✅ Email validation works
- ✅ Role dropdown has options: Owner, Admin, Member
- ✅ Success toast appears: "Invitation sent successfully"
- ✅ Invitation appears in "Pending Invitations" section
- ✅ Shows email, role, invited date, expires date
- ✅ Email sent (check email if Resend configured)

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

## Priority 3: UI/UX Features (Nice to Have)

### TC-017: Toast Notifications
**Priority**: P3 - Medium  
**Estimated Time**: 5 minutes

**Steps**:
1. Perform various actions that trigger toasts:
   - Add transaction (success)
   - Try to submit invalid form (error)
   - Delete transaction (success)
   - Update settings (info)

**Expected Results**:
- ✅ Toasts appear in top-right corner
- ✅ Success toasts are green with checkmark
- ✅ Error toasts are red with X icon
- ✅ Warning toasts are amber
- ✅ Info toasts are blue
- ✅ Toasts auto-dismiss after 5 seconds
- ✅ Can manually close with X button
- ✅ Multiple toasts stack vertically
- ✅ Smooth slide-in animation

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-018: Skeleton Loaders
**Priority**: P3 - Medium  
**Estimated Time**: 3 minutes

**Steps**:
1. Navigate to Dashboard (clear cache first)
2. Navigate to Transactions page
3. Navigate to Budgets page
4. Navigate to Reports page

**Expected Results**:
- ✅ Skeleton loaders appear during data fetch
- ✅ Skeleton matches layout of actual content
- ✅ Smooth transition from skeleton to content
- ✅ No layout shift or flashing
- ✅ Pulse animation on skeletons

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-019: Modal Animations
**Priority**: P3 - Medium  
**Estimated Time**: 3 minutes

**Steps**:
1. Open any modal (Add Transaction, Add Budget, etc.)
2. Close modal with X button
3. Open modal again
4. Close modal with Cancel button
5. Open modal and close with Escape key

**Expected Results**:
- ✅ Modal fades in with scale animation
- ✅ Modal fades out with scale animation
- ✅ Backdrop fades in/out
- ✅ Animations are smooth (no jank)
- ✅ Escape key closes modal
- ✅ Clicking backdrop closes modal

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-020: Form Validation Real-Time
**Priority**: P3 - Medium  
**Estimated Time**: 5 minutes

**Steps**:
1. Open Add Transaction modal
2. Leave description empty, click in amount field
3. Enter "ab" in description
4. Enter valid description (3+ chars)
5. Enter "0" in amount
6. Enter valid amount
7. Try to submit with errors

**Expected Results**:
- ✅ Error appears when field loses focus (blur)
- ✅ Error message is specific and helpful
- ✅ Red border on invalid fields
- ✅ Green checkmark on valid fields
- ✅ Form shakes when submitted with errors
- ✅ Submit button disabled when form invalid
- ✅ Errors clear when field becomes valid

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-021: Responsive Design - Mobile
**Priority**: P3 - Medium  
**Estimated Time**: 10 minutes

**Steps**:
1. Resize browser to 375px width (iPhone size)
2. Navigate through all pages
3. Test all features on mobile size

**Expected Results**:
- ✅ Layout adapts to mobile width
- ✅ Navigation collapses to hamburger menu
- ✅ Cards stack vertically
- ✅ Tables scroll horizontally or adapt
- ✅ Modals fit on screen
- ✅ Forms are usable
- ✅ Buttons are touch-friendly (44px min)
- ✅ Text is readable (no tiny fonts)
- ✅ No horizontal scroll on pages

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-022: Keyboard Navigation
**Priority**: P3 - Medium  
**Estimated Time**: 5 minutes

**Steps**:
1. Open Add Transaction modal
2. Use Tab key to navigate through fields
3. Use Enter to submit
4. Use Escape to close modal
5. Navigate through page with Tab

**Expected Results**:
- ✅ Tab order is logical
- ✅ All interactive elements are reachable
- ✅ Focus indicator is visible
- ✅ Enter submits forms
- ✅ Escape closes modals
- ✅ No keyboard traps

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

## Priority 4: Performance Tests

### TC-023: Code Splitting Verification
**Priority**: P3 - Medium  
**Estimated Time**: 5 minutes

**Steps**:
1. Open DevTools → Network tab
2. Clear cache
3. Navigate to Dashboard
4. Check loaded chunks
5. Navigate to Transactions
6. Check new chunks loaded
7. Navigate to Reports
8. Check new chunks loaded

**Expected Results**:
- ✅ Only necessary chunks load for each page
- ✅ Vendor chunks cached (304 status on reload)
- ✅ Page chunks are small (< 20 KB gzipped)
- ✅ Initial load < 150 KB gzipped
- ✅ Subsequent page loads are fast

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-024: API Caching
**Priority**: P3 - Medium  
**Estimated Time**: 5 minutes

**Steps**:
1. Open DevTools → Network tab
2. Navigate to Dashboard
3. Note API calls made
4. Refresh page immediately
5. Check if organization API call is cached
6. Wait 5+ minutes
7. Refresh page
8. Check if new API call is made

**Expected Results**:
- ✅ Organization data cached for 5 minutes
- ✅ No duplicate API calls within cache period
- ✅ Cache expires after TTL
- ✅ Cache invalidated after mutations
- ✅ Faster page loads with cache

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

## Browser Compatibility Tests

### TC-025: Chrome Compatibility
**Browser**: Chrome (latest)  
**Priority**: P2 - High

**Steps**: Run TC-001 through TC-016 in Chrome

**Expected Results**:
- ✅ All features work correctly
- ✅ No console errors
- ✅ Animations smooth
- ✅ UI renders correctly

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-026: Firefox Compatibility
**Browser**: Firefox (latest)  
**Priority**: P2 - High

**Steps**: Run TC-001 through TC-016 in Firefox

**Expected Results**:
- ✅ All features work correctly
- ✅ No console errors
- ✅ Animations smooth
- ✅ UI renders correctly

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-027: Safari Compatibility
**Browser**: Safari (latest)  
**Priority**: P2 - High

**Steps**: Run TC-001 through TC-016 in Safari

**Expected Results**:
- ✅ All features work correctly
- ✅ No console errors
- ✅ Animations smooth
- ✅ UI renders correctly

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

### TC-028: Edge Compatibility
**Browser**: Edge (latest)  
**Priority**: P3 - Medium

**Steps**: Run TC-001 through TC-016 in Edge

**Expected Results**:
- ✅ All features work correctly
- ✅ No console errors
- ✅ Animations smooth
- ✅ UI renders correctly

**Actual Results**: _____________

**Status**: ⬜ Pass ⬜ Fail ⬜ Blocked

---

## Test Execution Summary

**Test Date**: ___________  
**Tester Name**: ___________  
**Environment**: ___________  
**Build Version**: 1.0.0

### Results by Priority

| Priority | Total | Passed | Failed | Blocked | Pass Rate |
|----------|-------|--------|--------|---------|-----------|
| P1 (Critical) | 6 | ___ | ___ | ___ | ___% |
| P2 (High) | 10 | ___ | ___ | ___ | ___% |
| P3 (Medium) | 12 | ___ | ___ | ___ | ___% |
| **Total** | **28** | ___ | ___ | ___ | ___% |

### Critical Issues (Blockers)
1. 
2. 
3. 

### High Priority Issues
1. 
2. 
3. 

### Medium Priority Issues
1. 
2. 
3. 

### Low Priority Issues / Enhancements
1. 
2. 
3. 

---

## Sign-Off

**QA Lead**: ___________  
**Date**: ___________  
**Recommendation**: ⬜ Approve for Production ⬜ Needs Fixes ⬜ Reject

**Comments**: 
_____________________________________________
_____________________________________________
_____________________________________________
