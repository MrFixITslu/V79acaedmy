// Zero-network unit contract. Does not contact Hub, WiPay, or any live learner.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createAcademyCourseOrder } from '../src/lib/billingClient.ts';

const path = '/api/billing/internal/order';
const secret = 'isolated-academy-payer-contract-secret-2026';

test('Academy sends the stored learner email under authenticated service signature', async () => {
  const previous = {
    base: process.env.V79_HUB_BILLING_URL,
    secret: process.env.V79_ACADEMY_BILLING_SECRET,
    currency: process.env.V79_ACADEMY_BILLING_CURRENCY,
    fetch: globalThis.fetch,
  };
  process.env.V79_HUB_BILLING_URL = 'http://127.0.0.1:1';
  process.env.V79_ACADEMY_BILLING_SECRET = secret;
  process.env.V79_ACADEMY_BILLING_CURRENCY = 'XCD';
  let called = 0;
  globalThis.fetch = async (url, options) => {
    called++;
    assert.equal(url, 'http://127.0.0.1:1' + path);
    assert.equal(options.method, 'POST');
    const payload = JSON.parse(options.body);
    assert.equal(payload.kind, 'course');
    assert.equal(payload.payerEmail, 'learner@example.com');
    assert.equal(payload.subjectReference, 'synthetic-learner');
    assert.equal(payload.externalReference, 'synthetic-course');
    assert.equal(payload.amount, 249);
    assert.equal(payload.currency, 'XCD');
    const timestamp = options.headers['x-v79-timestamp'];
    const canonical = ['POST', path, timestamp, createHash('sha256').update(options.body).digest('hex')].join('\n');
    const expected = createHmac('sha256', secret).update(canonical).digest('hex');
    assert.equal(options.headers['x-v79-signature'], expected);
    assert.equal(options.headers['x-v79-service-id'], 'v79-academy-billing');
    return Response.json({ order: { id: 'v79_synthetic', status: 'pending' } }, { status: 201 });
  };
  try {
    const result = await createAcademyCourseOrder({
      learnerId: 'synthetic-learner',
      payerEmail: 'learner@example.com',
      courseId: 'synthetic-course',
      courseTitle: 'From Idea to Advantage',
      amount: 249,
      returnPath: '/course/synthetic-course',
    });
    assert.equal(result.order.status, 'pending');
    assert.equal(called, 1);
    const learnerHandler = readFileSync(new URL('../src/lib/learnerAccounts.ts', import.meta.url), 'utf8');
    assert.match(learnerHandler, /payerEmail:\s*user\.email/);
  } finally {
    globalThis.fetch = previous.fetch;
    for (const [name, value] of [['V79_HUB_BILLING_URL', previous.base], ['V79_ACADEMY_BILLING_SECRET', previous.secret], ['V79_ACADEMY_BILLING_CURRENCY', previous.currency]]) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
  }
});
