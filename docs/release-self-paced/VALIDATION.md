# V79 Academy release validation — 15 November 2026

## Deployed scope
Two new adult self-paced foundation courses: Practical AI for Business and Small-Business Networking. Eight lessons each, 32 scenario questions in total, explained concepts, fictional worked examples, guided independent practice, model solutions, source records and capstones. Existing four programmes and their 180 lessons were preserved. The catalogue now contains six programmes and 196 lessons.

Delivered study tools: AI workflow and prompt workshop, layered network journey and fault-evidence simulation, IPv4 /24–/30 subnet explorer, labelled sample performance charts with equivalent tables, protected printable workbooks, private account notes and bookmarks, resume/progress dashboard, server-graded quiz explanations, source-review attestation and invalidation, and aggregate learning-insights API.

## Evidence
| Check | Observed result |
|---|---|
| TypeScript | `npm run lint` passed |
| Existing unit suites and new curriculum checks | Passed; additive seed and deliberate-deletion preservation checked |
| Subnet arithmetic | 1,792 cases independently matched Python `ipaddress` |
| Production build | Passed locally, on Acer and in the Node 20 Docker image |
| Existing API suite | Passed locally and in the exact candidate image with network egress disabled |
| Self-paced API suite | Passed locally and in the exact candidate image: paid-access denial, cross-user note isolation, input bounds, resume/bookmarks, withheld answers, incorrect/correct feedback, capstone/certificate requirements, non-renewal retention, insights and review/publish controls |
| Publishing regressions | Legacy website, Academy-only opt-in and target-aware copy checks passed |
| Browser checks | Catalogue at 1440, 1024, 768, 390 and 320 CSS px; notes/bookmarks reload; dashboard resume; subnet exercise; charts/table; keyboard diagram controls; reduced motion; no page errors |
| Render inspection | Desktop catalogue, 320 px catalogue and desktop subnet lab screenshots inspected |
| Browser/image provenance | Browser-tested CSS and JS SHA-256 values matched the candidate image |
| Restored data | Original course/module/lesson/quiz/assignment/download/version records preserved; learner JSON bytes unchanged during migration |
| Recovery rehearsal | Old image booted successfully against the restored archive; learner bytes preserved |
| Off-host backup | Encrypted checkpoint copied to Acer, SHA-256 verified, decrypted and all five JSON files parsed; repeated for the final quiesced checkpoint |
| Production runtime | Healthy; environment, mounts, networks and restart policy preserved; old main container retained for rollback |
| Production Hub boundary | Signed course/insights reads passed; unauthorised reads denied |
| Public HTTPS | New catalogue and course overview rendered; six courses/two new adult courses confirmed; five requests consistently served the checked entry asset; mobile overflow absent; private paths denied |

Nineteen reference URLs returned HTTP 200. Three CISA PDFs blocked automated fetching with HTTP 403; their official primary-source content was verified through indexed official CISA results. These are recorded as blocked, not as successful HTTP checks.

## Release identity
Server source commit: `caaacb7edeeb6effa1f53faac64a0b9453f48de4` on the private server release branch.
Image: `v79-academy:study-caaacb7edeeb`.
Image ID: `sha256:c5b30fc92f01df167b7b78ba11ca79925f014d56a5d75c53bc0dc0049636c1e3`.
Final encrypted checkpoint SHA-256: `911e8cb3c6a505ad665c042b9c8125d0daf420d1d154ec0ac3cea86b1d7f5bfd`.
Rollback container: `v79-academy-pre-study-20261115` (stopped; do not start concurrently with the current writer).

## Faults found and corrected
The restored staging files belonged to the host user while the initial stage ran as root with all Linux capabilities removed. Matching the stage UID/GID to the restored copy retained restrictive permissions and allowed startup.

A pre-existing prebrand backup was still running with the canonical Academy Docker DNS alias and the same learner-data mount. Public requests mixed versions and failed dynamic imports. Its full runtime configuration was retained privately, automatic restart disabled and the backup stopped. Proxy configuration passed `nginx -t` before a graceful reload. A second old rollback process using the live data was also retained stopped. The current Academy is now the single running writer.

## Practical limits and follow-up
- The new adult courses are foundation training, not accredited qualifications. Capstone work is self-assessed and submission is recorded; it is not instructor grading.
- Existing programmes were preserved, not rewritten or fully editorially reverified. Lessons without source-review metadata display that fact. Junior programmes retain their original support/team requirements.
- US$35 / EC$94 monthly is a proposed flat membership offer. Automatic recurring collection is not configured; existing dated memberships remain the access mechanism. Non-renewal records a preference and preserves the saved expiry; it does not cancel an external payment-provider agreement.
- Insights use saved records. Historical attempts before this release were not recorded; up to the most recent 200 attempts are retained per learner/course. Inactivity is an indicator, not proof of drop-out.
- Browser viewport checks are not physical-device testing or a complete accessibility certification. No measured tenfold outcome, field Web Vitals claim or guarantee of error-free content is made.
- GitHub publication was held pending explicit public-disclosure approval at deployment time. The owner approved publication on 15 November 2026. Source and review screenshots are published through a separate feature branch and PR; the deployed image identity above remains unchanged.

## Recovery
Use the retained old main image and the final encrypted checkpoint. Do not start a backup alongside the live writer. The checkpoint contains the runtime contract and data; keep its key private. Preserve new learner work before restoring any older course store. Rehearsal validated the old image/data combination; recovery must still verify live routing and learner access.
