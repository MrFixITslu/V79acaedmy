// Disposable Academy <-> simulated Hub HTTP acceptance. No real WiPay or production credentials.
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const directory = mkdtempSync(path.join(os.tmpdir(), 'v79-academy-billing-boundary-'));
const platformSecret = 'isolated-academy-admin-platform-secret-2026';
const billingSecret = 'isolated-academy-hub-billing-secret-2026';
const orders = new Map();
const received = [];
let nextOrder = 1;
let child;

async function reservePort() {
  const s = net.createServer();
  await new Promise(resolve => s.listen(0, '127.0.0.1', resolve));
  const port = s.address().port;
  await new Promise(resolve => s.close(resolve));
  return port;
}
function signature(method, pathname, timestamp, body, key) {
  const digest = createHash('sha256').update(body).digest('hex');
  return createHmac('sha256', key).update([method, pathname, timestamp, digest].join('\n')).digest('hex');
}
const fakeHub = createServer(async (req, res) => {
  const body = await new Promise((resolve, reject) => {
    let chunks = '';
    req.on('data', chunk => { chunks += chunk; if (chunks.length > 10000) reject(Error('Too large')); });
    req.on('end', () => resolve(chunks));
    req.on('error', reject);
  }).catch(() => '');
  const pathname = new URL(req.url, 'http://127.0.0.1').pathname;
  const timestamp = String(req.headers['x-v79-timestamp'] || '');
  const provided = String(req.headers['x-v79-signature'] || '');
  const expected = signature(req.method, pathname, timestamp, body, billingSecret);
  const equal = /^[0-9a-f]{64}$/i.test(provided) && timingSafeEqual(Buffer.from(provided, 'hex'), Buffer.from(expected, 'hex'));
  const authorized = req.method === 'POST' && req.headers['x-v79-service-id'] === 'v79-academy-billing' &&
    Number.isFinite(Number(timestamp)) && Math.abs(Date.now() - Number(timestamp)) < 300000 && equal;
  res.setHeader('Content-Type', 'application/json');
  if (!authorized) { res.writeHead(401).end(JSON.stringify({ error: 'Invalid service signature.' })); return; }
  const payload = JSON.parse(body);
  received.push({ pathname, payload });
  if (pathname === '/api/billing/internal/capabilities') {
    res.end(JSON.stringify({ checkoutAvailable: true, currencyCompatible: true,
      provider: { provider: 'wipay', environment: 'sandbox', currency: 'TTD', ready: true } }));
    return;
  }
  if (pathname === '/api/billing/internal/order') {
    if (payload.kind !== 'course' || payload.currency !== 'XCD' || payload.amount !== 249 ||
        !payload.subjectReference || !payload.externalReference) {
      res.writeHead(400).end(JSON.stringify({ error: 'Unexpected synthetic order.' })); return;
    }
    const id = 'v79_synthetic_' + nextOrder++;
    const order = { id, sourceApp: 'academy', kind: 'course',
      externalReference: payload.externalReference, subjectReference: payload.subjectReference,
      amount: payload.amount, currency: 'TTD', status: 'pending', providerEnvironment: 'sandbox' };
    orders.set(id, order);
    res.writeHead(201).end(JSON.stringify({
      order: { id, sourceApp: order.sourceApp, kind: 'course', amount: 249, currency: 'TTD', status: 'pending' },
      checkout: { provider: 'wipay', environment: 'sandbox', action: 'https://example.invalid/only-a-test',
        fields: { order_id: id, total: '249.00', currency: 'TTD' } }
    }));
    return;
  }
  if (pathname === '/api/billing/internal/status') {
    const order = orders.get(payload.orderId);
    if (!order) { res.writeHead(404).end(JSON.stringify({ error: 'Order missing.' })); return; }
    res.end(JSON.stringify({ order })); return;
  }
  res.writeHead(404).end(JSON.stringify({ error: 'Unknown route.' }));
});
let hubBase;
let base;
async function api(route, { method = 'GET', cookie, body, status = 200 } = {}) {
  const response = await fetch(base + route, {
    method, headers: { ...(cookie ? { Cookie: cookie } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await response.json();
  assert.equal(response.status, status, method + ' ' + route + ': ' + JSON.stringify(json));
  return { data: json, cookie: response.headers.get('set-cookie')?.split(';')[0] };
}
async function ready() {
  for (let n = 0; n < 100; n++) {
    if (child.exitCode !== null) throw Error('Disposable Academy exited before health check.');
    try { const r = await fetch(base + '/healthz'); if (r.ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw Error('Disposable Academy health check timed out.');
}
function learnerFile() {
  return JSON.parse(readFileSync(path.join(directory, 'data/learners.json'), 'utf8'));
}
try {
  await new Promise(resolve => fakeHub.listen(0, '127.0.0.1', resolve));
  hubBase = 'http://127.0.0.1:' + fakeHub.address().port;
  const academyPort = await reservePort();
  base = 'http://127.0.0.1:' + academyPort;
  child = spawn(process.execPath, [path.join(root, 'dist/server.cjs')], {
    cwd: directory,
    env: { ...process.env, NODE_ENV: 'production', PORT: String(academyPort),
      ADMIN_PASSWORD: 'isolated-admin-password-123',
      ACADEMY_STANDALONE_ADMIN_ENABLED: '1',
      V79_PLATFORM_SHARED_SECRET: platformSecret,
      V79_HUB_BILLING_URL: hubBase, V79_ACADEMY_BILLING_SECRET: billingSecret,
      V79_ACADEMY_BILLING_CURRENCY: 'XCD' },
    stdio: 'ignore',
  });
  await ready();

  // Anonymous checkout and confirmation must reject before a Hub status/order call.
  const anonymousCheckout = await api('/api/learner/checkout', {
    method: 'POST', status: 401, body: { courseId: 'synthetic-paid-course' },
  });
  assert.match(anonymousCheckout.data.error, /sign-in required/i);
  const anonymousConfirm = await api('/api/learner/checkout/confirm', {
    method: 'POST', status: 401, body: { orderId: 'v79_missing' },
  });
  assert.match(anonymousConfirm.data.error, /sign-in required/i);
  assert.equal(received.length, 0);

  // The fake Hub also rejects unsigned requests; Academy requests must carry their own signature.
  const unsigned = await fetch(hubBase + '/api/billing/internal/status', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId: 'v79_missing' }),
  });
  assert.equal(unsigned.status, 401);

  const initialAdmin = await api('/api/admin/login', { method: 'POST', body: { password: 'isolated-admin-password-123' } });
  // Production admin bootstraps require a password change; keep the guard enabled in this disposable test.
  const changedAdmin = await api('/api/admin/change-password', {
    method: 'POST', cookie: initialAdmin.cookie,
    body: { currentPassword: 'isolated-admin-password-123', newPassword: 'isolated-admin-changed-password-456' },
  });
  const admin = { cookie: changedAdmin.cookie || (await api('/api/admin/login', {
    method: 'POST', body: { password: 'isolated-admin-changed-password-456' },
  })).cookie };
  const learnerA = await api('/api/learner/register', {
    method: 'POST', body: { email: 'alpha@example.test', name: 'Synthetic Alpha', password: 'alpha-synthetic-password-123' },
  });
  const learnerB = await api('/api/learner/register', {
    method: 'POST', body: { email: 'beta@example.test', name: 'Synthetic Beta', password: 'beta-synthetic-password-123' },
  });
  const aId = learnerA.data.user.id;
  const syntheticCourse = await api('/api/courses', { method: 'POST', status: 201, cookie: admin.cookie,
    body: { title: 'Isolated EC249 course', category: 'General', pricingType: 'premium', price: 249, status: 'Published' } });
  const courseId = syntheticCourse.data.id;
  const mod = await api('/api/courses/' + courseId + '/modules', {
    method: 'POST', status: 201, cookie: admin.cookie, body: { title: 'Private course module' },
  });
  const lesson = await api('/api/modules/' + mod.data.id + '/lessons', {
    method: 'POST', status: 201, cookie: admin.cookie,
    body: { title: 'Protected lesson', lessonContent: 'PRIVATE_SYNTHETIC_LESSON' },
  });
  const lessonRoute = '/api/public/modules/' + mod.data.id + '/lessons';
  let content = await api(lessonRoute, { cookie: learnerA.cookie });
  assert.equal(content.data[0].lessonContent, undefined);
  await api('/api/learner/enroll/' + courseId, { method: 'POST', cookie: learnerA.cookie, status: 403 });
  const checkout = await api('/api/learner/checkout', {
    method: 'POST', cookie: learnerA.cookie, status: 201, body: { courseId },
  });
  const orderId = checkout.data.order.id;
  const created = orders.get(orderId);
  assert.equal(created.subjectReference, aId);
  assert.equal(created.externalReference, courseId);
  assert.equal(created.amount, 249);
  assert.equal(received.some(item => item.pathname === '/api/billing/internal/order'), true);
  const confirmRoute = '/api/learner/checkout/confirm';
  const confirmBody = { orderId };

  let confirmation = await api(confirmRoute, {
    method: 'POST', cookie: learnerA.cookie, status: 409, body: confirmBody,
  });
  assert.equal(confirmation.data.code, 'PAYMENT_NOT_VERIFIED');

  // Simulate Hub reporting a verified sandbox payment. It must NEVER become paid-course ownership.
  created.status = 'paid';
  confirmation = await api(confirmRoute, {
    method: 'POST', cookie: learnerA.cookie, status: 409, body: confirmBody,
  });
  assert.equal(confirmation.data.code, 'SANDBOX_PAYMENT_VERIFIED');
  assert.equal(learnerFile().find(u => u.id === aId).coursePurchases?.length || 0, 0);
  content = await api(lessonRoute, { cookie: learnerA.cookie });
  assert.equal(content.data[0].lessonContent, undefined);

  // The mock permits a paid/live state for contract testing ONLY, without contacting WiPay.
  created.providerEnvironment = 'live';
  created.paidAt = '2026-10-24T00:00:00.000Z';
  created.providerTransactionId = 'SYNTHETIC-NO-SETTLEMENT';
  confirmation = await api(confirmRoute, {
    method: 'POST', cookie: learnerB.cookie, status: 403, body: confirmBody,
  });
  assert.match(confirmation.data.error, /does not belong/i);
  content = await api(lessonRoute, { cookie: learnerB.cookie });
  assert.equal(content.data[0].lessonContent, undefined);

  confirmation = await api(confirmRoute, {
    method: 'POST', cookie: learnerA.cookie, status: 200, body: confirmBody,
  });
  assert.equal(confirmation.data.courseId, courseId);
  assert.equal(learnerFile().find(u => u.id === aId).coursePurchases.length, 1);
  // A repeated confirm may return success, but must not create another purchase.
  await api(confirmRoute, { method: 'POST', cookie: learnerA.cookie, body: confirmBody });
  assert.equal(learnerFile().find(u => u.id === aId).coursePurchases.length, 1);
  content = await api(lessonRoute, { cookie: learnerA.cookie });
  assert.equal(content.data[0].lessonContent, 'PRIVATE_SYNTHETIC_LESSON');
  content = await api(lessonRoute, { cookie: learnerB.cookie });
  assert.equal(content.data[0].lessonContent, undefined);
  assert.equal(content.data[0].id, lesson.data.id);

  console.log('PASS synthetic Academy-Hub signed order; pending denied; sandbox denied; foreign learner denied; live mock grants exactly once');
} finally {
  if (child && child.exitCode === null) {
    child.kill();
    await new Promise(resolve => child.once('exit', resolve));
  }
  fakeHub.closeAllConnections();
  await new Promise(resolve => fakeHub.close(resolve));
  rmSync(directory, { recursive: true, force: true });
}
