# QA Testing Session - Live Guide

**Session Started**: 2026-04-07  
**Environment**: ✅ Verified and Ready  
**Your Mission**: Test the 6 critical Priority 1 features (30 minutes)

---

## ✅ Step 1: Environment Check (COMPLETE)

- ✅ Frontend running: http://localhost:5174/
- ✅ Backend running: http://localhost:3001/
- ✅ Backend health check: OK

**You're ready to start testing!**

---

## 🎯 Step 2: Your First Test - User Sign Up (5 minutes)

### What You'll Do
Create a new user account and verify the sign-up flow works correctly.

### Instructions

1. **Open your browser** (Chrome recommended)
   - Navigate to: http://localhost:5174/

2. **You should see:**
   - Finance Tracker login/sign-up page
   - Clerk authentication form
   - "Sign Up" or "Sign In" options

3. **Click "Sign Up"** (or the sign-up option)

4. **Create test account:**
   - Email: `qa-test-[YOUR-NAME]@example.com`
   - Password: `TestPass123!`
   - Complete any additional fields

5. **What to check:**
   - [ ] Sign-up form appears correctly
   - [ ] Email validation works (try invalid email first)
   - [ ] Password validation works (shows requirements)
   - [ ] Form is user-friendly
   - [ ] No console errors (press F12 → Console tab)

6. **Expected result:**
   - ✅ Account created successfully
   - ✅ Redirected to "Create Organization" page
   - ✅ No errors in console

### 📝 Document Your Results

**Did the test pass?** ⬜ Yes ⬜ No

**If NO, what went wrong?**
_____________________________________________

**Console errors (if any):**
_____________________________________________

**Screenshots taken:** ⬜ Yes ⬜ No

---

## 🎯 Step 3: Create Organization (3 minutes)

### What You'll Do
Set up your first organization (required for using the app).

### Instructions

1. **You should now see:** "Create Organization" page

2. **Enter organization name:**
   - Name: `QA Test Organization`

3. **Click "Create Organization"**

4. **What to check:**
   - [ ] Form accepts organization name
   - [ ] Success toast notification appears (top-right corner)
   - [ ] Redirected to Dashboard
   - [ ] Organization name appears in header/navigation
   - [ ] Dashboard shows empty state (no transactions yet)
   - [ ] Summary shows $0.00 for Income, Expenses, Balance

5. **Expected result:**
   - ✅ Organization created
   - ✅ Dashboard loads with empty state
   - ✅ Summary cards show zeros
   - ✅ No errors

### 📝 Document Your Results

**Did the test pass?** ⬜ Yes ⬜ No

**If NO, what went wrong?**
_____________________________________________

**Toast notification appeared?** ⬜ Yes ⬜ No

---

## 🎯 Step 4: Create Your First Transaction (5 minutes)

### What You'll Do
Add an income transaction and verify it appears correctly.

### Instructions

1. **Navigate to Transactions page** (click "Transactions" in sidebar)

2. **Click "Add Transaction" button**

3. **Modal should open** with smooth animation

4. **Fill in the form:**
   - Description: `Test Salary`
   - Amount: `5000`
   - Type: `Income`
   - Category: `Salary`
   - Date: Today's date (should be pre-filled)
   - Currency: `USD`

5. **Before submitting, test validation:**
   - Clear description field → should show error
   - Enter "ab" → should show "must be at least 3 characters"
   - Enter valid description → should show green checkmark
   - Try amount "0" → should show error
   - Enter valid amount → should show green checkmark

6. **Click "Add Transaction"**

7. **What to check:**
   - [ ] Modal opens with animation
   - [ ] All form fields present
   - [ ] Real-time validation works
   - [ ] Success toast appears: "Transaction added successfully"
   - [ ] Modal closes with animation
   - [ ] Transaction appears in list immediately
   - [ ] Summary updates: Income = $5,000.00, Balance = $5,000.00
   - [ ] No page refresh required

8. **Expected result:**
   - ✅ Transaction created
   - ✅ Appears in list
   - ✅ Summary updated correctly
   - ✅ Smooth animations

### 📝 Document Your Results

**Did the test pass?** ⬜ Yes ⬜ No

**Form validation working?** ⬜ Yes ⬜ No

**Summary updated correctly?** ⬜ Yes ⬜ No

**Issues found:**
_____________________________________________

---

## 🎯 Step 5: Edit Transaction (3 minutes)

### What You'll Do
Modify the transaction you just created.

### Instructions

1. **Find "Test Salary" transaction** in the list

2. **Click the edit icon** (pencil icon)

3. **Inline edit form should appear**

4. **Change the amount:**
   - New amount: `5500`

5. **Click save** (checkmark icon)

6. **What to check:**
   - [ ] Inline edit form appears
   - [ ] Current values are pre-filled
   - [ ] Can modify values
   - [ ] Success toast appears: "Transaction updated successfully"
   - [ ] Transaction updates in list (shows $5,500)
   - [ ] Summary recalculates: Income = $5,500.00, Balance = $5,500.00
   - [ ] No page refresh required

7. **Test cancel:**
   - Click edit on another transaction (or same one)
   - Click cancel (X icon)
   - Form should close without saving

8. **Expected result:**
   - ✅ Edit works correctly
   - ✅ Summary recalculates
   - ✅ Cancel works
   - ✅ No errors

### 📝 Document Your Results

**Did the test pass?** ⬜ Yes ⬜ No

**Summary recalculated?** ⬜ Yes ⬜ No

