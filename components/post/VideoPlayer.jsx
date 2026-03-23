'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './VideoPlayer.module.css';

/**
 * BLOG_STANDARDS.md - MP4: autoPlay, loop, muted, playsInline, no controls on desktop.
 * Under 768px: no autoplay; native controls so users can tap to play (iOS/Safari).
 */
export default function VideoPlayer({
  src,
  className = '',
  poster,
  webmSrc,
}) {
  const ref = useRef(null);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const mql = window.matchMedia('(min-width: 768px)');

    const apply = () => {
      if (mql.matches) {
        setShowControls(false);
        video.muted = true;
        video.play().catch(() => {});
      } else {
        setShowControls(true);
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
        controls={showControls}
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
