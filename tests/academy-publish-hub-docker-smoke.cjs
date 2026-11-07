// Runs inside disposable networkless Academy candidate Docker container.
// Synthetic Hub secret and scratch tmpfs only; no customer data or provider calls.
const assert = require('node:assert/strict');
const { createHmac, createHash } = require('node:crypto');
const secret = process.env.V79_PLATFORM_SHARED_SECRET;
assert.ok(secret && secret.length >= 32);
const base = 'http://127.0.0.1:3030';
let lastTimestamp = 0;
async function request(route, body, opts = {}) {
  const method = opts.method || (body === undefined ? 'GET' : 'POST');
  const raw = body === undefined ? undefined : JSON.stringify(body);
  const headers = { ...(body === undefined ? {} : {'content-type':'application/json'}) };
  if (opts.signed) {
    const now = Math.max(Date.now(), lastTimestamp + 1);
    lastTimestamp = now;
    const timestamp = String(now);
    const hash = createHash('sha256').update(raw || '').digest('hex');
    const canonical = [method, route, timestamp, hash].join('\n');
    const sig = createHmac('sha256', secret).update(canonical).digest('hex');
    Object.assign(headers, {
      'x-v79-service-id': 'v79-hub',
      'x-v79-timestamp': timestamp,
      'x-v79-signature': sig,
    });
  }
  const response = await fetch(base + route, {
    method, headers, ...(raw === undefined ? {} : {body:raw}),
  });
  const result = await response.json().catch(() => null);
  if (opts.status !== undefined) {
    assert.equal(response.status, opts.status,
      method + ' ' + route + ': received ' + response.status);
  }
  return { status: response.status, result };
}
async function main() {
  assert.equal(process.env.NODE_ENV, 'production');
  assert.equal(process.env.ACADEMY_COURSE_PUBLISH_MODE, 'academy');
  assert.equal(process.env.ACADEMY_STANDALONE_ADMIN_ENABLED, '0');
  assert.equal(process.env.WEBSITE_SYNC_URL, '');
  assert.equal(process.env.WEBSITE_ADMIN_PASSWORD, '');
  const health = await request('/healthz', undefined, {status:200});
  assert.equal(health.result.status, 'ok');
  const before = await request('/api/public/courses', undefined, {status:200});
  assert.ok(Array.isArray(before.result));
  await request('/api/courses', undefined, {status:401});
  const course = (await request('/api/courses', {
    title:'Synthetic Hub-signed Academy-only smoke',
    shortDescription:'Approved synthetic Hub-admin-only publishing smoke',
    fullDescription:'A complete disposable test course designed to check Hub signed administration in the networkless build image.',
    instructor:'V79 QA',
    pricingType:'free',
    status:'Draft',
  }, {signed:true, status:201})).result;
  assert.ok(course.id && typeof course.id === 'string');
  const publication = '/api/courses/' + encodeURIComponent(course.id) + '/publish';
  await request(publication, {}, {status:401});
  await request(publication, {}, {signed:true, status:400});
  const mod = (await request('/api/courses/' + encodeURIComponent(course.id) + '/modules',
      {title:'Synthetic Module'}, {signed:true,status:201})).result;
  assert.ok(mod.id);
  await request('/api/modules/' + encodeURIComponent(mod.id) + '/lessons',
      {title:'Synthetic Lesson',description:'Complete disposable smoke-test lesson'},
      {signed:true,status:201});
  const pub = await request(publication, {}, {signed:true,status:200});
  assert.equal(pub.result.publicationTarget, 'academy');
  assert.equal(pub.result.course.id, course.id);
  assert.equal(pub.result.course.status, 'Published');
  assert.equal(pub.result.course.websiteAppId, undefined);
  const again = await request(publication, {}, {signed:true,status:200});
  assert.equal(again.result.course.id, course.id);
  assert.equal(again.result.course.websiteAppId, undefined);
  const publicList = await request('/api/public/courses', undefined, {status:200});
  assert.ok(publicList.result.some(c=>c.id === course.id));
  console.log('PASS_ACADEMY_HUB_SIGNED_DOCKER_SMOKE');
}
main().catch((e) => { console.error('ACADEMY_HUB_SIGNED_DOCKER_SMOKE_FAILED', e.message); process.exitCode = 1; });
