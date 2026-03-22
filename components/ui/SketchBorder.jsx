import styles from './SketchBorder.module.css';

/**
 * CSS-only sketch border from BLOG_STANDARDS.md (primary or light variant).
 */
export default function SketchBorder({
  variant = 'primary',
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}) {
  const variantClass = variant === 'light' ? styles.light : styles.primary;
  return (
    <Tag className={`${variantClass} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
