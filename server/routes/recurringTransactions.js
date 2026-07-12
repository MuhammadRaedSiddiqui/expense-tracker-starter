import express from 'express';
import { supabase } from '../lib/supabase.js';
import { validateRequest, recurringTransactionSchema } from '../lib/validation.js';
import { verifyOrganizationAccess } from '../middleware/orgAccess.js';
import { logger } from '../lib/logger.js';

const router = express.Router();

// Helper function to calculate next execution date
function calculateNextExecutionDate(startDate, frequency, interval) {
  const date = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If start date is in the future, return it
  if (date > today) {
    return date.toISOString().split('T')[0];
  }

  // Calculate next execution based on frequency
  while (date <= today) {
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
  }

  return date.toISOString().split('T')[0];
}

// Get all recurring transactions for organization
router.get('/', async (req, res) => {
  try {
    const { userId } = req;
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    // Verify user has access
    const role = await verifyOrganizationAccess(userId, organizationId);
    if (!role) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data, error } = await supabase
      .from('recurring_transactions')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ recurringTransactions: data || [] });
  } catch (error) {
    logger.error('Get recurring transactions error', error);
    res.status(500).json({ error: 'Failed to fetch recurring transactions' });
  }
});

// Create recurring transaction
router.post('/', validateRequest(recurringTransactionSchema), async (req, res) => {
  try {
    const { userId } = req;
    const {
      organizationId,
      description,
      amount,
      currency,
      type,
      category,
      frequency,
      interval,
      startDate,
      endDate,
    } = req.body;

    // Verify user is member or above
    const userRole = await verifyOrganizationAccess(userId, organizationId);
    if (!['owner', 'admin', 'member'].includes(userRole)) {
      return res.status(403).json({ error: 'Only members and above can create recurring transactions' });
    }

    // Calculate next occurrence date
    const nextOccurrence = calculateNextExecutionDate(startDate, frequency, interval || 1);

    // Create recurring transaction
    const { data, error } = await supabase
      .from('recurring_transactions')
      .insert({
        organization_id: organizationId,
        description,
        amount: parseFloat(amount),
        currency: currency || 'USD',
        type,
        category,
        frequency,
        interval: interval || 1,
        start_date: startDate,
        end_date: endDate || null,
        next_occurrence: nextOccurrence,
        created_by: userId,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ recurringTransaction: data });
  } catch (error) {
    logger.error('Create recurring transaction error', error);
    res.status(500).json({ error: 'Failed to create recurring transaction' });
  }
});

// Update recurring transaction
router.put('/:id', async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const {
      description,
      amount,
      currency,
      type,
      category,
      frequency,
      interval,
      startDate,
      endDate,
      isActive,
    } = req.body;

    // Get existing recurring transaction
    const { data: existing, error: fetchError } = await supabase
      .from('recurring_transactions')
      .select('organization_id, created_by')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Recurring transaction not found' });
    }

    // Verify user has permission
    const userRole = await verifyOrganizationAccess(userId, existing.organization_id);
    const canEdit = ['owner', 'admin'].includes(userRole) ||
                    (userRole === 'member' && existing.created_by === userId);

    if (!canEdit) {
      return res.status(403).json({ error: 'You can only edit your own recurring transactions' });
    }

    // Build update object
    const updates = {};

    if (description !== undefined) updates.description = description;
    if (amount !== undefined) updates.amount = parseFloat(amount);
    if (currency !== undefined) updates.currency = currency;
    if (type !== undefined) updates.type = type;
    if (category !== undefined) updates.category = category;
    if (frequency !== undefined) updates.frequency = frequency;
    if (interval !== undefined) updates.interval = interval;
    if (startDate !== undefined) updates.start_date = startDate;
    if (endDate !== undefined) updates.end_date = endDate;
    if (isActive !== undefined) updates.is_active = isActive;

    // Recalculate next occurrence date if frequency/interval/startDate changed
    if (frequency !== undefined || interval !== undefined || startDate !== undefined) {
      const { data: current } = await supabase
        .from('recurring_transactions')
        .select('frequency, interval, start_date')
        .eq('id', id)
        .single();

      const newFrequency = frequency || current.frequency;
      const newInterval = interval || current.interval;
      const newStartDate = startDate || current.start_date;

      updates.next_occurrence = calculateNextExecutionDate(
        newStartDate,
        newFrequency,
        newInterval
      );
    }

    // Update recurring transaction
    const { data, error } = await supabase
      .from('recurring_transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ recurringTransaction: data });
  } catch (error) {
    logger.error('Update recurring transaction error', error);
    res.status(500).json({ error: 'Failed to update recurring transaction' });
  }
});

// Delete recurring transaction
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    // Get existing recurring transaction
    const { data: existing, error: fetchError } = await supabase
      .from('recurring_transactions')
      .select('organization_id, created_by')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Recurring transaction not found' });
    }

    // Verify user has permission
    const userRole = await verifyOrganizationAccess(userId, existing.organization_id);
    const canDelete = ['owner', 'admin'].includes(userRole) ||
                      (userRole === 'member' && existing.created_by === userId);

    if (!canDelete) {
      return res.status(403).json({ error: 'You can only delete your own recurring transactions' });
    }

    // Delete recurring transaction
    const { error } = await supabase
      .from('recurring_transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    logger.error('Delete recurring transaction error', error);
    res.status(500).json({ error: 'Failed to delete recurring transaction' });
  }
});

// Toggle active status
router.post('/:id/toggle', async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    // Get existing recurring transaction
    const { data: existing, error: fetchError } = await supabase
      .from('recurring_transactions')
      .select('organization_id, created_by, is_active')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Recurring transaction not found' });
    }

    // Verify user has permission
    const userRole = await verifyOrganizationAccess(userId, existing.organization_id);
    const canToggle = ['owner', 'admin'].includes(userRole) ||
                      (userRole === 'member' && existing.created_by === userId);

    if (!canToggle) {
      return res.status(403).json({ error: 'You can only toggle your own recurring transactions' });
    }

    // Toggle active status
    const { data, error } = await supabase
      .from('recurring_transactions')
      .update({
        is_active: !existing.is_active,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ recurringTransaction: data });
  } catch (error) {
    logger.error('Toggle recurring transaction error', error);
    res.status(500).json({ error: 'Failed to toggle recurring transaction' });
  }
});

export default router;
