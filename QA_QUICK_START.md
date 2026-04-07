# QA Team Quick Start Guide

**Welcome to Finance Tracker QA Testing!**

This guide will help you get started with manual testing in under 10 minutes.

---

## 1. Prerequisites Check ✅

Before you begin, verify you have:

- [ ] Modern web browser (Chrome, Firefox, Safari, or Edge)
- [ ] Access to this repository
- [ ] Test account credentials (or ability to create new accounts)
- [ ] 2-3 hours for complete testing
- [ ] Screen recording tool (optional but recommended)

---

## 2. Environment Setup (5 minutes)

### Verify Servers Are Running

**Frontend**: http://localhost:5174/  
**Backend**: http://localhost:3001/

Open both URLs in your browser:
- Frontend should show the Finance Tracker login page
- Backend should show: `{"status":"ok","timestamp":"..."}`

If servers are not running, contact the development team.

---

## 3. Testing Documentation Overview

You have 6 key documents to guide your testing:

### 📋 Primary Testing Documents

1. **QA_TEST_PLAN.md** ⭐ START HERE
   - 28 detailed test cases with step-by-step instructions
   - Expected results for each test
   - Organized by priority (P1, P2, P3)
   - Estimated time for each test

2. **TESTING_CHECKLIST.md**
   - Comprehensive 200+ test cases
   - Covers all features in detail
   - Use for thorough testing after QA_TEST_PLAN

3. **TEST_EXECUTION_TRACKER.md**
   - Track your daily progress
   - Log bugs found
   - Monitor test coverage
   - Record time spent

### 📝 Support Documents

4. **BUG_REPORT_TEMPLATE.md**
   - Use this to report any bugs you find
   - Includes example bug report
   - Structured format for consistency

5. **TEST_REPORT.md**
   - Automated test results (already completed)
   - Shows what's been verified automatically
   - Reference for known issues

6. **test-api.js**
   - Automated API testing script
   - Run with: `node test-api.js`
   - Verifies backend is working

---

## 4. Quick Start Testing (30 minutes)

### Step 1: Run Priority 1 Tests (Critical Path)

Open **QA_TEST_PLAN.md** and execute these 6 tests in order:

1. **TC-001**: User Sign Up (5 min)
2. **TC-002**: Organization Creation (3 min)
3. **TC-003**: Create First Transaction (5 min)
4. **TC-004**: Edit Transaction (3 min)
5. **TC-005**: Delete Transaction (3 min)
6. **TC-006**: Sign Out and Sign In (3 min)

**Total Time**: ~22 minutes

These tests verify the core functionality works. If any fail, report immediately as P1 bugs.

### Step 2: Document Your Results

As you test, fill in **TEST_EXECUTION_TRACKER.md**:
- Mark tests as Pass/Fail
- Log any bugs found
- Note any blockers

### Step 3: Report Bugs

If you find a bug:
1. Copy **BUG_REPORT_TEMPLATE.md**
2. Save as `BUG-001-description.md`
3. Fill in all sections
4. Attach screenshots
5. Share with development team

---

## 5. Full Testing (2-3 hours)

After completing Priority 1 tests, continue with:

### Priority 2 Tests (High Priority)
- TC-007 through TC-016
- Core features: Filtering, Sorting, Recurring, Budgets, Reports, Team
- **Time**: ~60 minutes

### Priority 3 Tests (Medium Priority)
- TC-017 through TC-024
- UI/UX features: Toasts, Animations, Responsive Design, Performance
- **Time**: ~45 minutes

### Browser Compatibility Tests
- TC-025 through TC-028
- Test in Chrome, Firefox, Safari, Edge
- **Time**: ~30 minutes per browser

---

## 6. Test Account Setup

### Create Your Test Account

1. Go to http://localhost:5174/
2. Click "Sign Up"
3. Use email: `qa-tester-{yourname}@example.com`
4. Password: `TestPass123!`
5. Create organization: "QA Test Organization"

### Test Data to Create

For comprehensive testing, create:

**Transactions**:
- Income: "Test Salary" - $5,000 (Salary)
- Expense: "Monthly Rent" - $1,500 (Housing)
- Expense: "Grocery Shopping" - $300 (Food)
- Expense: "Gas" - $60 (Transportation)

**Recurring Transactions**:
- "Monthly Rent" - $1,500 (Monthly, Housing)
- "Weekly Groceries" - $100 (Weekly, Food)

**Budgets**:
- Food: $500/month
- Housing: $2,000/month
- Transportation: $300/month

---

## 7. Testing Tips

### Do's ✅
- Test one feature at a time
- Document everything (screenshots, steps, results)
- Try to break things (edge cases, invalid input)
- Test on different browsers
- Test responsive design (resize browser)
- Use keyboard navigation
- Check console for errors (F12 → Console tab)

