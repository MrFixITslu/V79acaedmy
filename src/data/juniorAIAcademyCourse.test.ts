import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { ensureJuniorAIAcademyCourse, JUNIOR_AI_COURSE_ID } from './juniorAIAcademyCourse';

function freshDb() {
  return {
    courses: [],
    modules: [],
    lessons: [],
    quizzes: [],
    assets: [],
    contentBlocks: [],
    media: [],
    assignments: [],
    downloads: [],
    courseVersions: [],
    importHistories: [],
    publishingLogs: []
  };
}

const db: any = freshDb();
assert.equal(ensureJuniorAIAcademyCourse(db), true, 'first seed should create the course');
assert.equal(ensureJuniorAIAcademyCourse(db), false, 'seed must be idempotent');

const course = db.courses.find((c: any) => c.id === JUNIOR_AI_COURSE_ID);
assert.ok(course, 'Junior AI course should exist');
assert.equal(course.pricingType, 'subscription');
assert.equal(course.status, 'Published');
assert.equal(course.difficultyLevel, 'Beginner');
assert.equal(course.courseVersion, '2.0.0');
assert.ok(course.learningObjectives.some((x: string) => /structured output/i.test(x)));
assert.ok(course.learningObjectives.some((x: string) => /playbook/i.test(x)));

const modules = db.modules.filter((m: any) => m.courseId === JUNIOR_AI_COURSE_ID);
const lessons = db.lessons.filter((l: any) => l.courseId === JUNIOR_AI_COURSE_ID);
const assignments = db.assignments.filter((a: any) => a.courseId === JUNIOR_AI_COURSE_ID);
const lessonIds = new Set(lessons.map((l: any) => l.id));
const quizzes = db.quizzes.filter((q: any) => lessonIds.has(q.lessonId));

assert.equal(modules.length, 16, 'course must have 16 weekly missions');
assert.equal(lessons.length, 48, 'each mission must have exactly three micro-lessons');
assert.equal(quizzes.length, 16, 'each mission must have a knowledge check');
assert.equal(assignments.length, 16, 'each mission must have a Studio Check-In assignment marker');

for (let mission = 1; mission <= 16; mission++) {
  const module = modules.find((m: any) => m.orderNumber === mission);
  assert.ok(module, `mission ${mission} module missing`);
  const missionLessons = lessons.filter((l: any) => l.moduleId === module.id).sort((a: any,b: any)=>a.orderNumber-b.orderNumber);
  assert.equal(missionLessons.length, 3, `mission ${mission} must have 3 lessons`);
  assert.deepEqual(missionLessons.map((l: any) => l.orderNumber), [1,2,3]);
  const intro = missionLessons[0];
  const n = String(mission).padStart(2, '0');
  assert.equal(intro.videoUrl, `/junior-ai/media/mission-${n}-intro.mp4`);
  assert.ok(intro.imageUrls.includes(`/junior-ai/images/mission-${n}-cover.svg`), `mission ${mission} cover missing`);
  assert.ok(missionLessons[1].imageUrls.includes(`/junior-ai/images/mission-${n}-badge.svg`), `mission ${mission} badge missing from create lesson`);
  assert.ok(missionLessons[2].imageUrls.includes('/junior-ai/images/poster-calm.svg'), `mission ${mission} CALM visual missing from studio lesson`);
  const discover = missionLessons[0];
  const create = missionLessons[1];
  const studio = missionLessons[2];

  assert.match(discover.lessonContent, /V79 AI Efficiency Loop/);
  assert.match(discover.lessonContent, /Efficiency skill for this mission/);
  assert.match(discover.lessonContent, /When AI is a good choice/);
  assert.match(discover.lessonContent, /When AI is NOT the best choice/);
  assert.match(discover.lessonContent, /Worked example — weak vs stronger/);
  assert.match(discover.lessonContent, /Reflection/);

  assert.match(create.lessonContent, /Skill recipe/);
  assert.match(create.lessonContent, /Reusable prompt \/ workflow pattern/);
  assert.match(create.lessonContent, /Guided practice/);
  assert.match(create.lessonContent, /Common failure patterns/);
  assert.match(create.lessonContent, /Efficient follow-up prompting/);
  assert.match(create.lessonContent, /Structured-output habit/);
  assert.match(create.lessonContent, /Transfer challenge/);
  assert.match(create.lessonContent, /Quality check before you keep the result/);

  assert.match(studio.lessonContent, /Studio Team Mission/);
  assert.match(studio.lessonContent, /Apply this week’s efficiency skill/);
  assert.match(studio.lessonContent, /AI Playbook/);
  assert.match(studio.lessonContent, /Efficiency evidence to submit/);
  assert.match(studio.lessonContent, /Individual exit ticket/);
  assert.match(studio.lessonContent, /CALM/);
  assert.match(studio.lessonContent, /Weekly deliverable/);
  const quiz = quizzes.find((q: any) => q.lessonId === studio.id);
  assert.ok(quiz, `mission ${mission} quiz missing`);
  assert.equal(quiz.questions.length, 5, `mission ${mission} should include concept and scenario questions`);
  assert.ok(quiz.questions.slice(3).every((q: any) => q.explanation?.length > 20), `mission ${mission} scenario questions need teaching explanations`);
  const assignment = assignments.find((a: any) => a.lessonId === studio.id);
  assert.ok(assignment, `mission ${mission} review assignment missing`);
  assert.equal(assignment.required, false, 'team workflow—not legacy individual assignment text—gates Junior completion');
}

