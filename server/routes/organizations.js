import express from 'express';
import { supabase } from '../lib/supabase.js';

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
    console.error('Get organization error:', error);
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

// Create organization
router.post('/', async (req, res) => {
  try {
    const { userId } = req;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Organization name is required' });
    }

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
    console.error('Create organization error:', error);
    res.status(500).json({ error: 'Failed to create organization' });
  }
});

export default router;
