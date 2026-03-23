import SketchBox from '@/components/ui/SketchBox';
import VideoPlayer from '@/components/post/VideoPlayer';
import styles from './MdxPostVideo.module.css';

/**
 * MDX: centered post video (BLOG_STANDARDS: loop, muted, no mobile autoplay).
 * Optional `stamp` src overlays an image on the top-right corner.
 */
export default function MdxPostVideo({ src, poster, stamp, stampAlt }) {
  if (!src || typeof src !== 'string') return null;

  return (
    <div className={styles.root}>
      <SketchBox
        className={styles.frame}
        contentClassName={styles.inner}
        transparentSketchFill
      >
        <VideoPlayer src={src} poster={poster} />
      </SketchBox>
      {stamp && (
        <img
          src={stamp}
          alt={stampAlt ?? ''}
          className={styles.stamp}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
