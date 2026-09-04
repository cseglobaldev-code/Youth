import type { GlobalSetting } from '@/types/global';
import {
  cacheGet,
  cacheSet,
  clearCache,
  mapSocialLinks,
  mediaUrl,
  resolveConfig,
  text,
  type StrapiMedia,
  type StrapiRequestOptions,
  type StrapiSocialLink,
} from './strapi';

interface StrapiGlobalSetting {
  id?: unknown;
  documentId?: unknown;
  address?: unknown;
  email?: unknown;
  hotline?: unknown;
  operatingTime?: unknown;
  bankName?: unknown;
  accountNumber?: unknown;
  accountHolder?: unknown;
  transferSyntaxNote?: unknown;
  qrCodeImage?: StrapiMedia | null;
  socialLinks?: StrapiSocialLink[] | null;
}

interface StrapiGlobalSettingResponse {
  data?: StrapiGlobalSetting | null;
}

export const DEFAULT_GLOBAL_SETTINGS: GlobalSetting = {
  address: 'Global - Operating across 6 continents',
  email: 'info@youthorgunion.org',
  hotline: '(+84) 98.242.1109',
  operatingTime: 'Within 5-7 business days',
  bankName: 'MB Bank - Ben Thanh Branch',
  accountNumber: '000999999999',
  accountHolder: 'Youth Organization Union',
  transferSyntaxNote: 'YOUPRJ26 - [Project Names].',
};

export async function fetchGlobalSettings(
  options: StrapiRequestOptions = {}
): Promise<GlobalSetting> {
  const { baseUrl, token } = resolveConfig(options);
  const isPreview =
    options.bypassCache ||
    (typeof window !== 'undefined' && window.location.search.includes('preview=1'));

  const query = new URLSearchParams();
  query.append('populate[0]', 'qrCodeImage');
  query.append('populate[1]', 'socialLinks');

  const url = `${baseUrl}/api/global-setting?${query.toString()}`;
  let payload = cacheGet(url, isPreview) as StrapiGlobalSettingResponse | undefined;

  if (payload === undefined) {
    try {
      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        signal: options.signal,
      });

      if (response.ok) {
        payload = (await response.json()) as StrapiGlobalSettingResponse;
        cacheSet(url, payload, isPreview);
      }
    } catch {
      // Bỏ qua lỗi mạng để sử dụng fallback tĩnh
    }
  }

  const raw = payload?.data;
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_GLOBAL_SETTINGS;
  }

  const socialLinks = mapSocialLinks(raw.socialLinks);

  return {
    address: text(raw.address) || DEFAULT_GLOBAL_SETTINGS.address,
    email: text(raw.email) || DEFAULT_GLOBAL_SETTINGS.email,
    hotline: text(raw.hotline) || DEFAULT_GLOBAL_SETTINGS.hotline,
    operatingTime: text(raw.operatingTime) || DEFAULT_GLOBAL_SETTINGS.operatingTime,
    socialLinks: socialLinks.length > 0 ? socialLinks : undefined,
    bankName: text(raw.bankName) || DEFAULT_GLOBAL_SETTINGS.bankName,
    accountNumber: text(raw.accountNumber) || DEFAULT_GLOBAL_SETTINGS.accountNumber,
    accountHolder: text(raw.accountHolder) || DEFAULT_GLOBAL_SETTINGS.accountHolder,
    transferSyntaxNote: text(raw.transferSyntaxNote) || DEFAULT_GLOBAL_SETTINGS.transferSyntaxNote,
    qrCodeImageUrl: mediaUrl(raw.qrCodeImage, baseUrl) || undefined,
  };
}

// ── Unit Tests ──────────────────────────────────────────────────────────────
if (import.meta.vitest) {
  const { afterEach, beforeEach, describe, expect, it, vi } = import.meta.vitest;

  describe('fetchGlobalSettings', () => {
    beforeEach(() => {
      clearCache();
      vi.unstubAllGlobals();
    });

    afterEach(() => {
      clearCache();
      vi.unstubAllGlobals();
    });

    it('maps Strapi global settings response correctly', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            address: 'Custom Address Vietnam',
            email: 'contact@youthorgunion.org',
            hotline: '+84 123 456 789',
            bankName: 'Vietcombank',
            accountNumber: '1234567890',
            accountHolder: 'Y.O.U Vietnam',
            qrCodeImage: { url: '/uploads/custom-qr.png' },
            socialLinks: [{ platform: 'youtube', url: 'https://youtube.com/@test' }],
          },
        }),
      });
      vi.stubGlobal('fetch', fetchMock);

      const settings = await fetchGlobalSettings({ baseUrl: 'http://localhost:1337' });

      expect(settings.address).toBe('Custom Address Vietnam');
      expect(settings.email).toBe('contact@youthorgunion.org');
      expect(settings.bankName).toBe('Vietcombank');
      expect(settings.qrCodeImageUrl).toBe('http://localhost:1337/uploads/custom-qr.png');
      expect(settings.socialLinks).toHaveLength(1);
    });

    it('returns DEFAULT_GLOBAL_SETTINGS if API fails', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      const settings = await fetchGlobalSettings({ baseUrl: 'http://localhost:1337' });

      expect(settings).toEqual(DEFAULT_GLOBAL_SETTINGS);
    });
  });
}