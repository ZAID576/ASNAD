import { z } from 'zod';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyUserEmail,
  createPasswordResetToken,
  resetUserPassword,
} from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { getCookieOptions } from '../utils/tokens.js';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userAgent = req.headers['user-agent'] || '';

    const { user, token } = await registerUser({ name, email, password, userAgent });

    res.cookie('asnad_session', token, getCookieOptions());

    return successResponse(res, { user, token }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userAgent = req.headers['user-agent'] || '';

    const { user, token } = await loginUser({ email, password, userAgent });

    res.cookie('asnad_session', token, getCookieOptions());

    return successResponse(res, { user, token }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (req.session) {
      await logoutUser(req.session);
    }

    res.clearCookie('asnad_session', { path: '/' });
    return successResponse(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user._id);
    return successResponse(res, { user }, 'User retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return errorResponse(res, 'Verification token is required', 'MISSING_TOKEN', 400);
    }

    await verifyUserEmail(token);
    return successResponse(res, null, 'Email verified successfully');
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return errorResponse(res, 'Email is required', 'MISSING_EMAIL', 400);
    }

    const result = await createPasswordResetToken(email);

    // In production, an email would be dispatched.
    // For local development, return the token in non-production environments to allow immediate password reset testing.
    const responseData = process.env.NODE_ENV !== 'production' && result ? { resetToken: result.rawToken } : null;

    return successResponse(
      res,
      responseData,
      'If your email is registered, you will receive password reset instructions.'
    );
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await resetUserPassword({ rawToken: token, newPassword: password });
    return successResponse(res, null, 'Password reset successful. Please login with your new password.');
  } catch (err) {
    next(err);
  }
};
