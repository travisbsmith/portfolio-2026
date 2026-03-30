import type { APIRoute } from 'astro';
import { saveLead, type Lead } from '../../../lib/leads';

export const prerender = false;

// Basin webhook: POST https://fully-operational.com/api/leads/new?secret=<CRON_SECRET>
export const POST: APIRoute = async ({ request, url }) => {
  // Secure with the same CRON_SECRET used for follow-up cron
  const secret = url.searchParams.get('secret');
  const expected = import.meta.env.CRON_SECRET ?? process.env.CRON_SECRET;
  if (!expected || secret !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  let body: Record<string, string>;
  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const fd = await request.formData();
      body = Object.fromEntries(
        [...fd.entries()].map(([k, v]) => [k, String(v)])
      );
    }
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const now = new Date().toISOString();
  const lead: Lead = {
    id: `lead_${Date.now()}`,
    name: body.name ?? 'Unknown',
    email: body.email ?? '',
    storeUrl: body.store_url ?? '',
    storeStatus: body.store_status ?? '',
    challenge: body.challenge ?? '',
    serviceInterest: body.service_interest ?? '',
    availability: body.availability ?? '',
    timezone: body.timezone ?? '',
    referral: body.referral ?? '',
    additionalNotes: body.notes ?? '',
    stage: 'Lead',
    internalNotes: '',
    stripeCustomerId: '',
    createdAt: now,
    updatedAt: now,
  };

  await saveLead(lead);

  return new Response(JSON.stringify({ ok: true, id: lead.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
