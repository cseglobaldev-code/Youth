import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchProjects, fetchProjectById } from './projects';

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
