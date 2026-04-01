import type { APIRoute } from 'astro';
import { createClient } from '@vercel/kv';
import Parser from 'rss-parser';

export const prerender = false;

const SUBSTACK_FEED_URL = 'https://travisbsmith.substack.com/feed';

function extractSlug(url: string): string {
  const match = url.match(/\/p\/([^/?]+)/);
  return match ? match[1] : url.split('/').pop() || 'post';
}

function createExcerpt(html: string, maxLength = 200): string {
  const text = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

export const GET: APIRoute = async ({ url }) => {
  const secret = url.searchParams.get('secret');
  const expected = process.env.CRON_SECRET;
  if (!expected || secret !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (!kvUrl || !kvToken) return new Response('KV env vars not set', { status: 500 });

  const parser = new Parser({ customFields: { item: ['content:encoded', 'creator'] } });
  const feed = await parser.parseURL(SUBSTACK_FEED_URL);

  const posts = feed.items.map((item: any) => {
    const content = item['content:encoded'] || item.content || item.summary || '';
    const author = item['creator'] || item.author || feed.title || '';
    return {
      title: item.title || 'Untitled',
      slug: extractSlug(item.link || ''),
      date: new Date(item.pubDate || item.isoDate || Date.now()).toISOString(),
      excerpt: createExcerpt(content),
      content,
      link: item.link || '',
      author,
    };
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const cache = { lastSynced: new Date().toISOString(), posts };

  const kv = createClient({ url: kvUrl, token: kvToken });
  await kv.set('posts-cache', cache);

  return new Response(JSON.stringify({ ok: true, count: posts.length, lastSynced: cache.lastSynced }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
