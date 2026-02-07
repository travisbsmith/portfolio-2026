import * as fs from 'fs';
import * as path from 'path';

// Path to the cache file (relative to project root)
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

/**
 * Get all posts from the local cache
 * 
 * Posts are synced from Substack before build via scripts/sync-substack.ts
 * This ensures builds never fail due to network issues.
 */
export async function getSubstackPosts(): Promise<SubstackPost[]> {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      console.warn('Posts cache not found. Run `npm run sync` to fetch posts.');
      return [];
    }

    const cacheContent = fs.readFileSync(CACHE_FILE, 'utf-8');
    const cache: PostsCache = JSON.parse(cacheContent);

    const posts: SubstackPost[] = cache.posts.map((post) => ({
      title: post.title,
      slug: post.slug,
      date: new Date(post.date),
      excerpt: post.excerpt,
      content: post.content,
      link: post.link,
      author: post.author,
    }));

    return posts;
  } catch (error) {
    console.error('Failed to read posts cache:', error);
    return [];
  }
}

/**
 * Get a single post by slug
 */
export async function getSubstackPostBySlug(slug: string): Promise<SubstackPost | null> {
  const posts = await getSubstackPosts();
  return posts.find((post) => post.slug === slug) || null;
}

/**
 * Get all post slugs for static path generation
 */
export async function getAllSubstackSlugs(): Promise<string[]> {
  const posts = await getSubstackPosts();
  return posts.map((post) => post.slug);
}
