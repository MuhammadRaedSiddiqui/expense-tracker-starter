import express from 'express';
import { supabase } from '../lib/supabase.js';
import { validateRequest, organizationSchema } from '../lib/validation.js';
import { verifyOrganizationAccess } from '../middleware/orgAccess.js';
import { logAuditEvent } from '../lib/auditLog.js';
import { logger } from '../lib/logger.js';

const router = express.Router();

// Get user's organization
router.get('/me', async (req, res) => {
  try {
    const { userId } = req;

    const { data, error } = await supabase
      .from('organization_members')
      .select('organization_id, organizations(*)')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'No organization found' });
      }
      throw error;
    }

    res.json({ organization: data.organizations });
  } catch (error) {
    logger.error('Get organization error', error);
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

// Create organization
router.post('/', validateRequest(organizationSchema), async (req, res) => {
  try {
    const { userId } = req;
    const { name } = req.body;

    // Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      })
      .select()
      .single();

    if (orgError) throw orgError;

    // Add user as owner
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: org.id,
        user_id: userId,
        role: 'owner',
        joined_at: new Date().toISOString(),
      });

    if (memberError) throw memberError;

    res.status(201).json({ organization: org });
  } catch (error) {
    logger.error('Create organization error', error);
    res.status(500).json({ error: 'Failed to create organization' });
  }
});

// Delete organization
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    const role = await verifyOrganizationAccess(userId, id);

    if (!role) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    if (role !== 'owner') {
      return res.status(403).json({ error: 'Only owners can delete organizations' });
    }

    const { error: deleteError } = await supabase
      .from('organizations')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    logAuditEvent({
      userId,
      organizationId: id,
      action: 'delete',
      resourceType: 'organization',
      resourceId: id,
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('Delete organization error', error);
    res.status(500).json({ error: 'Failed to delete organization' });
  }
});

export default router;
