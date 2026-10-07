import React, { lazy, Suspense, useEffect } from 'react';
const Academy = lazy(() => import('./components/AcademyLandingPage').then(m => ({ default: m.AcademyLandingPage })));
const Classroom = lazy(() => import('./components/StudentPortal').then(m => ({ default: m.StudentPortal })));
const Verification = lazy(() => import('./components/CertificateVerification').then(m => ({ default: m.CertificateVerification })));

const ACADEMY_ORIGIN = 'https://academy.v79sl.com';

function setMeta(selector: string, attribute: string, value: string) {
  const element = document.querySelector<HTMLMetaElement>(selector);
  if (element) element.setAttribute(attribute, value);
}

export default function App() {
  const pathname = window.location.pathname;
  const legacyCoursePrefix = '/academy/course/';
  const legacyCourseSlug = pathname.startsWith(legacyCoursePrefix) ? pathname.slice(legacyCoursePrefix.length) : '';
  const courseSlug = pathname.startsWith('/course/') ? pathname.slice('/course/'.length) : '';
  const certificateId = pathname.startsWith('/verify/') ? decodeURIComponent(pathname.slice('/verify/'.length)) : '';

  const canonicalPath = legacyCourseSlug
    ? `/course/${legacyCourseSlug}`
    : courseSlug
      ? `/course/${courseSlug}`
      : certificateId
        ? pathname
        : '/';

  useEffect(() => {
    const canonicalUrl = `${ACADEMY_ORIGIN}${canonicalPath === '/' ? '/' : canonicalPath}`;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[name="robots"]', 'content', certificateId ? 'noindex,nofollow' : 'index,follow');
  }, [canonicalPath, certificateId]);

  if (legacyCourseSlug) {
    const nextPath = `/course/${legacyCourseSlug}`;
    window.history.replaceState({}, '', nextPath);
    return <Suspense fallback={<div role="status" className="min-h-screen flex items-center justify-center bg-[#07111f] text-[#68e6d4]">Loading V79 Academy…</div>}><Classroom courseSlug={legacyCourseSlug}/></Suspense>;
  }

  if (pathname === '/academy' || pathname === '/academy/') {
    window.history.replaceState({}, '', '/');
  }

  return (
    <Suspense fallback={<div role="status" className="min-h-screen flex items-center justify-center bg-[#07111f] text-[#68e6d4]">Loading V79 Academy…</div>}>
      {certificateId ? <Verification certificateId={certificateId}/> : courseSlug ? <Classroom courseSlug={courseSlug}/> : <Academy />}
    </Suspense>
  );
}
