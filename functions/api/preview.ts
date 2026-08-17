import { isAllowedPreviewPath, isPreviewStatus, sameSecret } from '../lib/preview';

interface PreviewEnv {
  PREVIEW_SECRET?: string;
}

interface PagesContext {
  request: Request;
  env: PreviewEnv;
}

const COOKIE_NAME = 'you_preview';
const MAX_AGE_SECONDS = 60 * 60;

function redirectResponse(request: Request, pathname: string, status: 'draft' | 'published') {
  const url = new URL(pathname, request.url);
  url.searchParams.set('preview', '1');
  const response = new Response(null, {
    status: 302,
    headers: { Location: url.toString() },
  });
  response.headers.append(
    'Set-Cookie',
    `${COOKIE_NAME}=${status}; Max-Age=${MAX_AGE_SECONDS}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );
  return response;
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const configuredSecret = context.env.PREVIEW_SECRET;
  if (!configuredSecret) return new Response('Preview is not configured', { status: 503 });

  const requestUrl = new URL(context.request.url);
  const secret = requestUrl.searchParams.get('secret') ?? '';
  const pathname = requestUrl.searchParams.get('url') ?? '/';
  const rawStatus = requestUrl.searchParams.get('status');

  if (!(await sameSecret(secret, configuredSecret))) {
    return new Response('Invalid preview token', { status: 401 });
  }
  if (!isAllowedPreviewPath(pathname)) {
    return new Response('Invalid preview path', { status: 400 });
  }
  if (!isPreviewStatus(rawStatus)) {
    return new Response('Invalid preview status', { status: 400 });
  }

  const cookieStatus = rawStatus === 'published' ? 'published' : 'draft';
  return redirectResponse(context.request, pathname, cookieStatus as 'draft' | 'published');
}

export { COOKIE_NAME };