const curriculumText = lessons.map((l: any) => `${l.title}\n${l.description}\n${l.lessonContent}`).join('\n').toLowerCase();
assert.ok(!curriculumText.includes('deploy your app'), 'Level 4 app deployment belongs in a separate course');
assert.ok(!curriculumText.includes('build your first web app'), 'Level 4 coding belongs in a separate course');
assert.match(curriculumText, /risk/);
assert.match(curriculumText, /conflict/);
assert.match(curriculumText, /team leader/);

const requiredStaticAssets = [
  ...Array.from({ length: 16 }, (_, i) => `public/junior-ai/images/mission-${String(i + 1).padStart(2, '0')}-cover.svg`),
  ...Array.from({ length: 16 }, (_, i) => `public/junior-ai/images/mission-${String(i + 1).padStart(2, '0')}-badge.svg`),
  'public/junior-ai/images/character-pixel.svg',
  'public/junior-ai/images/character-captain-verify.svg',
  'public/junior-ai/images/character-shield.svg',
  'public/junior-ai/images/character-nova.svg',
  'public/junior-ai/images/poster-creator-code.svg',
  'public/junior-ai/images/poster-magic.svg',
  'public/junior-ai/images/poster-stop.svg',
  'public/junior-ai/images/poster-calm.svg',
  'public/junior-ai/resources/team-charter.svg',
  'public/junior-ai/resources/magic-prompt-workbench.svg',
  'public/junior-ai/resources/stop-safety-check.svg',
  'public/junior-ai/resources/risk-uh-oh-plan.svg',
  'public/junior-ai/resources/weekly-studio-check-in.svg',
  'public/junior-ai/resources/calm-fix-it-card.svg',
  'public/junior-ai/resources/demo-day-reflection.svg',
  'public/junior-ai/resources/ai-task-decision-card.svg',
  'public/junior-ai/resources/prompt-pattern-library.svg',
  'public/junior-ai/resources/fact-check-evidence-sheet.svg',
  'public/junior-ai/resources/ai-quality-audit.svg',
  'public/junior-ai/resources/personal-ai-playbook.svg'
];
for (const asset of requiredStaticAssets) {
  assert.equal(existsSync(path.join(process.cwd(), asset)), true, `missing static Junior asset: ${asset}`);
}

const mission1Studio = lessons.find((l: any) => l.id === 'jai-les-1-3');
assert.ok(mission1Studio.downloads.some((d: any) => d.url.endsWith('/team-charter.svg')));
assert.ok(mission1Studio.downloads.some((d: any) => d.url.endsWith('/weekly-studio-check-in.svg')));
assert.ok(mission1Studio.downloads.some((d: any) => d.url.endsWith('/risk-uh-oh-plan.svg')));
assert.ok(mission1Studio.downloads.some((d: any) => d.url.endsWith('/calm-fix-it-card.svg')));

