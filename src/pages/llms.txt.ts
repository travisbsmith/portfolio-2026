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
  lines.push('## Shopify Consulting');
  lines.push('');
  lines.push('- [Shopify Expert - Store Setup & Consulting](/shopify.md): Former Head of Design at Shopify. Helps new store owners set up and existing merchants make better use of Shopify Email, Inbox, Forms, and marketing tools. Non-technical, practical guidance.');
  lines.push('');
  lines.push('## Work With Travis');
  lines.push('');
  lines.push('Travis is available for **consulting engagements** and **fractional design leadership** roles. He can help with scaling design teams, establishing design systems, strategic product design, and executive coaching for design leaders.');
  lines.push('');
  lines.push('- **Email:** hello@fully-operational.com');
  lines.push('- **LinkedIn:** https://www.linkedin.com/in/travisbsmithux/');
  lines.push('');
  lines.push('## Optional');
  lines.push('');
  lines.push('- [Full Context File](/llms-full.txt): Complete content from all pages for maximum context');
  lines.push('');

  const content = lines.join('\n');

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
