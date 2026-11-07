import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/delivery.yml', import.meta.url), 'utf8');
const dockerfile = readFileSync(new URL('../Dockerfile', import.meta.url), 'utf8');
assert.match(workflow, /github\.event\.workflow_run\.head_branch == 'main'/);
assert.match(workflow, /github\.event\.workflow_run\.event == 'push'/);
assert.match(workflow, /github\.event\.workflow_run\.conclusion == 'success'/);
assert.match(workflow, /test "\$\(git rev-parse HEAD\)" = "\$COMMIT"/);
assert.match(workflow, /docker build --build-arg "V79_SOURCE_COMMIT=\$COMMIT"/);
assert.match(workflow, /IMAGE_REVISION="\$\(docker image inspect/);
assert.match(workflow, /test "\$IMAGE_REVISION" = "\$COMMIT"/);
const verifyPos = workflow.indexOf('test "$IMAGE_REVISION" = "$COMMIT"');
const publishPos = workflow.indexOf('docker push "$IMAGE:latest"');
assert.ok(verifyPos >= 0 && publishPos > verifyPos, 'No registry write before provenance verification.');
assert.match(dockerfile, /ARG V79_SOURCE_COMMIT=unknown/);
assert.match(dockerfile, /LABEL org\.opencontainers\.image\.revision="\$\{V79_SOURCE_COMMIT\}"/);
console.log('ACADEMY_DELIVERY_IMAGE_SOURCE_IDENTITY_CONTRACT=PASS');
