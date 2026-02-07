import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getSubstackPosts } from '../utils/substack';

export const GET: APIRoute = async () => {
  // Fetch all content
  const workEntries = await getCollection('work');
  const sortedWork = workEntries.sort((a, b) => a.data.order - b.data.order);
  const posts = await getSubstackPosts();

  // Build the llms.txt content
  const lines: string[] = [
    '# Travis Smith - Design Leader',
    '',
    '> Design leadership, product strategy, and building great teams. 17+ years building products and leading cross-functional design teams at companies like Shopify, Grubhub, and Deel.',
    '',
    'Travis Smith is a design leader based in Kansas City. He specializes in product design, design systems, and building high-performing design teams. This site contains his portfolio of work and writing on design leadership.',
    '',
    '## About',
    '',
    '- [About Travis](/about.md): Background, experience, and approach to design leadership',
    '',
    '## Case Studies',
    '',
  ];

  // Add work entries
  for (const work of sortedWork) {
    lines.push(`- [${work.data.title} - ${work.data.company}](/work/${work.id}.md): ${work.data.description}`);
  }

  lines.push('');
  lines.push('## Writing');
  lines.push('');

  // Add blog posts
  if (posts.length > 0) {
    for (const post of posts) {
      const dateStr = post.date.toISOString().split('T')[0];
      lines.push(`- [${post.title}](/blog/${post.slug}.md): ${post.excerpt} (${dateStr})`);
    }
  } else {
    lines.push('- Blog posts coming soon. Subscribe at https://substack.com/@travisbsmith');
  }

  lines.push('');
  lines.push('## Optional');
  lines.push('');
  lines.push('- [Full Context File](/llms-full.txt): Complete content from all pages for maximum context');
  lines.push('- [Contact](/contact): Get in touch for consulting, advisory, or full-time opportunities');
  lines.push('');

  const content = lines.join('\n');

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
