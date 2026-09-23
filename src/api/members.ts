import type { SocialLink, Project } from '@/types';
import type { MemberPerson } from '@/types';
import {
  cacheGet,
  cacheSet,
  mapProject,
  mapSocialLinks,
  mediaUrl,
  parseSdgIds,
  resolveConfig,
  text,
  type StrapiMedia,
  type StrapiProject,
  type StrapiRequestOptions,
  type StrapiSocialLink,
} from './strapi';

export interface MemberListItem {
  id: string;
  name: string;
  country: string;
  period?: string;
  representative?: MemberPerson;
  contactPerson?: MemberPerson;
  focusSdgs: number[];
  coverUrl?: string;
  logoUrl: string;
  createdAt?: string;
}

export interface MemberDetailItem extends MemberListItem {
  shortDescription: string;
  description: string;
  continent: string;
  socialLinks: SocialLink[];
  gallery: { id: string; src: string; alt: string }[];
  donationQrUrl?: string;
  projects: Project[];
}

interface StrapiMember {
  id?: unknown;
  documentId?: unknown;
  name?: unknown;
  country?: unknown;
  period?: unknown;
  representative?: unknown;
  contactPerson?: unknown;
  focusSdgs?: unknown;
  cover?: StrapiMedia | null;
  logo?: StrapiMedia | null;
  createdAt?: unknown;
}

interface StrapiMemberDetail extends StrapiMember {
  shortDescription?: unknown;
  description?: unknown;
  continent?: unknown;
  socialLinks?: StrapiSocialLink[] | null;
  gallery?: StrapiMedia[] | null;
  donationQr?: StrapiMedia | null;
  projects?: StrapiProject[] | null;
}

interface StrapiMembersResponse {
  data?: unknown;
}

interface StrapiMemberDetailResponse {
  data?: unknown;
}

export function mapMemberPerson(value: unknown): MemberPerson | undefined {
  const raw = value && typeof value === 'object' && 'data' in value
    ? (value as { data?: unknown }).data
    : value;
  const entry = Array.isArray(raw) ? raw[0] : raw;
  if (!entry || typeof entry !== 'object') return undefined;

  const person = entry as Record<string, unknown>;
  const phoneNumber = text(person.phoneNumber) || text(person.phone);
  const phoneCountryCode = text(person.phoneCountryCode);
  const phone = phoneNumber
    ? phoneCountryCode && !phoneNumber.startsWith('+')
      ? `${phoneCountryCode} ${phoneNumber}`
      : phoneNumber
    : undefined;
  const mapped: MemberPerson = {
    prefix: text(person.prefix) || undefined,
    fullName: text(person.fullName) || text(person.name) || undefined,
    title: text(person.title) || undefined,
    email: text(person.email) || undefined,
    phone,
    phoneCountryCode: phoneCountryCode || undefined,
  };

  return Object.values(mapped).some(Boolean) ? mapped : undefined;
}

function mapMember(entry: StrapiMember, baseUrl: string): MemberListItem {
  return {
    id: text(entry.documentId) || String(entry.id ?? ''),
    name: text(entry.name),
    country: text(entry.country),
    period: text(entry.period) || undefined,
    representative: mapMemberPerson(entry.representative),
    contactPerson: mapMemberPerson(entry.contactPerson),
    focusSdgs: parseSdgIds(entry.focusSdgs),
    coverUrl: mediaUrl(entry.cover, baseUrl) || undefined,
    logoUrl: mediaUrl(entry.logo, baseUrl),
    createdAt: text(entry.createdAt) || undefined,
  };
}

function mapGallery(value: StrapiMedia[] | null | undefined, baseUrl: string) {
  if (!Array.isArray(value)) return [];
  return value.map((media, index) => ({
    id: `gallery-${index}`,
    src: mediaUrl(media, baseUrl),
    alt: '',
  }));
}

function mapMemberDetail(entry: StrapiMemberDetail, baseUrl: string): MemberDetailItem {
  const base = mapMember(entry, baseUrl);
  return {
    ...base,
    shortDescription: text(entry.shortDescription),
    description: text(entry.description),
    continent: text(entry.continent),
    socialLinks: mapSocialLinks(entry.socialLinks),
    gallery: mapGallery(entry.gallery, baseUrl),
    donationQrUrl: mediaUrl(entry.donationQr, baseUrl) || undefined,
    projects: Array.isArray(entry.projects)
      ? entry.projects.map((project) => mapProject(project, baseUrl, base.id))
      : [],
  };
}

