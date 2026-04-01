import * as fs from 'fs';
import * as path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'src/data/posts-cache.json');

export interface SubstackPost {
  title: string;
  slug: string;
  date: Date;
  excerpt: string;
  content: string;
  link: string;
  author?: string;
}

interface CachedPost {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  link: string;
  author: string;
}

interface PostsCache {
  lastSynced: string;
  posts: CachedPost[];
}

function hydratePosts(cache: PostsCache): SubstackPost[] {
  return cache.posts.map((post) => ({
    title: post.title,
    slug: post.slug,
    date: new Date(post.date),
    excerpt: post.excerpt,
    content: post.content,
    link: post.link,
    author: post.author,
  }));
}

/**
 * Get all posts — reads from Vercel KV in production, local JSON cache in dev.
 */
export async function getSubstackPosts(): Promise<SubstackPost[]> {
  // Try KV first (production)
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (kvUrl && kvToken) {
    try {
      const { createClient } = await import('@vercel/kv');
      const kv = createClient({ url: kvUrl, token: kvToken });
      const cache = await kv.get<PostsCache>('posts-cache');
      if (cache?.posts?.length) return hydratePosts(cache);
    } catch {
      // Fall through to filesystem
    }
  }

  // Fallback: local JSON cache (dev / first deploy before cron runs)
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      console.warn('Posts cache not found. Run `npm run sync` to fetch posts.');
      return [];
    }
    const cache: PostsCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    return hydratePosts(cache);
  } catch (error) {
    console.error('Failed to read posts cache:', error);
    return [];
  }
}

export async function getSubstackPostBySlug(slug: string): Promise<SubstackPost | null> {
  const posts = await getSubstackPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export async function getAllSubstackSlugs(): Promise<string[]> {
  const posts = await getSubstackPosts();
  return posts.map((post) => post.slug);
}
