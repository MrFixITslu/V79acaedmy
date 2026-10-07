import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

type Verification = {
  id: string;
  name: string;
  courseId: string;
  courseTitle: string;
  issuedAt: string;
  status: 'valid' | 'revoked';
  revokedAt?: string | null;
};

export function CertificateVerification({ certificateId }: { certificateId: string }) {
  const [record, setRecord] = useState<Verification | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/public/certificates/${encodeURIComponent(certificateId)}`, { signal: controller.signal })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Certificate could not be verified.');
        return data;
      })
      .then(data => { setRecord(data); setError(''); })
      .catch(err => { if (err.name !== 'AbortError') setError(err.message); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [certificateId]);

  return <main className="min-h-screen bg-slate-50 text-slate-900 px-5 py-12">
    <div className="max-w-2xl mx-auto">
      <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700"><ArrowLeft size={16}/>Back to V79 Academy</a>
      <section className="mt-8 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm">
        <Award className="text-indigo-600" size={42}/>
        <h1 className="text-3xl font-black mt-5">Certificate verification</h1>
        <p className="text-slate-500 mt-2">Check whether a V79 Academy certificate was issued by this academy.</p>

        {loading && <p role="status" className="mt-8 text-slate-600">Checking certificate…</p>}
        {error && <div role="alert" className="mt-8 rounded-2xl bg-rose-50 border border-rose-200 p-5 text-rose-900 flex gap-3"><XCircle className="shrink-0"/><div><p className="font-bold">Not verified</p><p className="text-sm mt-1">{error}</p></div></div>}
        {record && <div className="mt-8 space-y-6">
          <div className={`rounded-2xl border p-5 flex gap-3 ${record.status === 'valid' ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'}`}>
            {record.status === 'valid' ? <CheckCircle2 className="shrink-0"/> : <XCircle className="shrink-0"/>}
            <div><p className="font-black">{record.status === 'valid' ? 'Valid V79 Academy certificate' : 'Certificate revoked'}</p><p className="text-sm mt-1">Record ID: <span className="font-mono break-all">{record.id}</span></p></div>
          </div>
          <dl className="grid sm:grid-cols-2 gap-5 text-sm">
            <div><dt className="text-slate-500">Learner</dt><dd className="font-bold mt-1">{record.name}</dd></div>
            <div><dt className="text-slate-500">Course</dt><dd className="font-bold mt-1">{record.courseTitle}</dd></div>
            <div><dt className="text-slate-500">Issued</dt><dd className="font-bold mt-1">{new Date(record.issuedAt).toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' })}</dd></div>
            <div><dt className="text-slate-500">Status</dt><dd className="font-bold mt-1 capitalize">{record.status}</dd></div>
          </dl>
        </div>}
      </section>
    </div>
  </main>;
}
