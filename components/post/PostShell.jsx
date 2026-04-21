import SketchPanel from '@/components/ui/SketchPanel';
import styles from './PostShell.module.css';

/**
 * Shared sketch-panel shell for post bodies (title, date, MDX children).
 * Per-post `layout.jsx` can delegate here; pass `className` / `contentClassName`
 * for post-specific SketchPanel tweaks when needed.
 */
export default function PostShell({
  children,
  title,
  date,
  className,
  contentClassName,
}) {
  const panelClass = [styles.postPanel, 'animateFadeIn', className]
    .filter(Boolean)
    .join(' ');
  const panelContent = [styles.postSketchContent, contentClassName]
    .filter(Boolean)
    .join(' ');

  return (
    <SketchPanel className={panelClass} contentClassName={panelContent}>
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
