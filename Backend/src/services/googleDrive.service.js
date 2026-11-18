import { google } from 'googleapis';
import { Readable } from 'stream';
import { env } from '../config/env.js';
import { GoogleConnection } from '../models/GoogleConnection.js';
import { Document } from '../models/Document.js';
import { AuditLog } from '../models/AuditLog.js';
import { encryptToken, decryptToken } from '../lib/security.js';
import { AppError } from '../middleware/errorMiddleware.js';
import { logger } from '../lib/logger.js';

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

export function getOAuth2Client() {
  return new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_CALLBACK_URL
  );
}

/**
 * Generate OAuth authorization URL
 */
export function getAuthorizationUrl(userId) {
  const oauth2Client = getOAuth2Client();
  const state = JSON.stringify({ userId, timestamp: Date.now() });

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    state: Buffer.from(state).toString('base64'),
  });
}

/**
 * Handle OAuth Callback, exchange authorization code, get profile, ensure "Asnad" folder
 */
export async function handleOAuthCallback(code, stateParam) {
  let userId;
  try {
    const decodedState = JSON.parse(Buffer.from(stateParam, 'base64').toString('utf8'));
    userId = decodedState.userId;
  } catch {
    throw new AppError('Invalid OAuth state parameter.', 400, 'INVALID_OAUTH_STATE');
  }

  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Retrieve user's Google Profile
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const userInfo = await oauth2.userinfo.get();
  const googleAccountEmail = userInfo.data.email || '';
  const googleAccountId = userInfo.data.id || '';

  // Retrieve or create the dedicated 'Asnad' folder in user's Drive
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  const folderSearch = await drive.files.list({
    q: "name = 'Asnad' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
    fields: 'files(id, name)',
    spaces: 'drive',
  });

  let driveFolderId = '';
  if (folderSearch.data.files && folderSearch.data.files.length > 0) {
    driveFolderId = folderSearch.data.files[0].id;
  } else {
    const folderMetadata = {
      name: 'Asnad',
      mimeType: 'application/vnd.google-apps.folder',
      description: 'Dedicated cloud document vault folder created by Asnad',
    };
    const createdFolder = await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id',
    });
    driveFolderId = createdFolder.data.id;
  }

  // Find existing connection to preserve existing refresh token if Google didn't return a new one
  const existingConn = await GoogleConnection.findOne({ userId });
  let refreshTokenToStore = tokens.refresh_token;

  if (!refreshTokenToStore && existingConn && existingConn.encryptedRefreshToken) {
    refreshTokenToStore = decryptToken(existingConn.encryptedRefreshToken);
  }

  if (!refreshTokenToStore) {
    throw new AppError(
      'Could not obtain Google refresh token. Please revoke Asnad access in Google Security settings and try connecting again.',
      400,
      'NO_REFRESH_TOKEN'
    );
  }

  const encryptedRefreshToken = encryptToken(refreshTokenToStore);

  const connection = await GoogleConnection.findOneAndUpdate(
    { userId },
    {
      userId,
      googleAccountEmail,
      googleAccountId,
      encryptedRefreshToken,
      driveFolderId,
      scopes: SCOPES,
      status: 'connected',
      connectedAt: new Date(),
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  await AuditLog.create({
    userId,
    action: 'GOOGLE_DRIVE_CONNECTED',
    resourceType: 'google_connection',
    resourceId: connection._id,
    metadata: { googleAccountEmail, driveFolderId },
  });

  return connection;
}

/**
 * Get authenticated Google Drive API client for a specific user
 */
export async function getAuthenticatedDriveClient(userId) {
  const connection = await GoogleConnection.findOne({ userId, status: 'connected' });
  if (!connection) {
    throw new AppError('Google Drive is not connected.', 400, 'DRIVE_NOT_CONNECTED');
  }

  const refreshToken = decryptToken(connection.encryptedRefreshToken);
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return {
    drive: google.drive({ version: 'v3', auth: oauth2Client }),
    oauth2Client,
    connection,
  };
}

/**
 * Get Google Drive status
 */
export async function getGoogleDriveStatus(userId) {
  const connection = await GoogleConnection.findOne({ userId, status: 'connected' });
  if (!connection) {
    return {
      isConnected: false,
      googleAccountEmail: null,
      driveFolderId: null,
    };
  }

  return {
    isConnected: true,
    googleAccountEmail: connection.googleAccountEmail,
    driveFolderId: connection.driveFolderId,
    connectedAt: connection.connectedAt,
  };
}

/**
 * Get fresh access token for Google Picker
 */
export async function getPickerConfig(userId) {
  const { oauth2Client, connection } = await getAuthenticatedDriveClient(userId);
  const tokenResponse = await oauth2Client.getAccessToken();
  const accessToken = typeof tokenResponse === 'string' ? tokenResponse : tokenResponse.token;

  return {
    accessToken,
    developerKey: env.GOOGLE_PICKER_API_KEY,
    appId: env.GOOGLE_CLOUD_PROJECT_NUMBER,
    asnadFolderId: connection.driveFolderId,
  };
}

/**
 * Upload a document directly to user's Asnad folder
 */
export async function uploadDocumentToDrive(userId, file, categoryId = null) {
  const { drive, connection } = await getAuthenticatedDriveClient(userId);

  const bufferStream = new Readable();
  bufferStream.push(file.buffer);
  bufferStream.push(null);

  const fileMetadata = {
    name: file.originalname,
    parents: connection.driveFolderId ? [connection.driveFolderId] : [],
  };

  const media = {
    mimeType: file.mimetype,
    body: bufferStream,
  };

  const driveResponse = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id, name, mimeType, size, webViewLink, thumbnailLink',
  });

  const driveFile = driveResponse.data;

  const newDoc = await Document.create({
    userId,
    categoryId: categoryId || null,
    name: file.originalname,
    mimeType: file.mimetype || driveFile.mimeType || 'application/octet-stream',
    size: file.size || Number(driveFile.size) || 0,
    driveFileId: driveFile.id,
    driveFolderId: connection.driveFolderId,
    sourceType: 'app_upload',
    webViewLink: driveFile.webViewLink || '',
    thumbnailLink: driveFile.thumbnailLink || '',
  });

  await AuditLog.create({
    userId,
    action: 'DOCUMENT_UPLOADED',
    resourceType: 'document',
    resourceId: newDoc._id,
    metadata: { driveFileId: driveFile.id, fileName: file.originalname },
  });

  return newDoc;
}

