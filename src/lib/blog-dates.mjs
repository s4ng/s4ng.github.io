import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIR = 'src/content/blog';

/** Pull the `date:` value out of a markdown file's frontmatter block. */
function readDate(file) {
  const frontmatter = fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) return null;

  const match = frontmatter[1].match(/^date:\s*(.+)$/m);
  if (!match) return null;

  const date = new Date(match[1].trim().replace(/^['"]|['"]$/g, ''));
  return Number.isNaN(date.valueOf()) ? null : date;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.md') ? [full] : [];
  });
}

/**
 * Map each blog post's URL path to its publish date, for sitemap <lastmod>.
 * astro.config.mjs cannot import `astro:content`, so frontmatter is read off
 * disk instead; the slug rules mirror the glob loader's ids (see toSlug).
 */
export function blogLastmod() {
  const dates = new Map();
  if (!fs.existsSync(BLOG_DIR)) return dates;

  for (const file of walk(BLOG_DIR)) {
    const date = readDate(file);
    if (!date) continue;

    const slug = path
      .relative(BLOG_DIR, file)
      .split(path.sep)
      .join('/')
      .replace(/\.md$/, '')
      .replace(/\/index$/, '');
    dates.set(`/blog/${slug}/`, date);
  }

  // The homepage lists every post, so it is as fresh as the newest one.
  const newest = [...dates.values()].sort((a, b) => b.valueOf() - a.valueOf())[0];
  if (newest) dates.set('/', newest);

  return dates;
}
