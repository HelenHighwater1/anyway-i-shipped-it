'use client';

import { useCallback, useMemo, useState } from 'react';
import JobApplicationWorkflow from '@/components/flowchart/JobApplicationWorkflow';
import {
  NODE_IDS,
  NODE_LABELS,
  cloneDefaultFlowchartConfig,
} from '@/components/flowchart/flowchartConfig';
import styles from './editor.module.css';

function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function buildExportSnippet(config) {
  const lines = [
    '// Paste into components/flowchart/flowchartConfig.js',
    '// Replace DEFAULT_VIEW_*, DEFAULT_BOX_OPTS, arrow opts, text/font, and DEFAULT_NODES.',
    '',
    `export const DEFAULT_VIEW_W = ${config.viewW};`,
    `export const DEFAULT_VIEW_H = ${config.viewH};`,
    '',
    `export const DEFAULT_BOX_OPTS = ${JSON.stringify(config.boxOpts, null, 2)};`,
    '',
    `export const DEFAULT_ARROW_OPTS = ${JSON.stringify(config.arrowOpts, null, 2)};`,
    '',
    `export const DEFAULT_ARROW_HEAD_OPTS = ${JSON.stringify(config.arrowHeadOpts, null, 2)};`,
    '',
    `export const FLOWCHART_TEXT_FILL = ${JSON.stringify(config.textFill)};`,
    `export const FLOWCHART_FONT_STACK = ${JSON.stringify(config.fontStack)};`,
    '',
    `export const DEFAULT_NODES = ${JSON.stringify(config.nodes, null, 2)};`,
    '',
  ];
  return lines.join('\n');
}

