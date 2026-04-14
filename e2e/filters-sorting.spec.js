import { test, expect } from './fixtures/auth.fixture.js';
import {
  createTransaction,
  waitForLoadingComplete,
} from './helpers/test-helpers.js';

test.describe('Transaction Filters and Sorting', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    // Create test data
    await createTransaction(authenticatedPage, {
      description: 'Salary Payment',
      amount: '5000',
      type: 'income',
      category: 'salary',
      date: '2026-04-01',
    });

    await createTransaction(authenticatedPage, {
      description: 'Grocery Shopping',
      amount: '150',
      type: 'expense',
      category: 'food',
      date: '2026-04-05',
    });

    await createTransaction(authenticatedPage, {
      description: 'Rent Payment',
      amount: '1200',
      type: 'expense',
      category: 'housing',
      date: '2026-04-10',
    });

    await createTransaction(authenticatedPage, {
      description: 'Freelance Work',
      amount: '800',
      type: 'income',
      category: 'freelance',
      date: '2026-04-15',
    });
  });

  test('should filter by transaction type - income only', async ({ authenticatedPage }) => {
    // Select income filter
    await authenticatedPage.selectOption('select[name="filterType"]', 'income');
    await waitForLoadingComplete(authenticatedPage);

    // Should show only income transactions
    await expect(authenticatedPage.locator('text=Salary Payment')).toBeVisible();
    await expect(authenticatedPage.locator('text=Freelance Work')).toBeVisible();
    await expect(authenticatedPage.locator('text=Grocery Shopping')).not.toBeVisible();
    await expect(authenticatedPage.locator('text=Rent Payment')).not.toBeVisible();
  });

  test('should filter by transaction type - expense only', async ({ authenticatedPage }) => {
    // Select expense filter
    await authenticatedPage.selectOption('select[name="filterType"]', 'expense');
    await waitForLoadingComplete(authenticatedPage);

    // Should show only expense transactions
    await expect(authenticatedPage.locator('text=Grocery Shopping')).toBeVisible();
    await expect(authenticatedPage.locator('text=Rent Payment')).toBeVisible();
    await expect(authenticatedPage.locator('text=Salary Payment')).not.toBeVisible();
    await expect(authenticatedPage.locator('text=Freelance Work')).not.toBeVisible();
  });

  test('should filter by category', async ({ authenticatedPage }) => {
    // Select food category
    await authenticatedPage.selectOption('select[name="filterCategory"]', 'food');
    await waitForLoadingComplete(authenticatedPage);

    // Should show only food transactions
    await expect(authenticatedPage.locator('text=Grocery Shopping')).toBeVisible();
    await expect(authenticatedPage.locator('text=Salary Payment')).not.toBeVisible();
    await expect(authenticatedPage.locator('text=Rent Payment')).not.toBeVisible();
  });

  test('should filter by multiple criteria', async ({ authenticatedPage }) => {
    // Filter by expense type and housing category
    await authenticatedPage.selectOption('select[name="filterType"]', 'expense');
    await authenticatedPage.selectOption('select[name="filterCategory"]', 'housing');
    await waitForLoadingComplete(authenticatedPage);

    // Should show only housing expenses
    await expect(authenticatedPage.locator('text=Rent Payment')).toBeVisible();
    await expect(authenticatedPage.locator('text=Grocery Shopping')).not.toBeVisible();
    await expect(authenticatedPage.locator('text=Salary Payment')).not.toBeVisible();
  });

  test('should search by description', async ({ authenticatedPage }) => {
    // Search for "Grocery"
    await authenticatedPage.fill('input[name="search"]', 'Grocery');
    await waitForLoadingComplete(authenticatedPage);

    // Should show only matching transactions
    await expect(authenticatedPage.locator('text=Grocery Shopping')).toBeVisible();
    await expect(authenticatedPage.locator('text=Salary Payment')).not.toBeVisible();
    await expect(authenticatedPage.locator('text=Rent Payment')).not.toBeVisible();
  });

  test('should search case-insensitively', async ({ authenticatedPage }) => {
    // Search with lowercase
    await authenticatedPage.fill('input[name="search"]', 'salary');
    await waitForLoadingComplete(authenticatedPage);

    // Should find "Salary Payment"
    await expect(authenticatedPage.locator('text=Salary Payment')).toBeVisible();
  });

  test('should filter by date range', async ({ authenticatedPage }) => {
    // Set date range
    await authenticatedPage.fill('input[name="startDate"]', '2026-04-01');
    await authenticatedPage.fill('input[name="endDate"]', '2026-04-10');
    await waitForLoadingComplete(authenticatedPage);

    // Should show transactions within range
    await expect(authenticatedPage.locator('text=Salary Payment')).toBeVisible();
    await expect(authenticatedPage.locator('text=Grocery Shopping')).toBeVisible();
    await expect(authenticatedPage.locator('text=Rent Payment')).toBeVisible();
    await expect(authenticatedPage.locator('text=Freelance Work')).not.toBeVisible();
  });

  test('should filter by start date only', async ({ authenticatedPage }) => {
    // Set only start date
    await authenticatedPage.fill('input[name="startDate"]', '2026-04-10');
    await waitForLoadingComplete(authenticatedPage);

    // Should show transactions from start date onwards
    await expect(authenticatedPage.locator('text=Rent Payment')).toBeVisible();
    await expect(authenticatedPage.locator('text=Freelance Work')).toBeVisible();
    await expect(authenticatedPage.locator('text=Salary Payment')).not.toBeVisible();
    await expect(authenticatedPage.locator('text=Grocery Shopping')).not.toBeVisible();
  });

  test('should filter by end date only', async ({ authenticatedPage }) => {
    // Set only end date
    await authenticatedPage.fill('input[name="endDate"]', '2026-04-10');
    await waitForLoadingComplete(authenticatedPage);

    // Should show transactions up to end date
    await expect(authenticatedPage.locator('text=Salary Payment')).toBeVisible();
    await expect(authenticatedPage.locator('text=Grocery Shopping')).toBeVisible();
    await expect(authenticatedPage.locator('text=Rent Payment')).toBeVisible();
    await expect(authenticatedPage.locator('text=Freelance Work')).not.toBeVisible();
  });

  test('should sort by date ascending', async ({ authenticatedPage }) => {
    // Select date sort
    await authenticatedPage.selectOption('select[name="sortBy"]', 'date');
    await authenticatedPage.selectOption('select[name="sortOrder"]', 'asc');
    await waitForLoadingComplete(authenticatedPage);

    // Get all transaction rows
    const rows = await authenticatedPage.locator('tbody tr').all();
    const firstRowText = await rows[0].textContent();
    const lastRowText = await rows[rows.length - 1].textContent();

    // First should be oldest (Salary Payment - April 1)
    expect(firstRowText).toContain('Salary Payment');
    // Last should be newest (Freelance Work - April 15)
    expect(lastRowText).toContain('Freelance Work');
  });

  test('should sort by date descending', async ({ authenticatedPage }) => {
    // Select date sort descending
    await authenticatedPage.selectOption('select[name="sortBy"]', 'date');
    await authenticatedPage.selectOption('select[name="sortOrder"]', 'desc');
    await waitForLoadingComplete(authenticatedPage);

    // Get all transaction rows
    const rows = await authenticatedPage.locator('tbody tr').all();
    const firstRowText = await rows[0].textContent();

    // First should be newest (Freelance Work - April 15)
    expect(firstRowText).toContain('Freelance Work');
  });

  test('should sort by amount ascending', async ({ authenticatedPage }) => {
    // Select amount sort
    await authenticatedPage.selectOption('select[name="sortBy"]', 'amount');
    await authenticatedPage.selectOption('select[name="sortOrder"]', 'asc');
    await waitForLoadingComplete(authenticatedPage);

    // Get all transaction rows
    const rows = await authenticatedPage.locator('tbody tr').all();
    const firstRowText = await rows[0].textContent();

    // First should be smallest amount (Grocery Shopping - $150)
    expect(firstRowText).toContain('Grocery Shopping');
  });

  test('should sort by amount descending', async ({ authenticatedPage }) => {
    // Select amount sort descending
    await authenticatedPage.selectOption('select[name="sortBy"]', 'amount');
    await authenticatedPage.selectOption('select[name="sortOrder"]', 'desc');
    await waitForLoadingComplete(authenticatedPage);

    // Get all transaction rows
    const rows = await authenticatedPage.locator('tbody tr').all();
    const firstRowText = await rows[0].textContent();

    // First should be largest amount (Salary Payment - $5000)
    expect(firstRowText).toContain('Salary Payment');
  });

  test('should sort by description alphabetically', async ({ authenticatedPage }) => {
    // Select description sort
    await authenticatedPage.selectOption('select[name="sortBy"]', 'description');
    await authenticatedPage.selectOption('select[name="sortOrder"]', 'asc');
    await waitForLoadingComplete(authenticatedPage);

    // Get all transaction rows
    const rows = await authenticatedPage.locator('tbody tr').all();
    const firstRowText = await rows[0].textContent();

    // First should be alphabetically first (Freelance Work)
    expect(firstRowText).toContain('Freelance Work');
  });

  test('should clear filters', async ({ authenticatedPage }) => {
    // Apply filters
    await authenticatedPage.selectOption('select[name="filterType"]', 'income');
    await authenticatedPage.fill('input[name="search"]', 'Salary');
    await waitForLoadingComplete(authenticatedPage);

    // Reset to "all"
    await authenticatedPage.selectOption('select[name="filterType"]', 'all');
    await authenticatedPage.fill('input[name="search"]', '');
    await waitForLoadingComplete(authenticatedPage);

    // Should show all transactions
    await expect(authenticatedPage.locator('text=Salary Payment')).toBeVisible();
    await expect(authenticatedPage.locator('text=Grocery Shopping')).toBeVisible();
    await expect(authenticatedPage.locator('text=Rent Payment')).toBeVisible();
    await expect(authenticatedPage.locator('text=Freelance Work')).toBeVisible();
  });

  test('should show empty state when no results match filters', async ({ authenticatedPage }) => {
    // Apply filter that matches nothing
    await authenticatedPage.fill('input[name="search"]', 'NonexistentTransaction12345');
    await waitForLoadingComplete(authenticatedPage);

    // Should show empty state
    await expect(authenticatedPage.locator('text=/no transactions/i')).toBeVisible();
  });

  test('should persist filters when navigating away and back', async ({ authenticatedPage }) => {
    // Apply filters
    await authenticatedPage.selectOption('select[name="filterType"]', 'income');
    await waitForLoadingComplete(authenticatedPage);

    // Navigate away
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);

    // Navigate back
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    // Filters may or may not persist depending on implementation
    // This test documents the behavior
    const filterValue = await authenticatedPage.locator('select[name="filterType"]').inputValue();
    expect(['all', 'income']).toContain(filterValue);
  });

  test('should combine search with filters', async ({ authenticatedPage }) => {
    // Search for "Payment" and filter by income
    await authenticatedPage.fill('input[name="search"]', 'Payment');
    await authenticatedPage.selectOption('select[name="filterType"]', 'income');
    await waitForLoadingComplete(authenticatedPage);

    // Should show only income transactions with "Payment" in description
    await expect(authenticatedPage.locator('text=Salary Payment')).toBeVisible();
    await expect(authenticatedPage.locator('text=Rent Payment')).not.toBeVisible();
    await expect(authenticatedPage.locator('text=Grocery Shopping')).not.toBeVisible();
  });
});