const mission2Create = lessons.find((l: any) => l.id === 'jai-les-2-2');
assert.ok(mission2Create.downloads.some((d: any) => d.url.endsWith('/magic-prompt-workbench.svg')));

const mission1Discover = lessons.find((l: any) => l.id === 'jai-les-1-1');
assert.ok(mission1Discover.downloads.some((d: any) => d.url.endsWith('/ai-task-decision-card.svg')));

const mission3Discover = lessons.find((l: any) => l.id === 'jai-les-3-1');
assert.ok(mission3Discover.downloads.some((d: any) => d.url.endsWith('/stop-safety-check.svg')));

assert.ok(mission2Create.downloads.some((d: any) => d.url.endsWith('/prompt-pattern-library.svg')));

const mission4Create = lessons.find((l: any) => l.id === 'jai-les-4-2');
assert.ok(mission4Create.downloads.some((d: any) => d.url.endsWith('/fact-check-evidence-sheet.svg')));

const mission15Create = lessons.find((l: any) => l.id === 'jai-les-15-2');
assert.ok(mission15Create.downloads.some((d: any) => d.url.endsWith('/ai-quality-audit.svg')));

const mission12Studio = lessons.find((l: any) => l.id === 'jai-les-12-3');
assert.ok(mission12Studio.downloads.some((d: any) => d.url.endsWith('/personal-ai-playbook.svg')));

const mission16Studio = lessons.find((l: any) => l.id === 'jai-les-16-3');
assert.ok(mission16Studio.downloads.some((d: any) => d.url.endsWith('/demo-day-reflection.svg')));
assert.ok(mission16Studio.downloads.some((d: any) => d.url.endsWith('/personal-ai-playbook.svg')));

// Existing v1 installations must receive the richer v2 curriculum without losing
// operational course settings or changing progress-key IDs.
const legacyDb: any = freshDb();
legacyDb.courses.push({
  id: JUNIOR_AI_COURSE_ID,
  title: 'Old Junior AI title',
  status: 'Published',
  pricingType: 'subscription',
  price: 37.5,
  websiteAppId: 'live-app-123',
  websitePublishedAt: '2026-10-01T12:00:00.000Z',
  createdAt: '2026-09-01T12:00:00.000Z'
});
legacyDb.modules.push({ id: 'jai-mod-1', courseId: JUNIOR_AI_COURSE_ID, title: 'Old module' });
legacyDb.lessons.push({
  id: 'jai-les-1-1',
  moduleId: 'jai-mod-1',
  courseId: JUNIOR_AI_COURSE_ID,
  title: 'Old lesson',
  lessonContent: 'Thin v1 lesson content',
  orderNumber: 1
});
legacyDb.publishingLogs.push({ id: 'junior-ai-course-seed-v1', courseId: JUNIOR_AI_COURSE_ID });

assert.equal(ensureJuniorAIAcademyCourse(legacyDb), true, 'v1 install should upgrade to v2');
const upgradedCourse = legacyDb.courses.find((c: any) => c.id === JUNIOR_AI_COURSE_ID);
assert.equal(upgradedCourse.courseVersion, '2.0.0');
assert.equal(upgradedCourse.status, 'Published');
assert.equal(upgradedCourse.pricingType, 'subscription');
assert.equal(upgradedCourse.price, 37.5);
assert.equal(upgradedCourse.websiteAppId, 'live-app-123');
assert.equal(upgradedCourse.createdAt, '2026-09-01T12:00:00.000Z');

const upgradedLessons = legacyDb.lessons.filter((l: any) => l.courseId === JUNIOR_AI_COURSE_ID);
assert.equal(upgradedLessons.length, 48);
assert.equal(new Set(upgradedLessons.map((l: any) => l.id)).size, 48, 'upgrade must not duplicate lesson IDs');
const upgradedFirstLesson = upgradedLessons.find((l: any) => l.id === 'jai-les-1-1');
assert.match(upgradedFirstLesson.lessonContent, /V79 AI Efficiency Loop/);
assert.match(upgradedFirstLesson.lessonContent, /Worked example — weak vs stronger/);
assert.equal(ensureJuniorAIAcademyCourse(legacyDb), false, 'v2 upgrade must be idempotent');

console.log('Junior AI Academy curriculum v2 integrity and migration tests passed.');
