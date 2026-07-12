import { supabase } from './supabase.js';
import { logger } from './logger.js';

/**
 * Calculate the next execution date based on frequency and interval
 */
function calculateNextExecutionDate(currentDate, frequency, interval) {
  const date = new Date(currentDate);

  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + interval);
      break;
    case 'weekly':
      date.setDate(date.getDate() + (interval * 7));
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + interval);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + interval);
      break;
  }

  return date.toISOString().split('T')[0];
}

/**
 * Process all due recurring transactions
 * Creates actual transactions and updates next execution dates
 */
export async function processRecurringTransactions() {
  const today = new Date().toISOString().split('T')[0];
  let processedCount = 0;
  let errorCount = 0;

  try {
    logger.info(`[Recurring] Processing recurring transactions for ${today}`);

    // Get all active recurring transactions that are due
    const { data: recurringTransactions, error: fetchError } = await supabase
      .from('recurring_transactions')
      .select('*')
      .eq('is_active', true)
      .lte('next_occurrence', today);

    if (fetchError) {
      logger.error('[Recurring] Error fetching recurring transactions', fetchError);
      throw fetchError;
    }

    if (!recurringTransactions || recurringTransactions.length === 0) {
      logger.info('[Recurring] No recurring transactions due for processing');
      return { processedCount: 0, errorCount: 0 };
    }

    logger.info(`[Recurring] Found ${recurringTransactions.length} recurring transactions to process`);

    // Process each recurring transaction
    for (const recurring of recurringTransactions) {
      try {
        // Check if end_date has been reached
        if (recurring.end_date && recurring.next_occurrence > recurring.end_date) {
          logger.info(`[Recurring] Deactivating recurring transaction ${recurring.id} - end date reached`);

          await supabase
            .from('recurring_transactions')
            .update({ is_active: false })
            .eq('id', recurring.id);

          continue;
        }

        // Create the actual transaction
        const { error: createError } = await supabase
          .from('transactions')
          .insert({
            organization_id: recurring.organization_id,
            description: recurring.description,
            amount: recurring.amount,
            currency: recurring.currency,
            type: recurring.type,
            category: recurring.category,
            date: recurring.next_occurrence,
            created_by: recurring.created_by,
          });

        if (createError) {
          logger.error(`[Recurring] Error creating transaction for ${recurring.id}`, createError);
          errorCount++;
          continue;
        }

        // Calculate next execution date
        const nextExecutionDate = calculateNextExecutionDate(
          recurring.next_occurrence,
          recurring.frequency,
          recurring.interval
        );

        // Check if next execution would be after end_date
        const shouldDeactivate = recurring.end_date && nextExecutionDate > recurring.end_date;

        // Update recurring transaction
        const { error: updateError } = await supabase
          .from('recurring_transactions')
          .update({
            next_occurrence: nextExecutionDate,
            is_active: !shouldDeactivate,
          })
          .eq('id', recurring.id);

        if (updateError) {
          logger.error(`[Recurring] Error updating recurring transaction ${recurring.id}`, updateError);
          errorCount++;
          continue;
        }

        logger.info(`[Recurring] ✓ Processed ${recurring.description} (${recurring.id})`);
        processedCount++;

        if (shouldDeactivate) {
          logger.info(`[Recurring] Deactivated ${recurring.id} - end date will be reached`);
        }
      } catch (error) {
        logger.error(`[Recurring] Error processing recurring transaction ${recurring.id}`, error);
        errorCount++;
      }
    }

    logger.info(`[Recurring] Processing complete: ${processedCount} processed, ${errorCount} errors`);
    return { processedCount, errorCount };
  } catch (error) {
    logger.error('[Recurring] Fatal error processing recurring transactions', error);
    throw error;
  }
}

/**
 * Process recurring transactions for a specific organization (for testing)
 */
export async function processRecurringTransactionsForOrganization(organizationId) {
  const today = new Date().toISOString().split('T')[0];
  let processedCount = 0;
  let errorCount = 0;

  try {
    logger.info(`[Recurring] Processing recurring transactions for organization ${organizationId}`);

    const { data: recurringTransactions, error: fetchError } = await supabase
      .from('recurring_transactions')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .lte('next_occurrence', today);

    if (fetchError) throw fetchError;

    if (!recurringTransactions || recurringTransactions.length === 0) {
      return { processedCount: 0, errorCount: 0 };
    }

    for (const recurring of recurringTransactions) {
      try {
        if (recurring.end_date && recurring.next_occurrence > recurring.end_date) {
          await supabase
            .from('recurring_transactions')
            .update({ is_active: false })
            .eq('id', recurring.id);
          continue;
        }

        const { error: createError } = await supabase
          .from('transactions')
          .insert({
            organization_id: recurring.organization_id,
            description: recurring.description,
            amount: recurring.amount,
            currency: recurring.currency,
            type: recurring.type,
            category: recurring.category,
            date: recurring.next_occurrence,
            created_by: recurring.created_by,
          });

        if (createError) {
          errorCount++;
          continue;
        }

        const nextExecutionDate = calculateNextExecutionDate(
          recurring.next_occurrence,
          recurring.frequency,
          recurring.interval
        );

        const shouldDeactivate = recurring.end_date && nextExecutionDate > recurring.end_date;

        await supabase
          .from('recurring_transactions')
          .update({
            next_occurrence: nextExecutionDate,
            is_active: !shouldDeactivate,
          })
          .eq('id', recurring.id);

        processedCount++;
      } catch (error) {
        errorCount++;
      }
    }

    return { processedCount, errorCount };
  } catch (error) {
    logger.error('[Recurring] Error processing recurring transactions', error);
    throw error;
  }
}
