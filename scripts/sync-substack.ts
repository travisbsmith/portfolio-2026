/**
 * Sync Substack posts to local cache
 * 
 * This script fetches posts from the Substack RSS feed and saves them
 * to a local JSON file. The build process reads from this cache instead
 * of fetching live, ensuring builds never fail due to network issues.
 * 
 * Usage: npx tsx scripts/sync-substack.ts
 */

import Parser from 'rss-parser';
import * as fs from 'fs';
import * as path from 'path';

const SUBSTACK_FEED_URL = 'https://travisbsmith.substack.com/feed';
const CACHE_FILE = path.join(process.cwd(), 'src/data/posts-cache.json');

interface CachedPost {
  title: string;
  slug: string;
  date: string; // ISO string for JSON serialization
  excerpt: string;
  content: string;
  link: string;
  author: string;
}

interface PostsCache {
  lastSynced: string;
  posts: CachedPost[];
}

function extractSlug(url: string): string {
  const match = url.match(/\/p\/([^/?]+)/);
  return match ? match[1] : url.split('/').pop() || 'post';
}

function createExcerpt(html: string, maxLength: number = 200): string {
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

async function syncSubstack(): Promise<void> {
  console.log('🔄 Syncing Substack posts...');
  console.log(`   Feed URL: ${SUBSTACK_FEED_URL}`);
  
  const parser = new Parser({
    customFields: {
      item: ['content:encoded', 'dc:creator'],
    },
    timeout: 30000, // 30 second timeout
  });

  try {
    const feed = await parser.parseURL(SUBSTACK_FEED_URL);
    
    const posts: CachedPost[] = feed.items.map((item) => {
      const content = (item as any)['content:encoded'] || item.content || '';
      const author = (item as any)['dc:creator'] || item.creator || 'Travis Smith';
      
      return {
        title: item.title || 'Untitled',
        slug: extractSlug(item.link || ''),
        date: new Date(item.pubDate || item.isoDate || Date.now()).toISOString(),
        excerpt: createExcerpt(content),
        content: content,
        link: item.link || '',
        author: author,
      };
    });

    // Sort by date, newest first
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const cache: PostsCache = {
      lastSynced: new Date().toISOString(),
      posts: posts,
    };

    // Ensure directory exists
    const cacheDir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Write cache file
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));

    console.log(`✅ Synced ${posts.length} posts`);
    posts.forEach((post) => {
      console.log(`   - ${post.title} (${post.slug})`);
    });
    console.log(`   Cache saved to: ${CACHE_FILE}`);
    
  } catch (error) {
    console.error('❌ Failed to sync Substack feed:', error);
    
    // Check if cache exists
    if (fs.existsSync(CACHE_FILE)) {
      const existingCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8')) as PostsCache;
      console.log(`⚠️  Using existing cache from ${existingCache.lastSynced}`);
      console.log(`   ${existingCache.posts.length} posts in cache`);
    } else {
      console.log('⚠️  No existing cache found. Creating empty cache.');
      const emptyCache: PostsCache = {
        lastSynced: new Date().toISOString(),
        posts: [],
      };
      
      const cacheDir = path.dirname(CACHE_FILE);
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      fs.writeFileSync(CACHE_FILE, JSON.stringify(emptyCache, null, 2));
    }
    
    // Exit with 0 so builds continue even if sync fails
    process.exit(0);
  }
}

syncSubstack();
