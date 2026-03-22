/**
 * Single source of truth for job-application flowchart layout + style.
 * Edit here, or use /dev/flowchart-editor in development and paste exported output.
 */

export const DEFAULT_VIEW_W = 1000;
export const DEFAULT_VIEW_H = 320;

/** BLOG_STANDARDS - SketchBox-style; per-node boxStroke/boxFill optional */
export const DEFAULT_BOX_OPTS = {
  stroke: '#1e1e1e',
  strokeWidth: 1.5,
  roughness: 1.0,
  bowing: 1.2,
  fill: 'rgba(255, 255, 255, 0.45)',
  fillStyle: 'solid',
};

export const DEFAULT_ARROW_OPTS = {
  stroke: '#b0aeaa',
  strokeWidth: 1.5,
  roughness: 0.75,
};

export const DEFAULT_ARROW_HEAD_OPTS = {
  stroke: '#b0aeaa',
  strokeWidth: 1.5,
  roughness: 0.6,
};

export const FLOWCHART_FONT_STACK =
  "Virgil, 'Segoe Print', 'Comic Sans MS', cursive";
export const FLOWCHART_TEXT_FILL = '#333333';

/** @type {Record<string, { x: number; y: number; w: number; h: number; lines: string[]; fontSize?: number; boxStroke?: string; boxFill?: string }>} */
export const DEFAULT_NODES = {
  find: {
    x: 8,
    y: 26,
    w: 148,
    h: 44,
    lines: ['Find appropriate', 'job listing'],
    fontSize: 10,
  },
  trello: {
    x: 168,
    y: 22,
    w: 176,
    h: 52,
    lines: ['Add job link to Trello', '"Job Applications" board'],
    fontSize: 9,
  },
  apply: {
    x: 358,
    y: 34,
    w: 54,
    h: 30,
    lines: ['Apply'],
    fontSize: 11,
  },
  resume: {
    x: 188,
    y: 104,
    w: 140,
    h: 50,
    lines: [
      'Edit resume to best fit',
      'the job / optimize for',
      'filtering',
    ],
    fontSize: 8.5,
  },
  cover: {
    x: 342,
    y: 100,
    w: 144,
    h: 44,
    lines: ['Write job-specific,', 'genuine cover letter'],
    fontSize: 9,
  },
  notai: {
    x: 498,
    y: 100,
    w: 152,
    h: 48,
    lines: ['Include something obvious', "this wasn't just AI"],
    fontSize: 8.5,
  },
  husband: {
    x: 318,
    y: 168,
    w: 172,
    h: 42,
    lines: ['Husband says it reads as AI;', 'rewrite again'],
    fontSize: 8.5,
  },
  move: {
    x: 424,
    y: 20,
    w: 200,
    h: 54,
    lines: ['Move card from "to apply"', 'to "applied" in Trello'],
    fontSize: 9,
  },
  reject: {
    x: 652,
    y: 8,
    w: 148,
    h: 38,
    lines: ['Pretty quick rejection'],
    fontSize: 9,
  },
  wait1: { x: 642, y: 54, w: 42, h: 22, lines: ['Wait'], fontSize: 9 },
  wait2: { x: 694, y: 54, w: 42, h: 22, lines: ['Wait'], fontSize: 9 },
  wait3: { x: 746, y: 54, w: 42, h: 22, lines: ['Wait'], fontSize: 9 },
  rejected: {
    x: 800,
    y: 48,
    w: 188,
    h: 38,
    lines: ['After 6 weeks → move card', 'to "rejected" column'],
    fontSize: 8,
  },
  notes: {
    x: 436,
    y: 238,
    w: 188,
    h: 42,
    lines: ['Note unusual Q/A', 'in "notes" if any'],
    fontSize: 9,
  },
};

export const NODE_IDS = [
  'find',
  'trello',
  'apply',
  'resume',
  'cover',
  'notai',
  'husband',
  'move',
  'reject',
  'wait1',
  'wait2',
  'wait3',
  'rejected',
  'notes',
];

/** Human-readable section titles in the editor */
export const NODE_LABELS = {
  find: 'Find listing',
  trello: 'Trello “Job Applications”',
  apply: 'Apply',
  resume: 'Edit resume',
  cover: 'Cover letter',
  notai: 'Not-AI signal',
  husband: 'Husband feedback',
  move: 'Move card to applied',
  reject: 'Quick rejection',
  wait1: 'Wait 1',
  wait2: 'Wait 2',
  wait3: 'Wait 3',
  rejected: 'Rejected column',
  notes: 'Notes',
};

export const ANIM_SEQUENCE = [
  { kind: 'node', id: 'find' },
  { kind: 'edge', key: 'e_find_trello' },
  { kind: 'node', id: 'trello' },
  { kind: 'edge', key: 'e_trello_apply' },
  { kind: 'node', id: 'apply' },
  { kind: 'edge', key: 'e_apply_resume' },
  { kind: 'node', id: 'resume' },
  { kind: 'edge', key: 'e_apply_cover' },
  { kind: 'node', id: 'cover' },
  { kind: 'edge', key: 'e_cover_notai' },
  { kind: 'node', id: 'notai' },
  { kind: 'edge', key: 'e_apply_husband' },
  { kind: 'node', id: 'husband' },
  { kind: 'edge', key: 'e_apply_move' },
  { kind: 'node', id: 'move' },
  { kind: 'edge', key: 'e_move_reject', label: 'Either' },
  { kind: 'node', id: 'reject' },
  { kind: 'edge', key: 'e_move_wait', label: 'Or (more likely)' },
  { kind: 'group', key: 'g_wait_chain' },
  { kind: 'edge', key: 'e_move_notes' },
  { kind: 'node', id: 'notes' },
];

