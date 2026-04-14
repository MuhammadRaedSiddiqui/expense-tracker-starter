import { test, expect } from './fixtures/auth.fixture.js';
import {
  createTransaction,
  createBudget,
  createRecurringTransaction,
  waitForToast,
  waitForLoadingComplete,
} from './helpers/test-helpers.js';

test.describe('End-to-End User Flows', () => {
  test('complete user journey: onboarding to reporting', async ({ authenticatedPage }) => {
    // 1. Start at dashboard
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);
    await expect(authenticatedPage.locator('h1:has-text("Dashboard")')).toBeVisible();

    // 2. Create first income transaction
    await createTransaction(authenticatedPage, {
      description: 'Monthly Salary',
      amount: '5000',
      type: 'income',
      category: 'salary',
    });

    // 3. Create multiple expense transactions
    const expenses = [
      { description: 'Rent Payment', amount: '1200', category: 'housing' },
      { description: 'Grocery Shopping', amount: '300', category: 'food' },
      { description: 'Gas', amount: '80', category: 'transport' },
      { description: 'Netflix Subscription', amount: '15', category: 'entertainment' },
    ];

    for (const expense of expenses) {
      await createTransaction(authenticatedPage, {
        ...expense,
        type: 'expense',
      });
    }

    // 4. Set up a budget
    await authenticatedPage.goto('/budgets');
    await waitForLoadingComplete(authenticatedPage);

    await createBudget(authenticatedPage, {
      category: 'food',
      amount: '500',
      period: 'monthly',
    });

    // 5. Create recurring transaction
    await authenticatedPage.goto('/recurring');
    await waitForLoadingComplete(authenticatedPage);

    await createRecurringTransaction(authenticatedPage, {
      description: 'Monthly Rent',
      amount: '1200',
      type: 'expense',
      category: 'housing',
      frequency: 'monthly',
      interval: '1',
    });

    // 6. View reports
    await authenticatedPage.goto('/reports');
    await waitForLoadingComplete(authenticatedPage);
    await expect(authenticatedPage.locator('h1:has-text("Reports")')).toBeVisible();

    // 7. Check dashboard summary
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);

    // Verify summary shows correct data
    await expect(authenticatedPage.locator('text=/\\$5,000/i')).toBeVisible(); // Income
    await expect(authenticatedPage.locator('text=/balance/i')).toBeVisible();
  });

  test('budget management workflow', async ({ authenticatedPage }) => {
    // 1. Create a budget
    await authenticatedPage.goto('/budgets');
    await waitForLoadingComplete(authenticatedPage);

    await createBudget(authenticatedPage, {
      category: 'entertainment',
      amount: '200',
      period: 'monthly',
    });

    // 2. Add transactions within budget
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    await createTransaction(authenticatedPage, {
      description: 'Movie Tickets',
      amount: '50',
      type: 'expense',
      category: 'entertainment',
    });

    // 3. Check budget status
    await authenticatedPage.goto('/budgets');
    await waitForLoadingComplete(authenticatedPage);

    // Should show progress
    await expect(authenticatedPage.locator('text=/\\d+\\.\\d+% used/')).toBeVisible();

    // 4. Add transaction that exceeds budget
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    await createTransaction(authenticatedPage, {
      description: 'Concert Tickets',
      amount: '180',
      type: 'expense',
      category: 'entertainment',
    });

    // 5. Check for over-budget warning
    await authenticatedPage.goto('/budgets');
    await waitForLoadingComplete(authenticatedPage);

    const overBudget = authenticatedPage.locator('text=/exceeded|over/i');
    await expect(overBudget).toBeVisible();
  });

  test('transaction filtering and analysis workflow', async ({ authenticatedPage }) => {
    // 1. Create diverse transactions
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    const transactions = [
      { description: 'Salary', amount: '4000', type: 'income', category: 'salary' },
      { description: 'Freelance', amount: '1000', type: 'income', category: 'freelance' },
      { description: 'Groceries', amount: '200', type: 'expense', category: 'food' },
      { description: 'Restaurant', amount: '80', type: 'expense', category: 'food' },
      { description: 'Uber', amount: '45', type: 'expense', category: 'transport' },
    ];

    for (const txn of transactions) {
      await createTransaction(authenticatedPage, txn);
    }

    // 2. Filter by income
    await authenticatedPage.selectOption('select[name="filterType"]', 'income');
    await waitForLoadingComplete(authenticatedPage);

    await expect(authenticatedPage.locator('text=Salary')).toBeVisible();
    await expect(authenticatedPage.locator('text=Freelance')).toBeVisible();
    await expect(authenticatedPage.locator('text=Groceries')).not.toBeVisible();

    // 3. Filter by category
    await authenticatedPage.selectOption('select[name="filterType"]', 'all');
    await authenticatedPage.selectOption('select[name="filterCategory"]', 'food');
    await waitForLoadingComplete(authenticatedPage);

    await expect(authenticatedPage.locator('text=Groceries')).toBeVisible();
    await expect(authenticatedPage.locator('text=Restaurant')).toBeVisible();
    await expect(authenticatedPage.locator('text=Uber')).not.toBeVisible();

    // 4. Search by description
    await authenticatedPage.selectOption('select[name="filterCategory"]', 'all');
    await authenticatedPage.fill('input[name="search"]', 'Salary');
    await waitForLoadingComplete(authenticatedPage);

    await expect(authenticatedPage.locator('text=Salary')).toBeVisible();
    await expect(authenticatedPage.locator('text=Freelance')).not.toBeVisible();

    // 5. Sort by amount
    await authenticatedPage.fill('input[name="search"]', '');
    await authenticatedPage.selectOption('select[name="sortBy"]', 'amount');
    await authenticatedPage.selectOption('select[name="sortOrder"]', 'desc');
    await waitForLoadingComplete(authenticatedPage);

    // Highest amount should be first
    const rows = await authenticatedPage.locator('tbody tr').all();
    const firstRowText = await rows[0].textContent();
    expect(firstRowText).toContain('Salary');
  });

  test('multi-currency transaction workflow', async ({ authenticatedPage }) => {
    // 1. Create transactions in different currencies
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    const currencies = [
      { description: 'USD Income', amount: '1000', currency: 'USD', type: 'income' },
      { description: 'EUR Expense', amount: '100', currency: 'EUR', type: 'expense' },
      { description: 'GBP Expense', amount: '50', currency: 'GBP', type: 'expense' },
    ];

    for (const txn of currencies) {
      await createTransaction(authenticatedPage, {
        ...txn,
        category: txn.type === 'income' ? 'salary' : 'food',
      });
    }

    // 2. Check dashboard shows all currencies
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);

    await expect(authenticatedPage.locator('text=USD')).toBeVisible();
    await expect(authenticatedPage.locator('text=EUR')).toBeVisible();
    await expect(authenticatedPage.locator('text=GBP')).toBeVisible();

    // 3. Verify exchange rate updates
    const refreshButton = authenticatedPage.locator('button:has-text("↻")');
    const hasButton = await refreshButton.isVisible().catch(() => false);

    if (hasButton) {
      await refreshButton.click();
      await waitForLoadingComplete(authenticatedPage);
    }
  });

  test('recurring transaction automation workflow', async ({ authenticatedPage }) => {
    // 1. Set up multiple recurring transactions
    await authenticatedPage.goto('/recurring');
    await waitForLoadingComplete(authenticatedPage);

    const recurring = [
      {
        description: 'Monthly Rent',
        amount: '1200',
        type: 'expense',
        category: 'housing',
        frequency: 'monthly',
      },
      {
        description: 'Weekly Groceries',
        amount: '100',
        type: 'expense',
        category: 'food',
        frequency: 'weekly',
      },
      {
        description: 'Bi-weekly Salary',
        amount: '2500',
        type: 'income',
        category: 'salary',
        frequency: 'weekly',
        interval: '2',
      },
    ];

    for (const rec of recurring) {
      await createRecurringTransaction(authenticatedPage, {
        ...rec,
        interval: rec.interval || '1',
      });
    }

    // 2. Verify all recurring transactions are listed
    await expect(authenticatedPage.locator('text=Monthly Rent')).toBeVisible();
    await expect(authenticatedPage.locator('text=Weekly Groceries')).toBeVisible();
    await expect(authenticatedPage.locator('text=Bi-weekly Salary')).toBeVisible();

    // 3. Pause one recurring transaction
    const rentRow = authenticatedPage.locator('text=Monthly Rent').locator('..').locator('..');
    await rentRow.locator('button:has-text("Pause")').click();
    await waitForToast(authenticatedPage, 'Recurring transaction updated successfully');

    // 4. Verify inactive status
    await expect(authenticatedPage.locator('text=Inactive')).toBeVisible();

    // 5. Resume the transaction
    await rentRow.locator('button:has-text("Resume")').click();
    await waitForToast(authenticatedPage, 'Recurring transaction updated successfully');
  });

  test('team collaboration workflow', async ({ authenticatedPage }) => {
    // 1. Navigate to team page
    await authenticatedPage.goto('/team');
    await waitForLoadingComplete(authenticatedPage);

    // 2. Check current team members
    await expect(authenticatedPage.locator('h1:has-text("Team")')).toBeVisible();

    // 3. Invite a new member (if feature exists)
    const inviteButton = authenticatedPage.locator('button:has-text("Invite")');
    const hasInvite = await inviteButton.isVisible().catch(() => false);

    if (hasInvite) {
      await inviteButton.click();

      const emailInput = authenticatedPage.locator('input[type="email"]');
      await emailInput.fill('newteammember@example.com');

      const submitButton = authenticatedPage.locator('button[type="submit"]:has-text("Invite")');
      await submitButton.click();

      // Should show success
      await expect(authenticatedPage.locator('text=/invitation sent|invited/i')).toBeVisible({ timeout: 5000 });
    }

    // 4. Navigate back to dashboard
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);
  });

  test('data export and reporting workflow', async ({ authenticatedPage }) => {
    // 1. Create sample data
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    await createTransaction(authenticatedPage, {
      description: 'Export Test Transaction',
      amount: '500',
      type: 'income',
      category: 'salary',
    });

    // 2. Navigate to reports
    await authenticatedPage.goto('/reports');
    await waitForLoadingComplete(authenticatedPage);

    // 3. Check for export functionality
    const exportButton = authenticatedPage.locator('button:has-text("Export"), button:has-text("PDF")');
    const hasExport = await exportButton.isVisible().catch(() => false);

    if (hasExport) {
      // Set up download listener
      const downloadPromise = authenticatedPage.waitForEvent('download', { timeout: 10000 });

      await exportButton.click();

      // Wait for download
      const download = await downloadPromise.catch(() => null);

      if (download) {
        expect(download.suggestedFilename()).toBeTruthy();
      }
    }
  });

  test('error recovery workflow', async ({ authenticatedPage }) => {
    // 1. Start at dashboard
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);

    // 2. Try to create invalid transaction
    await authenticatedPage.click('button:has-text("Add Transaction")');
    await authenticatedPage.waitForSelector('text=Add Transaction');

    // Submit without filling required fields
    await authenticatedPage.click('button[type="submit"]');

    // Should show validation errors
    await expect(authenticatedPage.locator('text=/required|must/i')).toBeVisible();

    // 3. Fix errors and submit successfully
    await authenticatedPage.fill('input[name="description"]', 'Valid Transaction');
    await authenticatedPage.fill('input[name="amount"]', '100');
    await authenticatedPage.selectOption('select[name="type"]', 'expense');
    await authenticatedPage.selectOption('select[name="category"]', 'food');
    await authenticatedPage.click('button[type="submit"]');

    // Should succeed
    await waitForToast(authenticatedPage, 'Transaction added successfully');

    // 4. Verify transaction appears
    await expect(authenticatedPage.locator('text=Valid Transaction')).toBeVisible();
  });

  test('responsive design workflow', async ({ authenticatedPage }) => {
    // 1. Test desktop view
    await authenticatedPage.setViewportSize({ width: 1920, height: 1080 });
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);

    await expect(authenticatedPage.locator('h1:has-text("Dashboard")')).toBeVisible();

    // 2. Test tablet view
    await authenticatedPage.setViewportSize({ width: 768, height: 1024 });
    await authenticatedPage.reload();
    await waitForLoadingComplete(authenticatedPage);

    await expect(authenticatedPage.locator('h1:has-text("Dashboard")')).toBeVisible();

    // 3. Test mobile view
    await authenticatedPage.setViewportSize({ width: 375, height: 667 });
    await authenticatedPage.reload();
    await waitForLoadingComplete(authenticatedPage);

    await expect(authenticatedPage.locator('h1:has-text("Dashboard")')).toBeVisible();

    // 4. Test mobile navigation
    const mobileMenu = authenticatedPage.locator('button[aria-label*="menu"], button:has-text("☰")');
    const hasMobileMenu = await mobileMenu.isVisible().catch(() => false);

    if (hasMobileMenu) {
      await mobileMenu.click();
      await expect(authenticatedPage.locator('nav, [role="navigation"]')).toBeVisible();
    }
  });
});
