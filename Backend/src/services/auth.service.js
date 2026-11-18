import { z } from 'zod';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { Category } from '../models/Category.js';
import { GoogleConnection } from '../models/GoogleConnection.js';
import { Token } from '../models/Token.js';
import { AuditLog } from '../models/AuditLog.js';
import {
  hashPassword,
  comparePassword,
  signJwt,
  generateSecureRandomToken,
  hashRandomToken,
} from '../lib/security.js';
import { AppError } from '../middleware/errorMiddleware.js';
import { logger } from '../lib/logger.js';

// Schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const DEFAULT_CATEGORIES = [
  { name: 'Identity & Passports', color: '#4285F4', icon: 'shield' },
  { name: 'Education & Certificates', color: '#34A853', icon: 'graduation-cap' },
  { name: 'Financial & Banking', color: '#FBBC05', icon: 'credit-card' },
  { name: 'Medical & Healthcare', color: '#EA4335', icon: 'activity' },
  { name: 'Legal & Contracts', color: '#8E24AA', icon: 'file-text' },
  { name: 'Personal & Receipts', color: '#00897B', icon: 'user' },
];

export async function registerUser({ name, email, password, userAgent = '', ipAddress = '' }) {
  registerSchema.parse({ name, email, password });

  const normalized = email.trim().toLowerCase();
  const existingUser = await User.findOne({ emailNormalized: normalized });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409, 'EMAIL_EXISTS');
  }

  const passwordHash = await hashPassword(password);

  const newUser = await User.create({
    name: name.trim(),
    email: email.trim(),
    emailNormalized: normalized,
    passwordHash,
    status: 'active',
  });

  // Seed default starter categories for new user
  try {
    const categoriesToSeed = DEFAULT_CATEGORIES.map(c => ({
      userId: newUser._id,
      name: c.name,
      color: c.color,
      icon: c.icon,
    }));
    await Category.insertMany(categoriesToSeed);
  } catch (seedErr) {
    logger.warn('Error seeding default categories:', seedErr.message);
  }

  // Generate token and session
  const token = signJwt({ userId: newUser._id.toString() }, '7d');
  const tokenHash = hashRandomToken(token);

  await Session.create({
    userId: newUser._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent,
    ipAddress,
  });

  await AuditLog.create({
    userId: newUser._id,
    action: 'USER_REGISTERED',
    resourceType: 'user',
    resourceId: newUser._id,
  });

  return {
    user: {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      status: newUser.status,
      emailVerifiedAt: newUser.emailVerifiedAt,
      isGoogleConnected: false,
    },
    token,
  };
}

export async function loginUser({ email, password, userAgent = '', ipAddress = '' }) {
  loginSchema.parse({ email, password });

  const normalized = email.trim().toLowerCase();
  const user = await User.findOne({ emailNormalized: normalized }).select('+passwordHash');
  if (!user) {
    throw new AppError('Invalid email or password combination.', 401, 'INVALID_CREDENTIALS');
  }

  if (user.status !== 'active') {
    throw new AppError('Your account has been suspended or deactivated.', 403, 'ACCOUNT_INACTIVE');
  }

  const isValidPassword = await comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    throw new AppError('Invalid email or password combination.', 401, 'INVALID_CREDENTIALS');
  }

  const token = signJwt({ userId: user._id.toString() }, '7d');
  const tokenHash = hashRandomToken(token);

  await Session.create({
    userId: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent,
    ipAddress,
  });

  const googleConn = await GoogleConnection.findOne({ userId: user._id, status: 'connected' });

  await AuditLog.create({
    userId: user._id,
    action: 'USER_LOGGED_IN',
    resourceType: 'user',
    resourceId: user._id,
  });

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
      isGoogleConnected: !!googleConn,
    },
    token,
  };
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const googleConn = await GoogleConnection.findOne({ userId: user._id, status: 'connected' });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    status: user.status,
    emailVerifiedAt: user.emailVerifiedAt,
    isGoogleConnected: !!googleConn,
    googleAccountEmail: googleConn ? googleConn.googleAccountEmail : null,
  };
}

export async function logoutUser(userId, token) {
  if (token) {
    const tokenHash = hashRandomToken(token);
    await Session.deleteMany({ userId, tokenHash });
  }
}
