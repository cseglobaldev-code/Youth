import { resolveConfig, type StrapiRequestOptions } from './strapi';

export interface Inquiry {
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
}

export async function submitInquiry(inquiry: Inquiry, options: StrapiRequestOptions = {}): Promise<void> {
  const { baseUrl, token } = resolveConfig(options);

  const response = await fetch(`${baseUrl}/api/inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ data: inquiry }),
    signal: options.signal,
  });

  if (!response.ok) throw new Error(`Failed to submit inquiry (${response.status})`);
}
