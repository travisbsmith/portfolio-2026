import type { APIRoute } from 'astro';
import { saveLead, getLeads, updateLead, type Lead } from '../../../lib/leads';
import { sendEmail } from '../email/send';
import { createHmac, timingSafeEqual } from 'crypto';

export const prerender = false;

const CAL_LINK = 'https://cal.com/fullyoperational';

function verifySignature(body: string, signature: string, secret: string): boolean {
  try {
    const hmac = createHmac('sha256', secret);
    hmac.update(body);
    const expected = hmac.digest('hex');
    const a = Buffer.from(signature.replace('sha256=', ''), 'hex');
    const b = Buffer.from(expected, 'hex');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function formatMeetingTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: 'America/Chicago',
  });
}

export const POST: APIRoute = async ({ request }) => {
  const rawBody = await request.text();
  let payload: any;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response('Bad JSON', { status: 400 });
  }

  // Verify signature if secret is configured
  const secret = import.meta.env.CAL_WEBHOOK_SECRET ?? process.env.CAL_WEBHOOK_SECRET;
  if (secret) {
    const sig = request.headers.get('x-cal-signature-256') ?? '';
    if (!verifySignature(rawBody, sig, secret)) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  const trigger = payload.triggerEvent ?? '';
  const booking = payload.payload ?? {};
  const attendees: any[] = booking.attendees ?? [];
  const guest = attendees[0] ?? {};
  const responses = booking.responses ?? {};
  const bookingUid: string = booking.uid ?? '';

  const name: string = guest.name ?? responses.name?.value ?? 'Unknown';
  const email: string = guest.email ?? responses.email?.value ?? '';

  // ── BOOKING_CANCELLED ──────────────────────────────────────────────────────
  if (trigger === 'BOOKING_CANCELLED') {
    const leads = await getLeads();
    const existing = leads.find(l =>
      l.calBookingUid === bookingUid || l.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      await updateLead(existing.id, {
        nextMeeting: '',
        nextMeetingISO: '',
        stage: 'Lead',
        internalNotes: existing.internalNotes
          ? `${existing.internalNotes}\n\nCall cancelled (cal.com) — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
          : `Call cancelled (cal.com) — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      });
      try {
        await sendEmail({
          to: 'travis@fully-operational.com',
          subject: `Call cancelled: ${name}`,
          html: `<p style="font-family:monospace">
            <strong>${name}</strong> cancelled their call.<br><br>
            <a href="https://fully-operational.com/dashboard/${existing.id}" style="color:#ff5722">View in Dashboard →</a>
          </p>`,
        });
      } catch { /* non-fatal */ }
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── BOOKING_RESCHEDULED ────────────────────────────────────────────────────
  if (trigger === 'BOOKING_RESCHEDULED') {
    const startISO: string = booking.startTime ?? '';
    const nextMeeting = startISO ? formatMeetingTime(startISO) : '';
    const leads = await getLeads();
    const existing = leads.find(l =>
      l.calBookingUid === bookingUid || l.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      await updateLead(existing.id, {
        nextMeeting,
        nextMeetingISO: startISO,
        calBookingUid: bookingUid,
        stage: 'Call Scheduled',
      });
      try {
        await sendEmail({
          to: 'travis@fully-operational.com',
          subject: `Call rescheduled: ${name} → ${nextMeeting}`,
          html: `<p style="font-family:monospace">
            <strong>${name}</strong> rescheduled their call.<br>
            New time: <strong>${nextMeeting}</strong><br><br>
            <a href="https://fully-operational.com/dashboard/${existing.id}" style="color:#ff5722">View in Dashboard →</a>
          </p>`,
        });
      } catch { /* non-fatal */ }
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── BOOKING_CREATED ────────────────────────────────────────────────────────
  if (trigger !== 'BOOKING_CREATED') {
    return new Response(JSON.stringify({ ok: true, skipped: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  }

  const timezone: string = guest.timeZone ?? '';
  const storeUrl: string        = responses.store_url?.value ?? '';
  const storeStatus: string     = responses.store_status?.value ?? '';
  const serviceInterest: string = responses.service_interest?.value ?? '';
  const challenge: string       = responses.challenge?.value ?? '';
  const referral: string        = responses.referral?.value ?? '';
  const launchDate: string      = responses.launch_date?.value ?? '';
  const hasVisualDesigner: string = responses.has_visual_designer?.value ?? '';
  const additionalNotes: string = responses.notes?.value
    ?? booking.additionalNotes
    ?? booking.description
    ?? '';

  const startISO: string = booking.startTime ?? '';
  const nextMeeting = startISO ? formatMeetingTime(startISO) : 'TBD';

  const now = new Date().toISOString();
  const lead: Lead = {
    id: `lead_${Date.now()}`,
    name,
    email,
    storeUrl,
    storeStatus,
    challenge,
    serviceInterest,
    availability: nextMeeting,
    timezone,
    referral,
    additionalNotes,
    launchDate,
    hasVisualDesigner,
    nextMeeting,
    nextMeetingISO: startISO,
    calBookingUid: bookingUid,
    stage: 'Call Scheduled',
    internalNotes: `Booked via cal.com — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    stripeCustomerId: '',
    createdAt: now,
    updatedAt: now,
  };

  try {
    await saveLead(lead);
  } catch (e) {
    console.error('KV save failed:', e);
    return new Response(JSON.stringify({ ok: false, error: 'KV save failed' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await sendEmail({
      to: 'travis@fully-operational.com',
      subject: `Call booked: ${name} — ${nextMeeting}`,
      html: `
        <h2 style="font-family:monospace;margin-bottom:16px">New call booked via cal.com</h2>
        <table style="border-collapse:collapse;width:100%;font-family:monospace;font-size:14px">
          <tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Name</td><td style="padding:6px 12px">${name}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Email</td><td style="padding:6px 12px"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Call time</td><td style="padding:6px 12px"><strong>${nextMeeting}</strong></td></tr>
          ${storeUrl ? `<tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Store URL</td><td style="padding:6px 12px">${storeUrl}</td></tr>` : ''}
          ${storeStatus ? `<tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Store status</td><td style="padding:6px 12px">${storeStatus}</td></tr>` : ''}
          ${serviceInterest ? `<tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Interested in</td><td style="padding:6px 12px">${serviceInterest}</td></tr>` : ''}
          ${challenge ? `<tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Challenge</td><td style="padding:6px 12px;white-space:pre-wrap">${challenge}</td></tr>` : ''}
          ${referral ? `<tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Referral</td><td style="padding:6px 12px">${referral}</td></tr>` : ''}
          ${additionalNotes ? `<tr><td style="padding:6px 12px;color:#666;white-space:nowrap">Notes</td><td style="padding:6px 12px;white-space:pre-wrap">${additionalNotes}</td></tr>` : ''}
        </table>
        <p style="margin-top:24px">
          <a href="https://fully-operational.com/dashboard/${lead.id}" style="background:#ff5722;color:white;padding:10px 20px;text-decoration:none;font-family:monospace;border-radius:4px">View in Dashboard →</a>
        </p>
      `,
    });
  } catch (e) {
    console.error('Notification email failed:', e);
  }

  return new Response(JSON.stringify({ ok: true, id: lead.id }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};
