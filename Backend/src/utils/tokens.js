import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export const signToken = (payload, expiresIn = '7d') => {
  const duration = expiresIn || ENV.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: duration });
};

export const verifyToken = (token) => {
  return jwt.verify(token, ENV.JWT_SECRET);
};

export const getCookieOptions = () => {
  const isProd = ENV.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
};
