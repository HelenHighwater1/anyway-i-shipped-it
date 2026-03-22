import styles from './AnnotationCallout.module.css';

/**
 * Sticky-note-style aside from BLOG_STANDARDS.md.
 */
export default function AnnotationCallout({
  children,
  centerArrow = false,
  className = '',
  ...rest
}) {
  return (
    <div
      className={`${styles.annotationCallout} ${centerArrow ? styles.calloutCenter : ''} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
