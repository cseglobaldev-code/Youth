import type { ApplyRoleFormValues } from '@/components/modals/ApplyRoleModal';
import type { RegisterOrganizationFormValues } from '@/components/modals/RegisterOrganizationModal';
import type { SupportFormValues } from '@/components/modals/SupportModal';
import { resolveConfig, type StrapiRequestOptions } from './strapi';

/**
 * Trích xuất các đối tượng native File từ Ant Design Upload component
 */
function extractRawFiles(files: any): File[] {
  if (!Array.isArray(files)) return [];
  return files
    .map((f: any) => (f?.originFileObj instanceof File ? f.originFileObj : f instanceof File ? f : null))
    .filter((f): f is File => f !== null);
}

/**
 * Helper tải file lên /api/upload và nhận về danh sách ID
 */
async function uploadAntdFiles(
  files: any,
  baseUrl: string,
  token?: string,
  signal?: AbortSignal
): Promise<number[]> {
  const rawFiles = extractRawFiles(files);
  if (rawFiles.length === 0) return [];

  const formData = new FormData();
  for (const file of rawFiles) {
    formData.append('files', file, file.name);
  }

  try {
    const response = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
      signal,
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.warn(`File upload returned status ${response.status}:`, errorDetail);
      return [];
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data
        .map((item: any) => item.id)
        .filter((id: any): id is number => typeof id === 'number');
    }
  } catch (error) {
    console.error('Failed to upload files to Strapi:', error);
  }

  return [];
}

/**
 * 1. Gửi form ứng tuyển Lãnh đạo (Upload tuần tự)
 */
export async function submitLeadershipApplication(
  values: ApplyRoleFormValues,
  options: StrapiRequestOptions = {}
): Promise<void> {
  const { baseUrl, token } = resolveConfig(options);

  // Upload file tuần tự để tránh nghẽn SQLite Database
  const profilePhotoIds = await uploadAntdFiles(values.profilePhoto, baseUrl, token, options.signal);
  const activityPhotoIds = await uploadAntdFiles(values.activityPhotos, baseUrl, token, options.signal);
  const resumeCvIds = await uploadAntdFiles(values.resumeCv, baseUrl, token, options.signal);

  const payload = {
    data: {
      fullName: values.fullName,
      sex: values.sex,
      sexOther: values.sexOther || undefined,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
      nationality: values.nationality,
      countryOfResidence: values.countryOfResidence,
      cityTown: values.cityTown,
      email: values.email,
      whatsappNumber: values.whatsappNumber,
      facebookUrl: values.facebookUrl || undefined,
      instagramUrl: values.instagramUrl || undefined,
      linkedinUrl: values.linkedinUrl || undefined,
      portfolio: values.portfolio || undefined,
      continent: values.continent,
      region: values.region,
      assessment: values.assessment,
      ...(profilePhotoIds.length > 0 ? { profilePhoto: profilePhotoIds[0] } : {}),
      ...(activityPhotoIds.length > 0 ? { activityPhotos: activityPhotoIds } : {}),
      ...(resumeCvIds.length > 0 ? { resumeCv: resumeCvIds } : {}),
    },
  };

  const response = await fetch(`${baseUrl}/api/leadership-applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
    signal: options.signal,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to submit leadership application (${response.status}): ${errText}`);
  }
}

/**
 * 2. Gửi form đăng ký Tổ chức thành viên (Upload tuần tự)
 */
export async function submitOrganizationApplication(
  values: RegisterOrganizationFormValues,
  options: StrapiRequestOptions = {}
): Promise<void> {
  const { baseUrl, token } = resolveConfig(options);

  const orgImageIds = await uploadAntdFiles(values.organizationImage, baseUrl, token, options.signal);
  const orgLogoIds = await uploadAntdFiles(values.organizationLogo, baseUrl, token, options.signal);
  const projectImageIds = await uploadAntdFiles(values.projectImages, baseUrl, token, options.signal);

  const payload = {
    data: {
      organizationName: values.organizationName,
      organizationDescription: values.organizationDescription,
      representativeFullName: values.representativeFullName,
      representativePhone: values.representativePhone,
      representativePhoneCode: values.representativePhoneCode || '+84',
      yearOfEstablishment: values.yearOfEstablishment,
      country: values.country,
      address: values.address,
      email: values.email,
      website: values.website || undefined,
      facebookUrl: values.facebookUrl || undefined,
      instagramUrl: values.instagramUrl || undefined,
      linkedinUrl: values.linkedinUrl || undefined,
      focusArea: values.focusArea,
      focusSDGs: values.focusSDGs,
      projectName: values.projectName,
      projectOrganizationName: values.projectOrganizationName,
      projectDescription: values.projectDescription,
      projectLedBy: values.projectLedBy,
      socialImpactMetrics: values.socialImpactMetrics,
      region: values.region,
      countriesCovered: values.countriesCovered,
      projectFocusSDGs: values.projectFocusSDGs,
      projectStatus: values.projectStatus,
      projectSocialProfile: values.projectSocialProfile,
      ...(orgImageIds.length > 0 ? { organizationImage: orgImageIds } : {}),
      ...(orgLogoIds.length > 0 ? { organizationLogo: orgLogoIds } : {}),
      ...(projectImageIds.length > 0 ? { projectImages: projectImageIds } : {}),
    },
  };

  const response = await fetch(`${baseUrl}/api/organization-applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
    signal: options.signal,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to submit organization application (${response.status}): ${errText}`);
  }
}

/**
 * 3. Gửi thư động viên & Quyên góp ủng hộ
 */
export async function submitSupportSubmission(
  values: SupportFormValues,
  options: StrapiRequestOptions = {}
): Promise<void> {
  const { baseUrl, token } = resolveConfig(options);

  const payload = {
    data: {
      fullName: values.fullName,
      email: values.email,
      projects: values.projects,
      letter: values.letter,
      financialGiftDetails: values.financialGiftDetails || undefined,
      donationFrequency: values.donationFrequency || 'monthly',
    },
  };

  const response = await fetch(`${baseUrl}/api/support-submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
    signal: options.signal,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to submit support letter (${response.status}): ${errText}`);
  }
}

// ── Unit Tests ──────────────────────────────────────────────────────────────
if (import.meta.vitest) {
  const { afterEach, describe, expect, it, vi } = import.meta.vitest;

  describe('applications API', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('submits support submission with formatted JSON payload', async () => {
      const fetchMock = vi.fn().mockResolvedValue({ ok: true });
      vi.stubGlobal('fetch', fetchMock);

      await submitSupportSubmission(
        {
          fullName: 'Nguyen Van A',
          email: 'a@example.com',
          projects: ['cse-global-vietnam'],
          letter: 'Keep up the good work!',
          financialGiftDetails: 'USD 50',
          donationFrequency: 'monthly',
        },
        { baseUrl: 'http://localhost:1337' }
      );

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:1337/api/support-submissions');
      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
        data: {
          fullName: 'Nguyen Van A',
          email: 'a@example.com',
          projects: ['cse-global-vietnam'],
          letter: 'Keep up the good work!',
          financialGiftDetails: 'USD 50',
          donationFrequency: 'monthly',
        },
      });
    });

    it('throws error when server responds with 400/500', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, text: async () => 'Internal Error' }));

      await expect(
        submitSupportSubmission(
          {
            fullName: 'Test',
            email: 'test@example.com',
            projects: [],
            letter: 'Hello',
            financialGiftDetails: '',
            donationFrequency: 'once',
          },
          { baseUrl: 'http://localhost:1337' }
        )
      ).rejects.toThrow('Failed to submit support letter (500)');
    });
  });
}