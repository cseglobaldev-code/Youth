import {
  cacheGet,
  cacheSet,
  mediaUrl,
  resolveConfig,
  text,
  type StrapiMedia,
  type StrapiRequestOptions,
} from './strapi';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content?: any[];
  coverUrl: string;
  location: string;
  author: string;
  date?: string;
  category?: string;
}

interface StrapiNewsItem {
  id?: unknown;
  documentId?: unknown;
  title?: unknown;
  excerpt?: unknown;
  content?: unknown;
  image?: StrapiMedia | null;
  date?: unknown;
  category?: unknown;
  author?: unknown;
}

interface StrapiNewsResponse {
  data?: unknown;
}

function mapNewsItem(entry: StrapiNewsItem, baseUrl: string): NewsItem {
  return {
    id: text(entry.documentId) || String(entry.id ?? ''),
    title: text(entry.title),
    excerpt: text(entry.excerpt),
    content: Array.isArray(entry.content) ? entry.content : undefined,
    coverUrl: mediaUrl(entry.image, baseUrl),
    location: text(entry.category) || 'Global',
    author: text(entry.author) || 'Y.O.U Alliance',
    date: text(entry.date) || undefined,
    category: text(entry.category) || 'General',
  };
}

export async function fetchNews(options: StrapiRequestOptions = {}): Promise<NewsItem[]> {
  const { baseUrl, token } = resolveConfig(options);
  const isPreview =
    options.bypassCache ||
    (typeof window !== 'undefined' && window.location.search.includes('preview=1'));

  const query = new URLSearchParams();
  query.append('populate[image]', 'true');
  query.append('pagination[pageSize]', '100');
  query.append('pagination[withCount]', 'false');
  query.append('sort[0]', 'date:desc');
  query.append('sort[1]', 'createdAt:desc');
  if (options.locale) query.append('locale', options.locale);
  if (isPreview) query.append('status', 'draft');

  const url = `${baseUrl}/api/news-items?${query.toString()}`;
  let payload = cacheGet(url, isPreview) as StrapiNewsResponse | undefined;

  if (payload === undefined) {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: options.signal,
    });

    if (!response.ok) throw new Error(`Unable to load news (${response.status})`);

    payload = (await response.json()) as StrapiNewsResponse;
    if (!Array.isArray(payload.data)) throw new Error('Invalid news response from CMS');
    cacheSet(url, payload, isPreview);
  }

  return (payload.data as StrapiNewsItem[]).map((entry) => mapNewsItem(entry, baseUrl));
}

export async function fetchNewsById(
  id: string,
  options: StrapiRequestOptions = {}
): Promise<NewsItem | null> {
  const { baseUrl, token } = resolveConfig(options);
  const isPreview =
    options.bypassCache ||
    (typeof window !== 'undefined' && window.location.search.includes('preview=1'));

  const query = new URLSearchParams();
  query.append('populate[image]', 'true');
  if (options.locale) query.append('locale', options.locale);
  if (isPreview) query.append('status', 'draft');

  const url = `${baseUrl}/api/news-items/${encodeURIComponent(id)}?${query.toString()}`;
  let payload = cacheGet(url, isPreview) as { data?: StrapiNewsItem } | undefined;

  if (payload === undefined) {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: options.signal,
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Unable to load news article (${response.status})`);

    payload = (await response.json()) as { data?: StrapiNewsItem };
    cacheSet(url, payload, isPreview);
  }

  if (!payload.data || typeof payload.data !== 'object') return null;

  return mapNewsItem(payload.data, baseUrl);
}