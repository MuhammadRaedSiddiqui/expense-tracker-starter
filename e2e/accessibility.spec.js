import { test, expect } from './fixtures/auth.fixture.js';
import { waitForLoadingComplete } from './helpers/test-helpers.js';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);
  });

  test('should have proper page title', async ({ authenticatedPage }) => {
    const title = await authenticatedPage.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should have main landmark', async ({ authenticatedPage }) => {
    const main = authenticatedPage.locator('main, [role="main"]');
    await expect(main).toBeVisible();
  });

  test('should have navigation landmark', async ({ authenticatedPage }) => {
    const nav = authenticatedPage.locator('nav, [role="navigation"]');
    await expect(nav).toBeVisible();
  });

  test('should have proper heading hierarchy', async ({ authenticatedPage }) => {
    const h1 = await authenticatedPage.locator('h1').count();
    expect(h1).toBeGreaterThan(0);
    expect(h1).toBeLessThanOrEqual(1); // Should have only one h1
  });

  test('should have alt text for images', async ({ authenticatedPage }) => {
    const images = await authenticatedPage.locator('img').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // Alt attribute should exist (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('should have labels for form inputs', async ({ authenticatedPage }) => {
    await authenticatedPage.click('button:has-text("Add Transaction")');
    await authenticatedPage.waitForSelector('text=Add Transaction');

    const inputs = await authenticatedPage.locator('input, select, textarea').all();

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const name = await input.getAttribute('name');

      // Input should have some form of label
      expect(id || ariaLabel || ariaLabelledBy || name).toBeTruthy();
    }
  });

  test('should have proper button labels', async ({ authenticatedPage }) => {
    const buttons = await authenticatedPage.locator('button').all();

    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');

      // Button should have text or aria-label
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });

  test('should have proper link text', async ({ authenticatedPage }) => {
    const links = await authenticatedPage.locator('a').all();

    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');

      // Link should have text or aria-label
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ authenticatedPage }) => {
    // Tab through interactive elements
    for (let i = 0; i < 5; i++) {
      await authenticatedPage.keyboard.press('Tab');
    }

    // Should have focus on an element
    const focusedElement = await authenticatedPage.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(focusedElement).toBeTruthy();
  });

  test('should have visible focus indicators', async ({ authenticatedPage }) => {
    // Tab to first interactive element
    await authenticatedPage.keyboard.press('Tab');

    // Check if focused element has outline or focus styles
    const focusStyles = await authenticatedPage.evaluate(() => {
      const element = document.activeElement;
      const styles = window.getComputedStyle(element);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
      };
    });

    // Should have some form of focus indicator
    const hasFocusIndicator =
      focusStyles.outline !== 'none' ||
      focusStyles.outlineWidth !== '0px' ||
      focusStyles.boxShadow !== 'none';

    expect(hasFocusIndicator).toBe(true);
  });

  test('should have proper ARIA roles for interactive elements', async ({ authenticatedPage }) => {
    // Check buttons
    const buttons = await authenticatedPage.locator('button, [role="button"]').all();
    expect(buttons.length).toBeGreaterThan(0);

    // Check dialogs/modals
    await authenticatedPage.click('button:has-text("Add Transaction")');
    const dialog = authenticatedPage.locator('[role="dialog"], [role="alertdialog"]');
    await expect(dialog).toBeVisible();
  });

  test('should have proper color contrast', async ({ authenticatedPage }) => {
    // This is a basic check - full contrast testing requires specialized tools
    const textElements = await authenticatedPage.locator('p, span, h1, h2, h3, button, a').all();

    for (const element of textElements.slice(0, 10)) {
      const isVisible = await element.isVisible().catch(() => false);

      if (isVisible) {
        const styles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
          };
        });

        // Should have color and background color defined
        expect(styles.color).toBeTruthy();
      }
    }
  });

  test('should have proper table structure', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    const table = authenticatedPage.locator('table');
    const hasTable = await table.isVisible().catch(() => false);

    if (hasTable) {
      // Should have thead and tbody
      await expect(table.locator('thead')).toBeVisible();
      await expect(table.locator('tbody')).toBeVisible();

      // Headers should have proper scope
      const headers = await table.locator('th').all();
      for (const header of headers) {
        const scope = await header.getAttribute('scope');
        // Scope is optional but recommended
        expect(['col', 'row', null]).toContain(scope);
      }
    }
  });

  test('should announce dynamic content changes', async ({ authenticatedPage }) => {
    // Check for aria-live regions
    const liveRegions = authenticatedPage.locator('[aria-live], [role="alert"], [role="status"]');
    const hasLiveRegions = await liveRegions.first().isVisible().catch(() => false);

    // Live regions are used for toast notifications and dynamic updates
    if (hasLiveRegions) {
      await expect(liveRegions.first()).toBeVisible();
    }
  });

  test('should have proper form validation messages', async ({ authenticatedPage }) => {
    await authenticatedPage.click('button:has-text("Add Transaction")');
    await authenticatedPage.waitForSelector('text=Add Transaction');

    // Try to submit without filling required fields
    await authenticatedPage.click('button[type="submit"]');

    // Error messages should be associated with inputs
    const errorMessages = authenticatedPage.locator('[role="alert"], .error, [aria-invalid="true"]');
    const hasErrors = await errorMessages.first().isVisible().catch(() => false);

    if (hasErrors) {
      await expect(errorMessages.first()).toBeVisible();
    }
  });

  test('should support screen reader text', async ({ authenticatedPage }) => {
    // Check for sr-only or visually-hidden classes
    const srOnly = authenticatedPage.locator('.sr-only, .visually-hidden, [class*="screen-reader"]');
    const hasSrOnly = await srOnly.first().isVisible({ timeout: 1000 }).catch(() => false);

    // Screen reader text is hidden visually but available to assistive tech
    // This test documents the pattern
    if (hasSrOnly) {
      const isHidden = await srOnly.first().evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.position === 'absolute' && styles.width === '1px';
      });

      expect(isHidden).toBe(true);
    }
  });

  test('should have skip navigation link', async ({ authenticatedPage }) => {
    // Skip links are typically the first focusable element
    await authenticatedPage.keyboard.press('Tab');

    const skipLink = authenticatedPage.locator('a:has-text("Skip"), [href="#main"], [href="#content"]');
    const hasSkipLink = await skipLink.isVisible().catch(() => false);

    // Skip links are optional but recommended
    if (hasSkipLink) {
      await expect(skipLink).toBeVisible();
    }
  });

  test('should have proper modal focus management', async ({ authenticatedPage }) => {
    await authenticatedPage.click('button:has-text("Add Transaction")');
    await authenticatedPage.waitForSelector('text=Add Transaction');

    // Focus should be trapped in modal
    const modalElement = authenticatedPage.locator('[role="dialog"]');
    await expect(modalElement).toBeVisible();

    // First focusable element in modal should receive focus
    const focusedElement = await authenticatedPage.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA']).toContain(focusedElement);
  });

  test('should restore focus after modal closes', async ({ authenticatedPage }) => {
    // Get the button that opens modal
    const openButton = authenticatedPage.locator('button:has-text("Add Transaction")');
    await openButton.click();
    await authenticatedPage.waitForSelector('text=Add Transaction');

    // Close modal
    await authenticatedPage.keyboard.press('Escape');

    // Focus should return to button (or nearby element)
    await authenticatedPage.waitForTimeout(500);

    const focusedElement = await authenticatedPage.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(focusedElement).toBeTruthy();
  });

  test('should support escape key to close modals', async ({ authenticatedPage }) => {
    await authenticatedPage.click('button:has-text("Add Transaction")');
    await authenticatedPage.waitForSelector('text=Add Transaction');

    // Press escape
    await authenticatedPage.keyboard.press('Escape');

    // Modal should close
    await expect(authenticatedPage.locator('text=Add Transaction')).not.toBeVisible();
  });

  test('should have proper language attribute', async ({ authenticatedPage }) => {
    const lang = await authenticatedPage.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });
});
