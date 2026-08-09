const ALLOWED_PREFIXES = ['/api/projects', '/api/members', '/api/team-members', '/api/faqs', '/api/news-items', '/api/policy-documents'];

export function isAllowedCmsPath(pathname: string): boolean {
  return ALLOWED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function draftStatus(cookieHeader: string | null): 'draft' | 'published' {
  return cookieHeader?.split(';').some((cookie) => cookie.trim() === 'you_preview=draft')
    ? 'draft'
    : 'published';
}
