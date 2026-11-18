import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env if present (local dev)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
const clientUrl = process.env.CLIENT_URL || vercelUrl || 'http://localhost:5173';
const appUrl = process.env.APP_URL || vercelUrl || 'http://localhost:5000';
const encryptionKey = process.env.TOKEN_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY || '3f8a49c6d123b0a79e4f5a6b7c8d9e0f1a2b3c4d5e6f708192a3b4c5d6e7f809';
const callbackUrl = process.env.GOOGLE_CALLBACK_URL || process.env.GOOGLE_REDIRECT_URI || `${appUrl}/api/v1/google-drive/callback`;
const pickerApiKey = process.env.GOOGLE_PICKER_API_KEY || process.env.GOOGLE_API_KEY || '';
const projectNumber = process.env.GOOGLE_CLOUD_PROJECT_NUMBER || process.env.GOOGLE_PROJECT_NUMBER || '';

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_URL: appUrl,
  CLIENT_URL: clientUrl,
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'asnad_jwt_production_secret_key_99382173_sec',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  SESSION_SECRET: process.env.SESSION_SECRET || 'asnad_session_secure_key_18274619374',
  TOKEN_ENCRYPTION_KEY: encryptionKey,
  ENCRYPTION_KEY: encryptionKey,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_CALLBACK_URL: callbackUrl,
  GOOGLE_REDIRECT_URI: callbackUrl,
  GOOGLE_PICKER_API_KEY: pickerApiKey,
  GOOGLE_API_KEY: pickerApiKey,
  GOOGLE_CLOUD_PROJECT_NUMBER: projectNumber,
  GOOGLE_PROJECT_NUMBER: projectNumber,
  EMAIL_FROM: process.env.EMAIL_FROM || 'no-reply@asnad.app',
};

export const ENV = env;
