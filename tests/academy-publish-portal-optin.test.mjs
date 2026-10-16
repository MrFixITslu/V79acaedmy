// Isolated Academy-only publishing contract. Never talks to the production website.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";

const scratch = mkdtempSync(path.join(tmpdir(), "v79-academy-portal-test-"));
let academy;
const initialPassword = "SYNTHETIC-PORTAL-ADMIN-PASSWORD";
const ownerPassword = "SYNTHETIC-PORTAL-ADMIN-CHANGED-PASSWORD";
async function freePort() {
  const server = createServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}
try {
  const port = await freePort();
  academy = spawn(process.execPath, [path.resolve("dist/server.cjs")], {
    cwd: scratch,
    env: {
      ...process.env, NODE_ENV: "production", PORT: String(port),
      ACADEMY_STANDALONE_ADMIN_ENABLED: "1",
      ADMIN_PASSWORD: initialPassword,
      ACADEMY_COURSE_PUBLISH_MODE: "academy",
      ACADEMY_PUBLIC_URL: "https://academy.v79sl.com",
      // Deliberately unset: portal publishing must never need website credentials.
      WEBSITE_SYNC_URL: "",
      WEBSITE_ADMIN_PASSWORD: "",
      V79_PLATFORM_SHARED_SECRET: "academy-only-local-isolated-tests-2026",
    },
    stdio: "ignore",
  });
  const base = "http://127.0.0.1:" + port;
  async function api(route, { method = "GET", cookie = "", body, headers = {}, status = 200 } = {}) {
    const response = await fetch(base + route, {
      method,
      headers: { ...headers, ...(cookie ? { Cookie: cookie } : {}),
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}) },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const data = await response.json();
    assert.equal(response.status, status,
      method + " " + route + " -> " + response.status + ": " + JSON.stringify(data));
    return { data, cookie: response.headers.get("set-cookie")?.split(";")[0] };
  }

  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (academy.exitCode !== null) throw new Error("Academy process exited early");
    try {
      if ((await fetch(base + "/healthz")).ok) { ready = true; break; }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, "Academy disposable process did not start");

  const login = await api("/api/admin/login", {
    method: "POST", body: { password: initialPassword },
  });
  const changed = await api("/api/admin/change-password", {
    method: "POST", cookie: login.cookie,
    body: { currentPassword: initialPassword, newPassword: ownerPassword },
  });
  const owner = changed.cookie;
  assert.ok(owner?.startsWith("cb_session="));
  const newCourse = async (name) => (await api("/api/courses", {
    method: "POST", cookie: owner, status: 201,
    body: {
      title: name,
      shortDescription: "A local Academy publishing regression course",
      fullDescription: "A complete synthetic course that must never contact the real V79 website or expose secrets.",
      instructor: "Synthetic QA",
      pricingType: "free",
      status: "Draft",
    },
  })).data;
  const complete = async (course) => {
    const module = (await api("/api/courses/" + course.id + "/modules", {
      method: "POST", cookie: owner, status: 201, body: { title: "Foundation" },
    })).data;
    await api("/api/modules/" + module.id + "/lessons", {
      method: "POST", cookie: owner, status: 201,
      body: { title: "Intro", description: "Synthetic complete lesson" },
    });
  };
  const course = await newCourse("Academy-only opt-in test");
  const publish = "/api/courses/" + course.id + "/publish";
  await api(publish, { method: "POST", body: {}, status: 401 });
  await api(publish, { method: "POST", cookie: owner,
    headers: { "x-user-role": "Viewer" }, body: {}, status: 403 });
  await api(publish, { method: "POST", cookie: owner, body: {}, status: 400 });
  const draft = (await api("/api/courses/" + course.id, { cookie: owner })).data;
  assert.equal(draft.status, "Draft");
  await complete(course);
  const first = (await api(publish, { method: "POST", cookie: owner, body: {} })).data;
  assert.equal(first.publicationTarget, "academy");
  assert.equal(first.course.id, course.id);
  assert.equal(first.course.status, "Published");
  assert.equal(first.course.websiteAppId, undefined);
  const again = (await api(publish, { method: "POST", cookie: owner, body: {} })).data;
  assert.equal(again.course.id, course.id);
  assert.equal(again.course.websiteAppId, undefined);
  assert.equal((await api("/api/public/courses")).data.some(c => c.id === course.id), true);

  const linked = await newCourse("Previously linked website catalog entry");
  await complete(linked);
  const storePath = path.join(scratch, "data", "store.json");
  const stored = JSON.parse(readFileSync(storePath, "utf8"));
  const linkedCourse = stored.courses.find(c => c.id === linked.id);
  assert.ok(linkedCourse);
  linkedCourse.websiteAppId = "synthetic-existing-website-listing";
  writeFileSync(storePath, JSON.stringify(stored, null, 2));
  const refusal = (await api("/api/courses/" + linked.id + "/publish", {
    method: "POST", cookie: owner, body: {}, status: 409,
  })).data;
  assert.match(refusal.error, /existing website catalog listing/);
  const after = (await api("/api/courses/" + linked.id, { cookie: owner })).data;
  assert.equal(after.status, "Draft");
  assert.equal(after.websiteAppId, "synthetic-existing-website-listing");
  console.log("PASS Academy-only opt-in: no website credentials, permissions, curriculum, linked-course denial, idempotent portal publication");
} finally {
  if (academy && academy.exitCode === null) {
    const exit = once(academy, "exit").catch(() => {});
    academy.kill("SIGTERM");
    await Promise.race([exit, new Promise(resolve => setTimeout(resolve, 1500))]);
    if (academy.exitCode === null) academy.kill("SIGKILL");
  }
  rmSync(scratch, { recursive: true, force: true });
}
