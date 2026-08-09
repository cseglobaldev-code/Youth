interface UploadEnv {
  STRAPI_API_URL?: string;
}

interface PagesContext {
  request: Request;
  env: UploadEnv;
  params: { path?: string | string[] };
}

export async function onRequest(context: PagesContext): Promise<Response> {
  if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405 });
  }
  if (!context.env.STRAPI_API_URL) return new Response('CMS proxy is not configured', { status: 503 });

  const path = Array.isArray(context.params.path) ? context.params.path.join('/') : context.params.path ?? '';
  const requestUrl = new URL(context.request.url);
  const upstreamUrl = new URL(`/uploads/${path}`, context.env.STRAPI_API_URL.replace(/\/$/, ''));
  upstreamUrl.search = requestUrl.search;

  const response = await fetch(upstreamUrl, { method: context.request.method });
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'public, max-age=300');
  return new Response(response.body, { status: response.status, headers });
}
