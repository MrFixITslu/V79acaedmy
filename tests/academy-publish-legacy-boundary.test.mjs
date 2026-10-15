// Isolated reproduction for historical "Incorrect administrator password" publishing.
// Fake website only, disposable Academy data only; NO real publishing or credentials.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import net from "node:net";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";

const root = process.cwd();
const scratch = mkdtempSync(path.join(tmpdir(), "v79-academy-publish-repro-"));
const syntheticPassword = "SYNTHETIC-WEBSITE-PASSWORD-LOCAL-ONLY";
const syntheticAdmin = "SYNTHETIC-ACADEMY-BOOTSTRAP-PASSWORD";
const syntheticNewAdmin = "SYNTHETIC-ACADEMY-CHANGED-PASSWORD";
let acceptWebsite = false;
let listed = 0;
let updated = 0;
let wrongLogins = 0;
let academy;

const website = createServer(async (req, res) => {
  const parts = [];
  for await (const part of req) parts.push(part);
  const data = Buffer.concat(parts).toString("utf8");
  res.setHeader("Content-Type", "application/json");
  if (req.method === "POST" && req.url === "/api/admin/login") {
    const password = JSON.parse(data || "{}").password;
    if (!acceptWebsite || password !== syntheticPassword) {
      wrongLogins++;
      res.writeHead(401); res.end(JSON.stringify({ error: "Incorrect administrator password" }));
      return;
    }
    res.writeHead(200); res.end(JSON.stringify({ token: "a".repeat(64), mustChangePassword: false }));
    return;
  }
  if (req.headers.cookie !== "v79_admin=" + "a".repeat(64)) {
    res.writeHead(401); res.end(JSON.stringify({ error: "Unauthorized" })); return;
  }
  if (req.method === "POST" && req.url === "/api/apps") {
    const payload = JSON.parse(data);
    assert.equal(payload.category, "courses");
    assert.match(payload.accessUrl, /^https:\/\/academy\.v79sl\.com\/course\//);
    listed++;
    res.writeHead(201); res.end(JSON.stringify({ id: "synthetic-website-item" })); return;
  }
  if (req.method === "PUT" && req.url === "/api/apps/synthetic-website-item") {
    updated++;
    res.writeHead(200); res.end(JSON.stringify({ id: "synthetic-website-item" })); return;
  }
  res.writeHead(404); res.end(JSON.stringify({ error: "Not found" }));
});

async function freePort() {
  const socket = net.createServer();
  await new Promise(resolve => socket.listen(0, "127.0.0.1", resolve));
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  return port;
}

try {
  website.listen(0, "127.0.0.1");
  await once(website, "listening");
  const academyPort = await freePort();
  const websitePort = website.address().port;
  academy = spawn(process.execPath, [path.join(root, "dist/server.cjs")], {
    cwd: scratch,
    env: {
      ...process.env, NODE_ENV: "production", PORT: String(academyPort),
      ACADEMY_STANDALONE_ADMIN_ENABLED: "1", ADMIN_PASSWORD: syntheticAdmin,
      WEBSITE_SYNC_URL: "http://127.0.0.1:" + websitePort,
      WEBSITE_ADMIN_PASSWORD: syntheticPassword,
      ACADEMY_PUBLIC_URL: "https://academy.v79sl.com",
      V79_PLATFORM_SHARED_SECRET: "academy-local-test-secret-long-enough-2026",
    },
    stdio: "ignore",
  });
  const base = "http://127.0.0.1:" + academyPort;

  async function api(route, { method = "GET", cookie = "", body = undefined, status = 200, headers = {} } = {}) {
    const response = await fetch(base + route, {
      method,
      headers: { ...headers, ...(cookie ? { Cookie: cookie } : {}),
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}) },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const result = await response.json();
    assert.equal(response.status, status,
      method + " " + route + " -> " + response.status + ": " + JSON.stringify(result));
    return { data: result, cookie: response.headers.get("set-cookie")?.split(";")[0] };
  }

  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (academy.exitCode !== null) throw new Error("Disposable Academy failed to start");
    try {
      const response = await fetch(base + "/healthz");
      if (response.ok) { ready = true; break; }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, "Disposable Academy health did not become ready");

  // First-party Academy admin and second-party website admin are distinct.
  const logged = await api("/api/admin/login", {
    method: "POST", body: { password: syntheticAdmin },
  });
  const changed = await api("/api/admin/change-password", {
    method: "POST", cookie: logged.cookie,
    body: { currentPassword: syntheticAdmin, newPassword: syntheticNewAdmin },
  });
  const owner = changed.cookie;
  assert.ok(owner?.startsWith("cb_session="));

  const course = (await api("/api/courses", {
    method: "POST", status: 201, cookie: owner,
    body: {
      title: "Synthetic Publishing Regression Course",
      shortDescription: "Test publication without touching the actual Academy website.",
      fullDescription: "An isolated and disposable course used to verify the legacy website admin publishing boundary.",
      instructor: "V79 Test Instructor",
      status: "Draft", pricingType: "free",
    },
  })).data;
  const module = (await api("/api/courses/" + course.id + "/modules", {
    method: "POST", status: 201, cookie: owner, body: { title: "First Module" },
  })).data;
  await api("/api/modules/" + module.id + "/lessons", {
    method: "POST", status: 201, cookie: owner,
    body: { title: "Test Lesson", description: "A complete synthetic lesson for publishing checks." },
  });

  const publishing = "/api/courses/" + course.id + "/publish";
  await api(publishing, { method: "POST", status: 401, body: {} });
  await api(publishing, {
    method: "POST", status: 403, cookie: owner,
    headers: { "x-user-role": "Viewer" }, body: {},
  });
  const rejected = await api(publishing, { method: "POST", status: 502, cookie: owner, body: {} });
  assert.match(rejected.data.error, /Incorrect administrator password/);
  assert.ok(!rejected.data.error.includes(syntheticPassword), "Website secret disclosed");
  assert.equal(wrongLogins, 1);
  assert.equal(listed, 0);
  const unchanged = (await api("/api/courses/" + course.id, { cookie: owner })).data;
  assert.equal(unchanged.status, "Draft");
  assert.equal(unchanged.websiteAppId, undefined);

  acceptWebsite = true;
  const first = (await api(publishing, { method: "POST", cookie: owner, body: {} })).data;
  assert.equal(first.course.status, "Published");
  assert.equal(first.websiteAppId, "synthetic-website-item");
  assert.equal(listed, 1);
  const second = (await api(publishing, { method: "POST", cookie: owner, body: {} })).data;
  assert.equal(second.course.id, course.id);
  assert.equal(second.websiteAppId, "synthetic-website-item");
  assert.equal(listed, 1, "A repeated publish must not create a duplicate listing");
  assert.equal(updated, 1, "Published listing updates by saved ID");
  console.log("PASS: legacy website login rejection, course preservation, owner permission and update-idempotency reproduced in isolated test");
} finally {
  if (academy) {
    if (academy.exitCode === null) academy.kill();
    if (!academy.killed && academy.exitCode === null) academy.kill("SIGKILL");
    await Promise.race([once(academy, "exit").catch(() => {}), new Promise(resolve => setTimeout(resolve, 1000))]);
  }
  await new Promise(resolve => website.close(resolve));
  rmSync(scratch, { recursive: true, force: true });
}
