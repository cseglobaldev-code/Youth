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
  const request = context.request;
  const allowedMethods = new Set(['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS']);

  if (!allowedMethods.has(request.method)) {
    return new Response('Method not allowed', { status: 405 });
  }

  //  Handle Browser CORS Preflight Requests
  if (request.method === 'OPTIONS') {
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
  if (!context.env.STRAPI_API_URL || !context.env.STRAPI_API_TOKEN) {
    return new Response('CMS proxy is not configured', { status: 503 });
  }

  const requestUrl = new URL(request.url);
  const upstreamUrl = new URL(pathname, context.env.STRAPI_API_URL.replace(/\/$/, ''));
  upstreamUrl.search = requestUrl.search;

  if (request.method === 'GET' || request.method === 'HEAD') {
    upstreamUrl.searchParams.set('status', draftStatus(request.headers.get('Cookie')));
  }

  const headers = new Headers();
  
  //  Preserve Admin JWT for Portal, or inject Public Token for visitors
  const clientAuth = request.headers.get('Authorization');
  if (clientAuth) {
    headers.set('Authorization', clientAuth);
  } else {
    headers.set('Authorization', `Bearer ${context.env.STRAPI_API_TOKEN}`);
  }

  const accept = request.headers.get('Accept');
  if (accept) headers.set('Accept', accept);

  const contentType = request.headers.get('Content-Type');
  if (contentType) headers.set('Content-Type', contentType);

  const upstreamResponse = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
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