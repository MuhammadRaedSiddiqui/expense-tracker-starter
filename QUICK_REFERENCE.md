# Quick Reference Guide

## 🧪 Testing Commands

```bash
# Run tests in watch mode (interactive)
npm test

# Open visual test UI in browser
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Generate coverage report
npm run test:coverage
```

## 📚 Context7 Usage

Context7 is **already active** in your Claude Code session. Just ask questions:

### Example Queries:
```
"How to implement Row Level Security in Supabase?"
"Clerk authentication with React Router v7 protected routes"
"Recharts responsive chart configuration"
"Sentry source maps setup for React"
"PostHog event tracking best practices"
```

### What Context7 Does:
- Fetches current documentation (not outdated training data)
- Resolves library IDs automatically
- Provides code examples with proper syntax
- Shows official best practices

## 🎭 Playwright MCP (Browser Automation)

**Status:** Installed, requires restart

**After restarting Claude Code:**

```
"Use Playwright to navigate to localhost:5173"
"Use Playwright to take a screenshot of the dashboard"
"Use Playwright to click the Add Transaction button"
"Use Playwright to test the login form"
"Use Playwright to emulate iPhone 14 and test mobile view"
```

## 📁 Test Files Created

```
src/
├── utils.test.js                    # 6 tests - formatting
├── utils.conversion.test.js         # 7 tests - currency conversion
└── components/
    └── __tests__/
        └── Summary.test.jsx         # 6 tests - component logic
```

**Total: 19 tests passing ✅**

## 🔧 Code Improvements

**File:** `src/hooks/useRealtime.improved.js`

**Issue Fixed:** Stale closure in dependency arrays
**Solution:** Ref pattern (Supabase best practice)

**Before:**
```javascript
}, [organizationId, enabled]); // Missing fetchFunction
```

**After:**
```javascript
const fetchFunctionRef = useRef(fetchFunction);
useEffect(() => {
  fetchFunctionRef.current = fetchFunction;
}, [fetchFunction]);

// Now safe
}, [organizationId, enabled]);
```

## 🚀 Next Steps

1. **Restart Claude Code** to activate Playwright MCP
2. **Review** `src/hooks/useRealtime.improved.js`
3. **Apply** the ref pattern fix to your hooks
4. **Write more tests** for:
   - Budget calculations
   - Recurring transaction processor
   - API endpoints
   - Form validation

## 📊 Test Coverage Priorities

### Critical (Business Logic)
- [ ] Transaction calculations
- [ ] Budget threshold detection
- [ ] Recurring transaction processor
- [ ] Currency conversion edge cases

### High (User Flows)
- [ ] API endpoint integration tests
- [ ] Form validation
- [ ] Authentication flows

### Medium (UI)
- [ ] Component rendering
- [ ] User interactions
- [ ] Responsive design

## 💡 Tips

**Context7:**
- Use for any library/framework questions
- Great for version-specific queries
- Prefer over web search for technical docs

**Playwright MCP:**
- Auto-installs browser binaries on first use
- Supports 143+ device emulations
- Can generate test code from interactions

**Testing:**
- Start with critical business logic
- Use `test:ui` for visual debugging
- Mock external APIs in tests

---

**Setup Date:** 2026-04-09
**Test Status:** 19/19 passing ✅
**MCP Servers:** Context7 (active), Playwright (restart required)