export default function FlowchartEditorClient() {
  const [config, setConfig] = useState(() => cloneDefaultFlowchartConfig());
  const [configRevision, setConfigRevision] = useState(0);
  const [linesMountKey, setLinesMountKey] = useState(0);
  const [exportText, setExportText] = useState('');
  const [copied, setCopied] = useState(false);

  const bump = useCallback(() => {
    setConfigRevision((r) => r + 1);
  }, []);

  const patchGlobal = useCallback(
    (partial) => {
      setConfig((c) => ({ ...c, ...partial }));
      bump();
    },
    [bump]
  );

  const patchBoxOpts = useCallback(
    (partial) => {
      setConfig((c) => ({ ...c, boxOpts: { ...c.boxOpts, ...partial } }));
      bump();
    },
    [bump]
  );

  const patchArrowOpts = useCallback(
    (partial) => {
      setConfig((c) => ({ ...c, arrowOpts: { ...c.arrowOpts, ...partial } }));
      bump();
    },
    [bump]
  );

  const patchArrowHeadOpts = useCallback(
    (partial) => {
      setConfig((c) => ({
        ...c,
        arrowHeadOpts: { ...c.arrowHeadOpts, ...partial },
      }));
      bump();
    },
    [bump]
  );

  const patchNode = useCallback(
    (id, partial) => {
      setConfig((c) => ({
        ...c,
        nodes: {
          ...c.nodes,
          [id]: { ...c.nodes[id], ...partial },
        },
      }));
      bump();
    },
    [bump]
  );

  const handleLinesBlur = useCallback(
    (id, text) => {
      const raw = text.split('\n').map((s) => s.trimEnd());
      patchNode(id, { lines: raw });
    },
    [patchNode]
  );

  const handleReset = useCallback(() => {
    setConfig(cloneDefaultFlowchartConfig());
    setConfigRevision((r) => r + 1);
    setLinesMountKey((k) => k + 1);
    setExportText('');
    setCopied(false);
  }, []);

  const handleCopySnippet = useCallback(() => {
    const snippet = buildExportSnippet(config);
    setExportText(snippet);
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(snippet).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      });
    }
  }, [config]);

  const preview = useMemo(
    () => (
      <JobApplicationWorkflow
        flowchartConfig={config}
        configRevision={configRevision}
        skipInViewAnimation
      />
    ),
    [config, configRevision]
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Flowchart visual editor</h1>
        <p className={styles.lede}>
          Dev-only. Tweak view size, global colors, and each node&apos;s
          position, size, font, and lines. Live preview updates as you edit.
          Copy the generated snippet into{' '}
          <code>components/flowchart/flowchartConfig.js</code> to ship changes.
        </p>
      </header>

      <div className={styles.layout}>
        <div className={styles.panel}>
          <h2>Canvas &amp; globals</h2>
          <div className={styles.fieldGrid}>
            <label className={styles.label}>
              <span>View width</span>
              <input
                className={styles.input}
                type="number"
                value={config.viewW}
                onChange={(e) =>
                  patchGlobal({ viewW: num(e.target.value, config.viewW) })
                }
              />
            </label>
            <label className={styles.label}>
              <span>View height</span>
              <input
                className={styles.input}
                type="number"
                value={config.viewH}
                onChange={(e) =>
                  patchGlobal({ viewH: num(e.target.value, config.viewH) })
                }
              />
            </label>
          </div>

          <div className={styles.nodeBlock}>
            <h3 className={styles.nodeTitle}>Box (default)</h3>
            <div className={styles.fieldGridTriplet}>
              <label className={styles.label}>
                <span>Stroke</span>
                <input
                  className={styles.input}
                  type="text"
                  value={config.boxOpts.stroke}
                  onChange={(e) =>
                    patchBoxOpts({ stroke: e.target.value })
                  }
                />
              </label>
              <label className={styles.label}>
                <span>Fill</span>
                <input
                  className={styles.input}
                  type="text"
                  value={config.boxOpts.fill}
                  onChange={(e) => patchBoxOpts({ fill: e.target.value })}
                />
              </label>
              <label className={styles.label}>
                <span>Stroke width</span>
                <input
                  className={styles.input}
                  type="number"
                  step="0.1"
                  value={config.boxOpts.strokeWidth}
                  onChange={(e) =>
                    patchBoxOpts({
                      strokeWidth: num(e.target.value, config.boxOpts.strokeWidth),
                    })
                  }
                />
              </label>
            </div>
            <div className={`${styles.fieldGrid} ${styles.nodeBlock}`}>
              <label className={styles.label}>
                <span>Roughness</span>
                <input
                  className={styles.input}
                  type="number"
                  step="0.1"
                  value={config.boxOpts.roughness}
                  onChange={(e) =>
                    patchBoxOpts({
                      roughness: num(e.target.value, config.boxOpts.roughness),
                    })
                  }
                />
              </label>
              <label className={styles.label}>
                <span>Bowing</span>
                <input
                  className={styles.input}
                  type="number"
                  step="0.1"
                  value={config.boxOpts.bowing}
                  onChange={(e) =>
                    patchBoxOpts({
                      bowing: num(e.target.value, config.boxOpts.bowing),
                    })
                  }
                />
              </label>
            </div>
          </div>

          <div className={styles.nodeBlock}>
            <h3 className={styles.nodeTitle}>Arrows</h3>
            <div className={styles.fieldGrid}>
              <label className={styles.label}>
                <span>Line stroke</span>
                <input
                  className={styles.input}
                  type="text"
                  value={config.arrowOpts.stroke}
                  onChange={(e) =>
                    patchArrowOpts({ stroke: e.target.value })
                  }
                />
              </label>
              <label className={styles.label}>
                <span>Line width</span>
                <input
                  className={styles.input}
                  type="number"
                  step="0.1"
                  value={config.arrowOpts.strokeWidth}
                  onChange={(e) =>
                    patchArrowOpts({
                      strokeWidth: num(
                        e.target.value,
                        config.arrowOpts.strokeWidth
                      ),
                    })
                  }
                />
              </label>
              <label className={styles.label}>
                <span>Head stroke</span>
                <input
                  className={styles.input}
                  type="text"
                  value={config.arrowHeadOpts.stroke}
                  onChange={(e) =>
                    patchArrowHeadOpts({ stroke: e.target.value })
                  }
                />
              </label>
              <label className={styles.label}>
                <span>Head width</span>
                <input
                  className={styles.input}
                  type="number"
                  step="0.1"
                  value={config.arrowHeadOpts.strokeWidth}
                  onChange={(e) =>
                    patchArrowHeadOpts({
                      strokeWidth: num(
                        e.target.value,
                        config.arrowHeadOpts.strokeWidth
                      ),
                    })
                  }
                />
              </label>
            </div>
          </div>

          <div className={styles.nodeBlock}>
            <h3 className={styles.nodeTitle}>Labels</h3>
            <div className={styles.fieldGrid}>
              <label className={styles.label}>
                <span>Text color</span>
                <input
                  className={styles.input}
                  type="text"
                  value={config.textFill}
                  onChange={(e) => patchGlobal({ textFill: e.target.value })}
                />
              </label>
              <label className={styles.label}>
                <span>Font stack (CSS)</span>
                <input
                  className={styles.input}
                  type="text"
                  value={config.fontStack}
                  onChange={(e) => patchGlobal({ fontStack: e.target.value })}
                />
              </label>
            </div>
          </div>

          {NODE_IDS.map((id) => {
            const n = config.nodes[id];
            const title = NODE_LABELS[id] ?? id;
            return (
              <section key={id} className={styles.nodeBlock}>
                <h3 className={styles.nodeTitle}>{title}</h3>
                <div className={styles.fieldGridTriplet}>
                  <label className={styles.label}>
                    <span>x</span>
                    <input
                      className={styles.input}
                      type="number"
                      value={n.x}
                      onChange={(e) =>
                        patchNode(id, { x: num(e.target.value, n.x) })
                      }
                    />
                  </label>
                  <label className={styles.label}>
                    <span>y</span>
                    <input
                      className={styles.input}
                      type="number"
                      value={n.y}
                      onChange={(e) =>
                        patchNode(id, { y: num(e.target.value, n.y) })
                      }
                    />
                  </label>
                  <label className={styles.label}>
                    <span>Font size</span>
                    <input
                      className={styles.input}
                      type="number"
                      step="0.5"
                      value={n.fontSize ?? 10}
                      onChange={(e) =>
                        patchNode(id, {
                          fontSize: num(e.target.value, n.fontSize ?? 10),
                        })
                      }
                    />
                  </label>
                  <label className={styles.label}>
                    <span>w</span>
                    <input
                      className={styles.input}
                      type="number"
                      value={n.w}
                      onChange={(e) =>
                        patchNode(id, { w: num(e.target.value, n.w) })
                      }
                    />
                  </label>
                  <label className={styles.label}>
                    <span>h</span>
                    <input
                      className={styles.input}
                      type="number"
                      value={n.h}
                      onChange={(e) =>
                        patchNode(id, { h: num(e.target.value, n.h) })
                      }
                    />
                  </label>
                </div>
                <label className={styles.label} style={{ marginTop: '0.5rem' }}>
                  <span>Lines (one per line)</span>
                  <textarea
                    className={styles.textarea}
                    defaultValue={n.lines.join('\n')}
                    key={`${id}-${linesMountKey}`}
                    onBlur={(e) => handleLinesBlur(id, e.target.value)}
                  />
                </label>
                <div className={styles.fieldGrid} style={{ marginTop: '0.5rem' }}>
                  <label className={styles.label}>
                    <span>Override box stroke (optional)</span>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="(default)"
                      value={n.boxStroke ?? ''}
                      onChange={(e) =>
                        patchNode(id, {
                          boxStroke: e.target.value || undefined,
                        })
                      }
                    />
                  </label>
                  <label className={styles.label}>
                    <span>Override box fill (optional)</span>
                    <input
                      className={styles.input}
                      type="text"
                      placeholder="(default)"
                      value={n.boxFill ?? ''}
                      onChange={(e) =>
                        patchNode(id, {
                          boxFill: e.target.value || undefined,
                        })
                      }
                    />
                  </label>
                </div>
              </section>
            );
          })}

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleCopySnippet}
            >
              {copied ? 'Copied!' : 'Copy config snippet'}
            </button>
            <button type="button" className={styles.btn} onClick={handleReset}>
              Reset to defaults
            </button>
          </div>
          {exportText ? (
            <>
              <p className={styles.hint}>
                Snippet also appears below — select all if clipboard was
                blocked.
              </p>
              <textarea
                className={`${styles.textarea} ${styles.copyOut}`}
                readOnly
                value={exportText}
                onFocus={(e) => e.target.select()}
              />
            </>
          ) : null}
        </div>

        <div className={`${styles.panel} ${styles.previewSticky}`}>
          <h2>Preview</h2>
          <div className={styles.previewBox}>{preview}</div>
          <p className={styles.hint}>
            Arrows follow node positions automatically. Animation is off here so
            you can see the full graph.
          </p>
        </div>
      </div>
    </div>
  );
}
