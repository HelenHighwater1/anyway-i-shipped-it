import Link from 'next/link';
import { getAdjacentPosts } from '@/lib/posts';
import styles from './PostNav.module.css';

/**
 * Previous / next links from sorted meta under each `posts/[slug]/` folder (newest first).
 */
export default function PostNav({ slug, className = '' }) {
  const { prev, next } = getAdjacentPosts(slug);
  if (!prev && !next) return null;

  const navClass = [styles.nav, className].filter(Boolean).join(' ');

  return (
    <nav className={navClass} aria-label="Post navigation">
      {prev ? (
        <Link href={'/posts/' + prev.slug} className={styles.sketchLink}>
          Previous: {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={'/posts/' + next.slug} className={styles.sketchLink}>
          Next: {next.title}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
