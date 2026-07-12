import { supabase } from '../lib/supabase.js';

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

export function requireOrgAccess(minRoles) {
  return async (req, res, next) => {
    const organizationId = req.body?.organizationId || req.query?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const role = await verifyOrganizationAccess(req.userId, organizationId);

    if (!role) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (minRoles && !minRoles.includes(role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    req.orgRole = role;
    req.organizationId = organizationId;
    next();
  };
}

export { verifyOrganizationAccess };
