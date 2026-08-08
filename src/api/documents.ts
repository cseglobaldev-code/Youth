import type { DocumentItem } from '@/types';
import {
  cacheGet,
  cacheSet,
  mediaUrl,
  resolveConfig,
  text,
  type StrapiMedia,
  type StrapiRequestOptions,
} from './strapi';

interface StrapiPolicyDocument {
  id?: unknown;
  documentId?: unknown;
  title?: unknown;
  category?: unknown;
  fileType?: unknown;
  file?: StrapiMedia | null;
  fileSize?: unknown;
}

interface StrapiPolicyDocumentsResponse {
  data?: unknown;
}

function mapPolicyDocument(entry: StrapiPolicyDocument, baseUrl: string): DocumentItem | null {
  const title = text(entry.title);
  const category = text(entry.category);
  const fileType = text(entry.fileType);
  const fileUrl = mediaUrl(entry.file, baseUrl);

  if (!title || !category || !fileType || !fileUrl) return null;

  return {
    id: text(entry.documentId) || String(entry.id ?? ''),
    title,
    category: category as 'governance' | 'membership' | 'annual-reports',
    fileType: fileType as 'pdf' | 'xls' | 'doc' | 'ppt',
    fileUrl,
    fileSize: text(entry.fileSize) || undefined,
    updatedAt: new Date().toISOString().split('T')[0],
  };
}

export async function fetchDocuments(options: StrapiRequestOptions = {}): Promise<DocumentItem[]> {
  const { baseUrl, token } = resolveConfig(options);
  const query = new URLSearchParams();
  query.append('populate[0]', 'file');
  query.append('pagination[pageSize]', '100');
  query.append('sort[0]', 'updatedAt:desc');

  const url = `${baseUrl}/api/policy-documents?${query}`;
  let payload = cacheGet(url) as StrapiPolicyDocumentsResponse | undefined;

  if (payload === undefined) {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: options.signal,
    });
    if (!response.ok) throw new Error(`Unable to load documents (${response.status})`);

    payload = (await response.json()) as StrapiPolicyDocumentsResponse;
    if (!Array.isArray(payload.data)) {
      throw new Error('Invalid documents response from CMS');
    }
    cacheSet(url, payload);
  }

  return (payload.data as StrapiPolicyDocument[])
    .map((entry) => mapPolicyDocument(entry, baseUrl))
    .filter((doc): doc is DocumentItem => doc !== null);
}
