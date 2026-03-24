'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './VideoPlayer.module.css';

/** ~35% of the player must be visible before muted autoplay kicks in */
const SCROLL_PLAY_THRESHOLD = 0.35;

/**
 * BLOG_STANDARDS.md - MP4: loop, muted, playsInline; no controls on desktop.
 * Playback starts when the player scrolls into view (muted = mobile autoplay-friendly).
 * Under 768px: native controls stay available for pause / scrub / replay.
 */
export default function VideoPlayer({
  src,
  className = '',
  poster,
  webmSrc,
}) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const wrap = wrapRef.current;
    if (!video || !wrap) return;

    const mql = window.matchMedia('(min-width: 768px)');

    const applyViewport = () => {
      if (mql.matches) {
        setShowControls(false);
      } else {
        setShowControls(true);
      }
      video.muted = true;
    };

    applyViewport();
    mql.addEventListener('change', applyViewport);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= SCROLL_PLAY_THRESHOLD) {
          video.muted = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, SCROLL_PLAY_THRESHOLD, 0.5, 0.75, 1] }
    );

    observer.observe(wrap);

    return () => {
      mql.removeEventListener('change', applyViewport);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`${styles.wrap} ${className}`.trim()}
    >
      <video
        ref={videoRef}
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
