# Finance Tracker - End-to-End Testing Checklist

## Testing Environment
- **Dev Server**: http://localhost:5174/
- **Browser**: Chrome/Firefox/Safari/Edge
- **Test Date**: 2026-04-07

---

## 1. Authentication & Onboarding

### Sign Up Flow
- [ ] Navigate to http://localhost:5174/
- [ ] Click "Sign Up" or see Clerk sign-up form
- [ ] Create new account with email/password
- [ ] Verify email if required
- [ ] Redirected to organization creation page
- [ ] See "Create Organization" form

### Organization Creation
- [ ] Enter organization name (e.g., "Test Finances")
- [ ] Click "Create Organization"
- [ ] See success toast notification
- [ ] Redirected to Dashboard
- [ ] Organization name appears in header

### Sign In Flow
- [ ] Sign out from user menu
- [ ] Navigate to http://localhost:5174/
- [ ] Click "Sign In"
- [ ] Enter credentials
- [ ] Successfully redirected to Dashboard
- [ ] User data persists

---

## 2. Dashboard

### Initial Load
- [ ] Dashboard loads with skeleton loaders
- [ ] Skeleton loaders disappear after data loads
- [ ] Summary cards display (Income, Expenses, Balance)
- [ ] All values show $0.00 initially
- [ ] Recent transactions section shows empty state
- [ ] Charts show "No data available" message

### Navigation
- [ ] All navigation links work (Dashboard, Transactions, Recurring, Budgets, Reports, Team, Settings)
- [ ] Active page is highlighted in navigation
- [ ] User menu opens on click
- [ ] Sign out option works

---

## 3. Transactions

### Create Transaction
- [ ] Navigate to Transactions page
- [ ] Click "Add Transaction" button
- [ ] Modal opens with fade/scale animation
- [ ] Form shows all fields: Description, Amount, Type, Category, Date, Currency

### Form Validation (Real-time)
- [ ] Leave description empty, blur field → see error "Description is required"
- [ ] Enter "ab" in description → see error "Description must be at least 3 characters"
- [ ] Enter valid description → see green checkmark
- [ ] Leave amount empty → see error "Amount is required"
- [ ] Enter "0" or negative amount → see error "Amount must be greater than 0"
- [ ] Enter valid amount → see green checkmark
- [ ] Try to submit with errors → form shakes, errors persist
- [ ] Fill all fields correctly → submit button enabled

### Create Transaction Success
- [ ] Fill form: "Grocery shopping", $125.50, Expense, Food, Today, USD
- [ ] Click "Add Transaction"
- [ ] See success toast: "Transaction added successfully"
- [ ] Modal closes with animation
- [ ] Transaction appears in list immediately
- [ ] Summary updates (Expenses: $125.50, Balance: -$125.50)

### Create Multiple Transactions
- [ ] Add income: "Salary", $5000, Income, Salary, Today, USD
- [ ] Add expense: "Rent", $1500, Expense, Housing, Today, USD
- [ ] Add expense: "Gas", $60, Expense, Transportation, Today, USD
- [ ] Verify all transactions appear in list
- [ ] Verify summary: Income: $5000, Expenses: $1685.50, Balance: $3314.50

### Edit Transaction
- [ ] Click edit icon on "Grocery shopping" transaction
- [ ] Inline edit form appears
- [ ] Change amount to $150.00
- [ ] Click save (checkmark icon)
- [ ] See success toast: "Transaction updated successfully"
- [ ] Transaction updates in list
- [ ] Summary recalculates (Expenses: $1710.50, Balance: $3289.50)
- [ ] Click cancel (X icon) on another edit → form closes without saving

### Delete Transaction
- [ ] Click delete icon on "Gas" transaction
- [ ] See confirmation dialog
- [ ] Click "Cancel" → transaction remains
- [ ] Click delete again, click "Delete" → transaction removed
- [ ] See success toast: "Transaction deleted successfully"
- [ ] Summary recalculates (Expenses: $1650.50, Balance: $3349.50)

