import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, render } from 'astro:content';

export const getStaticPaths: GetStaticPaths = async () => {
  const workEntries = await getCollection('work');
  
  return workEntries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as { entry: Awaited<ReturnType<typeof getCollection<'work'>>>[0] };
  
  // Get the raw markdown content
  const { remarkPluginFrontmatter } = await render(entry);
  
  const lines: string[] = [
    `# ${entry.data.title}`,
    '',
    `**Company:** ${entry.data.company}`,
    `**Tags:** ${entry.data.tags.join(', ')}`,
    '',
    `> ${entry.data.description}`,
    '',
    '---',
    '',
  ];
  
  // The entry.body contains the raw markdown content
  if (entry.body) {
    lines.push(entry.body);
  }
  
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(`*View the full case study at https://fully-operational.com/work/${entry.id}/*`);
  
  const content = lines.join('\n');
  
  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