/**
 * Import a file selected through Google Picker
 */
export async function importGooglePickerDocument(userId, { fileId, importType, name, mimeType, size, categoryId }) {
  const { drive, connection } = await getAuthenticatedDriveClient(userId);

  // Retrieve file details from Google Drive to verify access
  const driveFileRes = await drive.files.get({
    fileId,
    fields: 'id, name, mimeType, size, webViewLink, thumbnailLink',
  });
  const driveFileData = driveFileRes.data;

  let finalDriveFileId = fileId;
  let finalSourceType = importType || 'drive_import_link';

  // If user requested a copy into the Asnad folder
  if (importType === 'drive_import_copy') {
    const copyRes = await drive.files.copy({
      fileId,
      requestBody: {
        name: name || driveFileData.name,
        parents: connection.driveFolderId ? [connection.driveFolderId] : [],
      },
      fields: 'id, name, mimeType, size, webViewLink, thumbnailLink',
    });
    finalDriveFileId = copyRes.data.id;
    finalSourceType = 'drive_import_copy';
  }

  const document = await Document.create({
    userId,
    categoryId: categoryId || null,
    name: name || driveFileData.name,
    mimeType: mimeType || driveFileData.mimeType || 'application/octet-stream',
    size: size || Number(driveFileData.size) || 0,
    driveFileId: finalDriveFileId,
    driveFolderId: connection.driveFolderId,
    sourceType: finalSourceType,
    webViewLink: driveFileData.webViewLink || '',
    thumbnailLink: driveFileData.thumbnailLink || '',
  });

  await AuditLog.create({
    userId,
    action: 'DOCUMENT_IMPORTED_FROM_PICKER',
    resourceType: 'document',
    resourceId: document._id,
    metadata: { finalDriveFileId, sourceType: finalSourceType },
  });

  return document;
}

/**
 * Stream file for downloading
 */
export async function downloadDocumentFromDrive(userId, driveFileId) {
  const { drive } = await getAuthenticatedDriveClient(userId);

  const fileMetadata = await drive.files.get({
    fileId: driveFileId,
    fields: 'id, name, mimeType, size',
  });

  const response = await drive.files.get(
    { fileId: driveFileId, alt: 'media' },
    { responseType: 'stream' }
  );

  return {
    stream: response.data,
    name: fileMetadata.data.name,
    mimeType: fileMetadata.data.mimeType,
  };
}

/**
 * Disconnect Google Drive
 */
export async function disconnectGoogleDrive(userId) {
  const connection = await GoogleConnection.findOne({ userId, status: 'connected' });
  if (!connection) {
    return { success: true, message: 'Google Drive is not connected' };
  }

  try {
    const refreshToken = decryptToken(connection.encryptedRefreshToken);
    const oauth2Client = getOAuth2Client();
    await oauth2Client.revokeToken(refreshToken);
  } catch (err) {
    logger.warn('Token revocation returned notice:', err.message);
  }

  await GoogleConnection.deleteOne({ userId });

  await AuditLog.create({
    userId,
    action: 'GOOGLE_DRIVE_DISCONNECTED',
    resourceType: 'google_connection',
  });

  return { success: true, message: 'Google Drive disconnected successfully' };
}

