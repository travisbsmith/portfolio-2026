import type { APIRoute } from 'astro';
import { updateLead } from '../../../lib/leads';

export const prerender = false;

// PATCH /api/leads/:id — update stage, internalNotes, stripeCustomerId
// Called from dashboard JS; secured via session cookie
export const PATCH: APIRoute = async ({ request, params, cookies }) => {
  const session = cookies.get('dashboard_session')?.value;
  if (session !== 'authenticated') {
    return new Response('Unauthorized', { status: 401 });
  }

  const id = params.id;
  if (!id) return new Response('Missing id', { status: 400 });

  let patch: Record<string, string>;
  try {
    patch = await request.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const updated = await updateLead(id, patch);
  if (!updated) return new Response('Not found', { status: 404 });

  return new Response(JSON.stringify(updated), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
