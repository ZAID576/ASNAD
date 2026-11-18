import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits standard for GCM

// Get candidate raw keys
const getCandidateKeys = () => {
  return [
    process.env.TOKEN_ENCRYPTION_KEY,
    process.env.ENCRYPTION_KEY,
    env?.TOKEN_ENCRYPTION_KEY,
    env?.ENCRYPTION_KEY,
    '3f8a49c6d123b0a79e4f5a6b7c8d9e0f1a2b3c4d5e6f708192a3b4c5d6e7f809',
    'default_insecure_key_for_dev_32b!',
  ].filter(Boolean);
};

// Helper to get primary 32-byte buffer key
function getEncryptionKey() {
  const candidates = getCandidateKeys();
  const primaryKey = candidates[0];

  if (/^[0-9a-fA-F]{64}$/.test(primaryKey)) {
    return Buffer.from(primaryKey, 'hex');
  }
  return crypto.createHash('sha256').update(primaryKey).digest();
}

/**
 * Encrypt a string using AES-256-GCM
 */
export function encryptToken(plainText) {
  if (!plainText) return '';
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt a string using AES-256-GCM with multi-key fallback
 */
export function decryptToken(cipherString) {
  if (!cipherString) return '';
  const parts = cipherString.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted token format');
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const candidates = getCandidateKeys();

  for (const rawKey of candidates) {
    if (/^[0-9a-fA-F]{64}$/.test(rawKey)) {
      try {
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(rawKey, 'hex'), iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
      } catch (err) {}
    }

    try {
      const hashKey = crypto.createHash('sha256').update(rawKey).digest();
      const decipher = crypto.createDecipheriv(ALGORITHM, hashKey, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (err) {}
  }

  throw new Error('Failed to decrypt token: HMAC/GCM authentication failed with available keys');
}

/**
 * Password Hashing
 */
export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plainPassword, salt);
}

export async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * JWT Helpers
 */
export function signJwtToken(payload, expiresIn = env.JWT_EXPIRES_IN) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

export function verifyJwtToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

/**
 * Cryptographic Hash (SHA-256) for session token storage
 */
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateRandomToken(byteLength = 32) {
  return crypto.randomBytes(byteLength).toString('hex');
}
