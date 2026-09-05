import type { Project, ProjectStatus, SocialLink } from '@/types';

// ── Config resolution ──────────────────────────────────────────────────────
export interface StrapiRequestOptions {
  baseUrl?: string;
  token?: string;
  signal?: AbortSignal;
  bypassCache?: boolean;
}

export function resolveConfig(options: StrapiRequestOptions): { baseUrl: string; token?: string } {
  const configuredBaseUrl = import.meta.env.VITE_STRAPI_API_URL || undefined;
  const fallbackBaseUrl = typeof window === 'undefined' ? '' : window.location.origin;
  const baseUrl = (options.baseUrl ?? configuredBaseUrl ?? fallbackBaseUrl).replace(/\/$/, '');
  const token = options.token;
  if (!baseUrl) throw new Error('VITE_STRAPI_API_URL is not configured');
  return { baseUrl, token };
}

// ── In-memory TTL cache ────────────────────────────────────────────────────
const CACHE_TTL_MS = 5 * 60 * 1000;
const responseCache = new Map<string, { at: number; data: unknown }>();

export function clearCache(): void {
  responseCache.clear();
}

export function cacheGet(url: string, bypassCache = false): unknown | undefined {
  if (bypassCache) return undefined;
  const hit = responseCache.get(url);
  return hit && Date.now() - hit.at < CACHE_TTL_MS ? hit.data : undefined;
}

export function cacheSet(url: string, data: unknown, skipCache = false): void {
  if (skipCache) return;
  responseCache.set(url, { at: Date.now(), data });
}

// ── Primitive parsers ──────────────────────────────────────────────────────
export function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function mediaUrl(media: StrapiMedia | null | undefined, baseUrl: string): string {
  const url = text(media?.url);
  if (!url || /^https?:\/\//i.test(url)) return url;
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

export function parseSdgIds(value: unknown): number[] {
  const values = Array.isArray(value) ? value : text(value).match(/\d+/g) ?? [];
  return [...new Set(values.map(Number).filter((id) => Number.isInteger(id) && id >= 1 && id <= 17))];
}

export function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  const str = text(value).trim();
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // If not JSON array, fall back to comma-separated splitting
  }
  return str.split(',').map((s) => s.trim()).filter(Boolean);
}

const VALID_PROJECT_STATUSES = new Set<ProjectStatus>(['ongoing', 'completed', 'planned']);

export function toProjectStatus(value: string): ProjectStatus {
  return VALID_PROJECT_STATUSES.has(value as ProjectStatus) ? (value as ProjectStatus) : 'ongoing';
}

// ── Shared Strapi shapes ───────────────────────────────────────────────────
export interface StrapiMedia {
  url?: unknown;
  alternativeText?: unknown;
}

export interface StrapiSocialLink {
  platform?: unknown;
  url?: unknown;
}

const VALID_SOCIAL_PLATFORMS = new Set([
  'youtube',
  'facebook',
  'twitter',
  'instagram',
  'linkedin',
  'tiktok',
]);

export function mapSocialLinks(value: StrapiSocialLink[] | null | undefined): SocialLink[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((link) => VALID_SOCIAL_PLATFORMS.has(text(link.platform)))
    .map((link) => {
      let url = text(link.url).trim();
      if (url && !/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      return {
        platform: text(link.platform) as SocialLink['platform'],
        url,
      };
    })
    .filter((link) => /^https?:\/\//i.test(link.url));
}

export interface StrapiProject {
  id?: unknown;
  documentId?: unknown;
  name?: unknown;
  description?: unknown;
  impactIndication?: unknown;
  region?: unknown;
  countriesCovered?: unknown;
  focusSdgs?: unknown;
  projectStatus?: unknown;
  outstandingImage?: StrapiMedia | null;
  gallery?: StrapiMedia[] | null;
  year?: unknown;
}

export function mapProject(project: StrapiProject, baseUrl: string, memberId: string = ''): Project {
  const gallery = Array.isArray(project.gallery)
    ? project.gallery
        .map((img, idx) => ({
          id: `project-gallery-${idx}`,
          src: mediaUrl(img, baseUrl),
          alt: text(img.alternativeText) || text(project.name),
        }))
        .filter((item) => Boolean(item.src))
    : [];

  return {
    id: text(project.documentId) || String(project.id ?? ''),
    name: text(project.name),
    description: text(project.description),
    impactIndication: text(project.impactIndication),
    region: text(project.region),
    countriesCovered: parseStringArray(project.countriesCovered),
    focusSdgs: parseSdgIds(project.focusSdgs),
    status: toProjectStatus(text(project.projectStatus)),
    outstandingImageUrl: mediaUrl(project.outstandingImage, baseUrl),
    gallery,
    memberId,
    year: typeof project.year === 'number' ? project.year : undefined,
  };
}