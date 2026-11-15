import { createHash } from 'node:crypto';
import baseline from './dp700CorrectionBaseline.json';

const correctionId = 'de-corrections-20261115-v1';
const courseId = 'course-data-engineering-dp700-01';
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const oldFocus = "Microsoft's October 19, 2026 skills measured emphasize applied decisions across implementation/management, ingestion/transformation, and monitoring/optimization.";
const newFocus = "Microsoft's DP-700 study guide covers implementing and managing analytics solutions, ingesting and transforming data, and monitoring and optimising solutions. Exam objectives change; check the linked official guide before booking an exam.";

export const defensivePythonExample = `import math

def validate_order(row):
    errors = []
    if not str(row.get('order_id') or '').strip():
        errors.append('missing order_id')
    try:
        quantity = float(row.get('quantity'))
        if not math.isfinite(quantity) or quantity <= 0:
            errors.append('quantity must be a positive finite number')
    except (TypeError, ValueError, OverflowError):
        errors.append('quantity must be a positive finite number')
    return errors

# Illustrative records, not real customer data. Run in Python 3.11 or later.
orders = [{'order_id': 'A1', 'quantity': '2'},
          {'order_id': 'A2', 'quantity': 'not-a-number'},
          {'order_id': '', 'quantity': 0}]
valid, rejected = [], []
for order in orders:
    errors = validate_order(order)
    if errors:
        rejected.append({**order, 'reject_reason': '; '.join(errors)})
    else:
        valid.append(order)
print('accepted:', len(valid), 'rejected:', len(rejected))
# Expected: accepted: 1 rejected: 2`;

function correctedContent(content: string): string {
  let result = content.replace(oldFocus, newFocus)
    .replaceAll('Spark, domains, OneLake and Apache Airflow', 'Spark, domains, OneLake and data workflows')
    .replaceAll('Spark, domain, OneLake and Apache Airflow', 'Spark, domain, OneLake and data workflow')
    .replace("datetime_diff('minute', now(), last_event) * -1", "datetime_diff('minute', now(), last_event)");
  if (result.includes('def validate_order(row):')) {
    result = result.replace(/```python\n[\s\S]*?```/, '```python\n' + defensivePythonExample + '\n```');
    result += '\n\n### Validation reference and expected result\nPython rejects malformed numeric text with an exception; NaN and infinity also need explicit checks. The example quarantines these records rather than crashing or accepting them. This checks quantity only: add currency, dates, identifiers and other business rules before production use.\nhttps://docs.python.org/3.11/library/functions.html#float\nhttps://docs.python.org/3.11/library/math.html#math.isfinite\n';
  }
  if (result.includes(".withWatermark('event_time'")) {
    result = result.replace('```python\nevents =', '```python\nfrom pyspark.sql import functions as F\n\nevents =');
    result += '\n\n### Environment and execution boundary\nUse a Fabric PySpark notebook with an attached Lakehouse and an existing Delta table named bronze_events. The table needs event_time as a timestamp and event_type as a string. This builds a streaming DataFrame; it does not start a stream. Configure a separate writeStream query, output mode, destination and unique checkpoint before executing a continuous workload. Use a disposable workspace and stop the query afterwards. This example has not been executed in a live Fabric workspace during this review.\nhttps://spark.apache.org/docs/3.5.6/structured-streaming-programming-guide.html\n';
  }
  if (result.includes('minutes_stale=datetime_diff')) {
    result += '\n\n### Check the sign and handle missing data\nKQL datetime_diff subtracts the third argument from the second. If now is 12:20 UTC and the last event is 12:05 UTC, minutes_stale is positive 15 and the alert matches. A 12:15 event gives 5 and does not match. Empty input gives a null last_event; this query alone will not alert on an empty table. Add a separate empty-input check and investigate future-dated events or clock skew. The arithmetic was checked against the official definition; execution in Eventhouse remains required.\nhttps://learn.microsoft.com/en-us/kusto/query/datetime-diff-function?view=microsoft-fabric\n';
  }
  return result;
}

/** One-time, exact-content corrections. Never overwrite edited lesson bodies. */
export function applyDp700Corrections(db: any): boolean {
  if (!Array.isArray(db.publishingLogs) || db.publishingLogs.some((l: any) => l.id === correctionId)) return false;
  const course = db.courses?.find((c: any) => c.id === courseId);
  if (!course) return false;
  const changed: string[] = [], skipped: string[] = [];
  for (const lesson of db.lessons.filter((l: any) => l.courseId === courseId)) {
    if (hash(lesson.lessonContent || '') !== baseline.lessons[lesson.id as keyof typeof baseline.lessons]) {
      skipped.push(lesson.id);
      continue;
    }
    const revised = correctedContent(lesson.lessonContent);
    if (revised !== lesson.lessonContent) {
      lesson.lessonContent = revised;
      if (lesson.review) lesson.review = { ...lesson.review, status: 'review-required' };
      changed.push(lesson.id);
    }
  }
  const question = db.quizzes?.find((q: any) => q.id === 'de-quiz-11')?.questions?.find((q: any) => q.id === baseline.workspaceQuestion.id);
  const original = baseline.workspaceQuestion;
  let assessmentUpdated = false;
  if (question && ['questionText', 'options', 'correctAnswer', 'explanation'].every(k => JSON.stringify(question[k]) === JSON.stringify(original[k as keyof typeof original]))) {
    question.options = question.options.map((s: string) => s.replace('Apache Airflow', 'data workflow'));
    question.correctAnswer = question.correctAnswer.replace('Apache Airflow', 'data workflow');
    question.explanation = 'The official DP-700 study guide lists Spark, domain, OneLake and data workflow workspace settings. Check the current guide because exam objectives can change.';
    assessmentUpdated = true;
  }
  if (hash(course.fullDescription || '') === baseline.description) {
    course.fullDescription = course.fullDescription.replace("Version 1.1 aligns the curriculum to Microsoft's DP-700 skills measured as of October 19, 2026", 'Version 1.1.1 corrects selected examples and links to the current official DP-700 study guide');
    course.courseVersion = '1.1.1';
  }
  db.publishingLogs.push({ id: correctionId, courseId, courseTitle: course.title,
    event: 'Targeted curriculum corrections', fromStatus: '1.1.0', toStatus: '1.1.1',
    performedBy: 'V79 curriculum maintenance', timestamp: new Date().toISOString(),
    details: `Corrected known seed lesson bodies: ${changed.join(', ')}. Preserved changed/unknown bodies for review: ${skipped.join(', ') || 'none'}. Workspace-settings assessment updated: ${assessmentUpdated}. This is a targeted correction, not a full lesson source review or Fabric execution attestation.` });
  return true;
}
