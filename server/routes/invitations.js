import express from 'express';
import { supabase } from '../lib/supabase.js';
import crypto from 'crypto';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { sendInvitationEmail } from '../lib/email.js';

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

// Create invitation
router.post('/', async (req, res) => {
  try {
    const { userId } = req;
    const { organizationId, email, role } = req.body;

    if (!organizationId || !email || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['admin', 'member', 'viewer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Verify user is owner or admin
    const userRole = await verifyOrganizationAccess(userId, organizationId);
    if (!['owner', 'admin'].includes(userRole)) {
      return res.status(403).json({ error: 'Only owners and admins can invite members' });
    }

    // Check if user is already a member (by checking if any member has this email in their user data)
    // Note: This is a simplified check. In production, you'd want to check against Clerk user emails
    const { data: existingInvite } = await supabase
      .from('invitations')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('email', email)
      .is('accepted_at', null)
      .single();

    if (existingInvite) {
      return res.status(400).json({ error: 'An invitation has already been sent to this email' });
    }

    // Generate invitation token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Create invitation
    const { data, error } = await supabase
      .from('invitations')
      .insert({
        organization_id: organizationId,
        email,
        role,
        token,
        invited_by: userId,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Get organization name for email
    const { data: orgData } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single();

    const organizationName = orgData?.name || 'Finance Tracker';

    // Get inviter email from Clerk
    let inviterEmail = 'team@financetracker.com';
    try {
      const inviter = await clerkClient.users.getUser(userId);
      inviterEmail = inviter.emailAddresses[0]?.emailAddress || inviterEmail;
    } catch (clerkError) {
      console.error('Failed to fetch inviter email from Clerk:', clerkError);
    }

    // Send invitation email
    try {
      await sendInvitationEmail({
        to: email,
        invitationToken: token,
        organizationName,
        inviterEmail,
        role,
      });
      console.log(`Invitation email sent to ${email}`);
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      // Don't fail the invitation creation if email fails
      // The invitation is still created and can be shared manually
    }

    res.status(201).json({ invitation: data });
  } catch (error) {
    console.error('Create invitation error:', error);
    res.status(500).json({ error: 'Failed to create invitation' });
  }
});

// Get pending invitations
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
      .from('invitations')
      .select('*')
      .eq('organization_id', organizationId)
      .is('accepted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ invitations: data || [] });
  } catch (error) {
    console.error('Get invitations error:', error);
    res.status(500).json({ error: 'Failed to fetch invitations' });
  }
});

// Accept invitation
router.post('/:token/accept', async (req, res) => {
  try {
    const { userId } = req;
    const { token } = req.params;

    // Get invitation
    const { data: invitation, error: invError } = await supabase
      .from('invitations')
      .select('*')
      .eq('token', token)
      .single();

    if (invError || !invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    // Check if expired
    if (new Date(invitation.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Invitation has expired' });
    }

    // Check if already accepted
    if (invitation.accepted_at) {
      return res.status(400).json({ error: 'Invitation already accepted' });
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', invitation.organization_id)
      .eq('user_id', userId)
      .single();

    if (existingMember) {
      return res.status(400).json({ error: 'You are already a member of this organization' });
    }

    // Add user to organization
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: invitation.organization_id,
        user_id: userId,
        role: invitation.role,
        invited_by: invitation.invited_by,
        invited_at: invitation.created_at,
        joined_at: new Date().toISOString(),
      });

    if (memberError) throw memberError;

    // Mark invitation as accepted
    const { error: updateError } = await supabase
      .from('invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invitation.id);

    if (updateError) throw updateError;

    res.json({ success: true, organizationId: invitation.organization_id });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ error: 'Failed to accept invitation' });
  }
});

// Revoke invitation
router.delete('/:invitationId', async (req, res) => {
  try {
    const { userId } = req;
    const { invitationId } = req.params;

    // Get invitation
    const { data: invitation, error: invError } = await supabase
      .from('invitations')
      .select('organization_id')
      .eq('id', invitationId)
      .single();

    if (invError || !invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    // Verify user is owner or admin
    const role = await verifyOrganizationAccess(userId, invitation.organization_id);
    if (!['owner', 'admin'].includes(role)) {
      return res.status(403).json({ error: 'Only owners and admins can revoke invitations' });
    }

    // Delete invitation
    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', invitationId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Revoke invitation error:', error);
    res.status(500).json({ error: 'Failed to revoke invitation' });
  }
});

export default router;
