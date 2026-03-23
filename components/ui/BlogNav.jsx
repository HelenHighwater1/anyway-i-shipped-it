'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import styles from './BlogNav.module.css';

/** Matches globals / BLOG_STANDARDS.md accent tokens */
const ACCENT = {
  blue: {
    stroke: '#4a90d9',
    idleFill: 'rgba(74, 144, 217, 0.14)',
    hoverFill: 'rgba(74, 144, 217, 0.24)',
    activeFill: 'rgba(74, 144, 217, 0.32)',
  },
  green: {
    stroke: '#6ba368',
    idleFill: 'rgba(107, 163, 104, 0.14)',
    hoverFill: 'rgba(107, 163, 104, 0.24)',
    activeFill: 'rgba(107, 163, 104, 0.32)',
  },
  amber: {
    stroke: '#d4a843',
    idleFill: 'rgba(212, 168, 67, 0.16)',
    hoverFill: 'rgba(212, 168, 67, 0.26)',
    activeFill: 'rgba(212, 168, 67, 0.34)',
  },
};

const ARROW_STROKE = '#b0aeaa';
const PANEL_FILL = 'rgba(255, 255, 255, 0.78)';

/** Per-label box widths so longer copy fits (portfolio used fixed 90×38) */
const NODES = [
  {
    id: 'home',
    label: 'home',
    kind: 'route',
    href: '/',
    boxW: { desktop: 80, mobile: 62 },
    accent: ACCENT.blue,
  },
  {
    id: 'posts',
    label: 'all posts',
    kind: 'route',
    href: '/posts',
    boxW: { desktop: 106, mobile: 82 },
    accent: ACCENT.green,
  },
  {
    id: 'portfolio',
    label: 'heyimhelen.com',
    kind: 'external',
    href: 'https://heyimhelen.com',
    boxW: { desktop: 176, mobile: 118 },
    accent: ACCENT.amber,
  },
];