export const TOTAL_FLOWCHART_STEPS = ANIM_SEQUENCE.length;

function anchorNode(n, side) {
  const cx = n.x + n.w / 2;
  const cy = n.y + n.h / 2;
  switch (side) {
    case 'left':
      return { x: n.x, y: cy };
    case 'right':
      return { x: n.x + n.w, y: cy };
    case 'top':
      return { x: cx, y: n.y };
    case 'bottom':
      return { x: cx, y: n.y + n.h };
    default:
      return { x: cx, y: cy };
  }
}

/** Build edge geometry from current node positions (editor + runtime). */
export function buildEdgeGeometry(nodes) {
  return {
    e_find_trello: () => {
      const a = nodes.find;
      const b = nodes.trello;
      return {
        x1: a.x + a.w,
        y1: a.y + a.h / 2,
        x2: b.x,
        y2: b.y + b.h / 2,
      };
    },
    e_trello_apply: () => {
      const a = nodes.trello;
      const b = nodes.apply;
      return {
        x1: a.x + a.w,
        y1: a.y + a.h / 2,
        x2: b.x,
        y2: b.y + b.h / 2,
      };
    },
    e_apply_resume: () => {
      const p = anchorNode(nodes.apply, 'bottom');
      const t = anchorNode(nodes.resume, 'top');
      return { x1: p.x, y1: p.y, x2: t.x, y2: t.y };
    },
    e_apply_cover: () => {
      const p = anchorNode(nodes.apply, 'bottom');
      const t = anchorNode(nodes.cover, 'top');
      return { x1: p.x, y1: p.y, x2: t.x, y2: t.y };
    },
    e_cover_notai: () => {
      const a = nodes.cover;
      const b = nodes.notai;
      return {
        x1: a.x + a.w,
        y1: a.y + a.h / 2,
        x2: b.x,
        y2: b.y + b.h / 2,
      };
    },
    e_apply_husband: () => {
      const p = anchorNode(nodes.apply, 'bottom');
      const t = anchorNode(nodes.husband, 'top');
      return { x1: p.x, y1: p.y, x2: t.x, y2: t.y };
    },
    e_apply_move: () => {
      const a = nodes.apply;
      const b = nodes.move;
      return {
        x1: a.x + a.w,
        y1: a.y + a.h / 2,
        x2: b.x,
        y2: b.y + b.h / 2,
      };
    },
    e_move_reject: () => {
      const m = nodes.move;
      const r = nodes.reject;
      return {
        x1: m.x + m.w * 0.92,
        y1: m.y + m.h * 0.2,
        x2: r.x + r.w * 0.15,
        y2: r.y + r.h * 0.85,
      };
    },
    e_move_wait: () => {
      const m = nodes.move;
      const w = nodes.wait1;
      return {
        x1: m.x + m.w,
        y1: m.y + m.h * 0.55,
        x2: w.x,
        y2: w.y + w.h / 2,
      };
    },
    e_wait12: () => {
      const a = nodes.wait1;
      const b = nodes.wait2;
      return {
        x1: a.x + a.w,
        y1: a.y + a.h / 2,
        x2: b.x,
        y2: b.y + b.h / 2,
      };
    },
    e_wait23: () => {
      const a = nodes.wait2;
      const b = nodes.wait3;
      return {
        x1: a.x + a.w,
        y1: a.y + a.h / 2,
        x2: b.x,
        y2: b.y + b.h / 2,
      };
    },
    e_wait3_rejected: () => {
      const a = nodes.wait3;
      const b = nodes.rejected;
      return {
        x1: a.x + a.w,
        y1: a.y + a.h / 2,
        x2: b.x,
        y2: b.y + b.h / 2,
      };
    },
    e_move_notes: () => {
      const p = anchorNode(nodes.move, 'bottom');
      const t = anchorNode(nodes.notes, 'top');
      return { x1: p.x, y1: p.y, x2: t.x, y2: t.y };
    },
  };
}

export function cloneDefaultFlowchartConfig() {
  return {
    viewW: DEFAULT_VIEW_W,
    viewH: DEFAULT_VIEW_H,
    nodes: structuredClone(DEFAULT_NODES),
    boxOpts: { ...DEFAULT_BOX_OPTS },
    arrowOpts: { ...DEFAULT_ARROW_OPTS },
    arrowHeadOpts: { ...DEFAULT_ARROW_HEAD_OPTS },
    textFill: FLOWCHART_TEXT_FILL,
    fontStack: FLOWCHART_FONT_STACK,
  };
}

/** Frozen default for landing page (no parent config). */
export const BUILTIN_FLOWCHART_CONFIG = cloneDefaultFlowchartConfig();
