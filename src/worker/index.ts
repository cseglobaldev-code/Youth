import { handleCms, handlePreview, type Env } from './handlers';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    // Order matters: isAllowedCmsPath() rejects /api/preview, so it must be
    // matched before the generic /api/ branch or it would 404.
    if (pathname === '/api/preview') return handlePreview(request, env);

    // Any /api/* request stays inside the proxy. Falling through to ASSETS
    // would serve index.html with status 200, and the client would then
    // JSON.parse HTML — the exact production failure this replaces.
    if (pathname === '/api' || pathname.startsWith('/api/')) return handleCms(request, env);

    return env.ASSETS.fetch(request);
  },
};

export type { Env };
