import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'data', 'learner-sessions.json');

type LearnerSessionRecord = {
  tokenHash: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
};

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function readSessions(): LearnerSessionRecord[] {
  if (!fs.existsSync(file)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSessions(records: LearnerSessionRecord[]) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(records, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, file);
}

function active(records: LearnerSessionRecord[], now = Date.now()) {
  return records.filter(record => Date.parse(record.expiresAt) > now);
}

export function issueLearnerSession(userId: string, ttlMs = 12 * 60 * 60 * 1000) {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const records = active(readSessions(), now);
  records.push({
    tokenHash: hashToken(token),
    userId,
    expiresAt: new Date(now + ttlMs).toISOString(),
    createdAt: new Date(now).toISOString()
  });
  writeSessions(records);
  return token;
}

export function learnerSessionUserId(token: string | undefined | null) {
  if (!token) return null;
  const now = Date.now();
  const records = readSessions();
  const live = active(records, now);
  if (live.length !== records.length) writeSessions(live);
  const match = live.find(record => record.tokenHash === hashToken(token));
  return match?.userId || null;
}

export function revokeLearnerSession(token: string | undefined | null) {
  if (!token) return;
  const digest = hashToken(token);
  const records = active(readSessions()).filter(record => record.tokenHash !== digest);
  writeSessions(records);
}

export function revokeLearnerSessionsForUser(userId: string) {
  const records = active(readSessions()).filter(record => record.userId !== userId);
  writeSessions(records);
}
