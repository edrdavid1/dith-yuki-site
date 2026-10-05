import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://ditheryuki.com');
  const sitemapUrl = new URL('/sitemap-index.xml', origin);
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /cdn-cgi/',
    '',
    `Sitemap: ${sitemapUrl.href}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
