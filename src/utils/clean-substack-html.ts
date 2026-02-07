/**
 * Clean Substack HTML by removing subscription widgets and forms
 * 
 * Substack embeds various subscription prompts in their RSS content.
 * We remove these since the site has its own subscribe links.
 */
export function cleanSubstackHtml(html: string): string {
  if (!html) return '';
  
  let cleaned = html;
  
  // Remove subscription widget containers
  cleaned = cleaned.replace(
    /<div[^>]*class="[^"]*subscription-widget[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    ''
  );
  
  // Remove captioned button wraps (Substack CTA buttons)
  cleaned = cleaned.replace(
    /<div[^>]*class="[^"]*captioned-button[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    ''
  );
  
  // Remove subscribe forms
  cleaned = cleaned.replace(
    /<form[^>]*>[\s\S]*?<\/form>/gi,
    ''
  );
  
  // Remove button wrappers with subscribe buttons
  cleaned = cleaned.replace(
    /<div[^>]*class="[^"]*button-wrapper[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
    ''
  );
  
  // Remove "Thanks for reading" paragraphs that precede subscription forms
  cleaned = cleaned.replace(
    /<p[^>]*>Thanks for reading[^<]*Subscribe[^<]*<\/p>/gi,
    ''
  );
  
  // Remove standalone subscribe prompts
  cleaned = cleaned.replace(
    /<p[^>]*>Subscribe for free[^<]*<\/p>/gi,
    ''
  );
  
  // Remove empty paragraphs left behind
  cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/gi, '');
  
  // Clean up excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  return cleaned.trim();
}
