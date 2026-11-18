import crypto from 'crypto';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { Category } from '../models/Category.js';
import { EmailToken } from '../models/EmailToken.js';
import { GoogleConnection } from '../models/GoogleConnection.js';
import { signToken } from '../utils/tokens.js';
import { logAudit } from './auditService.js';

const DEFAULT_CATEGORIES = [
  { name: 'Identity & IDs', color: '#34A853', icon: 'shield' },
  { name: 'Education & Degrees', color: '#FBBC05', icon: 'graduation-cap' },
  { name: 'Banking & Financial', color: '#EA4335', icon: 'credit-card' },
  { name: 'Employment & Career', color: '#4285F4', icon: 'briefcase' },
  { name: 'Medical & Health', color: '#00897B', icon: 'activity' },
  { name: 'Property & Housing', color: '#5C6BC0', icon: 'home' },
  { name: 'Business & Legal', color: '#3949AB', icon: 'file-text' },
  { name: 'Personal & General', color: '#5F6368', icon: 'user' },
];

export const registerUser = async ({ name, email, password, userAgent = '' }) => {
  const emailNormalized = email.trim().toLowerCase();

  const existingUser = await User.findOne({ emailNormalized });
  if (existingUser) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 400;
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    name: name.trim(),
    email: email.trim(),
    emailNormalized,
    passwordHash,
    status: 'active',
  });

  // Seed starter categories for user convenience
  const categoriesToInsert = DEFAULT_CATEGORIES.map((cat) => ({
    userId: user._id,
    name: cat.name,
    color: cat.color,
    icon: cat.icon,
  }));
  await Category.insertMany(categoriesToInsert);

  // Issue session token
  const token = signToken({ userId: user._id });
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await Session.create({
    userId: user._id,
    tokenHash,
    expiresAt,
    userAgent,
    lastUsedAt: new Date(),
  });

  await logAudit({
    userId: user._id,
    action: 'USER_REGISTERED',
    resourceType: 'User',
    resourceId: user._id,
    metadata: { email: user.email },
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
    },
    token,
  };
};

export const loginUser = async ({ email, password, userAgent = '' }) => {
  const emailNormalized = email.trim().toLowerCase();
  const user = await User.findOne({ emailNormalized }).select('+passwordHash');

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  if (user.status !== 'active') {
    const error = new Error('Account is suspended or inactive');
    error.statusCode = 403;
    error.code = 'ACCOUNT_DISABLED';
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  // Issue session token
  const token = signToken({ userId: user._id });
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await Session.create({
    userId: user._id,
    tokenHash,
    expiresAt,
    userAgent,
    lastUsedAt: new Date(),
  });

  await logAudit({
    userId: user._id,
    action: 'USER_LOGIN',
    resourceType: 'User',
    resourceId: user._id,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
    },
    token,
  };
};

export const logoutUser = async (session) => {
  if (session) {
    await Session.deleteOne({ _id: session._id });
  }
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  const googleConn = await GoogleConnection.findOne({ userId, status: 'connected' });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    status: user.status,
    emailVerifiedAt: user.emailVerifiedAt,
    createdAt: user.createdAt,
    googleDrive: googleConn
      ? {
          connected: true,
          googleEmail: googleConn.googleAccountEmail,
          googleDisplayName: googleConn.googleDisplayName,
          googleAvatarUrl: googleConn.googleAvatarUrl,
          driveFolderId: googleConn.driveFolderId,
          connectedAt: googleConn.connectedAt,
        }
      : {
          connected: false,
        },
  };
};

export const createEmailVerificationToken = async (userId) => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await EmailToken.deleteMany({ userId, type: 'VERIFY_EMAIL' });
  await EmailToken.create({
    userId,
    tokenHash,
    type: 'VERIFY_EMAIL',
    expiresAt,
  });

  return rawToken;
};

export const verifyUserEmail = async (rawToken) => {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const tokenDoc = await EmailToken.findOne({
    tokenHash,
    type: 'VERIFY_EMAIL',
    expiresAt: { $gt: new Date() },
  });

  if (!tokenDoc) {
    const error = new Error('Invalid or expired verification token');
    error.statusCode = 400;
    error.code = 'INVALID_TOKEN';
    throw error;
  }

  await User.findByIdAndUpdate(tokenDoc.userId, { emailVerifiedAt: new Date() });
  await EmailToken.deleteOne({ _id: tokenDoc._id });

  await logAudit({
    userId: tokenDoc.userId,
    action: 'EMAIL_VERIFIED',
    resourceType: 'User',
    resourceId: tokenDoc.userId,
  });

  return true;
};

export const createPasswordResetToken = async (email) => {
  const emailNormalized = email.trim().toLowerCase();
  const user = await User.findOne({ emailNormalized });

  // Return success without revealing user existence (security requirement)
  if (!user) {
    return null;
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await EmailToken.deleteMany({ userId: user._id, type: 'RESET_PASSWORD' });
  await EmailToken.create({
    userId: user._id,
    tokenHash,
    type: 'RESET_PASSWORD',
    expiresAt,
  });

  return { rawToken, user };
};

export const resetUserPassword = async ({ rawToken, newPassword }) => {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const tokenDoc = await EmailToken.findOne({
    tokenHash,
    type: 'RESET_PASSWORD',
    expiresAt: { $gt: new Date() },
  });

  if (!tokenDoc) {
    const error = new Error('Invalid or expired password reset token');
    error.statusCode = 400;
    error.code = 'INVALID_TOKEN';
    throw error;
  }

  const passwordHash = await User.hashPassword(newPassword);
  await User.findByIdAndUpdate(tokenDoc.userId, { passwordHash });

  // Invalidate all existing sessions for security
  await Session.deleteMany({ userId: tokenDoc.userId });
  await EmailToken.deleteOne({ _id: tokenDoc._id });

  await logAudit({
    userId: tokenDoc.userId,
    action: 'PASSWORD_RESET',
    resourceType: 'User',
    resourceId: tokenDoc.userId,
  });

  return true;
};
