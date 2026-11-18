import test from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Session } from '../src/models/Session.js';
import { Category } from '../src/models/Category.js';

let server;
let port;
let baseUrl;

test.before(async () => {
  await connectDB();
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      port = server.address().port;
      baseUrl = `http://localhost:${port}/api/v1`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.disconnect();
});

test('Integration: Register, Login, GetMe, and Category Flow', async () => {
  const testEmail = `test_${Date.now()}@asnad-integration.local`;
  const testPassword = 'Password123!@#';
  const testName = 'Integration Tester';

  // 1. Health check
  const healthRes = await fetch(`http://localhost:${port}/health`);
  const healthJson = await healthRes.json();
  assert.strictEqual(healthRes.status, 200);
  assert.strictEqual(healthJson.success, true);

  // 2. Register user
  const regRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: testName, email: testEmail, password: testPassword }),
  });
  const regJson = await regRes.json();
  assert.strictEqual(regRes.status, 201);
  assert.strictEqual(regJson.success, true);
  assert.strictEqual(regJson.data.user.email, testEmail);

  const cookieHeader = regRes.headers.get('set-cookie');
  assert.strictEqual(typeof cookieHeader, 'string');
  assert.strictEqual(cookieHeader.includes('asnad_session'), true);

  const sessionToken = cookieHeader.split(';')[0];

  // 3. Get /auth/me with session cookie
  const meRes = await fetch(`${baseUrl}/auth/me`, {
    headers: { Cookie: sessionToken },
  });
  const meJson = await meRes.json();
  assert.strictEqual(meRes.status, 200);
  assert.strictEqual(meJson.data.user.email, testEmail);

  // 4. Create Category
  const catRes = await fetch(`${baseUrl}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: sessionToken },
    body: JSON.stringify({ name: 'Tax Documents 2026', color: '#4285F4' }),
  });
  const catJson = await catRes.json();
  assert.strictEqual(catRes.status, 201);
  assert.strictEqual(catJson.data.category.name, 'Tax Documents 2026');

  // 5. List Categories (includes default seeded categories + new category)
  const listCatRes = await fetch(`${baseUrl}/categories`, {
    headers: { Cookie: sessionToken },
  });
  const listCatJson = await listCatRes.json();
  assert.strictEqual(listCatRes.status, 200);
  assert.strictEqual(listCatJson.data.categories.length > 1, true);

  // Cleanup test user data
  const userId = regJson.data.user.id;
  await User.deleteOne({ _id: userId });
  await Session.deleteMany({ userId });
  await Category.deleteMany({ userId });
});
