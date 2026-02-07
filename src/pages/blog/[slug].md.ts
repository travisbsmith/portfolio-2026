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
  ];
  
  const content = lines.join('\n');
  
  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
