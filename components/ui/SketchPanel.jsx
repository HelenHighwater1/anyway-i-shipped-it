'use client';

import { useEffect, useRef } from 'react';
import styles from './SketchPanel.module.css';

/**
 * Sketch Panel Rough.js rectangle - stroke/options per BLOG_STANDARDS.md;
 * fill is a slightly brighter white than the doc default for clearer contrast on the dot grid.
 */
const ROUGH_RECT = {
  stroke: '#1e1e1e',
  strokeWidth: 1.8,
  roughness: 1.2,
  bowing: 1.5,
  fill: 'rgba(255, 255, 255, 0.78)',
  fillStyle: 'solid',
};

/** Corner crosshair lines - stroke #b0aeaa per doc */
const CORNER_LINE = {
  stroke: '#b0aeaa',
  strokeWidth: 1,
  roughness: 0.8,
};

export default function SketchPanel({
  children,
  className = '',
  contentClassName = '',
  /** Omit default min-height: 60vh; panel hugs content */
  fitContent = false,
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
        if (width < 8 || height < 8) return;

        svgEl.setAttribute('width', String(width));
        svgEl.setAttribute('height', String(height));
        while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

        const narrow = width < 768;
        const rectOpts = {
          ...ROUGH_RECT,
          ...(narrow ? { roughness: 0.8, bowing: 0.8 } : {}),
        };

        const rc = rough.svg(svgEl);
        svgEl.appendChild(rc.rectangle(4, 4, width - 8, height - 8, rectOpts));

        const corners = [
          [12, 12],
          [width - 12, 12],
          [12, height - 12],
          [width - 12, height - 12],
        ];
        for (const [cx, cy] of corners) {
          svgEl.appendChild(rc.line(cx - 8, cy, cx + 8, cy, CORNER_LINE));
          svgEl.appendChild(rc.line(cx, cy - 8, cx, cy + 8, CORNER_LINE));
        }
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
  }, []);

  const innerClass = [styles.sketchPanelContent, contentClassName]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={wrapRef}
      className={[
        styles.sketchPanel,
        fitContent ? styles.sketchPanelFitContent : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <svg ref={svgRef} className={styles.sketchPanelSvg} aria-hidden />
      <div className={innerClass}>{children}</div>
    </div>
  );
}
