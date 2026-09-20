const ALLOWED_PREFIXES = [
  '/api/portal-auth',
  '/api/home-page',
  '/api/about-us',
  '/api/projects',
  '/api/members',
  '/api/team-members',
  '/api/faqs',
  '/api/news-items',
  '/api/policy-documents',
  '/api/pages',
  '/api/global-setting',
  '/api/inquiries',
  '/api/leadership-applications',
  '/api/organization-applications',
  '/api/support-submissions',
  '/api/upload',
  // Portal Auth & User Management Endpoints
  '/api/auth',
  '/api/users',
  '/api/users-permissions',
];

const PUBLIC_FORM_PATHS = new Set([
  '/api/inquiries',
  '/api/leadership-applications',
  '/api/organization-applications',
  '/api/support-submissions',
  '/api/upload',
]);

export function isAllowedCmsPath(pathname: string): boolean {
  let decodedPathname: string;
  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    return false;
  }

  if (decodedPathname.split('/').some((segment) => segment === '.' || segment === '..')) {
    return false;
  }

  return ALLOWED_PREFIXES.some(
    (prefix) => decodedPathname === prefix || decodedPathname.startsWith(`${prefix}/`)
  );
}

/** Public visitors may only write to the explicitly listed form endpoints. */
export function isPublicFormSubmission(pathname: string, method: string): boolean {
  return method === 'POST' && PUBLIC_FORM_PATHS.has(pathname);
}

export function draftStatus(cookieHeader: string | null): 'draft' | 'published' {
  return cookieHeader?.split(';').some((cookie) => cookie.trim() === 'you_preview=draft')
    ? 'draft'
    : 'published';
}
