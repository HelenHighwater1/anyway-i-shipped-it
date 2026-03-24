'use client';

import { useEffect, useRef } from 'react';
import styles from './VideoPlayer.module.css';

/** ~35% of the player must be visible before muted autoplay kicks in */
const SCROLL_PLAY_THRESHOLD = 0.35;

/**
 * BLOG_STANDARDS.md - MP4: loop, muted, playsInline, no native controls.
 * Playback starts when the player scrolls into view (muted = mobile autoplay-friendly).
 * Native controls stay off on mobile too — iOS Safari draws a dark overlay over the
 * whole video when controls are on; scroll in/out handles play/pause.
 */
export default function VideoPlayer({
  src,
  className = '',
  poster,
  webmSrc,
}) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const wrap = wrapRef.current;
    if (!video || !wrap) return;

    video.muted = true;

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
