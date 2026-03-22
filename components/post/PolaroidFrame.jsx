import Image from 'next/image';
import styles from './PolaroidFrame.module.css';

/**
 * Thumbnail / screenshot frame using only documented tokens (sketch border, annotation callout surface + shadow + tilt, Sketch Box padding, optional cross-hatch “notebook” backing, Virgil caption).
 * Use `width` + `height`, or `fill` + `sizes` with a sized parent.
 */
export default function PolaroidFrame({
  src,
  alt,
  width,
  height,
  caption,
  notebook = false,
  fill = false,
  sizes,
  className = '',
  priority = false,
}) {
  if (!fill && (width == null || height == null)) {
    return null;
  }
  if (fill && sizes == null) {
    return null;
  }

  const inner = (
    <figure className={`${styles.frame} ${className}`.trim()}>
      <div className={styles.imagePad}>
        <div className={fill ? styles.imageSlotFill : styles.imageSlot}>
          {fill ? (
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              className={`${styles.image} ${styles.imageFill}`}
              priority={priority}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className={styles.image}
              priority={priority}
            />
          )}
        </div>
      </div>
      {caption ? (
        <figcaption className={styles.caption}>{caption}</figcaption>
      ) : null}
    </figure>
  );

  if (notebook) {
    return <div className={styles.notebook}>{inner}</div>;
  }

  return inner;
}
