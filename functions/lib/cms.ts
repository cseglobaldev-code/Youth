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

const LEGACY_FORM_FIELDS: Record<string, readonly string[]> = {
};

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

/**
 * Older frontend bundles may still submit fields that were removed from the
 * corresponding Strapi content type. Strapi rejects the entire request when
 * one unknown key is present, so strip only those known legacy keys at the
 * proxy boundary while leaving every current field untouched.
 */
export function sanitizePublicFormPayload(pathname: string, payload: unknown): unknown {
  const legacyFields = LEGACY_FORM_FIELDS[pathname];
  if (!legacyFields || typeof payload !== 'object' || payload === null) return payload;

  const envelope = payload as Record<string, unknown>;
  if (typeof envelope.data !== 'object' || envelope.data === null || Array.isArray(envelope.data)) {
    return payload;
  }

  const sanitizedData = { ...(envelope.data as Record<string, unknown>) };
  for (const field of legacyFields) delete sanitizedData[field];

  return { ...envelope, data: sanitizedData };
}

export async function cmsRequestBody(request: Request, pathname: string): Promise<BodyInit | undefined> {
  if (request.method === 'GET' || request.method === 'HEAD') return undefined;

  const shouldSanitize =
    request.method === 'POST' &&
    Boolean(LEGACY_FORM_FIELDS[pathname]) &&
    request.headers.get('Content-Type')?.toLowerCase().includes('application/json');

  if (!shouldSanitize) return request.body ?? undefined;

  const rawBody = await request.text();
  try {
    return JSON.stringify(sanitizePublicFormPayload(pathname, JSON.parse(rawBody)));
  } catch {
    // Preserve malformed JSON so Strapi can return its normal validation error.
    return rawBody;
  }
}

export function draftStatus(cookieHeader: string | null): 'draft' | 'published' {
  return cookieHeader?.split(';').some((cookie) => cookie.trim() === 'you_preview=draft')
    ? 'draft'
    : 'published';
}
