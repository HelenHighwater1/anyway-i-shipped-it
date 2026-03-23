'use client';

import { useCallback, useRef } from 'react';
import styles from './MdxClickableImage.module.css';
import dialogStyles from './MdxImageLightbox.module.css';

/**
 * Inline text that opens a lightbox image on click.
 * Reuses the MdxImageLightbox dialog styles for visual consistency.
 */
export default function MdxClickableImage({ src, alt, label }) {
  const dialogRef = useRef(null);

  const open = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  if (!src || !label) return label ?? null;

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={open}
        aria-haspopup="dialog"
      >
        {label}
      </button>
      <dialog
        ref={dialogRef}
        className={dialogStyles.dialog}
        aria-label={alt ?? label}
      >
        <div
          className={dialogStyles.dialogFill}
          onClick={close}
          role="presentation"
        >
          <div
            className={dialogStyles.dialogInner}
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <button
              type="button"
              className={dialogStyles.close}
              onClick={close}
              aria-label="Close image"
            >
              Close
            </button>
            <img
              src={src}
              alt={alt ?? label}
              className={dialogStyles.lightboxImg}
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
