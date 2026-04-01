import type { APIRoute } from 'astro';
import { saveLead, type Lead } from '../../../lib/leads';
import { sendEmail } from '../email/send';

export const prerender = false;

export const POST: APIRoute = async ({ request, url, redirect }) => {
  // Parse body — handles both direct form POST and JSON webhook
  const contentType = request.headers.get('content-type') ?? '';
  let body: Record<string, string>;
  try {
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const fd = await request.formData();
      body = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]));
    }
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  // Honeypot — silently redirect spambots
  if (body._gotcha) {
    return redirect('/booked');
  }

  // Webhook calls include ?secret — verify it
  const secret = url.searchParams.get('secret');
  if (secret) {
    const expected = import.meta.env.CRON_SECRET ?? process.env.CRON_SECRET;
    if (!expected || secret !== expected) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  const now = new Date().toISOString();
  const validStages = ['Lead', 'Call Scheduled', 'Proposal Sent', 'Active', 'Closed', 'Archived'];
  const lead: Lead = {
    id: `lead_${Date.now()}`,
    name: body.name ?? 'Unknown',
    email: body.email ?? '',
    storeUrl: body.store_url ?? body.storeUrl ?? '',
    storeStatus: body.store_status ?? body.storeStatus ?? '',
    challenge: body.challenge ?? '',
    serviceInterest: body.service_interest ?? body.serviceInterest ?? '',
    availability: body.availability ?? '',
    timezone: body.timezone ?? '',
    referral: body.referral ?? '',
    additionalNotes: body.notes ?? body.additionalNotes ?? '',
    launchDate: body.launch_date ?? body.launchDate ?? '',
    hasVisualDesigner: body.has_visual_designer ?? body.hasVisualDesigner ?? '',
    stage: validStages.includes(body.stage) ? (body.stage as Lead['stage']) : 'Lead',
    internalNotes: body.internalNotes ?? '',
    stripeCustomerId: '',
    createdAt: now,
    updatedAt: now,
  };

  // Save to KV — non-fatal if KV not configured yet
  try {
    await saveLead(lead);
  } catch (e) {
    console.error('KV save failed:', e);
  }

  // Email Travis a notification
  try {
    await sendEmail({
      to: 'travis@fully-operational.com',
      subject: `New booking request from ${lead.name}`,
      html: `
        <h2>New booking request</h2>
        <table style="border-collapse:collapse;width:100%;font-family:monospace;font-size:14px">
          <tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Name</td><td style="padding:6px 12px">${lead.name}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Email</td><td style="padding:6px 12px"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
          <tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Store URL</td><td style="padding:6px 12px">${lead.storeUrl || '—'}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Store Status</td><td style="padding:6px 12px">${lead.storeStatus || '—'}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Interested In</td><td style="padding:6px 12px">${lead.serviceInterest || '—'}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Challenge</td><td style="padding:6px 12px;white-space:pre-wrap">${lead.challenge || '—'}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Availability</td><td style="padding:6px 12px">${lead.availability || '—'}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Timezone</td><td style="padding:6px 12px">${lead.timezone || '—'}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Referral</td><td style="padding:6px 12px">${lead.referral || '—'}</td></tr>
        </table>
        <p style="margin-top:24px"><a href="https://fully-operational.com/dashboard" style="background:#ff5722;color:white;padding:10px 20px;text-decoration:none;font-family:monospace">View in Dashboard →</a></p>
      `,
    });
  } catch (e) {
    console.error('Failed to send lead notification email:', e);
  }

  // JSON request (webhook or dashboard) → return JSON; form post → redirect
  if (contentType.includes('application/json')) {
    return new Response(JSON.stringify({ ok: true, id: lead.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return redirect('/booked');
};
