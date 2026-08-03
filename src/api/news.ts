import {
  cacheGet,
  cacheSet,
  mapImage,
  resolveConfig,
  text,
  type StrapiRequestOptions,
} from './strapi';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  location: string;
  author: string;
  period?: string;
}

interface StrapiNewsItem {
  id?: unknown;
  documentId?: unknown;
  title?: unknown;
  excerpt?: unknown;
  image?: unknown;
  date?: unknown;
  category?: unknown;
}

interface StrapiNewsResponse {
  data?: unknown;
}

export async function fetchNews(options: StrapiRequestOptions = {}): Promise<NewsItem[]> {
  const { baseUrl, token } = resolveConfig(options);

  const query = new URLSearchParams();
  query.append('populate[image]', 'true');
  query.append('pagination[pageSize]', '100');
  query.append('pagination[withCount]', 'false');
  query.append('sort[0]', 'date:desc');

  const url = `${baseUrl}/api/news-items?${query}`;
  let payload = cacheGet(url) as StrapiNewsResponse | undefined;

  if (payload === undefined) {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: options.signal,
    });

    if (!response.ok) throw new Error(`Unable to load news (${response.status})`);

    payload = (await response.json()) as StrapiNewsResponse;
    if (!Array.isArray(payload.data)) throw new Error('Invalid news response from CMS');
    cacheSet(url, payload);
  }

  return (payload.data as StrapiNewsItem[]).map((entry) => ({
    id: text(entry.documentId) || String(entry.id ?? ''),
    title: text(entry.title) || '',
    description: text(entry.excerpt) || '',
    coverUrl: mapImage(entry.image, baseUrl),
    location: text(entry.category) || 'Global',
    author: 'Y.O.U Alliance',
    period: entry.date ? new Date(entry.date as string).getFullYear().toString() : undefined,
  }));
}
