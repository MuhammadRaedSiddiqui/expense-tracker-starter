# Testing Guide

This document outlines the testing strategy and practices for the expense tracker application.

## Testing Philosophy

- **Test behavior, not implementation**: Focus on what the code does, not how it does it
- **Write tests that provide confidence**: Tests should catch real bugs
- **Keep tests maintainable**: Tests should be easy to understand and update
- **Test at the right level**: Use the appropriate testing strategy for each scenario

## Testing Pyramid

```
        /\
       /  \
      / E2E \
     /______\
    /        \
   /Integration\
  /____________\
 /              \
/  Unit Tests    \
/________________\
```

- **Unit Tests (70%)**: Test individual functions and components in isolation
- **Integration Tests (20%)**: Test how multiple units work together
- **E2E Tests (10%)**: Test complete user workflows

## Frontend Testing

### Setup

```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**vite.config.js:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
```

**src/test/setup.js:**
```javascript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

### Unit Tests

#### Testing Utility Functions

**src/utils.test.js:**
```javascript
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, calculateBalance } from './utils';

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });

  it('formats EUR correctly', () => {
    expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
  });

  it('handles zero', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });

  it('handles negative amounts', () => {
    expect(formatCurrency(-100, 'USD')).toBe('-$100.00');
  });
});

describe('calculateBalance', () => {
  it('calculates balance correctly', () => {
    const transactions = [
      { type: 'income', amount: 1000 },
      { type: 'expense', amount: 300 },
      { type: 'income', amount: 500 },
    ];
    expect(calculateBalance(transactions)).toBe(1200);
  });

  it('handles empty array', () => {
    expect(calculateBalance([])).toBe(0);
  });
});
```

#### Testing React Components

**src/components/TransactionForm.test.jsx:**
```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionForm from './TransactionForm';

describe('TransactionForm', () => {
  it('renders all form fields', () => {
    render(<TransactionForm onSubmit={vi.fn()} />);
    
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    
    render(<TransactionForm onSubmit={onSubmit} />);
    
    await user.selectOptions(screen.getByLabelText(/type/i), 'expense');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Food');
    await user.type(screen.getByLabelText(/amount/i), '50.00');
    await user.type(screen.getByLabelText(/description/i), 'Groceries');
    
    await user.click(screen.getByRole('button', { name: /add/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        type: 'expense',
        category: 'Food',
        amount: 50.00,
        description: 'Groceries',
      });
    });
  });

  it('shows validation error for empty amount', async () => {
    const user = userEvent.setup();
    
    render(<TransactionForm onSubmit={vi.fn()} />);
    
    await user.click(screen.getByRole('button', { name: /add/i }));
    
    expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
  });
});
```

#### Testing Custom Hooks

**src/hooks/useTransactions.test.js:**
```javascript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useTransactions from './useTransactions';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useTransactions', () => {
  it('fetches transactions successfully', async () => {
    const { result } = renderHook(
      () => useTransactions('org-123'),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    
    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});
```

### Integration Tests

**src/App.test.jsx:**
```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Integration', () => {
  it('adds and displays a new transaction', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Fill out form
    await user.selectOptions(screen.getByLabelText(/type/i), 'income');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Salary');
    await user.type(screen.getByLabelText(/amount/i), '5000');
    await user.type(screen.getByLabelText(/description/i), 'Monthly salary');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /add/i }));
    
    // Verify transaction appears in list
    await waitFor(() => {
      expect(screen.getByText('Monthly salary')).toBeInTheDocument();
      expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    });
    
    // Verify balance updated
    expect(screen.getByText(/balance.*\$5,000\.00/i)).toBeInTheDocument();
  });
});
```

### Running Frontend Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- TransactionForm.test.jsx
```

## Backend Testing

### Setup

```bash
cd server
npm install --save-dev vitest supertest
```

**server/vitest.config.js:**
```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './src/test/setup.js',
  },
});
```

### Unit Tests

#### Testing Services

**server/src/services/transaction.service.test.js:**
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import TransactionService from './transaction.service';

describe('TransactionService', () => {
  let service;
  
  beforeEach(() => {
    service = new TransactionService();
  });

  describe('calculateBalance', () => {
    it('calculates balance correctly', () => {
      const transactions = [
        { type: 'income', amount: 1000 },
        { type: 'expense', amount: 300 },
      ];
      
      const balance = service.calculateBalance(transactions);
      expect(balance).toBe(700);
    });
  });

  describe('filterByDateRange', () => {
    it('filters transactions within date range', () => {
      const transactions = [
        { date: '2026-04-01', amount: 100 },
        { date: '2026-04-15', amount: 200 },
        { date: '2026-05-01', amount: 300 },
      ];
      
      const filtered = service.filterByDateRange(
        transactions,
        '2026-04-01',
        '2026-04-30'
      );
      
      expect(filtered).toHaveLength(2);
    });
  });
});
```

### Integration Tests

#### Testing API Endpoints

**server/src/routes/transactions.test.js:**
```javascript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index';
import { createTestUser, createTestOrg, cleanupTestData } from '../test/helpers';