**Cancel button works?** ⬜ Yes ⬜ No

---

## 🎯 Step 6: Delete Transaction (3 minutes)

### What You'll Do
Delete a transaction and verify it's removed.

### Instructions

1. **First, add another transaction** to have something to delete:
   - Description: `Test Expense`
   - Amount: `100`
   - Type: `Expense`
   - Category: `Food`

2. **Find "Test Expense" transaction** in the list

3. **Click the delete icon** (trash icon)

4. **Confirmation dialog should appear**

5. **Test cancel first:**
   - Click "Cancel"
   - Dialog closes, transaction remains

6. **Click delete icon again**

7. **Click "Delete" in confirmation dialog**

8. **What to check:**
   - [ ] Confirmation dialog appears
   - [ ] Dialog has "Cancel" and "Delete" buttons
   - [ ] Cancel works (transaction remains)
   - [ ] Delete works (transaction removed)
   - [ ] Success toast appears: "Transaction deleted successfully"
   - [ ] Transaction removed from list
   - [ ] Summary recalculates correctly
   - [ ] No page refresh required

9. **Expected result:**
   - ✅ Delete confirmation works
   - ✅ Transaction removed
   - ✅ Summary updated
   - ✅ No errors

### 📝 Document Your Results

**Did the test pass?** ⬜ Yes ⬜ No

**Confirmation dialog works?** ⬜ Yes ⬜ No

**Summary updated?** ⬜ Yes ⬜ No

---

## 🎯 Step 7: Sign Out and Sign In (3 minutes)

### What You'll Do
Verify data persists across sessions.

### Instructions

1. **Note your current data:**
   - How many transactions you have
   - What the summary shows

2. **Click user menu** (top-right corner, your profile/avatar)

3. **Click "Sign Out"**

4. **What to check:**
   - [ ] Sign out successful
   - [ ] Redirected to sign-in page
   - [ ] No errors

5. **Sign in again:**
   - Use same credentials: `qa-test-[YOUR-NAME]@example.com`
   - Password: `TestPass123!`

6. **After sign-in, verify:**
   - [ ] Redirected to Dashboard
   - [ ] All transactions still present
   - [ ] Summary shows correct values
   - [ ] Organization name still appears
   - [ ] No data lost

7. **Expected result:**
   - ✅ Sign out works
   - ✅ Sign in works
   - ✅ Data persists
   - ✅ No data loss

### 📝 Document Your Results

**Did the test pass?** ⬜ Yes ⬜ No

**Data persisted?** ⬜ Yes ⬜ No

**All transactions present?** ⬜ Yes ⬜ No

---

## 🎉 Congratulations! Priority 1 Tests Complete

You've just completed the 6 most critical tests. These verify the core functionality works.

### Your Results Summary

**Tests Completed:** 6/6  
**Tests Passed:** ___/6  
**Tests Failed:** ___/6  
**Bugs Found:** ___

### Quick Assessment

**If all 6 tests passed:**
- ✅ Core functionality is working
- ✅ Ready to continue with Priority 2 tests
- ✅ Application is stable

**If any tests failed:**
- ⚠️ Document the failures in BUG_REPORT_TEMPLATE.md
- ⚠️ Note severity (Critical if P1 test failed)
- ⚠️ Share with development team

---

## 🚀 What's Next?

### Option 1: Continue Testing (Recommended)
Continue with Priority 2 tests in **QA_TEST_PLAN.md**:
- TC-007: Transaction Filtering
- TC-008: Transaction Search
- TC-009: Transaction Sorting
- TC-010: Recurring Transactions
- TC-011: Budgets
- And more...

### Option 2: Take a Break
- Save your progress in **TEST_EXECUTION_TRACKER.md**
- Document any bugs found
- Resume testing later

### Option 3: Report Issues
If you found bugs:
1. Copy **BUG_REPORT_TEMPLATE.md**
2. Fill in details for each bug
3. Attach screenshots
4. Share with development team

---

## 📊 Testing Tips

### What to Watch For
- ⚠️ Console errors (F12 → Console)
- ⚠️ Network errors (F12 → Network)
- ⚠️ Slow loading (> 3 seconds)
- ⚠️ UI breaking on resize
- ⚠️ Incorrect calculations
- ⚠️ Missing toast notifications

### Browser DevTools Shortcuts
- `F12` - Open DevTools
- `Ctrl+Shift+C` - Inspect element
- `Ctrl+Shift+M` - Mobile view
- `F5` - Refresh page
- `Ctrl+Shift+R` - Hard refresh (clear cache)

### Common Issues
If something doesn't work:
1. Check browser console for errors
2. Try refreshing the page
3. Clear browser cache
4. Try different browser
5. Verify servers are still running

---

## 📝 Next Steps Checklist

- [ ] Document results in TEST_EXECUTION_TRACKER.md
- [ ] Report any bugs using BUG_REPORT_TEMPLATE.md
- [ ] Take screenshots of issues
- [ ] Continue with Priority 2 tests (if P1 passed)
- [ ] Or fix bugs and re-test

---

## 🆘 Need Help?

**Questions about features?**
- Check USER_GUIDE.md

**Technical issues?**
- Check console for errors
- Verify servers running
- Try different browser

**Unclear test steps?**
- Document your interpretation
- Proceed with best judgment
- Note in results

---

**Great job starting the QA process!** 🎯

Your testing helps ensure Finance Tracker is production-ready.

---

**Session Guide Version**: 1.0.0  
**Created**: 2026-04-07  
**Status**: Ready for Testing
