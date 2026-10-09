import { afterEach, describe, expect, it, vi } from 'vitest';
import type { RegisterOrganizationFormValues } from '@/components/modals/RegisterOrganizationModal';
import { submitOrganizationApplication } from './applications';
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
});
