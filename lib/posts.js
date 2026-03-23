import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'posts');

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * @param {unknown} date
 */
export function isValidDateSegment(date) {
  return typeof date === 'string' && ISO_DATE.test(date);
}

/**
 * Canonical path for a post page (folder slug only).
 * @param {{ slug: string }} post
 */
export function getPostHref(post) {
  if (!post?.slug) return '/posts';
  return `/posts/${post.slug}`;
}

/**
 * Human-readable date for display (from meta.json `date` YYYY-MM-DD).
 * @param {unknown} iso
 * @returns {string | null}
 */
export function formatPostDate(iso) {
  if (!iso || typeof iso !== 'string' || !isValidDateSegment(iso)) return null;
  const [y, m, d] = iso.split('-').map((n) => Number(n));
  if (!y || !m || !d) return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

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

/** Superseded dated paths from earlier URL experiments; keep redirects so bookmarks work. */
const LEGACY_DATED_PATH_SUPPLEMENT = [
  { source: '/posts/2025-03-22/mechanize', destination: '/posts/mechanize', permanent: true },
  { source: '/posts/2026-03-22/mechanize', destination: '/posts/mechanize', permanent: true },
];

/**
 * Redirect old dated URLs `/posts/[date]/[slug]` → `/posts/[slug]` (bookmarks, shared links).
 * @returns {Array<{ source: string, destination: string, permanent: boolean }>}
 */
export function getLegacyDatedUrlRedirects() {
  if (!fs.existsSync(POSTS_DIR)) return [...LEGACY_DATED_PATH_SUPPLEMENT];

  const dirs = fs
    .readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const out = [];
  for (const slug of dirs) {
    if (slug.startsWith('_') || slug.startsWith('.')) continue;

    const metaPath = path.join(POSTS_DIR, slug, 'meta.json');
    if (!fs.existsSync(metaPath)) continue;
    try {
      const raw = fs.readFileSync(metaPath, 'utf8');
      const meta = JSON.parse(raw);
      const date = meta?.date;
      if (!isValidDateSegment(date)) continue;
      out.push({
        source: `/posts/${date}/${slug}`,
        destination: `/posts/${slug}`,
        permanent: true,
      });
    } catch {
      /* skip */
    }
  }
  return [...LEGACY_DATED_PATH_SUPPLEMENT, ...out];
}
