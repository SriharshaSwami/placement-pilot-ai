import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Session from '../models/Session.js';
import config from '../config/index.js';
import CustomError from '../errors/CustomError.js';

class SessionService {
  /**
   * Generate a random refresh token
   */
  generateRefreshToken() {
    return crypto.randomBytes(40).toString('hex');
  }

  /**
   * Create a new session for a user
   */
  async createSession(userId, userAgent, ipAddress) {
    const refreshToken = this.generateRefreshToken();
    
    // Calculate expiration based on config string (e.g., '7d')
    const daysMatch = config.jwt.refreshExpiresIn.match(/(\d+)d/);
    const days = daysMatch ? parseInt(daysMatch[1]) : 7;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const session = await Session.create({
      userId,
      refreshToken,
      userAgent,
      ipAddress,
      expiresAt,
    });

    return { session, refreshToken };
  }

  /**
   * Verify and rotate a refresh token
   */
  async rotateSession(userId, oldRefreshToken, userAgent, ipAddress) {
    const session = await Session.findOne({ userId, refreshToken: oldRefreshToken });

    if (!session) {
      // Possible replay attack: an invalid/old refresh token was used.
      // Revoke all sessions for this user.
      await Session.deleteMany({ userId });
      throw new CustomError('Invalid refresh token. All sessions revoked.', 401, 'INVALID_REFRESH_TOKEN');
    }

    if (!session.isValid || session.expiresAt < new Date()) {
      await session.deleteOne();
      throw new CustomError('Session expired or invalid', 401, 'SESSION_EXPIRED');
    }

    // Generate new refresh token
    const newRefreshToken = this.generateRefreshToken();
    
    // Update session
    session.refreshToken = newRefreshToken;
    session.lastActiveAt = Date.now();
    session.userAgent = userAgent || session.userAgent;
    session.ipAddress = ipAddress || session.ipAddress;
    await session.save();

    return { session, newRefreshToken };
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(userId, sessionId) {
    const session = await Session.findOneAndDelete({ _id: sessionId, userId });
    if (!session) {
      throw new CustomError('Session not found', 404, 'SESSION_NOT_FOUND');
    }
    return true;
  }

  /**
   * Revoke all sessions for a user
   */
  async revokeAllSessions(userId) {
    await Session.deleteMany({ userId });
    return true;
  }

  /**
   * Revoke all OTHER sessions for a user
   */
  async revokeOtherSessions(userId, currentSessionId) {
    await Session.deleteMany({ userId, _id: { $ne: currentSessionId } });
    return true;
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(userId) {
    return Session.find({ userId, isValid: true }).sort({ lastActiveAt: -1 });
  }
}

export default new SessionService();
