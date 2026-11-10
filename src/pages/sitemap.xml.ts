import type { APIRoute } from 'astro';
import { languages, getLocalizedPath, type Lang } from '../i18n/ui';

const SITE_URL = 'https://videotrimmer.github.io';

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().split('T')[0];
  const localeKeys = Object.keys(languages) as Lang[];

  const buildUrlFull = (lang: Lang) => {
    const path = getLocalizedPath(lang);
    return `${SITE_URL}${path}`;
  };

  const xhtmlAlternates = [
    ...localeKeys.map(
      (code) =>
        `    <xhtml:link rel="alternate" hreflang="${code}" href="${buildUrlFull(code)}" />`
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`,
  ].join('\n');

  const urlEntries = localeKeys
    .map((code) => {
      const loc = buildUrlFull(code);
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '    <changefreq>weekly</changefreq>',
        '    <priority>1.0</priority>',
        xhtmlAlternates,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urlEntries,
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
