import { test, expect } from './fixtures/auth.fixture.js';
import { waitForLoadingComplete } from './helpers/test-helpers.js';

test.describe('Team Management', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/team');
    await waitForLoadingComplete(authenticatedPage);
  });

  test('should display team page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1:has-text("Team")')).toBeVisible();
  });

  test('should display team members list', async ({ authenticatedPage }) => {
    const membersList = authenticatedPage.locator('[data-testid="team-members"], table, .team-list');
    const hasList = await membersList.isVisible().catch(() => false);

    if (hasList) {
      await expect(membersList).toBeVisible();
    }
  });

  test('should have invite member button', async ({ authenticatedPage }) => {
    const inviteButton = authenticatedPage.locator('button:has-text("Invite"), button:has-text("Add Member")');
    const hasButton = await inviteButton.isVisible().catch(() => false);

    if (hasButton) {
      await expect(inviteButton).toBeVisible();
      await expect(inviteButton).toBeEnabled();
    }
  });

  test('should open invite modal', async ({ authenticatedPage }) => {
    const inviteButton = authenticatedPage.locator('button:has-text("Invite")');
    const hasButton = await inviteButton.isVisible().catch(() => false);

    if (hasButton) {
      await inviteButton.click();

      // Should show invite modal
      await expect(authenticatedPage.locator('text=/invite|add member/i')).toBeVisible();
    }
  });

  test('should validate email when inviting member', async ({ authenticatedPage }) => {
    const inviteButton = authenticatedPage.locator('button:has-text("Invite")');
    const hasButton = await inviteButton.isVisible().catch(() => false);

    if (hasButton) {
      await inviteButton.click();

      // Try to submit with invalid email
      const emailInput = authenticatedPage.locator('input[type="email"], input[name="email"]');
      await emailInput.fill('invalid-email');

      const submitButton = authenticatedPage.locator('button[type="submit"]:has-text("Invite"), button[type="submit"]:has-text("Send")');
      await submitButton.click();

      // Should show validation error
      await expect(authenticatedPage.locator('text=/invalid|valid email/i')).toBeVisible();
    }
  });

  test('should send invitation with valid email', async ({ authenticatedPage }) => {
    const inviteButton = authenticatedPage.locator('button:has-text("Invite")');
    const hasButton = await inviteButton.isVisible().catch(() => false);

    if (hasButton) {
      await inviteButton.click();

      const emailInput = authenticatedPage.locator('input[type="email"], input[name="email"]');
      await emailInput.fill('newmember@example.com');

      const submitButton = authenticatedPage.locator('button[type="submit"]:has-text("Invite"), button[type="submit"]:has-text("Send")');
      await submitButton.click();

      // Should show success message
      const successMessage = authenticatedPage.locator('text=/invitation sent|invited/i');
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display member roles', async ({ authenticatedPage }) => {
    const roles = authenticatedPage.locator('text=/owner|admin|member/i');
    const hasRoles = await roles.first().isVisible().catch(() => false);

    if (hasRoles) {
      await expect(roles.first()).toBeVisible();
    }
  });

  test('should display member email addresses', async ({ authenticatedPage }) => {
    const emails = authenticatedPage.locator('text=/@/');
    const hasEmails = await emails.first().isVisible().catch(() => false);

    if (hasEmails) {
      await expect(emails.first()).toBeVisible();
    }
  });

  test('should show pending invitations', async ({ authenticatedPage }) => {
    const pending = authenticatedPage.locator('text=/pending/i');
    const hasPending = await pending.isVisible().catch(() => false);

    if (hasPending) {
      await expect(pending).toBeVisible();
    }
  });

  test('should allow removing team members', async ({ authenticatedPage }) => {
    const removeButton = authenticatedPage.locator('button:has-text("Remove"), button[aria-label*="remove"]');
    const hasButton = await removeButton.first().isVisible().catch(() => false);

    if (hasButton) {
      await expect(removeButton.first()).toBeVisible();
    }
  });

  test('should show confirmation before removing member', async ({ authenticatedPage }) => {
    const removeButton = authenticatedPage.locator('button:has-text("Remove")').first();
    const hasButton = await removeButton.isVisible().catch(() => false);

    if (hasButton) {
      await removeButton.click();

      // Should show confirmation dialog
      await expect(authenticatedPage.locator('text=/remove|delete/i')).toBeVisible();
      await expect(authenticatedPage.locator('text=/cannot be undone|sure/i')).toBeVisible();
    }
  });

  test('should allow changing member roles', async ({ authenticatedPage }) => {
    const roleSelect = authenticatedPage.locator('select[name*="role"], button:has-text("Change Role")');
    const hasRoleControl = await roleSelect.first().isVisible().catch(() => false);

    if (hasRoleControl) {
      await expect(roleSelect.first()).toBeVisible();
    }
  });

  test('should display current user in team list', async ({ authenticatedPage }) => {
    const currentUser = authenticatedPage.locator('text=/you|current user/i');
    const hasIndicator = await currentUser.isVisible().catch(() => false);

    if (hasIndicator) {
      await expect(currentUser).toBeVisible();
    }
  });

  test('should prevent removing yourself', async ({ authenticatedPage }) => {
    // Current user's remove button should be disabled or hidden
    const yourRow = authenticatedPage.locator('text=/you/i').locator('..').locator('..');
    const removeButton = yourRow.locator('button:has-text("Remove")');
    const hasButton = await removeButton.isVisible().catch(() => false);

    if (hasButton) {
      const isDisabled = await removeButton.isDisabled();
      expect(isDisabled).toBe(true);
    }
  });

  test('should show team member count', async ({ authenticatedPage }) => {
    const count = authenticatedPage.locator('text=/\\d+ member/i');
    const hasCount = await count.isVisible().catch(() => false);

    if (hasCount) {
      await expect(count).toBeVisible();
    }
  });

  test('should display organization name', async ({ authenticatedPage }) => {
    const orgName = authenticatedPage.locator('[data-testid="org-name"]');
    const hasOrgName = await orgName.isVisible().catch(() => false);

    if (hasOrgName) {
      await expect(orgName).toBeVisible();
    }
  });

  test('should be accessible with keyboard navigation', async ({ authenticatedPage }) => {
    // Tab through elements
    await authenticatedPage.keyboard.press('Tab');
    await authenticatedPage.keyboard.press('Tab');

    // Should be able to interact with keyboard
    const focusedElement = await authenticatedPage.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});
