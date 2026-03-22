'use client';

import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  ANIM_SEQUENCE,
  BUILTIN_FLOWCHART_CONFIG,
  buildEdgeGeometry,
} from './flowchartConfig';
import styles from './JobApplicationWorkflow.module.css';

const NS = 'http://www.w3.org/2000/svg';

const TOTAL_STEPS = ANIM_SEQUENCE.length;

function addArrowHead(rc, group, x1, y1, x2, y2, headSize, arrowHeadOpts) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x2 - ux * 4;
  const by = y2 - uy * 4;
  const px = -uy;
  const py = ux;
  const h1 = rc.line(
    x2,
    y2,
    bx + px * (headSize / 2),
    by + py * (headSize / 2),
    arrowHeadOpts
  );
  const h2 = rc.line(
    x2,
    y2,
    bx - px * (headSize / 2),
    by - py * (headSize / 2),
    arrowHeadOpts
  );
  group.appendChild(h1);
  group.appendChild(h2);
}

function drawArrow(rc, group, x1, y1, x2, y2, arrowOpts, arrowHeadOpts) {
  const line = rc.line(x1, y1, x2, y2, arrowOpts);
  group.appendChild(line);
  addArrowHead(rc, group, x1, y1, x2, y2, 6, arrowHeadOpts);
}

function drawLabeledEdge(
  rc,
  group,
  geom,
  label,
  labelSide,
  textFill,
  fontStack,
  arrowOpts,
  arrowHeadOpts
) {
  const { x1, y1, x2, y2 } = geom;
  drawArrow(rc, group, x1, y1, x2, y2, arrowOpts, arrowHeadOpts);
  if (label) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', String(mx));
    t.setAttribute(
      'y',
      String(labelSide === 'above' ? my - 6 : my + 12)
    );
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('fill', textFill);
    t.setAttribute('font-size', '8');
    t.setAttribute('font-family', fontStack);
    t.setAttribute('class', 'pointer-events-none select-none');
    t.textContent = label;
    group.appendChild(t);
  }
}

function drawNodeBox(rc, group, id, ctx) {
  const n = ctx.nodes[id];
  if (!n) return;
  const boxOpts = {
    ...ctx.boxOpts,
    ...(n.boxStroke != null && n.boxStroke !== ''
      ? { stroke: n.boxStroke }
      : {}),
    ...(n.boxFill != null && n.boxFill !== '' ? { fill: n.boxFill } : {}),
  };
  const rect = rc.rectangle(n.x, n.y, n.w, n.h, boxOpts);
  group.appendChild(rect);
  const fs = n.fontSize ?? 10;
  const lineHeight = fs * 1.15;
  const startY =
    n.y + n.h / 2 - ((n.lines.length - 1) * lineHeight) / 2 + fs * 0.28;
  n.lines.forEach((line, i) => {
    const text = document.createElementNS(NS, 'text');
    text.setAttribute('x', String(n.x + n.w / 2));
    text.setAttribute('y', String(startY + i * lineHeight));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', ctx.textFill);
    text.setAttribute('font-size', String(fs));
    text.setAttribute('font-family', ctx.fontStack);
    text.setAttribute('class', 'pointer-events-none select-none');
    text.textContent = line;
    group.appendChild(text);
  });
}

function drawWaitChain(rc, group, edgeGeom, ctx) {
  drawNodeBox(rc, group, 'wait1', ctx);
  drawNodeBox(rc, group, 'wait2', ctx);
  drawNodeBox(rc, group, 'wait3', ctx);
  drawNodeBox(rc, group, 'rejected', ctx);
  const g12 = edgeGeom.e_wait12();
  drawArrow(
    rc,
    group,
    g12.x1,
    g12.y1,
    g12.x2,
    g12.y2,
    ctx.arrowOpts,
    ctx.arrowHeadOpts
  );
  const g23 = edgeGeom.e_wait23();
  drawArrow(
    rc,
    group,
    g23.x1,
    g23.y1,
    g23.x2,
    g23.y2,
    ctx.arrowOpts,
    ctx.arrowHeadOpts
  );
  const g3r = edgeGeom.e_wait3_rejected();
  drawArrow(
    rc,
    group,
    g3r.x1,
    g3r.y1,
    g3r.x2,
    g3r.y2,
    ctx.arrowOpts,
    ctx.arrowHeadOpts
  );
}

function applyStepVisibility(stylesObj, maxVisible) {
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const el = document.getElementById(`flow-step-${i}`);
    if (!el) continue;
    if (i <= maxVisible) {
      el.classList.add(stylesObj.flowStepVisible);
    } else {
      el.classList.remove(stylesObj.flowStepVisible);
    }
  }
}

