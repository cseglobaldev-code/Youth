export interface DonationEnv {
  DONATION_CARD_CHECKOUT_URL?: string;
  DONATION_BANK_TRANSFER_URL?: string;
  DONATION_PAYPAL_URL?: string;
  DONATION_FEE_PERCENT?: string;
}

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'JPY', 'VND'];

const COUNTRY_CURRENCY: Record<string, string> = {
  VN: 'VND',
  US: 'USD',
  GB: 'GBP',
  AU: 'AUD',
  CA: 'CAD',
  SG: 'SGD',
  JP: 'JPY',
  AT: 'EUR',
  BE: 'EUR',
  CY: 'EUR',
  DE: 'EUR',
  EE: 'EUR',
  ES: 'EUR',
  FI: 'EUR',
  FR: 'EUR',
  GR: 'EUR',
  HR: 'EUR',
  IE: 'EUR',
  IT: 'EUR',
  LT: 'EUR',
  LU: 'EUR',
  LV: 'EUR',
  MT: 'EUR',
  NL: 'EUR',
  PT: 'EUR',
  SI: 'EUR',
  SK: 'EUR',
};

type PaymentMethod = 'card' | 'bank_transfer' | 'paypal';

interface DonationSessionBody {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  amount: number;
  currency: string;
  coverFees: boolean;
  paymentMethod: PaymentMethod;
}

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function countryFromRequest(request: Request) {
  const workerCountry = (request as Request & { cf?: { country?: string } }).cf?.country;
  return (workerCountry || request.headers.get('CF-IPCountry') || 'US').toUpperCase();
}

function safeCheckoutUrl(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.hostname === 'localhost' ? url : null;
  } catch {
    return null;
  }
}

function validateSessionBody(body: unknown): DonationSessionBody | null {
  if (!body || typeof body !== 'object') return null;
  const value = body as Partial<DonationSessionBody>;
  const methods: PaymentMethod[] = ['card', 'bank_transfer', 'paypal'];
  if (
    typeof value.firstName !== 'string' || !value.firstName.trim() || value.firstName.length > 100 ||
    typeof value.lastName !== 'string' || !value.lastName.trim() || value.lastName.length > 100 ||
    typeof value.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) ||
    typeof value.amount !== 'number' || !Number.isFinite(value.amount) || value.amount <= 0 || value.amount > 1_000_000_000 ||
    typeof value.currency !== 'string' || !SUPPORTED_CURRENCIES.includes(value.currency) ||
    typeof value.paymentMethod !== 'string' || !methods.includes(value.paymentMethod as PaymentMethod)
  ) {
    return null;
  }
  return value as DonationSessionBody;
}

export function handleDonationConfig(request: Request, env: DonationEnv): Response {
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);
  const country = countryFromRequest(request);
  const feePercent = Number(env.DONATION_FEE_PERCENT || 0);
  return json({
    country,
    currency: COUNTRY_CURRENCY[country] || 'USD',
    currencies: SUPPORTED_CURRENCIES,
    feePercent: Number.isFinite(feePercent) && feePercent >= 0 && feePercent <= 20 ? feePercent : 0,
    methods: [
      { id: 'card', available: Boolean(safeCheckoutUrl(env.DONATION_CARD_CHECKOUT_URL)) },
      { id: 'bank_transfer', available: Boolean(safeCheckoutUrl(env.DONATION_BANK_TRANSFER_URL)) },
      { id: 'paypal', available: Boolean(safeCheckoutUrl(env.DONATION_PAYPAL_URL)) },
    ],
  });
}

export async function handleDonationSession(request: Request, env: DonationEnv): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const donation = validateSessionBody(body);
  if (!donation) return json({ error: 'Invalid donation details' }, 400);

  const configuredUrls: Record<PaymentMethod, string | undefined> = {
    card: env.DONATION_CARD_CHECKOUT_URL,
    bank_transfer: env.DONATION_BANK_TRANSFER_URL,
    paypal: env.DONATION_PAYPAL_URL,
  };
  const checkoutUrl = safeCheckoutUrl(configuredUrls[donation.paymentMethod]);
  if (!checkoutUrl) {
    return json({ error: 'This payment method has not been configured yet' }, 503);
  }

  const reference = `YOU-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  checkoutUrl.searchParams.set('reference', reference);
  checkoutUrl.searchParams.set('amount', String(donation.amount));
  checkoutUrl.searchParams.set('currency', donation.currency);

  return json({ reference, redirectUrl: checkoutUrl.toString() });
}
