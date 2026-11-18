import { verifyJwt } from '../lib/security.js';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { GoogleConnection } from '../models/GoogleConnection.js';

export async function requireAuth(req, res, next) {
  try {
    let token = null;

    // 1. Check cookies
    if (req.cookies && req.cookies.asnad_session) {
      token = req.cookies.asnad_session;
    } 
    // 2. Check Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please log in.',
        },
      });
    }

    const decoded = verifyJwt(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Session has expired or is invalid. Please log in again.',
        },
      });
    }

    // Look up user
    const user = await User.findById(decoded.userId);
    if (!user || user.status !== 'active') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_INACTIVE',
          message: 'User account is inactive or not found.',
        },
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
}

export async function requireGoogleDrive(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
    }

    const connection = await GoogleConnection.findOne({
      userId: req.user._id,
      status: 'connected',
    });

    if (!connection) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DRIVE_NOT_CONNECTED',
          message: 'Please connect your Google Drive account before managing or uploading documents.',
        },
      });
    }

    req.googleConnection = connection;
    next();
  } catch (error) {
    next(error);
  }
}

