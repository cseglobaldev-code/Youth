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
  const allowedMethods = new Set(['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
  if (!allowedMethods.has(context.request.method)) {
    return new Response('Method not allowed', { status: 405 });
  }

  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const pathname = pathnameFromParams(context.params);
  if (!isAllowedCmsPath(pathname)) return new Response('Not found', { status: 404 });

  const upstreamUrl = new URL(pathname, (context.env.STRAPI_API_URL || '').replace(/\/$/, ''));
  upstreamUrl.search = new URL(context.request.url).search;

  if (context.request.method === 'GET' || context.request.method === 'HEAD') {
    upstreamUrl.searchParams.set('status', draftStatus(context.request.headers.get('Cookie')));
  }

  const headers = new Headers();
  
  // 👈 THE FIX
  const clientAuth = context.request.headers.get('Authorization');
  if (clientAuth) {
    headers.set('Authorization', clientAuth);
  } else if (context.env.STRAPI_API_TOKEN) {
    headers.set('Authorization', `Bearer ${context.env.STRAPI_API_TOKEN}`);
  }

  const accept = context.request.headers.get('Accept');
  if (accept) headers.set('Accept', accept);

  const contentType = context.request.headers.get('Content-Type');
  if (contentType) headers.set('Content-Type', contentType);

  const upstreamResponse = await fetch(upstreamUrl, {
    method: context.request.method,
    headers,
    body: context.request.method !== 'GET' && context.request.method !== 'HEAD' ? context.request.body : undefined,
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