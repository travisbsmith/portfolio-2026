// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://fully-operational.com',
  output: 'static',
  build: {
    assets: '_assets'
  },
  integrations: [
    sitemap({
      // Include .md and .txt endpoints for AI crawlers
      customPages: [
        'https://fully-operational.com/llms.txt',
        'https://fully-operational.com/llms-full.txt',
        'https://fully-operational.com/about.md',
      ],
      filter: (page) => !page.includes('/dashboard'),
    }),
  ],
});
