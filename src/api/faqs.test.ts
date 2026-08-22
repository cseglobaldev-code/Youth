import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fetchFAQs } from './faqs';

describe('fetchFAQs', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('requests FAQs ordered by displayOrder:asc with fallback createdAt:desc', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          { documentId: 'faq-1', question: 'Q1', answer: 'A1' },
          { documentId: 'faq-2', question: 'Q2', answer: 'A2' },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await fetchFAQs({ baseUrl: 'http://localhost:1337' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const requestedUrl = String(fetchMock.mock.calls[0][0]);
    const parsed = new URL(requestedUrl);

    expect(parsed.searchParams.get('sort[0]')).toBe('displayOrder:asc');
    expect(parsed.searchParams.get('sort[1]')).toBe('createdAt:desc');
  });
});
