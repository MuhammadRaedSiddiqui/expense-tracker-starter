# E2E Testing with Playwright

Comprehensive end-to-end testing suite for the Expense Tracker application using Playwright.

## Overview

This test suite covers all major features and user flows:
- Authentication and authorization
- Transaction CRUD operations
- Filtering, sorting, and searching
- Budget management
- Recurring transactions
- Reports and analytics
- Team management
- Navigation and routing
- Accessibility compliance
- Responsive design

## Setup

### Prerequisites

- Node.js 18+ installed
- Application running on `http://localhost:5173`
- Test user account credentials

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Environment Variables

Create a `.env.test` file in the root directory:

```env
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestPassword123!
BASE_URL=http://localhost:5173
```

## Running Tests

### Run all tests

```bash
npm run test:e2e
```

### Run tests in headed mode (see browser)

```bash
npm run test:e2e:headed
```

### Run tests in UI mode (interactive)

```bash
npm run test:e2e:ui
```

### Run specific test file

```bash
npx playwright test e2e/transactions.spec.js
```

### Run tests in specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests in debug mode

```bash
npx playwright test --debug
```

## Test Structure

```
e2e/
├── fixtures/
│   └── auth.fixture.js          # Authentication setup
├── helpers/
│   └── test-helpers.js          # Reusable test utilities
├── auth.spec.js                 # Authentication tests
├── transactions.spec.js         # Transaction CRUD tests
├── filters-sorting.spec.js      # Filter and sort tests
├── budgets.spec.js              # Budget management tests
├── recurring-transactions.spec.js # Recurring transaction tests
├── dashboard.spec.js            # Dashboard tests
├── reports.spec.js              # Reports and analytics tests
├── navigation.spec.js           # Navigation and routing tests
├── team.spec.js                 # Team management tests
└── accessibility.spec.js        # Accessibility compliance tests
```

## Test Coverage

### Authentication (`auth.spec.js`)
- ✓ Redirect unauthenticated users
- ✓ Sign-in form validation
- ✓ Sign-up flow
- ✓ Protected route access
- ✓ Invalid credentials handling

### Transactions (`transactions.spec.js`)
- ✓ Create income/expense transactions
- ✓ Edit existing transactions
- ✓ Delete transactions with confirmation
- ✓ Form validation
- ✓ Multi-currency support
- ✓ Clear all transactions
- ✓ Network error handling

### Filters & Sorting (`filters-sorting.spec.js`)
- ✓ Filter by type (income/expense)
- ✓ Filter by category
- ✓ Filter by date range
- ✓ Search by description
- ✓ Sort by date/amount/description
- ✓ Combined filters
- ✓ Empty state handling

### Budgets (`budgets.spec.js`)
- ✓ Create budgets for categories
- ✓ Edit and delete budgets
- ✓ Budget progress tracking
- ✓ Over-budget warnings
- ✓ Multiple periods (weekly/monthly/yearly)
- ✓ Multi-currency budgets
- ✓ Budget status indicators

### Recurring Transactions (`recurring-transactions.spec.js`)
- ✓ Create recurring transactions
- ✓ Multiple frequencies (daily/weekly/monthly/yearly)
- ✓ Custom intervals
- ✓ Pause and resume
- ✓ Edit and delete
- ✓ Next execution date display
- ✓ End date support

### Dashboard (`dashboard.spec.js`)
- ✓ Summary cards (income/expenses/balance)
- ✓ Real-time updates indicator
- ✓ Charts and visualizations
- ✓ Budget overview
- ✓ Budget alerts
- ✓ Exchange rate updates
- ✓ Responsive design

### Reports (`reports.spec.js`)
- ✓ Period comparison
- ✓ Spending trends
- ✓ Category breakdown
- ✓ Date range filtering
- ✓ Export functionality
- ✓ PDF generation
- ✓ Summary statistics

### Navigation (`navigation.spec.js`)
- ✓ Navigate between pages
- ✓ Active link highlighting
- ✓ Browser back/forward buttons
- ✓ Root path redirect
- ✓ Keyboard navigation
- ✓ Accessible labels

### Team Management (`team.spec.js`)
- ✓ Display team members
- ✓ Invite new members
- ✓ Email validation
- ✓ Remove members
- ✓ Change member roles
- ✓ Pending invitations
- ✓ Current user indicator

### Accessibility (`accessibility.spec.js`)
- ✓ Proper heading hierarchy
- ✓ ARIA landmarks
- ✓ Form labels
- ✓ Keyboard navigation
- ✓ Focus indicators
- ✓ Screen reader support
- ✓ Modal focus management
- ✓ Color contrast
- ✓ Table structure

## Writing New Tests

### Basic Test Structure

```javascript
import { test, expect } from './fixtures/auth.fixture.js';
import { waitForLoadingComplete } from './helpers/test-helpers.js';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/page-url');
    await waitForLoadingComplete(authenticatedPage);
  });

  test('should do something', async ({ authenticatedPage }) => {
    // Arrange
    await authenticatedPage.click('button:has-text("Action")');

    // Act
    await authenticatedPage.fill('input[name="field"]', 'value');
    await authenticatedPage.click('button[type="submit"]');

    // Assert
    await expect(authenticatedPage.locator('text=Success')).toBeVisible();
  });
});
```

### Using Test Helpers

```javascript
import {
  createTransaction,
  createBudget,
  createRecurringTransaction,
  waitForToast,
} from './helpers/test-helpers.js';

// Create a transaction
await createTransaction(authenticatedPage, {
  description: 'Test Transaction',
  amount: '100',
  type: 'expense',
  category: 'food',
});

// Wait for success notification
await waitForToast(authenticatedPage, 'Transaction added successfully');
```

## Best Practices

1. **Use Fixtures**: Always use `authenticatedPage` fixture for tests requiring login
2. **Wait for Loading**: Call `waitForLoadingComplete()` after navigation
3. **Descriptive Names**: Use clear, descriptive test names
4. **Arrange-Act-Assert**: Follow AAA pattern in tests
5. **Independent Tests**: Each test should be independent and not rely on others
6. **Clean Up**: Tests should clean up after themselves
7. **Selectors**: Prefer user-facing selectors (text, labels) over implementation details
8. **Assertions**: Use specific assertions with clear error messages

## Debugging

### View Test Report

```bash
npx playwright show-report
```

### Take Screenshots

```bash
npx playwright test --screenshot=on
```

### Record Video

```bash
npx playwright test --video=on
```

### Trace Viewer

```bash
npx playwright test --trace=on
npx playwright show-trace trace.zip
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Tests Timing Out
- Increase timeout in `playwright.config.js`
- Check if application is running
- Verify network connectivity

### Authentication Failures
- Verify test credentials in `.env.test`
- Check Clerk configuration
- Ensure test user exists

### Flaky Tests
- Add explicit waits with `waitForLoadingComplete()`
- Use `waitForSelector()` before interactions
- Increase retry count in config

### Browser Not Found
- Run `npx playwright install`
- Check system dependencies

## Contributing

When adding new features:
1. Write e2e tests for new functionality
2. Update this README with new test coverage
3. Ensure all tests pass before submitting PR
4. Follow existing test patterns and conventions

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Guide](https://playwright.dev/docs/ci)
