import type { Project, SocialLink } from '@/types';
import {
  cacheGet,
  cacheSet,
  mapProject,
  mapSocialLinks,
  resolveConfig,
  text,
  type StrapiProject,
  type StrapiRequestOptions,
  type StrapiSocialLink,
} from './strapi';

export interface ProjectListItem extends Project {
  ledBy?: string;
}

export interface ProjectDetailItem extends Project {
  ledBy?: string;
  memberDescription?: string;
  memberSocialLinks: SocialLink[];
}

interface StrapiProjectMember {
  documentId?: unknown;
  id?: unknown;
  name?: unknown;
  description?: unknown;
  socialLinks?: StrapiSocialLink[] | null;
}

interface StrapiProjectWithMember extends StrapiProject {
  member?: StrapiProjectMember | null;
}

interface StrapiProjectsResponse {
  data?: unknown;
}

interface StrapiProjectDetailResponse {
  data?: unknown;
}

function memberId(entry: StrapiProjectWithMember): string {
  const member = entry.member;
  if (!member) return '';
  return text(member.documentId) || String(member.id ?? '');
}

function mapListItem(entry: StrapiProjectWithMember, baseUrl: string): ProjectListItem {
  return {
    ...mapProject(entry, baseUrl, memberId(entry)),
    ledBy: text(entry.member?.name) || undefined,
  };
}

function mapDetailItem(entry: StrapiProjectWithMember, baseUrl: string): ProjectDetailItem {
  return {
    ...mapProject(entry, baseUrl, memberId(entry)),
    ledBy: text(entry.member?.name) || undefined,
    memberDescription: text(entry.member?.description) || undefined,
    memberSocialLinks: mapSocialLinks(entry.member?.socialLinks),
  };
}

export async function fetchProjects(options: StrapiRequestOptions = {}): Promise<ProjectListItem[]> {
  const { baseUrl, token } = resolveConfig(options);

  const query = new URLSearchParams();
  query.append('populate[outstandingImage]', 'true');
  query.append('populate[member]', 'true');
  query.append('pagination[pageSize]', '100');
  query.append('pagination[withCount]', 'false');
  query.append('sort[0]', 'year:desc');

  const url = `${baseUrl}/api/projects?${query}`;
  let payload = cacheGet(url) as StrapiProjectsResponse | undefined;

  if (payload === undefined) {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: options.signal,
    });

    if (!response.ok) throw new Error(`Unable to load projects (${response.status})`);

    payload = (await response.json()) as StrapiProjectsResponse;
    if (!Array.isArray(payload.data)) throw new Error('Invalid projects response from CMS');
    cacheSet(url, payload);
  }

  return (payload.data as StrapiProjectWithMember[]).map((entry) => mapListItem(entry, baseUrl));
}

export async function fetchProjectById(
  id: string,
  options: StrapiRequestOptions = {}
): Promise<ProjectDetailItem | null> {
  const { baseUrl, token } = resolveConfig(options);

  const query = new URLSearchParams();
  query.append('populate[outstandingImage]', 'true');
  query.append('populate[gallery]', 'true');
  query.append('populate[member][populate][0]', 'socialLinks');

  const url = `${baseUrl}/api/projects/${encodeURIComponent(id)}?${query}`;
  let payload = cacheGet(url) as StrapiProjectDetailResponse | undefined;

  if (payload === undefined) {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: options.signal,
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Unable to load project (${response.status})`);

    payload = (await response.json()) as StrapiProjectDetailResponse;
    cacheSet(url, payload);
  }

  if (!payload.data || typeof payload.data !== 'object') return null;

  return mapDetailItem(payload.data as StrapiProjectWithMember, baseUrl);
}

if (import.meta.vitest) {
  const { afterEach, describe, expect, it, vi } = import.meta.vitest;

  const PROJECT_ENTRY = {
    id: 8,
    documentId: 'project-document-id',
    name: 'Education for All Initiative',
    description: 'Quality education access for youth.',
    impactIndication: 'Reached 2,000+ students',
    region: 'Southeast Asia',
    countriesCovered: '["Vietnam","Cambodia"]',
    focusSdgs: '[4, 10]',
    projectStatus: 'ongoing',
    year: 2022,
    outstandingImage: { url: '/uploads/proj.png' },
    member: {
      id: 15,
      documentId: 'member-document-id',
      name: 'Youth for Education Foundation',
      description: 'A member org.',
      socialLinks: [{ platform: 'facebook', url: 'https://fb.com/yef' }],
    },
  };

  describe('fetchProjects', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('maps Strapi projects with member relation to card shape', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [PROJECT_ENTRY] }) })
      );

      const projects = await fetchProjects({ baseUrl: 'http://localhost:1337/', token: 'read-token' });

      expect(projects).toEqual([
        {
          id: 'project-document-id',
          name: 'Education for All Initiative',
          description: 'Quality education access for youth.',
          impactIndication: 'Reached 2,000+ students',
          region: 'Southeast Asia',
          countriesCovered: ['Vietnam', 'Cambodia'],
          focusSdgs: [4, 10],
          status: 'ongoing',
          outstandingImageUrl: 'http://localhost:1337/uploads/proj.png',
          gallery: [],
          memberId: 'member-document-id',
          year: 2022,
          ledBy: 'Youth for Education Foundation',
        },
      ]);
    });

    it('rejects a failed Strapi response', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
      await expect(fetchProjects({ baseUrl: 'http://err-host:1337' })).rejects.toThrow(
        'Unable to load projects (500)'
      );
    });
  });

  describe('fetchProjectById', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('maps member description + social links on detail', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: PROJECT_ENTRY }) })
      );

      const project = await fetchProjectById('project-document-id', {
        baseUrl: 'http://localhost:1337',
        token: 'read-token',
      });

      expect(project).toMatchObject({
        id: 'project-document-id',
        ledBy: 'Youth for Education Foundation',
        memberDescription: 'A member org.',
        memberSocialLinks: [{ platform: 'facebook', url: 'https://fb.com/yef' }],
      });
    });

    it('returns null on 404', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 404, ok: false }));
      await expect(
        fetchProjectById('missing', { baseUrl: 'http://localhost:1337' })
      ).resolves.toBeNull();
    });
  });
}
