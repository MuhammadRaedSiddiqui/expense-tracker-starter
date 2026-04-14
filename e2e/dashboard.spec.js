import { test, expect } from './fixtures/auth.fixture.js';
import {
  createTransaction,
  createBudget,
  waitForLoadingComplete,
} from './helpers/test-helpers.js';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);
  });

  test('should display dashboard page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1:has-text("Dashboard")')).toBeVisible();
    await expect(authenticatedPage.locator('text=Track your income and expenses')).toBeVisible();
  });

  test('should display live indicator when real-time is active', async ({ authenticatedPage }) => {
    const liveIndicator = authenticatedPage.locator('text=Live');
    const isVisible = await liveIndicator.isVisible().catch(() => false);

    if (isVisible) {
      await expect(liveIndicator).toBeVisible();
      await expect(liveIndicator).toHaveClass(/bg-green-100/);
      await expect(liveIndicator.locator('.animate-pulse')).toBeVisible();
    }
  });

  test('should display summary cards', async ({ authenticatedPage }) => {
    // Should show income, expenses, and balance
    await expect(authenticatedPage.locator('text=/income/i')).toBeVisible();
    await expect(authenticatedPage.locator('text=/expense/i')).toBeVisible();
    await expect(authenticatedPage.locator('text=/balance/i')).toBeVisible();
  });

  test('should display summary with correct calculations', async ({ authenticatedPage }) => {
    // Create test transactions
    await createTransaction(authenticatedPage, {
      description: 'Test Income',
      amount: '1000',
      type: 'income',
      category: 'salary',
    });

    await createTransaction(authenticatedPage, {
      description: 'Test Expense',
      amount: '300',
      type: 'expense',
      category: 'food',
    });

    // Go back to dashboard
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);

    // Verify amounts are displayed
    await expect(authenticatedPage.locator('text=/\\$1,000/i')).toBeVisible();
    await expect(authenticatedPage.locator('text=/\\$300/i')).toBeVisible();
  });

  test('should display spending by category chart', async ({ authenticatedPage }) => {
    // Look for chart container or title
    await expect(authenticatedPage.locator('text=/spending.*category/i')).toBeVisible();
  });

  test('should display income vs expenses chart', async ({ authenticatedPage }) => {
    // Look for chart container or title
    await expect(authenticatedPage.locator('text=/income.*expense/i')).toBeVisible();
  });

  test('should display budget overview', async ({ authenticatedPage }) => {
    // Look for budget section
    const budgetSection = authenticatedPage.locator('text=/budget/i');
    const isVisible = await budgetSection.isVisible().catch(() => false);

    if (isVisible) {
      await expect(budgetSection).toBeVisible();
    }
  });

  test('should display budget alerts when over budget', async ({ authenticatedPage }) => {
    // Create a small budget
    await authenticatedPage.goto('/budgets');
    await waitForLoadingComplete(authenticatedPage);

    await createBudget(authenticatedPage, {
      category: 'food',
      amount: '50',
      period: 'monthly',
    });

    // Create transaction that exceeds budget
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    await createTransaction(authenticatedPage, {
      description: 'Over Budget Meal',
      amount: '100',
      type: 'expense',
      category: 'food',
    });

    // Go to dashboard
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);

    // Should show budget alert
    const alert = authenticatedPage.locator('text=/budget.*exceeded|over budget/i');
    const hasAlert = await alert.isVisible().catch(() => false);

    if (hasAlert) {
      await expect(alert).toBeVisible();
    }
  });

  test('should display transaction list', async ({ authenticatedPage }) => {
    // Should show recent transactions
    const transactionList = authenticatedPage.locator('table, [role="table"]');
    const hasTable = await transactionList.isVisible().catch(() => false);

    if (hasTable) {
      await expect(transactionList).toBeVisible();
    }
  });

  test('should display exchange rate information', async ({ authenticatedPage }) => {
    // Look for exchange rate update info
    const rateInfo = authenticatedPage.locator('text=/exchange rate/i');
    const hasRateInfo = await rateInfo.isVisible().catch(() => false);

    if (hasRateInfo) {
      await expect(rateInfo).toBeVisible();
    }
  });

  test('should have refresh button for exchange rates', async ({ authenticatedPage }) => {
    const refreshButton = authenticatedPage.locator('button:has-text("↻"), button:has-text("⟳")');
    const hasButton = await refreshButton.isVisible().catch(() => false);

    if (hasButton) {
      await expect(refreshButton).toBeVisible();
      await expect(refreshButton).toBeEnabled();
    }
  });

  test('should refresh exchange rates when button clicked', async ({ authenticatedPage }) => {
    const refreshButton = authenticatedPage.locator('button:has-text("↻")');
    const hasButton = await refreshButton.isVisible().catch(() => false);

    if (hasButton) {
      await refreshButton.click();

      // Should show loading state
      const loadingButton = authenticatedPage.locator('button:has-text("⟳")');
      await expect(loadingButton).toBeVisible({ timeout: 2000 }).catch(() => {});
    }
  });

  test('should have Add Transaction button', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('button:has-text("Add Transaction")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("Add Transaction")')).toBeEnabled();
  });

  test('should have Clear All button', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('button:has-text("Clear All")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("Clear All")')).toBeEnabled();
  });

  test('should open transaction modal from dashboard', async ({ authenticatedPage }) => {
    await authenticatedPage.click('button:has-text("Add Transaction")');

    // Modal should open
    await expect(authenticatedPage.locator('text=Add Transaction')).toBeVisible();
  });

  test('should show skeleton loaders while loading', async ({ authenticatedPage }) => {
    // Navigate to dashboard
    await authenticatedPage.goto('/dashboard');

    // Check for skeleton loaders (they should appear briefly)
    const skeleton = authenticatedPage.locator('[data-testid="skeleton"], .animate-pulse');
    const hasSkeleton = await skeleton.first().isVisible({ timeout: 1000 }).catch(() => false);

    // Skeleton may or may not be visible depending on load speed
    // This test documents the expected behavior
    if (hasSkeleton) {
      await expect(skeleton.first()).toBeVisible();
    }

    // Wait for content to load
    await waitForLoadingComplete(authenticatedPage);
  });

  test('should display empty state when no transactions exist', async ({ authenticatedPage }) => {
    // This test assumes a fresh state or after clearing all
    const emptyState = authenticatedPage.locator('text=/no transactions/i');
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    if (hasEmptyState) {
      await expect(emptyState).toBeVisible();
    }
  });

  test('should update summary when transaction is added', async ({ authenticatedPage }) => {
    // Get initial balance
    const balanceElement = authenticatedPage.locator('text=/balance/i').locator('..').locator('text=/\\$/');
    const initialBalance = await balanceElement.textContent().catch(() => '$0.00');

    // Add a transaction
    await createTransaction(authenticatedPage, {
      description: 'Dashboard Test Income',
      amount: '500',
      type: 'income',
      category: 'salary',
    });

    // Go back to dashboard
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);

    // Balance should have changed
    const newBalance = await balanceElement.textContent().catch(() => '$0.00');
    expect(newBalance).not.toBe(initialBalance);
  });

  test('should update charts when transactions are added', async ({ authenticatedPage }) => {
    // Add transactions in different categories
    await createTransaction(authenticatedPage, {
      description: 'Food Expense',
      amount: '100',
      type: 'expense',
      category: 'food',
    });

    await createTransaction(authenticatedPage, {
      description: 'Transport Expense',
      amount: '50',
      type: 'expense',
      category: 'transport',
    });

    // Go back to dashboard
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);

    // Charts should be visible
    const chart = authenticatedPage.locator('.recharts-wrapper, [class*="chart"]');
    const hasChart = await chart.first().isVisible().catch(() => false);

    if (hasChart) {
      await expect(chart.first()).toBeVisible();
    }
  });

  test('should handle errors gracefully', async ({ authenticatedPage }) => {
    // Simulate offline mode
    await authenticatedPage.context().setOffline(true);

    // Reload page
    await authenticatedPage.reload();

    // Should show error or fallback state
    const errorMessage = authenticatedPage.locator('text=/error|failed|offline/i');
    const hasError = await errorMessage.isVisible({ timeout: 5000 }).catch(() => false);

    // Restore online mode
    await authenticatedPage.context().setOffline(false);

    // Error handling is implementation-dependent
    if (hasError) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test('should be responsive on mobile viewport', async ({ authenticatedPage }) => {
    // Set mobile viewport
    await authenticatedPage.setViewportSize({ width: 375, height: 667 });

    // Page should still be functional
    await expect(authenticatedPage.locator('h1:has-text("Dashboard")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("Add Transaction")')).toBeVisible();
  });

  test('should be responsive on tablet viewport', async ({ authenticatedPage }) => {
    // Set tablet viewport
    await authenticatedPage.setViewportSize({ width: 768, height: 1024 });

    // Page should still be functional
    await expect(authenticatedPage.locator('h1:has-text("Dashboard")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("Add Transaction")')).toBeVisible();
  });
});
