import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'data', 'certificates.json');

export type AcademyCertificate = {
  id: string;
  learnerId: string;
  learnerName: string;
  courseId: string;
  courseTitle: string;
  issuedAt: string;
  status: 'valid' | 'revoked';
  revokedAt?: string | null;
  revocationReason?: string | null;
};

function readCertificates(): AcademyCertificate[] {
  if (!fs.existsSync(file)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCertificates(records: AcademyCertificate[]) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(records, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, file);
}

export function findCertificate(id: string) {
  return readCertificates().find(record => record.id === id) || null;
}

export function issueCertificate(input: Omit<AcademyCertificate, 'status' | 'revokedAt' | 'revocationReason'>) {
  const records = readCertificates();
  const existing = records.find(record => record.id === input.id);
  if (existing) return existing;
  const record: AcademyCertificate = {
    ...input,
    status: 'valid',
    revokedAt: null,
    revocationReason: null
  };
  records.push(record);
  writeCertificates(records);
  return record;
}

export function publicCertificate(record: AcademyCertificate) {
  return {
    id: record.id,
    name: record.learnerName,
    courseId: record.courseId,
    courseTitle: record.courseTitle,
    issuedAt: record.issuedAt,
    status: record.status,
    revokedAt: record.revokedAt || null
  };
}
