import { afterEach, describe, expect, it, vi } from 'vitest';
import type { RegisterOrganizationFormValues } from '@/components/modals/RegisterOrganizationModal';
import { submitLeadershipApplication, submitOrganizationApplication } from './applications';
import type { ApplyRoleFormValues } from '@/components/modals/ApplyRoleModal';
import dayjs from 'dayjs';
import { cmsRequestBody } from '../../functions/lib/cms';

const values: RegisterOrganizationFormValues = {
  organizationName: 'Test Organization', organizationDescription: 'Organization description',
  representativeFullName: 'Organization Head', representativeEmail: 'head@example.com',
  representativePhone: '2025550101', representativePhoneCode: '+1', isPrimaryContact: 'no',
  contactPersonFullName: 'Contact Person', contactPersonEmail: 'contact@example.com',
  contactPersonPhone: '901234567', contactPersonPhoneCode: '+84',
  yearOfEstablishment: 2021, country: 'Vietnam', address: 'Test address', email: 'org@example.com',
  focusArea: 'Education', focusSdgs: [4], projectName: 'Test Project',
  projectOrganizationName: 'Test Organization', projectDescription: 'Project description',
  projectLedBy: 'Project Lead', socialImpactMetrics: '100 participants', region: 'Southeast Asia',
  countriesCovered: 'Vietnam', projectFocusSdgs: [4], projectStatus: 'ongoing',
  projectSocialProfile: 'https://example.com/project',
};

describe('organization contact submission', () => {
  afterEach(() => vi.unstubAllGlobals());

  async function submitAndForward(input: RegisterOrganizationFormValues) {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    await submitOrganizationApplication(input, { baseUrl: 'https://example.com' });
    const [url, options] = fetchMock.mock.calls[0];
    const body = await cmsRequestBody(new Request(url, options), '/api/organization-applications');
    return JSON.parse(await new Response(body).text()).data;
  }

  it('retains a separate contact through serialization and the proxy', async () => {
    const data = await submitAndForward(values);
    expect(data).toMatchObject({
      representativeFullName: 'Organization Head', representativeEmail: 'head@example.com',
      isPrimaryContact: 'no', contactPersonFullName: 'Contact Person',
      contactPersonEmail: 'contact@example.com', contactPersonPhone: '901234567',
      contactPersonPhoneCode: '+84',
    });
  });

  it('uses the head as contact when Yes is selected, ignoring stale separate-contact data', async () => {
    const data = await submitAndForward({ ...values, isPrimaryContact: 'yes' });
    expect(data).toMatchObject({
      isPrimaryContact: 'yes', contactPersonFullName: 'Organization Head',
      contactPersonEmail: 'head@example.com', contactPersonPhone: '2025550101',
      contactPersonPhoneCode: '+1',
    });
  });

  it('matches Strapi\'s head phone-code default when no country code was selected', async () => {
    const data = await submitAndForward({ ...values, isPrimaryContact: 'yes', representativePhoneCode: undefined });
    expect(data.contactPersonPhoneCode).toBe('+84');
  });

  it('stores social profiles and keeps activity photos separate from the cover', async () => {
    let uploadId = 0;
    const fetchMock = vi.fn().mockImplementation(async (url) => new Response(
      JSON.stringify(String(url).endsWith('/upload') ? [{ id: ++uploadId }] : {}), { status: 201 }
    ));
    vi.stubGlobal('fetch', fetchMock);
    await submitOrganizationApplication({ ...values,
      facebookUrl: 'https://facebook.com/test', instagramUrl: 'https://instagram.com/test',
      linkedinUrl: 'https://linkedin.com/company/test',
      organizationCardCover: [new File(['cover'], 'cover.jpg')],
      organizationActivityPhotos: [new File(['activity'], 'activity.jpg')],
    }, { baseUrl: 'https://example.com' });
    const data = JSON.parse(fetchMock.mock.calls.at(-1)![1].body).data;
    expect(data).toMatchObject({ organizationImage: [1], organizationActivityPhotos: [2],
      facebookUrl: 'https://facebook.com/test', instagramUrl: 'https://instagram.com/test',
      linkedinUrl: 'https://linkedin.com/company/test' });
  });

  it('does not submit a partial application when an upload fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('Upload unavailable', { status: 500 }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(submitOrganizationApplication({ ...values,
      organizationActivityPhotos: [new File(['photo'], 'photo.jpg')],
    }, { baseUrl: 'https://example.com' })).rejects.toThrow('File upload failed');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/upload$/);
  });

  it('submits Position, all assessment answers and every document relation', async () => {
    let uploadId = 0;
    const fetchMock = vi.fn().mockImplementation(async (url) => new Response(
      JSON.stringify(String(url).endsWith('/upload') ? [{ id: ++uploadId }] : {}), { status: 201 }
    ));
    vi.stubGlobal('fetch', fetchMock);
    const file = [{ uid: 'doc', name: 'test.pdf', originFileObj: Object.assign(
      new File(['test'], 'test.pdf'), { uid: 'doc', lastModifiedDate: new Date() }
    ) }];
    const assessment = { orgName: 'Org', majorAchievements: 'Achievement', motivation: 'Motivation',
      contributionToYou: 'Vision', commitHours: true, declarationAgreed: true, declarationSignature: 'Applicant' };
    await submitLeadershipApplication({
      position: 'Continental Director', fullName: 'Applicant', sex: 'male', dateOfBirth: dayjs('2000-01-01'),
      nationality: 'Vietnam', countryOfResidence: 'Vietnam', cityTown: 'Hanoi', email: 'test@example.com',
      whatsappNumber: '+84901234567', continent: 'Asia', region: 'Southeast Asia', assessment,
      profilePhoto: file, resumeCv: file, orgProfileDoc: file, leadershipProofDoc: file, additionalDocs: file,
    } as ApplyRoleFormValues, { baseUrl: 'https://example.com' });
    const [url, options] = fetchMock.mock.calls.at(-1)!;
    const body = await cmsRequestBody(new Request(url, options), '/api/leadership-applications');
    const data = JSON.parse(await new Response(body).text()).data;
    expect(data).toMatchObject({ position: 'Continental Director',
      assessment: { ...assessment, appliedPosition: 'Continental Director' },
      profilePhoto: 1, resumeCv: [2], orgProfileDoc: [3], leadershipProofDoc: [4], additionalDocs: [5] });
  });
});
