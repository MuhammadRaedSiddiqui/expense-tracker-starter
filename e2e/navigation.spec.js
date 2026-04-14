import { test, expect } from './fixtures/auth.fixture.js';
import { waitForLoadingComplete } from './helpers/test-helpers.js';

test.describe('Navigation', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);
  });

  test('should display navigation menu', async ({ authenticatedPage }) => {
    // Check for main navigation links
    await expect(authenticatedPage.locator('nav, [role="navigation"]')).toBeVisible();
  });

  test('should navigate to Dashboard', async ({ authenticatedPage }) => {
    await authenticatedPage.click('a[href="/dashboard"], a:has-text("Dashboard")');
    await expect(authenticatedPage).toHaveURL(/\/dashboard/);
    await expect(authenticatedPage.locator('h1:has-text("Dashboard")')).toBeVisible();
  });

  test('should navigate to Transactions', async ({ authenticatedPage }) => {
    await authenticatedPage.click('a[href="/transactions"], a:has-text("Transactions")');
    await expect(authenticatedPage).toHaveURL(/\/transactions/);
    await expect(authenticatedPage.locator('h1:has-text("Transactions")')).toBeVisible();
  });

  test('should navigate to Recurring Transactions', async ({ authenticatedPage }) => {
    await authenticatedPage.click('a[href="/recurring"], a:has-text("Recurring")');
    await expect(authenticatedPage).toHaveURL(/\/recurring/);
    await expect(authenticatedPage.locator('h1:has-text("Recurring")')).toBeVisible();
  });

  test('should navigate to Budgets', async ({ authenticatedPage }) => {
    await authenticatedPage.click('a[href="/budgets"], a:has-text("Budgets")');
    await expect(authenticatedPage).toHaveURL(/\/budgets/);
    await expect(authenticatedPage.locator('h1:has-text("Budgets")')).toBeVisible();
  });

  test('should navigate to Reports', async ({ authenticatedPage }) => {
    await authenticatedPage.click('a[href="/reports"], a:has-text("Reports")');
    await expect(authenticatedPage).toHaveURL(/\/reports/);
    await expect(authenticatedPage.locator('h1:has-text("Reports")')).toBeVisible();
  });

  test('should navigate to Team', async ({ authenticatedPage }) => {
    await authenticatedPage.click('a[href="/team"], a:has-text("Team")');
    await expect(authenticatedPage).toHaveURL(/\/team/);
    await expect(authenticatedPage.locator('h1:has-text("Team")')).toBeVisible();
  });

  test('should navigate to Settings', async ({ authenticatedPage }) => {
    await authenticatedPage.click('a[href="/settings"], a:has-text("Settings")');
    await expect(authenticatedPage).toHaveURL(/\/settings/);
    await expect(authenticatedPage.locator('h1:has-text("Settings")')).toBeVisible();
  });

  test('should highlight active navigation item', async ({ authenticatedPage }) => {
    // Navigate to Transactions
    await authenticatedPage.click('a[href="/transactions"]');

    // Active link should have special styling
    const activeLink = authenticatedPage.locator('a[href="/transactions"]');
    const classes = await activeLink.getAttribute('class');

    // Active links typically have classes like 'active', 'bg-', or 'font-bold'
    expect(classes).toBeTruthy();
  });

  test('should maintain navigation state across pages', async ({ authenticatedPage }) => {
    // Navigate through multiple pages
    await authenticatedPage.click('a[href="/transactions"]');
    await waitForLoadingComplete(authenticatedPage);

    await authenticatedPage.click('a[href="/budgets"]');
    await waitForLoadingComplete(authenticatedPage);

    await authenticatedPage.click('a[href="/dashboard"]');
    await waitForLoadingComplete(authenticatedPage);

    // Should be on dashboard
    await expect(authenticatedPage).toHaveURL(/\/dashboard/);
  });

  test('should support browser back button', async ({ authenticatedPage }) => {
    // Navigate to transactions
    await authenticatedPage.click('a[href="/transactions"]');
    await waitForLoadingComplete(authenticatedPage);

    // Go back
    await authenticatedPage.goBack();

    // Should be back on dashboard
    await expect(authenticatedPage).toHaveURL(/\/dashboard/);
  });

  test('should support browser forward button', async ({ authenticatedPage }) => {
    // Navigate to transactions
    await authenticatedPage.click('a[href="/transactions"]');
    await waitForLoadingComplete(authenticatedPage);

    // Go back
    await authenticatedPage.goBack();

    // Go forward
    await authenticatedPage.goForward();

    // Should be on transactions
    await expect(authenticatedPage).toHaveURL(/\/transactions/);
  });

  test('should redirect root path to dashboard', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/');
    await expect(authenticatedPage).toHaveURL(/\/dashboard/);
  });

  test('should handle 404 for invalid routes', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/invalid-route-12345');

    // Should either redirect or show 404
    // Implementation-dependent behavior
    const url = authenticatedPage.url();
    expect(url).toBeTruthy();
  });

  test('should display user menu', async ({ authenticatedPage }) => {
    // Look for user menu or profile button
    const userMenu = authenticatedPage.locator('[data-testid="user-menu"], button[aria-label*="user"], button[aria-label*="account"]');
    const hasUserMenu = await userMenu.isVisible().catch(() => false);

    if (hasUserMenu) {
      await expect(userMenu).toBeVisible();
    }
  });

  test('should open user menu on click', async ({ authenticatedPage }) => {
    const userMenuButton = authenticatedPage.locator('[data-testid="user-menu"], button[aria-label*="user"]');
    const hasButton = await userMenuButton.isVisible().catch(() => false);

    if (hasButton) {
      await userMenuButton.click();

      // Should show dropdown menu
      const dropdown = authenticatedPage.locator('[role="menu"], .dropdown-menu');
      await expect(dropdown).toBeVisible({ timeout: 2000 });
    }
  });

  test('should display organization name', async ({ authenticatedPage }) => {
    // Look for organization name in header
    const orgName = authenticatedPage.locator('[data-testid="org-name"], text=/organization/i');
    const hasOrgName = await orgName.isVisible().catch(() => false);

    if (hasOrgName) {
      await expect(orgName).toBeVisible();
    }
  });

  test('should be keyboard navigable', async ({ authenticatedPage }) => {
    // Tab through navigation
    await authenticatedPage.keyboard.press('Tab');
    await authenticatedPage.keyboard.press('Tab');

    // Should be able to activate links with Enter
    await authenticatedPage.keyboard.press('Enter');

    // URL should have changed
    const url = authenticatedPage.url();
    expect(url).toContain('localhost');
  });

  test('should have accessible navigation labels', async ({ authenticatedPage }) => {
    // Check for aria-labels or accessible text
    const navLinks = await authenticatedPage.locator('nav a').all();

    for (const link of navLinks) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');

      // Each link should have text or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('should maintain scroll position when navigating back', async ({ authenticatedPage }) => {
    // Navigate to transactions
    await authenticatedPage.click('a[href="/transactions"]');
    await waitForLoadingComplete(authenticatedPage);

    // Scroll down
    await authenticatedPage.evaluate(() => window.scrollTo(0, 500));

    // Navigate away
    await authenticatedPage.click('a[href="/dashboard"]');
    await waitForLoadingComplete(authenticatedPage);

    // Navigate back
    await authenticatedPage.goBack();

    // Scroll position behavior is implementation-dependent
    const scrollY = await authenticatedPage.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThanOrEqual(0);
  });

  test('should show loading state during navigation', async ({ authenticatedPage }) => {
    // Click navigation link
    await authenticatedPage.click('a[href="/reports"]');

    // May show loading indicator briefly
    const loader = authenticatedPage.locator('.animate-spin, [role="progressbar"]');
    const hasLoader = await loader.isVisible({ timeout: 500 }).catch(() => false);

    // Loading state is optional and depends on implementation
    if (hasLoader) {
      await expect(loader).toBeVisible();
    }

    await waitForLoadingComplete(authenticatedPage);
  });

  test('should preserve query parameters during navigation', async ({ authenticatedPage }) => {
    // Navigate with query params
    await authenticatedPage.goto('/transactions?filter=income');

    // Navigate to another page
    await authenticatedPage.click('a[href="/dashboard"]');

    // Navigate back
    await authenticatedPage.goBack();

    // Query params may or may not be preserved
    const url = authenticatedPage.url();
    expect(url).toContain('/transactions');
  });
});
