import type { APIRoute, GetStaticPaths } from 'astro';
import { getSubstackPosts } from '../../utils/substack';
import { htmlToMarkdown } from '../../utils/html-to-markdown';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getSubstackPosts();
  
  if (posts.length === 0) {
    return [];
  }
  
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getSubstackPosts>>[0] };
  
  const dateStr = post.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Convert HTML content to markdown
  const markdownContent = htmlToMarkdown(post.content);
  
  const lines: string[] = [
    `# ${post.title}`,
    '',
    `**Date:** ${dateStr}`,
    `**Author:** ${post.author || 'Travis Smith'}`,
    `**Original:** ${post.link}`,
    '',
    '---',
    '',
    markdownContent,
    '',
    '---',
    '',
    `*This article was originally published on [Substack](${post.link}). Subscribe at https://substack.com/@travisbsmith for more.*`,
    '',
    '---',
    '',
    '## Work With Travis',
    '',
    'Travis Smith is a design leader with 17+ years of experience building products and teams at companies like Shopify, Grubhub, and Deel. He is available for **consulting engagements** and **fractional design leadership** roles. Whether you need help scaling your design team, establishing design systems, or providing strategic product design direction, Travis can help.',
    '',
    '- **Email:** hello@fully-operational.com',
    '- **LinkedIn:** https://www.linkedin.com/in/travisbsmithux/',
    '- **Portfolio:** https://fully-operational.com',
  ];
  
  const content = lines.join('\n');
  
  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