### Filtering
- [ ] Filter by type: "Income" → only salary shows
- [ ] Filter by type: "Expense" → only expenses show
- [ ] Filter by type: "All" → all transactions show
- [ ] Filter by category: "Food" → only grocery shopping shows
- [ ] Clear category filter → all transactions show
- [ ] Search: "sal" → only salary shows
- [ ] Clear search → all transactions show

### Sorting
- [ ] Sort by date (newest first) → verify order
- [ ] Sort by date (oldest first) → verify order
- [ ] Sort by amount (highest first) → verify order
- [ ] Sort by amount (lowest first) → verify order
- [ ] Sort by description (A-Z) → verify order
- [ ] Sort by description (Z-A) → verify order

### Date Range Filter
- [ ] Set start date to yesterday → transactions from yesterday onwards show
- [ ] Set end date to tomorrow → transactions up to tomorrow show
- [ ] Clear date filters → all transactions show

### Multi-Currency
- [ ] Add transaction in EUR: "Paris trip", €200, Expense, Travel, Today, EUR
- [ ] Verify transaction shows in EUR
- [ ] Verify summary converts to USD (using exchange rate)
- [ ] Click "Refresh Rates" button
- [ ] See success toast: "Exchange rates updated"
- [ ] Verify summary recalculates

### Clear All
- [ ] Click "Clear All" button
- [ ] See confirmation dialog
- [ ] Click "Cancel" → transactions remain
- [ ] Click "Clear All" again, click "Delete All"
- [ ] See success toast: "All transactions deleted"
- [ ] Transaction list shows empty state
- [ ] Summary shows all zeros

---

## 4. Recurring Transactions

### Create Recurring Transaction
- [ ] Navigate to Recurring Transactions page
- [ ] Click "Add Recurring Transaction"
- [ ] Modal opens with animation
- [ ] Fill form: "Monthly rent", $1500, Expense, Housing, Monthly, Interval: 1
- [ ] Set start date to today
- [ ] Leave end date empty (no end)
- [ ] Click "Add Recurring Transaction"
- [ ] See success toast
- [ ] Recurring transaction appears in list
- [ ] Shows "Active" badge
- [ ] Shows next execution date (1 month from today)

### Create Multiple Recurring
- [ ] Add: "Weekly groceries", $100, Expense, Food, Weekly, Interval: 1
- [ ] Add: "Bi-weekly salary", $2500, Income, Salary, Weekly, Interval: 2
- [ ] Add: "Annual insurance", $1200, Expense, Insurance, Yearly, Interval: 1
- [ ] Verify all appear in list with correct frequencies

### Toggle Active/Inactive
- [ ] Click toggle switch on "Weekly groceries"
- [ ] See "Inactive" badge
- [ ] See info toast: "Recurring transaction deactivated"
- [ ] Click toggle again
- [ ] See "Active" badge
- [ ] See success toast: "Recurring transaction activated"

### Edit Recurring Transaction
- [ ] Click edit icon on "Monthly rent"
- [ ] Modal opens with current values
- [ ] Change amount to $1600
- [ ] Click "Update Recurring Transaction"
- [ ] See success toast
- [ ] Verify amount updated in list

### Delete Recurring Transaction
- [ ] Click delete icon on "Annual insurance"
- [ ] See confirmation dialog
- [ ] Click "Delete"
- [ ] See success toast
- [ ] Recurring transaction removed from list

### Verify Automatic Processing
- [ ] Note: Automatic processing runs via cron job on backend
- [ ] Check that next_execution_date is set correctly
- [ ] Verify active recurring transactions have future dates

---

## 5. Budgets

### Create Budget
- [ ] Navigate to Budgets page
- [ ] Click "Add Budget"
- [ ] Modal opens with animation
- [ ] Fill form: Category: Food, Amount: $500, Period: Monthly, Currency: USD
- [ ] Set start date to first of current month
- [ ] Leave end date empty
- [ ] Click "Add Budget"
- [ ] See success toast
- [ ] Budget card appears

