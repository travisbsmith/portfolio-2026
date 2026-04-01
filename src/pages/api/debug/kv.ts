import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const secret = url.searchParams.get('secret');
  const expected = process.env.CRON_SECRET;
  if (!expected || secret !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (!kvUrl || !kvToken) {
    return new Response(JSON.stringify({ error: 'KV env vars not set', kvUrl: !!kvUrl, kvToken: !!kvToken }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { createClient } = await import('@vercel/kv');
    const kv = createClient({ url: kvUrl, token: kvToken });

    const type = await kv.type('leads');
    const hash = await kv.hgetall('leads');
    const count = hash ? Object.keys(hash).length : 0;
    const sample = hash ? Object.entries(hash).slice(0, 2).map(([k, v]) => ({ key: k, valueType: typeof v, value: v })) : [];

    return new Response(JSON.stringify({ ok: true, type, count, sample }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
