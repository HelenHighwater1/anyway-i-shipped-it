import SketchBox from '@/components/ui/SketchBox';
import styles from './SketchImageFrame.module.css';

/**
 * Thumbnail in a Rough.js SketchBox (no polaroid mat). Image keeps natural aspect ratio.
 *
 * @param {'row' | 'stack' | 'stackLarge' | 'aside' | 'asideWide' | 'asideCompact'} [variant]
 */
export default function SketchImageFrame({
  src,
  alt,
  variant = 'stack',
  className = '',
  priority = false,
}) {
  const wrapClass =
    variant === 'row'
      ? styles.wrapRow
      : variant === 'aside' ||
          variant === 'asideWide' ||
          variant === 'asideCompact'
        ? styles.wrapAside
        : styles.wrapStack;
  const imageClass =
    variant === 'row'
      ? styles.imageRow
      : variant === 'asideCompact'
        ? styles.imageAsideCompact
        : variant === 'asideWide'
          ? styles.imageAsideWide
          : variant === 'aside'
            ? styles.imageAside
            : variant === 'stackLarge'
              ? styles.imageStackLarge
              : styles.imageStack;

  return (
    <SketchBox
      className={`${wrapClass} ${className}`.trim()}
      contentClassName={styles.inner}
      transparentSketchFill
    >
      <div className={styles.slot}>
        <img
          src={src}
          alt={alt}
          className={imageClass}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
    </SketchBox>
  );
}