### Budget Status Indicators
- [ ] Verify budget shows spending progress bar
- [ ] If spending < 80%: green progress bar, "On Track" status
- [ ] Add transactions to reach 80-99%: amber progress bar, "Warning" status
- [ ] Add transactions to exceed 100%: red progress bar, "Exceeded" status
- [ ] Verify percentage and remaining amount are correct

### Create Multiple Budgets
- [ ] Add: Housing, $2000, Monthly
- [ ] Add: Transportation, $300, Monthly
- [ ] Add: Entertainment, $200, Monthly
- [ ] Verify all budget cards display correctly
- [ ] Verify each shows correct spending for its category

### Edit Budget
- [ ] Click edit icon on Food budget
- [ ] Modal opens with current values
- [ ] Change amount to $600
- [ ] Click "Update Budget"
- [ ] See success toast
- [ ] Verify budget card updates
- [ ] Verify progress bar recalculates

### Delete Budget
- [ ] Click delete icon on Entertainment budget
- [ ] See confirmation dialog
- [ ] Click "Delete"
- [ ] See success toast
- [ ] Budget card removed

### Budget Alerts
- [ ] Add transactions to push a budget to 80%
- [ ] Verify warning status appears
- [ ] Add more transactions to exceed 100%
- [ ] Verify exceeded status appears
- [ ] Check that visual indicators are clear (colors, icons)

---

## 6. Reports & Analytics

### Navigate to Reports
- [ ] Navigate to Reports page
- [ ] Page loads with skeleton loaders
- [ ] Charts appear after data loads

### Summary Statistics
- [ ] Verify summary cards show correct totals
- [ ] Total Income matches transaction sum
- [ ] Total Expenses matches transaction sum
- [ ] Net Savings = Income - Expenses
- [ ] Average Transaction calculated correctly

### Spending Trends Chart
- [ ] Line chart displays with income and expense lines
- [ ] Hover over data points → tooltip shows date and amount
- [ ] Chart shows data for selected period
- [ ] Legend shows Income (green) and Expenses (red)

### Category Breakdown Chart
- [ ] Pie chart displays expense categories
- [ ] Each slice has different color
- [ ] Hover over slice → tooltip shows category and amount
- [ ] Legend shows all categories with percentages
- [ ] Only expense categories shown (not income)

### Period Selection
- [ ] Select "Last 7 Days" → charts update
- [ ] Select "Last 30 Days" → charts update
- [ ] Select "Last 90 Days" → charts update
- [ ] Select "This Year" → charts update
- [ ] Select "Custom Range" → date pickers appear
- [ ] Set custom date range → charts update

### Period Comparison
- [ ] Enable "Compare with previous period" toggle
- [ ] Verify comparison data appears
- [ ] Verify percentage change indicators (↑ increase, ↓ decrease)
- [ ] Verify comparison makes sense (e.g., this month vs last month)

### Export PDF
- [ ] Click "Export PDF" button
- [ ] See loading state on button
- [ ] PDF downloads automatically
- [ ] Open PDF → verify it contains:
  - Report title and date range
  - Summary statistics
  - Charts (spending trends, category breakdown)
  - Transaction list
  - Proper formatting and layout

### Export CSV
- [ ] Click "Export CSV" button
- [ ] CSV downloads automatically
- [ ] Open CSV in Excel/Sheets → verify it contains:
  - All transaction data
  - Columns: Date, Description, Amount, Type, Category, Currency
  - Proper formatting (dates, numbers)

---

## 7. Team Collaboration

### View Team Members
- [ ] Navigate to Team page
- [ ] See current user as "Owner"
- [ ] See member list with roles
- [ ] See "Invite Member" button

### Invite Member
- [ ] Click "Invite Member"
- [ ] Modal opens
- [ ] Enter email: "test@example.com"
- [ ] Select role: "Member"
- [ ] Click "Send Invitation"
- [ ] See success toast: "Invitation sent successfully"
- [ ] Invitation appears in "Pending Invitations" section
- [ ] Shows email, role, invited date, expires date

