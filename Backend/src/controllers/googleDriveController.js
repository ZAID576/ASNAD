import {
  getAuthorizationUrl,
  handleOAuthCallback,
  getPickerAccessToken,
  disconnectUserDrive,
} from '../services/googleDriveService.js';
import { GoogleConnection } from '../models/GoogleConnection.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { ENV } from '../config/env.js';

export const getStatus = async (req, res, next) => {
  try {
    const connection = await GoogleConnection.findOne({
      userId: req.user._id,
      status: 'connected',
    }).lean();

    return successResponse(res, {
      connected: !!connection,
      googleEmail: connection?.googleAccountEmail || null,
      googleDisplayName: connection?.googleDisplayName || null,
      googleAvatarUrl: connection?.googleAvatarUrl || null,
      driveFolderId: connection?.driveFolderId || null,
      connectedAt: connection?.connectedAt || null,
    });
  } catch (err) {
    next(err);
  }
};

export const connect = async (req, res, next) => {
  try {
    const authUrl = getAuthorizationUrl(req.user._id);
    return successResponse(res, { authUrl, url: authUrl }, 'Authorization URL generated');
  } catch (err) {
    next(err);
  }
};

export const callback = async (req, res) => {
  try {
    const { code, state, error: googleError } = req.query;

    if (googleError) {
      return res.redirect(`${ENV.CLIENT_URL}/settings?drive_error=${encodeURIComponent(googleError)}`);
    }

    if (!code || !state) {
      return res.redirect(`${ENV.CLIENT_URL}/settings?drive_error=missing_code_or_state`);
    }

    await handleOAuthCallback(code, state);

    return res.redirect(`${ENV.CLIENT_URL}/settings?drive=connected`);
  } catch (err) {
    const message = err.message || 'Google Drive connection failed';
    return res.redirect(`${ENV.CLIENT_URL}/settings?drive_error=${encodeURIComponent(message)}`);
  }
};

export const getToken = async (req, res, next) => {
  try {
    const tokenData = await getPickerAccessToken(req.user._id);
    return successResponse(res, tokenData, 'Picker token retrieved');
  } catch (err) {
    next(err);
  }
};

export const disconnect = async (req, res, next) => {
  try {
    await disconnectUserDrive(req.user._id);
    return successResponse(res, null, 'Google Drive disconnected successfully');
  } catch (err) {
    next(err);
  }
};
