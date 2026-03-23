import SketchPanel from '@/components/ui/SketchPanel';
import styles from './layout.module.css';

/**
 * Mechanize: sketch panel frame for the post body.
 * Site chrome (header + nav) lives in `app/(site)/layout.jsx` via `SiteBlogChrome`.
 * `title` and `date` come from meta.json (passed by the dynamic post page).
 */
export default function PostLayout({ children, title, date }) {
  return (
    <SketchPanel
      className={[styles.postPanel, 'animateFadeIn'].filter(Boolean).join(' ')}
      contentClassName={styles.postSketchContent}
    >
      <article className={styles.frameRoot}>
        {title ? <h1 className={styles.postTitle}>{title}</h1> : null}
        {date ? (
          <p className={styles.postDate} aria-label="Published date">
            {date}
          </p>
        ) : null}
        {children}
      </article>
    </SketchPanel>
  );
}
