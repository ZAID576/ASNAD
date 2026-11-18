import * as authService from '../services/auth.service.js';
import { env } from '../config/env.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip || req.socket.remoteAddress || '';

    const result = await authService.registerUser({
      name,
      email,
      password,
      userAgent,
      ipAddress,
    });

    res.cookie('asnad_session', result.token, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      data: result,
      message: 'Account created successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip || req.socket.remoteAddress || '';

    const result = await authService.loginUser({
      email,
      password,
      userAgent,
      ipAddress,
    });

    res.cookie('asnad_session', result.token, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Logged in successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    await authService.logoutUser(req.user._id, req.token);
    res.clearCookie('asnad_session');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
}

