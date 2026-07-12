import express from 'express';
import { supabase } from '../lib/supabase.js';
import { validateRequest, transactionSchema } from '../lib/validation.js';
import { verifyOrganizationAccess } from '../middleware/orgAccess.js';

const router = express.Router();

// Get all transactions for user's organization (paginated)
router.get('/', async (req, res) => {
  try {
    const { userId } = req;
    const { organizationId, page = '1', limit = '50' } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const role = await verifyOrganizationAccess(userId, organizationId);
    if (!role) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const offset = (pageNum - 1) * limitNum;

    // Get total count
    const { count, error: countError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId);

    if (countError) throw countError;

    // Get paginated data
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('organization_id', organizationId)
      .order('date', { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) throw error;

    res.json({
      transactions: data || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create transaction
router.post('/', validateRequest(transactionSchema), async (req, res) => {
  try {
    const { userId } = req;
    const { organizationId, description, amount, type, category, currency, date } = req.body;

    const role = await verifyOrganizationAccess(userId, organizationId);
    if (!role || !['owner', 'admin', 'member'].includes(role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        organization_id: organizationId,
        description,
        amount,
        type,
        category,
        currency: currency || 'USD',
        date,
        created_by: userId,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ transaction: data });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const { description, amount, type, category, currency, date } = req.body;

    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('organization_id, created_by')
      .eq('id', id)
      .single();

    if (fetchError || !transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const role = await verifyOrganizationAccess(userId, transaction.organization_id);
    if (!role) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const canUpdate = transaction.created_by === userId || ['owner', 'admin'].includes(role);
    if (!canUpdate) {
      return res.status(403).json({ error: 'You can only update your own transactions' });
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({
        description,
        amount,
        type,
        category,
        currency,
        date,
        updated_by: userId,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ transaction: data });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('organization_id, created_by')
      .eq('id', id)
      .single();

    if (fetchError || !transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const role = await verifyOrganizationAccess(userId, transaction.organization_id);
    if (!role) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const canDelete = transaction.created_by === userId || ['owner', 'admin'].includes(role);
    if (!canDelete) {
      return res.status(403).json({ error: 'You can only delete your own transactions' });
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Delete all transactions for organization
router.delete('/', async (req, res) => {
  try {
    const { userId } = req;
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const role = await verifyOrganizationAccess(userId, organizationId);
    if (!role || !['owner', 'admin'].includes(role)) {
      return res.status(403).json({ error: 'Only owners and admins can delete all transactions' });
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('organization_id', organizationId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Delete all transactions error:', error);
    res.status(500).json({ error: 'Failed to delete transactions' });
  }
});

export default router;