### Invite with Different Roles
- [ ] Invite "admin@example.com" as "Admin"
- [ ] Invite "viewer@example.com" as "Member"
- [ ] Verify all invitations appear in pending list

### Revoke Invitation
- [ ] Click "Revoke" on one invitation
- [ ] See confirmation dialog
- [ ] Click "Revoke"
- [ ] See success toast
- [ ] Invitation removed from list

### Accept Invitation (requires second account)
- [ ] Open invitation email (if Resend is configured)
- [ ] Click invitation link
- [ ] Sign in with invited account
- [ ] See "Accept Invitation" page
- [ ] Click "Accept"
- [ ] See success toast
- [ ] Redirected to dashboard
- [ ] Can see organization data

### Change Member Role (as Owner)
- [ ] Find a member in the list
- [ ] Click "Change Role" dropdown
- [ ] Select new role (e.g., Admin → Member)
- [ ] See success toast
- [ ] Verify role updated in list

### Remove Member (as Owner)
- [ ] Click "Remove" on a member
- [ ] See confirmation dialog
- [ ] Click "Remove"
- [ ] See success toast
- [ ] Member removed from list

### Real-Time Updates
- [ ] Open app in two browser windows (same account)
- [ ] Add transaction in Window 1
- [ ] Verify transaction appears in Window 2 (within 30 seconds)
- [ ] Check for "Live" indicator in header (green dot)
- [ ] If WebSocket fails, should fall back to polling

---

## 8. Settings

### Profile Settings
- [ ] Navigate to Settings page
- [ ] See user profile information (from Clerk)
- [ ] Name, email, profile picture display correctly

### Preferences
- [ ] See default currency setting (USD)
- [ ] Change to EUR
- [ ] See success toast
- [ ] Verify new transactions default to EUR
- [ ] Change back to USD

### Danger Zone
- [ ] See "Delete All Data" button
- [ ] Click button
- [ ] See confirmation dialog with warning
- [ ] Click "Cancel" → nothing happens
- [ ] Click "Delete All Data" again
- [ ] Type confirmation text
- [ ] Click "Delete All Data"
- [ ] See success toast
- [ ] All transactions, budgets, recurring transactions deleted
- [ ] Dashboard shows empty state

---

## 9. Performance Features

### Code Splitting
- [ ] Open browser DevTools → Network tab
- [ ] Navigate to Dashboard
- [ ] Verify only Dashboard chunk loads (not all pages)
- [ ] Navigate to Transactions
- [ ] Verify Transactions chunk loads separately
- [ ] Navigate to Reports
- [ ] Verify Reports chunk loads separately
- [ ] Check that vendor chunks are cached (304 status)

### API Caching
- [ ] Open browser DevTools → Network tab
- [ ] Refresh Dashboard
- [ ] Note API calls made
- [ ] Refresh again immediately
- [ ] Verify organization API call is cached (no new request)
- [ ] Wait 5+ minutes, refresh
- [ ] Verify cache expired, new API call made

### Loading States
- [ ] Navigate to each page
- [ ] Verify skeleton loaders appear during data fetch
- [ ] Verify smooth transition from skeleton to content
- [ ] No layout shift or flashing

### Animations
- [ ] Open any modal → verify fade and scale-in animation
- [ ] Close modal → verify fade and scale-out animation
- [ ] Submit form with errors → verify shake animation
- [ ] Hover over buttons → verify smooth hover effects
- [ ] All animations feel smooth (no jank)

---

## 10. UI/UX Features

### Toast Notifications
- [ ] Perform various actions (add, edit, delete)
- [ ] Verify toast appears in top-right corner
- [ ] Success toasts are green with checkmark icon
- [ ] Error toasts are red with X icon
- [ ] Warning toasts are amber with warning icon
- [ ] Info toasts are blue with info icon
- [ ] Toasts auto-dismiss after 5 seconds
- [ ] Can manually close toast with X button
- [ ] Multiple toasts stack vertically

