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

// Helper function to calculate spending for a budget
async function calculateBudgetSpending(organizationId, category, startDate, endDate, currency) {
  const query = supabase
    .from('transactions')
    .select('amount, currency')
    .eq('organization_id', organizationId)
    .eq('category', category)
    .eq('type', 'expense')
    .gte('date', startDate);

  if (endDate) {
    query.lte('date', endDate);
  }

  const { data: transactions, error } = await query;

  if (error) throw error;

  // Sum up spending (convert currencies if needed - for now assume same currency)
  const totalSpent = transactions
    .filter(t => t.currency === currency)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return totalSpent;
}

// Get all budgets for organization
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
      .from('budgets')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ budgets: data || [] });
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Get budget status with spending comparison
router.get('/:id/status', async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    // Get budget
    const { data: budget, error: budgetError } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', id)
      .single();

    if (budgetError || !budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Verify user has access
    const role = await verifyOrganizationAccess(userId, budget.organization_id);
    if (!role) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Calculate current period dates
    const today = new Date();
    let periodStart, periodEnd;

    if (budget.period === 'monthly') {
      periodStart = new Date(today.getFullYear(), today.getMonth(), 1);
      periodEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else {
      // yearly
      periodStart = new Date(today.getFullYear(), 0, 1);
      periodEnd = new Date(today.getFullYear(), 11, 31);
    }

    // Ensure we're within budget date range
    if (budget.start_date) {
      const budgetStart = new Date(budget.start_date);
      if (periodStart < budgetStart) {
        periodStart = budgetStart;
      }
    }

    if (budget.end_date) {
      const budgetEnd = new Date(budget.end_date);
      if (periodEnd > budgetEnd) {
        periodEnd = budgetEnd;
      }
    }

    // Calculate spending
    const spent = await calculateBudgetSpending(
      budget.organization_id,
      budget.category,
      periodStart.toISOString().split('T')[0],
      periodEnd.toISOString().split('T')[0],
      budget.currency
    );

    const budgetAmount = parseFloat(budget.amount);
    const percentageUsed = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
    const remaining = budgetAmount - spent;
    const isOverBudget = spent > budgetAmount;

    res.json({
      budget,
      status: {
        spent,
        remaining,
        percentageUsed: Math.round(percentageUsed * 100) / 100,
        isOverBudget,
        periodStart: periodStart.toISOString().split('T')[0],
        periodEnd: periodEnd.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    console.error('Get budget status error:', error);
    res.status(500).json({ error: 'Failed to fetch budget status' });
  }
});

// Create budget
router.post('/', async (req, res) => {
  try {
    const { userId } = req;
    const {
      organizationId,
      category,
      amount,
      currency,
      period,
      startDate,
      endDate,
    } = req.body;

    // Validate required fields
    if (!organizationId || !category || !amount || !period || !startDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate period
    if (!['monthly', 'yearly'].includes(period)) {
      return res.status(400).json({ error: 'Invalid period' });
    }

    // Verify user is member or above
    const userRole = await verifyOrganizationAccess(userId, organizationId);
    if (!['owner', 'admin', 'member'].includes(userRole)) {
      return res.status(403).json({ error: 'Only members and above can create budgets' });
    }

    // Check if active budget already exists for this category
    const { data: existingBudget } = await supabase
      .from('budgets')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('category', category)
      .eq('is_active', true)
      .single();

    if (existingBudget) {
      return res.status(400).json({ error: 'An active budget already exists for this category' });
    }

    // Create budget
    const { data, error } = await supabase
      .from('budgets')
      .insert({
        organization_id: organizationId,
        category,
        amount: parseFloat(amount),
        currency: currency || 'USD',
        period,
        start_date: startDate,
        end_date: endDate || null,
        created_by: userId,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ budget: data });
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

// Update budget
router.put('/:id', async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const {
      category,
      amount,
      currency,
      period,
      startDate,
      endDate,
      isActive,
    } = req.body;

    // Get existing budget
    const { data: existing, error: fetchError } = await supabase
      .from('budgets')
      .select('organization_id, created_by')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Verify user has permission
    const userRole = await verifyOrganizationAccess(userId, existing.organization_id);
    const canEdit = ['owner', 'admin'].includes(userRole) ||
                    (userRole === 'member' && existing.created_by === userId);

    if (!canEdit) {
      return res.status(403).json({ error: 'You can only edit your own budgets' });
    }

    // Build update object
    const updates = {
      updated_by: userId,
    };

    if (category !== undefined) updates.category = category;
    if (amount !== undefined) updates.amount = parseFloat(amount);
    if (currency !== undefined) updates.currency = currency;
    if (period !== undefined) updates.period = period;
    if (startDate !== undefined) updates.start_date = startDate;
    if (endDate !== undefined) updates.end_date = endDate;
    if (isActive !== undefined) updates.is_active = isActive;

    // Update budget
    const { data, error } = await supabase
      .from('budgets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ budget: data });
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    // Get existing budget
    const { data: existing, error: fetchError } = await supabase
      .from('budgets')
      .select('organization_id, created_by')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    // Verify user has permission
    const userRole = await verifyOrganizationAccess(userId, existing.organization_id);
    const canDelete = ['owner', 'admin'].includes(userRole) ||
                      (userRole === 'member' && existing.created_by === userId);

    if (!canDelete) {
      return res.status(403).json({ error: 'You can only delete your own budgets' });
    }

    // Delete budget
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

export default router;
