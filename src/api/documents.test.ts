import { afterEach, expect, it, vi } from 'vitest';
import { fetchDocument, fetchDocuments } from './documents';
afterEach(() => vi.unstubAllGlobals());
it('loads every page of published index metadata without legal bodies and keeps external-only entries', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({
        data: [
          {
            documentId: 'a',
            title: 'Charter',
            category: 'governance',
            externalUrl: 'https://example.com/charter',
          },
        ],
        meta: { pagination: { pageCount: 2 } },
      }),
    )
    .mockResolvedValueOnce(
      Response.json({
        data: [
          {
            documentId: 'b',
            title: 'Report',
            category: 'annual-reports',
            coverImage: { url: '/uploads/cover.jpg' },
          },
        ],
      }),
    );
  vi.stubGlobal('fetch', fetchMock);
  const docs = await fetchDocuments({ baseUrl: 'https://cms.example' });
  expect(docs).toHaveLength(2);
  expect(docs[0].externalUrl).toBe('https://example.com/charter');
  expect(docs[1].coverImageUrl).toBe('https://cms.example/uploads/cover.jpg');
  const url = new URL(fetchMock.mock.calls[0][0]);
  expect(url.searchParams.get('status')).toBe('published');
  expect(url.searchParams.get('filters[category][$ne]')).toBe('legal');
  expect([...url.searchParams.values()]).not.toContain('content');
});
it('does not cache old published content or resurrect removed documents', async () => {
  const mock = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({
        data: [
          {
            documentId: 'a',
            title: 'Terms',
            category: 'legal',
            content: [{ type: 'paragraph' }],
          },
        ],
      }),
    )
    .mockResolvedValueOnce(Response.json({ data: [] }));
  vi.stubGlobal('fetch', mock);
  expect((await fetchDocument('terms-of-service'))?.title).toBe('Terms');
  expect(await fetchDocument('terms-of-service')).toBeNull();
  expect(mock.mock.calls[1][1].cache).toBe('no-store');
});
