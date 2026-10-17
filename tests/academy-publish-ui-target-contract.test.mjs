// Source contract for accurate publishing feedback across Academy and website modes.
// Isolated: no server process, credentials, networking, Docker or real courses.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const server = read("server.ts");
const manager = read("src/components/PublishingManager.tsx");
const editor = read("src/components/CourseEditor.tsx");

assert.match(server, /publicationTarget:\s*"academy"/);
assert.match(server, /publicationTarget:\s*"website"/);
assert.match(manager, /data\.publicationTarget === 'academy'/);
assert.match(manager, /'Course published to the Academy learner portal/);
assert.match(manager, /'Course published to the website catalog|Course published to the website catalog/);
assert.doesNotMatch(manager, /Website App ID:\s*\$\{data\.websiteAppId\s*\|\|/);
assert.match(editor, /formData\.status === 'Published' && formData\.websiteAppId/);
assert.match(editor, /Published to the Academy learner portal/);
assert.match(editor, /server determines the publishing destination/);
assert.doesNotMatch(editor, /Failed to publish course to the website\./);
console.log("PASS: publish success is target-aware; editor does not claim Academy-only publication is a website upload");
