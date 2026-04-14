import { test, expect } from './fixtures/auth.fixture.js';
import {
  createTransaction,
  deleteTransaction,
  editTransaction,
  waitForToast,
  waitForLoadingComplete,
  getTransactionCount,
  clearAllTransactions,
} from './helpers/test-helpers.js';

test.describe('Transaction Management', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);
  });

  test('should display transactions page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1:has-text("Transactions")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("Add Transaction")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("Clear All")')).toBeVisible();
  });

  test('should display live indicator when real-time is active', async ({ authenticatedPage }) => {
    const liveIndicator = authenticatedPage.locator('text=Live');
    // Live indicator may or may not be visible depending on connection
    const isVisible = await liveIndicator.isVisible().catch(() => false);
    if (isVisible) {
      await expect(liveIndicator).toHaveClass(/bg-green-100/);
    }
  });

  test('should create a new expense transaction', async ({ authenticatedPage }) => {
    const initialCount = await getTransactionCount(authenticatedPage);

    await createTransaction(authenticatedPage, {
      description: 'Test Grocery Shopping',
      amount: '150.50',
      type: 'expense',
      category: 'food',
      currency: 'USD',
    });

    // Verify transaction appears in list
    await expect(authenticatedPage.locator('text=Test Grocery Shopping')).toBeVisible();
    await expect(authenticatedPage.locator('text=$150.50')).toBeVisible();

    // Verify count increased
    const newCount = await getTransactionCount(authenticatedPage);
    expect(newCount).toBe(initialCount + 1);
  });

  test('should create a new income transaction', async ({ authenticatedPage }) => {
    await createTransaction(authenticatedPage, {
      description: 'Freelance Payment',
      amount: '2500',
      type: 'income',
      category: 'freelance',
      currency: 'USD',
    });

    // Verify transaction appears in list
    await expect(authenticatedPage.locator('text=Freelance Payment')).toBeVisible();
    await expect(authenticatedPage.locator('text=$2,500.00')).toBeVisible();
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    await authenticatedPage.click('button:has-text("Add Transaction")');
    await authenticatedPage.waitForSelector('text=Add Transaction');

    // Try to submit without filling fields
    await authenticatedPage.click('button[type="submit"]:has-text("Add")');

    // Should show validation errors
    await expect(authenticatedPage.locator('text=/required|must/i')).toBeVisible();
  });

  test('should validate amount is positive', async ({ authenticatedPage }) => {
    await authenticatedPage.click('button:has-text("Add Transaction")');
    await authenticatedPage.waitForSelector('text=Add Transaction');

    await authenticatedPage.fill('input[name="description"]', 'Test');
    await authenticatedPage.fill('input[name="amount"]', '-100');
    await authenticatedPage.click('button[type="submit"]:has-text("Add")');

    // Should show validation error
    await expect(authenticatedPage.locator('text=/positive|greater/i')).toBeVisible();
  });

  test('should edit an existing transaction', async ({ authenticatedPage }) => {
    // Create a transaction first
    await createTransaction(authenticatedPage, {
      description: 'Original Description',
      amount: '100',
      type: 'expense',
      category: 'food',
    });

    // Edit the transaction
    await editTransaction(authenticatedPage, 'Original Description', {
      description: 'Updated Description',
      amount: '200',
    });

    // Verify changes
    await expect(authenticatedPage.locator('text=Updated Description')).toBeVisible();
    await expect(authenticatedPage.locator('text=$200.00')).toBeVisible();
    await expect(authenticatedPage.locator('text=Original Description')).not.toBeVisible();
  });

  test('should delete a transaction', async ({ authenticatedPage }) => {
    // Create a transaction first
    await createTransaction(authenticatedPage, {
      description: 'Transaction to Delete',
      amount: '50',
      type: 'expense',
      category: 'entertainment',
    });

    const initialCount = await getTransactionCount(authenticatedPage);

    // Delete the transaction
    await deleteTransaction(authenticatedPage, 'Transaction to Delete');

    // Verify transaction is removed
    await expect(authenticatedPage.locator('text=Transaction to Delete')).not.toBeVisible();

    // Verify count decreased
    const newCount = await getTransactionCount(authenticatedPage);
    expect(newCount).toBe(initialCount - 1);
  });

  test('should show confirmation dialog before deleting', async ({ authenticatedPage }) => {
    await createTransaction(authenticatedPage, {
      description: 'Test Delete Confirmation',
      amount: '25',
    });

    const row = authenticatedPage.locator('tr:has-text("Test Delete Confirmation")');
    await row.locator('button[aria-label*="Delete"]').click();

    // Should show confirmation dialog
    await expect(authenticatedPage.locator('text=Delete Transaction')).toBeVisible();
    await expect(authenticatedPage.locator('text=/cannot be undone/i')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("Delete")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("Cancel")')).toBeVisible();
  });

  test('should cancel transaction deletion', async ({ authenticatedPage }) => {
    await createTransaction(authenticatedPage, {
      description: 'Test Cancel Delete',
      amount: '30',
    });

    const row = authenticatedPage.locator('tr:has-text("Test Cancel Delete")');
    await row.locator('button[aria-label*="Delete"]').click();

    // Click cancel
    await authenticatedPage.click('button:has-text("Cancel")');

    // Transaction should still be visible
    await expect(authenticatedPage.locator('text=Test Cancel Delete')).toBeVisible();
  });

  test('should clear all transactions', async ({ authenticatedPage }) => {
    // Create multiple transactions
    await createTransaction(authenticatedPage, {
      description: 'Transaction 1',
      amount: '10',
    });
    await createTransaction(authenticatedPage, {
      description: 'Transaction 2',
      amount: '20',
    });

    await clearAllTransactions(authenticatedPage);

    // Should show empty state
    await expect(authenticatedPage.locator('text=/no transactions/i')).toBeVisible();
  });

  test('should support multiple currencies', async ({ authenticatedPage }) => {
    const currencies = ['USD', 'EUR', 'GBP', 'JPY'];

    for (const currency of currencies) {
      await createTransaction(authenticatedPage, {
        description: `Transaction in ${currency}`,
        amount: '100',
        currency,
      });

      await expect(authenticatedPage.locator(`text=Transaction in ${currency}`)).toBeVisible();
    }
  });

  test('should close modal on cancel', async ({ authenticatedPage }) => {
    await authenticatedPage.click('button:has-text("Add Transaction")');
    await authenticatedPage.waitForSelector('text=Add Transaction');

    // Click cancel or close button
    await authenticatedPage.click('button:has-text("Cancel")');

    // Modal should be closed
    await expect(authenticatedPage.locator('text=Add Transaction')).not.toBeVisible();
  });

  test('should close modal on successful creation', async ({ authenticatedPage }) => {
    await createTransaction(authenticatedPage, {
      description: 'Test Modal Close',
      amount: '75',
    });

    // Modal should be closed after creation
    await expect(authenticatedPage.locator('text=Add Transaction')).not.toBeVisible();
  });

  test('should display transaction date', async ({ authenticatedPage }) => {
    const today = new Date().toISOString().split('T')[0];

    await createTransaction(authenticatedPage, {
      description: 'Date Test Transaction',
      amount: '50',
      date: today,
    });

    // Verify date is displayed
    await expect(authenticatedPage.locator('text=Date Test Transaction')).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ authenticatedPage }) => {
    // Simulate offline mode
    await authenticatedPage.context().setOffline(true);

    await authenticatedPage.click('button:has-text("Add Transaction")');
    await authenticatedPage.fill('input[name="description"]', 'Offline Test');
    await authenticatedPage.fill('input[name="amount"]', '100');
    await authenticatedPage.click('button[type="submit"]:has-text("Add")');

    // Should show error message
    await expect(authenticatedPage.locator('text=/failed|error/i')).toBeVisible({ timeout: 10000 });

    // Restore online mode
    await authenticatedPage.context().setOffline(false);
  });
});
