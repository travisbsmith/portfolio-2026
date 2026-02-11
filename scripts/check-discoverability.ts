/**
 * Check AI discoverability of your portfolio site
 * 
 * Verifies that all the right signals are in place for AI agents
 * to find and index your content.
 * 
 * Usage: npx tsx scripts/check-discoverability.ts
 */

const SITE_URL = 'https://fully-operational.com';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

async function checkUrl(url: string): Promise<{ ok: boolean; status: number; contentType?: string }> {
  try {
    const res = await fetch(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DiscoverabilityChecker/1.0)' },
      redirect: 'follow',
    });
    return { ok: res.ok, status: res.status, contentType: res.headers.get('content-type') || '' };
  } catch {
    return { ok: false, status: 0 };
  }
}

async function checkContent(url: string, contains: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DiscoverabilityChecker/1.0)' },
    });
    if (!res.ok) return false;
    const text = await res.text();
    return text.includes(contains);
  } catch {
    return false;
  }
}

async function runChecks(): Promise<void> {
  console.log('🔍 Checking AI discoverability for fully-operational.com\n');
  
  const results: CheckResult[] = [];

  // 1. robots.txt
  const robots = await checkUrl(`${SITE_URL}/robots.txt`);
  if (robots.ok) {
    const hasGPTBot = await checkContent(`${SITE_URL}/robots.txt`, 'GPTBot');
    const hasSitemap = await checkContent(`${SITE_URL}/robots.txt`, 'Sitemap');
    results.push({
      name: 'robots.txt',
      status: hasGPTBot && hasSitemap ? 'pass' : 'warn',
      message: hasGPTBot && hasSitemap 
        ? 'Found with AI crawler rules and sitemap reference' 
        : `Found but missing: ${!hasGPTBot ? 'GPTBot rules' : ''} ${!hasSitemap ? 'Sitemap' : ''}`.trim(),
    });
  } else {
    results.push({ name: 'robots.txt', status: 'fail', message: 'Not found' });
  }

  // 2. Sitemap
  const sitemap = await checkUrl(`${SITE_URL}/sitemap-index.xml`);
  results.push({
    name: 'Sitemap',
    status: sitemap.ok ? 'pass' : 'fail',
    message: sitemap.ok ? 'sitemap-index.xml found' : 'Sitemap not found',
  });

  // 3. llms.txt
  const llms = await checkUrl(`${SITE_URL}/llms.txt`);
  if (llms.ok) {
    const hasWriting = await checkContent(`${SITE_URL}/llms.txt`, '## Writing');
    results.push({
      name: 'llms.txt',
      status: hasWriting ? 'pass' : 'warn',
      message: hasWriting ? 'Found with blog posts listed' : 'Found but may be missing content',
    });
  } else {
    results.push({ name: 'llms.txt', status: 'fail', message: 'Not found' });
  }

  // 4. llms-full.txt
  const llmsFull = await checkUrl(`${SITE_URL}/llms-full.txt`);
  results.push({
    name: 'llms-full.txt',
    status: llmsFull.ok ? 'pass' : 'fail',
    message: llmsFull.ok ? 'Full context file available' : 'Not found',
  });

  // 5. Markdown blog posts
  const llmsContent = await fetch(`${SITE_URL}/llms.txt`).then(r => r.text()).catch(() => '');
  const blogMdMatches = llmsContent.match(/\/blog\/[^\s)]+\.md/g) || [];
  let blogMdWorking = 0;
  for (const mdPath of blogMdMatches.slice(0, 3)) {
    const check = await checkUrl(`${SITE_URL}${mdPath}`);
    if (check.ok) blogMdWorking++;
  }
  results.push({
    name: 'Blog .md endpoints',
    status: blogMdWorking === blogMdMatches.length ? 'pass' : blogMdWorking > 0 ? 'warn' : 'fail',
    message: `${blogMdWorking}/${blogMdMatches.length} blog posts have working .md versions`,
  });

  // 6. Work .md endpoints
  const workMdMatches = llmsContent.match(/\/work\/[^\s)]+\.md/g) || [];
  let workMdWorking = 0;
  for (const mdPath of workMdMatches.slice(0, 3)) {
    const check = await checkUrl(`${SITE_URL}${mdPath}`);
    if (check.ok) workMdWorking++;
  }
  results.push({
    name: 'Work .md endpoints',
    status: workMdWorking === workMdMatches.length ? 'pass' : workMdWorking > 0 ? 'warn' : 'fail',
    message: `${workMdWorking}/${workMdMatches.length} case studies have working .md versions`,
  });

  // 7. about.md
  const aboutMd = await checkUrl(`${SITE_URL}/about.md`);
  results.push({
    name: 'about.md',
    status: aboutMd.ok ? 'pass' : 'fail',
    message: aboutMd.ok ? 'About page available in Markdown' : 'Not found',
  });

  // 8. Structured data
  const homepage = await fetch(`${SITE_URL}`).then(r => r.text()).catch(() => '');
  const hasJsonLd = homepage.includes('application/ld+json');
  results.push({
    name: 'Structured Data (JSON-LD)',
    status: hasJsonLd ? 'pass' : 'fail',
    message: hasJsonLd ? 'Found on homepage' : 'No JSON-LD found on homepage',
  });

  // 9. IndexNow key
  const indexNowKey = await checkUrl(`${SITE_URL}/fa77b9db261c1dec62f1d7a0dbb208bf.txt`);
  results.push({
    name: 'IndexNow key',
    status: indexNowKey.ok ? 'pass' : 'fail',
    message: indexNowKey.ok ? 'Key file accessible' : 'Key file not found',
  });

  // 10. OpenGraph meta tags
  const hasOg = homepage.includes('og:title') && homepage.includes('og:description');
  results.push({
    name: 'OpenGraph meta tags',
    status: hasOg ? 'pass' : 'fail',
    message: hasOg ? 'Found og:title and og:description' : 'Missing OpenGraph tags',
  });

  // Print results
  console.log('Results:');
  console.log('─'.repeat(60));
  
  let passCount = 0;
  let failCount = 0;
  let warnCount = 0;
  
  for (const result of results) {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌';
    console.log(`${icon}  ${result.name.padEnd(25)} ${result.message}`);
    if (result.status === 'pass') passCount++;
    else if (result.status === 'fail') failCount++;
    else warnCount++;
  }
  
  console.log('─'.repeat(60));
  console.log(`\n📊 Score: ${passCount}/${results.length} checks passed`);
  
  if (failCount > 0) {
    console.log(`\n🔧 ${failCount} issue(s) need fixing`);
  }
  if (warnCount > 0) {
    console.log(`⚠️  ${warnCount} warning(s) to review`);
  }
  if (passCount === results.length) {
    console.log('\n🎉 All checks passed! Your site is well-optimized for AI discovery.');
  }

  // AI discovery tips
  console.log('\n📋 Next steps for maximum AI visibility:');
  console.log('   1. Submit to Bing Webmaster Tools (powers ChatGPT search)');
  console.log('      → https://www.bing.com/webmasters');
  console.log('   2. Submit to Google Search Console (powers Gemini)');
  console.log('      → https://search.google.com/search-console');
  console.log('   3. Optional: Add Cloudflare DNS proxy (free) to track bot traffic');
  console.log('      → https://dash.cloudflare.com');
}

runChecks();
