import MdxImageLightbox from '@/components/post/MdxImageLightbox';
import SketchImageFrame from '@/components/post/SketchImageFrame';
import styles from './MdxCenterFigure.module.css';

/**
 * MDX: centered sketch-framed image, optional caption, click-to-enlarge lightbox.
 *
 * @param {'default' | 'large'} [size] large = wider frame and taller image cap
 */
export default function MdxCenterFigure({
  src,
  alt,
  caption,
  priority = false,
  size = 'default',
}) {
  if (!src || typeof src !== 'string') return null;

  const rootClass =
    size === 'large'
      ? `${styles.root} ${styles.rootLarge}`
      : styles.root;
  const frameVariant = size === 'large' ? 'stackLarge' : 'stack';

  return (
    <figure className={rootClass}>
      <div className={styles.frameWrap}>
        <MdxImageLightbox src={src} alt={alt ?? ''}>
          <SketchImageFrame
            variant={frameVariant}
            src={src}
            alt={alt ?? ''}
            priority={priority}
          />
        </MdxImageLightbox>
      </div>
      {caption ? (
        <figcaption className={styles.caption}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
