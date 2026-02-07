import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Remove Substack-specific elements that don't translate well
turndownService.addRule('removeSubscribeButtons', {
  filter: (node) => {
    const className = node.getAttribute?.('class') || '';
    return (
      className.includes('subscribe') ||
      className.includes('captioned-button') ||
      className.includes('subscription')
    );
  },
  replacement: () => '',
});

// Clean up image handling
turndownService.addRule('images', {
  filter: 'img',
  replacement: (content, node) => {
    const alt = (node as HTMLImageElement).alt || '';
    const src = (node as HTMLImageElement).src || '';
    if (!src) return '';
    return `![${alt}](${src})`;
  },
});

/**
 * Convert HTML content to clean Markdown
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return '';
  
  // Pre-process: remove script and style tags
  const cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/&nbsp;/g, ' ');
  
  const markdown = turndownService.turndown(cleaned);
  
  // Post-process: clean up extra whitespace
  return markdown
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Strip HTML tags to plain text (for excerpts)
 */
export function htmlToPlainText(html: string): string {
  if (!html) return '';
  
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
