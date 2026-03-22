import SketchPanel from '@/components/ui/SketchPanel';
import styles from './layout.module.css';

/**
 * Mechanize: sketch panel frame for the post body.
 * Site chrome (header + nav) lives in `app/(site)/layout.jsx` via `SiteBlogChrome`.
 * `title` comes from meta.json (passed by the dynamic post page).
 */
export default function PostLayout({ children, title }) {
  return (
    <SketchPanel
      className={[styles.postPanel, 'animateFadeIn'].filter(Boolean).join(' ')}
      contentClassName={styles.postSketchContent}
    >
      <article className={styles.frameRoot}>
        {title ? <h1 className={styles.postTitle}>{title}</h1> : null}
        {children}
      </article>
    </SketchPanel>
  );
}
