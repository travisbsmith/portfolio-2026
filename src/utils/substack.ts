import Parser from 'rss-parser';

// Your Substack publication URL
const SUBSTACK_FEED_URL = 'https://travisbsmith.substack.com/feed';

export interface SubstackPost {
  title: string;
  slug: string;
  date: Date;
  excerpt: string;
  content: string;
  link: string;
  author?: string;
}

/**
 * Extract a slug from the Substack post URL
 * e.g., https://travisbsmith.substack.com/p/my-post-title -> my-post-title
 */
function extractSlug(url: string): string {
  const match = url.match(/\/p\/([^/?]+)/);
  return match ? match[1] : url.split('/').pop() || 'post';
}

/**
 * Strip HTML tags and truncate to create an excerpt
 */
function createExcerpt(html: string, maxLength: number = 200): string {
  const text = html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp;
    .replace(/&amp;/g, '&')  // Replace &amp;
    .replace(/&lt;/g, '<')   // Replace &lt;
    .replace(/&gt;/g, '>')   // Replace &gt;
    .replace(/&quot;/g, '"') // Replace &quot;
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();
  
  if (text.length <= maxLength) return text;
  
  // Truncate at word boundary
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

/**
 * Fetch all posts from the Substack RSS feed
 */
export async function getSubstackPosts(): Promise<SubstackPost[]> {
  const parser = new Parser({
    customFields: {
      item: ['content:encoded', 'dc:creator'],
    },
  });

  try {
    const feed = await parser.parseURL(SUBSTACK_FEED_URL);
    
    const posts: SubstackPost[] = feed.items.map((item) => {
      const content = (item as any)['content:encoded'] || item.content || '';
      const author = (item as any)['dc:creator'] || item.creator || 'Travis Smith';
      
      return {
        title: item.title || 'Untitled',
        slug: extractSlug(item.link || ''),
        date: new Date(item.pubDate || item.isoDate || Date.now()),
        excerpt: createExcerpt(content),
        content: content,
        link: item.link || '',
        author: author,
      };
    });

    // Sort by date, newest first
    posts.sort((a, b) => b.date.getTime() - a.date.getTime());

    return posts;
  } catch (error) {
    console.error('Failed to fetch Substack feed:', error);
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
