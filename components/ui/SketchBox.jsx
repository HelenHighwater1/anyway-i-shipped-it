'use client';

import { useEffect, useRef } from 'react';
import styles from './SketchBox.module.css';

/** BLOG_STANDARDS.md - SketchBox Rough.js rectangle options */
const ROUGH_RECT = {
  stroke: '#1e1e1e',
  strokeWidth: 1.5,
  roughness: 1.0,
  bowing: 1.2,
  fill: 'rgba(255, 254, 249, 0.3)',
  fillStyle: 'solid',
};

export default function SketchBox({
  children,
  className = '',
  contentClassName = '',
  strokeColor,
  /** No cream tint inside the stroke (e.g. thumbs flush to the image) */
  transparentSketchFill = false,
}) {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg) return;

    let frame = 0;
    let alive = true;

    const paint = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(async () => {
        const rough = (await import('roughjs')).default;
        if (!alive || !wrapRef.current || !svgRef.current) return;
        const svgEl = svgRef.current;
        const rect = wrap.getBoundingClientRect();
        const width = Math.floor(rect.width);
        const height = Math.floor(rect.height);
        if (width < 4 || height < 4) return;

        svgEl.setAttribute('width', String(width));
        svgEl.setAttribute('height', String(height));
        while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

        const narrow = width < 768;
        const opts = {
          ...ROUGH_RECT,
          ...(narrow ? { roughness: 0.7, bowing: 0.7 } : {}),
          ...(transparentSketchFill ? { fill: 'transparent' } : {}),
          ...(strokeColor != null ? { stroke: strokeColor } : {}),
        };

        const rc = rough.svg(svgEl);
        svgEl.appendChild(rc.rectangle(2, 2, width - 4, height - 4, opts));
      });
    };

    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(wrap);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [strokeColor, transparentSketchFill]);

  return (
    <div ref={wrapRef} className={`${styles.sketchBox} ${className}`.trim()}>
      <svg ref={svgRef} className={styles.sketchBoxSvg} aria-hidden />
      <div
        className={`${styles.sketchBoxContent} ${contentClassName}`.trim()}
      >
        {children}
      </div>
    </div>
  );
}
