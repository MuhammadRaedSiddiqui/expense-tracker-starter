import { supabase } from './supabase.js';
import { logger } from './logger.js';

export async function logAuditEvent({
  userId,
  organizationId,
  action,
  resourceType,
  resourceId,
  metadata = {},
}) {
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      organization_id: organizationId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    // Audit logging should never break the main flow
    logger.error('Audit log error', error);
  }
}
