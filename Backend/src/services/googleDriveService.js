import crypto from 'crypto';
import { Readable } from 'stream';
import { google } from 'googleapis';
import { ENV } from '../config/env.js';
import { createOAuth2Client, DRIVE_SCOPES } from '../config/google.js';
import { encrypt, decrypt } from '../utils/encryption.js';
import { GoogleConnection } from '../models/GoogleConnection.js';
import { logAudit } from './auditService.js';
import { logger } from '../utils/logger.js';

const getHmacKey = () => {
  return String(
    process.env.TOKEN_ENCRYPTION_KEY ||
    process.env.ENCRYPTION_KEY ||
    ENV?.TOKEN_ENCRYPTION_KEY ||
    ENV?.ENCRYPTION_KEY ||
    '3f8a49c6d123b0a79e4f5a6b7c8d9e0f1a2b3c4d5e6f708192a3b4c5d6e7f809'
  );
};

/**
 * Generate secure HMAC-signed OAuth state string
 */
export const generateOAuthState = (userId) => {
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const payload = `${userId}:${timestamp}:${nonce}`;
  const key = getHmacKey();
  const hmac = crypto.createHmac('sha256', key).update(payload).digest('hex');
  return Buffer.from(JSON.stringify({ payload, hmac })).toString('base64url');
};

/**
 * Validate HMAC-signed OAuth state string
 */
export const validateOAuthState = (stateString) => {
  try {
    const { payload, hmac } = JSON.parse(Buffer.from(stateString, 'base64url').toString('utf8'));
    const key = getHmacKey();
    const expectedHmac = crypto.createHmac('sha256', key).update(payload).digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) {
      return null;
    }

    const [userId, timestamp] = payload.split(':');
    // Ensure state is not older than 15 minutes
    if (Date.now() - parseInt(timestamp, 10) > 15 * 60 * 1000) {
      return null;
    }

    return userId;
  } catch (err) {
    logger.error('Failed to validate OAuth state:', err);
    return null;
  }
};

/**
 * Generate OAuth Consent URL
 */
export const getAuthorizationUrl = (userId) => {
  const oauth2Client = createOAuth2Client();
  const state = generateOAuthState(userId);

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // Forces refresh token return
    scope: DRIVE_SCOPES,
    state,
    include_granted_scopes: true,
  });
};

/**
 * Exchange OAuth authorization code and save encrypted credentials
 */
export const handleOAuthCallback = async (code, state) => {
  const userId = validateOAuthState(state);
  if (!userId) {
    const error = new Error('Invalid or expired OAuth state parameter');
    error.statusCode = 400;
    error.code = 'INVALID_OAUTH_STATE';
    throw error;
  }

  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  if (!tokens.refresh_token) {
    // If user previously connected, check if we have a refresh token on file
    const existingConn = await GoogleConnection.findOne({ userId });
    if (!existingConn?.encryptedRefreshToken) {
      const error = new Error('No refresh token received from Google. Please reconnect with full consent.');
      error.statusCode = 400;
      error.code = 'NO_REFRESH_TOKEN';
      throw error;
    }
  }

  // Fetch Google user profile
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data: profile } = await oauth2.userinfo.get();

  const encryptedRefreshToken = tokens.refresh_token
    ? encrypt(tokens.refresh_token)
    : (await GoogleConnection.findOne({ userId })).encryptedRefreshToken;

  // Ensure dedicated "Asnad" folder exists in user's Google Drive
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  const folderId = await ensureAsnadFolder(drive);

  const connection = await GoogleConnection.findOneAndUpdate(
    { userId },
    {
      googleAccountEmail: profile.email,
      googleDisplayName: profile.name,
      googleAvatarUrl: profile.picture,
      encryptedRefreshToken,
      driveFolderId: folderId,
      scopes: tokens.scope ? tokens.scope.split(' ') : DRIVE_SCOPES,
      status: 'connected',
      connectedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  await logAudit({
    userId,
    action: 'GOOGLE_DRIVE_CONNECTED',
    resourceType: 'GoogleConnection',
    resourceId: connection._id,
    metadata: { googleEmail: profile.email },
  });

  return { userId, profile, folderId };
};

/**
 * Ensure dedicated "Asnad" folder exists in user's Drive
 */
export const ensureAsnadFolder = async (driveClient) => {
  try {
    // Search for existing non-trashed "Asnad" folder created by this app
    const res = await driveClient.files.list({
      q: "name = 'Asnad' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (res.data.files && res.data.files.length > 0) {
      return res.data.files[0].id;
    }

    // Create new folder
    const folderMetadata = {
      name: 'Asnad',
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Asnad Document Vault — Dedicated storage folder for your personal documents.',
    };

    const folder = await driveClient.files.create({
      resource: folderMetadata,
      fields: 'id, name',
    });

    return folder.data.id;
  } catch (error) {
    logger.error('Error in ensureAsnadFolder:', error);
    throw error;
  }
};

/**
 * Retrieve authenticated Google Drive v3 client for a given user
 */
export const getAuthenticatedDriveClient = async (userId) => {
  const connection = await GoogleConnection.findOne({ userId, status: 'connected' });
  if (!connection) {
    const error = new Error('Google Drive is not connected. Please connect your Google Drive first.');
    error.statusCode = 400;
    error.code = 'DRIVE_NOT_CONNECTED';
    throw error;
  }

  const refreshToken = decrypt(connection.encryptedRefreshToken);
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  return { drive, oauth2Client, connection };
};

/**
 * Get short-lived access token for Google Picker
 */
export const getPickerAccessToken = async (userId) => {
  const { oauth2Client } = await getAuthenticatedDriveClient(userId);
  const { token } = await oauth2Client.getAccessToken();

  const rawKey = String(ENV.GOOGLE_PICKER_API_KEY || ENV.GOOGLE_API_KEY || process.env.GOOGLE_PICKER_API_KEY || '').trim();
  const apiKey = rawKey.startsWith('AIzaSy') ? rawKey : '';

  return {
    accessToken: token,
    apiKey,
    projectNumber: ENV.GOOGLE_PROJECT_NUMBER,
    clientId: ENV.GOOGLE_CLIENT_ID,
  };
};

/**
 * Upload a file directly into the user's dedicated "Asnad" folder in Drive
 */
export const uploadFileToUserDrive = async ({ userId, fileBuffer, fileName, mimeType }) => {
  const { drive, connection } = await getAuthenticatedDriveClient(userId);

  let folderId = connection.driveFolderId;
  if (!folderId) {
    folderId = await ensureAsnadFolder(drive);
    connection.driveFolderId = folderId;
    await connection.save();
  }

  const stream = new Readable();
  stream.push(fileBuffer);
  stream.push(null);

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType,
    body: stream,
  };

  const res = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id, name, mimeType, size, webViewLink, webContentLink',
  });

  return res.data;
};

