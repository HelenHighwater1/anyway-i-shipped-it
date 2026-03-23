import SketchBox from '@/components/ui/SketchBox';
import VideoPlayer from '@/components/post/VideoPlayer';
import styles from './MdxPostVideo.module.css';

/**
 * MDX: centered post video (BLOG_STANDARDS: loop, muted, no mobile autoplay).
 */
export default function MdxPostVideo({ src, poster }) {
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
    </div>
  );
}
