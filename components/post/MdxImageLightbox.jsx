'use client';

import { useCallback, useRef } from 'react';
import styles from './MdxImageLightbox.module.css';

/**
 * Click (or Enter/Space on focus) opens a native dialog with a larger image.
 */
export default function MdxImageLightbox({ src, alt, children }) {
  const dialogRef = useRef(null);

  const open = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const onTriggerKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    },
    [open]
  );

  const onBackdropClick = useCallback(() => {
    close();
  }, [close]);

  return (
    <>
      <div
        className={styles.trigger}
        onClick={open}
        onKeyDown={onTriggerKeyDown}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-label="View larger image"
      >
        {children}
      </div>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label="Enlarged image"
      >
        <div
          className={styles.dialogFill}
          onClick={onBackdropClick}
          role="presentation"
        >
          <div
            className={styles.dialogInner}
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <button
              type="button"
              className={styles.close}
              onClick={close}
              aria-label="Close enlarged image"
            >
              Close
            </button>
            <img src={src} alt={alt ?? ''} className={styles.lightboxImg} />
          </div>
        </div>
      </dialog>
    </>
  );
}
