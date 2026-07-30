import type { TeamMember, Continent, RegionGroup } from '@/types';
import {
  cacheGet,
  cacheSet,
  mapSocialLinks,
  mediaUrl,
  parseSdgIds,
  resolveConfig,
  text,
  type StrapiMedia,
  type StrapiRequestOptions,
  type StrapiSocialLink,
} from './strapi';

export interface LeadershipRoster {
  executives: TeamMember[];
  directors: TeamMember[];
}

interface StrapiTeamMember {
  id?: unknown;
  documentId?: unknown;
  name?: unknown;
  role?: unknown;
  leadershipType?: unknown;
  displayOrder?: unknown;
  avatar?: StrapiMedia | null;
  continent?: unknown;
  regionGroup?: unknown;
  bio?: unknown;
  focusSdgs?: unknown;
  year?: unknown;
  activityImages?: StrapiMedia[] | null;
  socialLinks?: StrapiSocialLink[] | null;
}

interface StrapiTeamMembersResponse {
  data?: unknown;
}

const VALID_CONTINENTS = new Set<Continent>(['Asia', 'Africa', 'America', 'Australia', 'Europe']);
const VALID_REGIONS = new Set<RegionGroup>([
  'East Asia',
  'Southeast Asia',
  'South Asia',
  'Central Asia',
  'West Asia',
  'North Asia',
  'Africa',
  'America',
  'Australia',
  'Europe',
]);

function parseBio(value: unknown): string[] {
  return text(value)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function mapActivityImages(value: StrapiMedia[] | null | undefined, baseUrl: string): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((media) => mediaUrl(media, baseUrl)).filter(Boolean);
}

interface MappedTeamMember {
  member: TeamMember;
  leadershipType: 'executive' | 'continental-director';
  displayOrder: number;
}

function mapTeamMember(entry: StrapiTeamMember, baseUrl: string): MappedTeamMember | null {
  const leadershipType = text(entry.leadershipType);
  if (leadershipType !== 'executive' && leadershipType !== 'continental-director') return null;

  const continent = text(entry.continent);
  if (!VALID_CONTINENTS.has(continent as Continent)) return null;

  const regionGroup = text(entry.regionGroup);
  const numericOrder = typeof entry.displayOrder === 'number' ? entry.displayOrder : Number(entry.displayOrder);

  return {
    leadershipType,
    displayOrder: Number.isFinite(numericOrder) ? numericOrder : 0,
    member: {
      id: text(entry.documentId) || String(entry.id ?? ''),
      name: text(entry.name),
      role: text(entry.role),
      avatarUrl: mediaUrl(entry.avatar, baseUrl),
      continent: continent as Continent,
      ...(VALID_REGIONS.has(regionGroup as RegionGroup) ? { regionGroup: regionGroup as RegionGroup } : {}),
      socialLinks: mapSocialLinks(entry.socialLinks),
      bio: parseBio(entry.bio),
      focusSdgs: parseSdgIds(entry.focusSdgs),
      year: text(entry.year) || undefined,
      activityImages: mapActivityImages(entry.activityImages, baseUrl),
    },
  };
}

export async function fetchLeadership(options: StrapiRequestOptions = {}): Promise<LeadershipRoster> {
  const { baseUrl, token } = resolveConfig(options);
  const query = new URLSearchParams();
  query.append('populate[0]', 'avatar');
  query.append('populate[1]', 'socialLinks');
  query.append('populate[2]', 'activityImages');
  query.append('pagination[pageSize]', '100');
  query.append('pagination[withCount]', 'false');
  query.append('sort[0]', 'displayOrder:asc');

  const url = `${baseUrl}/api/team-members?${query}`;
  let payload = cacheGet(url) as StrapiTeamMembersResponse | undefined;

  if (payload === undefined) {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: options.signal,
    });
    if (!response.ok) throw new Error(`Unable to load leadership (${response.status})`);
    payload = (await response.json()) as StrapiTeamMembersResponse;
    if (!Array.isArray(payload.data)) throw new Error('Invalid leadership response from CMS');
    cacheSet(url, payload);
  }

  const members = (payload.data as StrapiTeamMember[])
    .map((entry) => mapTeamMember(entry, baseUrl))
    .filter((member): member is MappedTeamMember => member !== null)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return {
    executives: members
      .filter((entry) => entry.leadershipType === 'executive')
      .map((entry) => entry.member),
    directors: members
      .filter((entry) => entry.leadershipType === 'continental-director')
      .map((entry) => entry.member),
  };
}

if (import.meta.vitest) {
  const { afterEach, describe, expect, it, vi } = import.meta.vitest;

  describe('fetchLeadership', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('maps media, paragraphs, numeric SDGs, and splits leadership groups', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: [
            {
              id: 1,
              documentId: 'exec-doc',
              name: 'Minh Anh Nguyen',
              role: 'President & Chair',
              leadershipType: 'executive',
              displayOrder: 1,
              avatar: { url: '/uploads/exec.png' },
              continent: 'Asia',
              bio: 'First paragraph.\n\nSecond paragraph.',
              focusSdgs: '[4, 17]',
              year: '2020 - 2026',
              activityImages: [{ url: '/uploads/activity.png' }],
              socialLinks: [{ platform: 'linkedin', url: 'https://linkedin.com/example' }],
            },
            {
              id: 2,
              documentId: 'director-doc',
              name: 'Sophie Martin',
              role: 'Continental Director',
              leadershipType: 'continental-director',
              displayOrder: 2,
              avatar: { url: 'https://cdn.example/avatar.png' },
              continent: 'Europe',
              regionGroup: 'Europe',
              focusSdgs: ['5'],
            },
          ],
        }),
      }));

      const roster = await fetchLeadership({ baseUrl: 'http://localhost:1337', token: 'read-token' });

      expect(roster.executives).toHaveLength(1);
      expect(roster.executives[0]).toMatchObject({
        id: 'exec-doc',
        avatarUrl: 'http://localhost:1337/uploads/exec.png',
        bio: ['First paragraph.', 'Second paragraph.'],
        focusSdgs: [4, 17],
        activityImages: ['http://localhost:1337/uploads/activity.png'],
      });
      expect(roster.directors[0]).toMatchObject({ id: 'director-doc', regionGroup: 'Europe' });
    });

    it('rejects failed CMS responses', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));
      await expect(fetchLeadership({ baseUrl: 'http://other-host:1337' })).rejects.toThrow(
        'Unable to load leadership (403)'
      );
    });
  });
}
