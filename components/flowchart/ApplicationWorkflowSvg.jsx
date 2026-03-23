'use client';

import { useInView } from 'framer-motion';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { APPLICATION_WORKFLOW_SVG_RAW } from './applicationWorkflowSvgSource.js';
import styles from './ApplicationWorkflowSvg.module.css';

/**
 * Strip XML/DOCTYPE, remove fixed width/height from <svg>, add preserveAspectRatio.
 * No DOMParser/XMLSerializer - roundtripping breaks empty <mask> tags in Excalidraw exports.
 */
function cleanSvgString(raw) {
  let s = raw
    .replace(/<\?xml[^?]*\?>\s*/gi, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '');
  return s.replace(/<svg\b([^>]*)>/i, (_match, attrs) => {
    let a = attrs
      .replace(/\s+width\s*=\s*["'][^"']*["']/gi, '')
      .replace(/\s+height\s*=\s*["'][^"']*["']/gi, '');
    const hasPA = /\bpreserveAspectRatio\s*=/i.test(a);
    const extra = hasPA ? '' : ' preserveAspectRatio="xMidYMid meet"';
    return `<svg${a}${extra}>`;
  });
}

/** Synchronous at module load - no fetch, first render always has markup. */
const INITIAL_SVG_HTML = cleanSvgString(APPLICATION_WORKFLOW_SVG_RAW);

/** Opacity transition - longer + smoother than a snap so stagger reads as fade-in. */
const FADE_TRANSITION =
  'opacity 0.85s cubic-bezier(0.33, 1, 0.68, 1)';

/** Landing workflow diagram with staggered reveal (top-level `<g>` order matches exported SVG). */
export default function ApplicationWorkflowSvg({
  className = '',
  stepBatch = 2,
  /** Time between reveal steps; slightly longer default so fades can overlap softly. */
  stepDelayMs = 320,
  ariaLabel = 'Diagram of a job application routine from finding a listing through applying, waiting, and outcomes.',
}) {
  const wrapRef = useRef(null);
  const hostRef = useRef(null);
  const animDone = useRef(false);
  const reducedMotion = useRef(false);
  const groupsRef = useRef([]);

  const [svgPrepared, setSvgPrepared] = useState(false);
  const [totalSteps, setTotalSteps] = useState(0);
  const [visibleMax, setVisibleMax] = useState(0);

  const inView = useInView(wrapRef, { once: true, margin: '-12% 0px' });

  /** Stable reference so React does not tear down/reparse SVG on parent re-renders. */
  const svgHtmlPayload = useMemo(
    () => ({ __html: INITIAL_SVG_HTML }),
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    reducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  }, []);

  useLayoutEffect(() => {
    if (!hostRef.current) {
      setSvgPrepared(false);
      return;
    }
    const svg = hostRef.current.querySelector('svg');
    if (!svg) {
      setSvgPrepared(false);
      return;
    }

    const gs = [];
    for (const el of Array.from(svg.children)) {
      if (el.tagName.toLowerCase() !== 'g') continue;
      el.setAttribute('opacity', '0');
      el.style.setProperty('opacity', '0');
      el.style.setProperty('transition', FADE_TRANSITION);
      gs.push(el);
    }

    groupsRef.current = gs;
    setTotalSteps(gs.length);
    setVisibleMax(0);
    animDone.current = false;
    setSvgPrepared(true);
  }, []);

  const reveal = useCallback((upTo) => {
    groupsRef.current.forEach((el, i) => {
      const on = i < upTo;
      const v = on ? '1' : '0';
      el.setAttribute('opacity', v);
      el.style.setProperty('opacity', v);
    });
  }, []);

  useEffect(() => {
    if (!svgPrepared || totalSteps === 0 || groupsRef.current.length === 0) {
      return;
    }
    if (reducedMotion.current || animDone.current) {
      reveal(totalSteps);
    } else {
      reveal(visibleMax);
    }
  }, [visibleMax, totalSteps, svgPrepared, reveal]);

  useEffect(() => {
    if (!svgPrepared || !inView || animDone.current || totalSteps === 0) {
      return;
    }
    if (reducedMotion.current) {
      setVisibleMax(totalSteps);
      animDone.current = true;
      return;
    }
    if (visibleMax >= totalSteps) {
      animDone.current = true;
      return;
    }
    const t = setTimeout(() => {
      setVisibleMax((v) => Math.min(v + stepBatch, totalSteps));
    }, stepDelayMs);
    return () => clearTimeout(t);
  }, [
    svgPrepared,
    inView,
    visibleMax,
    totalSteps,
    stepBatch,
    stepDelayMs,
  ]);

  return (
    <div
      ref={wrapRef}
      className={`${styles.wrap} ${className}`.trim()}
      role="img"
      aria-label={ariaLabel}
    >
      <div
        className={`${styles.hostClip} ${svgPrepared ? styles.hostClipVisible : ''}`.trim()}
      >
        <div
          ref={hostRef}
          className={styles.svgInner}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={svgHtmlPayload}
        />
      </div>
    </div>
  );
}
