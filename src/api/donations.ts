export type DonationPaymentMethod = 'card' | 'bank_transfer' | 'paypal';

export interface DonationPaymentOption {
  id: DonationPaymentMethod;
  available: boolean;
}

export interface DonationConfig {
  country: string;
  currency: string;
  currencies: string[];
  feePercent: number;
  methods: DonationPaymentOption[];
}

export interface DonationSessionInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  amount: number;
  currency: string;
  coverFees: boolean;
  paymentMethod: DonationPaymentMethod;
}

export interface DonationSession {
  reference: string;
  redirectUrl: string;
}

const FALLBACK_CONFIG: DonationConfig = {
  country: 'unknown',
  currency: 'USD',
  currencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'JPY', 'VND'],
  feePercent: 0,
  methods: [
    { id: 'card', available: false },
    { id: 'bank_transfer', available: false },
    { id: 'paypal', available: false },
  ],
};

export async function fetchDonationConfig(signal?: AbortSignal): Promise<DonationConfig> {
  try {
    const response = await fetch('/api/donations/config', { signal });
    if (!response.ok) return FALLBACK_CONFIG;
    return (await response.json()) as DonationConfig;
  } catch {
    return FALLBACK_CONFIG;
  }
}

export async function createDonationSession(
  input: DonationSessionInput,
  signal?: AbortSignal
): Promise<DonationSession> {
  const response = await fetch('/api/donations/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error || 'Payment service is unavailable');
  }

  return response.json() as Promise<DonationSession>;
}