### Form Validation
- [ ] Try to submit forms with invalid data
- [ ] Verify inline error messages appear
- [ ] Verify error messages are specific and helpful
- [ ] Verify green checkmarks appear for valid fields
- [ ] Verify red borders appear for invalid fields
- [ ] Verify form shakes on submit with errors

### Responsive Design
- [ ] Resize browser to mobile width (375px)
- [ ] Verify layout adapts (navigation collapses, cards stack)
- [ ] Verify all features work on mobile
- [ ] Test on tablet width (768px)
- [ ] Test on desktop width (1024px+)

### Accessibility
- [ ] Tab through forms → verify logical tab order
- [ ] Verify all interactive elements are keyboard accessible
- [ ] Verify ARIA labels are present
- [ ] Verify color contrast is sufficient
- [ ] Test with screen reader (if available)

---

## 11. Error Handling

### Network Errors
- [ ] Disconnect internet
- [ ] Try to add transaction
- [ ] Verify error toast appears
- [ ] Verify helpful error message
- [ ] Reconnect internet
- [ ] Retry action → should succeed

### Authentication Errors
- [ ] Sign out
- [ ] Try to access protected route directly
- [ ] Verify redirected to sign-in
- [ ] Sign in → redirected back to intended page

### Validation Errors
- [ ] Try to create transaction with invalid data
- [ ] Verify validation errors prevent submission
- [ ] Verify error messages guide user to fix issues

### Server Errors
- [ ] Stop backend server (if testing locally)
- [ ] Try to perform actions
- [ ] Verify error toasts appear
- [ ] Verify app doesn't crash
- [ ] Restart server → app recovers

---

## 12. Browser Compatibility

### Chrome
- [ ] Test all features in Chrome
- [ ] Verify no console errors
- [ ] Verify all animations work

### Firefox
- [ ] Test all features in Firefox
- [ ] Verify no console errors
- [ ] Verify all animations work

### Safari
- [ ] Test all features in Safari
- [ ] Verify no console errors
- [ ] Verify all animations work

### Edge
- [ ] Test all features in Edge
- [ ] Verify no console errors
- [ ] Verify all animations work

---

## 13. Data Integrity

### Transaction Calculations
- [ ] Add multiple transactions
- [ ] Manually calculate expected totals
- [ ] Verify Summary matches manual calculation
- [ ] Verify no rounding errors
- [ ] Verify currency conversion is accurate

### Budget Calculations
- [ ] Create budget with specific amount
- [ ] Add transactions in that category
- [ ] Manually calculate expected spending
- [ ] Verify budget progress matches manual calculation
- [ ] Verify percentage is accurate

### Date Handling
- [ ] Create transactions with various dates
- [ ] Verify dates display correctly
- [ ] Verify date filtering works correctly
- [ ] Verify date sorting works correctly
- [ ] Test edge cases (leap year, month boundaries)

---

## 14. Security

### Authentication
- [ ] Verify can't access app without signing in
- [ ] Verify session persists across page refreshes
- [ ] Verify sign out clears session
- [ ] Verify can't access other users' data

### Authorization
- [ ] As Member, verify can't delete all transactions
- [ ] As Member, verify can't remove other members
- [ ] As Admin, verify can manage transactions and budgets
- [ ] As Owner, verify can manage members

### Data Privacy
- [ ] Verify RLS policies prevent unauthorized access
- [ ] Verify API requires authentication
- [ ] Verify sensitive data not exposed in client

---

## Test Results Summary

**Date**: ___________  
**Tester**: ___________  
**Browser**: ___________  
**Environment**: ___________

**Total Tests**: ___________  
**Passed**: ___________  
**Failed**: ___________  
**Blocked**: ___________

### Critical Issues Found
1. 
2. 
3. 

### Minor Issues Found
1. 
2. 
3. 

### Notes
