/**
 * Test helper functions for Playwright e2e tests
 */

/**
 * Wait for toast notification to appear
 * @param {import('@playwright/test').Page} page
 * @param {string} message - Expected toast message
 * @param {string} type - Toast type: 'success', 'error', 'info'
 */
export async function waitForToast(page, message, type = 'success') {
  const toastSelector = `[role="alert"]:has-text("${message}")`;
  await page.waitForSelector(toastSelector, { timeout: 5000 });
  return page.locator(toastSelector);
}

/**
 * Create a test transaction
 * @param {import('@playwright/test').Page} page
 * @param {Object} transaction
 */
export async function createTransaction(page, transaction) {
  const {
    description = 'Test Transaction',
    amount = '100',
    type = 'expense',
    category = 'food',
    date = new Date().toISOString().split('T')[0],
    currency = 'USD',
  } = transaction;

  // Click Add Transaction button
  await page.click('button:has-text("Add Transaction")');

  // Wait for modal
  await page.waitForSelector('text=Add Transaction');

  // Fill form
  await page.fill('input[name="description"]', description);
  await page.fill('input[name="amount"]', amount);
  await page.selectOption('select[name="type"]', type);
  await page.selectOption('select[name="category"]', category);
  await page.fill('input[name="date"]', date);
  await page.selectOption('select[name="currency"]', currency);

  // Submit
  await page.click('button[type="submit"]:has-text("Add")');

  // Wait for success toast
  await waitForToast(page, 'Transaction added successfully');
}

/**
 * Delete a transaction by description
 * @param {import('@playwright/test').Page} page
 * @param {string} description
 */
export async function deleteTransaction(page, description) {
  // Find transaction row and click delete
  const row = page.locator(`tr:has-text("${description}")`);
  await row.locator('button[aria-label*="Delete"]').click();

  // Confirm deletion
  await page.click('button:has-text("Delete")');

  // Wait for success toast
  await waitForToast(page, 'Transaction deleted successfully');
}

/**
 * Edit a transaction
 * @param {import('@playwright/test').Page} page
 * @param {string} originalDescription
 * @param {Object} updates
 */
export async function editTransaction(page, originalDescription, updates) {
  // Find transaction row and click edit
  const row = page.locator(`tr:has-text("${originalDescription}")`);
  await row.locator('button[aria-label*="Edit"]').click();

  // Update fields
  if (updates.description) {
    await page.fill('input[name="description"]', updates.description);
  }
  if (updates.amount) {
    await page.fill('input[name="amount"]', updates.amount);
  }
  if (updates.type) {
    await page.selectOption('select[name="type"]', updates.type);
  }
  if (updates.category) {
    await page.selectOption('select[name="category"]', updates.category);
  }

  // Save
  await page.click('button:has-text("Save")');

  // Wait for success toast
  await waitForToast(page, 'Transaction updated successfully');
}

/**
 * Create a budget
 * @param {import('@playwright/test').Page} page
 * @param {Object} budget
 */
export async function createBudget(page, budget) {
  const {
    category = 'food',
    amount = '500',
    period = 'monthly',
    currency = 'USD',
  } = budget;

  // Click Create Budget button
  await page.click('button:has-text("Create Budget")');

  // Wait for modal
  await page.waitForSelector('text=Create Budget');

  // Fill form
  await page.selectOption('select[name="category"]', category);
  await page.fill('input[name="amount"]', amount);
  await page.selectOption('select[name="period"]', period);
  await page.selectOption('select[name="currency"]', currency);

  // Submit
  await page.click('button[type="submit"]:has-text("Create")');

  // Wait for success toast
  await waitForToast(page, 'Budget created successfully');
}

/**
 * Create a recurring transaction
 * @param {import('@playwright/test').Page} page
 * @param {Object} recurring
 */
export async function createRecurringTransaction(page, recurring) {
  const {
    description = 'Test Recurring',
    amount = '50',
    type = 'expense',
    category = 'utilities',
    frequency = 'monthly',
    interval = '1',
    startDate = new Date().toISOString().split('T')[0],
    currency = 'USD',
  } = recurring;

  // Click Add Recurring Transaction button
  await page.click('button:has-text("Add Recurring Transaction")');

  // Wait for modal
  await page.waitForSelector('text=Add Recurring Transaction');

  // Fill form
  await page.fill('input[name="description"]', description);
  await page.fill('input[name="amount"]', amount);
  await page.selectOption('select[name="type"]', type);
  await page.selectOption('select[name="category"]', category);
  await page.selectOption('select[name="frequency"]', frequency);
  await page.fill('input[name="interval"]', interval);
  await page.fill('input[name="startDate"]', startDate);
  await page.selectOption('select[name="currency"]', currency);

  // Submit
  await page.click('button[type="submit"]:has-text("Create")');

  // Wait for success toast
  await waitForToast(page, 'Recurring transaction created successfully');
}

/**
 * Wait for loading to complete
 * @param {import('@playwright/test').Page} page
 */
export async function waitForLoadingComplete(page) {
  // Wait for skeleton loaders to disappear
  await page.waitForSelector('[data-testid="skeleton"]', { state: 'hidden', timeout: 10000 }).catch(() => {});

  // Wait for any loading spinners to disappear
  await page.waitForSelector('.animate-spin', { state: 'hidden', timeout: 10000 }).catch(() => {});
}

/**
 * Get transaction count from table
 * @param {import('@playwright/test').Page} page
 */
export async function getTransactionCount(page) {
  const rows = await page.locator('tbody tr').count();
  return rows;
}

/**
 * Clear all transactions
 * @param {import('@playwright/test').Page} page
 */
export async function clearAllTransactions(page) {
  await page.click('button:has-text("Clear All")');
  await page.click('button:has-text("Clear All")'); // Confirm
  await waitForToast(page, 'All transactions deleted successfully');
}