### Don'ts ❌
- Don't skip Priority 1 tests
- Don't test without documenting
- Don't assume something works because it looks right
- Don't test with production data
- Don't report bugs without reproduction steps

### Common Issues to Watch For
- ⚠️ Summary not updating after transaction changes
- ⚠️ Budget calculations incorrect
- ⚠️ Real-time updates not working
- ⚠️ Toast notifications not appearing
- ⚠️ Forms accepting invalid data
- ⚠️ Console errors or warnings
- ⚠️ Slow page loads
- ⚠️ UI breaking on mobile

---

## 8. Browser DevTools Tips

### Open DevTools
- **Chrome/Edge**: F12 or Ctrl+Shift+I
- **Firefox**: F12 or Ctrl+Shift+I
- **Safari**: Cmd+Option+I (enable in Preferences first)

### Useful Tabs
- **Console**: Check for JavaScript errors
- **Network**: Monitor API calls and performance
- **Application**: Check localStorage and cookies
- **Performance**: Measure page load times

### Quick Checks
```javascript
// In Console tab, check for errors:
// Red text = errors (report these)
// Yellow text = warnings (note but may not be critical)

// Check localStorage:
localStorage.getItem('transactions')

// Check if API is responding:
fetch('http://localhost:3001/health').then(r => r.json()).then(console.log)
```

---

## 9. Reporting Your Results

### Daily Updates
At end of each testing session:
1. Update **TEST_EXECUTION_TRACKER.md**
2. Submit bug reports for issues found
3. Note any blockers or questions
4. Estimate remaining work

### Final Report
After completing all tests:
1. Fill in test summary in **TEST_EXECUTION_TRACKER.md**
2. Calculate pass rate
3. List all bugs found
4. Provide recommendation (Approve/Needs Fixes/Reject)
5. Sign off in **QA_TEST_PLAN.md**

---

## 10. Getting Help

### Questions About Testing
- Review **USER_GUIDE.md** for feature documentation
- Check **API_DOCUMENTATION.md** for technical details
- Review **TEST_REPORT.md** for automated test results

### Technical Issues
- Verify servers are running
- Check browser console for errors
- Try clearing browser cache
- Try different browser
- Contact development team

### Unclear Test Cases
- Document your interpretation
- Proceed with best judgment
- Note in test results
- Ask for clarification

---

## 11. Success Criteria

### Minimum for Production (Must Pass)
- ✅ All P1 tests passed
- ✅ No critical bugs (data loss, security, crashes)
- ✅ Core CRUD operations work
- ✅ Authentication works
- ✅ Works in at least Chrome and Firefox

### Recommended for Production (Should Pass)
- ✅ 90%+ of all tests passed
- ✅ All P2 tests passed
- ✅ No high-priority bugs without workarounds
- ✅ Performance acceptable (< 3s page loads)
- ✅ Mobile responsive

### Nice to Have (Can Fix Post-Launch)
- ✅ 100% test pass rate
- ✅ All browsers supported
- ✅ All animations smooth
- ✅ All UI polish complete

---

## 12. Quick Reference

### Test Execution Order
1. **Day 1**: TC-001 to TC-006 (Critical Path)
2. **Day 2**: TC-007 to TC-016 (Core Features)
3. **Day 3**: TC-017 to TC-028 (UI/UX & Browsers)

### Time Estimates
- **Quick smoke test**: 30 minutes (P1 tests only)
- **Core functionality**: 2 hours (P1 + P2 tests)
- **Complete testing**: 3-4 hours (All tests + browsers)

### Key URLs
- Frontend: http://localhost:5174/
- Backend: http://localhost:3001/
- Health Check: http://localhost:3001/health

### Key Files
- Test Plan: **QA_TEST_PLAN.md**
- Progress Tracker: **TEST_EXECUTION_TRACKER.md**
- Bug Template: **BUG_REPORT_TEMPLATE.md**

---

## Ready to Start? 🚀

1. ✅ Open **QA_TEST_PLAN.md**
2. ✅ Open http://localhost:5174/ in your browser
3. ✅ Start with TC-001: User Sign Up
4. ✅ Document your results in **TEST_EXECUTION_TRACKER.md**
5. ✅ Report bugs using **BUG_REPORT_TEMPLATE.md**

**Good luck with testing!** 🎯

---

## Appendix: Keyboard Shortcuts

### Browser
- `F12` - Open DevTools
- `Ctrl+Shift+R` - Hard refresh (clear cache)
- `Ctrl+Shift+Delete` - Clear browsing data
- `F5` - Refresh page

### Application
- `Tab` - Navigate between fields
- `Enter` - Submit form
- `Escape` - Close modal
- `Ctrl+Click` - Open link in new tab

### DevTools
- `Ctrl+Shift+C` - Inspect element
- `Ctrl+Shift+M` - Toggle device toolbar (mobile view)
- `Ctrl+Shift+P` - Command palette

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-04-07  
**Questions?** Contact the development team
