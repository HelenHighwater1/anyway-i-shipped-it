import SketchPanel from '@/components/ui/SketchPanel';
import styles from './PostShell.module.css';

/**
 * Shared sketch-panel shell for post bodies (title, date, MDX children).
 * Per-post `layout.jsx` can delegate here; pass `className` / `contentClassName`
 * for post-specific SketchPanel tweaks when needed.
 * Optional `dateInlineLink` renders a small link on the same line as `date` (e.g. skip to demo).
 */
export default function PostShell({
  children,
  title,
  date,
  dateInlineLink,
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
          dateInlineLink?.href && dateInlineLink?.label ? (
            <p className={styles.postDateRow}>
              <span className={styles.postDate} aria-label="Published date">
                {date}
              </span>
              <span className={styles.dateRowSep} aria-hidden="true">
                ·
              </span>
              <a className={styles.dateRowLink} href={dateInlineLink.href}>
                {dateInlineLink.label}
              </a>
            </p>
          ) : (
            <p className={styles.postDate} aria-label="Published date">
              {date}
            </p>
          )
        ) : null}
        {children}
      </article>
    </SketchPanel>
  );
}
