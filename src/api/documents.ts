import type { ArchiveVersion, DocumentItem } from '@/types/document';
import {
  mediaUrl,
  resolveConfig,
  text,
  type StrapiMedia,
  type StrapiRequestOptions,
} from './strapi';
import { safeDocumentUrl } from '@/lib/utils/documentLinks';

function mapDocument(
  entry: Record<string, any>,
  baseUrl: string,
): DocumentItem | null {
  if (!text(entry.title) || !text(entry.category)) return null;
  const media = (value: StrapiMedia) =>
    safeDocumentUrl(mediaUrl(value, baseUrl));
  return {
    id: text(entry.documentId) || String(entry.id ?? ''),
    title: entry.title,
    category: entry.category,
    fileType: ['pdf', 'xls', 'doc', 'ppt'].includes(entry.fileType)
      ? entry.fileType
      : 'pdf',
    fileUrl: media(entry.file),
    fileSize: text(entry.fileSize) || undefined,
    updatedAt: text(entry.updatedAt) || undefined,
    revision: text(entry.revision) || undefined,
    slug: text(entry.slug) || undefined,
    section: text(entry.section) || undefined,
    continent: entry.continent,
    effectiveDate: text(entry.effectiveDate) || undefined,
    displayMode: entry.displayMode,
    externalUrl: safeDocumentUrl(entry.externalUrl),
    embedUrl: safeDocumentUrl(entry.embedUrl),
    content: Array.isArray(entry.content) ? entry.content : [],
    coverImageUrl: media(entry.coverImage),
    displayOrder: Number(entry.displayOrder) || 0,
    slideImages: Array.isArray(entry.slideImages)
      ? entry.slideImages
          .map((item: StrapiMedia) => ({
            url: media(item),
            alt: text(item.alternativeText),
          }))
          .filter((item: { url: string }) => item.url)
      : [],
    archives: Array.isArray(entry.archives)
      ? entry.archives
          .map((item: ArchiveVersion) => ({
            ...item,
            url: safeDocumentUrl(item.url),
            embedUrl: safeDocumentUrl(item.embedUrl),
          }))
          .filter((item: ArchiveVersion) => item.url)
      : [],
  };
}

function populate(query: URLSearchParams) {
  ['file', 'coverImage', 'slideImages', 'archives'].forEach((field, i) =>
    query.set(`populate[${i}]`, field),
  );
  query.set('status', 'published');
}

export async function fetchDocuments(
  options: StrapiRequestOptions = {},
): Promise<DocumentItem[]> {
  const { baseUrl, token } = resolveConfig(options);
  const documents: DocumentItem[] = [];
  let totalPages = 1;
  for (let page = 1; page <= totalPages; page++) {
    const query = new URLSearchParams({
      'pagination[pageSize]': '100',
      'pagination[page]': String(page),
      'sort[0]': 'displayOrder:asc',
      'sort[1]': 'title:asc',
      'filters[category][$ne]': 'legal',
    });
    populate(query);
    [
      'title',
      'category',
      'slug',
      'section',
      'continent',
      'revision',
      'effectiveDate',
      'displayMode',
      'externalUrl',
      'embedUrl',
      'fileType',
      'fileSize',
      'updatedAt',
      'displayOrder',
    ].forEach((field, i) => query.set(`fields[${i}]`, field));
    const response = await fetch(`${baseUrl}/api/policy-documents?${query}`, {
      cache: 'no-store',
      signal: options.signal,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!response.ok)
      throw new Error(`Unable to load documents (${response.status})`);
    const payload: any = await response.json();
    if (!Array.isArray(payload.data))
      throw new Error('Invalid documents response from CMS');
    totalPages = Number(payload.meta?.pagination?.pageCount) || 1;
    documents.push(
      ...payload.data
        .map((entry: Record<string, any>) => mapDocument(entry, baseUrl))
        .filter(Boolean),
    );
  }
  return [...new Map(documents.map((doc) => [doc.id, doc])).values()];
}

export async function fetchDocument(
  slugOrId: string,
  options: StrapiRequestOptions = {},
): Promise<DocumentItem | null> {
  const { baseUrl, token } = resolveConfig(options);
  const query = new URLSearchParams({
    'filters[$or][0][slug][$eq]': slugOrId,
    'filters[$or][1][documentId][$eq]': slugOrId,
    'pagination[pageSize]': '1',
  });
  populate(query);
  const response = await fetch(`${baseUrl}/api/policy-documents?${query}`, {
    cache: 'no-store',
    signal: options.signal,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!response.ok)
    throw new Error(`Unable to load document (${response.status})`);
  const payload: any = await response.json();
  if (!Array.isArray(payload.data))
    throw new Error('Invalid document response from CMS');
  return payload.data[0] ? mapDocument(payload.data[0], baseUrl) : null;
}
