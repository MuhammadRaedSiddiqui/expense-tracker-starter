import { test as base } from '@playwright/test';

/**
 * Authentication fixture for Playwright tests
 * Provides authenticated context for tests that require login
 */
export const test = base.extend({
  /**
   * Authenticated page fixture
   * Automatically logs in before each test
   */
  authenticatedPage: async ({ page }, use) => {
    // Navigate to sign-in page
    await page.goto('/sign-in');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Wait for Clerk to load (try multiple selectors)
    const clerkLoaded = await Promise.race([
      page.waitForSelector('[data-clerk-loaded]', { timeout: 5000 }).catch(() => null),
      page.waitForSelector('.cl-rootBox', { timeout: 5000 }).catch(() => null),
      page.waitForSelector('input[name="identifier"]', { timeout: 5000 }).catch(() => null),
    ]);

    // Check if already authenticated
    const isAuthenticated = await page.locator('text=Dashboard').isVisible().catch(() => false);

    if (!isAuthenticated) {
      // Fill in credentials (use environment variables in real tests)
      const email = process.env.TEST_USER_EMAIL || 'qa-test-raed3@gmail.com';
      const password = process.env.TEST_USER_PASSWORD || 'Raed@123-123';

      // Wait for identifier input to be ready
      await page.waitForSelector('input[name="identifier"]', { timeout: 10000 });
      await page.fill('input[name="identifier"]', email);

      // Click continue button
      const continueButton = page.locator('button:has-text("Continue")');
      await continueButton.click();

      // Wait for password field
      await page.waitForSelector('input[name="password"]', { timeout: 10000 });
      await page.fill('input[name="password"]', password);

      // Click continue/sign in button
      await page.locator('button:has-text("Continue"), button:has-text("Sign in")').first().click();

      // Wait for redirect (could be dashboard or organization creation)
      await page.waitForLoadState('networkidle', { timeout: 45000 });

      // Check if we need to create an organization
      const needsOrganization = page.url().includes('/organization/create');

      if (needsOrganization) {
        // Fill in organization name
        const orgNameInput = page.locator('input[placeholder*="My Finances"], input[name="organizationName"]');
        await orgNameInput.waitFor({ timeout: 10000 });

        // Clear any pre-filled value and enter test organization name
        await orgNameInput.clear();
        await orgNameInput.fill('Test Organization');

        // Click create organization button
        await page.locator('button:has-text("Create Organization")').click();

        // Wait for redirect to dashboard
        await page.waitForURL('**/dashboard', { timeout: 45000 });
      } else {
        // Already has organization, should be on dashboard
        await page.waitForURL('**/dashboard', { timeout: 45000 });
      }
    }

    await use(page);
  },
});

export { expect } from '@playwright/test';
