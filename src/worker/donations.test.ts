import { describe, expect, it } from 'vitest';
import { handleDonationConfig, handleDonationSession, type DonationEnv } from './donations';

describe('donation worker handlers', () => {
  it('selects a local currency and reports only configured methods', async () => {
    const request = new Request('https://youthorgunion.com/api/donations/config', {
      headers: { 'CF-IPCountry': 'VN' },
    });
    const response = handleDonationConfig(request, {
      DONATION_CARD_CHECKOUT_URL: 'https://payments.example/card',
    });
    const body = await response.json() as {
      currency: string;
      methods: Array<{ id: string; available: boolean }>;
    };

    expect(body.currency).toBe('VND');
    expect(body.methods).toEqual([
      { id: 'card', available: true },
      { id: 'bank_transfer', available: false },
      { id: 'paypal', available: false },
    ]);
  });

  it('rejects invalid donation details', async () => {
    const request = new Request('https://youthorgunion.com/api/donations/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: -10 }),
    });
    const response = await handleDonationSession(request, {});
    expect(response.status).toBe(400);
  });

  it('creates a reference without putting donor details in the redirect URL', async () => {
    const request = new Request('https://youthorgunion.com/api/donations/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Test',
        lastName: 'Donor',
        email: 'test@example.com',
        amount: 50,
        currency: 'USD',
        coverFees: false,
        paymentMethod: 'card',
      }),
    });
    const env: DonationEnv = { DONATION_CARD_CHECKOUT_URL: 'https://payments.example/checkout' };
    const response = await handleDonationSession(request, env);
    const body = await response.json() as { reference: string; redirectUrl: string };
    const redirectUrl = new URL(body.redirectUrl);

    expect(response.status).toBe(200);
    expect(body.reference).toMatch(/^YOU-/);
    expect(redirectUrl.searchParams.get('amount')).toBe('50');
    expect(redirectUrl.searchParams.get('currency')).toBe('USD');
    expect(redirectUrl.toString()).not.toContain('test%40example.com');
  });
});
