import VideoPlayer from '@/components/post/VideoPlayer';
import styles from './MdxPostVideo.module.css';

/**
 * MDX: centered post video (BLOG_STANDARDS: loop, muted, no mobile autoplay).
 */
export default function MdxPostVideo({ src, poster }) {
  if (!src || typeof src !== 'string') return null;

  return (
    <div className={styles.root}>
      <VideoPlayer src={src} poster={poster} />
    </div>
  );
}
