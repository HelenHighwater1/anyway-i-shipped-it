import Link from 'next/link';
import SketchBox from '@/components/ui/SketchBox';
import SketchImageFrame from '@/components/post/SketchImageFrame';
import { getPostHref } from '@/lib/posts';
import styles from './PostCard.module.css';
/**
 * @param {{ slug: string, title: string, date: string, summary: string, thumbnail: string }} post
 * @param {'stack' | 'row'} [variant] stack = image on top (archive); row = square thumb left (home recent)
 */
export default function PostCard({ post, variant = 'stack' }) {
  const href = getPostHref(post);
  const isRow = variant === 'row';

  return (
    <Link
      href={href}
      className={`${styles.cardLink} ${isRow ? styles.cardLinkRow : ''}`}
    >
      <SketchBox
        className={`${styles.cardInner} ${isRow ? styles.cardInnerRow : ''}`}
        contentClassName={isRow ? styles.sketchContentRow : ''}
      >
        <div className={isRow ? styles.thumbWrapRow : styles.thumbWrap}>
          <SketchImageFrame
            src={post.thumbnail}
            alt={post.title}
            variant={isRow ? 'row' : 'stack'}
          />
        </div>
        {isRow ? (
          <div className={styles.metaCol}>
            <h3 className={styles.title}>{post.title}</h3>
            <p className={styles.date}>{post.date}</p>
            <p className={styles.summary}>{post.summary}</p>
          </div>
        ) : (
          <>
            <h3 className={styles.title}>{post.title}</h3>
            <p className={styles.date}>{post.date}</p>
            <p className={styles.summary}>{post.summary}</p>
          </>
        )}
      </SketchBox>
    </Link>
  );
}
