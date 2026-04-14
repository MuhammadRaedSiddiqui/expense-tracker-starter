# E2E Testing Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Application dependencies installed (`npm install`)
- Test user account created in your application

## Setup (5 minutes)

### 1. Install Playwright

```bash
npm install --save-dev @playwright/test
npx playwright install
```

### 2. Configure Environment

Create `.env.test` file:

```bash
cp .env.test.example .env.test
```

Edit `.env.test` with your test credentials:

```env
TEST_USER_EMAIL=your-test-user@example.com
TEST_USER_PASSWORD=YourTestPassword123!
BASE_URL=http://localhost:5173
```

### 3. Start Development Server

```bash
npm run dev
```

Keep this running in a separate terminal.

## Running Tests

### Run All Tests

```bash
npm run test:e2e
```

### Run Tests with UI (Recommended for First Time)

```bash
npm run test:e2e:ui
```

This opens an interactive UI where you can:
- See all test files
- Run tests individually
- Watch tests execute in real-time
- Debug failures

### Run Specific Test File

```bash
npx playwright test e2e/transactions.spec.js
```

### Run Tests in Headed Mode (See Browser)

```bash
npm run test:e2e:headed
```

### Run Tests in Specific Browser

```bash
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit
```

## Debugging Failed Tests

### View Test Report

```bash
npm run test:e2e:report
```

### Debug Mode (Step Through Tests)

```bash
npm run test:e2e:debug
```

### Run Single Test

Add `.only` to focus on one test:

```javascript
test.only('should create transaction', async ({ authenticatedPage }) => {
  // test code
});
```

## Common Issues

### Tests Timing Out

**Problem:** Tests fail with timeout errors

**Solution:**
- Ensure dev server is running (`npm run dev`)
- Check if app is accessible at `http://localhost:5173`
- Increase timeout in `playwright.config.js`

### Authentication Failures

**Problem:** Tests fail at login

**Solution:**
- Verify credentials in `.env.test`
- Ensure test user exists in your database
- Check Clerk/Auth configuration

### Port Already in Use

**Problem:** Dev server won't start

**Solution:**
```bash
# Kill process on port 5173
npx kill-port 5173

# Or change port in vite.config.js
```

### Browser Not Found

**Problem:** "Browser not found" error

**Solution:**
```bash
npx playwright install
```

## Test Structure

```
e2e/
├── fixtures/          # Test setup and authentication
├── helpers/           # Reusable test utilities
├── *.spec.js         # Test files
└── README.md         # Full documentation
```

## Writing Your First Test

Create `e2e/my-test.spec.js`:

```javascript
import { test, expect } from './fixtures/auth.fixture.js';
import { waitForLoadingComplete } from './helpers/test-helpers.js';

test.describe('My Feature', () => {
  test('should work correctly', async ({ authenticatedPage }) => {
    // Navigate to page
    await authenticatedPage.goto('/my-page');
    await waitForLoadingComplete(authenticatedPage);

    // Interact with page
    await authenticatedPage.click('button:has-text("Click Me")');

    // Assert result
    await expect(authenticatedPage.locator('text=Success')).toBeVisible();
  });
});
```

Run it:

```bash
npx playwright test e2e/my-test.spec.js
```

## Next Steps

1. ✅ Run all tests to ensure setup is correct
2. ✅ Review test reports to understand coverage
3. ✅ Read full documentation in `e2e/README.md`
4. ✅ Write tests for your new features
5. ✅ Set up CI/CD (see `.github/workflows/e2e-tests.yml`)

## Getting Help

- **Full Documentation:** `e2e/README.md`
- **Playwright Docs:** https://playwright.dev
- **Test Examples:** Check existing `*.spec.js` files
- **Debugging Guide:** https://playwright.dev/docs/debug

## Tips

- Use `test:e2e:ui` for interactive debugging
- Run tests frequently during development
- Keep tests independent and isolated
- Use descriptive test names
- Clean up test data after tests

Happy Testing! 🎭
