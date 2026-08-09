import { draftStatus, isAllowedCmsPath } from '../lib/cms';

interface CmsEnv {
  STRAPI_API_URL?: string;
  STRAPI_API_TOKEN?: string;
}

interface PagesContext {
  request: Request;
  env: CmsEnv;
  params: { path?: string | string[] };
}

function pathnameFromParams(params: PagesContext['params']): string {
  const path = Array.isArray(params.path) ? params.path.join('/') : params.path ?? '';
  return `/api/${path}`;
}

export async function onRequest(context: PagesContext): Promise<Response> {
  if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405 });
  }

  const pathname = pathnameFromParams(context.params);
  if (!isAllowedCmsPath(pathname)) return new Response('Not found', { status: 404 });
  if (!context.env.STRAPI_API_URL || !context.env.STRAPI_API_TOKEN) {
    return new Response('CMS proxy is not configured', { status: 503 });
  }

  const requestUrl = new URL(context.request.url);
  const upstreamUrl = new URL(pathname, context.env.STRAPI_API_URL.replace(/\/$/, ''));
  upstreamUrl.search = requestUrl.search;
  upstreamUrl.searchParams.set('status', draftStatus(context.request.headers.get('Cookie')));

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${context.env.STRAPI_API_TOKEN}`);
  const accept = context.request.headers.get('Accept');
  if (accept) headers.set('Accept', accept);

  const upstreamResponse = await fetch(upstreamUrl, {
    method: context.request.method,
    headers,
  });
  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.delete('set-cookie');
  responseHeaders.delete('www-authenticate');
  responseHeaders.set('Cache-Control', 'private, no-store');

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export { draftStatus, isAllowedCmsPath };
