import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { ensureDataEngineeringCourse } from './dataEngineeringCourse';
import { applyDp700Corrections, defensivePythonExample } from './dp700Corrections';

function original() {
  const db: any = { courses: [], modules: [], lessons: [], quizzes: [], assignments: [], downloads: [], publishingLogs: [] };
  ensureDataEngineeringCourse(db);
  return db;
}
const db = original();
const learnerProgress = [{ lessonId: 'de-les-4-1', complete: true }];
db.learnerProgress = structuredClone(learnerProgress);
const ids = db.lessons.map((l: any) => l.id);
assert.equal(applyDp700Corrections(db), true);
assert.equal(applyDp700Corrections(db), false);
assert.deepEqual(db.lessons.map((l: any) => l.id), ids);
assert.deepEqual(db.learnerProgress, learnerProgress);
const content = db.lessons.map((l: any) => l.lessonContent).join('\n');
assert.doesNotMatch(content, /October 19, 2026|datetime_diff\('minute', now\(\), last_event\) \* -1/);
const streaming = db.lessons.find((l: any) => l.title === 'Partitions, Shuffle, Skew and Structured Streaming');
assert.match(streaming.lessonContent, /from pyspark.sql import functions as F/);
assert.match(streaming.lessonContent, /does not start a stream/);
const question = db.quizzes.find((q: any) => q.id === 'de-quiz-11').questions.find((q: any) => /Which settings are explicit/.test(q.questionText));
assert.ok(question.options.includes(question.correctAnswer));
assert.match(question.correctAnswer, /data workflow/);
assert.equal(db.courses[0].courseVersion, '1.1.1');

// Simulate the live administrator edit. Every edited field survives byte-for-byte.
const edited = original();
edited.lessons[0].lessonContent += '\nAdministrator additions';
edited.lessons[1].review = { status: 'source-checked', version: 'old' };
edited.courses[0].price = 123;
edited.courses[0].status = 'Archived';
const before = structuredClone(edited.lessons[0]);
const quiz = edited.quizzes.find((q: any) => q.id === 'de-quiz-11');
quiz.questions.find((q: any) => q.id === question.id).explanation = 'Administrator assessment edit';
const preservedQuiz = structuredClone(quiz);
applyDp700Corrections(edited);
assert.deepEqual(edited.lessons[0], before);
assert.deepEqual(quiz, preservedQuiz);
assert.equal(edited.lessons[1].review.status, 'review-required');
assert.equal(edited.courses[0].price, 123);
assert.equal(edited.courses[0].status, 'Archived');
assert.match(edited.publishingLogs.at(-1).details, /Preserved changed\/unknown bodies for review: de-les-1-1/);

// Run the exact learner-facing Python, including invalid data rather than happy-path only.
const python = defensivePythonExample + `
assert validate_order({'order_id': 'ok', 'quantity': '2'}) == []
for value in [None, '', 'bad', 0, -1, 'NaN', 'inf', '-inf', '1e9999', {}, []]:
    assert validate_order({'order_id': 'ok', 'quantity': value}), repr(value)
assert validate_order({'order_id': '   ', 'quantity': 2})
`;
const run = spawnSync('python3', ['-c', python], { encoding: 'utf8' });
assert.equal(run.status, 0, run.stderr || String(run.error));
assert.match(run.stdout, /accepted: 1 rejected: 2/);
console.log('DP-700 correction preservation, assessment and executable Python checks passed. KQL/Spark execution still requires the stated environment.');