export async function fetchMembers(options: StrapiRequestOptions = {}): Promise<MemberListItem[]> {
  const { baseUrl, token } = resolveConfig(options);
  const isPreview =
    options.bypassCache ||
    (typeof window !== 'undefined' && window.location.search.includes('preview=1'));

  const query = new URLSearchParams();
  query.append('populate[cover]', 'true');
  query.append('populate[logo]', 'true');
  query.append('populate[representative]', '*');
  query.append('populate[contactPerson]', '*');
  query.append('pagination[pageSize]', '100');
  query.append('pagination[withCount]', 'false');
  query.append('sort[0]', 'createdAt:desc');
  if (isPreview) query.append('status', 'draft');

  const url = `${baseUrl}/api/members?${query}`;
  let payload = cacheGet(url, isPreview) as StrapiMembersResponse | undefined;

  if (payload === undefined) {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: options.signal,
    });

    if (!response.ok) throw new Error(`Unable to load members (${response.status})`);

    payload = (await response.json()) as StrapiMembersResponse;
    if (!Array.isArray(payload.data)) throw new Error('Invalid members response from CMS');
    cacheSet(url, payload, isPreview);
  }

  return (payload.data as StrapiMember[]).map((entry) => mapMember(entry, baseUrl));
}

export async function fetchMemberById(
  id: string,
  options: StrapiRequestOptions = {}
): Promise<MemberDetailItem | null> {
  const { baseUrl, token } = resolveConfig(options);
  const isPreview =
    options.bypassCache ||
    (typeof window !== 'undefined' && window.location.search.includes('preview=1'));

  const query = new URLSearchParams();
  query.append('populate[cover]', 'true');
  query.append('populate[logo]', 'true');
  query.append('populate[gallery]', 'true');
  query.append('populate[socialLinks]', 'true');
  query.append('populate[donationQr]', 'true');
  query.append('populate[representative]', '*');
  query.append('populate[contactPerson]', '*');
  query.append('populate[projects][populate][0]', 'outstandingImage');
  if (isPreview) query.append('status', 'draft');

  const url = `${baseUrl}/api/members/${encodeURIComponent(id)}?${query}`;
  let payload = cacheGet(url, isPreview) as StrapiMemberDetailResponse | undefined;

  if (payload === undefined) {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: options.signal,
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Unable to load member (${response.status})`);

    payload = (await response.json()) as StrapiMemberDetailResponse;
    cacheSet(url, payload, isPreview);
  }

  if (!payload.data || typeof payload.data !== 'object') return null;

  return mapMemberDetail(payload.data as StrapiMemberDetail, baseUrl);
}

if (import.meta.vitest) {
  const { afterEach, describe, expect, it, vi } = import.meta.vitest;

  describe('fetchMembers', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('maps member contacts from Strapi', async () => {
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
              representative: { prefix: 'Ms', fullName: 'Maria Santos', title: 'CEO' },
              contactPerson: {
                prefix: 'Mr',
                fullName: 'John Doe',
                title: 'Coordinator',
                email: 'john@example.com',
                phoneCountryCode: '+1',
                phoneNumber: '23456789',
              },
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
        'http://localhost:1337/api/members?populate%5Bcover%5D=true&populate%5Blogo%5D=true&populate%5Brepresentative%5D=*&populate%5BcontactPerson%5D=*&pagination%5BpageSize%5D=100&pagination%5BwithCount%5D=false&sort%5B0%5D=createdAt%3Adesc',
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
          representative: {
            prefix: 'Ms',
            fullName: 'Maria Santos',
            title: 'CEO',
            email: undefined,
            phone: undefined,
            phoneCountryCode: undefined,
          },
          contactPerson: {
            prefix: 'Mr',
            fullName: 'John Doe',
            title: 'Coordinator',
            email: 'john@example.com',
            phone: '+1 23456789',
            phoneCountryCode: '+1',
          },
          focusSdgs: [1, 4, 8],
          coverUrl: 'http://localhost:1337/uploads/cover.png',
          logoUrl: 'https://res.cloudinary.com/demo/logo.png',
          createdAt: '2026-07-19T10:00:00.000Z',
        },
      ]);
    });

    it('rejects a failed Strapi response', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));

      await expect(fetchMembers({ baseUrl: 'http://other-host:1337' })).rejects.toThrow(
        'Unable to load members (403)'
      );
    });
  });
}
