import SketchBox from '@/components/ui/SketchBox';
import VideoPlayer from '@/components/post/VideoPlayer';
import styles from './MdxPostVideo.module.css';

/**
 * MDX: centered post video (BLOG_STANDARDS: loop, muted, scroll-into-view play).
 * Optional `stamp` src overlays an image on the top-right corner.
 * Optional `href` wraps the player so the framed video is a link (e.g. to the live site).
 */
export default function MdxPostVideo({ src, poster, stamp, stampAlt, href }) {
  if (!src || typeof src !== 'string') return null;

  const frame = (
    <SketchBox
      className={styles.frame}
      contentClassName={styles.inner}
      transparentSketchFill
    >
      <VideoPlayer src={src} poster={poster} />
    </SketchBox>
  );

  return (
    <div className={styles.root}>
      {href ? (
        <a
          href={href}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {frame}
        </a>
      ) : (
        frame
      )}
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
