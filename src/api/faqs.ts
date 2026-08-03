import {
  cacheGet,
  cacheSet,
  resolveConfig,
  text,
  type StrapiRequestOptions,
} from './strapi';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface StrapiFAQ {
  id?: unknown;
  documentId?: unknown;
  question?: unknown;
  answer?: unknown;
}

interface StrapiFAQsResponse {
  data?: unknown;
}

export async function fetchFAQs(options: StrapiRequestOptions = {}): Promise<FAQ[]> {
  const { baseUrl, token } = resolveConfig(options);

  const query = new URLSearchParams();
  query.append('pagination[pageSize]', '100');
  query.append('pagination[withCount]', 'false');
  query.append('sort[0]', 'createdAt:desc');

  const url = `${baseUrl}/api/faqs?${query}`;
  let payload = cacheGet(url) as StrapiFAQsResponse | undefined;

  if (payload === undefined) {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: options.signal,
    });

    if (!response.ok) throw new Error(`Unable to load FAQs (${response.status})`);

    payload = (await response.json()) as StrapiFAQsResponse;
    if (!Array.isArray(payload.data)) throw new Error('Invalid FAQs response from CMS');
    cacheSet(url, payload);
  }

  return (payload.data as StrapiFAQ[]).map((entry) => ({
    id: text(entry.documentId) || String(entry.id ?? ''),
    question: text(entry.question) || '',
    answer: text(entry.answer) || '',
  }));
}
