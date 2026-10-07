# V79 Junior AI Academy — v3.1 Completion Checklist

This document records the repository completion state for the manually deployed **V79 Junior AI Academy: AI Superpowers for Kids**.

## Curriculum

- [x] 16 missions
- [x] 48 learner lessons
- [x] Discover / Create / Studio lesson rhythm
- [x] Ages 6–8 Explorer path
- [x] Ages 9–12 Creator path
- [x] DEFINE → CHOOSE → PROMPT → CHECK → IMPROVE → SAVE efficiency loop
- [x] Generate / summarize / extract / transform / compare / explain / critique / plan operations
- [x] Conversation/context management
- [x] Privacy, permission, evidence, uncertainty and ethical-use instruction
- [x] Images, writing, audio, video, presentation and content-promotion workflows
- [x] Workflow decomposition, structured handoffs and quality gates
- [x] Problem-solving and supervised entrepreneurship
- [x] Long-running team capstone from Mission 1 through Mission 16
- [x] Individual AI Operator Benchmark on a brand-new task

## Lesson-value standard

Every Discover lesson includes:
- mental model;
- operator moves;
- real-world use;
- when to use/not use AI;
- weak-versus-strong worked example;
- coach questions;
- reflection.

Every Create lesson includes:
- skill recipe;
- reusable pattern;
- guided practice;
- micro-drills;
- failure patterns and fixes;
- focused follow-up prompting;
- structured-output practice;
- transfer challenge;
- independent operator task;
- mastery evidence;
- efficiency metric;
- quality checklist.

Every Studio lesson includes:
- team project application;
- mastery target;
- efficiency target;
- project management;
- process evidence;
- Team AI Playbook entry;
- individual reflection;
- instructor review/revision.

## Assessment

- [x] 16 mission quizzes
- [x] 5 questions per mission quiz
- [x] Scenario/application questions with teaching explanations
- [x] Weekly team Studio submission
- [x] Individual contribution reflection
- [x] Needs Changes → revision → Approved workflow
- [x] Mission 16 individual AI Operator evidence required before approval
- [x] AI Operator Graduation Rubric
- [x] Recommended final pass: no graduation-rubric category below 3/4
- [x] Certificate still requires lessons + 16 approved Studio submissions + individual reflections

## Team and project management

- [x] Teams of exactly three
- [x] Leader / Builder / Checker
- [x] Leadership rotation and handover
- [x] To Do / Doing / Done task board
- [x] Risk / Uh-Oh plans
- [x] CALM conflict method
- [x] Adult escalation for unsafe behavior
- [x] Instructor team formation and review

## Media and resources

- [x] 16 mission covers
- [x] 16 badges
- [x] Pixel / Captain Verify / Shield / Nova visuals
- [x] Creator Code / MAGIC / STOP / CALM posters
- [x] AI Operator Skills Map
- [x] Printable Team Charter
- [x] MAGIC Prompt Workbench
- [x] STOP Safety Check
- [x] Fact-check Evidence Sheet
- [x] AI Output Quality Audit
- [x] Weekly Studio Check-In
- [x] Risk / Uh-Oh Plan
- [x] CALM Fix-It Card
- [x] Personal AI Playbook
- [x] Demo Day Reflection
- [x] AI Operator Benchmark worksheet
- [x] AI Operator Graduation Rubric
- [x] 16 narrated mission-intro videos
- [x] 16 WebVTT caption files generated with the videos
- [x] 16 transcripts generated with the videos
- [x] Docker build fails if the expected AI media set is incomplete

## Migration and operational safety

- [x] Curriculum version: 3.1.0
- [x] Existing course/lesson IDs preserved
- [x] Existing learner progress keys preserved
- [x] Existing course status preserved
- [x] Existing pricing preserved
- [x] Existing website linkage preserved
- [x] v1/v2/v3 installations migrate idempotently to v3.1
- [x] Automated tests cover curriculum shape, assets and migration

## Deployment

Deployment is intentionally **manual**.

GitHub Actions:
1. run CI;
2. build the production Docker image;
3. package and publish the validated image to GHCR.

GitHub Actions do **not** SSH to or restart the production server.

After manual deployment:
1. verify `GET /healthz`;
2. sign into Course Builder;
3. review the Junior AI Academy;
4. use **Publish to Website** if the public website should receive the revised curriculum.

## Completion definition

The course is repository-complete when:
- CI is green;
- Docker image build is green;
- all course integrity tests pass;
- no required media/resource assertion is missing; and
- the v3.1 migration test passes.

Production availability is a separate manual deployment decision.
