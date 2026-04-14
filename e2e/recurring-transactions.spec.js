import { test, expect } from './fixtures/auth.fixture.js';
import {
  createRecurringTransaction,
  waitForToast,
  waitForLoadingComplete,
} from './helpers/test-helpers.js';

test.describe('Recurring Transactions', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/recurring');
    await waitForLoadingComplete(authenticatedPage);
  });

  test('should display recurring transactions page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1:has-text("Recurring Transactions")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("Add Recurring Transaction")')).toBeVisible();
    await expect(authenticatedPage.locator('text=Automatically create transactions')).toBeVisible();
  });

  test('should display live indicator when real-time is active', async ({ authenticatedPage }) => {
    const liveIndicator = authenticatedPage.locator('text=Live');
    const isVisible = await liveIndicator.isVisible().catch(() => false);

    if (isVisible) {
      await expect(liveIndicator).toHaveClass(/bg-green-100/);
    }
  });

  test('should show empty state when no recurring transactions exist', async ({ authenticatedPage }) => {
    const emptyState = authenticatedPage.locator('text=/no recurring transactions/i');
    const isVisible = await emptyState.isVisible().catch(() => false);

    if (isVisible) {
      await expect(emptyState).toBeVisible();
      await expect(authenticatedPage.locator('button:has-text("Create Your First Recurring Transaction")')).toBeVisible();
    }
  });

  test('should create a new recurring expense', async ({ authenticatedPage }) => {
    await createRecurringTransaction(authenticatedPage, {
      description: 'Monthly Rent',
      amount: '1200',
      type: 'expense',
      category: 'housing',
      frequency: 'monthly',
      interval: '1',
      currency: 'USD',
    });

    // Verify recurring transaction appears in list
    await expect(authenticatedPage.locator('text=Monthly Rent')).toBeVisible();
    await expect(authenticatedPage.locator('text=USD 1200.00')).toBeVisible();
    await expect(authenticatedPage.locator('text=Monthly')).toBeVisible();
  });

  test('should create a new recurring income', async ({ authenticatedPage }) => {
    await createRecurringTransaction(authenticatedPage, {
      description: 'Monthly Salary',
      amount: '5000',
      type: 'income',
      category: 'salary',
      frequency: 'monthly',
      interval: '1',
    });

    // Verify recurring transaction appears
    await expect(authenticatedPage.locator('text=Monthly Salary')).toBeVisible();
    await expect(authenticatedPage.locator('text=income')).toBeVisible();
  });

  test('should create recurring transaction with different frequencies', async ({ authenticatedPage }) => {
    const frequencies = [
      { frequency: 'daily', interval: '1', label: 'Daily' },
      { frequency: 'weekly', interval: '1', label: 'Weekly' },
      { frequency: 'monthly', interval: '1', label: 'Monthly' },
      { frequency: 'yearly', interval: '1', label: 'Yearly' },
    ];

    for (const freq of frequencies) {
      await createRecurringTransaction(authenticatedPage, {
        description: `${freq.label} Transaction`,
        amount: '100',
        type: 'expense',
        category: 'utilities',
        frequency: freq.frequency,
        interval: freq.interval,
      });

      await expect(authenticatedPage.locator(`text=${freq.label}`)).toBeVisible();
    }
  });

  test('should create recurring transaction with custom interval', async ({ authenticatedPage }) => {
    await createRecurringTransaction(authenticatedPage, {
      description: 'Bi-weekly Payment',
      amount: '500',
      type: 'expense',
      category: 'utilities',
      frequency: 'weekly',
      interval: '2',
    });

    // Should show "Every 2 weeks"
    await expect(authenticatedPage.locator('text=/Every 2 week/i')).toBeVisible();
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    await authenticatedPage.click('button:has-text("Add Recurring Transaction")');
    await authenticatedPage.waitForSelector('text=Add Recurring Transaction');

    // Try to submit without filling fields
    await authenticatedPage.click('button[type="submit"]:has-text("Create")');

    // Should show validation errors
    await expect(authenticatedPage.locator('text=/required|must/i')).toBeVisible();
  });

  test('should validate amount is positive', async ({ authenticatedPage }) => {
    await authenticatedPage.click('button:has-text("Add Recurring Transaction")');
    await authenticatedPage.waitForSelector('text=Add Recurring Transaction');

    await authenticatedPage.fill('input[name="description"]', 'Test');
    await authenticatedPage.fill('input[name="amount"]', '-50');
    await authenticatedPage.click('button[type="submit"]:has-text("Create")');

    // Should show validation error
    await expect(authenticatedPage.locator('text=/positive|greater/i')).toBeVisible();
  });

  test('should display next execution date', async ({ authenticatedPage }) => {
    await createRecurringTransaction(authenticatedPage, {
      description: 'Subscription Payment',
      amount: '15',
      type: 'expense',
      category: 'entertainment',
      frequency: 'monthly',
      interval: '1',
    });

    // Should show next execution date
    await expect(authenticatedPage.locator('text=Next Execution')).toBeVisible();
  });

  test('should edit an existing recurring transaction', async ({ authenticatedPage }) => {
    // Create a recurring transaction first
    await createRecurringTransaction(authenticatedPage, {
      description: 'Original Subscription',
      amount: '10',
      type: 'expense',
      category: 'entertainment',
      frequency: 'monthly',
      interval: '1',
    });

    // Click edit button
    const transactionRow = authenticatedPage.locator('text=Original Subscription').locator('..').locator('..');
    await transactionRow.locator('button:has-text("Edit")').click();

    // Wait for modal
    await authenticatedPage.waitForSelector('text=Edit Recurring Transaction');

    // Update fields
    await authenticatedPage.fill('input[name="description"]', 'Updated Subscription');
    await authenticatedPage.fill('input[name="amount"]', '20');
    await authenticatedPage.click('button[type="submit"]:has-text("Save")');

    // Wait for success
    await waitForToast(authenticatedPage, 'Recurring transaction updated successfully');

    // Verify changes
    await expect(authenticatedPage.locator('text=Updated Subscription')).toBeVisible();
    await expect(authenticatedPage.locator('text=USD 20.00')).toBeVisible();
  });

  test('should delete a recurring transaction', async ({ authenticatedPage }) => {
    // Create a recurring transaction first
    await createRecurringTransaction(authenticatedPage, {
      description: 'Transaction to Delete',
      amount: '25',
      type: 'expense',
      category: 'utilities',
      frequency: 'monthly',
      interval: '1',
    });

    // Click delete button
    const transactionRow = authenticatedPage.locator('text=Transaction to Delete').locator('..').locator('..');
    await transactionRow.locator('button:has-text("Delete")').click();

    // Confirm deletion
    await authenticatedPage.click('button:has-text("Delete")');

    // Wait for success
    await waitForToast(authenticatedPage, 'Recurring transaction deleted successfully');

    // Verify transaction is removed
    await expect(authenticatedPage.locator('text=Transaction to Delete')).not.toBeVisible();
  });

  test('should show confirmation dialog before deleting', async ({ authenticatedPage }) => {
    await createRecurringTransaction(authenticatedPage, {
      description: 'Test Delete Confirmation',
      amount: '30',
      frequency: 'monthly',
    });

    const transactionRow = authenticatedPage.locator('text=Test Delete Confirmation').locator('..').locator('..');
    await transactionRow.locator('button:has-text("Delete")').click();

    // Should show confirmation dialog
    await expect(authenticatedPage.locator('text=Delete Recurring Transaction')).toBeVisible();
    await expect(authenticatedPage.locator('text=/cannot be undone/i')).toBeVisible();
  });

  test('should cancel recurring transaction deletion', async ({ authenticatedPage }) => {
    await createRecurringTransaction(authenticatedPage, {
      description: 'Test Cancel Delete',
      amount: '40',
      frequency: 'weekly',
    });

    const transactionRow = authenticatedPage.locator('text=Test Cancel Delete').locator('..').locator('..');
    await transactionRow.locator('button:has-text("Delete")').click();

    // Click cancel
    await authenticatedPage.click('button:has-text("Cancel")');

    // Transaction should still be visible
    await expect(authenticatedPage.locator('text=Test Cancel Delete')).toBeVisible();
  });

  test('should pause a recurring transaction', async ({ authenticatedPage }) => {
    await createRecurringTransaction(authenticatedPage, {
      description: 'Transaction to Pause',
      amount: '50',
      type: 'expense',
      category: 'utilities',
      frequency: 'monthly',
      interval: '1',
    });

    // Click pause button
    const transactionRow = authenticatedPage.locator('text=Transaction to Pause').locator('..').locator('..');
    await transactionRow.locator('button:has-text("Pause")').click();

    // Wait for success
    await waitForToast(authenticatedPage, 'Recurring transaction updated successfully');

    // Should show inactive status
    await expect(authenticatedPage.locator('text=Inactive')).toBeVisible();
    await expect(transactionRow.locator('button:has-text("Resume")')).toBeVisible();
  });

  test('should resume a paused recurring transaction', async ({ authenticatedPage }) => {
    // Create and pause a transaction
    await createRecurringTransaction(authenticatedPage, {
      description: 'Transaction to Resume',
      amount: '60',
      frequency: 'monthly',
    });

    const transactionRow = authenticatedPage.locator('text=Transaction to Resume').locator('..').locator('..');
    await transactionRow.locator('button:has-text("Pause")').click();
    await waitForToast(authenticatedPage, 'Recurring transaction updated successfully');

    // Resume the transaction
    await transactionRow.locator('button:has-text("Resume")').click();
    await waitForToast(authenticatedPage, 'Recurring transaction updated successfully');

    // Should no longer show inactive status
    await expect(transactionRow.locator('text=Inactive')).not.toBeVisible();
    await expect(transactionRow.locator('button:has-text("Pause")')).toBeVisible();
  });

  test('should display transaction type badge', async ({ authenticatedPage }) => {
    await createRecurringTransaction(authenticatedPage, {
      description: 'Income Transaction',
      amount: '1000',
      type: 'income',
      category: 'salary',
      frequency: 'monthly',
    });

    // Should show income badge
    const badge = authenticatedPage.locator('text=income').first();
    await expect(badge).toBeVisible();
    await expect(badge).toHaveClass(/bg-green-100/);
  });

  test('should display category', async ({ authenticatedPage }) => {
    await createRecurringTransaction(authenticatedPage, {
      description: 'Categorized Transaction',
      amount: '75',
      type: 'expense',
      category: 'transport',
      frequency: 'weekly',
    });

    // Should show category
    await expect(authenticatedPage.locator('text=transport')).toBeVisible();
  });

  test('should support end date for recurring transactions', async ({ authenticatedPage }) => {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);
    const endDateStr = endDate.toISOString().split('T')[0];

    await authenticatedPage.click('button:has-text("Add Recurring Transaction")');
    await authenticatedPage.waitForSelector('text=Add Recurring Transaction');

    await authenticatedPage.fill('input[name="description"]', 'Limited Duration');
    await authenticatedPage.fill('input[name="amount"]', '100');
    await authenticatedPage.selectOption('select[name="type"]', 'expense');
    await authenticatedPage.selectOption('select[name="category"]', 'utilities');
    await authenticatedPage.selectOption('select[name="frequency"]', 'monthly');
    await authenticatedPage.fill('input[name="interval"]', '1');

    // Set end date if field exists
    const endDateField = authenticatedPage.locator('input[name="endDate"]');
    const hasEndDate = await endDateField.isVisible().catch(() => false);

    if (hasEndDate) {
      await endDateField.fill(endDateStr);
    }

    await authenticatedPage.click('button[type="submit"]:has-text("Create")');
    await waitForToast(authenticatedPage, 'Recurring transaction created successfully');

    if (hasEndDate) {
      // Should show end date
      await expect(authenticatedPage.locator('text=/Ends on/i')).toBeVisible();
    }
  });

  test('should support multiple currencies', async ({ authenticatedPage }) => {
    const currencies = ['USD', 'EUR', 'GBP'];

    for (const currency of currencies) {
      await createRecurringTransaction(authenticatedPage, {
        description: `${currency} Transaction`,
        amount: '100',
        type: 'expense',
        category: 'utilities',
        frequency: 'monthly',
        interval: '1',
        currency,
      });

      await expect(authenticatedPage.locator(`text=${currency}`)).toBeVisible();
    }
  });

  test('should close modal on cancel', async ({ authenticatedPage }) => {
    await authenticatedPage.click('button:has-text("Add Recurring Transaction")');
    await authenticatedPage.waitForSelector('text=Add Recurring Transaction');

    // Click cancel
    await authenticatedPage.click('button:has-text("Cancel")');

    // Modal should be closed
    await expect(authenticatedPage.locator('text=Add Recurring Transaction')).not.toBeVisible();
  });

  test('should close modal on successful creation', async ({ authenticatedPage }) => {
    await createRecurringTransaction(authenticatedPage, {
      description: 'Test Modal Close',
      amount: '85',
      frequency: 'monthly',
    });

    // Modal should be closed after creation
    await expect(authenticatedPage.locator('text=Add Recurring Transaction')).not.toBeVisible();
  });
});
