import { Children } from 'react';
import MdxImageLightbox from '@/components/post/MdxImageLightbox';
import SketchImageFrame from '@/components/post/SketchImageFrame';
import styles from './MdxMediaAside.module.css';

/**
 * MDX: floated sketch-framed image with prose wrapping beside it on desktop;
 * narrow viewports stack copy first, then image + caption.
 *
 * @param {'right' | 'left'} [side]
 * @param {'default' | 'small' | 'wide'} [size] small = narrow rail; wide = a bit wider than default
 * @param {boolean} [splitLead] First child full-width above the float; remaining children wrap beside the image
 * @param {string} [caption] Optional line under the image
 */
export default function MdxMediaAside({
  side = 'right',
  size = 'default',
  splitLead = false,
  src,
  alt,
  caption,
  children,
  priority = false,
}) {
  if (!src || typeof src !== 'string') return children ?? null;

  const nodes = Children.toArray(children).filter(
    (c) =>
      c != null &&
      c !== false &&
      !(typeof c === 'string' && !c.trim())
  );
  const useSplit =
    splitLead && nodes.length >= 2;
  const lead = useSplit ? nodes[0] : null;
  const proseNodes = useSplit ? nodes.slice(1) : nodes;

  const sideClass = side === 'left' ? styles.mediaLeft : styles.mediaRight;
  const sizeClass =
    size === 'small'
      ? styles.mediaSmall
      : size === 'wide'
        ? styles.mediaWide
        : '';
  const mediaClass = [styles.media, sideClass, sizeClass]
    .filter(Boolean)
    .join(' ');

  const frameVariant =
    size === 'small' ? 'asideCompact' : size === 'wide' ? 'asideWide' : 'aside';

  return (
    <div className={styles.root}>
      {lead ? <div className={styles.lead}>{lead}</div> : null}
      <div className={styles.aside}>
        <figure className={mediaClass}>
          <MdxImageLightbox src={src} alt={alt ?? ''}>
            <SketchImageFrame
              variant={frameVariant}
              src={src}
              alt={alt ?? ''}
              priority={priority}
            />
          </MdxImageLightbox>
          {caption ? (
            <figcaption className={styles.caption}>{caption}</figcaption>
          ) : null}
        </figure>
        <div className={styles.prose}>{proseNodes}</div>
      </div>
    </div>
  );
}
