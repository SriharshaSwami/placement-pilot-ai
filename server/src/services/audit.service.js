import AuditLog from '../models/AuditLog.js';
import logger from '../logger/index.js';

class AuditService {
  /**
   * Log an audit event securely
   * @param {Object} params
   * @param {String} params.userId
   * @param {String} params.action - The action performed (e.g., 'LOGIN', 'AI_REQUEST', 'PASSWORD_RESET')
   * @param {String} [params.resource] - The resource affected (e.g., 'Resume:123')
   * @param {Object} [params.metadata] - Additional non-sensitive context
   * @param {String} [params.ipAddress]
   * @param {String} [params.userAgent]
   */
  async logEvent({ userId, action, resource, metadata, ipAddress, userAgent }) {
    try {
      // Fire and forget
      AuditLog.create({
        userId,
        action,
        resource,
        metadata,
        ipAddress,
        userAgent,
      }).catch((err) => {
        logger.error(`Failed to write audit log: ${err.message}`);
      });
    } catch (err) {
      logger.error(`Failed to initiate audit log: ${err.message}`);
    }
  }

  /**
   * Fetch recent audit logs for a user (admin or self)
   */
  async getUserLogs(userId, limit = 50) {
    return AuditLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

export default new AuditService();
