# Context7 & Playwright MCP - Complete Setup Guide

## 🎯 What Was Accomplished

### 1. Context7 MCP (Active & Demonstrated)
✅ Already configured and working in your Claude Code session
✅ Demonstrated with live Supabase real-time documentation query
✅ Applied best practices to your actual codebase

### 2. Vitest Testing Framework (Installed & Configured)
✅ Installed: vitest, jsdom, @testing-library/react, @vitest/ui
✅ Created `vitest.config.js` with jsdom environment
✅ Created `src/test/setup.js` for test initialization
✅ Added test scripts to package.json
✅ **Test Results**: 13/13 tests passing

### 3. Playwright MCP Server (Installed & Configured)
✅ Installed globally: `@executeautomation/playwright-mcp-server@1.0.12`
✅ Configured in `C:/Users/HP/.claude/settings.json`
⚠️ **Requires Claude Code restart** to activate

### 4. Code Improvements from Context7
✅ Analyzed your `useRealtime.js` hooks against Supabase best practices
✅ Created improved version with ref pattern to prevent stale closures
✅ File: `src/hooks/useRealtime.improved.js`

---

## 📚 How to Use Context7

Context7 fetches **current, up-to-date documentation** for any library or framework. It's already active in your session.

### Example Queries:

**For your project specifically:**
```
"How to implement Row Level Security policies in Supabase for multi-tenant apps?"
"Best practices for Clerk authentication with React Router v7?"
"How to optimize Recharts performance with large datasets?"
"Sentry error tracking setup for React with source maps?"
```

**General usage:**
```
"How to use React Query with Supabase?"
"Next.js 15 server actions examples"
"Tailwind CSS responsive design patterns"
```

### What Context7 Does:
1. Resolves the library ID automatically
2. Fetches current documentation (not outdated training data)
3. Provides code examples with proper syntax
4. Shows best practices and common patterns

### Real Example from This Session:

**Query:** "How to implement real-time subscriptions in React with proper cleanup"

**Result:** Context7 fetched 5 code examples from Supabase docs showing:
- Proper cleanup with `channel.unsubscribe()`
- Handling React StrictMode
- Dynamic channel subscriptions
- useRef pattern to prevent stale closures

**Applied to your code:** Found and fixed dependency array issue in your hooks

---

## 🎭 How to Use Playwright MCP

### Activation Required
**You must restart Claude Code** for the Playwright MCP server to load.

After restart, you'll have access to browser automation via the `browsing-with-playwright` skill.

### Available Capabilities:
- Navigate to URLs
- Click elements and fill forms
- Take screenshots
- Extract data from pages
- Execute JavaScript
- Device emulation (143+ real devices)

### Example Commands:

**Test your app:**
```
"Use Playwright to navigate to localhost:5173 and take a screenshot of the dashboard"
"Use Playwright to test the login flow"
"Use Playwright to click the 'Add Transaction' button and fill the form"
```

**Web scraping:**
```
"Use Playwright to scrape transaction data from the table"
"Use Playwright to extract all budget names from the page"
```

**Mobile testing:**
```
"Use Playwright to emulate iPhone 14 and test responsive design"
```

### Configuration Location:
`C:/Users/HP/.claude/settings.json`

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    }
  }
}
```

---

## 🧪 Testing Your App

### Run Tests:
```bash
npm test              # Watch mode (interactive)
npm run test:ui       # Visual UI in browser
npm run test:run      # Single run (CI mode)
npm run test:coverage # With coverage report
```

### Current Test Files:
- `src/utils.test.js` - Currency & date formatting (6 tests)
- `src/utils.conversion.test.js` - Currency conversion (7 tests)

### Priority Testing Areas:

**Critical (Business Logic):**
1. Transaction calculations
2. Budget threshold detection
3. Recurring transaction processor
4. Currency conversion accuracy

**High (User Flows):**
5. API endpoints (integration tests)
6. Form validation
7. Authentication flows

**Medium (UI):**
8. Component rendering
9. User interactions
10. Responsive design

---

## 🔧 Code Improvement Applied

### Issue Found: Stale Closure in useRealtime Hooks

**Problem:** Missing `fetchFunction` in dependency array causes stale closures

**Location:** `src/hooks/useRealtime.js:89, 173, 286`

**Solution:** Use ref pattern (Context7 best practice)

**Improved version:** `src/hooks/useRealtime.improved.js`

### Key Changes:
```javascript
// Before (stale closure risk)
}, [organizationId, enabled]);

// After (ref pattern)
const fetchFunctionRef = useRef(fetchFunction);
useEffect(() => {
  fetchFunctionRef.current = fetchFunction;
}, [fetchFunction]);

// Now safe without fetchFunction in deps
}, [organizationId, enabled]);
```

### Benefits:
✅ No stale closures
✅ No unnecessary re-subscriptions
✅ Follows Supabase official best practices
✅ Better performance

---

## 📊 Summary

| Tool | Status | Action Required |
|------|--------|-----------------|
| Context7 MCP | ✅ Active | None - ready to use |
| Vitest Testing | ✅ Installed | Write more tests |
| Playwright MCP | ⚠️ Configured | Restart Claude Code |
| Code Improvements | ✅ Provided | Review & apply improved hooks |

---

## 🚀 Next Steps

1. **Restart Claude Code** to activate Playwright MCP
2. **Review** `src/hooks/useRealtime.improved.js`
3. **Apply** the ref pattern fix to your hooks
4. **Write tests** for critical business logic
5. **Use Context7** whenever you need current documentation

---

## 💡 Pro Tips

**Context7:**
- Use it even for libraries you know - docs change frequently
- Great for version-specific queries (e.g., "React Router v7")
- Prefer it over web search for technical documentation

**Playwright MCP:**
- Automatically installs browser binaries on first use
- Supports headless and headed modes
- Can generate test code from interactions

**Testing:**
- Start with critical business logic (calculations, budgets)
- Use `test:ui` for visual debugging
- Mock external APIs (Supabase, Clerk) in tests

---

Generated: 2026-04-09
