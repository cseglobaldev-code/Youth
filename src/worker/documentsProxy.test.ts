import { afterEach, expect, it, vi } from 'vitest';
import { handleCms, type Env } from './handlers';
import { onRequest } from '../../functions/api/[[path]]';
afterEach(() => vi.unstubAllGlobals());
const env = {
  STRAPI_API_URL: 'https://cms.example',
  STRAPI_API_TOKEN: 'read-test-token',
} as Env;
for (const adapter of ['worker', 'pages']) {
  const run = (request: Request) =>
    adapter === 'worker'
      ? handleCms(request, env)
      : onRequest({ request, env, params: { path: 'policy-documents' } });
  it(`${adapter}: preserves authenticated portal draft queries and passes the token to Strapi`, async () => {
    const mock = vi.fn().mockResolvedValue(Response.json({ data: [] }));
    vi.stubGlobal('fetch', mock);
    await run(
      new Request('https://you.example/api/policy-documents?status=draft', {
        headers: { Authorization: 'Bearer staff-test-token' },
      }),
    );
    expect(new URL(mock.mock.calls[0][0]).searchParams.get('status')).toBe(
      'draft',
    );
    expect(mock.mock.calls[0][1].headers.get('Authorization')).toBe(
      'Bearer staff-test-token',
    );
  });
  it(`${adapter}: ignores public draft requests without the preview cookie`, async () => {
    const mock = vi.fn().mockResolvedValue(Response.json({ data: [] }));
    vi.stubGlobal('fetch', mock);
    const response = await run(
      new Request('https://you.example/api/policy-documents?status=draft', { headers: { Cookie: 'you_preview=draft' } }),
    );
    expect(new URL(mock.mock.calls[0][0]).searchParams.get('status')).toBe(
      'published',
    );
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
  });
}
