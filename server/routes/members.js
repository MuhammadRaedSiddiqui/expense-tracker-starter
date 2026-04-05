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

// Get all members for organization
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
      .from('organization_members')
      .select('*')
      .eq('organization_id', organizationId)
      .order('joined_at', { ascending: false });

    if (error) throw error;

    res.json({ members: data || [] });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Update member role
router.put('/:memberId', async (req, res) => {
  try {
    const { userId } = req;
    const { memberId } = req.params;
    const { role } = req.body;

    if (!role || !['owner', 'admin', 'member', 'viewer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Get member's organization
    const { data: member, error: memberError } = await supabase
      .from('organization_members')
      .select('organization_id, role')
      .eq('id', memberId)
      .single();

    if (memberError || !member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Verify user is owner or admin
    const userRole = await verifyOrganizationAccess(userId, member.organization_id);
    if (!['owner', 'admin'].includes(userRole)) {
      return res.status(403).json({ error: 'Only owners and admins can update roles' });
    }

    // Cannot change owner role
    if (member.role === 'owner') {
      return res.status(400).json({ error: 'Cannot change owner role' });
    }

    // Update role
    const { data, error } = await supabase
      .from('organization_members')
      .update({ role })
      .eq('id', memberId)
      .select()
      .single();

    if (error) throw error;

    res.json({ member: data });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

// Remove member
router.delete('/:memberId', async (req, res) => {
  try {
    const { userId } = req;
    const { memberId } = req.params;

    // Get member's organization
    const { data: member, error: memberError } = await supabase
      .from('organization_members')
      .select('organization_id, user_id, role')
      .eq('id', memberId)
      .single();

    if (memberError || !member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Verify user is owner or admin
    const userRole = await verifyOrganizationAccess(userId, member.organization_id);
    if (!['owner', 'admin'].includes(userRole)) {
      return res.status(403).json({ error: 'Only owners and admins can remove members' });
    }

    // Cannot remove owner
    if (member.role === 'owner') {
      return res.status(400).json({ error: 'Cannot remove organization owner' });
    }

    // Cannot remove yourself
    if (member.user_id === userId) {
      return res.status(400).json({ error: 'Cannot remove yourself. Transfer ownership first.' });
    }

    // Remove member
    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

export default router;
