import crypto from 'crypto';
import { verifyToken } from '../utils/tokens.js';
import { errorResponse } from '../utils/response.js';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';

export const requireAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.asnad_session;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token && req.query?.token) {
      token = req.query.token;
    }

    if (!token) {
      return errorResponse(res, 'Authentication required', 'UNAUTHORIZED', 401);
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return errorResponse(res, 'Invalid or expired session token', 'TOKEN_EXPIRED', 401);
    }

    // Verify user exists and is active
    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse(res, 'User no longer exists', 'USER_NOT_FOUND', 401);
    }

    if (user.status !== 'active') {
      return errorResponse(res, 'Your account is suspended or pending', 'ACCOUNT_DISABLED', 403);
    }

    // Hash token to verify active session in DB
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const session = await Session.findOne({
      userId: user._id,
      tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return errorResponse(res, 'Session is invalid or has expired', 'SESSION_EXPIRED', 401);
    }

    // Update lastUsedAt lazily if older than 5 minutes
    if (Date.now() - session.lastUsedAt.getTime() > 5 * 60 * 1000) {
      session.lastUsedAt = new Date();
      session.save().catch(() => {});
    }

    req.user = user;
    req.session = session;
    req.token = token;

    next();
  } catch (error) {
    return errorResponse(res, 'Authentication check failed', 'AUTH_ERROR', 401, error.message);
  }
};
