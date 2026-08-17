import { draftStatus, isAllowedCmsPath } from '../../functions/lib/cms';
import { isAllowedPreviewPath, isPreviewStatus, sameSecret } from '../../functions/lib/preview';

export type Env = Cloudflare.Env;

const PREVIEW_COOKIE = 'you_preview';
const PREVIEW_MAX_AGE_SECONDS = 60 * 60;

/**
 * Strapi Admin redirects editors here (see youth-cms/config/admin.ts).
 * Validates the shared secret, then stores the draft flag in an HttpOnly cookie
 * so the CMS proxy below can add `status=draft` on subsequent API calls.
 */
export async function handlePreview(request: Request, env: Env): Promise<Response> {
  if (!env.PREVIEW_SECRET) return new Response('Preview is not configured', { status: 503 });

  const requestUrl = new URL(request.url);
  const secret = requestUrl.searchParams.get('secret') ?? '';
  const pathname = requestUrl.searchParams.get('url') ?? '/';
  const rawStatus = requestUrl.searchParams.get('status');

  if (!(await sameSecret(secret, env.PREVIEW_SECRET))) {
    return new Response('Invalid preview token', { status: 401 });
  }
  if (!isAllowedPreviewPath(pathname)) {
    return new Response('Invalid preview path', { status: 400 });
  }
  if (!isPreviewStatus(rawStatus)) {
    return new Response('Invalid preview status', { status: 400 });
  }

  const cookieStatus = rawStatus === 'published' ? 'published' : 'draft';
  const redirectUrl = new URL(pathname, requestUrl.origin);
  redirectUrl.searchParams.set('preview', '1');

  const response = new Response(null, {
    status: 302,
    headers: { Location: redirectUrl.toString() },
  });
  response.headers.append(
    'Set-Cookie',
    `${PREVIEW_COOKIE}=${cookieStatus}; Max-Age=${PREVIEW_MAX_AGE_SECONDS}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );
  return response;
}

/**
 * Same-origin proxy to Strapi. The API token stays a runtime secret and is
 * never shipped to the browser, per Strapi's least-privilege guidance.
 */
export async function handleCms(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405 });
  }

  const requestUrl = new URL(request.url);
  if (!isAllowedCmsPath(requestUrl.pathname)) return new Response('Not found', { status: 404 });
  if (!env.STRAPI_API_URL || !env.STRAPI_API_TOKEN) {
    return new Response('CMS proxy is not configured', { status: 503 });
  }

  const upstreamUrl = new URL(requestUrl.pathname, env.STRAPI_API_URL.replace(/\/$/, ''));
  upstreamUrl.search = requestUrl.search;
  upstreamUrl.searchParams.set('status', draftStatus(request.headers.get('Cookie')));

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${env.STRAPI_API_TOKEN}`);
  const accept = request.headers.get('Accept');
  if (accept) headers.set('Accept', accept);

  const upstreamResponse = await fetch(upstreamUrl, { method: request.method, headers });

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.delete('set-cookie');
  responseHeaders.delete('www-authenticate');
  responseHeaders.set('Cache-Control', 'private, no-store');

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}
