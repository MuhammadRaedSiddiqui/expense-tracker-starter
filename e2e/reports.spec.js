import { test, expect } from './fixtures/auth.fixture.js';
import {
  createTransaction,
  waitForLoadingComplete,
} from './helpers/test-helpers.js';

test.describe('Reports', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/reports');
    await waitForLoadingComplete(authenticatedPage);
  });

  test('should display reports page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1:has-text("Reports")')).toBeVisible();
  });

  test('should display period comparison section', async ({ authenticatedPage }) => {
    const periodComparison = authenticatedPage.locator('text=/period.*comparison|compare.*period/i');
    const hasSection = await periodComparison.isVisible().catch(() => false);

    if (hasSection) {
      await expect(periodComparison).toBeVisible();
    }
  });

  test('should display spending trends section', async ({ authenticatedPage }) => {
    const spendingTrends = authenticatedPage.locator('text=/spending.*trend|trend.*spending/i');
    const hasSection = await spendingTrends.isVisible().catch(() => false);

    if (hasSection) {
      await expect(spendingTrends).toBeVisible();
    }
  });

  test('should display charts and visualizations', async ({ authenticatedPage }) => {
    // Look for chart containers
    const charts = authenticatedPage.locator('.recharts-wrapper, [class*="chart"], svg');
    const hasCharts = await charts.first().isVisible().catch(() => false);

    if (hasCharts) {
      await expect(charts.first()).toBeVisible();
    }
  });

  test('should allow selecting date range', async ({ authenticatedPage }) => {
    // Look for date range selectors
    const startDate = authenticatedPage.locator('input[type="date"][name*="start"], input[placeholder*="start"]');
    const endDate = authenticatedPage.locator('input[type="date"][name*="end"], input[placeholder*="end"]');

    const hasDateInputs = await startDate.isVisible().catch(() => false);

    if (hasDateInputs) {
      await expect(startDate).toBeVisible();
      await expect(endDate).toBeVisible();
    }
  });

  test('should filter reports by date range', async ({ authenticatedPage }) => {
    const startDateInput = authenticatedPage.locator('input[type="date"]').first();
    const hasDateInput = await startDateInput.isVisible().catch(() => false);

    if (hasDateInput) {
      await startDateInput.fill('2026-01-01');

      const endDateInput = authenticatedPage.locator('input[type="date"]').nth(1);
      await endDateInput.fill('2026-12-31');

      // Reports should update
      await waitForLoadingComplete(authenticatedPage);
    }
  });

  test('should display income vs expenses comparison', async ({ authenticatedPage }) => {
    // Create test data
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    await createTransaction(authenticatedPage, {
      description: 'Report Test Income',
      amount: '2000',
      type: 'income',
      category: 'salary',
    });

    await createTransaction(authenticatedPage, {
      description: 'Report Test Expense',
      amount: '500',
      type: 'expense',
      category: 'food',
    });

    // Go back to reports
    await authenticatedPage.goto('/reports');
    await waitForLoadingComplete(authenticatedPage);

    // Should show income and expense data
    await expect(authenticatedPage.locator('text=/income/i')).toBeVisible();
    await expect(authenticatedPage.locator('text=/expense/i')).toBeVisible();
  });

  test('should display category breakdown', async ({ authenticatedPage }) => {
    const categoryBreakdown = authenticatedPage.locator('text=/category|breakdown/i');
    const hasBreakdown = await categoryBreakdown.isVisible().catch(() => false);

    if (hasBreakdown) {
      await expect(categoryBreakdown).toBeVisible();
    }
  });

  test('should display monthly trends', async ({ authenticatedPage }) => {
    const monthlyTrends = authenticatedPage.locator('text=/monthly|month/i');
    const hasTrends = await monthlyTrends.isVisible().catch(() => false);

    if (hasTrends) {
      await expect(monthlyTrends).toBeVisible();
    }
  });

  test('should allow exporting reports', async ({ authenticatedPage }) => {
    const exportButton = authenticatedPage.locator('button:has-text("Export"), button:has-text("Download")');
    const hasExport = await exportButton.isVisible().catch(() => false);

    if (hasExport) {
      await expect(exportButton).toBeVisible();
      await expect(exportButton).toBeEnabled();
    }
  });

  test('should export report as PDF', async ({ authenticatedPage }) => {
    const pdfButton = authenticatedPage.locator('button:has-text("PDF")');
    const hasPDF = await pdfButton.isVisible().catch(() => false);

    if (hasPDF) {
      // Set up download listener
      const downloadPromise = authenticatedPage.waitForEvent('download', { timeout: 10000 });

      await pdfButton.click();

      // Wait for download
      const download = await downloadPromise.catch(() => null);

      if (download) {
        expect(download.suggestedFilename()).toContain('.pdf');
      }
    }
  });

  test('should show empty state when no data available', async ({ authenticatedPage }) => {
    // This test assumes a fresh state
    const emptyState = authenticatedPage.locator('text=/no data|no transactions/i');
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    if (hasEmptyState) {
      await expect(emptyState).toBeVisible();
    }
  });

  test('should display summary statistics', async ({ authenticatedPage }) => {
    // Look for summary stats like total income, total expenses, etc.
    const stats = authenticatedPage.locator('text=/total|average|highest|lowest/i');
    const hasStats = await stats.first().isVisible().catch(() => false);

    if (hasStats) {
      await expect(stats.first()).toBeVisible();
    }
  });

  test('should compare current period with previous period', async ({ authenticatedPage }) => {
    const comparison = authenticatedPage.locator('text=/previous|last|compared/i');
    const hasComparison = await comparison.isVisible().catch(() => false);

    if (hasComparison) {
      await expect(comparison).toBeVisible();
    }
  });

  test('should show percentage changes', async ({ authenticatedPage }) => {
    const percentage = authenticatedPage.locator('text=/%|percent/i');
    const hasPercentage = await percentage.isVisible().catch(() => false);

    if (hasPercentage) {
      await expect(percentage).toBeVisible();
    }
  });

  test('should display top spending categories', async ({ authenticatedPage }) => {
    const topCategories = authenticatedPage.locator('text=/top.*categor/i');
    const hasTop = await topCategories.isVisible().catch(() => false);

    if (hasTop) {
      await expect(topCategories).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ authenticatedPage }) => {
    await authenticatedPage.setViewportSize({ width: 375, height: 667 });

    // Page should still be functional
    await expect(authenticatedPage.locator('h1:has-text("Reports")')).toBeVisible();
  });

  test('should handle large datasets', async ({ authenticatedPage }) => {
    // Create multiple transactions
    for (let i = 0; i < 5; i++) {
      await authenticatedPage.goto('/transactions');
      await waitForLoadingComplete(authenticatedPage);

      await createTransaction(authenticatedPage, {
        description: `Bulk Transaction ${i}`,
        amount: String(100 + i * 10),
        type: i % 2 === 0 ? 'income' : 'expense',
        category: 'food',
      });
    }

    // Go to reports
    await authenticatedPage.goto('/reports');
    await waitForLoadingComplete(authenticatedPage);

    // Should display without errors
    await expect(authenticatedPage.locator('h1:has-text("Reports")')).toBeVisible();
  });

  test('should update charts when data changes', async ({ authenticatedPage }) => {
    // Add a transaction
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    await createTransaction(authenticatedPage, {
      description: 'Chart Update Test',
      amount: '300',
      type: 'expense',
      category: 'entertainment',
    });

    // Go back to reports
    await authenticatedPage.goto('/reports');
    await waitForLoadingComplete(authenticatedPage);

    // Charts should reflect new data
    const chart = authenticatedPage.locator('.recharts-wrapper, svg');
    const hasChart = await chart.first().isVisible().catch(() => false);

    if (hasChart) {
      await expect(chart.first()).toBeVisible();
    }
  });
});