/**
 * @param {object} [props]
 * @param {string} [props.className]
 * @param {ReturnType<typeof import('./flowchartConfig').cloneDefaultFlowchartConfig>} [props.flowchartConfig] — live config from editor; omit to use built-in defaults
 * @param {number} [props.configRevision] — bump when `flowchartConfig` mutates in place so Rough redraws
 * @param {boolean} [props.skipInViewAnimation] — show full diagram immediately (e.g. editor preview)
 */
export default function JobApplicationWorkflow({
  className = '',
  flowchartConfig = null,
  configRevision = 0,
  skipInViewAnimation = false,
}) {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const animationDoneRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const [visibleMax, setVisibleMax] = useState(0);
  const [layoutTick, setLayoutTick] = useState(0);
  const [roughReady, setRoughReady] = useState(0);

  const activeCfg = flowchartConfig ?? BUILTIN_FLOWCHART_CONFIG;
  const viewW = activeCfg.viewW;
  const viewH = activeCfg.viewH;

  const inView = useInView(wrapRef, { once: true, margin: '-12% 0px' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    reducedMotionRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => setLayoutTick((t) => t + 1));
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  /** Full Rough.js redraw */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const resolved = flowchartConfig ?? BUILTIN_FLOWCHART_CONFIG;
    const ctx = {
      nodes: resolved.nodes,
      boxOpts: resolved.boxOpts,
      arrowOpts: resolved.arrowOpts,
      arrowHeadOpts: resolved.arrowHeadOpts,
      textFill: resolved.textFill,
      fontStack: resolved.fontStack,
    };
    const edgeGeom = buildEdgeGeometry(resolved.nodes);

    let cancelled = false;
    (async () => {
      const rough = (await import('roughjs')).default;
      if (cancelled) return;
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const rc = rough.svg(svg);
      let stepIdx = 1;
      for (const item of ANIM_SEQUENCE) {
        const g = document.createElementNS(NS, 'g');
        g.id = `flow-step-${stepIdx}`;
        g.setAttribute('class', styles.flowStep);

        if (item.kind === 'node') {
          drawNodeBox(rc, g, item.id, ctx);
        } else if (item.kind === 'edge') {
          const geomFn = edgeGeom[item.key];
          if (geomFn) {
            const geom = geomFn();
            if (item.label) {
              drawLabeledEdge(
                rc,
                g,
                geom,
                item.label,
                'above',
                ctx.textFill,
                ctx.fontStack,
                ctx.arrowOpts,
                ctx.arrowHeadOpts
              );
            } else {
              drawArrow(
                rc,
                g,
                geom.x1,
                geom.y1,
                geom.x2,
                geom.y2,
                ctx.arrowOpts,
                ctx.arrowHeadOpts
              );
            }
          }
        } else if (item.kind === 'group' && item.key === 'g_wait_chain') {
          drawWaitChain(rc, g, edgeGeom, ctx);
        }

        svg.appendChild(g);
        stepIdx += 1;
      }
      setRoughReady((n) => n + 1);
    })();

    return () => {
      cancelled = true;
    };
  }, [layoutTick, configRevision, flowchartConfig]);

  /** After redraw or step change, sync visibility */
  useEffect(() => {
    if (roughReady === 0) return;
    const max =
      skipInViewAnimation ||
      reducedMotionRef.current ||
      animationDoneRef.current ||
      visibleMax >= TOTAL_STEPS
        ? TOTAL_STEPS
        : visibleMax;
    applyStepVisibility(styles, max);
  }, [roughReady, visibleMax, skipInViewAnimation]);

  useEffect(() => {
    if (skipInViewAnimation) {
      setVisibleMax(TOTAL_STEPS);
      animationDoneRef.current = true;
    }
  }, [skipInViewAnimation]);

  useEffect(() => {
    if (skipInViewAnimation || !inView || animationDoneRef.current) return;
    if (reducedMotionRef.current) {
      setVisibleMax(TOTAL_STEPS);
      animationDoneRef.current = true;
      return;
    }
    if (visibleMax >= TOTAL_STEPS) {
      animationDoneRef.current = true;
      return;
    }
    const delayMs = 300;
    const t = window.setTimeout(() => {
      setVisibleMax((v) => Math.min(v + 1, TOTAL_STEPS));
    }, delayMs);
    return () => clearTimeout(t);
  }, [inView, visibleMax, skipInViewAnimation]);

  useEffect(() => {
    if (visibleMax >= TOTAL_STEPS) {
      animationDoneRef.current = true;
    }
  }, [visibleMax]);

  return (
    <div
      ref={wrapRef}
      className={`${styles.wrap} ${className}`.trim()}
      role="img"
      aria-label="Animated diagram of a job application routine from finding a listing through applying, waiting, and outcomes."
    >
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      />
    </div>
  );
}
