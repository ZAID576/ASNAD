import crypto from 'crypto';
import { ENV } from '../config/env.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits standard for GCM

// Get candidate raw keys
const getCandidateKeys = () => {
  return [
    process.env.TOKEN_ENCRYPTION_KEY,
    process.env.ENCRYPTION_KEY,
    ENV?.TOKEN_ENCRYPTION_KEY,
    ENV?.ENCRYPTION_KEY,
    '3f8a49c6d123b0a79e4f5a6b7c8d9e0f1a2b3c4d5e6f708192a3b4c5d6e7f809',
    'default_insecure_key_for_dev_32b!',
  ].filter(Boolean);
};

// Helper to get primary 32-byte buffer key
const getKeyBuffer = () => {
  const candidates = getCandidateKeys();
  const primaryKey = candidates[0];

  if (/^[0-9a-fA-F]{64}$/.test(primaryKey)) {
    return Buffer.from(primaryKey, 'hex');
  }
  return crypto.createHash('sha256').update(primaryKey).digest();
};

/**
 * Encrypt plaintext using AES-256-GCM
 * @param {string} text - Plaintext to encrypt
 * @returns {string} iv:authTag:encrypted (in hex)
 */
export const encrypt = (text) => {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKeyBuffer(), iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

/**
 * Decrypt ciphertext using AES-256-GCM with multi-key fallback
 * @param {string} encryptedPayload - iv:authTag:encrypted (in hex)
 * @returns {string} Decrypted plaintext
 */
export const decrypt = (encryptedPayload) => {
  if (!encryptedPayload) return '';
  const parts = encryptedPayload.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted payload format');
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const candidates = getCandidateKeys();

  // Try each candidate key (both as direct hex buffer and as sha256 hash buffer)
  for (const rawKey of candidates) {
    // Attempt 1: Hex buffer if 64 hex characters (32 bytes)
    if (/^[0-9a-fA-F]{64}$/.test(rawKey)) {
      try {
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(rawKey, 'hex'), iv);
        decipher.setAuthTag(authTag);
        let dec = decipher.update(encryptedHex, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
      } catch (err) {}
    }

    // Attempt 2: SHA-256 derived 32-byte buffer
    try {
      const hashKey = crypto.createHash('sha256').update(rawKey).digest();
      const decipher = crypto.createDecipheriv(ALGORITHM, hashKey, iv);
      decipher.setAuthTag(authTag);
      let dec = decipher.update(encryptedHex, 'hex', 'utf8');
      dec += decipher.final('utf8');
      return dec;
    } catch (err) {}
  }

  throw new Error('Failed to decrypt token: HMAC/GCM authentication failed with available keys');
};