export default function BlogNav({ className = '' }) {
  const pathname = usePathname();
  const router = useRouter();
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const normalizedPath = pathname === '' ? '/' : pathname;
  const pathRef = useRef(normalizedPath);
  pathRef.current = normalizedPath;
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return;

    let cancelled = false;

    const draw = async () => {
      const rough = (await import('roughjs')).default;
      if (cancelled) return;

      const currentPath = pathRef.current;
      const currentRouter = routerRef.current;
      const containerWidth = container.offsetWidth;
      const isMobile = containerWidth < 500;

      const boxH = isMobile ? 34 : 42;
      const arrowLen = isMobile ? 26 : 44;
      const svgH = boxH + 18;
      const cy = svgH / 2;

      let totalW = 0;
      const widths = NODES.map((n) =>
        isMobile ? n.boxW.mobile : n.boxW.desktop
      );
      for (let i = 0; i < NODES.length; i++) {
        totalW += widths[i];
        if (i < NODES.length - 1) totalW += arrowLen;
      }

      const offsetX = Math.max(0, (containerWidth - totalW) / 2);

      svg.setAttribute('width', String(containerWidth));
      svg.setAttribute('height', String(svgH));
      svg.setAttribute('viewBox', `0 0 ${containerWidth} ${svgH}`);

      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const rc = rough.svg(svg);

      const isHomeActive = currentPath === '/';
      const isPostsIndexActive = currentPath === '/posts';

      let x = offsetX;

      NODES.forEach((node, i) => {
        const boxW = widths[i];
        const isActive =
          (node.id === 'home' && isHomeActive) ||
          (node.id === 'posts' && isPostsIndexActive);
        const { stroke, idleFill, hoverFill, activeFill } = node.accent;

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.style.transition = 'transform 0.12s ease';

        const hoverBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        hoverBg.setAttribute('x', String(x));
        hoverBg.setAttribute('y', String(cy - boxH / 2));
        hoverBg.setAttribute('width', String(boxW));
        hoverBg.setAttribute('height', String(boxH));
        hoverBg.setAttribute('rx', '4');
        hoverBg.setAttribute('fill', isActive ? idleFill : hoverFill);
        hoverBg.setAttribute('opacity', isActive ? '1' : '0');
        hoverBg.style.transition = 'opacity 0.15s ease';
        group.appendChild(hoverBg);

        const rect = rc.rectangle(x, cy - boxH / 2, boxW, boxH, {
          stroke,
          strokeWidth: isActive ? 2.2 : 1.5,
          roughness: 1.0,
          bowing: 1.5,
          fill: isActive ? idleFill : PANEL_FILL,
          fillStyle: 'solid',
        });
        group.appendChild(rect);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', String(x + boxW / 2));
        text.setAttribute('y', String(cy + (isMobile ? 4.5 : 5.5)));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', stroke);
        text.setAttribute('font-size', isMobile ? '11' : '15');
        text.setAttribute(
          'font-family',
          "Virgil, 'Segoe Print', 'Comic Sans MS', cursive"
        );
        text.setAttribute('class', 'pointer-events-none select-none');
        text.textContent = node.label;
        group.appendChild(text);

        const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        hitArea.setAttribute('x', String(x));
        hitArea.setAttribute('y', String(cy - boxH / 2));
        hitArea.setAttribute('width', String(boxW));
        hitArea.setAttribute('height', String(boxH));
        hitArea.setAttribute('fill', 'transparent');
        hitArea.setAttribute('class', 'cursor-pointer');
        hitArea.setAttribute('role', 'link');
        hitArea.setAttribute('tabindex', '0');

        const navigate = () => {
          if (node.kind === 'route') {
            currentRouter.push(node.href);
          } else if (node.kind === 'anchor') {
            const el = document.getElementById(node.elementId);
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else if (node.kind === 'external') {
            window.open(node.href, '_blank', 'noopener,noreferrer');
          }
        };

        hitArea.addEventListener('click', navigate);
        hitArea.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate();
          }
        });
        hitArea.addEventListener('mouseenter', () => {
          if (!isActive) {
            group.style.transform = 'translateY(-2px)';
            hoverBg.setAttribute('opacity', '1');
          }
        });
        hitArea.addEventListener('mouseleave', () => {
          group.style.transform = '';
          if (!isActive) {
            hoverBg.setAttribute('opacity', '0');
          }
        });
        group.appendChild(hitArea);

        svg.appendChild(group);

        if (i < NODES.length - 1) {
          const arrowStartX = x + boxW + 2;
          const arrowEndX = arrowStartX + arrowLen - 4;
          const arrowY = cy;

          const line = rc.line(arrowStartX, arrowY, arrowEndX, arrowY, {
            stroke: ARROW_STROKE,
            strokeWidth: 1.5,
            roughness: 0.8,
          });
          svg.appendChild(line);

          const headSize = isMobile ? 5 : 7;
          const ah1 = rc.line(
            arrowEndX,
            arrowY,
            arrowEndX - headSize,
            arrowY - headSize / 1.5,
            { stroke: ARROW_STROKE, strokeWidth: 1.5, roughness: 0.6 }
          );
          const ah2 = rc.line(
            arrowEndX,
            arrowY,
            arrowEndX - headSize,
            arrowY + headSize / 1.5,
            { stroke: ARROW_STROKE, strokeWidth: 1.5, roughness: 0.6 }
          );
          svg.appendChild(ah1);
          svg.appendChild(ah2);
          x += boxW + arrowLen;
        } else {
          x += boxW;
        }
      });
    };

    draw();

    const observer = new ResizeObserver(() => draw());
    observer.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [normalizedPath]);

  return (
    <nav
      ref={containerRef}
      className={[styles.nav, className].filter(Boolean).join(' ')}
      aria-label="Site navigation"
    >
      <svg ref={svgRef} className={styles.svg} />
    </nav>
  );
}
