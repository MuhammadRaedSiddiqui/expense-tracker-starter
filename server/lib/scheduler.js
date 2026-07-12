import cron from 'node-cron';
import { processRecurringTransactions } from './recurringProcessor.js';
import { logger } from './logger.js';

/**
 * Initialize scheduled tasks
 */
export function initializeScheduler() {
  // Run recurring transactions processor daily at 2 AM
  // Cron format: minute hour day month weekday
  cron.schedule('0 2 * * *', async () => {
    logger.info('[Scheduler] Running recurring transactions processor...');
    try {
      const result = await processRecurringTransactions();
      logger.info(`[Scheduler] Recurring transactions processed: ${result.processedCount} successful, ${result.errorCount} errors`);
    } catch (error) {
      logger.error('[Scheduler] Error running recurring transactions processor', error);
    }
  });

  console.log('✓ Scheduler initialized - recurring transactions will process daily at 2 AM');

  // Optional: Run immediately on startup if in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Scheduler] Development mode - running initial check...');
    processRecurringTransactions()
      .then(result => {
        console.log(`[Scheduler] Initial check complete: ${result.processedCount} processed, ${result.errorCount} errors`);
      })
      .catch(error => {
        console.error('[Scheduler] Initial check failed:', error);
      });
  }
}

/**
 * Manually trigger recurring transactions processing (for testing)
 */
export async function triggerRecurringTransactions() {
  console.log('[Scheduler] Manual trigger - processing recurring transactions...');
  try {
    const result = await processRecurringTransactions();
    console.log(`[Scheduler] Manual processing complete: ${result.processedCount} processed, ${result.errorCount} errors`);
    return result;
  } catch (error) {
    console.error('[Scheduler] Manual processing failed:', error);
    throw error;
  }
}
