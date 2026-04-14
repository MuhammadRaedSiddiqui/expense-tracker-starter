import { test, expect } from './fixtures/auth.fixture.js';
import { waitForLoadingComplete } from './helpers/test-helpers.js';

test.describe('Performance', () => {
  test('dashboard should load within acceptable time', async ({ authenticatedPage }) => {
    const startTime = Date.now();

    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);

    const loadTime = Date.now() - startTime;

    // Dashboard should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('transactions page should load within acceptable time', async ({ authenticatedPage }) => {
    const startTime = Date.now();

    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    const loadTime = Date.now() - startTime;

    // Transactions page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle large transaction lists efficiently', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    // Measure scroll performance
    const startTime = Date.now();

    await authenticatedPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await authenticatedPage.waitForTimeout(500);

    const scrollTime = Date.now() - startTime;

    // Scrolling should be smooth (under 1 second)
    expect(scrollTime).toBeLessThan(1000);
  });

  test('should render charts without significant delay', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);

    const startTime = Date.now();

    // Wait for charts to render
    await authenticatedPage.waitForSelector('.recharts-wrapper, svg', { timeout: 5000 });

    const renderTime = Date.now() - startTime;

    // Charts should render within 3 seconds
    expect(renderTime).toBeLessThan(3000);
  });

  test('should handle rapid navigation without lag', async ({ authenticatedPage }) => {
    const pages = ['/dashboard', '/transactions', '/budgets', '/reports'];

    const startTime = Date.now();

    for (const page of pages) {
      await authenticatedPage.goto(page);
      await waitForLoadingComplete(authenticatedPage);
    }

    const totalTime = Date.now() - startTime;

    // All navigations should complete within 10 seconds
    expect(totalTime).toBeLessThan(10000);
  });

  test('should handle form submissions quickly', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/transactions');
    await waitForLoadingComplete(authenticatedPage);

    await authenticatedPage.click('button:has-text("Add Transaction")');
    await authenticatedPage.waitForSelector('text=Add Transaction');

    // Fill form
    await authenticatedPage.fill('input[name="description"]', 'Performance Test');
    await authenticatedPage.fill('input[name="amount"]', '100');
    await authenticatedPage.selectOption('select[name="type"]', 'expense');
    await authenticatedPage.selectOption('select[name="category"]', 'food');

    const startTime = Date.now();

    // Submit form
    await authenticatedPage.click('button[type="submit"]');

    // Wait for success
    await authenticatedPage.waitForSelector('text=/added successfully/i', { timeout: 5000 });

    const submitTime = Date.now() - startTime;

    // Form submission should complete within 3 seconds
    expect(submitTime).toBeLessThan(3000);
  });

  test('should load images efficiently', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard');

    // Wait for all images to load
    await authenticatedPage.waitForLoadState('networkidle', { timeout: 10000 });

    // Check if any images failed to load
    const brokenImages = await authenticatedPage.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.filter(img => !img.complete || img.naturalHeight === 0).length;
    });

    expect(brokenImages).toBe(0);
  });

  test('should have acceptable bundle size', async ({ authenticatedPage }) => {
    // Navigate and measure resources
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);

    const resourceSizes = await authenticatedPage.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return resources.map(r => ({
        name: r.name,
        size: r.transferSize || 0,
      }));
    });

    // Calculate total JS bundle size
    const jsBundleSize = resourceSizes
      .filter(r => r.name.includes('.js'))
      .reduce((sum, r) => sum + r.size, 0);

    // JS bundle should be under 2MB
    expect(jsBundleSize).toBeLessThan(2 * 1024 * 1024);
  });

  test('should have good Core Web Vitals', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard');
    await waitForLoadingComplete(authenticatedPage);

    // Measure performance metrics
    const metrics = await authenticatedPage.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcp = entries.find(e => e.entryType === 'largest-contentful-paint');

          resolve({
            lcp: lcp?.renderTime || lcp?.loadTime || 0,
          });
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Timeout after 5 seconds
        setTimeout(() => resolve({ lcp: 0 }), 5000);
      });
    });

    // LCP should be under 2.5 seconds (good)
    if (metrics.lcp > 0) {
      expect(metrics.lcp).toBeLessThan(2500);
    }
  });

  test('should handle concurrent requests efficiently', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard');

    const startTime = Date.now();

    // Trigger multiple data fetches
    await Promise.all([
      authenticatedPage.goto('/transactions'),
      authenticatedPage.goto('/budgets'),
      authenticatedPage.goto('/reports'),
    ]);

    const totalTime = Date.now() - startTime;

    // Concurrent requests should complete within 8 seconds
    expect(totalTime).toBeLessThan(8000);
  });
});