describe('Transaction API', () => {
  let authToken;
  let orgId;

  beforeAll(async () => {
    const user = await createTestUser();
    authToken = user.token;
    const org = await createTestOrg(user.id);
    orgId = org.id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('POST /api/organizations/:orgId/transactions', () => {
    it('creates a new transaction', async () => {
      const response = await request(app)
        .post(`/api/organizations/${orgId}/transactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'expense',
          category: 'Food',
          amount: 50.00,
          description: 'Groceries',
          transactionDate: '2026-04-29',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        type: 'expense',
        category: 'Food',
        amount: 50.00,
      });
    });

    it('returns 401 without auth token', async () => {
      const response = await request(app)
        .post(`/api/organizations/${orgId}/transactions`)
        .send({
          type: 'expense',
          amount: 50.00,
        });

      expect(response.status).toBe(401);
    });

    it('validates required fields', async () => {
      const response = await request(app)
        .post(`/api/organizations/${orgId}/transactions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'expense',
          // Missing amount
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/organizations/:orgId/transactions', () => {
    it('returns transactions for organization', async () => {
      const response = await request(app)
        .get(`/api/organizations/${orgId}/transactions`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.transactions)).toBe(true);
    });

    it('filters by type', async () => {
      const response = await request(app)
        .get(`/api/organizations/${orgId}/transactions?type=income`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      response.body.data.transactions.forEach(t => {
        expect(t.type).toBe('income');
      });
    });
  });
});
```

### Running Backend Tests

```bash
cd server

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- transaction.service.test.js
```

## E2E Testing

### Setup with Playwright

```bash
npm install --save-dev @playwright/test
npx playwright install
```

**playwright.config.js:**
```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

**e2e/transaction-flow.spec.js:**
```javascript
import { test, expect } from '@playwright/test';

test.describe('Transaction Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Assume user is already logged in via Clerk
  });

  test('complete transaction workflow', async ({ page }) => {
    // Add transaction
    await page.fill('[name="amount"]', '100');
    await page.selectOption('[name="category"]', 'Food');
    await page.fill('[name="description"]', 'Lunch');
    await page.click('button:has-text("Add Transaction")');

    // Verify transaction appears
    await expect(page.locator('text=Lunch')).toBeVisible();
    await expect(page.locator('text=$100.00')).toBeVisible();

    // Edit transaction
    await page.click('[aria-label="Edit transaction"]');
    await page.fill('[name="amount"]', '120');
    await page.click('button:has-text("Save")');

    // Verify update
    await expect(page.locator('text=$120.00')).toBeVisible();

    // Delete transaction
    await page.click('[aria-label="Delete transaction"]');
    await page.click('button:has-text("Confirm")');

    // Verify deletion
    await expect(page.locator('text=Lunch')).not.toBeVisible();
  });
});
```

### Running E2E Tests

```bash
# Run all E2E tests
npx playwright test

# Run in headed mode
npx playwright test --headed

# Run specific test
npx playwright test transaction-flow

# Debug mode
npx playwright test --debug
```

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Cover critical user paths
- **E2E Tests**: Cover main user workflows

### Checking Coverage

```bash
# Frontend coverage
npm test -- --coverage

# Backend coverage
cd server && npm test -- --coverage
```

## CI/CD Testing

**GitHub Actions (.github/workflows/test.yml):**
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run frontend tests
        run: npm test -- --coverage
      
      - name: Run backend tests
        run: cd server && npm test -- --coverage
      
      - name: Run E2E tests
        run: npx playwright test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Best Practices

1. **Write tests first (TDD)** when fixing bugs
2. **Keep tests isolated** - no shared state between tests
3. **Use descriptive test names** - describe what is being tested
4. **Test edge cases** - empty arrays, null values, boundary conditions
5. **Mock external dependencies** - APIs, databases, third-party services
6. **Clean up after tests** - remove test data, reset mocks
7. **Run tests before committing** - catch issues early
8. **Keep tests fast** - slow tests won't be run regularly

## Troubleshooting

### Tests Failing Locally

1. Clear test cache: `npm test -- --clearCache`
2. Ensure test database is clean
3. Check for port conflicts
4. Verify environment variables

### Flaky Tests

1. Add proper waits for async operations
2. Avoid hardcoded timeouts
3. Use `waitFor` instead of `setTimeout`
4. Check for race conditions

### Coverage Not Updating

1. Delete coverage directory
2. Run tests with `--coverage` flag
3. Check `.gitignore` doesn't exclude coverage files
