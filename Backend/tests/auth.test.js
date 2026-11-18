import test from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import * as authService from '../src/services/auth.service.js';
import { User } from '../src/models/User.js';
import { Category } from '../src/models/Category.js';

test('Auth Service: Register, Duplicate Prevention, Login, and Category Seeding', async (t) => {
  // Connect to DB for integration test
  await mongoose.connect(env.MONGODB_URI);

  const testEmail = `test_user_${Date.now()}@asnad-test.com`;
  const testPassword = 'SecurePassword123!';
  const testName = 'Asnad Test User';

  let registeredUser;

  await t.test('1. Should successfully register a new user and seed default categories', async () => {
    const result = await authService.registerUser({
      name: testName,
      email: testEmail,
      password: testPassword,
    });

    assert.ok(result.token, 'Must return JWT session token');
    assert.strictEqual(result.user.name, testName);
    assert.strictEqual(result.user.email, testEmail);

    registeredUser = result.user;

    // Verify categories were seeded
    const categories = await Category.find({ userId: registeredUser.id });
    assert.ok(categories.length >= 6, 'Must seed default starter categories');
  });

  await t.test('2. Should reject registration with the same email', async () => {
    await assert.rejects(
      async () => {
        await authService.registerUser({
          name: 'Another Name',
          email: testEmail,
          password: 'AnotherPassword999',
        });
      },
      (err) => {
        assert.strictEqual(err.code, 'EMAIL_EXISTS');
        return true;
      }
    );
  });

  await t.test('3. Should reject login with invalid password', async () => {
    await assert.rejects(
      async () => {
        await authService.loginUser({
          email: testEmail,
          password: 'WrongPassword!',
        });
      },
      (err) => {
        assert.strictEqual(err.code, 'INVALID_CREDENTIALS');
        return true;
      }
    );
  });

  await t.test('4. Should login successfully with correct credentials', async () => {
    const result = await authService.loginUser({
      email: testEmail,
      password: testPassword,
    });

    assert.ok(result.token);
    assert.strictEqual(result.user.email, testEmail);
  });

  await t.test('5. Should retrieve current user profile', async () => {
    const profile = await authService.getCurrentUser(registeredUser.id);
    assert.strictEqual(profile.email, testEmail);
    assert.strictEqual(profile.isGoogleConnected, false);
  });

  // Clean up test data
  await User.deleteOne({ emailNormalized: testEmail.toLowerCase() });
  await Category.deleteMany({ userId: registeredUser.id });
  await mongoose.disconnect();
});

