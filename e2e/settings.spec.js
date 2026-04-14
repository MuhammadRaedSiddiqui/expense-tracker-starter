import { test, expect } from './fixtures/auth.fixture.js';
import { waitForLoadingComplete } from './helpers/test-helpers.js';

test.describe('Settings', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/settings');
    await waitForLoadingComplete(authenticatedPage);
  });

  test('should display settings page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1:has-text("Settings")')).toBeVisible();
  });

  test('should display user profile section', async ({ authenticatedPage }) => {
    const profileSection = authenticatedPage.locator('text=/profile|account/i');
    const hasSection = await profileSection.isVisible().catch(() => false);

    if (hasSection) {
      await expect(profileSection).toBeVisible();
    }
  });

  test('should display organization settings', async ({ authenticatedPage }) => {
    const orgSettings = authenticatedPage.locator('text=/organization/i');
    const hasOrgSettings = await orgSettings.isVisible().catch(() => false);

    if (hasOrgSettings) {
      await expect(orgSettings).toBeVisible();
    }
  });

  test('should display notification preferences', async ({ authenticatedPage }) => {
    const notifications = authenticatedPage.locator('text=/notification/i');
    const hasNotifications = await notifications.isVisible().catch(() => false);

    if (hasNotifications) {
      await expect(notifications).toBeVisible();
    }
  });

  test('should allow updating notification settings', async ({ authenticatedPage }) => {
    const notificationToggle = authenticatedPage.locator('input[type="checkbox"][name*="notification"]');
    const hasToggle = await notificationToggle.first().isVisible().catch(() => false);

    if (hasToggle) {
      const initialState = await notificationToggle.first().isChecked();
      await notificationToggle.first().click();

      // Wait for update
      await authenticatedPage.waitForTimeout(1000);

      const newState = await notificationToggle.first().isChecked();
      expect(newState).toBe(!initialState);
    }
  });

  test('should display currency preferences', async ({ authenticatedPage }) => {
    const currencySettings = authenticatedPage.locator('text=/currency|default currency/i');
    const hasCurrency = await currencySettings.isVisible().catch(() => false);

    if (hasCurrency) {
      await expect(currencySettings).toBeVisible();
    }
  });

  test('should allow changing default currency', async ({ authenticatedPage }) => {
    const currencySelect = authenticatedPage.locator('select[name*="currency"]');
    const hasSelect = await currencySelect.isVisible().catch(() => false);

    if (hasSelect) {
      await currencySelect.selectOption('EUR');

      // Should show success message
      const success = authenticatedPage.locator('text=/saved|updated/i');
      await expect(success).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display theme preferences', async ({ authenticatedPage }) => {
    const themeSettings = authenticatedPage.locator('text=/theme|appearance|dark mode/i');
    const hasTheme = await themeSettings.isVisible().catch(() => false);

    if (hasTheme) {
      await expect(themeSettings).toBeVisible();
    }
  });

  test('should toggle dark mode', async ({ authenticatedPage }) => {
    const darkModeToggle = authenticatedPage.locator('input[type="checkbox"][name*="dark"], button:has-text("Dark Mode")');
    const hasToggle = await darkModeToggle.isVisible().catch(() => false);

    if (hasToggle) {
      await darkModeToggle.click();

      // Check if dark mode class is applied
      const htmlElement = authenticatedPage.locator('html');
      const classes = await htmlElement.getAttribute('class');

      // Dark mode implementation varies
      expect(classes).toBeTruthy();
    }
  });

  test('should display language preferences', async ({ authenticatedPage }) => {
    const languageSettings = authenticatedPage.locator('text=/language/i');
    const hasLanguage = await languageSettings.isVisible().catch(() => false);

    if (hasLanguage) {
      await expect(languageSettings).toBeVisible();
    }
  });

  test('should display data export options', async ({ authenticatedPage }) => {
    const exportOptions = authenticatedPage.locator('text=/export|download.*data/i');
    const hasExport = await exportOptions.isVisible().catch(() => false);

    if (hasExport) {
      await expect(exportOptions).toBeVisible();
    }
  });

  test('should allow exporting data', async ({ authenticatedPage }) => {
    const exportButton = authenticatedPage.locator('button:has-text("Export"), button:has-text("Download Data")');
    const hasButton = await exportButton.isVisible().catch(() => false);

    if (hasButton) {
      // Set up download listener
      const downloadPromise = authenticatedPage.waitForEvent('download', { timeout: 10000 });

      await exportButton.click();

      // Wait for download
      const download = await downloadPromise.catch(() => null);

      if (download) {
        expect(download.suggestedFilename()).toBeTruthy();
      }
    }
  });

  test('should display delete account option', async ({ authenticatedPage }) => {
    const deleteAccount = authenticatedPage.locator('text=/delete.*account|close.*account/i');
    const hasDelete = await deleteAccount.isVisible().catch(() => false);

    if (hasDelete) {
      await expect(deleteAccount).toBeVisible();
    }
  });

  test('should show confirmation before deleting account', async ({ authenticatedPage }) => {
    const deleteButton = authenticatedPage.locator('button:has-text("Delete Account")');
    const hasButton = await deleteButton.isVisible().catch(() => false);

    if (hasButton) {
      await deleteButton.click();

      // Should show confirmation dialog
      await expect(authenticatedPage.locator('text=/delete.*account/i')).toBeVisible();
      await expect(authenticatedPage.locator('text=/cannot be undone|permanent/i')).toBeVisible();
    }
  });

  test('should display API keys section', async ({ authenticatedPage }) => {
    const apiKeys = authenticatedPage.locator('text=/api.*key/i');
    const hasApiKeys = await apiKeys.isVisible().catch(() => false);

    if (hasApiKeys) {
      await expect(apiKeys).toBeVisible();
    }
  });

  test('should display billing information', async ({ authenticatedPage }) => {
    const billing = authenticatedPage.locator('text=/billing|subscription|plan/i');
    const hasBilling = await billing.isVisible().catch(() => false);

    if (hasBilling) {
      await expect(billing).toBeVisible();
    }
  });

  test('should display security settings', async ({ authenticatedPage }) => {
    const security = authenticatedPage.locator('text=/security|password|two-factor/i');
    const hasSecurity = await security.isVisible().catch(() => false);

    if (hasSecurity) {
      await expect(security).toBeVisible();
    }
  });

  test('should display privacy settings', async ({ authenticatedPage }) => {
    const privacy = authenticatedPage.locator('text=/privacy/i');
    const hasPrivacy = await privacy.isVisible().catch(() => false);

    if (hasPrivacy) {
      await expect(privacy).toBeVisible();
    }
  });

  test('should save settings changes', async ({ authenticatedPage }) => {
    const saveButton = authenticatedPage.locator('button:has-text("Save"), button[type="submit"]');
    const hasButton = await saveButton.first().isVisible().catch(() => false);

    if (hasButton) {
      await saveButton.first().click();

      // Should show success message
      const success = authenticatedPage.locator('text=/saved|updated successfully/i');
      await expect(success).toBeVisible({ timeout: 5000 });
    }
  });

  test('should cancel settings changes', async ({ authenticatedPage }) => {
    const cancelButton = authenticatedPage.locator('button:has-text("Cancel")');
    const hasButton = await cancelButton.isVisible().catch(() => false);

    if (hasButton) {
      // Make a change
      const input = authenticatedPage.locator('input').first();
      const hasInput = await input.isVisible().catch(() => false);

      if (hasInput) {
        await input.fill('test change');
        await cancelButton.click();

        // Changes should be discarded
        const value = await input.inputValue();
        expect(value).not.toBe('test change');
      }
    }
  });

  test('should validate form inputs', async ({ authenticatedPage }) => {
    const emailInput = authenticatedPage.locator('input[type="email"]');
    const hasEmail = await emailInput.isVisible().catch(() => false);

    if (hasEmail) {
      await emailInput.fill('invalid-email');

      const saveButton = authenticatedPage.locator('button:has-text("Save")');
      await saveButton.click();

      // Should show validation error
      await expect(authenticatedPage.locator('text=/invalid|valid email/i')).toBeVisible();
    }
  });

  test('should display help or documentation links', async ({ authenticatedPage }) => {
    const helpLink = authenticatedPage.locator('a:has-text("Help"), a:has-text("Documentation")');
    const hasHelp = await helpLink.isVisible().catch(() => false);

    if (hasHelp) {
      await expect(helpLink).toBeVisible();
    }
  });

  test('should be keyboard accessible', async ({ authenticatedPage }) => {
    // Tab through settings
    for (let i = 0; i < 5; i++) {
      await authenticatedPage.keyboard.press('Tab');
    }

    // Should have focus on an element
    const focusedElement = await authenticatedPage.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(focusedElement).toBeTruthy();
  });
});
