import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

// Exported helper so webhook.ts and followup/check.ts can call it directly
export async function sendEmail({
  to,
  subject,
  html,
  replyTo = 'travis@fully-operational.com',
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ id?: string; error?: string }> {
  const resend = new Resend(import.meta.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: 'Travis Smith <travis@fully-operational.com>',
    to,
    replyTo,
    subject,
    html,
  });
  if (error) {
    console.error('Resend error:', error);
    return { error: error.message };
  }
  return { id: data?.id };
}

// Also exposed as an API route for the dashboard's "Send Follow-up" button
export const POST: APIRoute = async ({ request }) => {
  const { to, subject, html } = await request.json();
  if (!to || !subject || !html) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const result = await sendEmail({ to, subject, html });
  return new Response(JSON.stringify(result), {
    status: result.error ? 500 : 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
