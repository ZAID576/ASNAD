import * as driveService from '../services/googleDrive.service.js';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

export async function getStatus(req, res, next) {
  try {
    const status = await driveService.getGoogleDriveStatus(req.user._id);
    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
}

export async function getConnectUrl(req, res, next) {
  try {
    const url = driveService.getAuthorizationUrl(req.user._id.toString());
    res.status(200).json({
      success: true,
      data: { url },
    });
  } catch (error) {
    next(error);
  }
}

function getRedirectBase(req) {
  if (process.env.CLIENT_URL) return process.env.CLIENT_URL;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
  if (host && (host.includes('vercel.app') || host.includes('localhost'))) {
    return `${proto}://${host}`;
  }
  return env.CLIENT_URL || 'http://localhost:5173';
}

export async function handleCallback(req, res, next) {
  const { code, state, error } = req.query;
  const base = getRedirectBase(req);

  if (error) {
    logger.warn('Google OAuth returned error query param:', error);
    return res.redirect(`${base}/settings?drive_error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return res.redirect(`${base}/settings?drive_error=Missing+authorization+code+or+state`);
  }

  try {
    await driveService.handleOAuthCallback(code, state);
    return res.redirect(`${base}/dashboard?drive_connected=true`);
  } catch (err) {
    logger.error('Google OAuth callback handling error:', err);
    return res.redirect(`${base}/settings?drive_error=${encodeURIComponent(err.message)}`);
  }
}

export async function getPickerToken(req, res, next) {
  try {
    const config = await driveService.getPickerConfig(req.user._id);
    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    next(error);
  }
}

export async function importPickerDoc(req, res, next) {
  try {
    const { fileId, importType, name, mimeType, size, categoryId } = req.body;
    if (!fileId) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_FILE_ID', message: 'Google Drive file ID is required' },
      });
    }

    const document = await driveService.importGooglePickerDocument(req.user._id, {
      fileId,
      importType,
      name,
      mimeType,
      size,
      categoryId,
    });

    res.status(201).json({
      success: true,
      data: document,
      message: 'Document successfully imported from Google Drive',
    });
  } catch (error) {
    next(error);
  }
}

export async function disconnect(req, res, next) {
  try {
    const result = await driveService.disconnectGoogleDrive(req.user._id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

