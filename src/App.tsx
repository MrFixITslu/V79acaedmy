import React, { lazy, Suspense } from 'react';
const Academy = lazy(() => import('./components/AcademyLandingPage').then(m => ({ default: m.AcademyLandingPage })));
const Classroom = lazy(() => import('./components/StudentPortal').then(m => ({ default: m.StudentPortal })));
const Verification = lazy(() => import('./components/CertificateVerification').then(m => ({ default: m.CertificateVerification })));

export default function App() {
  const pathname = window.location.pathname;
  const legacyCoursePrefix = '/academy/course/';
  const legacyCourseSlug = pathname.startsWith(legacyCoursePrefix) ? pathname.slice(legacyCoursePrefix.length) : '';

  if (legacyCourseSlug) {
    const canonicalPath = `/course/${legacyCourseSlug}`;
    window.history.replaceState({}, '', canonicalPath);
    return <Suspense fallback={<div role="status" className="min-h-screen flex items-center justify-center bg-[#07111f] text-[#68e6d4]">Loading V79 Academy…</div>}><Classroom courseSlug={legacyCourseSlug}/></Suspense>;
  }

  if (pathname === '/academy' || pathname === '/academy/') {
    window.history.replaceState({}, '', '/');
  }

  const certificateId = pathname.startsWith('/verify/') ? decodeURIComponent(pathname.slice('/verify/'.length)) : '';
  const courseSlug = pathname.startsWith('/course/') ? pathname.slice('/course/'.length) : '';
  return (
    <Suspense fallback={<div role="status" className="min-h-screen flex items-center justify-center bg-[#07111f] text-[#68e6d4]">Loading V79 Academy…</div>}>
      {certificateId ? <Verification certificateId={certificateId}/> : courseSlug ? <Classroom courseSlug={courseSlug}/> : <Academy />}
    </Suspense>
  );
}
