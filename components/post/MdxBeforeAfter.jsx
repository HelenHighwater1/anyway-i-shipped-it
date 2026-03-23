'use client';

import { useCallback, useRef } from 'react';
import dialogStyles from './MdxImageLightbox.module.css';
import styles from './MdxBeforeAfter.module.css';

/**
 * MDX: sketch-style link that opens a dialog with two images side by side (same height).
 */
export default function MdxBeforeAfter({
  beforeSrc,
  beforeAlt,
  afterSrc,
  afterAlt,
  label,
}) {
  const dialogRef = useRef(null);

  const open = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  if (!beforeSrc || !afterSrc || !label) return null;

  const dialogLabel =
    beforeAlt && afterAlt
      ? `Before and after: ${beforeAlt}; ${afterAlt}`
      : 'Before and after comparison';

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
        aria-label={dialogLabel}
      >
        <div
          className={dialogStyles.dialogFill}
          onClick={close}
          role="presentation"
        >
          <div
            className={`${dialogStyles.dialogInner} ${styles.dialogInnerWide}`}
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <button
              type="button"
              className={dialogStyles.close}
              onClick={close}
              aria-label="Close comparison"
            >
              Close
            </button>
            <div className={styles.pair}>
              {/* eslint-disable-next-line @next/next/no-img-element -- lightbox; paths from post assets */}
              <img
                src={beforeSrc}
                alt={beforeAlt ?? 'Before'}
                className={styles.pairImg}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={afterSrc}
                alt={afterAlt ?? 'After'}
                className={styles.pairImg}
              />
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
