/**
 * Ping IndexNow to notify Bing (and ChatGPT) about updated pages
 * 
 * IndexNow instantly notifies search engines about new or updated content.
 * Bing powers ChatGPT's web search, so this helps ChatGPT find your content.
 * 
 * Usage: npx tsx scripts/ping-indexnow.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const INDEXNOW_KEY = 'fa77b9db261c1dec62f1d7a0dbb208bf';
const SITE_URL = 'https://fully-operational.com';

async function pingIndexNow(): Promise<void> {
  console.log('🔔 Pinging IndexNow (Bing/ChatGPT)...');

  // Collect all URLs from the built site
  const distDir = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist/ directory not found. Run `npm run build` first.');
    process.exit(0);
    return;
  }

  const urls: string[] = [];
  
  function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (
        entry.name === 'index.html' ||
        entry.name.endsWith('.txt') ||
        entry.name.endsWith('.md')
      ) {
        const relativePath = fullPath
          .replace(distDir, '')
          .replace('/index.html', '/')
          .replace(/\\/g, '/');
        urls.push(`${SITE_URL}${relativePath}`);
      }
    }
  }
  
  walkDir(distDir);

  // Filter out dashboard and assets
  const filteredUrls = urls.filter(url => 
    !url.includes('/dashboard') && 
    !url.includes('/_assets') &&
    !url.includes('/fa77b9db')
  );

  console.log(`   Found ${filteredUrls.length} URLs to submit`);

  try {
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'fully-operational.com',
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: filteredUrls,
      }),
    });

    if (response.ok || response.status === 202) {
      console.log(`✅ IndexNow pinged successfully (${response.status})`);
      console.log('   Bing, Yandex, and other engines notified');
    } else {
      const text = await response.text();
      console.error(`⚠️  IndexNow returned ${response.status}: ${text}`);
    }
  } catch (error) {
    console.error('❌ Failed to ping IndexNow:', error);
    // Don't fail the build
    process.exit(0);
  }
}

pingIndexNow();
