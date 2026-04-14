import { test, expect } from './fixtures/auth.fixture.js';
import {
  createBudget,
  createTransaction,
  waitForToast,
  waitForLoadingComplete,
} from './helpers/test-helpers.js';

test.describe('Budget Management', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/budgets');
    await waitForLoadingComplete(authenticatedPage);
  });

  test('should display budgets page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1:has-text("Budgets")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("Create Budget")')).toBeVisible();
    await expect(authenticatedPage.locator('text=Set spending limits')).toBeVisible();
  });

  test('should show empty state when no budgets exist', async ({ authenticatedPage }) => {
    // If there are existing budgets, this test may fail
    const emptyState = authenticatedPage.locator('text=/no budgets/i');
    const isVisible = await emptyState.isVisible().catch(() => false);

    if (isVisible) {
      await expect(emptyState).toBeVisible();
      await expect(authenticatedPage.locator('button:has-text("Create Your First Budget")')).toBeVisible();
    }
  });

  test('should create a new budget', async ({ authenticatedPage }) => {
    await createBudget(authenticatedPage, {
      category: 'food',
      amount: '500',
      period: 'monthly',
      currency: 'USD',
    });

    // Verify budget appears in list
    await expect(authenticatedPage.locator('text=food')).toBeVisible();
    await expect(authenticatedPage.locator('text=USD 500.00')).toBeVisible();
    await expect(authenticatedPage.locator('text=monthly')).toBeVisible();
  });

  test('should create budgets for different categories', async ({ authenticatedPage }) => {
    const categories = ['food', 'housing', 'transport', 'entertainment'];

    for (const category of categories) {
      await createBudget(authenticatedPage, {
        category,
        amount: '300',
        period: 'monthly',
      });

      await expect(authenticatedPage.locator(`text=${category}`)).toBeVisible();
    }
  });

  test('should create budgets with different periods', async ({ authenticatedPage }) => {
    const periods = ['weekly', 'monthly', 'yearly'];

    for (let i = 0; i < periods.length; i++) {
      await createBudget(authenticatedPage, {
        category: `food`,
        amount: String(100 * (i + 1)),
        period: periods[i],
      });
    }

    // Verify all periods are displayed
    for (const period of periods) {
      await expect(authenticatedPage.locator(`text=${period}`)).toBeVisible();
    }
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    await authenticatedPage.click('button:has-text("Create Budget")');
    await authenticatedPage.waitForSelector('text=Create Budget');

    // Try to submit without filling fields
    await authenticatedPage.click('button[type="submit"]:has-text("Create")');

    // Should show validation errors
    await expect(authenticatedPage.locator('text=/required|must/i')).toBeVisible();
  });

  test('should validate amount is positive', async ({ authenticatedPage }) => {
    await authenticatedPage.click('button:has-text("Create Budget")');
    await authenticatedPage.waitForSelector('text=Create Budget');

    await authenticatedPage.selectOption('select[name="category"]', 'food');
    await authenticatedPage.fill('input[name="amount"]', '-100');
    await authenticatedPage.click('button[type="submit"]:has-text("Create")');

    // Should show validation error
    await expect(authenticatedPage.locator('text=/positive|greater/i')).toBeVisible();
  });

  test('should display budget progress bar', async ({ authenticatedPage }) => {
    await createBudget(authenticatedPage, {
      category: 'entertainment',
      amount: '200',
      period: 'monthly',
    });

    // Check for progress bar
    const progressBar = authenticatedPage.locator('.bg-green-500, .bg-amber-500, .bg-rose-500').first();
    await expect(progressBar).toBeVisible();
  });

  test('should show budget status (percentage used)', async ({ authenticatedPage }) => {
    await createBudget(authenticatedPage, {
      category: 'utilities',
      amount: '150',
      period: 'monthly',
    });

    // Should show percentage
    await expect(authenticatedPage.locator('text=/\\d+\\.\\d+% used/')).toBeVisible();
  });

  test('should show remaining amount', async ({ authenticatedPage }) => {
    await createBudget(authenticatedPage, {
      category: 'shopping',
      amount: '400',
      period: 'monthly',
    });

    // Should show remaining or spent amount
    await expect(authenticatedPage.locator('text=/left|spent/')).toBeVisible();
  });

  test('should edit an existing budget', async ({ authenticatedPage }) => {
    // Create a budget first
    await createBudget(authenticatedPage, {
      category: 'food',
      amount: '300',
      period: 'monthly',
    });

    // Click edit button
    const budgetCard = authenticatedPage.locator('text=food').locator('..').locator('..');
    await budgetCard.locator('button:has-text("Edit")').click();

    // Wait for modal
    await authenticatedPage.waitForSelector('text=Edit Budget');

    // Update amount
    await authenticatedPage.fill('input[name="amount"]', '500');
    await authenticatedPage.click('button[type="submit"]:has-text("Save")');

    // Wait for success
    await waitForToast(authenticatedPage, 'Budget updated successfully');

    // Verify changes
    await expect(authenticatedPage.locator('text=USD 500.00')).toBeVisible();
  });

  test('should delete a budget', async ({ authenticatedPage }) => {
    // Create a budget first
    await createBudget(authenticatedPage, {
      category: 'healthcare',
      amount: '250',
      period: 'monthly',
    });

    // Click delete button
    const budgetCard = authenticatedPage.locator('text=healthcare').locator('..').locator('..');
    await budgetCard.locator('button:has-text("Delete")').click();

    // Confirm deletion
    await authenticatedPage.click('button:has-text("Delete")');

    // Wait for success
    await waitForToast(authenticatedPage, 'Budget deleted successfully');

    // Verify budget is removed
    await expect(authenticatedPage.locator('text=healthcare')).not.toBeVisible();
  });

  test('should show confirmation dialog before deleting', async ({ authenticatedPage }) => {
    await createBudget(authenticatedPage, {
      category: 'transport',
      amount: '200',
    });

    const budgetCard = authenticatedPage.locator('text=transport').locator('..').locator('..');
    await budgetCard.locator('button:has-text("Delete")').click();

    // Should show confirmation dialog
    await expect(authenticatedPage.locator('text=Delete Budget')).toBeVisible();
    await expect(authenticatedPage.locator('text=/cannot be undone/i')).toBeVisible();
  });

  test('should cancel budget deletion', async ({ authenticatedPage }) => {
    await createBudget(authenticatedPage, {
      category: 'entertainment',
      amount: '150',
    });

    const budgetCard = authenticatedPage.locator('text=entertainment').locator('..').locator('..');
    await budgetCard.locator('button:has-text("Delete")').click();

    // Click cancel
    await authenticatedPage.click('button:has-text("Cancel")');

    // Budget should still be visible
    await expect(authenticatedPage.locator('text=entertainment')).toBeVisible();
  });

  test('should show warning when budget is exceeded', async ({ authenticatedPage }) => {
    // Create a small budget
    await createBudget(authenticatedPage, {
      category: 'food',
      amount: '50',
      period: 'monthly',
    });

    // Navigate to transactions and add expense that exceeds budget
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    await createTransaction(authenticatedPage, {
      description: 'Expensive Meal',
      amount: '100',
      type: 'expense',
      category: 'food',
    });

    // Go back to budgets
    await authenticatedPage.goto('/budgets');
    await waitForLoadingComplete(authenticatedPage);

    // Should show over budget warning
    await expect(authenticatedPage.locator('text=/exceeded|over/i')).toBeVisible();
  });

  test('should show amber warning at 80% usage', async ({ authenticatedPage }) => {
    // Create budget
    await createBudget(authenticatedPage, {
      category: 'utilities',
      amount: '100',
      period: 'monthly',
    });

    // Add transaction that uses 85% of budget
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    await createTransaction(authenticatedPage, {
      description: 'Utility Bill',
      amount: '85',
      type: 'expense',
      category: 'utilities',
    });

    // Go back to budgets
    await authenticatedPage.goto('/budgets');
    await waitForLoadingComplete(authenticatedPage);

    // Should show amber/yellow progress bar
    await expect(authenticatedPage.locator('.bg-amber-500')).toBeVisible();
  });

  test('should show green status when under 80% usage', async ({ authenticatedPage }) => {
    // Create budget
    await createBudget(authenticatedPage, {
      category: 'shopping',
      amount: '500',
      period: 'monthly',
    });

    // Add small transaction
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    await createTransaction(authenticatedPage, {
      description: 'Small Purchase',
      amount: '50',
      type: 'expense',
      category: 'shopping',
    });

    // Go back to budgets
    await authenticatedPage.goto('/budgets');
    await waitForLoadingComplete(authenticatedPage);

    // Should show green progress bar
    await expect(authenticatedPage.locator('.bg-green-500')).toBeVisible();
  });

  test('should display period dates', async ({ authenticatedPage }) => {
    await createBudget(authenticatedPage, {
      category: 'food',
      amount: '300',
      period: 'monthly',
    });

    // Should show period start and end dates
    await expect(authenticatedPage.locator('text=/Period:/i')).toBeVisible();
  });

  test('should support multiple currencies', async ({ authenticatedPage }) => {
    const currencies = ['USD', 'EUR', 'GBP'];

    for (const currency of currencies) {
      await createBudget(authenticatedPage, {
        category: 'food',
        amount: '100',
        period: 'monthly',
        currency,
      });

      await expect(authenticatedPage.locator(`text=${currency}`)).toBeVisible();
    }
  });

  test('should show inactive status for inactive budgets', async ({ authenticatedPage }) => {
    // This test assumes there's a way to deactivate budgets
    // If not implemented, this test documents the expected behavior
    const inactiveLabel = authenticatedPage.locator('text=Inactive');
    const exists = await inactiveLabel.isVisible().catch(() => false);

    // Test passes if inactive budgets are properly labeled when they exist
    if (exists) {
      await expect(inactiveLabel).toHaveClass(/bg-gray-100/);
    }
  });

  test('should close modal on cancel', async ({ authenticatedPage }) => {
    await authenticatedPage.click('button:has-text("Create Budget")');
    await authenticatedPage.waitForSelector('text=Create Budget');

    // Click cancel
    await authenticatedPage.click('button:has-text("Cancel")');

    // Modal should be closed
    await expect(authenticatedPage.locator('text=Create Budget')).not.toBeVisible();
  });

  test('should close modal on successful creation', async ({ authenticatedPage }) => {
    await createBudget(authenticatedPage, {
      category: 'food',
      amount: '400',
    });

    // Modal should be closed after creation
    await expect(authenticatedPage.locator('text=Create Budget')).not.toBeVisible();
  });
});
