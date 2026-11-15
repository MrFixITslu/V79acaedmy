# Self-paced Academy release

## Audit and scope
Baseline source: 584e07c; live container: localhost/v79-brand-academy:20261106-r1, image sha256:a32b668a784b534bbde3d8e8ccaf817354ef5e7828dc4217d4919be72eb77769.
Live: 4 published courses, 180 lessons, JSON persistence mounted at /home/firelion/V79-Course-Builder/data. PostgreSQL is present but not the application store. Existing learner records must stay on the server.
Existing strengths: server-graded quizzes, certificate checks, Hub service signatures, authoring/version history, persistent learner sessions and progress, practical junior labs.
Gaps: adult independent learning paths, lesson review metadata, explanations after grading, personal notes/bookmarks, learning dashboard progress, real learning analytics, systematic self-paced teaching.
Current membership access uses dated admin grants; recurring checkout is explicitly disabled. US$35 / EC$94 is the owner's proposed flat monthly offer, not proof of a configured payment product. Do not change prices of existing courses or claim automated cancellation of a provider subscription.

## Direction
Compared: cinematic showcase (high visual impact, distracts from study); dashboard LMS (quick scanning, weak reading focus); reading-first Academy with labs (chosen: comprehension, low bandwidth, clear next step).
Preserve the V79 logo, blue/teal identity, existing IDs, Hub integration, course authoring and payment boundaries. Use light reading surfaces, readable body text, fluid layouts, a source-review panel, explicit save states, diagram-led exploration. No invented usage metrics. Signature: a layered network/AI visual with native-scroll enhancement, manual controls and reduced-motion fallback.

## Release requirements
- Two complete adult beginner courses, with explained concepts, worked examples, independent practice, model solutions, common mistakes, source links, objectives, review date and version per lesson.
- Each lesson has a server-graded scenario quiz with explanations after submission. Completion certificates remain non-accredited, dependent on saved requirements.
- Notes, bookmarks and resume state isolated per learner; account dashboard uses real server progress.
- Legacy accounts/content preserved by additive idempotent seeding; deliberate deletion remains respected.
- Signed/admin analytics; no public learner data. Existing Hub auth/MFA and billing contracts retained.
- Meaningful unit/API and browser journeys, mobile/keyboard/reduced-motion checks, exact-source staging with isolated data, backup restore rehearsal, rollback, final live smoke checks.

## Measurement
No tenfold claim without measured baseline. Capture enrolments, saved completions, quiz attempts/pass rate and course completion counts. Show inactivity as an indicator, not a definitive drop-out judgement. No historical event fabrication. Reading and practice time estimates are planning estimates, not tracked time.

## Status
New adult foundation courses and study tools implemented, tested, staged and deployed. Public HTTPS and single-writer checks passed. See VALIDATION.md for exact evidence, recovery and remaining scope. Existing programmes remain preserved; recurring checkout remains outstanding. Public source publication was approved by the owner on 15 November 2026 and is tracked through a separate feature-branch PR.
