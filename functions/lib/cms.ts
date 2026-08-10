const ALLOWED_PREFIXES = ['/api/projects', '/api/members', '/api/team-members', '/api/faqs', '/api/news-items', '/api/policy-documents'];

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

export function draftStatus(cookieHeader: string | null): 'draft' | 'published' {
  return cookieHeader?.split(';').some((cookie) => cookie.trim() === 'you_preview=draft')
    ? 'draft'
    : 'published';
}
