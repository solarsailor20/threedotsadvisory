// Zero-dependency static site build.
//   node build.mjs   → writes the site to dist/
//
// - Copies everything in public/ to dist/ as-is.
// - Wraps each page in src/pages/ with src/layout.html (shared header + footer).
// - Writes sitemap.xml from the indexable pages.
//
// Page files start with a comment block of `key: value` lines:
//   title, description, path (URL), nav (home|approach|about|contact|none), robots (optional)

import { readFile, writeFile, mkdir, readdir, rm, cp } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'https://threedotsadvisory.com';
const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'dist');
const version = new Date().toISOString().slice(0, 10).replace(/-/g, '');

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function parsePage(source, file) {
  const m = source.match(/^<!--\n([\s\S]*?)\n-->\n/);
  if (!m) throw new Error(`${file}: missing front-matter comment`);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const key of ['title', 'description', 'path', 'nav']) {
    if (!meta[key]) throw new Error(`${file}: missing "${key}"`);
  }
  return { meta, body: source.slice(m[0].length) };
}

function render(layout, { meta, body }) {
  const url = ORIGIN + meta.path.replace(/index\.html$/, '');
  let html = layout
    .replaceAll('{{title}}', escapeAttr(meta.title))
    .replaceAll('{{description}}', escapeAttr(meta.description))
    .replaceAll('{{robots}}', meta.robots || 'index, follow')
    .replaceAll('{{url}}', url)
    .replaceAll('{{origin}}', ORIGIN)
    .replaceAll('{{version}}', version)
    .replace('{{content}}', () => body.trim());
  // Mark the current page in the header nav.
  html = html.replace(/ data-nav="([a-z]+)"/g, (_, nav) => (nav === meta.nav ? ' aria-current="page"' : ''));
  return html;
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(join(root, 'public'), out, { recursive: true });

const layout = await readFile(join(root, 'src/layout.html'), 'utf8');
const pageFiles = (await readdir(join(root, 'src/pages'))).filter((f) => f.endsWith('.html')).sort();
const sitemap = [];

for (const file of pageFiles) {
  const page = parsePage(await readFile(join(root, 'src/pages', file), 'utf8'), file);
  const { path } = page.meta;
  const target = path.endsWith('/') ? join(out, path, 'index.html') : join(out, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, render(layout, page));
  if (!/noindex/.test(page.meta.robots || '')) sitemap.push(ORIGIN + path);
  console.log(`  ${path.padEnd(14)} ← src/pages/${file}`);
}

const today = new Date().toISOString().slice(0, 10);
await writeFile(
  join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemap.map((loc) => `  <url><loc>${loc}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
    `\n</urlset>\n`
);
console.log(`Built ${pageFiles.length} pages → dist/`);
