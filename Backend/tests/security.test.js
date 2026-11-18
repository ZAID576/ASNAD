import test from 'node:test';
import assert from 'node:assert';
import { encrypt, decrypt } from '../src/utils/encryption.js';
import { signToken, verifyToken } from '../src/utils/tokens.js';
import { User } from '../src/models/User.js';

test('Security: AES-256-GCM encryption & decryption', () => {
  const sampleSecret = '1//04ABCDEF123456789_refresh_token_test_sample';
  const encrypted = encrypt(sampleSecret);

  assert.notStrictEqual(encrypted, sampleSecret);
  assert.strictEqual(encrypted.includes(':'), true);

  const decrypted = decrypt(encrypted);
  assert.strictEqual(decrypted, sampleSecret);
});

test('Security: JWT signing and verification', () => {
  const payload = { userId: '65f1234567890abcdef12345' };
  const token = signToken(payload, '1h');
  const decoded = verifyToken(token);

  assert.strictEqual(decoded.userId, payload.userId);
});

test('Security: Password hashing with bcrypt salt', async () => {
  const plain = 'StrongPass123!@#';
  const hash = await User.hashPassword(plain);

  assert.notStrictEqual(plain, hash);
  assert.strictEqual(hash.startsWith('$2'), true);
});