/**
 * Initiate a direct resumable upload session for the user's browser.
 * This allows uploading ANY size file (videos, large photos, archives)
 * directly from browser to Google Drive, completely bypassing Vercel's 4.5MB payload limit!
 */
export const initiateResumableUpload = async ({ userId, fileName, mimeType, size }) => {
  const { drive, oauth2Client, connection } = await getAuthenticatedDriveClient(userId);

  let folderId = connection.driveFolderId;
  if (!folderId) {
    folderId = await ensureAsnadFolder(drive);
    connection.driveFolderId = folderId;
    await connection.save();
  }

  const { token } = await oauth2Client.getAccessToken();

  const metadata = {
    name: fileName,
    parents: [folderId],
  };

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Upload-Content-Type': mimeType || 'application/octet-stream',
  };

  if (size && size > 0) {
    headers['X-Upload-Content-Length'] = String(size);
  }

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
    method: 'POST',
    headers,
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Drive upload session initiation failed (${response.status}): ${errorText}`);
  }

  const uploadUrl = response.headers.get('location');
  if (!uploadUrl) {
    throw new Error('Google Drive did not return a resumable upload location URL');
  }

  return {
    uploadUrl,
    folderId,
    accessToken: token,
  };
};

/**
 * Stream a file directly from Google Drive
 */
export const getFileDownloadStream = async (userId, driveFileId) => {
  const { drive } = await getAuthenticatedDriveClient(userId);

  // Get metadata first
  const metadata = await drive.files.get({
    fileId: driveFileId,
    fields: 'id, name, mimeType, size',
  });

  // Get stream
  const response = await drive.files.get(
    { fileId: driveFileId, alt: 'media' },
    { responseType: 'stream' }
  );

  return {
    stream: response.data,
    name: metadata.data.name,
    mimeType: metadata.data.mimeType,
    size: metadata.data.size,
  };
};

/**
 * Delete a file from Google Drive
 */
export const deleteFileFromUserDrive = async (userId, driveFileId) => {
  try {
    const { drive } = await getAuthenticatedDriveClient(userId);
    await drive.files.delete({ fileId: driveFileId });
    return true;
  } catch (error) {
    logger.warn(`Could not delete Drive file ${driveFileId}: ${error.message}`);
    return false;
  }
};

/**
 * Disconnect Google Drive
 */
export const disconnectUserDrive = async (userId) => {
  const connection = await GoogleConnection.findOne({ userId });
  if (connection) {
    try {
      const refreshToken = decrypt(connection.encryptedRefreshToken);
      const oauth2Client = createOAuth2Client();
      await oauth2Client.revokeToken(refreshToken);
    } catch (e) {
      logger.warn(`Error revoking Google token: ${e.message}`);
    }

    await GoogleConnection.deleteOne({ userId });

    await logAudit({
      userId,
      action: 'GOOGLE_DRIVE_DISCONNECTED',
      resourceType: 'GoogleConnection',
      resourceId: connection._id,
    });
  }

  return true;
};
