import SketchBox from '@/components/ui/SketchBox';
import styles from './SketchImageFrame.module.css';

/**
 * Thumbnail in a Rough.js SketchBox (no polaroid mat). Image keeps natural aspect ratio.
 *
 * @param {'row' | 'stack'} [variant] row = narrow home recent; stack = full card width archive
 */
export default function SketchImageFrame({
  src,
  alt,
  variant = 'stack',
  className = '',
  priority = false,
}) {
  const wrapClass = variant === 'row' ? styles.wrapRow : styles.wrapStack;
  const imageClass = variant === 'row' ? styles.imageRow : styles.imageStack;

  return (
    <SketchBox
      className={`${wrapClass} ${className}`.trim()}
      contentClassName={`${styles.inner} ${styles.inner}`}
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
