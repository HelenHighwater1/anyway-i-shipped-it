import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'posts');

/**
 * @returns {Array<{ slug: string, title: string, date: string, summary?: string, thumbnail?: string, url?: string }>}
 */
export function getSortedPostsMeta() {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const dirs = fs
    .readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const metas = [];
  for (const slug of dirs) {
    if (slug.startsWith('_') || slug.startsWith('.')) continue;

    const metaPath = path.join(POSTS_DIR, slug, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;
    try {
      const raw = fs.readFileSync(metaPath, 'utf8');
      const meta = JSON.parse(raw);
      if (meta?.published === false) continue;
      if (meta?.slug) metas.push(meta);
    } catch {
      /* skip invalid */
    }
  }

  metas.sort((a, b) => {
    const byDate = String(b.date).localeCompare(String(a.date));
    if (byDate !== 0) return byDate;
    return String(a.slug).localeCompare(String(b.slug));
  });

  return metas;
}

/**
 * Sorted newest-first: "Previous" → older post, "Next" → newer post.
 * @param {string} currentSlug
 */
export function getAdjacentPosts(currentSlug) {
  const sorted = getSortedPostsMeta();
  const i = sorted.findIndex((p) => p.slug === currentSlug);
  if (i === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: i < sorted.length - 1 ? sorted[i + 1] : null,
    next: i > 0 ? sorted[i - 1] : null,
  };
}
