'use client';

import { useEffect, useRef } from 'react';
import styles from './VideoPlayer.module.css';

/**
 * BLOG_STANDARDS.md - MP4: autoPlay, loop, muted, playsInline, no controls.
 * On viewports under 768px, autoplay is disabled (resize-aware) per mobile guidance.
 */
export default function VideoPlayer({
  src,
  className = '',
  poster,
  webmSrc,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const mql = window.matchMedia('(min-width: 768px)');

    const apply = () => {
      if (mql.matches) {
        video.muted = true;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  return (
    <div className={`${styles.wrap} ${className}`.trim()}>
      <video
        ref={ref}
        className={styles.video}
        loop
        muted
        playsInline
        controls={false}
        poster={poster}
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
      >
        <source src={src} type="video/mp4" />
        {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
      </video>
    </div>
  );
}
