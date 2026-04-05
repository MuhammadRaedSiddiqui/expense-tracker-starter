import express from 'express';
import { supabase } from '../lib/supabase.js';

const router = express.Router();

// Helper function to verify user has access to organization
async function verifyOrganizationAccess(userId, organizationId) {
  const { data, error } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', userId)
    .eq('organization_id', organizationId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.role;
}

// Get all transactions for user's organization
router.get('/', async (req, res) => {
  try {
    const { userId } = req;
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    // Verify user has access to this organization
    const role = await verifyOrganizationAccess(userId, organizationId);
    if (!role) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('organization_id', organizationId)
      .order('date', { ascending: false });

    if (error) throw error;

    res.json({ transactions: data || [] });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create transaction
router.post('/', async (req, res) => {
  try {
    const { userId } = req;
    const { organizationId, description, amount, type, category, currency, date } = req.body;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    // Verify user has access and is at least a member
    const role = await verifyOrganizationAccess(userId, organizationId);
    if (!role || !['owner', 'admin', 'member'].includes(role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Validate required fields
    if (!description || !amount || !type || !category || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
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

    // Get the transaction to verify ownership
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('organization_id, created_by')
      .eq('id', id)
      .single();

    if (fetchError || !transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Verify user has access to this organization
    const role = await verifyOrganizationAccess(userId, transaction.organization_id);
    if (!role) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if user can update (own transaction or admin/owner)
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

    // Get the transaction to verify ownership
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('organization_id, created_by')
      .eq('id', id)
      .single();

    if (fetchError || !transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Verify user has access to this organization
    const role = await verifyOrganizationAccess(userId, transaction.organization_id);
    if (!role) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if user can delete (own transaction or admin/owner)
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

    // Verify user is owner or admin
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
