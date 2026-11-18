import { AuditLog } from '../models/AuditLog.js';
import { logger } from '../utils/logger.js';

export const logAudit = async ({ userId, action, resourceType, resourceId = null, metadata = {} }) => {
  try {
    await AuditLog.create({
      userId,
      action,
      resourceType,
      resourceId,
      metadata,
    });
  } catch (err) {
    // Audit logging failure should not crash the main request flow
    logger.error('Failed to write audit log:', err);
  }
};
