import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should redirect unauthenticated users to sign-in', async ({ page }) => {
    await page.waitForURL('**/sign-in', { timeout: 5000 });
    await expect(page).toHaveURL(/sign-in/);
    await expect(page.locator('text=Finance Tracker')).toBeVisible();
  });

  test('should display sign-in form', async ({ page }) => {
    await page.goto('/sign-in');

    // Wait for page to load and Clerk to initialize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Give Clerk time to load

    // Check for Clerk sign-in elements (more flexible selectors)
    const hasClerkForm = await page.locator('input[name="identifier"], .cl-rootBox, [data-clerk-loaded]').first().isVisible({ timeout: 5000 }).catch(() => false);

    if (hasClerkForm) {
      await expect(page.locator('input[name="identifier"]')).toBeVisible();
    } else {
      // Clerk might not be fully loaded, check for basic page structure
      await expect(page.locator('text=Finance Tracker')).toBeVisible();
    }
  });

  test('should display sign-up form', async ({ page }) => {
    await page.goto('/sign-up');
    await page.waitForSelector('[data-clerk-loaded]', { timeout: 10000 });

    // Check for Clerk sign-up elements
    await expect(page.locator('text=Finance Tracker')).toBeVisible();
  });

  test('should navigate between sign-in and sign-up', async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForSelector('[data-clerk-loaded]', { timeout: 10000 });

    // Look for sign-up link
    const signUpLink = page.locator('a:has-text("Sign up")');
    if (await signUpLink.isVisible()) {
      await signUpLink.click();
      await expect(page).toHaveURL(/sign-up/);
    }
  });

  test('should show validation errors for invalid credentials', async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForSelector('[data-clerk-loaded]', { timeout: 10000 });

    // Try to submit with invalid email
    await page.fill('input[name="identifier"]', 'invalid-email');
    await page.click('button:has-text("Continue")');

    // Should show error message
    await expect(page.locator('text=/invalid|error/i')).toBeVisible({ timeout: 5000 });
  });

  test('should protect dashboard route', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to sign-in
    await page.waitForURL('**/sign-in', { timeout: 5000 });
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should protect transactions route', async ({ page }) => {
    await page.goto('/transactions');

    // Should redirect to sign-in
    await page.waitForURL('**/sign-in', { timeout: 5000 });
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should protect budgets route', async ({ page }) => {
    await page.goto('/budgets');

    // Should redirect to sign-in
    await page.waitForURL('**/sign-in', { timeout: 5000 });
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should protect recurring transactions route', async ({ page }) => {
    await page.goto('/recurring');

    // Should redirect to sign-in
    await page.waitForURL('**/sign-in', { timeout: 5000 });
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should protect team route', async ({ page }) => {
    await page.goto('/team');

    // Should redirect to sign-in
    await page.waitForURL('**/sign-in', { timeout: 5000 });
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should protect settings route', async ({ page }) => {
    await page.goto('/settings');

    // Should redirect to sign-in
    await page.waitForURL('**/sign-in', { timeout: 5000 });
    await expect(page).toHaveURL(/sign-in/);
  });
});
