import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Keep canonicals, sitemap, and robots on the public domain, including preview builds.
const site = process.env.SITE || 'https://ditheryuki.com';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.endsWith('/404/'),
      changefreq: 'weekly',
      lastmod: new Date(),
      serialize(item) {
        const path = new URL(item.url).pathname;
        const priority =
          path === '/' ? 1.0
          : path.startsWith('/dithering') || path.startsWith('/review') ? 0.9
          : path.startsWith('/diary') ? 0.8
          : 0.5;
        return { ...item, priority };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
