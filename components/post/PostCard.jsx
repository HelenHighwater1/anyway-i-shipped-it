import Link from 'next/link';
import SketchBox from '@/components/ui/SketchBox';
import PolaroidFrame from '@/components/post/PolaroidFrame';
import styles from './PostCard.module.css';

/** Thumbnail display size for PolaroidFrame / next/image (aspect matches workflow SVG 936×426). */
const THUMB_WIDTH = 468;
const THUMB_HEIGHT = 213;

/**
 * @param {{ slug: string, title: string, date: string, summary: string, thumbnail: string }} post
 */
export default function PostCard({ post }) {
  const href = `/posts/${post.slug}`;

  return (
    <Link href={href} className={styles.cardLink}>
      <SketchBox className={styles.cardInner}>
        <div className={styles.thumbWrap}>
          <PolaroidFrame
            src={post.thumbnail}
            alt={post.title}
            width={THUMB_WIDTH}
            height={THUMB_HEIGHT}
          />
        </div>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.date}>{post.date}</p>
        <p className={styles.summary}>{post.summary}</p>
      </SketchBox>
    </Link>
  );
}
