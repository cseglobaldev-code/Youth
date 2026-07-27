import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchMembers } from './members';

describe('fetchMembers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps flattened Strapi 5 members to the existing card shape', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            id: 7,
            documentId: 'member-document-id',
            name: 'YouthBridge PH',
            country: 'Philippines',
            period: '2021 → present',
            leader: 'Maria Santos',
            focusSdgs: '[1, 4, 8]',
            cover: { url: '/uploads/cover.png' },
            logo: { url: 'https://res.cloudinary.com/demo/logo.png' },
            createdAt: '2026-07-19T10:00:00.000Z',
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const members = await fetchMembers({
      baseUrl: 'http://localhost:1337/',
      token: 'read-token',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:1337/api/members?populate%5B0%5D=cover&populate%5B1%5D=logo&pagination%5BpageSize%5D=100&pagination%5BwithCount%5D=false&sort%5B0%5D=createdAt%3Adesc',
      expect.objectContaining({
        headers: { Authorization: 'Bearer read-token' },
      })
    );
    expect(members).toEqual([
      {
        id: 'member-document-id',
        name: 'YouthBridge PH',
        country: 'Philippines',
        period: '2021 → present',
        leader: 'Maria Santos',
        focusSdgs: [1, 4, 8],
        coverUrl: 'http://localhost:1337/uploads/cover.png',
        logoUrl: 'https://res.cloudinary.com/demo/logo.png',
        createdAt: '2026-07-19T10:00:00.000Z',
      },
    ]);

    // second call within TTL hits the in-memory cache — no extra network request
    await fetchMembers({ baseUrl: 'http://localhost:1337/', token: 'read-token' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects a failed Strapi response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 403 })
    );

    await expect(fetchMembers({ baseUrl: 'http://other-host:1337' })).rejects.toThrow(
      'Unable to load members (403)'
    );
  });
});
