import {
  handleDonationConfig,
  handleDonationSession,
  type DonationEnv,
} from '../../../src/worker/donations';

interface PagesContext {
  request: Request;
  env: DonationEnv;
  params: { path?: string | string[] };
}

export function onRequest(context: PagesContext): Response | Promise<Response> {
  const path = Array.isArray(context.params.path)
    ? context.params.path.join('/')
    : context.params.path || '';

  if (path === 'config') return handleDonationConfig(context.request, context.env);
  if (path === 'session') return handleDonationSession(context.request, context.env);
  return Response.json({ error: 'Not found' }, { status: 404 });
}
