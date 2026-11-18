import { google } from 'googleapis';
import { ENV } from './env.js';

export const DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

export const createOAuth2Client = (redirectUri = ENV.GOOGLE_REDIRECT_URI) => {
  return new google.auth.OAuth2(
    ENV.GOOGLE_CLIENT_ID,
    ENV.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
};
